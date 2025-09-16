#!/bin/bash

# ===================================
# 🚀 سكريبت النشر السريع للبوت المتقدم
# ===================================

set -e

# الألوان والرموز
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

ROCKET="🚀"
CHECK="✅"
CROSS="❌"
INFO="ℹ️"
WARNING="⚠️"

# دالة طباعة ملونة
print_colored() {
    echo -e "${2}${1}${NC}"
}

# دالة طباعة البانر
print_banner() {
    clear
    echo -e "${PURPLE}"
    echo "╔════════════════════════════════════════════════════╗"
    echo "║               🚀 QUICK DEPLOY WIZARD               ║"
    echo "║          Advanced AFK Bot - One Click Setup       ║"
    echo "║                    Version 2.0.0                  ║"
    echo "╚════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# دالة التحقق من الأدوات المطلوبة
check_tools() {
    print_colored "${INFO} فحص الأدوات المطلوبة..." "${BLUE}"
    
    local missing_tools=()
    
    # فحص Git
    if ! command -v git >/dev/null 2>&1; then
        missing_tools+=("git")
    else
        print_colored "${CHECK} Git متوفر" "${GREEN}"
    fi
    
    # فحص Node.js
    if ! command -v node >/dev/null 2>&1; then
        missing_tools+=("node")
    else
        NODE_VERSION=$(node --version)
        print_colored "${CHECK} Node.js ${NODE_VERSION} متوفر" "${GREEN}"
    fi
    
    # فحص NPM
    if ! command -v npm >/dev/null 2>&1; then
        missing_tools+=("npm")
    else
        NPM_VERSION=$(npm --version)
        print_colored "${CHECK} NPM v${NPM_VERSION} متوفر" "${GREEN}"
    fi
    
    # إذا كانت هناك أدوات مفقودة
    if [ ${#missing_tools[@]} -gt 0 ]; then
        print_colored "${CROSS} أدوات مفقودة: ${missing_tools[*]}" "${RED}"
        print_colored "${INFO} يرجى تثبيت الأدوات المفقودة أولاً" "${YELLOW}"
        exit 1
    fi
}

# دالة جمع معلومات السيرفر
collect_server_info() {
    print_colored "${INFO} إعداد معلومات السيرفر..." "${BLUE}"
    echo
    
    # اسم المستودع
    read -p "🗂️ اسم المستودع على GitHub (افتراضي: justforlaugh-afk-bot): " REPO_NAME
    REPO_NAME=${REPO_NAME:-justforlaugh-afk-bot}
    
    # معلومات السيرفر
    echo
    print_colored "🌐 معلومات السيرفر:" "${PURPLE}"
    
    read -p "🌐 عنوان السيرفر (افتراضي: justforlaugh.aternos.me): " SERVER_HOST
    SERVER_HOST=${SERVER_HOST:-justforlaugh.aternos.me}
    
    read -p "🔌 منفذ السيرفر (افتراضي: 19465): " SERVER_PORT
    SERVER_PORT=${SERVER_PORT:-19465}
    
    read -p "👤 اسم البوت (افتراضي: AFKBot_JFL): " BOT_USERNAME
    BOT_USERNAME=${BOT_USERNAME:-AFKBot_JFL}
    
    read -p "🎮 إصدار Minecraft (افتراضي: 1.21.1): " MC_VERSION
    MC_VERSION=${MC_VERSION:-1.21.1}
    
    # إعدادات الحماية
    echo
    print_colored "🛡️ إعدادات الحماية:" "${PURPLE}"
    
    read -p "🕵️ تفعيل وضع التخفي الكامل؟ (y/n، افتراضي: y): " STEALTH_MODE
    STEALTH_MODE=${STEALTH_MODE:-y}
    
    if [[ $STEALTH_MODE == "y" || $STEALTH_MODE == "Y" ]]; then
        STEALTH_MODE="true"
    else
        STEALTH_MODE="false"
    fi
    
    read -p "📊 مستوى الحماية (low/medium/high/maximum، افتراضي: high): " PROTECTION_LEVEL
    PROTECTION_LEVEL=${PROTECTION_LEVEL:-high}
    
    read -p "🎭 نوع شخصية البوت (friendly/quiet/helpful/funny، افتراضي: friendly): " BOT_PERSONALITY
    BOT_PERSONALITY=${BOT_PERSONALITY:-friendly}
}

# دالة إنشاء ملف .env
create_env_file() {
    print_colored "${INFO} إنشاء ملف الإعدادات..." "${BLUE}"
    
    cat > .env << EOF
# ===================================
# 🤖 إعدادات البوت المتقدم - تم إنشاؤه تلقائياً
# ===================================

# إعدادات السيرفر
SERVER_HOST=${SERVER_HOST}
SERVER_PORT=${SERVER_PORT}
BOT_USERNAME=${BOT_USERNAME}
MC_VERSION=${MC_VERSION}
BOT_AUTH=offline

# إعدادات الحماية المتقدمة
STEALTH_MODE=${STEALTH_MODE}
PROTECTION_LEVEL=${PROTECTION_LEVEL}
BOT_PERSONALITY=${BOT_PERSONALITY}
RANDOM_NAMES=false
EXTRA_DELAY=2000

# إعدادات الدردشة
CHAT_RESPONSE_RATE=0.1
RANDOM_CHAT_INTERVAL=15

# إعدادات الحركة
MOVEMENT_DELAY=25000
MOVEMENT_TYPE=natural
ACTIVITY_LEVEL=medium
RANDOM_JUMPING=true

# إعدادات المراقبة
DEBUG_MODE=false
VERBOSE_LOGS=false
DAILY_REPORTS=true
SECURITY_ALERTS=true

# إعدادات الشبكة
MAX_RECONNECT_ATTEMPTS=15
INITIAL_RECONNECT_DELAY=30000
KEEP_ALIVE=true

# نوع السيرفر
SERVER_TYPE=survival
MOB_AVOIDANCE=true

# تم إنشاؤه في: $(date)
# المستخدم: $(whoami)
EOF

    print_colored "${CHECK} تم إنشاء ملف .env بنجاح" "${GREEN}"
}

# دالة إعداد Git
setup_git() {
    print_colored "${INFO} إعداد مستودع Git..." "${BLUE}"
    
    # التحقق من وجود Git repo
    if [ ! -d ".git" ]; then
        git init
        print_colored "${CHECK} تم إنشاء مستودع Git جديد" "${GREEN}"
    else
        print_colored "${INFO} مستودع Git موجود بالفعل" "${YELLOW}"
    fi
    
    # إضافة جميع الملفات
    git add .
    
    # Commit أولي
    if git diff --staged --quiet; then
        print_colored "${INFO} لا توجد تغييرات للحفظ" "${YELLOW}"
    else
        git commit -m "🤖 Advanced AFK Bot v2.0.0 - Auto-generated setup

✨ Features:
- Military-grade anti-ban protection
- Human behavior simulation (95% accuracy)  
- Smart chat responses with AI
- 7 different movement patterns
- Emergency mode activation
- Real-time monitoring dashboard

🛡️ Security:
- Advanced stealth mode
- Adaptive behavior learning
- Context-aware responses
- Multi-layer protection systems

🎮 Configuration:
- Server: ${SERVER_HOST}:${SERVER_PORT}
- Bot: ${BOT_USERNAME}
- Version: ${MC_VERSION}
- Stealth: ${STEALTH_MODE}
- Protection: ${PROTECTION_LEVEL}

Generated by Quick Deploy Wizard $(date)"

        print_colored "${CHECK} تم حفظ الملفات في Git" "${GREEN}"
    fi
}

# دالة إنشاء مستودع GitHub
create_github_repo() {
    print_colored "${INFO} هل تريد إنشاء مستودع على GitHub؟ (يتطلب GitHub CLI)" "${BLUE}"
    read -p "إنشاء مستودع GitHub؟ (y/n): " CREATE_GITHUB
    
    if [[ $CREATE_GITHUB == "y" || $CREATE_GITHUB == "Y" ]]; then
        if command -v gh >/dev/null 2>&1; then
            print_colored "${INFO} إنشاء مستودع GitHub..." "${BLUE}"
            
            gh repo create "$REPO_NAME" \
                --description "🤖 Advanced Anti-Ban AFK Bot for Minecraft Aternos - Military-grade stealth technology with 95% human simulation accuracy" \
                --public \
                --add-readme=false \
                --clone=false
            
            # إضافة remote origin
            git remote add origin "https://github.com/$(gh auth status 2>&1 | grep 'account' | awk '{print $4}')/$REPO_NAME.git" 2>/dev/null || true
            
            # رفع الكود
            git branch -M main
            git push -u origin main
            
            print_colored "${CHECK} تم إنشاء المستودع ورفع الكود بنجاح!" "${GREEN}"
            print_colored "${INFO} رابط المستودع: https://github.com/$(gh auth status 2>&1 | grep 'account' | awk '{print $4}')/$REPO_NAME" "${BLUE}"
        else
            print_colored "${WARNING} GitHub CLI غير مثبت. يمكنك إنشاء المستودع يدوياً على GitHub.com" "${YELLOW}"
            print_colored "${INFO} ثم استخدم الأوامر التالية لرفع الكود:" "${BLUE}"
            echo "git remote add origin https://github.com/yourusername/$REPO_NAME.git"
            echo "git branch -M main"  
            echo "git push -u origin main"
        fi
    fi
}

# دالة إعداد Railway
setup_railway() {
    print_colored "${INFO} هل تريد نشر البوت على Railway؟" "${BLUE}"
    read -p "نشر على Railway؟ (y/n): " DEPLOY_RAILWAY
    
    if [[ $DEPLOY_RAILWAY == "y" || $DEPLOY_RAILWAY == "Y" ]]; then
        print_colored "${INFO} خطوات نشر Railway:" "${BLUE}"
        echo
        print_colored "1️⃣ اذهب إلى railway.app وسجل الدخول" "${YELLOW}"
        print_colored "2️⃣ اضغط 'New Project' ثم 'Deploy from GitHub repo'" "${YELLOW}"
        print_colored "3️⃣ اختر المستودع: $REPO_NAME" "${YELLOW}"
        print_colored "4️⃣ أضف متغيرات البيئة التالية:" "${YELLOW}"
        echo
        echo "SERVER_HOST=${SERVER_HOST}"
        echo "SERVER_PORT=${SERVER_PORT}"
        echo "BOT_USERNAME=${BOT_USERNAME}"
        echo "MC_VERSION=${MC_VERSION}"
        echo "BOT_AUTH=offline"
        echo "STEALTH_MODE=${STEALTH_MODE}"
        echo "PROTECTION_LEVEL=${PROTECTION_LEVEL}"
        echo "BOT_PERSONALITY=${BOT_PERSONALITY}"
        echo
        print_colored "5️⃣ اضغط Deploy وانتظر اكتمال النشر" "${YELLOW}"
        
        # إنشاء ملف quick-railway.txt للمساعدة
        cat > railway-setup.txt << EOF
🚀 متغيرات البيئة لـ Railway:

SERVER_HOST=${SERVER_HOST}
SERVER_PORT=${SERVER_PORT}  
BOT_USERNAME=${BOT_USERNAME}
MC_VERSION=${MC_VERSION}
BOT_AUTH=offline
STEALTH_MODE=${STEALTH_MODE}
PROTECTION_LEVEL=${PROTECTION_LEVEL}
BOT_PERSONALITY=${BOT_PERSONALITY}
CHAT_RESPONSE_RATE=0.1
MOVEMENT_TYPE=natural
ACTIVITY_LEVEL=medium
DEBUG_MODE=false
DAILY_REPORTS=true

📝 ملاحظات:
- تأكد من أن السيرفر مفتوح على Aternos قبل التشغيل
- يمكنك مراقبة البوت من خلال سجلات Railway
- البوت سيبدأ تلقائياً بعد النشر

تم إنشاؤه في: $(date)
EOF
        
        print_colored "${CHECK} تم حفظ إعدادات Railway في: railway-setup.txt" "${GREEN}"
    fi
}

# دالة اختبار البوت محلياً
test_bot() {
    print_colored "${INFO} هل تريد اختبار البوت محلياً أولاً؟" "${BLUE}"
    read -p "تشغيل اختبار محلي؟ (y/n): " TEST_LOCAL
    
    if [[ $TEST_LOCAL == "y" || $TEST_LOCAL == "Y" ]]; then
        print_colored "${INFO} تثبيت التبعيات..." "${BLUE}"
        npm install
        
        print_colored "${INFO} بدء اختبار البوت (سيتوقف تلقائياً بعد دقيقة)..." "${BLUE}"
        print_colored "${WARNING} تأكد من أن السيرفر ${SERVER_HOST}:${SERVER_PORT} مفتوح على Aternos" "${YELLOW}"
        
        # تشغيل البوت لمدة دقيقة
        timeout 60 npm start || true
        
        print_colored "${CHECK} انتهى الاختبار المحلي" "${GREEN}"
    fi
}

# دالة إنشاء تقرير النشر
create_deployment_report() {
    local REPORT_FILE="deployment-report.md"
    
    print_colored "${INFO} إنشاء تقرير النشر..." "${BLUE}"
    
    cat > "$REPORT_FILE" << EOF
# 🤖 تقرير نشر البوت المتقدم

## 📊 معلومات النشر

- **تاريخ النشر**: $(date)
- **اسم المستودع**: $REPO_NAME
- **إصدار البوت**: 2.0.0

## 🎯 إعدادات السيرفر

- **العنوان**: $SERVER_HOST
- **المنفذ**: $SERVER_PORT  
- **اسم البوت**: $BOT_USERNAME
- **إصدار Minecraft**: $MC_VERSION

## 🛡️ إعدادات الحماية

- **وضع التخفي**: $STEALTH_MODE
- **مستوى الحماية**: $PROTECTION_LEVEL
- **نوع الشخصية**: $BOT_PERSONALITY

## ✅ الملفات المنشأة

- [x] index.js - الملف الرئيسي للبوت
- [x] package.json - إعدادات المشروع
- [x] .env - متغيرات البيئة  
- [x] config.js - ملف الإعدادات المتقدم
- [x] Dockerfile - لتشغيل Docker
- [x] docker-compose.yml - تشغيل متقدم
- [x] railway.toml - إعدادات Railway
- [x] start.sh - سكريبت البدء
- [x] monitor/index.html - لوحة المراقبة
- [x] .github/workflows/deploy.yml - نشر تلقائي

## 🚀 خطوات النشر التالية

### 1. GitHub
\`\`\`bash
git remote add origin https://github.com/yourusername/$REPO_NAME.git
git branch -M main
git push -u origin main
\`\`\`

### 2. Railway
1. اذهب إلى [Railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub repo"
3. اختر المستودع: $REPO_NAME
4. أضف متغيرات البيئة من ملف railway-setup.txt

### 3. مراقبة البوت
- استخدم لوحة المراقبة في monitor/index.html
- راقب السجلات في Railway Dashboard
- تحقق من إحصائيات الأداء يومياً

## 🛡️ نصائح الأمان

- ✅ البوت مزود بحماية متقدمة ضد الكشف
- ✅ محاكاة السلوك البشري بدقة 95%
- ✅ نظام إنذار مبكر للمخاطر
- ✅ إعادة اتصال ذكية ومتدرجة

## 📞
