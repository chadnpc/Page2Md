import React, { useState } from "react";
import { AppSidebar } from "../components/ui/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";
import { Separator } from "../components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../components/ui/sidebar";
import { UrlInput } from "../components/UrlInput";
import { MarkdownOutput } from "../components/MarkdownOutput";
import { ConvertButton } from "../components/ConvertButton";
import { Card } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import { useToast } from "../components/ui/use-toast";
import { convertUrlToMarkdown } from "../lib/markdown-service";
import { Moon, Sun } from "lucide-react";
import { Button } from "../components/ui/button";
import { useTheme } from "next-themes";

const Index = () => {
  const [url, setUrl] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [includeTitle, setIncludeTitle] = useState(false);
  const [ignoreLinks, setIgnoreLinks] = useState(false);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const handleConvert = async () => {
    if (!url) {
      setError("Please enter a URL");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const { markdown } = await convertUrlToMarkdown(url, includeTitle, ignoreLinks);
      setMarkdown(markdown);

      toast({
        title: "Success!",
        description: "Website converted to markdown successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to convert website to markdown",
        variant: "destructive",
      });
      setError("Failed to convert webpage to markdown");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="gradient absolute inset-0 pointer-events-none"></div>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    url2md
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Home</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                url➭md
              </h1>
              <br />
              <p className="mt-2 text-muted-foreground">
                Convert any webpage to clean markdown format
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>

          <Card className="glass p-6 space-y-6 w-full">
            <UrlInput
              value={url}
              onChange={(value) => {
                setUrl(value);
                setError("");
              }}
              error={error}
            />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeTitle"
                  checked={includeTitle}
                  onCheckedChange={(checked) =>
                    setIncludeTitle(checked as boolean)
                  }
                />
                <Label htmlFor="includeTitle">Include Title</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ignoreLinks"
                  checked={ignoreLinks}
                  onCheckedChange={(checked) =>
                    setIgnoreLinks(checked as boolean)
                  }
                />
                <Label htmlFor="ignoreLinks">Ignore Links</Label>
              </div>
            </div>

            <ConvertButton onClick={handleConvert} isLoading={isLoading} />
          </Card>
          <MarkdownOutput markdown={markdown} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Index;
