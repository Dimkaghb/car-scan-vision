import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';

interface StepPersonalInfoProps {
  firstName: string;
  lastName: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  errors?: {
    firstName?: string;
    lastName?: string;
  };
}

const StepPersonalInfo: React.FC<StepPersonalInfoProps> = ({
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
  errors = {},
}) => {
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Trust badge */}
      <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-muted px-2 py-1 bg-lime-50 mb-4">
        <Check className="h-3 w-3" />
        <span>Шаг 1 из 5</span>
      </div>
      
      <div className="text-center mb-8">
        <h1 className="hero-text mb-3">
          Базовая <mark className="highlight"><span>информация</span></mark>
        </h1>
        <p className="body-text text-muted-foreground">
          Укажите ваше имя и фамилию для регистрации в качестве водителя
        </p>
      </div>

      <div className="space-y-4">
        {/* First Name */}
        <div className="space-y-1">
          <Label htmlFor="firstName" className="body-text font-medium">
            Имя
          </Label>
          <Input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            placeholder="например, Дамир"
            className={`w-full px-3 py-2 border focus:ring-1 focus:ring-lime-600 focus:border-lime-600 ${
              errors.firstName ? 'border-destructive' : 'border-border'
            }`}
          />
          {errors.firstName && (
            <p className="text-xs text-destructive">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-1">
          <Label htmlFor="lastName" className="body-text font-medium">
            Фамилия
          </Label>
          <Input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            placeholder="например, Айсулу"
            className={`w-full px-3 py-2 border focus:ring-1 focus:ring-lime-600 focus:border-lime-600 ${
              errors.lastName ? 'border-destructive' : 'border-border'
            }`}
          />
          {errors.lastName && (
            <p className="text-xs text-destructive">{errors.lastName}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepPersonalInfo;
