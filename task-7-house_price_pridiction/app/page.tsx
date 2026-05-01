import { ShaderBackground } from "@/components/ShaderBackground";
import { PredictionForm } from "@/components/PredictionForm";

export default function Home() {
  return (
    <>
      <ShaderBackground />
      <main className="relative z-10 flex flex-col items-center justify-center p-4 pt-24 md:pt-32">
        <PredictionForm />
      </main>
    </>
  );
}
