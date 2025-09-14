import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock } from 'lucide-react';

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
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Водительские права
        </h2>
        <p className="text-gray-600">
          Укажите номер ваших водительских прав для верификации
        </p>
      </div>

      <div className="space-y-6">
        {/* Driver License Input */}
        <div className="space-y-2">
          <Label htmlFor="driverLicense" className="text-sm font-medium text-gray-700">
            Номер водительских прав
          </Label>
          <Input
            id="driverLicense"
            type="text"
            value={driverLicense}
            onChange={(e) => onDriverLicenseChange(e.target.value)}
            placeholder="например, AB1234567"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
              errors.driverLicense ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.driverLicense && (
            <p className="text-sm text-red-600">{errors.driverLicense}</p>
          )}
        </div>

        {/* Privacy Notice */}
        <Alert className="border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span className="font-medium">Мы не храним ваши документы</span>
              </div>
              <p className="text-sm">
                Номер водительских прав используется только для верификации вашего статуса водителя. 
                Мы не сохраняем копии документов и не передаем данные третьим лицам.
              </p>
            </div>
          </AlertDescription>
        </Alert>

        {/* Additional Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Зачем нам эта информация?</h4>
          <ul className="text-sm text-gray-600 space-y-1">
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
