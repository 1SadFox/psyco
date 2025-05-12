import { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { motion } from 'framer-motion';
import { FaClock, FaChartLine, FaHistory } from 'react-icons/fa';

// Mock test data
const availableTests = [
  {
    id: 1,
    title: 'Шкала депрессии Бека (BDI)',
    description: 'Оценка наличия и степени тяжести депрессивных симптомов.',
    timeToComplete: '10-15 минут',
    questions: 21,
    category: 'depression',
    lastCompleted: null,
    image: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d',
  },
  {
    id: 2,
    title: 'Шкала тревоги Спилбергера (STAI)',
    description: 'Измерение уровня ситуативной и личностной тревожности.',
    timeToComplete: '10-15 минут',
    questions: 40,
    category: 'anxiety',
    lastCompleted: '12.04.2023',
    image: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d',
  },
  {
    id: 3,
    title: 'Шкала воспринимаемого стресса (PSS)',
    description: 'Определение уровня воспринимаемого стресса в течение последнего месяца.',
    timeToComplete: '5-10 минут',
    questions: 10,
    category: 'stress',
    lastCompleted: '05.05.2023',
    image: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d',
  },
  {
    id: 4,
    title: 'Шкала психологического благополучия Рифф',
    description: 'Оценка различных аспектов психологического благополучия.',
    timeToComplete: '15-20 минут',
    questions: 42,
    category: 'wellbeing',
    lastCompleted: null,
    image: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d',
  },
  {
    id: 5,
    title: 'Шкала тревоги и депрессии (HADS)',
    description: 'Скрининговый инструмент для выявления тревоги и депрессии.',
    timeToComplete: '5-7 минут',
    questions: 14,
    category: 'anxiety',
    lastCompleted: '23.03.2023',
    image: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d',
  },
  {
    id: 6,
    title: 'Опросник качества жизни ВОЗ (WHOQOL-BREF)',
    description: 'Оценка качества жизни в контексте восприятия человеком своего положения в жизни.',
    timeToComplete: '10-15 минут',
    questions: 26,
    category: 'wellbeing',
    lastCompleted: null,
    image: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d',
  },
];

// Categories for filtering
const categories = [
  { id: 'all', name: 'Все тесты' },
  { id: 'depression', name: 'Депрессия' },
  { id: 'anxiety', name: 'Тревожность' },
  { id: 'stress', name: 'Стресс' },
  { id: 'wellbeing', name: 'Благополучие' },
];

const TestsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter tests based on category and search term
  const filteredTests = availableTests.filter((test) => {
    const matchesCategory = selectedCategory === 'all' || test.category === selectedCategory;
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          test.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Психологические тесты</h1>
        <p className="text-gray-600">
          Пройдите проверенные психологические тесты и получите оценку своего состояния.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-2 text-sm font-medium rounded-full transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary-100 text-primary-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Найти тест..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredTests.map((test, index) => (
          <motion.div
            key={test.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card hover className="h-full flex flex-col">
              <img
                src={test.image}
                alt={test.title}
                className="h-40 w-full object-cover rounded-t-lg -mt-6 -mx-6 mb-4"
              />
              
              <h3 className="text-lg font-semibold mb-2">{test.title}</h3>
              <p className="text-gray-600 text-sm mb-4 flex-grow">{test.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <FaClock className="mr-1" />
                  <span>{test.timeToComplete}</span>
                </div>
                <div className="flex items-center">
                  <FaChartLine className="mr-1" />
                  <span>{test.questions} вопросов</span>
                </div>
              </div>
              
              {test.lastCompleted && (
                <div className="mb-4 text-sm flex items-center text-gray-500">
                  <FaHistory className="mr-1" />
                  <span>Пройден: {test.lastCompleted}</span>
                </div>
              )}
              
              <Link to={`/tests/${test.id}`}>
                <Button variant="primary" fullWidth>
                  {test.lastCompleted ? 'Пройти снова' : 'Начать тест'}
                </Button>
              </Link>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredTests.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Тесты не найдены</h3>
          <p className="text-gray-600">
            Попробуйте изменить параметры поиска или выбрать другую категорию.
          </p>
        </div>
      )}

      {/* Recommended Tests */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Рекомендуемые тесты</h2>
        <p className="text-gray-600 mb-6">
          Эти тесты подобраны специально для вас на основе вашей истории и профиля.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {availableTests.slice(0, 3).map((test, index) => (
            <motion.div
              key={`rec-${test.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
            >
              <Card hover>
                <h3 className="font-medium mb-2">{test.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{test.description.substring(0, 60)}...</p>
                <Link to={`/tests/${test.id}`}>
                  <Button variant="outline" size="sm" fullWidth>
                    Подробнее
                  </Button>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default TestsPage;
