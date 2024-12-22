import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ConvertButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export const ConvertButton = ({ onClick, isLoading }: ConvertButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Converting...
        </>
      ) : (
        "Convert to Markdown"
      )}
    </Button>
  );
};