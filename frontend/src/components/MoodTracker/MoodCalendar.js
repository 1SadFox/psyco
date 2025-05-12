import { useState } from 'react';
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ru } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaPlus } from 'react-icons/fa';
import Card from '../UI/Card';
import Button from '../UI/Button';
import MoodSelector from './MoodSelector';
import { useMood } from '../../context/MoodContext';

const MoodCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  
  const { getMoodColorForDate, getMoodEntryByDate, saveMoodEntry } = useMood();

  // Навигация по месяцам
  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // Обработка выбора даты
  const handleDateClick = (day) => {
    setSelectedDate(day);
    // Если дата в будущем, не разрешаем выбор настроения
    if (day > new Date()) return;
    setShowMoodSelector(true);
  };

  // Сохранение данных о настроении
  const handleSaveMood = (moodData) => {
    saveMoodEntry(moodData);
    setShowMoodSelector(false);
  };

  // Отмена выбора настроения
  const handleCancelMood = () => {
    setShowMoodSelector(false);
  };

  // Рендеринг заголовка календаря
  const renderHeader = () => {
    const dateFormat = 'LLLL yyyy';
    return (
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          {format(currentDate, dateFormat, { locale: ru })}
        </h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={prevMonth}
            aria-label="Предыдущий месяц"
          >
            <FaChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Сегодня
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={nextMonth}
            aria-label="Следующий месяц"
          >
            <FaChevronRight />
          </Button>
        </div>
      </div>
    );
  };

  // Рендеринг дней недели
  const renderDays = () => {
    const dateFormat = 'E';
    const days = [];
    let startDate = startOfWeek(currentDate, { locale: ru });

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center text-sm font-medium text-gray-500 py-2">
          {format(addDays(startDate, i), dateFormat, { locale: ru })}
        </div>
      );
    }

    return <div className="grid grid-cols-7">{days}</div>;
  };

  // Рендеринг ячеек календаря
  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { locale: ru });
    const endDate = startOfWeek(monthEnd, { locale: ru });

    const dateFormat = 'd';
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const isCurrentDay = isSameDay(day, new Date());
        const isSelected = isSameDay(day, selectedDate);
        const isInCurrentMonth = isSameMonth(day, monthStart);
        const isFutureDay = day > new Date();
        
        // Получаем цвет настроения для этого дня
        const moodColor = getMoodColorForDate(day);
        
        days.push(
          <div
            key={day}
            className={`py-2 px-1 border-t relative cursor-pointer ${
              !isInCurrentMonth
                ? 'text-gray-300'
                : isSelected
                ? 'bg-primary-50'
                : 'text-gray-900 hover:bg-gray-50'
            }`}
            onClick={() => handleDateClick(cloneDay)}
          >
            <div className={`
              w-8 h-8 mx-auto flex items-center justify-center rounded-full
              ${isCurrentDay ? 'bg-primary-100 font-bold text-primary-800' : ''}
            `}>
              {formattedDate}
            </div>
            
            {isInCurrentMonth && (
              <div className="flex justify-center mt-1">
                {moodColor ? (
                  <span className={`h-3 w-3 rounded-full ${moodColor}`}></span>
                ) : !isFutureDay ? (
                  <button className="h-3 w-3 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center">
                    <FaPlus className="h-2 w-2 text-gray-500" />
                  </button>
                ) : null}
              </div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      
      rows.push(
        <div key={day} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }
    
    return <div className="mb-4">{rows}</div>;
  };

  // Отображение информации о настроении на выбранную дату
  const renderSelectedDateMood = () => {
    const moodEntry = getMoodEntryByDate(selectedDate);
    const isToday = isSameDay(selectedDate, new Date());
    const isPast = selectedDate < new Date();
    const isFuture = selectedDate > new Date();
    
    if (isFuture) {
      return (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">Нельзя указать настроение для будущих дат</p>
        </div>
      );
    }
    
    if (moodEntry) {
      // Определяем название настроения по его значению
      let moodLabel = '';
      let moodColor = '';
      
      switch (moodEntry.mood) {
        case 5:
          moodLabel = 'Отлично';
          moodColor = 'text-green-500';
          break;
        case 4:
          moodLabel = 'Хорошо';
          moodColor = 'text-green-400';
          break;
        case 3:
          moodLabel = 'Нормально';
          moodColor = 'text-yellow-400';
          break;
        case 2:
          moodLabel = 'Плохо';
          moodColor = 'text-orange-400';
          break;
        case 1:
          moodLabel = 'Ужасно';
          moodColor = 'text-red-500';
          break;
        default:
          moodLabel = 'Не указано';
          moodColor = 'text-gray-500';
      }
      
      return (
        <div className="p-3">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">
              {format(selectedDate, 'PP', { locale: ru })}
            </h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowMoodSelector(true)}
            >
              Изменить
            </Button>
          </div>
          
          <div className="mb-2">
            <p className="text-sm font-medium">Настроение: <span className={moodColor}>{moodLabel}</span></p>
          </div>
          
          {moodEntry.symptoms && moodEntry.symptoms.length > 0 && (
            <div className="mb-2">
              <p className="text-sm font-medium mb-1">Симптомы:</p>
              <div className="flex flex-wrap gap-1">
                {moodEntry.symptoms.map(symptom => (
                  <span key={symptom} className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                    {getSymptomLabel(symptom)}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {moodEntry.notes && (
            <div className="mt-2">
              <p className="text-sm font-medium">Заметки:</p>
              <p className="text-sm text-gray-600">{moodEntry.notes}</p>
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div className="p-3 text-center">
        <p className="text-sm text-gray-500 mb-2">Настроение не указано для этой даты</p>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowMoodSelector(true)}
          className="mx-auto"
        >
          {isToday ? 'Указать на сегодня' : 'Указать настроение'}
        </Button>
      </div>
    );
  };

  // Вспомогательная функция для получения названия симптома
  const getSymptomLabel = (symptomId) => {
    const symptomsMap = {
      'anxiety': 'Тревожность',
      'fatigue': 'Усталость',
      'insomnia': 'Бессонница',
      'irritability': 'Раздражительность',
      'sadness': 'Грусть',
      'stress': 'Стресс',
      'headache': 'Головная боль',
      'apathy': 'Апатия',
      'concentration': 'Проблемы с концентрацией',
    };
    
    return symptomsMap[symptomId] || symptomId;
  };

  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4">Календарь настроения</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {renderHeader()}
          {renderDays()}
          {renderCells()}
        </div>
        
        <div>
          <Card className="h-full">
            {renderSelectedDateMood()}
          </Card>
        </div>
      </div>
      
      {/* Модальное окно выбора настроения */}
      <AnimatePresence>
        {showMoodSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <MoodSelector
                date={selectedDate}
                onSave={handleSaveMood}
                onCancel={handleCancelMood}
                initialData={getMoodEntryByDate(selectedDate)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default MoodCalendar;
