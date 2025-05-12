import { createContext, useState, useContext, useEffect } from 'react';

// Создаем контекст для настроения
export const MoodContext = createContext();

// Хук для использования контекста настроения
export const useMood = () => useContext(MoodContext);

// Начальные данные настроения для демонстрации
const initialMoodData = [
  {
    date: new Date(2023, 4, 2).toISOString(),
    mood: 5,
    symptoms: [],
    notes: 'Отличный день, много успел сделать.'
  },
  {
    date: new Date(2023, 4, 5).toISOString(),
    mood: 4,
    symptoms: [],
    notes: 'Хороший день, но немного устал к вечеру.'
  },
  {
    date: new Date(2023, 4, 8).toISOString(),
    mood: 3,
    symptoms: ['fatigue'],
    notes: 'Обычный день, ничего особенного.'
  },
  {
    date: new Date(2023, 4, 12).toISOString(),
    mood: 2,
    symptoms: ['anxiety', 'stress', 'headache'],
    notes: 'Чувствую тревогу из-за работы, болит голова.'
  },
  {
    date: new Date(2023, 4, 15).toISOString(),
    mood: 1,
    symptoms: ['anxiety', 'insomnia', 'sadness'],
    notes: 'Очень плохо спал, чувствую подавленность.'
  },
  {
    date: new Date(2023, 4, 18).toISOString(),
    mood: 4,
    symptoms: [],
    notes: 'Стало намного лучше, хорошо выспался.'
  },
  {
    date: new Date(2023, 4, 21).toISOString(),
    mood: 3,
    symptoms: ['fatigue'],
    notes: 'Чувствую некоторую усталость, но в целом нормально.'
  },
  {
    date: new Date(2023, 4, 25).toISOString(),
    mood: 5,
    symptoms: [],
    notes: 'Отличный день, сделал все запланированное.'
  },
  {
    date: new Date(2023, 4, 28).toISOString(),
    mood: 4,
    symptoms: [],
    notes: 'Хороший день, продуктивно поработал.'
  },
];

export const MoodProvider = ({ children }) => {
  const [moodEntries, setMoodEntries] = useState([]);
  
  // Загружаем мок-данные при инициализации
  useEffect(() => {
    const storedMoodEntries = localStorage.getItem('moodEntries');
    if (storedMoodEntries) {
      try {
        setMoodEntries(JSON.parse(storedMoodEntries));
      } catch (error) {
        console.error('Error parsing mood entries:', error);
        setMoodEntries(initialMoodData);
      }
    } else {
      setMoodEntries(initialMoodData);
    }
  }, []);

  // Сохраняем изменения в localStorage
  useEffect(() => {
    if (moodEntries.length > 0) {
      localStorage.setItem('moodEntries', JSON.stringify(moodEntries));
    }
  }, [moodEntries]);

  // Добавление или обновление записи о настроении
  const saveMoodEntry = (entry) => {
    setMoodEntries((prevEntries) => {
      // Проверяем, есть ли уже запись на эту дату
      const existingEntryIndex = prevEntries.findIndex(
        (e) => new Date(e.date).toDateString() === new Date(entry.date).toDateString()
      );
      
      if (existingEntryIndex !== -1) {
        // Обновляем существующую запись
        const updatedEntries = [...prevEntries];
        updatedEntries[existingEntryIndex] = entry;
        return updatedEntries;
      } else {
        // Добавляем новую запись
        return [...prevEntries, entry];
      }
    });
  };

  // Получение записи о настроении по дате
  const getMoodEntryByDate = (date) => {
    return moodEntries.find(
      (entry) => new Date(entry.date).toDateString() === date.toDateString()
    );
  };

  // Получение цвета для календаря на основе настроения
  const getMoodColorForDate = (date) => {
    const entry = getMoodEntryByDate(date);
    if (!entry) return '';
    
    // Цвета для разных уровней настроения
    switch (entry.mood) {
      case 5: return 'bg-green-500'; // Отлично
      case 4: return 'bg-green-400'; // Хорошо
      case 3: return 'bg-yellow-400'; // Нормально
      case 2: return 'bg-orange-400'; // Плохо
      case 1: return 'bg-red-500'; // Ужасно
      default: return '';
    }
  };

  // Получение всех записей о настроении
  const getAllMoodEntries = () => {
    return [...moodEntries].sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  return (
    <MoodContext.Provider 
      value={{
        saveMoodEntry,
        getMoodEntryByDate,
        getMoodColorForDate,
        getAllMoodEntries,
        moodEntries,
      }}
    >
      {children}
    </MoodContext.Provider>
  );
};
