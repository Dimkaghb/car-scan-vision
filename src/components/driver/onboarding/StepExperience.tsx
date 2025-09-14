import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Clock, Star, Award } from 'lucide-react';

interface StepExperienceProps {
  experience: string;
  onExperienceChange: (value: string) => void;
  errors?: {
    experience?: string;
  };
}

const StepExperience: React.FC<StepExperienceProps> = ({
  experience,
  onExperienceChange,
  errors = {},
}) => {
  const characterCount = experience.length;
  const maxCharacters = 500;

  const handleExampleClick = (example: string) => {
    onExperienceChange(example);
  };

  const examples = [
    "Работаю водителем такси уже 3 года. Знаю город как свои пять пальцев, всегда вежлив с пассажирами.",
    "5 лет опыта вождения, из них 2 года в службе доставки. Аккуратный водитель, без нарушений.",
    "Новичок в такси, но водительский стаж 8 лет. Готов предоставить качественный сервис пассажирам."
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Опыт вождения
        </h2>
        <p className="text-gray-600">
          Расскажите о своем опыте работы водителем или вождения в целом
        </p>
      </div>

      <div className="space-y-6">
        {/* Experience Textarea */}
        <div className="space-y-2">
          <Label htmlFor="experience" className="text-sm font-medium text-gray-700">
            Чем занимается ваша компания?
          </Label>
          <Textarea
            id="experience"
            value={experience}
            onChange={(e) => onExperienceChange(e.target.value)}
            placeholder="например: Работаю водителем такси уже 3 года..."
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 min-h-[120px] resize-none ${
              errors.experience ? 'border-red-500' : 'border-gray-300'
            }`}
            maxLength={maxCharacters}
          />
          
          {/* Character Counter */}
          <div className="flex justify-between items-center">
            <div>
              {errors.experience && (
                <p className="text-sm text-red-600">{errors.experience}</p>
              )}
            </div>
            <p className={`text-sm ${characterCount > maxCharacters * 0.9 ? 'text-red-600' : 'text-gray-500'}`}>
              {characterCount}/{maxCharacters}
            </p>
          </div>
        </div>

        {/* Quick Examples */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Примеры ответов:
          </Label>
          <div className="space-y-2">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
              >
                <p className="text-sm text-gray-700 line-clamp-2">{example}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            Советы для хорошего ответа:
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              Укажите стаж вождения или работы водителем
            </li>
            <li className="flex items-center gap-2">
              <Award className="h-3 w-3" />
              Упомяните особые навыки (знание города, языки)
            </li>
            <li className="flex items-center gap-2">
              <Badge className="h-3 w-3" />
              Расскажите о своем подходе к работе
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StepExperience;
