const mc = require('minecraft-protocol');

// إعدادات البوت المتقدمة
const config = {
  host: process.env.SERVER_HOST || 'justforlaugh.aternos.me',
  port: parseInt(process.env.SERVER_PORT) || 19465,
  username: process.env.BOT_USERNAME || 'AFKBot_JFL',
  password: process.env.BOT_PASSWORD || '',
  version: process.env.MC_VERSION || '1.21.1',
  auth: process.env.BOT_AUTH || 'offline',
  // إعدادات ضد الاكتشاف
  hideErrors: true,
  keepAlive: true,
  checkTimeoutInterval: 30000
};

let bot;
let reconnectAttempts = 0;
const maxReconnectAttempts = 15;
let reconnectDelay = 30000;
let isOnline = false;
let lastActivity = Date.now();

// مولد أسماء عشوائية للتمويه
const randomNames = ['Steve', 'Alex', 'Player', 'Gamer', 'User', 'Helper', 'Friend', 'Buddy', 'Mate', 'Pro'];
const randomNumbers = () => Math.floor(Math.random() * 9999) + 1000;

// مولد حركات طبيعية وعشوائية
class HumanMovementSimulator {
  constructor() {
    this.basePosition = { x: 0, y: 64, z: 0 };
    this.currentPosition = { ...this.basePosition };
    this.movementPattern = 0;
    this.isWalking = false;
    this.walkDuration = 0;
    this.idleTime = 0;
  }

  // محاكاة حركة طبيعية
  getNextMovement() {
    const movements = [
      // حركات صغيرة (نظرات حولية)
      () => ({
        x: this.currentPosition.x + (Math.random() - 0.5) * 0.3,
        y: this.currentPosition.y,
        z: this.currentPosition.z + (Math.random() - 0.5) * 0.3
      }),
      // مشي قصير
      () => ({
        x: this.currentPosition.x + (Math.random() - 0.5) * 2,
        y: this.currentPosition.y,
        z: this.currentPosition.z + (Math.random() - 0.5) * 2
      }),
      // قفز عشوائي
      () => ({
        x: this.currentPosition.x + (Math.random() - 0.5) * 0.5,
        y: this.currentPosition.y + 0.1,
        z: this.currentPosition.z + (Math.random() - 0.5) * 0.5
      }),
      // وقوف في المكان مع حركات صغيرة
      () => ({
        x: this.currentPosition.x + (Math.random() - 0.5) * 0.1,
        y: this.currentPosition.y,
        z: this.currentPosition.z + (Math.random() - 0.5) * 0.1
      })
    ];

    // اختيار نمط حركة عشوائي
    const movementType = Math.floor(Math.random() * movements.length);
    this.currentPosition = movements[movementType]();
    return this.currentPosition;
  }

  // محاكاة نظرات طبيعية
  getRandomLook() {
    return {
      yaw: (Math.random() - 0.5) * 360,
      pitch: (Math.random() - 0.5) * 180
    };
  }
}

// محاكي الدردشة الذكي
class SmartChatHandler {
  constructor() {
    this.responses = {
      greetings: ['hello', 'hi', 'hey', 'sup', 'yo'],
      farewells: ['bye', 'cya', 'see ya', 'later', 'goodbye'],
      reactions: ['nice', 'cool', 'awesome', 'lol', 'haha', 'wow', 'ok'],
      questions: ['what?', 'why?', 'how?', 'when?', 'where?'],
      casual: ['yeah', 'nah', 'maybe', 'sure', 'idk', 'brb', 'afk']
    };
    this.lastMessageTime = 0;
    this.conversationMode = false;
  }

  shouldRespond(message) {
    // تجنب الرد المفرط
    const timeSinceLastMessage = Date.now() - this.lastMessageTime;
    if (timeSinceLastMessage < 5000) return false;

    // فرصة عشوائية للرد (10-30%)
    const responseChance = Math.random();
    if (responseChance > 0.3) return false;

    // رد على الرسائل التي تحتوي على اسم البوت
    if (message.toLowerCase().includes(config.username.toLowerCase())) {
      return true;
    }

    // رد على الأسئلة أحياناً
    if (message.includes('?')) {
      return responseChance < 0.15;
    }

    return responseChance < 0.1;
  }

