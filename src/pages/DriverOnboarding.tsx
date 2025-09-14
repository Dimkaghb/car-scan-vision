import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { hasCompletedOnboarding } from '@/utils/onboardingUtils';
import DriverOnboardingForm from '@/components/driver/DriverOnboardingForm';
import { Button } from '@/components/ui/button';

const DriverOnboarding: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if user is not a driver or not logged in
    if (!user) {
      navigate('/');
      return;
    }

    if (user.role !== 'Driver') {
      navigate('/map');
      return;
    }

    // If onboarding is already completed, redirect to dashboard
    if (hasCompletedOnboarding(user)) {
      navigate('/driver-dashboard');
      return;
    }
  }, [user, navigate]);

  // Show loading while checking user status
  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto" />
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  // Show access denied if not a driver
  if (user.role !== 'Driver') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-600">Доступ запрещен</h1>
          <p className="text-gray-600">Эта страница доступна только для водителей.</p>
          <Button onClick={() => navigate('/')}>
            Вернуться на главную
          </Button>
        </div>
      </div>
    );
  }

  // Show onboarding form
  return (
    <div className="min-h-screen bg-white">
      {/* Header with logout option */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">CarVision</span>
              <span className="text-sm text-gray-500">Регистрация водителя</span>
            </div>
            
            <Button
              variant="ghost"
              onClick={logout}
              className="text-gray-600 hover:text-gray-900"
            >
              Выйти
            </Button>
          </div>
        </div>
      </div>

      {/* Onboarding Form */}
      <DriverOnboardingForm />
    </div>
  );
};

export default DriverOnboarding;
