import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import Index from "./pages/Index";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const gradient = document.querySelector(".gradient") as HTMLElement;
      if (gradient) {
        const x = event.clientX / 10;
        const y = event.clientY / 10;
        gradient.style.setProperty("--x", `${x}px`);
        gradient.style.setProperty("--y", `${y}px`);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen relative flex justify-center items-center">
        <div className="gradient absolute inset-0 pointer-events-none"></div>
        <Index />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
