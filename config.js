// ===================================
// 🤖 ملف الإعدادات المتقدم للبوت
// ===================================

const config = {
  // الإعدادات الأساسية
  server: {
    host: process.env.SERVER_HOST || 'justforlaugh.aternos.me',
    port: parseInt(process.env.SERVER_PORT) || 19465,
    version: process.env.MC_VERSION || '1.21.1'
  },
  
  bot: {
    username: process.env.BOT_USERNAME || 'AFKBot_JFL',
    password: process.env.BOT_PASSWORD || '',
    auth: process.env.BOT_AUTH || 'offline'
  },

  // 🛡️ إعدادات الحماية
  protection: {
    stealthMode: process.env.STEALTH_MODE === 'true',
    protectionLevel: process.env.PROTECTION_LEVEL || 'high',
    randomNames: process.env.RANDOM_NAMES === 'true',
    extraDelay: parseInt(process.env.EXTRA_DELAY) || 2000,
    emergencyMode: process.env.EMERGENCY_MODE === 'true',
    paranoidLevel: process.env.PARANOID_LEVEL || 'normal'
  },

  // 💬 إعدادات الدردشة
  chat: {
    responseRate: parseFloat(process.env.CHAT_RESPONSE_RATE) || 0.1,
    randomChatInterval: parseInt(process.env.RANDOM_CHAT_INTERVAL) || 15,
    personality: process.env.BOT_PERSONALITY || 'friendly',
    enableSmartResponses: true
  },

  // 🚶 إعدادات الحركة
  movement: {
    delay: parseInt(process.env.MOVEMENT_DELAY) || 25000,
    type: process.env.MOVEMENT_TYPE || 'natural',
    activityLevel: process.env.ACTIVITY_LEVEL || 'medium',
    randomJumping: process.env.RANDOM_JUMPING !== 'false',
    randomOfflineTime: process.env.RANDOM_OFFLINE_TIME === 'true'
  },

  // 🎮 إعدادات نوع السيرفر
  serverType: {
    type: process.env.SERVER_TYPE || 'survival',
    buildingSimulation: process.env.BUILDING_SIMULATION === 'true',
    fishingSimulation: process.env.FISHING_SIMULATION === 'true',
    mobAvoidance: process.env.MOB_AVOIDANCE !== 'false'
  },

  // 📊 إعدادات المراقبة
  monitoring: {
    dailyReports: process.env.DAILY_REPORTS !== 'false',
    saveStatistics: process.env.SAVE_STATISTICS !== 'false',
    securityAlerts: process.env.SECURITY_ALERTS !== 'false',
    debugMode: process.env.DEBUG_MODE === 'true',
    verboseLogs: process.env.VERBOSE_LOGS === 'true'
  },

  // 🌐 إعدادات الشبكة
  network: {
    maxReconnectAttempts: parseInt(process.env.MAX_RECONNECT_ATTEMPTS) || 15,
    initialReconnectDelay: parseInt(process.env.INITIAL_RECONNECT_DELAY) || 30000,
    keepAlive: process.env.KEEP_ALIVE !== 'false',
    connectionTimeout: parseInt(process.env.CONNECTION_TIMEOUT) || 30000,
    hideErrors: true
  },

  // 🎭 بيانات التمويه
  disguise: {
    naturalNames: [
      'Steve', 'Alex', 'Player', 'Gamer', 'User', 'Helper', 
      'Friend', 'Buddy', 'Mate', 'Pro', 'Builder', 'Miner',
      'Explorer', 'Crafter', 'Hunter', 'Farmer'
    ],
    
    casualMessages: [
      'hey everyone', 'anyone online?', 'nice server', 'building something cool',
      'exploring around', 'mining time', 'just chilling', 'afk for a bit',
      'brb', 'back', 'lag?', 'cool build', 'nice place', 'gtg soon'
    ],

    responses: {
      friendly: ['hey!', 'hello there', 'hi :)', 'sup', 'yo'],
      quiet: ['...', 'mhm', 'yeah', 'ok', 'sure'],
      helpful: ['sure thing', 'no problem', 'happy to help', 'anytime'],
      funny: ['lol', 'haha', 'nice one', 'good one', 'rofl']
    }
  },

  // 🧠 إعدادات الذكاء الاصطناعي
  ai: {
    suspicionThreshold: 50, // نقاط الشك القصوى
    learningEnabled: true,
    adaptiveBehavior: true,
    contextAwareness: true,
    emotionalResponses: true,
    memoryLength: 50 // عدد الرسائل المحفوظة في الذاكرة
  },

  // ⏰ إعدادات التوقيت
  timing: {
    minMovementDelay: 15000,
    maxMovementDelay: 45000,
    minLookDelay: 5000,
    maxLookDelay: 15000,
    minActivityDelay: 120000,
    maxActivityDelay: 480000,
    thinkingTime: { min: 500, max: 2000 },
    typingSpeed: { min: 50, max: 120 } // كلمة في الدقيقة
  }
};

// دالات مساعدة للإعدادات
config.getRandomDelay = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

config.getRandomName = () => {
  const names = config.disguise.naturalNames;
  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomNumber = Math.floor(Math.random() * 9999) + 1000;
  return `${randomName}${randomNumber}`;
};

config.getRandomMessage = () => {
  const messages = config.disguise.casualMessages;
  return messages[Math.floor(Math.random() * messages.length)];
};

config.getResponse = (type = 'friendly') => {
  const responses = config.disguise.responses[type] || config.disguise.responses.friendly;
  return responses[Math.floor(Math.random() * responses.length)];
};

// طباعة الإعدادات عند التحميل
if (config.monitoring.verboseLogs) {
  console.log('⚙️ تم تحميل الإعدادات:', JSON.stringify(config, null, 2));
}

module.exports = config;
