import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { shouldRedirectToOnboarding } from '@/utils/onboardingUtils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import CarInspectionForm from '@/components/driver/CarInspectionForm';
import { 
  Car, 
  Camera, 
  Star, 
  MapPin, 
  Clock, 
  DollarSign,
  TrendingUp,
  Shield,
  CheckCircle,
  AlertTriangle,
  BarChart3
} from 'lucide-react';

const DriverDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to onboarding if driver hasn't completed it
    if (shouldRedirectToOnboarding(user)) {
      navigate('/driver-onboarding');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'Driver') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">This page is only accessible to drivers.</p>
          <Button onClick={logout}>Return to Login</Button>
        </div>
      </div>
    );
  }

  // Mock driver stats - in real implementation, these would come from the database
  const driverStats = {
    totalRides: user.total_rides || 0,
    rating: user.driver_rating || 5.0,
    earnings: 1250.75, // Mock data
    activeStatus: 'Online',
    vehicleStatus: 'Verified',
    lastInspection: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Car className="h-6 w-6 text-lime-600" />
              <span className="text-lg font-bold">CarVision Driver</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {driverStats.activeStatus}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2">
                <div className="w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-lime-700">
                    {user.full_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium">
                  {user.full_name.split(' ')[0]}
                </span>
              </div>
              
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-6 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Welcome back, {user.full_name.split(' ')[0]}!
            </h1>
            <p className="text-muted-foreground">
              Manage your vehicle inspections and track your driving activity
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{driverStats.totalRides}</p>
                    <p className="text-sm text-muted-foreground">Total Rides</p>
                  </div>
                  <Car className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-2xl font-bold">{driverStats.rating.toFixed(1)}</p>
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    </div>
                    <p className="text-sm text-muted-foreground">Driver Rating</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">${driverStats.earnings.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">This Month</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <p className="text-sm font-medium">Verified</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Vehicle Status</p>
                  </div>
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Manage your driver profile and vehicle information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto p-4 justify-start">
                  <div className="flex flex-col items-start gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div className="text-left">
                      <p className="font-medium">Go Online</p>
                      <p className="text-sm text-muted-foreground">Start accepting rides</p>
                    </div>
                  </div>
                </Button>

                <Button variant="outline" className="h-auto p-4 justify-start">
                  <div className="flex flex-col items-start gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    <div className="text-left">
                      <p className="font-medium">View Earnings</p>
                      <p className="text-sm text-muted-foreground">Track your income</p>
                    </div>
                  </div>
                </Button>

                <Button variant="outline" className="h-auto p-4 justify-start">
                  <div className="flex flex-col items-start gap-2">
                    <Car className="h-5 w-5 text-orange-600" />
                    <div className="text-left">
                      <p className="font-medium">Vehicle Info</p>
                      <p className="text-sm text-muted-foreground">Update car details</p>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Information */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Vehicle Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Make & Model:</span>
                    <span className="text-sm font-medium">
                      {user.vehicle_make || 'Not set'} {user.vehicle_model || ''}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Year:</span>
                    <span className="text-sm font-medium">{user.vehicle_year || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Color:</span>
                    <span className="text-sm font-medium">{user.vehicle_color || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Plate:</span>
                    <span className="text-sm font-medium">{user.vehicle_plate_number || 'Not set'}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Last Inspection:</span>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {driverStats.lastInspection.toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="w-full">
                  Update Vehicle Info
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Vehicle inspection completed</p>
                      <p className="text-xs text-muted-foreground">Yesterday at 2:30 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Car className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Profile updated successfully</p>
                      <p className="text-xs text-muted-foreground">2 days ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Minor scratch detected in last inspection</p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Car Inspection Section */}
          <div>
            <CarInspectionForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
