import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UrlInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const UrlInput = ({ value, onChange, error }: UrlInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="url">Website URL</Label>
      <Input
        id="url"
        type="url"
        placeholder="https://example.com"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-background/50 ${error ? 'border-destructive' : ''}`}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};