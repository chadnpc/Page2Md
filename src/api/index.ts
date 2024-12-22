#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.d.ts';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.d.ts';
import {
  CallToolRequest,
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
  Tool,
} from '@modelcontextprotocol/sdk/types.d.ts';
import axios from 'axios';

class UrlToMarkdownApi {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'urltomd-api',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();

    this.server.onerror = (error: Error) =>
      console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(
      ListToolsRequestSchema,
      async (): Promise<{ tools: Tool[] }> => ({
        tools: [
          {
            name: 'url_to_markdown',
            description: 'Converts a given URL to Markdown format',
            inputSchema: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  description: 'The URL to convert',
                },
              },
              required: ['url'],
            },
          },
          {
            name: 'get_documentation',
            description: 'Provides documentation for the API endpoints',
          },
        ],
      })
    );

    this.server.setRequestHandler(
      CallToolRequestSchema,
      async (request: CallToolRequest) => {
        if (request.params.name === 'url_to_markdown') {
          const url = request.params.arguments?.url;
          if (!url) {
            throw new McpError(ErrorCode.InvalidParams, 'URL is required');
          }
          try {
            const response = await axios.get(url);
            // Basic Markdown conversion (can be improved)
            const markdown = `# Content from ${url}\n\n${response.data}`;
            return {
              content: [{ type: 'text', text: markdown }],
            };
          } catch (error: unknown) {
            throw new McpError(
              ErrorCode.InternalError,
              `Failed to fetch URL: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`
            );
          }
        } else if (request.params.name === 'get_documentation') {
          const documentation = `# URL to Markdown API Documentation\n\n## Endpoints\n\n### url_to_markdown\n\nConverts a given URL to Markdown format.\n\n**Input:**\n\n\`\`\`json\n{\n  "url": "string" // The URL to convert\n}\n\`\`\`\n\n**Output:**\n\n\`\`\`\n# Content from [URL]\n\n[Content of the URL]\n\`\`\`\n\n### get_documentation\n\nProvides documentation for the API endpoints.\n\n**Output:**\n\nThis documentation.`;
          return {
            content: [{ type: 'text', text: documentation }],
          };
        }
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Tool ${request.params.name} not found`
        );
      }
    );
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('URL to Markdown API server running on stdio');
  }
}

const server = new UrlToMarkdownApi();
server.run().catch(console.error);
