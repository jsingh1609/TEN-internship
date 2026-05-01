import { ShaderBackground } from "@/components/ShaderBackground";
import { PredictionForm } from "@/components/PredictionForm";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4 overflow-hidden">
      <ShaderBackground />
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      <div className="z-10 w-full">
         <PredictionForm />
      </div>
    </main>
  );
}
