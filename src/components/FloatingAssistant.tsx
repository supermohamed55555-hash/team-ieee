import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  AlertCircle,
  HelpCircle,
  Phone,
  MapPin,
  Tag,
  Clock
} from 'lucide-react';
import { getServices, getSettings } from '../lib/mock-api';
import { Service, SiteSettings } from '../lib/types';
import { DEFAULT_SETTINGS } from '../lib/mock-data';

interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user' | 'system';
  text: string;
  timestamp: string;
}

export const FloatingAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [services, setServices] = useState<Service[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load site data for intelligent client-side responses
  useEffect(() => {
    getServices().then((res) => {
      if (res) setServices(res);
    });
    getSettings().then((res) => {
      if (res) setSettings(res);
    });

    const handleSettingsUpdated = (e: any) => {
      if (e.detail) setSettings(e.detail);
    };
    const handleServicesUpdated = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) setServices(e.detail);
    };

    window.addEventListener('yuzersef-settings-updated', handleSettingsUpdated);
    window.addEventListener('yuzersef-services-updated', handleServicesUpdated);
    return () => {
      window.removeEventListener('yuzersef-settings-updated', handleSettingsUpdated);
      window.removeEventListener('yuzersef-services-updated', handleServicesUpdated);
    };
  }, []);

  // Initialize welcome message
  useEffect(() => {
    const welcomeMsg: ChatMessage = {
      id: 'welcome-1',
      sender: 'assistant',
      text: 'أهلاً بك في يوزرسيف (أسوان)! ✨\nأنا مساعدك الذكي المباشر. اسألني عن أسعار وخامات الطباعة والتطريز، طريقة تقديم طلب، أو تتبع شحنتك.',
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([welcomeMsg]);
  }, []);

  // Scroll to bottom when messages change or typing
  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  // Client-side intelligent assistant logic (Zero backend dependency)
  const generateClientReply = (prompt: string): string => {
    const query = prompt.toLowerCase().trim();

    // 1. Greetings
    if (/^(مرحبا|أهلا|اهلاً|سلام|السلام عليكم|صباح الخير|مساء الخير|هاي|hello|hi)/i.test(query)) {
      return `أهلاً وسهلاً بك في ${settings.businessName || 'وكالة يوزرسيف'} بأسوان! ✨\n\nأنا في خدمتك لمساعدتك في كل ما يخص الطباعة والتطريز. يمكنك أن تسألني عن:\n• أسعار وخامات التيشيرتات والهوديز والكابات.\n• خطوات تقديم طلب وتوزيع المقاسات.\n• تتبع حالة طلبك بالرقم.\n• عنوان المقر والتواصل عبر واتساب.\n\nكيف أقدر أساعدك؟`;
    }

    // 2. Pricing inquiries
    if (
      query.includes('سعر') ||
      query.includes('اسعار') ||
      query.includes('أسعار') ||
      query.includes('بكام') ||
      query.includes('تكلفة') ||
      query.includes('price') ||
      query.includes('cost')
    ) {
      let reply = `💰 **قائمة الأسعار المعتمدة لخدمات ومنتجات يوزرسيف بأسوان:**\n\n`;
      if (services.length > 0) {
        services.slice(0, 6).forEach((s) => {
          reply += `• **${s.title}**: ${s.startingPrice} (${s.estimatedDays || '2-4 أيام عمل'})\n`;
        });
      } else {
        reply += `• تيشرتات وهوديز قطن 100%: تبدأ من 180 ج.م\n• كابات مطرزة 3D: تبدأ من 95 ج.م\n• استيكرات Die-Cut فينيل: تبدأ من 50 ج.م\n• مجّات وهدايا حرارية: تبدأ من 85 ج.م\n• جرابات هواتف UV: تبدأ من 120 ج.م\n• تصاميم ومساعدة فنية: تبدأ من 70 ج.م\n`;
      }
      reply += `\n*ملاحظة:* نوفر خصومات مميزة لطلبيات المجموعات، الجامعات، والكميات الكبيرة!`;
      return reply;
    }

    // 3. Materials and printing techniques
    if (
      query.includes('خام') ||
      query.includes('طباع') ||
      query.includes('تطريز') ||
      query.includes('dtf') ||
      query.includes('uv') ||
      query.includes('فينيل') ||
      query.includes('قطن') ||
      query.includes('غسيل')
    ) {
      return `🧵 **تقنيات الطباعة والخامات المعتمدة في معمل أسوان:**\n\n1. **طباعة DTF فوتوغرافية:** ألوان كاملة فائقة النقاء ومطاطية تقاوم أكثر من 50 غسلة دون تقشر على خامات قطن مصري 100% معالج.\n2. **تطريز كمبيوتر 3D:** خيوط ميتاليك بارزة تدوم للأبد على الكابات وهوديز التخرج.\n3. **قص فينيل Die-Cut ألماني:** ملصقات مقاومة للماء والحرارة والشمس بنسبة 100% للابتوبات والسيارات والمنتجات.\n4. **طباعة حرارية Sublimation:** مدمجة بجزيئات السيراميك للمجّات والثرامس.\n5. **طباعة UV ثلاثية الأبعاد:** لجرابات الهواتف بملمس بارز مانع للانزلاق.`;
    }

    // 4. Tracking
    if (
      query.includes('تتبع') ||
      (query.includes('طلب') && (query.includes('فين') || query.includes('حالة') || query.includes('وصل') || query.includes('كود')))
    ) {
      return `📦 **تتبع حالة طلبك:**\n\nيمكنك تتبع تقدم طلبك مباشرة بالدخول على صفحة [تتبع حالة الطلب](/track)، ثم كتابة كود الطلب الخاص بك (مثال: YZ-0001).\n\nستتمكن من رؤية:\n• المرحلة الحالية (تم التقديم، قيد المراجعة، معتمد، قيد الطباعة، جاهز للتسليم).\n• ملاحظات المعمل في أسوان وموعد الاستلام.`;
    }

    // 5. How to place an order
    if (
      query.includes('ازاي اطلب') ||
      query.includes('عايز اطلب') ||
      query.includes('طريقة الطلب') ||
      query.includes('اطلب ازاي') ||
      query.includes('طلب جديد')
    ) {
      return `🚀 **طريقة تقديم طلبك عبر الموقع في دقيقتين:**\n\n1. انتقل إلى [معالج تقديم الطلب](/request).\n2. اختر الخدمة أو المنتج المطلوب وحدد الكمية.\n3. إذا كان طلبك ملابس، حدد توزيع المقاسات (S, M, L, XL, XXL) وموضع الطباعة.\n4. ارفع ملف التصميم أو اطلب مساعدة المصمم الفنية.\n5. اختر طريقة الاستلام (من مقر أسوان أو شحن).\n\nبمجرد الإرسال ستحصل على كود تتبع فوري لمتابعة الإنتاج!`;
    }

    // 6. Sizes / Clothing specifics
    if (query.includes('مقاس') || query.includes('اوفر سايز') || query.includes('size')) {
      return `👕 **دليل المقاسات في يوزرسيف:**\n\n• ندعم كافة المقاسات من S وحتى XXL مع فحص تلقائي لتطابق مجموع المقاسات مع الكمية الإجمالية لمنع أي أخطاء في الإنتاج.\n• نوفر قصات عصرية أوفر سايز (Oversized) وقصات كلاسيكية منتظمة.\n• خاماتنا قطن مصري 100% مبطن أو سنجل جيرسي معالج ضد الانكماش بعد الغسيل.`;
    }

    // 7. Location & Aswan Address
    if (
      query.includes('مكان') ||
      query.includes('عنوان') ||
      query.includes('مقر') ||
      query.includes('فين') ||
      query.includes('اسوان') ||
      query.includes('فرع')
    ) {
      return `📍 **المقر والمعمل في أسوان:**\n${settings.address || 'أسوان، جمهورية مصر العربية'}\n\n• مواعيد العمل: ${settings.workingHours || 'السبت - الخميس: 9:00 ص - 10:00 م'}\n• الاستلام متاح مباشرة من مقرنا بأسوان، أو بالشحن السريع لكافة محافظات مصر.`;
    }

    // 8. WhatsApp & Direct Phone Contact
    if (
      query.includes('واتس') ||
      query.includes('تليفون') ||
      query.includes('موبايل') ||
      query.includes('رقم') ||
      query.includes('اتصل') ||
      query.includes('تواصل') ||
      query.includes('phone')
    ) {
      return `📞 **قنوات التواصل المباشرة:**\n\n• واتساب رسمي: ${settings.whatsapp}\n• رابط مباشر: [محادثة واتساب سريعة](https://wa.me/20${settings.whatsapp.replace(/^0+/, '')}?text=${encodeURIComponent(settings.whatsappDefaultMessage || 'مرحباً، أود الاستفسار عن خدمات يوزرسيف في أسوان.')})\n• البريد الإلكتروني: ${settings.email}\n\nفريقنا متواجد للرد السريع وتأكيد كافة التفاصيل الفنية!`;
    }

    // 9. Interactive Lab & Customizer
    if (
      query.includes('معمل') ||
      query.includes('تخصيص') ||
      query.includes('الوان') ||
      query.includes('ألوان') ||
      query.includes('موك اب') ||
      query.includes('custom')
    ) {
      return `🎨 **مختبر يوزرسيف واستوديو التخصيص:**\n\nيمكنك تجربة الألوان الواقعية ومواضع الطباعة وتجربة الشعار على التيشيرتات والهوديز والمجات عبر صفحة [مختبر يوزرسيف](/lab) أو [أداة التخصيص](/customize).`;
    }

    // 10. General fallback answer
    return `مرحباً بك! في ${settings.businessName || 'وكالة يوزرسيف'} بأسوان نقدم خدمات طباعة وتطريز احترافية على الملابس، الكابات، الاستيكرات، المجات، وجرابات الهواتف.\n\nيمكنك:\n• [تقديم طلب جديد الآن](/request)\n• [تتبع حالة طلب سابق](/track)\n• التواصل المباشر عبر واتساب: [${settings.whatsapp}](https://wa.me/20${settings.whatsapp.replace(/^0+/, '')})\n\nهل تود الاستفسار عن أسعار منتج معين؟`;
  };

  const handleSendMessage = async (textToSend?: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = (textToSend || inputMessage).trim();
    if (!trimmed || isTyping) return;

    if (trimmed.length > 500) {
      setErrorMessage('الرسالة طويلة جداً (الحد الأقصى 500 حرف).');
      return;
    }

    setErrorMessage(null);

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputMessage('');
    setIsTyping(true);

    const botMessageId = 'bot-' + Date.now();

    // 100% Frontend self-contained response with realistic smooth typing delay
    setTimeout(() => {
      const reply = generateClientReply(trimmed);
      setMessages((prev) => [
        ...prev,
        {
          id: botMessageId,
          sender: 'assistant',
          text: reply,
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 450);
  };

  const quickChips = [
    { label: '💰 قائمة الأسعار', prompt: 'ما هي أسعار الطباعة والمنتجات لديكم؟' },
    { label: '📍 عنوان المقر بأسوان', prompt: 'أين يقع مقر يوزرسيف في أسوان ومواعيد العمل؟' },
    { label: '📦 طريقة تتبع طلبي', prompt: 'كيف أقوم بتتبع حالة طلبي؟' },
    { label: '🧵 خامات الطباعة والتطريز', prompt: 'ما هي خامات الملابس وتقنيات الطباعة المعتمدة؟' },
    { label: '💬 محادثة واتساب', prompt: 'ما هو رقم الواتساب الرسمي للتواصل المباشر؟' },
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end" dir="rtl">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[390px] h-[540px] max-h-[85vh] bg-white rounded-3xl shadow-[0_15px_40px_rgba(7,59,53,0.25)] border-2 border-[#0B5F55]/20 flex flex-col overflow-hidden mb-3.5 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#073B35] to-[#0B5F55] text-white p-4 flex items-center justify-between shadow-xs shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#E3A92F] shadow-inner">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black flex items-center gap-1.5 font-display">
                  <span>مساعد يوزرسيف الذكي</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#E3A92F]" />
                </h3>
                <span className="text-[10px] text-emerald-200/90 font-medium">
                  نظام ذكي متكامل · إجابات فورية
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
              aria-label="إغلاق الشات"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#F8F7F3] text-xs sm:text-sm">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${
                      isUser
                        ? 'bg-[#E3A92F] text-[#073B35] font-bold'
                        : 'bg-[#0B5F55] text-white'
                    }`}
                  >
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`max-w-[82%] rounded-2xl p-3 shadow-xs leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? 'bg-[#0B5F55] text-white rounded-tr-xs'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                    }`}
                  >
                    {msg.text}
                    <span
                      className={`block text-[10px] mt-1 text-end ${
                        isUser ? 'text-emerald-200' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2.5 items-center text-slate-500 text-xs bg-white/80 backdrop-blur-xs p-2.5 rounded-2xl w-fit border border-slate-200 shadow-2xs">
                <div className="flex gap-1 items-center px-1">
                  <span className="w-2 h-2 rounded-full bg-[#0B5F55] animate-bounce" />
                  <span
                    className="w-2 h-2 rounded-full bg-[#0B5F55] animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  />
                  <span
                    className="w-2 h-2 rounded-full bg-[#0B5F55] animate-bounce"
                    style={{ animationDelay: '0.4s' }}
                  />
                </div>
                <span className="text-[11px] font-bold text-[#073B35]">جاري تحضير الإجابة...</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 py-2 bg-slate-100/80 border-t border-slate-200/80 flex items-center gap-1.5 overflow-x-auto shrink-0">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(chip.prompt)}
                disabled={isTyping}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white hover:bg-[#0B5F55] hover:text-white text-slate-700 border border-slate-200 transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-2xs"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="bg-red-50 text-red-700 px-3 py-1.5 text-xs flex items-center gap-1.5 border-t border-red-200">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Input Area */}
          <form
            onSubmit={(e) => handleSendMessage(undefined, e)}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              maxLength={500}
              onChange={(e) => {
                setInputMessage(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="اكتب استفسارك هنا..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0B5F55] focus:bg-white transition-all"
              disabled={isTyping}
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="w-10 h-10 rounded-xl bg-[#0B5F55] hover:bg-[#073B35] disabled:opacity-40 disabled:hover:bg-[#0B5F55] text-white flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0"
              aria-label="إرسال"
            >
              <Send className="w-4 h-4 rtl:-scale-x-100" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-[#E3A92F] hover:bg-[#d89c25] border-2 border-[#073B35] shadow-[3px_3px_0px_#073B35] text-[#073B35] flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer relative group"
        aria-label="مساعد يوزرسيف"
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform group-hover:rotate-90 duration-200" />
        ) : (
          <>
            <Bot className="w-6 h-6 text-[#073B35]" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#073B35] ring-2 ring-[#E3A92F] flex items-center justify-center text-[8px] font-black text-[#E3A92F]">
              ✦
            </span>
          </>
        )}
      </button>
    </div>
  );
};
