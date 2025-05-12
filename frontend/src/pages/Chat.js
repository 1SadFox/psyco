import { useState, useEffect, useRef } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaRobot, FaUser, FaHistory, FaInfoCircle } from 'react-icons/fa';

// Mock suggestions based on user input
const getSuggestions = (input) => {
  const lowercaseInput = input.toLowerCase();
  
  if (lowercaseInput.includes('депрессия') || lowercaseInput.includes('грусть') || lowercaseInput.includes('тоска')) {
    return [
      'Расскажите подробнее о своих чувствах.',
      'Как давно вы испытываете эти симптомы?',
      'Попробуйте пройти тест на депрессию.',
    ];
  }
  
  if (lowercaseInput.includes('тревога') || lowercaseInput.includes('паника') || lowercaseInput.includes('страх')) {
    return [
      'Опишите физические ощущения, которые вы испытываете.',
      'Есть ли конкретные ситуации, которые вызывают тревогу?',
      'Попробуйте технику глубокого дыхания 4-7-8.',
    ];
  }
  
  if (lowercaseInput.includes('стресс') || lowercaseInput.includes('напряжение') || lowercaseInput.includes('усталость')) {
    return [
      'Что является основным источником стресса?',
      'Попробуйте практику осознанности на 5 минут.',
      'Рекомендую технику прогрессивной мышечной релаксации.',
    ];
  }
  
  if (lowercaseInput.includes('сон') || lowercaseInput.includes('бессонница') || lowercaseInput.includes('спать')) {
    return [
      'Опишите свой режим сна.',
      'Есть ли проблемы с засыпанием или пробуждением?',
      'Попробуйте избегать экранов за час до сна.',
    ];
  }
  
  return [
    'Как вы себя чувствуете сегодня?',
    'Расскажите о своих эмоциях.',
    'Что вас беспокоит?',
  ];
};

// Mock chat responses
const getBotResponse = (message) => {
  const lowercaseMessage = message.toLowerCase();
  
  if (lowercaseMessage.includes('привет') || lowercaseMessage.includes('здравствуй')) {
    return 'Здравствуйте! Я ваш виртуальный ассистент по психологическому здоровью. Как вы себя чувствуете сегодня?';
  }
  
  if (lowercaseMessage.includes('депрессия') || lowercaseMessage.includes('грусть') || lowercaseMessage.includes('тоска')) {
    return 'Я вижу, что вы переживаете непростой период. Чувство грусти и подавленности - это нормальная реакция на сложные обстоятельства. Рекомендую вам пройти тест на депрессию, чтобы лучше понять свое состояние. Также важно обратиться к специалисту для профессиональной консультации. А пока попробуйте выделить 15-20 минут в день на приятные для вас занятия.';
  }
  
  if (lowercaseMessage.includes('тревога') || lowercaseMessage.includes('паника') || lowercaseMessage.includes('страх')) {
    return 'Тревога и страх - это естественные защитные механизмы организма. Когда они становятся чрезмерными, важно использовать техники саморегуляции. Попробуйте технику глубокого дыхания: вдох на 4 счета, задержка на 7 счетов, выдох на 8 счетов. Повторите 5-10 раз. Также рекомендую пройти тест на тревожность, чтобы лучше понять свое состояние.';
  }
  
  if (lowercaseMessage.includes('стресс') || lowercaseMessage.includes('напряжение') || lowercaseMessage.includes('усталость')) {
    return 'Хронический стресс может серьезно влиять на ваше психическое и физическое здоровье. Рекомендую практиковать осознанность и методы релаксации. Попробуйте прогрессивную мышечную релаксацию: напрягайте и расслабляйте группы мышц по очереди. Также важно выделить время на отдых и восстановление. Возможно, стоит пересмотреть свой распорядок дня и найти баланс между работой и отдыхом.';
  }
  
  if (lowercaseMessage.includes('сон') || lowercaseMessage.includes('бессонница') || lowercaseMessage.includes('спать')) {
    return 'Качественный сон - один из ключевых факторов психического здоровья. Рекомендую соблюдать гигиену сна: ложиться и вставать в одно и то же время, избегать кофеина и алкоголя перед сном, не использовать электронные устройства за час до сна. Также полезно создать расслабляющий ритуал перед сном: теплая ванна, чтение, спокойная музыка.';
  }
  
  if (lowercaseMessage.includes('спасибо') || lowercaseMessage.includes('благодарю')) {
    return 'Всегда рад помочь! Если у вас возникнут еще вопросы или вам понадобится поддержка, я здесь для вас.';
  }
  
  return 'Я понимаю ваши чувства. Расскажите подробнее о том, что вы переживаете сейчас. Это поможет мне дать более точные рекомендации для улучшения вашего состояния.';
};

