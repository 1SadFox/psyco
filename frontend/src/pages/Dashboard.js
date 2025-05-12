import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMood } from '../context/MoodContext';
import MainLayout from '../components/Layout/MainLayout';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import MoodCalendar from '../components/MoodTracker/MoodCalendar';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaComments, FaClipboardList, FaChartLine } from 'react-icons/fa';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Mock data for charts
const moodData = {
  labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
  datasets: [
    {
      label: 'Настроение',
      data: [7, 5, 6, 4, 5, 8, 7],
      borderColor: 'rgb(140, 85, 232)',
      backgroundColor: 'rgba(140, 85, 232, 0.5)',
      tension: 0.3,
    },
  ],
};

const stressData = {
  labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
  datasets: [
    {
      label: 'Уровень стресса',
      data: [3, 6, 4, 7, 5, 2, 4],
      borderColor: 'rgb(232, 29, 98)',
      backgroundColor: 'rgba(232, 29, 98, 0.5)',
      tension: 0.3,
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
  scales: {
    y: {
      min: 0,
      max: 10,
    },
  },
};

// Mock test reminders
const testReminders = [
  { id: 1, title: 'Тест тревожности', description: 'Проверьте уровень тревожности', path: '/tests/anxiety' },
  { id: 2, title: 'Оценка стресса', description: 'Оцените уровень стресса', path: '/tests/stress' },
];

// Mock medication reminders
const medicationReminders = [
  { id: 1, name: 'Амитриптилин', time: '09:00', taken: false },
  { id: 2, name: 'Пароксетин', time: '20:00', taken: true },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [stats, setStats] = useState({
    testsCompleted: 0,
    medicationAdherence: 0,
    lastCheckIn: null,
    nextTest: null,
  });

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Доброе утро');
    } else if (hour < 18) {
      setGreeting('Добрый день');
    } else {
      setGreeting('Добрый вечер');
    }

    // Set mock stats
    setStats({
      testsCompleted: 3,
      medicationAdherence: 85,
      lastCheckIn: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU'),
      nextTest: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU'),
    });
  }, []);

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {greeting}, {user?.name || 'Пользователь'}!
        </h1>
        <p className="text-gray-600">
          Вот ваш обзор психологического здоровья на сегодня.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="h-full">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary-100 text-primary-600">
                <FaClipboardList className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Пройдено тестов</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.testsCompleted}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-secondary-100 text-secondary-600">
                <FaCalendarAlt className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Прием лекарств</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.medicationAdherence}%</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="h-full">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blush-100 text-blush-600">
                <FaComments className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Последний чекап</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.lastCheckIn}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="h-full">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FaChartLine className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Следующий тест</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.nextTest}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <h2 className="text-lg font-medium mb-4">Настроение за неделю</h2>
            <Line data={moodData} options={chartOptions} />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <h2 className="text-lg font-medium mb-4">Уровень стресса за неделю</h2>
            <Line data={stressData} options={chartOptions} />
          </Card>
        </motion.div>
      </div>

      {/* Mood Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mb-8"
      >
        <MoodCalendar />
      </motion.div>

      {/* Recommendations and Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Test Reminders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Рекомендуемые тесты</h2>
              <Link to="/tests">
                <Button variant="ghost" size="sm">
                  Все тесты
                </Button>
              </Link>
            </div>
            
            <div className="space-y-3">
              {testReminders.map((test) => (
                <div key={test.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">{test.title}</h3>
                    <p className="text-sm text-gray-500">{test.description}</p>
                  </div>
                  <Link to={test.path}>
                    <Button size="sm">Пройти</Button>
                  </Link>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Medication Reminders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Прием лекарств сегодня</h2>
              <Link to="/calendar">
                <Button variant="ghost" size="sm">
                  Календарь
                </Button>
              </Link>
            </div>
            
            <div className="space-y-3">
              {medicationReminders.map((med) => (
                <div key={med.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">{med.name}</h3>
                    <p className="text-sm text-gray-500">Время: {med.time}</p>
                  </div>
                  <Button 
                    size="sm"
                    variant={med.taken ? 'secondary' : 'primary'}
                    disabled={med.taken}
                  >
                    {med.taken ? 'Принято' : 'Отметить'}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Card>
          <h2 className="text-lg font-medium mb-4">Быстрые действия</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/tests">
              <Button variant="outline" fullWidth className="flex items-center justify-center space-x-2 py-3">
                <FaClipboardList />
                <span>Пройти тест</span>
              </Button>
            </Link>
            
            <Link to="/calendar">
              <Button variant="outline" fullWidth className="flex items-center justify-center space-x-2 py-3">
                <FaCalendarAlt />
                <span>Календарь лекарств</span>
              </Button>
            </Link>
            
            <Link to="/chat">
              <Button variant="outline" fullWidth className="flex items-center justify-center space-x-2 py-3">
                <FaComments />
                <span>Чат с ботом</span>
              </Button>
            </Link>
            
            <Link to="/profile">
              <Button variant="outline" fullWidth className="flex items-center justify-center space-x-2 py-3">
                <FaChartLine />
                <span>Моя статистика</span>
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>
    </MainLayout>
  );
};

export default Dashboard;
