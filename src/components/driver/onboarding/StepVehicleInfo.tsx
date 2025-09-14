import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car } from 'lucide-react';

interface StepVehicleInfoProps {
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number | '';
  vehicleColor: string;
  vehiclePlateNumber: string;
  onVehicleMakeChange: (value: string) => void;
  onVehicleModelChange: (value: string) => void;
  onVehicleYearChange: (value: number | '') => void;
  onVehicleColorChange: (value: string) => void;
  onVehiclePlateNumberChange: (value: string) => void;
  errors: {
    vehicleMake?: string;
    vehicleModel?: string;
    vehicleYear?: string;
    vehicleColor?: string;
    vehiclePlateNumber?: string;
  };
}

const StepVehicleInfo: React.FC<StepVehicleInfoProps> = ({
  vehicleMake,
  vehicleModel,
  vehicleYear,
  vehicleColor,
  vehiclePlateNumber,
  onVehicleMakeChange,
  onVehicleModelChange,
  onVehicleYearChange,
  onVehicleColorChange,
  onVehiclePlateNumberChange,
  errors,
}) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const popularMakes = [
    'Toyota', 'Honda', 'Nissan', 'Hyundai', 'Kia', 'Volkswagen', 
    'Chevrolet', 'Ford', 'Mazda', 'Subaru', 'BMW', 'Mercedes-Benz',
    'Audi', 'Lexus', 'Infiniti', 'Acura', 'Mitsubishi', 'Suzuki'
  ];

  const colors = [
    'Белый', 'Черный', 'Серый', 'Серебристый', 'Синий', 'Красный',
    'Зеленый', 'Коричневый', 'Желтый', 'Оранжевый', 'Фиолетовый', 'Другой'
  ];

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Car className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-900">
            Информация об автомобиле
          </CardTitle>
          <CardDescription className="text-gray-600">
            Укажите данные вашего автомобиля для регистрации в системе
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Vehicle Make */}
          <div className="space-y-2">
            <Label htmlFor="vehicleMake" className="text-sm font-medium text-gray-700">
              Марка автомобиля *
            </Label>
            <Select value={vehicleMake} onValueChange={onVehicleMakeChange}>
              <SelectTrigger className={`w-full ${errors.vehicleMake ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Выберите марку" />
              </SelectTrigger>
              <SelectContent>
                {popularMakes.map((make) => (
                  <SelectItem key={make} value={make}>
                    {make}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.vehicleMake && (
              <p className="text-sm text-red-600">{errors.vehicleMake}</p>
            )}
          </div>

          {/* Vehicle Model */}
          <div className="space-y-2">
            <Label htmlFor="vehicleModel" className="text-sm font-medium text-gray-700">
              Модель автомобиля *
            </Label>
            <Input
              id="vehicleModel"
              type="text"
              value={vehicleModel}
              onChange={(e) => onVehicleModelChange(e.target.value)}
              placeholder="Например: Camry, Civic, Altima"
              className={`w-full ${errors.vehicleModel ? 'border-red-500' : ''}`}
            />
            {errors.vehicleModel && (
              <p className="text-sm text-red-600">{errors.vehicleModel}</p>
            )}
          </div>

          {/* Vehicle Year */}
          <div className="space-y-2">
            <Label htmlFor="vehicleYear" className="text-sm font-medium text-gray-700">
              Год выпуска *
            </Label>
            <Select 
              value={vehicleYear.toString()} 
              onValueChange={(value) => onVehicleYearChange(parseInt(value))}
            >
              <SelectTrigger className={`w-full ${errors.vehicleYear ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Выберите год" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.vehicleYear && (
              <p className="text-sm text-red-600">{errors.vehicleYear}</p>
            )}
          </div>

          {/* Vehicle Color */}
          <div className="space-y-2">
            <Label htmlFor="vehicleColor" className="text-sm font-medium text-gray-700">
              Цвет автомобиля *
            </Label>
            <Select value={vehicleColor} onValueChange={onVehicleColorChange}>
              <SelectTrigger className={`w-full ${errors.vehicleColor ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Выберите цвет" />
              </SelectTrigger>
              <SelectContent>
                {colors.map((color) => (
                  <SelectItem key={color} value={color}>
                    {color}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.vehicleColor && (
              <p className="text-sm text-red-600">{errors.vehicleColor}</p>
            )}
          </div>

          {/* Vehicle Plate Number */}
          <div className="space-y-2">
            <Label htmlFor="vehiclePlateNumber" className="text-sm font-medium text-gray-700">
              Номер автомобиля *
            </Label>
            <Input
              id="vehiclePlateNumber"
              type="text"
              value={vehiclePlateNumber}
              onChange={(e) => onVehiclePlateNumberChange(e.target.value.toUpperCase())}
              placeholder="Например: А123БВ77"
              className={`w-full ${errors.vehiclePlateNumber ? 'border-red-500' : ''}`}
              maxLength={9}
            />
            {errors.vehiclePlateNumber && (
              <p className="text-sm text-red-600">{errors.vehiclePlateNumber}</p>
            )}
            <p className="text-xs text-gray-500">
              Введите государственный номер вашего автомобиля
            </p>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Важно:</strong> Убедитесь, что все данные указаны корректно. 
              Эта информация будет использоваться для идентификации вашего автомобиля в системе.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepVehicleInfo;