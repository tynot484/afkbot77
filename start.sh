#!/bin/bash

# ===================================
# 🤖 سكريبت بدء تشغيل البوت المتقدم
# ===================================

set -e

# الألوان للإخراج
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# رموز تعبيرية
ROBOT="🤖"
SHIELD="🛡️"
ROCKET="🚀"
CHECK="✅"
CROSS="❌"
WARNING="⚠️"
INFO="ℹ️"

# دالة طباعة ملونة
print_colored() {
    echo -e "${2}${1}${NC}"
}

# دالة طباعة العنوان
print_banner() {
    echo -e "${PURPLE}"
    echo "╔══════════════════════════════════════════╗"
    echo "║          🤖 ADVANCED AFK BOT             ║"
    echo "║       Advanced Anti-Ban Technology       ║"
    echo "║              Version 2.0.0               ║"
    echo "╚══════════════════════════════════════════╝"
    echo -e "${NC}"
}

# دالة فحص المتطلبات
check_requirements() {
    print_colored "${INFO} فحص المتطلبات..." "${CYAN}"
    
    # فحص Node.js
    if command -v node >/dev/null 2>&1; then
        NODE_VERSION=$(node --version)
        print_colored "${CHECK} Node.js: ${NODE_VERSION}" "${GREEN}"
    else
        print_colored "${CROSS} Node.js غير مثبت!" "${RED}"
        exit 1
    fi
    
    # فحص NPM
    if command -v npm >/dev/null 2>&1; then
        NPM_VERSION=$(npm --version)
        print_colored "${CHECK} NPM: v${NPM_VERSION}" "${GREEN}"
    else
        print_colored "${CROSS} NPM غير مثبت!" "${RED}"
        exit 1
    fi
    
    # فحص ملف package.json
    if [[ -f "package.json" ]]; then
        print_colored "${CHECK} package.json موجود" "${GREEN}"
    else
        print_colored "${CROSS} ملف package.json غير موجود!" "${RED}"
        exit 1
    fi
}

# دالة تثبيت التبعيات
install_dependencies() {
    print_colored "${INFO} تثبيت التبعيات..." "${CYAN}"
    
    if npm install; then
        print_colored "${CHECK} تم تثبيت التبعيات بنجاح" "${GREEN}"
    else
        print_colored "${CROSS} فشل في تثبيت التبعيات!" "${RED}"
        exit 1
    fi
}

# دالة فحص ملف البيئة
check_env_file() {
    print_colored "${INFO} فحص إعدادات البيئة..." "${CYAN}"
    
    if [[ -f ".env" ]]; then
        print_colored "${CHECK} ملف .env موجود" "${GREEN}"
        
        # فحص المتغيرات المطلوبة
        required_vars=("SERVER_HOST" "SERVER_PORT" "BOT_USERNAME" "MC_VERSION")
        
        for var in "${required_vars[@]}"; do
            if grep -q "^${var}=" .env; then
                value=$(grep "^${var}=" .env | cut -d '=' -f2)
                print_colored "${CHECK} ${var}: ${value}" "${GREEN}"
            else
                print_colored "${WARNING} المتغير ${var} غير محدد في .env" "${YELLOW}"
            fi
        done
    else
        print_colored "${WARNING} ملف .env غير موجود - سيتم استخدام القيم الافتراضية" "${YELLOW}"
        
        # إنشاء ملف .env تلقائياً
        if [[ -f ".env.example" ]]; then
            cp .env.example .env
            print_colored "${CHECK} تم إنشاء ملف .env من المثال" "${GREEN}"
            print_colored "${INFO} يرجى تعديل ملف .env بالإعدادات الصحيحة" "${CYAN}"
        fi
    fi
}

# دالة فحص الاتصال
test_connection() {
    print_colored "${INFO} اختبار الاتصال بالسيرفر..." "${CYAN}"
    
    # قراءة إعدادات السيرفر
    if [[ -f ".env" ]]; then
        SERVER_HOST=$(grep "^SERVER_HOST=" .env | cut -d '=' -f2 | tr -d '"'"'"' ')
        SERVER_PORT=$(grep "^SERVER_PORT=" .env | cut -d '=' -f2 | tr -d '"'"'"' ')
    else
        SERVER_HOST="justforlaugh.aternos.me"
        SERVER_PORT="19465"
    fi
    
    # فحص الاتصال
    if command -v nc >/dev/null 2>&1; then
        if nc -z -w5 "$SERVER_HOST" "$SERVER_PORT" 2>/dev/null; then
            print_colored "${CHECK} الاتصال بالسيرفر ناجح: ${SERVER_HOST}:${SERVER_PORT}" "${GREEN}"
        else
            print_colored "${WARNING} لا يمكن الوصول للسيرفر: ${SERVER_HOST}:${SERVER_PORT}" "${YELLOW}"
            print_colored "${INFO} تأكد من أن السيرفر مفتوح على Aternos" "${CYAN}"
        fi
    else
        print_colored "${INFO} لا يمكن اختبار الاتصال (nc غير مثبت)" "${CYAN}"
    fi
}

# دالة إنشاء مجلدات
create_directories() {
    print_colored "${INFO} إنشاء المجلدات المطلوبة..." "${CYAN}"
    
    directories=("logs" "data" "backups")
    
    for dir in "${directories[@]}"; do
        if [[ ! -d "$dir" ]]; then
            mkdir -p "$dir"
            print_colored "${CHECK} تم إنشاء مجلد: $dir" "${GREEN}"
        else
            print_colored "${CHECK} مجلد موجود: $dir" "${GREEN}"
        fi
    done
}

# دالة بدء البوت
start_bot() {
    print_colored "${ROCKET} بدء تشغيل البوت المتقدم..." "${PURPLE}"
    echo
    
    # طباعة معلومات التشغيل
    print_colored "════════════════════════════════════════════════════" "${PURPLE}"
    print_colored "${SHIELD} وضع الحماية المتقدم مفعل" "${GREEN}"
    print_colored "${ROBOT} محاكاة السلوك البشري: 95%" "${GREEN}"
    print_colored "${INFO} تقنيات مكافحة الحظر: نشطة" "${GREEN}"
    print_colored "════════════════════════════════════════════════════" "${PURPLE}"
    echo
    
    # بدء البوت مع معالجة الأخطاء
    if npm start; then
        print_colored "${CHECK} تم إيقاف البوت بنجاح" "${GREEN}"
    else
        print_colored "${CROSS} البوت توقف بخطأ!" "${RED}"
        exit 1
    fi
}

# دالة تشغيل في وضع التطوير
dev_mode() {
    print_colored "${INFO} تشغيل في وضع التطوير..." "${CYAN}"
    
    if command -v nodemon >/dev/null 2>&1; then
        nodemon index.js
    else
        print_colored "${WARNING} nodemon غير مثبت - استخدام node عادي" "${YELLOW}"
        node index.js
    fi
}

# دالة عرض المساعدة
show_help() {
    echo -e "${WHITE}الاستخدام: $0 [OPTIONS]${NC}"
    echo
    echo -e "${CYAN}الخيارات:${NC}"
    echo -e "  ${GREEN}start${NC}      بدء تشغيل البوت (افتراضي)"
    echo -e "  ${GREEN}dev${NC}        تشغيل في وضع التطوير"
    echo -e "  ${GREEN}install${NC}    تثبيت التبعيات فقط"
    echo -e "  ${GREEN}check${NC}      فحص المتطلبات والإعدادات"
    echo -e "  ${GREEN}test${NC}       اختبار الاتصال بالسيرفر"
    echo -e "  ${GREEN}docker${NC}     تشغيل باستخدام Docker"
    echo -e "  ${GREEN}help${NC}       عرض هذه المساعدة"
    echo
    echo -e "${CYAN}أمثلة:${NC}"
    echo -e "  $0              # بدء عادي"
    echo -e "  $0 dev          # وضع التطوير"
    echo -e "  $0 check        # فحص الإعدادات"
    echo
}

# دالة تشغيل Docker
run_docker() {
    print_colored "${INFO} تشغيل البوت باستخدام Docker..." "${CYAN}"
    
    if command -v docker >/dev/null 2>&1; then
        if [[ -f "Dockerfile" ]]; then
            print_colored "${INFO} بناء صورة Docker..." "${CYAN}"
            docker build -t advanced-afk-bot .
            
            print_colored "${INFO} تشغيل الحاوية..." "${CYAN}"
            docker run --rm -it --env-file .env advanced-afk-bot
        else
            print_colored "${CROSS} ملف Dockerfile غير موجود!" "${RED}"
            exit 1
        fi
    else
        print_colored "${CROSS} Docker غير مثبت!" "${RED}"
        exit 1
    fi
}

# دالة تنظيف الملفات المؤقتة
cleanup() {
    print_colored "${INFO} تنظيف الملفات المؤقتة..." "${CYAN}"
    
    # حذف ملفات السجلات القديمة
    find logs/ -name "*.log" -mtime +7 -delete 2>/dev/null || true
    
    # حذف ملفات npm المؤقتة
    npm cache clean --force >/dev/null 2>&1 || true
    
    print_colored "${CHECK} تم التنظيف" "${GREEN}"
}

# دالة معالجة إشارة الإيقاف
handle_stop_signal() {
    echo
    print_colored "${WARNING} تم استلام إشارة إيقاف..." "${YELLOW}"
    cleanup
    print_colored "${CHECK} تم إيقاف البوت بأمان" "${GREEN}"
    exit 0
}

# تسجيل معالج الإشارات
trap handle_stop_signal SIGINT SIGTERM

# ═══════════════════════════════════════
# 🚀 الدالة الرئيسية
# ═══════════════════════════════════════

main() {
    # طباعة البانر
    print_banner
    
    # معالجة المعاملات
    case "${1:-start}" in
        "start")
            check_requirements
            install_dependencies
            check_env_file
            test_connection
            create_directories
            start_bot
            ;;
        "dev")
            check_requirements
            install_dependencies
            check_env_file
            create_directories
            dev_mode
            ;;
        "install")
            check_requirements
            install_dependencies
            ;;
        "check")
            check_requirements
            check_env_file
            test_connection
            ;;
        "test")
            test_connection
            ;;
        "docker")
            run_docker
            ;;
        "clean")
            cleanup
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            print_colored "${CROSS} خيار غير معروف: $1" "${RED}"
            show_help
            exit 1
            ;;
    esac
}

# تشغيل الدالة الرئيسية
main "$@"
