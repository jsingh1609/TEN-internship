import { ThemeToggle } from "@/components/ThemeToggle";
import { Home } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-20 border-b bg-background/50 backdrop-blur-sm">
      <nav className="container flex items-center justify-between p-4 mx-auto">
        <div className="flex items-center gap-2">
            <Home className="w-6 h-6 bg-gradient-to-r from-primary to-fuchsia-500 text-transparent bg-clip-text" />
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-fuchsia-500 bg-clip-text text-transparent">
                PricePredictor
            </h1>
        </div>
        <ThemeToggle />
      </nav>
    </header>
  );
}
