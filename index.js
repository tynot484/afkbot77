const mc = require('minecraft-protocol');
const express = require('express');

// إعدادات البوت المتقدمة مع بيانات السيرفر مباشرة
const config = {
  host: 'justforlaugh.aternos.me',  // سيرفر ماينكرافت
  port: 19465,
  username: process.env.BOT_USERNAME || 'AFKBot_JFL',
  password: process.env.BOT_PASSWORD || '',
  version: process.env.MC_VERSION || '1.21.1',
  auth: process.env.BOT_AUTH || 'offline',
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

const randomNames = ['Steve', 'Alex', 'Player', 'Gamer', 'User', 'Helper', 'Friend', 'Buddy', 'Mate', 'Pro'];
const randomNumbers = () => Math.floor(Math.random() * 9999) + 1000;

class HumanMovementSimulator {
  constructor() {
    this.basePosition = { x: 0, y: 64, z: 0 };
    this.currentPosition = { ...this.basePosition };
  }

  getNextMovement() {
    const movements = [
      () => ({
        x: this.currentPosition.x + (Math.random() - 0.5) * 0.3,
        y: this.currentPosition.y,
        z: this.currentPosition.z + (Math.random() - 0.5) * 0.3
      }),
      () => ({
        x: this.currentPosition.x + (Math.random() - 0.5) * 2,
        y: this.currentPosition.y,
        z: this.currentPosition.z + (Math.random() - 0.5) * 2
      }),
      () => ({
        x: this.currentPosition.x + (Math.random() - 0.5) * 0.5,
        y: this.currentPosition.y + 0.1,
        z: this.currentPosition.z + (Math.random() - 0.5) * 0.5
      }),
      () => ({
        x: this.currentPosition.x + (Math.random() - 0.5) * 0.1,
        y: this.currentPosition.y,
        z: this.currentPosition.z + (Math.random() - 0.5) * 0.1
      })
    ];

    const movementType = Math.floor(Math.random() * movements.length);
    this.currentPosition = movements[movementType]();
    return this.currentPosition;
  }

  getRandomLook() {
    return {
      yaw: (Math.random() - 0.5) * 360,
      pitch: (Math.random() - 0.5) * 180
    };
  }
}

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
  }

  shouldRespond(message) {
    const timeSinceLastMessage = Date.now() - this.lastMessageTime;
    if (timeSinceLastMessage < 5000) return false;

    const responseChance = Math.random();
    if (responseChance > 0.3) return false;

    if (message.toLowerCase().includes(config.username.toLowerCase())) {
      return true;
    }

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

class TypingSimulator {
  static async typeMessage(bot, message) {
    const wordsPerMinute = 50 + Math.random() * 70;
    const charactersPerSecond = (wordsPerMinute * 5) / 60;
    const typingTime = (message.length / charactersPerSecond) * 1000;
    const thinkingTime = 500 + Math.random() * 1500;

    await new Promise(resolve => setTimeout(resolve, thinkingTime));
    bot.write('chat', { message: message });
  }
}

const movementSim = new HumanMovementSimulator();
const chatHandler = new SmartChatHandler();

function createAdvancedBot() {
  console.log('🤖 تشغيل البوت المتقدم ضد الاكتشاف...');

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

  let movementInterval, lookInterval, activityInterval, chatInterval;

  bot.on('login', () => {
    console.log('✅ تم الاتصال بالسيرفر!');
    console.log(`👤 اللاعب: ${bot.username}`);
    console.log(`🌐 السيرفر: ${config.host}:${config.port}`);
    console.log('🛡️ وضع مكافحة الاكتشاف مفعل');

    isOnline = true;
    reconnectAttempts = 0;
    reconnectDelay = 30000;

    if (Math.random() < 0.4) {
      setTimeout(() => {
        const greetings = ['hey', 'hi all', 'hello', 'sup everyone'];
        const greeting = greetings[Math.floor(Math.random() * greetings.length)];
        TypingSimulator.typeMessage(bot, greeting);
      }, 3000 + Math.random() * 7000);
    }

    movementInterval = setInterval(() => {
      if (bot && bot.socket && !bot.socket.destroyed) {
        const newPos = movementSim.getNextMovement();
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

    lookInterval = setInterval(() => {
      if (bot && bot.socket && !bot.socket.destroyed) {
        const look = movementSim.getRandomLook();
        bot.write('look', {
          yaw: look.yaw,
          pitch: look.pitch
        });

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

    activityInterval = setInterval(() => {
      if (bot && bot.socket && !bot.socket.destroyed) {
        const activities = [
          () => bot.write('client_command', { action: 2 }),
          () => bot.write('held_item_change', { slot: Math.floor(Math.random() * 9) }),
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
        } catch {}

      }
    }, 120000 + Math.random() * 360000);

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
    }, 300000 + Math.random() * 600000);
  });

  bot.on('chat', (packet) => {
    try {
      const message = packet.message;
      console.log('💬 رسالة:', message);

      if (chatHandler.shouldRespond(message)) {
        setTimeout(() => {
          const response = chatHandler.generateResponse(message);
          TypingSimulator.typeMessage(bot, response);
          console.log('🤖 رد ذكي:', response);
        }, 1000 + Math.random() * 4000);
      }

      chatHandler.lastMessageTime = Date.now();
    } catch {}
  });

  bot.on('error', (err) => {
    console.error('❌ خطأ:', err.message);
    isOnline = false;
    clearInterval(movementInterval);
    clearInterval(lookInterval);
    clearInterval(activityInterval);
    clearInterval(chatInterval);
  });

  bot.on('end', (reason) => {
    console.log('🔌 انتهى الاتصال:', reason);
    isOnline = false;
    clearInterval(movementInterval);
    clearInterval(lookInterval);
    clearInterval(activityInterval);
    clearInterval(chatInterval);

    if (reconnectAttempts < maxReconnectAttempts) {
      reconnectAttempts++;
      reconnectDelay = Math.min(reconnectDelay * 1.5, 300000);
      console.log(`🔄 إعادة اتصال ذكية ${reconnectAttempts}/${maxReconnectAttempts} خلال ${reconnectDelay / 1000} ثانية...`);
      setTimeout(() => {
        createAdvancedBot();
      }, reconnectDelay);
    } else {
      console.log('❌ توقف البوت بعد محاولات متعددة');
      setTimeout(() => {
        reconnectAttempts = 0;
        reconnectDelay = 30000;
        createAdvancedBot();
      }, 600000);
    }
  });

  bot.on('kick_disconnect', (packet) => {
    console.log('⚠️ تم الطرد:', packet.reason);
    reconnectDelay = Math.max(reconnectDelay * 2, 60000);
  });

  bot.on('health', () => {
    if (bot.health <= 0) {
      console.log('💀 البوت مات - إعادة الظهور');
      setTimeout(() => {
        bot.write('client_command', { action: 0 });
      }, 2000 + Math.random() * 3000);
    }
    if (bot.food <= 14) {
      try {
        bot.write('use_item', { hand: 0 });
        console.log('🍖 محاولة الأكل');
      } catch {}
    }
  });

  setInterval(() => {
    if (isOnline && Date.now() - lastActivity > 300000) {
      console.log('⚡ إرسال إشارة حياة');
      if (bot && bot.socket && !bot.socket.destroyed) {
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
  }, 60000);
}

console.log('🚀 تشغيل البوت المتقدم المقاوم للحظر...');
console.log('⚙️ الإعدادات المتقدمة:');
console.log(`   🌐 السيرفر: ${config.host}:${config.port}`);
console.log(`   👤 اسم المستخدم: ${config.username}`);
console.log(`   🎮 الإصدار: ${config.version}`);
console.log(`   🔐 المصادقة: ${config.auth}`);
console.log(`   🛡️ الحماية: مفعلة`);
console.log(`   🤖 الذكاء الاصطناعي: مفعل`);

createAdvancedBot();

// سيرفر صغير لـ UptimeRobot
const app = express();

app.get('/', (req, res) => {
  res.send('Bot is running!');
});

const webPort = process.env.PORT || 3000;
app.listen(webPort, () => {
  console.log(`🌐 سيرفر Uptime قيد التشغيل على المنفذ ${webPort}`);
});

// إغلاق نظيف
process.on('SIGINT', () => {
  console.log('\n🛑 إيقاف البوت المتقدم...');
  if (bot && bot.socket && !bot.socket.destroyed) {
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

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ خطأ غير متوقع:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ خطأ حرج:', error);
  setTimeout(() => {
    createAdvancedBot();
  }, 5000);
});
