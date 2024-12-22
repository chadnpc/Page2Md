import TurndownService from 'turndown';

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced'
});

// Configure turndown to handle special cases
turndownService.addRule('removeStyles', {
  filter: ['style', 'script', 'noscript', 'iframe'],
  replacement: () => ''
});

// Clean the content before conversion
function cleanContent(html: string): string {
  // Remove style attributes
  html = html.replace(/ style="[^"]*"/g, '');
  // Remove class attributes
  html = html.replace(/ class="[^"]*"/g, '');
  // Remove data attributes
  html = html.replace(/ data-[^=]*="[^"]*"/g, '');
  return html;
}

export async function convertUrlToMarkdown(
  url: string, 
  includeTitle: boolean = false,
  ignoreLinks: boolean = false
): Promise<{ markdown: string; title: string }> {
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(proxyUrl);
    const data = await response.json();
    
    if (!data.contents) {
      throw new Error('Failed to fetch webpage content');
    }

    // Clean the HTML content
    const cleanedHtml = cleanContent(data.contents);

    // Create a temporary DOM element to parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(cleanedHtml, 'text/html');
    
    // Get page title
    const title = doc.title || '';
    
    // Configure turndown for links
    if (ignoreLinks) {
      turndownService.addRule('ignoreLinks', {
        filter: ['a'],
        replacement: (content) => content
      });
    }
    
    // Convert to markdown
    let markdown = turndownService.turndown(doc.body);
    
    // Add title if requested
    if (includeTitle && title) {
      markdown = `# ${title}\n\n${markdown}`;
    }
    
    return { 
      markdown,
      title
    };
  } catch (error) {
    console.error('Conversion error:', error);
    throw new Error('Failed to convert webpage to markdown');
  }
}