import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  completeDriverOnboarding, 
  uploadCarImage, 
  OnboardingData 
} from '@/services/onboardingService';
import ProgressBar from './onboarding/ProgressBar';
import StepPersonalInfo from './onboarding/StepPersonalInfo';
import StepDriverLicense from './onboarding/StepDriverLicense';
import StepExperience from './onboarding/StepExperience';
import StepVehicleInfo from './onboarding/StepVehicleInfo';
import StepCarImage from './onboarding/StepCarImage';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  driverLicense: string;
  experience: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number | '';
  vehicleColor: string;
  vehiclePlateNumber: string;
  carImage: File | null;
  carImagePreview: string | null;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  driverLicense?: string;
  experience?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: string;
  vehicleColor?: string;
  vehiclePlateNumber?: string;
  carImage?: string;
}

const DriverOnboardingForm: React.FC = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    driverLicense: '',
    experience: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    vehicleColor: '',
    vehiclePlateNumber: '',
    carImage: null,
    carImagePreview: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const totalSteps = 5;

  // Validation functions
  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    switch (step) {
      case 1:
        if (!formData.firstName.trim()) {
          newErrors.firstName = 'Имя обязательно для заполнения';
        }
        if (!formData.lastName.trim()) {
          newErrors.lastName = 'Фамилия обязательна для заполнения';
        }
        break;

      case 2:
        if (!formData.driverLicense.trim()) {
          newErrors.driverLicense = 'Номер водительских прав обязателен';
        } else if (formData.driverLicense.length < 6) {
          newErrors.driverLicense = 'Номер должен содержать не менее 6 символов';
        }
        break;

      case 3:
        if (!formData.experience.trim()) {
          newErrors.experience = 'Опишите ваш опыт вождения';
        } else if (formData.experience.length < 20) {
          newErrors.experience = 'Опишите ваш опыт более подробно (минимум 20 символов)';
        }
        break;

      case 4:
        if (!formData.vehicleMake.trim()) {
          newErrors.vehicleMake = 'Выберите марку автомобиля';
        }
        if (!formData.vehicleModel.trim()) {
          newErrors.vehicleModel = 'Укажите модель автомобиля';
        }
        if (!formData.vehicleYear) {
          newErrors.vehicleYear = 'Выберите год выпуска';
        }
        if (!formData.vehicleColor.trim()) {
          newErrors.vehicleColor = 'Выберите цвет автомобиля';
        }
        if (!formData.vehiclePlateNumber.trim()) {
          newErrors.vehiclePlateNumber = 'Укажите номер автомобиля';
        } else if (formData.vehiclePlateNumber.length < 6) {
          newErrors.vehiclePlateNumber = 'Номер должен содержать не менее 6 символов';
        }
        break;

      case 5:
        if (!formData.carImage) {
          newErrors.carImage = 'Пожалуйста, загрузите фото автомобиля';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step navigation
  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  // Form submission
  const handleSubmit = async () => {
    if (!validateStep(currentStep) || !user?.id) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload car image first
      let carImageUrl = '';
      if (formData.carImage) {
        const uploadResult = await uploadCarImage(formData.carImage, user.id);
        if (!uploadResult.success) {
          throw new Error(uploadResult.error || 'Failed to upload car image');
        }
        carImageUrl = uploadResult.url || '';
      }

      // Prepare onboarding data
      const onboardingData: OnboardingData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        driverLicense: formData.driverLicense,
        experience: formData.experience,
        vehicleMake: formData.vehicleMake,
        vehicleModel: formData.vehicleModel,
        vehicleYear: formData.vehicleYear as number,
        vehicleColor: formData.vehicleColor,
        vehiclePlateNumber: formData.vehiclePlateNumber,
        carImageUrl,
      };

      // Complete onboarding
      const result = await completeDriverOnboarding(user.id, onboardingData);
      
      if (result.success) {
        // Update user context with new data
        const updatedUser = {
          ...user,
          full_name: `${formData.firstName} ${formData.lastName}`,
          driver_license_number: formData.driverLicense,
          driver_experience: formData.experience,
          vehicle_make: formData.vehicleMake,
          vehicle_model: formData.vehicleModel,
          vehicle_year: formData.vehicleYear,
          vehicle_color: formData.vehicleColor,
          vehicle_plate_number: formData.vehiclePlateNumber,
          profile_image_url: carImageUrl,
          onboarding_completed: true,
        };
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        toast({
          title: 'Регистрация завершена!',
          description: 'Добро пожаловать в CarVision. Перенаправляем на панель водителя...',
        });

        // Redirect to driver dashboard
        setTimeout(() => {
          navigate('/driver-dashboard');
        }, 2000);
      } else {
        throw new Error(result.error || 'Failed to complete onboarding');
      }
    } catch (error) {
      console.error('Onboarding submission error:', error);
      toast({
        title: 'Ошибка регистрации',
        description: error instanceof Error ? error.message : 'Произошла неизвестная ошибка',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepPersonalInfo
            firstName={formData.firstName}
            lastName={formData.lastName}
            onFirstNameChange={(value) => setFormData({ ...formData, firstName: value })}
            onLastNameChange={(value) => setFormData({ ...formData, lastName: value })}
            errors={errors}
          />
        );

      case 2:
        return (
          <StepDriverLicense
            driverLicense={formData.driverLicense}
            onDriverLicenseChange={(value) => setFormData({ ...formData, driverLicense: value })}
            errors={errors}
          />
        );

      case 3:
        return (
          <StepExperience
            experience={formData.experience}
            onExperienceChange={(value) => setFormData({ ...formData, experience: value })}
            errors={errors}
          />
        );

      case 4:
        return (
          <StepVehicleInfo
            vehicleMake={formData.vehicleMake}
            vehicleModel={formData.vehicleModel}
            vehicleYear={formData.vehicleYear}
            vehicleColor={formData.vehicleColor}
            vehiclePlateNumber={formData.vehiclePlateNumber}
            onVehicleMakeChange={(value) => setFormData({ ...formData, vehicleMake: value })}
            onVehicleModelChange={(value) => setFormData({ ...formData, vehicleModel: value })}
            onVehicleYearChange={(value) => setFormData({ ...formData, vehicleYear: value })}
            onVehicleColorChange={(value) => setFormData({ ...formData, vehicleColor: value })}
            onVehiclePlateNumberChange={(value) => setFormData({ ...formData, vehiclePlateNumber: value })}
            errors={errors}
          />
        );

      case 5:
        return (
          <StepCarImage
            carImage={formData.carImage}
            carImagePreview={formData.carImagePreview}
            onCarImageChange={(file, preview) => 
              setFormData({ ...formData, carImage: file, carImagePreview: preview })
            }
            errors={errors}
          />
        );

      default:
        return null;
    }
  };

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-900">
            Завершение регистрации...
          </h2>
          <p className="text-gray-600">
            Сохраняем ваши данные и настраиваем профиль водителя
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

        {/* Step Content */}
        <div className="mb-8">
          {renderCurrentStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center items-center gap-4 max-w-md mx-auto">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Назад
            </Button>
          )}

          {currentStep < totalSteps ? (
            <Button
              onClick={goToNextStep}
              className="bg-green-500 hover:bg-green-600 flex items-center gap-2 flex-1"
            >
              Далее
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-green-500 hover:bg-green-600 flex items-center gap-2 flex-1"
            >
              <CheckCircle className="h-4 w-4" />
              Завершить
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverOnboardingForm;
