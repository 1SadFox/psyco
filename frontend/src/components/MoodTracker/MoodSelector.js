import { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { FaSmile, FaMeh, FaFrown, FaSadTear, FaGrinBeam } from 'react-icons/fa';

// Настроения с их значениями и цветами
const moods = [
  { id: 5, label: 'Отлично', icon: FaGrinBeam, color: 'bg-green-500', textColor: 'text-green-500' },
  { id: 4, label: 'Хорошо', icon: FaSmile, color: 'bg-green-400', textColor: 'text-green-400' },
  { id: 3, label: 'Нормально', icon: FaMeh, color: 'bg-yellow-400', textColor: 'text-yellow-400' },
  { id: 2, label: 'Плохо', icon: FaFrown, color: 'bg-orange-400', textColor: 'text-orange-400' },
  { id: 1, label: 'Ужасно', icon: FaSadTear, color: 'bg-red-500', textColor: 'text-red-500' },
];

// Список симптомов для отслеживания
const symptoms = [
  { id: 'anxiety', label: 'Тревожность' },
  { id: 'fatigue', label: 'Усталость' },
  { id: 'insomnia', label: 'Бессонница' },
  { id: 'irritability', label: 'Раздражительность' },
  { id: 'sadness', label: 'Грусть' },
  { id: 'stress', label: 'Стресс' },
  { id: 'headache', label: 'Головная боль' },
  { id: 'apathy', label: 'Апатия' },
  { id: 'concentration', label: 'Проблемы с концентрацией' },
];

const MoodSelector = ({ date, onSave, onCancel, initialData = {} }) => {
  const [selectedMood, setSelectedMood] = useState(initialData.mood || null);
  const [selectedSymptoms, setSelectedSymptoms] = useState(initialData.symptoms || []);
  const [notes, setNotes] = useState(initialData.notes || '');

  const handleSymptomToggle = (symptomId) => {
    if (selectedSymptoms.includes(symptomId)) {
      setSelectedSymptoms(selectedSymptoms.filter(id => id !== symptomId));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptomId]);
    }
  };

  const handleSave = () => {
    if (!selectedMood) return;
    
    const moodData = {
      date: date.toISOString(),
      mood: selectedMood,
      symptoms: selectedSymptoms,
      notes,
    };
    
    onSave(moodData);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium">Как вы себя чувствуете?</h3>
        <p className="text-sm text-gray-500">
          {date.toLocaleDateString('ru-RU', { 
            day: 'numeric',
            month: 'long',
            year: 'numeric' 
          })}
        </p>
      </div>

      {/* Выбор настроения */}
      <div className="flex justify-between mb-6">
        {moods.map((mood) => {
          const Icon = mood.icon;
          return (
            <button
              key={mood.id}
              onClick={() => setSelectedMood(mood.id)}
              className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                selectedMood === mood.id 
                  ? `ring-2 ring-offset-2 ${mood.textColor} ring-current` 
                  : 'hover:bg-gray-50'
              }`}
            >
              <Icon 
                className={`w-8 h-8 mb-1 ${selectedMood === mood.id ? mood.textColor : 'text-gray-400'}`} 
              />
              <span className={`text-xs ${selectedMood === mood.id ? 'font-medium' : 'text-gray-500'}`}>
                {mood.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Симптомы */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Отметьте симптомы (если есть):</h4>
        <div className="flex flex-wrap gap-2">
          {symptoms.map((symptom) => (
            <button
              key={symptom.id}
              onClick={() => handleSymptomToggle(symptom.id)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                selectedSymptoms.includes(symptom.id)
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {symptom.label}
            </button>
          ))}
        </div>
      </div>

      {/* Заметки */}
      <div className="mb-6">
        <label htmlFor="mood-notes" className="block text-sm font-medium mb-1">
          Заметки:
        </label>
        <textarea
          id="mood-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
          rows="3"
          placeholder="Опишите подробнее, как вы себя чувствуете..."
        ></textarea>
      </div>

      {/* Кнопки действий */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button 
          onClick={handleSave}
          disabled={!selectedMood}
        >
          Сохранить
        </Button>
      </div>
    </Card>
  );
};

export default MoodSelector;