// Mock chat history
const initialChatHistory = [
  {
    id: 1,
    date: '12.05.2023',
    preview: 'Проблемы со сном и тревога',
  },
  {
    id: 2,
    date: '18.05.2023',
    preview: 'Стресс на работе',
  },
  {
    id: 3,
    date: '24.05.2023',
    preview: 'Техники релаксации',
  },
];

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Здравствуйте! Я ваш виртуальный помощник по психологическому здоровью. Расскажите, как вы себя чувствуете сегодня или что вас беспокоит?',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [suggestions, setSuggestions] = useState([
    'Как вы себя чувствуете сегодня?',
    'Расскажите о своих эмоциях.',
    'Что вас беспокоит?',
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState(initialChatHistory);
  const [showHistory, setShowHistory] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputMessage.length > 0) {
      setSuggestions(getSuggestions(inputMessage));
    } else {
      setSuggestions([
        'Как вы себя чувствуете сегодня?',
        'Расскажите о своих эмоциях.',
        'Что вас беспокоит?',
      ]);
    }
  }, [inputMessage]);

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: inputMessage,
      timestamp: new Date().toISOString(),
    };
    
    setMessages([...messages, userMessage]);
    setInputMessage('');
    
    // Bot is typing
    setIsTyping(true);
    
    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        sender: 'bot',
        text: getBotResponse(userMessage.text),
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prevMessages) => [...prevMessages, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const startNewChat = () => {
    const newChatHistory = [
      {
        id: chatHistory.length + 1,
        date: new Date().toLocaleDateString('ru-RU'),
        preview: messages.length > 1 ? messages[1].text.substring(0, 30) + '...' : 'Новый диалог',
      },
      ...chatHistory,
    ];
    
    setChatHistory(newChatHistory);
    
    setMessages([
      {
        id: 1,
        sender: 'bot',
        text: 'Здравствуйте! Я ваш виртуальный помощник по психологическому здоровью. Расскажите, как вы себя чувствуете сегодня или что вас беспокоит?',
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Чат с психологическим ассистентом</h1>
        <p className="text-gray-600">
          Опишите свое самочувствие и получите рекомендации от нашего виртуального помощника.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Chat Area */}
        <div className="flex-grow">
          <Card className="h-[calc(100vh-240px)] flex flex-col">
            {/* Chat Header */}
            <div className="border-b pb-4 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                  <FaRobot className="w-5 h-5" />
                </div>
                <div className="ml-3">
                  <p className="font-medium">Психологический ассистент</p>
                  <p className="text-xs text-green-500">Онлайн</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex items-center space-x-1"
                >
                  <FaHistory className="w-4 h-4" />
                  <span>История</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={startNewChat}
                  className="flex items-center space-x-1"
                >
                  <span>Новый чат</span>
                </Button>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-grow overflow-y-auto py-4 px-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-primary-600 text-white rounded-tr-none'
                        : 'bg-gray-100 text-gray-800 rounded-tl-none'
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        message.sender === 'user' ? 'bg-white text-primary-600' : 'bg-primary-100 text-primary-600'
                      }`}>
                        {message.sender === 'user' ? (
                          <FaUser className="w-3 h-3" />
                        ) : (
                          <FaRobot className="w-3 h-3" />
                        )}
                      </div>
                      <span className={`text-xs ml-2 ${message.sender === 'user' ? 'text-primary-100' : 'text-gray-500'}`}>
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm">{message.text}</p>
                  </motion.div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start mb-4">
                  <div className="bg-gray-100 text-gray-800 rounded-lg rounded-tl-none max-w-[80%] px-4 py-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Suggestions */}
            <div className="px-4 py-2 border-t border-gray-200">
              <div className="mb-2 flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full px-3 py-1 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
              
              {/* Input Area */}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Напишите сообщение..."
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={inputMessage.trim() === ''}
                  className="rounded-full"
                >
                  <FaPaperPlane />
                </Button>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Chat History (Conditionally displayed) */}
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="w-full lg:w-80 h-[calc(100vh-240px)]"
          >
            <Card className="h-full flex flex-col">
              <div className="border-b pb-4">
                <h3 className="font-medium">История диалогов</h3>
              </div>
              
              <div className="flex-grow overflow-y-auto py-2">
                {chatHistory.length > 0 ? (
                  <ul className="space-y-2">
                    {chatHistory.map((chat) => (
                      <li key={chat.id} className="hover:bg-gray-50 rounded-lg">
                        <button className="w-full text-left px-3 py-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{chat.date}</span>
                            <span className="text-xs text-gray-500">#{chat.id}</span>
                          </div>
                          <p className="text-xs text-gray-600 truncate">{chat.preview}</p>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500">История диалогов пуста</p>
                  </div>
                )}
              </div>
              
              <div className="border-t pt-4">
                <div className="bg-primary-50 text-primary-800 text-xs rounded-lg p-3 flex items-start">
                  <FaInfoCircle className="mt-0.5 mr-2 flex-shrink-0" />
                  <span>
                    История диалогов помогает отслеживать ваш прогресс и возвращаться к предыдущим рекомендациям.
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
};

export default Chat;
