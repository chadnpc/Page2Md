import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface MarkdownOutputProps {
  markdown: string;
}

export const MarkdownOutput = ({ markdown }: MarkdownOutputProps) => {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setIsCopied(true);
      toast({
        title: "Copied!",
        description: "Markdown copied to clipboard",
      });
      setTimeout(() => {
        setIsCopied(false);
      }, 1500);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold">Markdown Output&ensp;<span>:&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;</span>
        <Button variant="outline" size="sm" onClick={copyToClipboard}>
          {isCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
          {isCopied ? "Copied!" : "Copy"}
        </Button>
      </div>
    </div>
    <Card className="glass w-full">
        <pre className="p-4 overflow-auto max-h-[500px] font-mono text-sm break-words">
          {markdown || "Converted markdown will appear here..."}
        </pre>
      </Card>
    </div>
  );
};
