import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Clock, Star, Award, Check } from 'lucide-react';

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
      {/* Trust badge */}
      <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-muted px-2 py-1 bg-lime-50 mb-4">
        <Check className="h-3 w-3" />
        <span>Шаг 3 из 5</span>
      </div>
      
      <div className="text-center mb-8">
        <h1 className="hero-text mb-3">
          Опыт <mark className="highlight"><span>вождения</span></mark>
        </h1>
        <p className="body-text text-muted-foreground">
          Расскажите о своем опыте работы водителем или вождения в целом
        </p>
      </div>

      <div className="space-y-6">
        {/* Experience Textarea */}
        <div className="space-y-1">
          <Label htmlFor="experience" className="body-text font-medium">
            Опыт вождения
          </Label>
          <Textarea
            id="experience"
            value={experience}
            onChange={(e) => onExperienceChange(e.target.value)}
            placeholder="например: Работаю водителем такси уже 3 года..."
            className={`w-full px-3 py-2 border focus:ring-1 focus:ring-lime-600 focus:border-lime-600 min-h-[120px] resize-none ${
              errors.experience ? 'border-destructive' : 'border-border'
            }`}
            maxLength={maxCharacters}
          />
          
          {/* Character Counter */}
          <div className="flex justify-between items-center">
            <div>
              {errors.experience && (
                <p className="text-xs text-destructive">{errors.experience}</p>
              )}
            </div>
            <p className={`text-xs ${characterCount > maxCharacters * 0.9 ? 'text-destructive' : 'text-muted-foreground'}`}>
              {characterCount}/{maxCharacters}
            </p>
          </div>
        </div>

        {/* Quick Examples */}
        <div className="space-y-2">
          <Label className="body-text font-medium">
            Примеры ответов:
          </Label>
          <div className="space-y-2">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="w-full text-left p-3 border border-border rounded-lg hover:border-lime-600 hover:bg-lime-50 transition-colors"
              >
                <p className="text-xs text-muted-foreground line-clamp-2">{example}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-muted rounded-lg p-3">
          <h4 className="body-text font-medium mb-2 flex items-center gap-2">
            <Star className="h-3 w-3 text-lime-600" />
            Советы для хорошего ответа:
          </h4>
          <ul className="text-xs text-muted-foreground space-y-1">
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
