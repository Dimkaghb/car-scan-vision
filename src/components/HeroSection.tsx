import { Button } from "@/components/ui/button";
import { Check, Car, Smartphone, Zap } from "lucide-react";
import heroImage from "@/assets/hero-car-inspection.jpg";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center py-12">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Left Side - Hero Text */}
          <div className="space-y-6">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
              <Check className="h-3 w-3" />
              <span>Trusted by 500+ Service Centers</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="hero-text">
                AI-Powered Car
                <br />
                Problem Detection
              </h1>
              
              <p className="subheading-text text-muted-foreground max-w-lg">
                Advanced machine learning technology that instantly 
                detects car damage, dirt, and mechanical issues to 
                enhance customer service and inspection accuracy.
              </p>
              
              <p className="body-text text-muted-foreground max-w-md">
                Transform your inspection process with intelligent 
                damage assessment. Our AI analyzes vehicle 
                conditions in seconds, providing detailed reports that 
                improve customer trust and operational efficiency.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="px-6 py-2 text-sm font-medium">
                Start Free Trial
              </Button>
              <Button variant="ghost" className="px-6 py-2 text-sm font-medium">
                Watch Demo
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2 trust-text text-muted-foreground">
                <Zap className="h-4 w-4" />
                <span>AI-Powered Detection</span>
              </div>
              <div className="flex items-center gap-2 trust-text text-muted-foreground">
                <Car className="h-4 w-4" />
                <span>Damage Assessment</span>
              </div>
              <div className="flex items-center gap-2 trust-text text-muted-foreground">
                <Smartphone className="h-4 w-4" />
                <span>Instant Results</span>
              </div>
            </div>
          </div>
          
          {/* Right Side - Hero Image */}
          <div className="relative">
            {/* Scan time indicator */}
            <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm border rounded-lg px-3 py-2 z-10">
              <div className="text-right">
                <div className="text-lg font-bold">3s</div>
                <div className="text-xs text-muted-foreground">Avg. Scan Time</div>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-xl">
              <img 
                src={heroImage} 
                alt="AI-powered car inspection technology analyzing vehicle damage and condition" 
                className="w-full h-auto object-cover"
              />
            </div>
            
            {/* Floating accuracy badge */}
            <div className="absolute -bottom-3 -left-3 bg-background border rounded-lg px-4 py-3 shadow-sm">
              <div className="text-center">
                <div className="text-xl font-bold text-primary">99.2%</div>
                <div className="text-xs text-muted-foreground">Detection Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;