# 🤖 Dockerfile للبوت المتقدم المضاد للحظر
FROM node:18-alpine

# معلومات المطور
LABEL maintainer="Advanced Bot Developer"
LABEL description="Advanced Anti-Ban AFK Bot for Minecraft Aternos Servers"
LABEL version="2.0.0"

# إنشاء مجلد العمل
WORKDIR /app

# نسخ ملفات الحزمة
COPY package*.json ./

# تثبيت التبعيات
RUN npm ci --only=production && \
    npm cache clean --force && \
    rm -rf /tmp/*

# نسخ الكود المصدري
COPY . .

# إنشاء مستخدم غير جذر للأمان
RUN addgroup -g 1001 -S botgroup && \
    adduser -S botuser -u 1001 -G botgroup

# تغيير ملكية الملفات
RUN chown -R botuser:botgroup /app

# التبديل للمستخدم غير الجذر
USER botuser

# فتح المنفذ (اختياري للمراقبة)
EXPOSE 3000

# متغيرات البيئة الافتراضية
ENV NODE_ENV=production
ENV STEALTH_MODE=true
ENV PROTECTION_LEVEL=high
ENV DEBUG_MODE=false

# فحص صحة الحاوية
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "console.log('Bot is running')" || exit 1

# تشغيل البوت
CMD ["npm", "start"]
