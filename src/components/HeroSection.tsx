import { Button } from "@/components/ui/button";
import { Check, Car, Smartphone, Zap } from "lucide-react";
import heroImage from "@/assets/hero-car-inspection.jpg";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Side - Hero Text */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="hero-text">
                AI-Powered
                <br />
                Car Problem
                <br />
                Detection
              </h1>
              
              <p className="subheading-text text-muted-foreground max-w-lg">
                Advanced machine learning technology that detects car damage, 
                dirt, and issues instantly for superior customer service.
              </p>
              
              <p className="body-text text-muted-foreground max-w-md">
                Transform your inspection process with precision AI analysis. 
                Improve accuracy, reduce human error, and deliver exceptional 
                service to your customers.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Free Trial
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Watch Demo
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="space-y-4 pt-8">
              <div className="flex items-center gap-3 text-sm">
                <Check className="h-5 w-5 text-primary" />
                <span>99.7% Accuracy Rate</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Car className="h-5 w-5 text-primary" />
                <span>Supports All Vehicle Types</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Smartphone className="h-5 w-5 text-primary" />
                <span>Mobile & Web Compatible</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Zap className="h-5 w-5 text-primary" />
                <span>Instant Results in Seconds</span>
              </div>
            </div>
          </div>
          
          {/* Right Side - Hero Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl">
              <img 
                src={heroImage} 
                alt="AI-powered car inspection technology analyzing vehicle damage and condition" 
                className="w-full h-auto object-cover"
              />
              
              {/* Subtle overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>
            
            {/* Floating accuracy badge */}
            <div className="absolute -bottom-6 -left-6 bg-background border-2 border-primary rounded-2xl p-6 shadow-lg">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">99.7%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;