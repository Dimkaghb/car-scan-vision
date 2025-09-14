import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, Check } from 'lucide-react';

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
    <div className="w-full max-w-md mx-auto">
      {/* Trust badge */}
      <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-muted px-2 py-1 bg-lime-50 mb-4">
        <Check className="h-3 w-3" />
        <span>Шаг 4 из 5</span>
      </div>
      
      <div className="text-center mb-8">
        <h1 className="hero-text mb-3">
          Информация об <mark className="highlight"><span>автомобиле</span></mark>
        </h1>
        <p className="body-text text-muted-foreground">
          Укажите данные вашего автомобиля для регистрации в системе
        </p>
      </div>

      <div className="space-y-4">
          {/* Vehicle Make */}
        <div className="space-y-1">
          <Label htmlFor="vehicleMake" className="body-text font-medium">
            Марка автомобиля
          </Label>
          <Select value={vehicleMake} onValueChange={onVehicleMakeChange}>
            <SelectTrigger className={`w-full px-3 py-2 border focus:ring-1 focus:ring-lime-600 focus:border-lime-600 ${errors.vehicleMake ? 'border-destructive' : 'border-border'}`}>
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
            <p className="text-xs text-destructive">{errors.vehicleMake}</p>
          )}
        </div>

          {/* Vehicle Model */}
        <div className="space-y-1">
          <Label htmlFor="vehicleModel" className="body-text font-medium">
            Модель автомобиля
          </Label>
          <Input
            id="vehicleModel"
            type="text"
            value={vehicleModel}
            onChange={(e) => onVehicleModelChange(e.target.value)}
            placeholder="Например: Camry, Civic, Altima"
            className={`w-full px-3 py-2 border focus:ring-1 focus:ring-lime-600 focus:border-lime-600 ${errors.vehicleModel ? 'border-destructive' : 'border-border'}`}
          />
          {errors.vehicleModel && (
            <p className="text-xs text-destructive">{errors.vehicleModel}</p>
          )}
        </div>

          {/* Vehicle Year */}
        <div className="space-y-1">
          <Label htmlFor="vehicleYear" className="body-text font-medium">
            Год выпуска
          </Label>
          <Select 
            value={vehicleYear.toString()} 
            onValueChange={(value) => onVehicleYearChange(parseInt(value))}
          >
            <SelectTrigger className={`w-full px-3 py-2 border focus:ring-1 focus:ring-lime-600 focus:border-lime-600 ${errors.vehicleYear ? 'border-destructive' : 'border-border'}`}>
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
            <p className="text-xs text-destructive">{errors.vehicleYear}</p>
          )}
        </div>

          {/* Vehicle Color */}
        <div className="space-y-1">
          <Label htmlFor="vehicleColor" className="body-text font-medium">
            Цвет автомобиля
          </Label>
          <Select value={vehicleColor} onValueChange={onVehicleColorChange}>
            <SelectTrigger className={`w-full px-3 py-2 border focus:ring-1 focus:ring-lime-600 focus:border-lime-600 ${errors.vehicleColor ? 'border-destructive' : 'border-border'}`}>
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
            <p className="text-xs text-destructive">{errors.vehicleColor}</p>
          )}
        </div>

          {/* Vehicle Plate Number */}
        <div className="space-y-1">
          <Label htmlFor="vehiclePlateNumber" className="body-text font-medium">
            Номер автомобиля
          </Label>
          <Input
            id="vehiclePlateNumber"
            type="text"
            value={vehiclePlateNumber}
            onChange={(e) => onVehiclePlateNumberChange(e.target.value.toUpperCase())}
            placeholder="Например: А123БВ77"
            className={`w-full px-3 py-2 border focus:ring-1 focus:ring-lime-600 focus:border-lime-600 ${errors.vehiclePlateNumber ? 'border-destructive' : 'border-border'}`}
            maxLength={9}
          />
          {errors.vehiclePlateNumber && (
            <p className="text-xs text-destructive">{errors.vehiclePlateNumber}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Введите государственный номер вашего автомобиля
          </p>
        </div>

        <div className="mt-6 p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Важно:</strong> Убедитесь, что все данные указаны корректно. 
            Эта информация будет использоваться для идентификации вашего автомобиля в системе.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StepVehicleInfo;