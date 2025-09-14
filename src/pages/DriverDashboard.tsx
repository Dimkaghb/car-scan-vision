import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { shouldRedirectToOnboarding } from '@/utils/onboardingUtils';
import { Button } from '@/components/ui/button';
import CarInspectionForm from '@/components/driver/CarInspectionForm';
import { 
  Car, 
  Camera, 
  CheckCircle,
  BarChart3,
  Check,
  X
} from 'lucide-react';

const DriverDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showVehicleInfo, setShowVehicleInfo] = useState(false);

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
      <nav className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold">CarVision</span>
              <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-lime-50 px-2 py-1">
                <Check className="h-3 w-3" />
                <span>Driver Dashboard</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
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
              
              <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-foreground">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
          <div className="space-y-12">
            {/* Welcome Section */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-lime-50 px-2 py-1">
                <CheckCircle className="h-3 w-3" />
                <span>Status: Online & Verified</span>
              </div>
              
              <div className="space-y-3">
                <h1 className="hero-text">
                  Welcome back, <mark className="highlight">{user.full_name.split(' ')[0]}</mark>!
                </h1>
                
                <p className="subheading-text text-muted-foreground max-w-md">
                  Manage your vehicle inspections and track your driving activity with our advanced AI-powered platform.
                </p>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-background border p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{driverStats.totalRides}</div>
                  <div className="body-text text-muted-foreground">Total Rides</div>
                </div>
              </div>

              <div className="bg-background border p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{driverStats.rating.toFixed(1)}★</div>
                  <div className="body-text text-muted-foreground">Driver Rating</div>
                </div>
              </div>

              <div className="bg-background border p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">${driverStats.earnings.toFixed(2)}</div>
                  <div className="body-text text-muted-foreground">This Month</div>
                </div>
              </div>

              <div className="bg-background border p-6">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">99.2%</div>
                  <div className="body-text text-muted-foreground">Vehicle Status</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h2 className="subheading-text font-bold">Quick Actions</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="px-6 py-3 text-sm font-medium bg-primary hover:bg-primary/90">
                  <Camera className="h-4 w-4 mr-2" />
                  Inspect Car
                </Button>
                <Button variant="ghost" className="px-6 py-3 text-sm font-medium">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Earnings
                </Button>
                <Button 
                  variant="ghost" 
                  className="px-6 py-3 text-sm font-medium"
                  onClick={() => setShowVehicleInfo(true)}
                >
                  <Car className="h-4 w-4 mr-2" />
                  Vehicle Info
                </Button>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h2 className="subheading-text font-bold">Vehicle Details</h2>
                <div className="bg-background border p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="body-text text-muted-foreground">Make & Model</span>
                      <span className="body-text font-medium">
                        {user.vehicle_make || 'Not set'} {user.vehicle_model || ''}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="body-text text-muted-foreground">Year</span>
                      <span className="body-text font-medium">{user.vehicle_year || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="body-text text-muted-foreground">Color</span>
                      <span className="body-text font-medium">{user.vehicle_color || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="body-text text-muted-foreground">Plate</span>
                      <span className="body-text font-medium">{user.vehicle_plate_number || 'Not set'}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span className="body-text text-muted-foreground">Last Inspection</span>
                        <span className="trust-text">{driverStats.lastInspection.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="space-y-4">
                <h2 className="subheading-text font-bold">Recent Activity</h2>
                <div className="bg-background border p-6 space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 pb-3 border-b">
                      <div className="h-2 w-2 rounded-full bg-lime-600 mt-2" />
                      <div className="flex-1">
                        <p className="body-text font-medium">Vehicle inspection completed</p>
                        <p className="trust-text text-muted-foreground">Yesterday at 2:30 PM</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 pb-3 border-b">
                      <div className="h-2 w-2 rounded-full bg-lime-600 mt-2" />
                      <div className="flex-1">
                        <p className="body-text font-medium">Profile updated successfully</p>
                        <p className="trust-text text-muted-foreground">2 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="h-2 w-2 rounded-full bg-lime-600 mt-2" />
                      <div className="flex-1">
                        <p className="body-text font-medium">Minor scratch detected in last inspection</p>
                        <p className="trust-text text-muted-foreground">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Car Inspection Section */}
            <div>
              <CarInspectionForm />
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Info Modal */}
      {showVehicleInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="subheading-text font-bold">Детальная информация о транспортном средстве</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowVehicleInfo(false)}
                  className="p-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* Basic Vehicle Info */}
                <div className="space-y-4">
                  <h3 className="body-text font-bold text-foreground">Основная информация</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b">
                        <span className="trust-text text-muted-foreground">Марка</span>
                        <span className="trust-text font-medium">{user.vehicle_make || 'Не указано'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="trust-text text-muted-foreground">Модель</span>
                        <span className="trust-text font-medium">{user.vehicle_model || 'Не указано'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="trust-text text-muted-foreground">Год выпуска</span>
                        <span className="trust-text font-medium">{user.vehicle_year || 'Не указано'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="trust-text text-muted-foreground">Цвет</span>
                        <span className="trust-text font-medium">{user.vehicle_color || 'Не указано'}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b">
                        <span className="trust-text text-muted-foreground">Номерной знак</span>
                        <span className="trust-text font-medium">{user.vehicle_plate_number || 'Не указано'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="trust-text text-muted-foreground">VIN номер</span>
                        <span className="trust-text font-medium">{user.vehicle_vin || 'Не указано'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="trust-text text-muted-foreground">Тип топлива</span>
                        <span className="trust-text font-medium">{user.vehicle_fuel_type || 'Не указано'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="trust-text text-muted-foreground">Пробег</span>
                        <span className="trust-text font-medium">{user.vehicle_mileage ? `${user.vehicle_mileage} км` : 'Не указано'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vehicle Status */}
                <div className="space-y-4">
                  <h3 className="body-text font-bold text-foreground">Статус транспортного средства</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-lime-50 border border-lime-200 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-lime-600" />
                        <span className="trust-text font-medium text-lime-800">Статус верификации</span>
                      </div>
                      <p className="trust-text text-lime-700">Верифицировано</p>
                    </div>
                    <div className="bg-background border p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Car className="h-4 w-4 text-muted-foreground" />
                        <span className="trust-text font-medium">Последняя проверка</span>
                      </div>
                      <p className="trust-text text-muted-foreground">{driverStats.lastInspection.toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Insurance & Registration */}
                <div className="space-y-4">
                  <h3 className="body-text font-bold text-foreground">Документы</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b">
                      <span className="trust-text text-muted-foreground">Страховка</span>
                      <span className="trust-text font-medium">{user.vehicle_insurance || 'Не указано'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="trust-text text-muted-foreground">Регистрация</span>
                      <span className="trust-text font-medium">{user.vehicle_registration || 'Не указано'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="trust-text text-muted-foreground">Техосмотр</span>
                      <span className="trust-text font-medium">{user.vehicle_inspection_date ? new Date(user.vehicle_inspection_date).toLocaleDateString() : 'Не указано'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;
