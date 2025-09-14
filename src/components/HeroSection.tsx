  import { Button } from "@/components/ui/button";
  import { Check, Car, Smartphone, Zap } from "lucide-react";
  import heroImage from "@/assets/hero-car-inspection.jpg";

  const HeroSection = () => {
    return (
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left Side - Hero Text */}
            <div className="space-y-4">
              {/* Trust badge */}
              <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-muted px-2 py-1 bg-lime-50">
                <Check className="h-3 w-3" />
                <span>Trusted by 500+ Service Centers</span>
              </div>
              
              <div className="space-y-3">
                <h1 className="hero-text">
                Know Your <mark className="highlight"><span>Car</span></mark>,
                  <br />
                  <mark className="highlight"><span>Trust</span></mark> Your Ride
                </h1>
                
                <p className="subheading-text text-muted-foreground max-w-md">
                  Advanced machine learning technology that instantly 
                  detects car damage, dirt, and mechanical issues to 
                  enhance customer service and inspection accuracy.
                </p>
                
                <p className="body-text text-muted-foreground max-w-sm">
                  Transform your inspection process with intelligent 
                  damage assessment. Our AI analyzes vehicle 
                  conditions in seconds, providing detailed reports.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button className="px-4 py-2 text-xs font-medium ">
                  Check Your Car
                </Button>
                <Button variant="ghost" className="px-4 py-2 text-xs font-medium">
                  Watch Demo
                </Button>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-4 pt-3">
                <div className="flex items-center gap-1 trust-text text-muted-foreground">
                  <Zap className="h-3 w-3" />
                  <span>AI-Powered Detection</span>
                </div>
                <div className="flex items-center gap-1 trust-text text-muted-foreground">
                  <Car className="h-3 w-3" />
                  <span>Damage Assessment</span>
                </div>
                <div className="flex items-center gap-1 trust-text text-muted-foreground">
                  <Smartphone className="h-3 w-3" />
                  <span>Instant Results</span>
                </div>
              </div>
            </div>
            
            {/* Right Side - Hero Image */}
            <div className="relative">
              {/* Scan time indicator */}
              <div className="absolute top-3 right-3 bg-background/95 backdrop-blur-sm border px-2 py-1 z-10">
                <div className="text-right">
                  <div className="text-sm font-bold">3s</div>
                  <div className="text-xs text-muted-foreground">Avg. Scan Time</div>
                </div>
              </div>
              
              <div className="relative overflow-hidden">
                <img 
                  src={heroImage} 
                  alt="AI-powered car inspection technology analyzing vehicle damage and condition" 
                  className="w-full h-auto object-cover"
                />
              </div>
              
              {/* Floating accuracy badge */}
              <div className="absolute -bottom-2 -left-2 bg-background border px-3 py-2 shadow-sm">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">99.2%</div>
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