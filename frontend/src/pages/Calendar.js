import { useState } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { motion } from 'framer-motion';
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ru } from 'date-fns/locale';
import { FaPlus, FaCheck, FaTimes, FaChevronLeft, FaChevronRight, FaPills, FaClock, FaCalendarDay } from 'react-icons/fa';

// Mock medication data
const initialMedications = [
  { 
    id: 1, 
    name: 'Амитриптилин', 
    dosage: '25 мг', 
    frequency: 'Ежедневно', 
    time: '09:00',
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    startDate: new Date(2023, 3, 15).toISOString(),
    endDate: new Date(2023, 6, 15).toISOString(),
    color: 'bg-primary-500',
    notes: 'Принимать после еды',
  },
  { 
    id: 2, 
    name: 'Пароксетин', 
    dosage: '20 мг', 
    frequency: 'Ежедневно', 
    time: '20:00',
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    startDate: new Date(2023, 2, 10).toISOString(),
    endDate: null,
    color: 'bg-secondary-500',
    notes: 'Принимать перед сном',
  },
  { 
    id: 3, 
    name: 'Алпразолам', 
    dosage: '0.5 мг', 
    frequency: 'По необходимости', 
    time: 'По необходимости',
    days: [],
    startDate: new Date(2023, 4, 1).toISOString(),
    endDate: null,
    color: 'bg-blush-500',
    notes: 'Максимум 3 таблетки в день',
  },
];

// Mock adherence data
const adherenceData = [
  { date: new Date(2023, 4, 1).toISOString(), medications: [1, 2] },
  { date: new Date(2023, 4, 2).toISOString(), medications: [1, 2] },
  { date: new Date(2023, 4, 3).toISOString(), medications: [1] },
  { date: new Date(2023, 4, 4).toISOString(), medications: [1, 2] },
  { date: new Date(2023, 4, 5).toISOString(), medications: [1, 2, 3] },
  { date: new Date(2023, 4, 6).toISOString(), medications: [1, 2] },
  { date: new Date(2023, 4, 7).toISOString(), medications: [2] },
  { date: new Date(2023, 4, 8).toISOString(), medications: [1, 2] },
  { date: new Date(2023, 4, 9).toISOString(), medications: [1, 2] },
  { date: new Date(2023, 4, 10).toISOString(), medications: [1, 2] },
  { date: new Date(2023, 4, 11).toISOString(), medications: [1, 2] },
  // Today and future dates don't have adherence data yet
];

