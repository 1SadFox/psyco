import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { motion } from 'framer-motion';

// Mock test data
const tests = {
  1: {
    id: 1,
    title: 'Шкала депрессии Бека (BDI)',
    description: 'Оценка наличия и степени тяжести депрессивных симптомов.',
    timeToComplete: '10-15 минут',
    questions: [
      {
        id: 1,
        question: 'Как вы оцениваете свое настроение?',
        options: [
          { value: 0, text: 'Я не чувствую себя грустным.' },
          { value: 1, text: 'Мне грустно или печально.' },
          { value: 2, text: 'Я все время грустный и не могу избавиться от этого чувства.' },
          { value: 3, text: 'Я настолько грустный и несчастный, что не могу этого вынести.' },
        ],
      },
      {
        id: 2,
        question: 'Как вы смотрите на будущее?',
        options: [
          { value: 0, text: 'Я не испытываю особого пессимизма или разочарования в будущем.' },
          { value: 1, text: 'Я чувствую разочарование в будущем.' },
          { value: 2, text: 'Я чувствую, что мне нечего ждать от будущего.' },
          { value: 3, text: 'Я чувствую, что будущее безнадежно и ничего не может измениться к лучшему.' },
        ],
      },
      {
        id: 3,
        question: 'Как вы оцениваете свою жизнь в целом?',
        options: [
          { value: 0, text: 'Я не чувствую себя неудачником.' },
          { value: 1, text: 'Я чувствую, что у меня было больше неудач, чем у большинства людей.' },
          { value: 2, text: 'Когда я оглядываюсь на свою жизнь, я вижу только череду неудач.' },
          { value: 3, text: 'Я чувствую себя полным неудачником.' },
        ],
      },
      {
        id: 4,
        question: 'Получаете ли вы удовольствие от ранее приятных занятий?',
        options: [
          { value: 0, text: 'Я получаю такое же удовольствие, как и раньше.' },
          { value: 1, text: 'Я не получаю удовольствие от вещей так, как раньше.' },
          { value: 2, text: 'Я больше не получаю удовлетворения ни от чего.' },
          { value: 3, text: 'Я всем недоволен или мне все безразлично.' },
        ],
      },
      {
        id: 5,
        question: 'Испытываете ли вы чувство вины?',
        options: [
          { value: 0, text: 'Я не чувствую себя особенно виноватым.' },
          { value: 1, text: 'Я чувствую себя виноватым по многим поводам.' },
          { value: 2, text: 'Я чувствую себя очень виноватым большую часть времени.' },
          { value: 3, text: 'Я чувствую себя виноватым все время.' },
        ],
      },
    ],
    interpretations: [
      { min: 0, max: 9, result: 'Отсутствие депрессивных симптомов', recommendations: ['Поддерживайте здоровый образ жизни', 'Регулярно занимайтесь спортом', 'Практикуйте техники управления стрессом'] },
      { min: 10, max: 18, result: 'Легкая депрессия', recommendations: ['Практикуйте техники релаксации', 'Поддерживайте социальные связи', 'Рассмотрите возможность консультации с психологом'] },
      { min: 19, max: 29, result: 'Умеренная депрессия', recommendations: ['Обратитесь к психологу или психотерапевту', 'Регулярно выполняйте рекомендации специалиста', 'Поддерживайте режим дня'] },
      { min: 30, max: 63, result: 'Тяжелая депрессия', recommendations: ['Срочно обратитесь к психиатру', 'Следуйте назначенному лечению', 'Поддерживайте контакт с близкими людьми'] },
    ],
  },
  2: {
    id: 2,
    title: 'Шкала тревоги Спилбергера (STAI)',
    description: 'Измерение уровня ситуативной и личностной тревожности.',
    timeToComplete: '10-15 минут',
    questions: [
      {
        id: 1,
        question: 'Я спокоен',
        options: [
          { value: 4, text: 'Совсем нет' },
          { value: 3, text: 'Пожалуй, так' },
          { value: 2, text: 'Верно' },
          { value: 1, text: 'Совершенно верно' },
        ],
      },
      {
        id: 2,
        question: 'Мне ничто не угрожает',
        options: [
          { value: 4, text: 'Совсем нет' },
          { value: 3, text: 'Пожалуй, так' },
          { value: 2, text: 'Верно' },
          { value: 1, text: 'Совершенно верно' },
        ],
      },
      {
        id: 3,
        question: 'Я нахожусь в напряжении',
        options: [
          { value: 1, text: 'Совсем нет' },
          { value: 2, text: 'Пожалуй, так' },
          { value: 3, text: 'Верно' },
          { value: 4, text: 'Совершенно верно' },
        ],
      },
      {
        id: 4,
        question: 'Я испытываю сожаление',
        options: [
          { value: 1, text: 'Совсем нет' },
          { value: 2, text: 'Пожалуй, так' },
          { value: 3, text: 'Верно' },
          { value: 4, text: 'Совершенно верно' },
        ],
      },
      {
        id: 5,
        question: 'Я чувствую себя свободно',
        options: [
          { value: 4, text: 'Совсем нет' },
          { value: 3, text: 'Пожалуй, так' },
          { value: 2, text: 'Верно' },
          { value: 1, text: 'Совершенно верно' },
        ],
      },
    ],
    interpretations: [
      { min: 0, max: 30, result: 'Низкий уровень тревоги', recommendations: ['Продолжайте поддерживать здоровый образ жизни', 'Практикуйте методы релаксации для поддержания баланса'] },
      { min: 31, max: 44, result: 'Умеренный уровень тревоги', recommendations: ['Обратите внимание на ситуации, вызывающие тревогу', 'Практикуйте дыхательные упражнения', 'Рассмотрите возможность консультации специалиста'] },
      { min: 45, max: 80, result: 'Высокий уровень тревоги', recommendations: ['Обратитесь к психологу или психотерапевту', 'Освойте техники управления тревогой', 'Следите за режимом сна и отдыха'] },
    ],
  },
};

const TestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [currentStep, setCurrentStep] = useState('intro'); // intro, test, result
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState({
    score: 0,
    interpretation: null,
    recommendations: [],
  });

  useEffect(() => {
    // Fetch test data
    const testData = tests[id];
    if (testData) {
      setTest(testData);
      // Initialize answers
      const initialAnswers = {};
      testData.questions.forEach((q) => {
        initialAnswers[q.id] = null;
      });
      setAnswers(initialAnswers);
    } else {
      navigate('/tests');
    }
  }, [id, navigate]);

  // Handle answer selection
  const handleAnswerSelect = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value,
    });
  };

  // Navigate to next question
  const nextQuestion = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate result
      calculateResult();
      setCurrentStep('result');
    }
  };

  // Navigate to previous question
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Calculate test result
  const calculateResult = () => {
    const score = Object.values(answers).reduce((total, value) => total + value, 0);
    
    // Find interpretation based on score
    const interpretation = test.interpretations.find(
      (interp) => score >= interp.min && score <= interp.max
    );
    
    setResult({
      score,
      interpretation: interpretation.result,
      recommendations: interpretation.recommendations,
    });
  };

  // Start the test
  const startTest = () => {
    setCurrentStep('test');
  };

  // Restart the test
  const restartTest = () => {
    // Reset answers
    const initialAnswers = {};
    test.questions.forEach((q) => {
      initialAnswers[q.id] = null;
    });
    setAnswers(initialAnswers);
    setCurrentQuestionIndex(0);
    setCurrentStep('intro');
  };

  if (!test) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Загрузка теста...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Intro Step */}
      {currentStep === 'intro' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <div className="flex flex-col items-center text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{test.title}</h1>
              <p className="text-gray-600 mb-6 max-w-2xl">{test.description}</p>
              
              <img
                src="https://images.unsplash.com/photo-1509228627152-72ae9ae6848d"
                alt={test.title}
                className="w-full max-w-md rounded-lg mb-6"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-md mb-6">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Вопросов</p>
                  <p className="text-xl font-semibold text-gray-900">{test.questions.length}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Время</p>
                  <p className="text-xl font-semibold text-gray-900">{test.timeToComplete}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Сложность</p>
                  <p className="text-xl font-semibold text-gray-900">Средняя</p>
                </div>
              </div>
              
              <div className="bg-primary-50 p-4 rounded-lg text-primary-800 mb-6 max-w-md">
                <p className="text-sm">
                  Этот тест поможет оценить ваше психологическое состояние. Отвечайте на вопросы честно, выбирая наиболее подходящий для вас вариант ответа.
                </p>
              </div>
              
              <Button
                onClick={startTest}
                size="lg"
                className="mt-4"
              >
                Начать тест
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Test Step */}
      {currentStep === 'test' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500"
                  style={{ width: `${((currentQuestionIndex + 1) / test.questions.length) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>Вопрос {currentQuestionIndex + 1} из {test.questions.length}</span>
                <span>{Math.round(((currentQuestionIndex + 1) / test.questions.length) * 100)}%</span>
              </div>
            </div>
            
            {/* Current Question */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">
                {test.questions[currentQuestionIndex].question}
              </h2>
              
              <div className="space-y-3">
                {test.questions[currentQuestionIndex].options.map((option) => (
                  <div key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      id={`option-${option.value}`}
                      name={`question-${test.questions[currentQuestionIndex].id}`}
                      value={option.value}
                      checked={answers[test.questions[currentQuestionIndex].id] === option.value}
                      onChange={() => handleAnswerSelect(test.questions[currentQuestionIndex].id, option.value)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <label htmlFor={`option-${option.value}`} className="ml-3 block text-gray-700">
                      {option.text}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Назад
              </Button>
              
              <Button
                onClick={nextQuestion}
                disabled={answers[test.questions[currentQuestionIndex].id] === null}
              >
                {currentQuestionIndex < test.questions.length - 1 ? 'Далее' : 'Завершить тест'}
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Result Step */}
      {currentStep === 'result' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Результаты теста</h2>
              <p className="text-gray-600">{test.title}</p>
            </div>
            
            <div className="mb-6">
              <div className="bg-primary-50 text-primary-800 rounded-lg p-6 text-center mb-6">
                <h3 className="text-lg font-semibold mb-1">Ваш результат:</h3>
                <p className="text-3xl font-bold mb-2">{result.interpretation}</p>
                <p className="text-sm">Общий балл: {result.score}</p>
              </div>
              
              <h3 className="text-lg font-medium mb-3">Рекомендации:</h3>
              <ul className="space-y-2">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-5 h-5 bg-primary-100 text-primary-700 rounded-full flex-shrink-0 mr-2 text-center">
                      {index + 1}
                    </span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Обратите внимание:</span> Этот тест предназначен только для самооценки и не заменяет профессиональную диагностику. Если у вас есть опасения относительно вашего психического здоровья, пожалуйста, обратитесь к квалифицированному специалисту.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Button
                variant="outline"
                onClick={restartTest}
              >
                Пройти тест заново
              </Button>
              
              <Button
                onClick={() => navigate('/tests')}
              >
                Вернуться к тестам
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </MainLayout>
  );
};

export default TestDetail;
