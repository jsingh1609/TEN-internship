"use client";

import { useState } from "react";
import { DollarSign, Home, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { AnimatedNumber } from "./AnimatedNumber";

export function PredictionForm() {
  const [sqft, setSqft] = useState(1500);
  const [bedrooms, setBedrooms] = useState([3]);
  const [bathrooms, setBathrooms] = useState([2]);
  const [yearBuilt, setYearBuilt] = useState(2005);
  
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getPrediction = async (features: {
    sqft: number;
    bedrooms: number;
    bathrooms: number;
    yearBuilt: number;
  }) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const basePrice = 50000;
    const sqftPrice = features.sqft * 150;
    const bedroomsPrice = features.bedrooms * 25000;
    const bathroomsPrice = features.bathrooms * 15000;
    const ageFactor = (features.yearBuilt - 1980) * 1000;
    const price = basePrice + sqftPrice + bedroomsPrice + bathroomsPrice + ageFactor;
    const noise = (Math.random() - 0.5) * 2 * 5000;
    const finalPrice = Math.round((price + noise) / 1000) * 1000;
    return Math.max(80000, finalPrice);
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPredictedPrice(null);

    const price = await getPrediction({
      sqft,
      bedrooms: bedrooms[0],
      bathrooms: bathrooms[0],
      yearBuilt,
    });
    
    setPredictedPrice(price);
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto glassmorphism">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
             <Home className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">House Price Predictor</CardTitle>
            <CardDescription>Estimate a property's value instantly.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <form onSubmit={handlePredict}>
        <CardContent className="space-y-6 pt-2">
          <div className="grid gap-2">
            <Label htmlFor="sqft">Area (sq. ft.)</Label>
            <Input id="sqft" type="number" value={sqft} onChange={e => setSqft(Number(e.target.value))} placeholder="e.g., 1500" required />
          </div>

          <div className="grid gap-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <span className="text-sm font-semibold w-9 text-center py-1 px-2 rounded-md bg-muted text-muted-foreground tabular-nums">{bedrooms[0]}</span>
            </div>
            <Slider id="bedrooms" min={1} max={8} step={1} value={bedrooms} onValueChange={setBedrooms} />
          </div>
          
          <div className="grid gap-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <span className="text-sm font-semibold w-9 text-center py-1 px-2 rounded-md bg-muted text-muted-foreground tabular-nums">{bathrooms[0]}</span>
            </div>
            <Slider id="bathrooms" min={1} max={5} step={1} value={bathrooms} onValueChange={setBathrooms} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="year-built">Year Built</Label>
            <Input id="year-built" type="number" value={yearBuilt} onChange={e => setYearBuilt(Number(e.target.value))} placeholder="e.g., 2005" required />
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-4">
          <motion.div className="w-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button type="submit" className="w-full h-12 text-lg font-semibold" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <DollarSign className="mr-2 h-5 w-5" />}
              {isLoading ? 'Analyzing...' : 'Predict Price'}
            </Button>
          </motion.div>
          <AnimatePresence>
            {predictedPrice !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="w-full text-center p-4 mt-2 bg-primary/10 rounded-lg"
              >
                <p className="text-sm text-muted-foreground">Estimated Value</p>
                <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                  <span className="mr-1">$</span>
                  <AnimatedNumber value={predictedPrice} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardFooter>
      </form>
    </Card>
  );
}