// Get today's medications
const getTodayMedications = () => {
  const today = new Date();
  const dayOfWeek = format(today, 'EEEE', { locale: ru }).toLowerCase();
  return initialMedications.filter(med => 
    med.days.includes(dayOfWeek) || med.frequency === 'По необходимости'
  );
};

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [medications, setMedications] = useState(initialMedications);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: 'Ежедневно',
    time: '',
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    startDate: new Date().toISOString(),
    endDate: null,
    color: 'bg-primary-500',
    notes: '',
  });
  const [activeTab, setActiveTab] = useState('calendar');

  // Get today's medications
  const todayMedications = getTodayMedications();

  // Get medications for selected date
  const getSelectedDateMedications = () => {
    const dayOfWeek = format(selectedDate, 'EEEE', { locale: ru }).toLowerCase();
    return medications.filter(med => 
      med.days.includes(dayOfWeek) || med.frequency === 'По необходимости'
    );
  };

  // Check if medication was taken on selected date
  const wasMedicationTaken = (medicationId) => {
    const record = adherenceData.find(ad => 
      isSameDay(new Date(ad.date), selectedDate) && ad.medications.includes(medicationId)
    );
    return !!record;
  };

  // Previous and next month navigation
  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // Add new medication
  const handleAddMedication = () => {
    const id = medications.length + 1;
    setMedications([...medications, { ...newMedication, id }]);
    setShowAddModal(false);
    setNewMedication({
      name: '',
      dosage: '',
      frequency: 'Ежедневно',
      time: '',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      startDate: new Date().toISOString(),
      endDate: null,
      color: 'bg-primary-500',
      notes: '',
    });
  };

  // Calendar render helpers
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
        
        // Check if day has any medications
        const dayOfWeek = format(day, 'EEEE', { locale: ru }).toLowerCase();
        const hasMedications = medications.some(med => med.days.includes(dayOfWeek));
        
        // Check if all medications for the day were taken
        const isToday = isSameDay(day, new Date());
        const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));
        
        // Check if day has adherence data
        const adherenceRecord = adherenceData.find(ad => isSameDay(new Date(ad.date), day));
        const allTaken = adherenceRecord && medications
          .filter(med => med.days.includes(dayOfWeek))
          .every(med => adherenceRecord.medications.includes(med.id));
        
        days.push(
          <div
            key={day}
            className={`py-2 px-1 border-t relative ${
              !isSameMonth(day, monthStart)
                ? 'text-gray-300'
                : 'text-gray-900 hover:bg-gray-100'
            } ${isSameDay(day, selectedDate) ? 'bg-primary-50' : ''}`}
            onClick={() => setSelectedDate(cloneDay)}
          >
            <div className={`
              w-8 h-8 mx-auto flex items-center justify-center rounded-full
              ${isToday ? 'bg-primary-100 font-bold text-primary-800' : ''}
            `}>
              {formattedDate}
            </div>
            
            {hasMedications && isSameMonth(day, monthStart) && (
              <div className="flex justify-center mt-1 space-x-1">
                {isPast ? (
                  allTaken ? (
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                  )
                ) : (
                  <span className="h-2 w-2 rounded-full bg-primary-300"></span>
                )}
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

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Календарь приема лекарств</h1>
        <p className="text-gray-600">
          Управляйте графиком приема лекарств и отслеживайте соблюдение режима.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'calendar'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('calendar')}
          >
            Календарь
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'medications'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('medications')}
          >
            Мои лекарства
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'today'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('today')}
          >
            Сегодня
          </button>
        </div>
      </div>

      {/* Calendar Tab */}
      {activeTab === 'calendar' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                {renderHeader()}
                {renderDays()}
                {renderCells()}
              </Card>
            </div>
            <div>
              <Card>
                <h3 className="font-medium text-lg mb-4">
                  {format(selectedDate, 'PPP', { locale: ru })}
                </h3>
                
                {getSelectedDateMedications().length > 0 ? (
                  <div className="space-y-4">
                    {getSelectedDateMedications().map((med) => (
                      <div 
                        key={med.id} 
                        className={`p-3 rounded-lg border-l-4 ${med.color.replace('bg-', 'border-')}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{med.name}</h4>
                            <p className="text-sm text-gray-600">{med.dosage} - {med.time}</p>
                            {med.notes && (
                              <p className="text-xs text-gray-500 mt-1">{med.notes}</p>
                            )}
                          </div>
                          
                          {isSameDay(selectedDate, new Date()) || selectedDate < new Date() ? (
                            <button 
                              className={`p-2 rounded-full ${
                                wasMedicationTaken(med.id) 
                                  ? 'bg-green-100 text-green-600' 
                                  : 'bg-gray-100 text-gray-500 hover:bg-primary-100 hover:text-primary-600'
                              }`}
                            >
                              {wasMedicationTaken(med.id) ? (
                                <FaCheck className="h-4 w-4" />
                              ) : (
                                <FaPills className="h-4 w-4" />
                              )}
                            </button>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Нет лекарств на этот день</p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </motion.div>
      )}

      {/* Medications Tab */}
      {activeTab === 'medications' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Мои лекарства</h3>
            <Button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-1"
            >
              <FaPlus />
              <span>Добавить лекарство</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medications.map((med) => (
              <Card key={med.id} className="relative">
                <div className={`h-2 w-full absolute top-0 left-0 right-0 rounded-t-lg ${med.color}`}></div>
                <div className="pt-2">
                  <h3 className="font-semibold text-lg mb-1">{med.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <FaPills className="mr-2 text-gray-400" />
                      <span>Дозировка: {med.dosage}</span>
                    </div>
                    <div className="flex items-center">
                      <FaClock className="mr-2 text-gray-400" />
                      <span>Время: {med.time}</span>
                    </div>
                    <div className="flex items-center">
                      <FaCalendarDay className="mr-2 text-gray-400" />
                      <span>Частота: {med.frequency}</span>
                    </div>
                  </div>
                  
                  {med.notes && (
                    <div className="mt-4 p-2 bg-gray-50 rounded text-xs text-gray-600">
                      {med.notes}
                    </div>
                  )}
                  
                  <div className="mt-4 flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Изменить
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 text-red-600 border-red-200 hover:bg-red-50">
                      Удалить
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {/* Today Tab */}
      {activeTab === 'today' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">
              Лекарства на сегодня - {format(new Date(), 'PPP', { locale: ru })}
            </h3>
            <p className="text-gray-600">
              Не забудьте принять все назначенные лекарства вовремя.
            </p>
          </div>

          {todayMedications.length > 0 ? (
            <div className="space-y-4">
              {todayMedications.map((med) => {
                const isTaken = adherenceData.find(ad => 
                  isSameDay(new Date(ad.date), new Date()) && 
                  ad.medications.includes(med.id)
                );
                
                return (
                  <Card key={med.id} className="border-l-4 border-l-primary-500">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-lg">{med.name}</h4>
                        <p className="text-gray-600">{med.dosage}</p>
                        <p className="text-sm text-gray-500">
                          Время: <span className="font-medium">{med.time}</span>
                        </p>
                        {med.notes && (
                          <p className="mt-1 text-xs text-gray-500">{med.notes}</p>
                        )}
                      </div>
                      
                      <Button
                        variant={isTaken ? 'secondary' : 'primary'}
                        className="flex items-center space-x-1"
                        disabled={isTaken}
                      >
                        {isTaken ? (
                          <>
                            <FaCheck />
                            <span>Принято</span>
                          </>
                        ) : (
                          <>
                            <FaPills />
                            <span>Отметить принятым</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-lg text-gray-600 mb-2">На сегодня нет назначенных лекарств</p>
              <Button 
                variant="primary" 
                onClick={() => {
                  setActiveTab('medications');
                  setShowAddModal(true);
                }}
                className="mt-4"
              >
                Добавить лекарство
              </Button>
            </div>
          )}
        </motion.div>
      )}

      {/* Add Medication Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Добавить новое лекарство</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="space-y-4">
                <Input
                  label="Название лекарства"
                  id="med-name"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                  placeholder="Введите название"
                  required
                />
                
                <Input
                  label="Дозировка"
                  id="med-dosage"
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                  placeholder="Напр. 25 мг"
                  required
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Частота приема
                  </label>
                  <select
                    value={newMedication.frequency}
                    onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
                  >
                    <option value="Ежедневно">Ежедневно</option>
                    <option value="По дням недели">По дням недели</option>
                    <option value="По необходимости">По необходимости</option>
                  </select>
                </div>
                
                <Input
                  label="Время приема"
                  id="med-time"
                  type="time"
                  value={newMedication.time}
                  onChange={(e) => setNewMedication({ ...newMedication, time: e.target.value })}
                  required
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Дополнительная информация
                  </label>
                  <textarea
                    value={newMedication.notes}
                    onChange={(e) => setNewMedication({ ...newMedication, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
                    rows={3}
                    placeholder="Напр. принимать после еды"
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddModal(false)}
                  >
                    Отмена
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleAddMedication}
                    disabled={!newMedication.name || !newMedication.dosage || !newMedication.time}
                  >
                    Добавить
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </MainLayout>
  );
};

export default Calendar;