  generateResponse(message) {
    const categories = Object.keys(this.responses);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const responses = this.responses[randomCategory];
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

// محاكي التايبنغ الطبيعي
class TypingSimulator {
  static async typeMessage(bot, message) {
    // محاكاة سرعة الكتابة الطبيعية (50-120 WPM)
    const wordsPerMinute = 50 + Math.random() * 70;
    const charactersPerSecond = (wordsPerMinute * 5) / 60;
    const typingTime = (message.length / charactersPerSecond) * 1000;
    
    // وقت تفكير قبل الكتابة (0.5-2 ثانية)
    const thinkingTime = 500 + Math.random() * 1500;
    
    await new Promise(resolve => setTimeout(resolve, thinkingTime));
    
    // إرسال الرسالة
    bot.write('chat', { message: message });
  }
}

const movementSim = new HumanMovementSimulator();
const chatHandler = new SmartChatHandler();

function createAdvancedBot() {
  console.log('🤖 تشغيل البوت المتقدم ضد الاكتشاف...');
  
  // تعديل اسم البوت عشوائياً أحياناً
  if (Math.random() < 0.3 && !process.env.BOT_USERNAME) {
    const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
    config.username = `${randomName}${randomNumbers()}`;
  }

  bot = mc.createClient({
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    version: config.version,
    auth: config.auth,
    hideErrors: config.hideErrors,
    keepAlive: config.keepAlive,
    checkTimeoutInterval: config.checkTimeoutInterval
  });

  // متغيرات الأنشطة
  let movementInterval;
  let lookInterval;
  let activityInterval;
  let chatInterval;

  bot.on('login', () => {
    console.log('✅ تم الاتصال بالسيرفر!');
    console.log(`👤 اللاعب: ${bot.username}`);
    console.log(`🌐 السيرفر: ${config.host}:${config.port}`);
    console.log('🛡️ وضع مكافحة الاكتشاف مفعل');
    
    isOnline = true;
    reconnectAttempts = 0;
    reconnectDelay = 30000;

    // رسالة دخول طبيعية (أحياناً)
    if (Math.random() < 0.4) {
      setTimeout(() => {
        const greetings = ['hey', 'hi all', 'hello', 'sup everyone'];
        const greeting = greetings[Math.floor(Math.random() * greetings.length)];
        TypingSimulator.typeMessage(bot, greeting);
      }, 3000 + Math.random() * 7000);
    }

    // حركة طبيعية متقدمة (كل 15-45 ثانية)
    movementInterval = setInterval(() => {
      if (bot && bot.socket && !bot.socket.destroyed) {
        const newPos = movementSim.getNextMovement();
        
        // إرسال حركة تدريجية لتبدو طبيعية
        bot.write('position', {
          x: newPos.x,
          y: newPos.y,
          z: newPos.z,
          onGround: true
        });

        console.log('🚶 حركة طبيعية محاكة');
        lastActivity = Date.now();
      }
    }, 15000 + Math.random() * 30000);

    // حركة النظر الطبيعية (كل 5-15 ثانية)
    lookInterval = setInterval(() => {
      if (bot && bot.socket && !bot.socket.destroyed) {
        const look = movementSim.getRandomLook();
        
        bot.write('look', {
          yaw: look.yaw,
          pitch: look.pitch
        });

        // أحياناً قفز صغير أثناء النظر
        if (Math.random() < 0.2) {
          setTimeout(() => {
            bot.write('position', {
              x: bot.entity?.position.x || 0,
              y: (bot.entity?.position.y || 64) + 0.5,
              z: bot.entity?.position.z || 0,
              onGround: false
            });
          }, 100);
        }
      }
    }, 5000 + Math.random() * 10000);

    // نشاط عشوائي متنوع (كل 2-8 دقائق)
    activityInterval = setInterval(() => {
      if (bot && bot.socket && !bot.socket.destroyed) {
        const activities = [
          // فتح الانفنتوري
          () => bot.write('client_command', { action: 2 }),
          // تبديل العناصر في الهوتبار
          () => bot.write('held_item_change', { slot: Math.floor(Math.random() * 9) }),
          // محاكاة النقر
          () => {
            bot.write('use_entity', {
              target: bot.entity?.id || 0,
              mouse: 0,
              x: 0, y: 0, z: 0,
              hand: 0,
              sneaking: false
            });
          }
        ];

        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        try {
          randomActivity();
          console.log('🎮 نشاط عشوائي تم تنفيذه');
        } catch (err) {
          // تجاهل أخطاء الأنشطة البسيطة
        }
      }
    }, 120000 + Math.random() * 360000); // 2-8 دقائق

    // ردود دردشة ذكية
    chatInterval = setInterval(() => {
      if (bot && bot.socket && !bot.socket.destroyed && Math.random() < 0.05) {
        const casualMessages = [
          'anyone online?',
          'nice server',
          'lag?',
          'brb',
          'building something cool',
          'exploring around'
        ];
        
        const message = casualMessages[Math.floor(Math.random() * casualMessages.length)];
        TypingSimulator.typeMessage(bot, message);
        console.log('💬 رسالة طبيعية أرسلت');
      }
    }, 300000 + Math.random() * 600000); // 5-15 دقيقة
  });

  // معالجة الرسائل بذكاء
  bot.on('chat', (packet) => {
    try {
      const message = packet.message;
      console.log('💬 رسالة:', message);

      // تحليل الرسالة والرد الذكي
      if (chatHandler.shouldRespond(message)) {
        setTimeout(() => {
          const response = chatHandler.generateResponse(message);
          TypingSimulator.typeMessage(bot, response);
          console.log('🤖 رد ذكي:', response);
        }, 1000 + Math.random() * 4000);
      }

      chatHandler.lastMessageTime = Date.now();
    } catch (err) {
      // تجاهل أخطاء الدردشة
    }
  });

  // معالجة الأخطاء المتقدمة
  bot.on('error', (err) => {
    console.error('❌ خطأ:', err.message);
    isOnline = false;
    
    // تنظيف الفواصل الزمنية
    clearInterval(movementInterval);
    clearInterval(lookInterval);
    clearInterval(activityInterval);
    clearInterval(chatInterval);
  });

  bot.on('end', (reason) => {
    console.log('🔌 انتهى الاتصال:', reason);
    isOnline = false;
    
    // تنظيف الفواصل الزمنية
    clearInterval(movementInterval);
    clearInterval(lookInterval);
    clearInterval(activityInterval);
    clearInterval(chatInterval);

    // إعادة اتصال ذكية مع تأخير متزايد
    if (reconnectAttempts < maxReconnectAttempts) {
      reconnectAttempts++;
      // زيادة تأخير إعادة الاتصال تدريجياً
      reconnectDelay = Math.min(reconnectDelay * 1.5, 300000); // حد أقصى 5 دقائق
      
      console.log(`🔄 إعادة اتصال ذكية ${reconnectAttempts}/${maxReconnectAttempts} خلال ${reconnectDelay/1000} ثانية...`);
      
      setTimeout(() => {
        createAdvancedBot();
      }, reconnectDelay);
    } else {
      console.log('❌ توقف البوت بعد محاولات متعددة');
      // إعادة تشغيل كاملة بعد 10 دقائق
      setTimeout(() => {
        reconnectAttempts = 0;
        reconnectDelay = 30000;
        createAdvancedBot();
      }, 600000);
    }
  });

  // حماية ضد الكيك
  bot.on('kick_disconnect', (packet) => {
    console.log('⚠️ تم الطرد:', packet.reason);
    // انتظار أطول بعد الطرد
    reconnectDelay = Math.max(reconnectDelay * 2, 60000);
  });

  // معالجة الصحة المتقدمة
  bot.on('health', () => {
    if (bot.health <= 0) {
      console.log('💀 البوت مات - إعادة الظهور');
      setTimeout(() => {
        bot.write('client_command', { action: 0 });
      }, 2000 + Math.random() * 3000); // تأخير طبيعي
    }
    
    // أكل الطعام إذا كان الجوع منخفض
    if (bot.food <= 14) {
      try {
        bot.write('use_item', { hand: 0 });
        console.log('🍖 محاولة الأكل');
      } catch (err) {
        // تجاهل أخطاء الأكل
      }
    }
  });

  // مراقب حالة الاتصال
  setInterval(() => {
    if (isOnline && Date.now() - lastActivity > 300000) { // 5 دقائق بدون نشاط
      console.log('⚡ إرسال إشارة حياة');
      if (bot && bot.socket && !bot.socket.destroyed) {
        // حركة صغيرة للحفاظ على الاتصال
        const pos = movementSim.getNextMovement();
        bot.write('position', {
          x: pos.x,
          y: pos.y,
          z: pos.z,
          onGround: true
        });
        lastActivity = Date.now();
      }
    }
  }, 60000); // فحص كل دقيقة
}

// بدء البوت المتقدم
console.log('🚀 تشغيل البوت المتقدم المقاوم للحظر...');
console.log('⚙️ الإعدادات المتقدمة:');
console.log(`   🌐 السيرفر: ${config.host}:${config.port}`);
console.log(`   👤 اسم المستخدم: ${config.username}`);
console.log(`   🎮 الإصدار: ${config.version}`);
console.log(`   🔐 المصادقة: ${config.auth}`);
console.log(`   🛡️ الحماية: مفعلة`);
console.log(`   🤖 الذكاء الاصطناعي: مفعل`);

createAdvancedBot();

// معالجة الإغلاق المتقدمة
process.on('SIGINT', () => {
  console.log('\n🛑 إيقاف البوت المتقدم...');
  if (bot && bot.socket && !bot.socket.destroyed) {
    // رسالة مغادرة طبيعية
    const farewells = ['gtg', 'bye all', 'see ya later', 'cya'];
    const farewell = farewells[Math.floor(Math.random() * farewells.length)];
    
    TypingSimulator.typeMessage(bot, farewell).then(() => {
      setTimeout(() => {
        bot.end();
        process.exit(0);
      }, 1000);
    });
  } else {
    process.exit(0);
  }
});

// معالجة الأخطاء العامة
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ خطأ غير متوقع:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ خطأ حرج:', error);
  // إعادة تشغيل البوت بعد خطأ حرج
  setTimeout(() => {
    createAdvancedBot();
  }, 5000);
});
// ====== سيرفر صغير عشان UptimeRobot يقدر يراقب البوت ======
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Bot is running!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🌐 سيرفر Uptime قيد التشغيل على المنفذ ${port}`);
});
