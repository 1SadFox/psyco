import { useState } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle, FaLock, FaBell, FaDownload, FaChartLine } from 'react-icons/fa';

const Profile = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    avatar: null,
    notifications: {
      email: true,
      app: true,
      reminders: true,
    },
    dataSharing: {
      anonymous: true,
      research: false,
    },
  });
  const [errors, setErrors] = useState({});

  // Mock user statistics
  const userStats = {
    testsCompleted: 7,
    medAdherence: 82,
    chatSessions: 5,
    moodAverage: 6.8,
    lastActive: '23.05.2023',
    joinDate: user?.joinDate ? new Date(user.joinDate).toLocaleDateString('ru-RU') : new Date().toLocaleDateString('ru-RU'),
  };

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
    
    // Clear any errors
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (category, name) => {
    setUserData({
      ...userData,
      [category]: {
        ...userData[category],
        [name]: !userData[category][name],
      },
    });
  };

  // Handle profile update
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    if (!userData.name) {
      newErrors.name = 'Введите ваше имя';
    }
    
    if (!userData.email) {
      newErrors.email = 'Введите ваш email';
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = 'Введите корректный email';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      // Success feedback
      alert('Профиль успешно обновлен');
    }
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    if (!userData.currentPassword) {
      newErrors.currentPassword = 'Введите текущий пароль';
    }
    
    if (!userData.newPassword) {
      newErrors.newPassword = 'Введите новый пароль';
    } else if (userData.newPassword.length < 6) {
      newErrors.newPassword = 'Пароль должен содержать не менее 6 символов';
    }
    
    if (!userData.confirmPassword) {
      newErrors.confirmPassword = 'Подтвердите новый пароль';
    } else if (userData.newPassword !== userData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      // Success feedback
      alert('Пароль успешно изменен');
      setUserData({
        ...userData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  };

  // Handle account deletion confirmation
  const handleDeleteAccount = () => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить свой аккаунт? Это действие нельзя отменить.');
    
    if (confirmed) {
      // In a real application, we would make an API call here
      // For this demo, we'll just log out the user
      logout();
    }
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Мой профиль</h1>
        <p className="text-gray-600">
          Управляйте личными данными, настройками и просматривайте статистику.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 mb-3">
                {userData.avatar ? (
                  <img
                    src={userData.avatar}
                    alt="Avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="w-16 h-16" />
                )}
              </div>
              <h3 className="font-medium text-lg">{userData.name}</h3>
              <p className="text-sm text-gray-500">{userData.email}</p>
              <p className="text-xs text-gray-400 mt-1">
                С нами с {userStats.joinDate}
              </p>
            </div>

            <nav className="space-y-1 mt-4">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'profile'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FaUserCircle className="mr-3 h-4 w-4" />
                Личные данные
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'security'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FaLock className="mr-3 h-4 w-4" />
                Безопасность
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'notifications'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FaBell className="mr-3 h-4 w-4" />
                Уведомления
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'stats'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FaChartLine className="mr-3 h-4 w-4" />
                Моя статистика
              </button>
              <button
                onClick={() => setActiveTab('data')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'data'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FaDownload className="mr-3 h-4 w-4" />
                Мои данные
              </button>
            </nav>

            <div className="mt-8 pt-6 border-t">
              <Button
                variant="outline"
                className="w-full text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleDeleteAccount}
              >
                Удалить аккаунт
              </Button>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <h2 className="text-lg font-medium mb-6">Личные данные</h2>
                
                <form onSubmit={handleProfileUpdate}>
                  <div className="space-y-4">
                    <Input
                      label="Имя"
                      id="name"
                      name="name"
                      value={userData.name}
                      onChange={handleInputChange}
                      error={errors.name}
                    />
                    
                    <Input
                      label="Email"
                      id="email"
                      name="email"
                      type="email"
                      value={userData.email}
                      onChange={handleInputChange}
                      error={errors.email}
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Фото профиля
                      </label>
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 mr-4">
                          {userData.avatar ? (
                            <img
                              src={userData.avatar}
                              alt="Avatar"
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <FaUserCircle className="w-8 h-8" />
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-2"
                          type="button"
                        >
                          Загрузить
                        </Button>
                        {userData.avatar && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            type="button"
                            onClick={() => setUserData({ ...userData, avatar: null })}
                          >
                            Удалить
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Button type="submit">
                      Сохранить изменения
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <h2 className="text-lg font-medium mb-6">Безопасность</h2>
                
                <form onSubmit={handlePasswordChange}>
                  <div className="space-y-4">
                    <Input
                      label="Текущий пароль"
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={userData.currentPassword}
                      onChange={handleInputChange}
                      error={errors.currentPassword}
                    />
                    
                    <Input
                      label="Новый пароль"
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={userData.newPassword}
                      onChange={handleInputChange}
                      error={errors.newPassword}
                    />
                    
                    <Input
                      label="Подтверждение пароля"
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={userData.confirmPassword}
                      onChange={handleInputChange}
                      error={errors.confirmPassword}
                    />
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Button type="submit">
                      Изменить пароль
                    </Button>
                  </div>
                </form>
                
                <div className="mt-8 pt-6 border-t">
                  <h3 className="text-md font-medium mb-4">Сессии</h3>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">Текущая сессия</p>
                        <p className="text-xs text-gray-500">Последняя активность: только что</p>
                      </div>
                      <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                        Активная
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <h2 className="text-lg font-medium mb-6">Настройки уведомлений</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-medium mb-3">Email-уведомления</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          id="email-notifications"
                          name="email"
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          checked={userData.notifications.email}
                          onChange={() => handleCheckboxChange('notifications', 'email')}
                        />
                        <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-700">
                          Получать уведомления по email
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium mb-3">Уведомления в приложении</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          id="app-notifications"
                          name="app"
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          checked={userData.notifications.app}
                          onChange={() => handleCheckboxChange('notifications', 'app')}
                        />
                        <label htmlFor="app-notifications" className="ml-2 block text-sm text-gray-700">
                          Показывать уведомления в приложении
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium mb-3">Напоминания</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          id="reminder-notifications"
                          name="reminders"
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          checked={userData.notifications.reminders}
                          onChange={() => handleCheckboxChange('notifications', 'reminders')}
                        />
                        <label htmlFor="reminder-notifications" className="ml-2 block text-sm text-gray-700">
                          Напоминания о приеме лекарств
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t">
                    <h3 className="text-md font-medium mb-3">Обмен данными</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          id="anonymous-data"
                          name="anonymous"
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          checked={userData.dataSharing.anonymous}
                          onChange={() => handleCheckboxChange('dataSharing', 'anonymous')}
                        />
                        <label htmlFor="anonymous-data" className="ml-2 block text-sm text-gray-700">
                          Отправлять анонимные данные для улучшения сервиса
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="research-data"
                          name="research"
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          checked={userData.dataSharing.research}
                          onChange={() => handleCheckboxChange('dataSharing', 'research')}
                        />
                        <label htmlFor="research-data" className="ml-2 block text-sm text-gray-700">
                          Разрешить использовать данные для научных исследований
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button>
                    Сохранить настройки
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <h2 className="text-lg font-medium mb-6">Моя статистика</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-primary-50 rounded-lg p-4">
                    <p className="text-sm text-primary-600 mb-1">Пройдено тестов</p>
                    <p className="text-2xl font-bold text-primary-800">{userStats.testsCompleted}</p>
                  </div>
                  
                  <div className="bg-secondary-50 rounded-lg p-4">
                    <p className="text-sm text-secondary-600 mb-1">Прием лекарств</p>
                    <p className="text-2xl font-bold text-secondary-800">{userStats.medAdherence}%</p>
                  </div>
                  
                  <div className="bg-blush-50 rounded-lg p-4">
                    <p className="text-sm text-blush-600 mb-1">Сессии с чат-ботом</p>
                    <p className="text-2xl font-bold text-blush-800">{userStats.chatSessions}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-md font-medium mb-3">Недавняя активность</h3>
                    <ul className="space-y-2">
                      <li className="bg-gray-50 p-3 rounded-lg text-sm">
                        <div className="flex justify-between">
                          <span>Пройден тест: Шкала тревоги Спилбергера</span>
                          <span className="text-gray-500">21.05.2023</span>
                        </div>
                      </li>
                      <li className="bg-gray-50 p-3 rounded-lg text-sm">
                        <div className="flex justify-between">
                          <span>Диалог с чат-ботом</span>
                          <span className="text-gray-500">20.05.2023</span>
                        </div>
                      </li>
                      <li className="bg-gray-50 p-3 rounded-lg text-sm">
                        <div className="flex justify-between">
                          <span>Добавлено лекарство: Алпразолам</span>
                          <span className="text-gray-500">18.05.2023</span>
                        </div>
                      </li>
                      <li className="bg-gray-50 p-3 rounded-lg text-sm">
                        <div className="flex justify-between">
                          <span>Пройден тест: Шкала депрессии Бека</span>
                          <span className="text-gray-500">15.05.2023</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button variant="outline">
                    Подробная статистика
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Data Tab */}
          {activeTab === 'data' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <h2 className="text-lg font-medium mb-6">Мои данные</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-medium mb-3">Экспорт данных</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Вы можете скачать все ваши данные в формате JSON или CSV.
                    </p>
                    <div className="flex space-x-3">
                      <Button variant="outline" size="sm">
                        Экспорт в JSON
                      </Button>
                      <Button variant="outline" size="sm">
                        Экспорт в CSV
                      </Button>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t">
                    <h3 className="text-md font-medium mb-3">Удаление данных</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Вы можете удалить определенные данные из своего аккаунта.
                    </p>
                    <div className="space-y-3">
                      <div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Удалить историю тестов
                        </Button>
                      </div>
                      <div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Удалить историю чата
                        </Button>
                      </div>
                      <div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Удалить данные о лекарствах
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
