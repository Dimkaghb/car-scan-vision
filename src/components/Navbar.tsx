import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Car, LogOut, Camera, Map } from "lucide-react";

interface NavbarProps {
  onAuthClick?: () => void;
}

const Navbar = ({ onAuthClick }: NavbarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleRequestTaxi = () => {
    navigate('/map');
  };

  const handleDriverDashboard = () => {
    navigate('/driver-dashboard');
  };

  return (
    <nav className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-lg font-bold">CarVision</span>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How it Works
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
          </div>
          
          {/* User Actions */}
          {user ? (
            <div className="flex items-center gap-2 md:gap-3">
              {/* User Avatar & Name - Desktop */}
              <div className="hidden md:flex items-center gap-2">
                <div className="w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-lime-700">
                    {user.full_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-foreground">
                  {user.full_name.split(' ')[0]}
                </span>
              </div>
              
              {/* User Avatar Only - Mobile */}
              <div className="md:hidden w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-lime-700">
                  {user.full_name.charAt(0).toUpperCase()}
                </span>
              </div>
              
              {/* Role-based Action Button */}
              {user.role === 'Driver' ? (
                <Button 
                  onClick={handleDriverDashboard}
                  size="sm"
                  className="bg-lime-600 hover:bg-lime-700 text-white shadow-sm"
                >
                  <Camera className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Inspect Car</span>
                </Button>
              ) : (
                <Button 
                  onClick={handleRequestTaxi}
                  size="sm"
                  className="bg-lime-600 hover:bg-lime-700 text-white shadow-sm"
                >
                  <Car className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Request Taxi</span>
                </Button>
              )}
              
              {/* Logout Button */}
              <Button 
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:ml-2 md:inline">Logout</span>
              </Button>
            </div>
          ) : (
            /* Get Started Button for non-authenticated users */
            <Button 
              className="text-sm px-4 py-2"
              onClick={onAuthClick}
            >
              Get Started
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;