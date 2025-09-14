import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock, Check } from 'lucide-react';

interface StepDriverLicenseProps {
  driverLicense: string;
  onDriverLicenseChange: (value: string) => void;
  errors?: {
    driverLicense?: string;
  };
}

const StepDriverLicense: React.FC<StepDriverLicenseProps> = ({
  driverLicense,
  onDriverLicenseChange,
  errors = {},
}) => {
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Trust badge */}
      <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-muted px-2 py-1 bg-lime-50 mb-4">
        <Check className="h-3 w-3" />
        <span>Шаг 2 из 5</span>
      </div>
      
      <div className="text-center mb-8">
        <h1 className="hero-text mb-3">
          Водительские <mark className="highlight"><span>права</span></mark>
        </h1>
        <p className="body-text text-muted-foreground">
          Укажите номер ваших водительских прав для верификации
        </p>
      </div>

      <div className="space-y-4">
        {/* Driver License Input */}
        <div className="space-y-1">
          <Label htmlFor="driverLicense" className="body-text font-medium">
            Номер водительских прав
          </Label>
          <Input
            id="driverLicense"
            type="text"
            value={driverLicense}
            onChange={(e) => onDriverLicenseChange(e.target.value)}
            placeholder="например, AB1234567"
            className={`w-full px-3 py-2 border focus:ring-1 focus:ring-lime-600 focus:border-lime-600 ${
              errors.driverLicense ? 'border-destructive' : 'border-border'
            }`}
          />
          {errors.driverLicense && (
            <p className="text-xs text-destructive">{errors.driverLicense}</p>
          )}
        </div>

        {/* Privacy Notice */}
        <Alert className="border">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span className="body-text font-medium">Мы не храним ваши документы</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Номер водительских прав используется только для верификации вашего статуса водителя. 
                Мы не сохраняем копии документов и не передаем данные третьим лицам.
              </p>
            </div>
          </AlertDescription>
        </Alert>

        {/* Additional Info */}
        <div className="bg-muted p-3">
          <h4 className="body-text font-medium mb-2">Зачем нам эта информация?</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Подтверждение права управления транспортным средством</li>
            <li>• Обеспечение безопасности пассажиров</li>
            <li>• Соответствие требованиям законодательства</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StepDriverLicense;
