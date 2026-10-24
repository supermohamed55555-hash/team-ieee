import {
  Service,
  PortfolioItem,
  ServiceRequest,
  SiteSettings,
  Coupon,
  FAQItem,
  WorkshopPolicies,
  PromoPopupConfig
} from './types';

export const DEMO_NOTICE = 'تجريبي - للعرض فقط (Demo Data - Needs Client Confirmation)';

// The exact 6 core services of Yuzersef Aswan from brief documentation
export const DEMO_SERVICES: Service[] = [
  {
    id: 'clothing-hoodies',
    category: 'clothing',
    title: 'تيشرتات وهوديز وسويت شيرت مطبوعة',
    shortDescription: 'طباعة DTF وتطريز ميكانيكي بارز على خامات قطن مصري 100% بمختلف المقاسات والألوان.',
    fullDescription: 'خدمة احترافية لتنفيذ الملابس المخصصة (تيشرتات، هوديز شتوية، سويت شيرت) للأفراد والفرق والشركات بأسوان. دعم توزيع المقاسات الدقيق والطباعة على الصدر والظهر بجودة ألوان فائقة.',
    icon: 'Shirt',
    imageUrl: '/services/service-hoodies.jpg',
    startingPrice: 'يبدأ من 180 ج.م',
    features: [
      'قطن مصري 100% عالي الكثافة معالج ضد الانكماش',
      'طباعة DTF فوتوغرافية وتطريز ميتاليك بارز',
      'توزيع مرن لكافة المقاسات من S حتى XXL',
      'طباعة وتطريز على الصدر أو الظهر أو الأكمام'
    ],
    deliverables: ['ملابس مطبوعة ومغلفة بشكل فردي فاخر', 'بروفة رقمية ومطابقة مواصفات قبل الإنتاج'],
    estimatedDays: '2 - 4 أيام عمل',
    badge: 'الأكثر طلباً'
  },
  {
    id: 'caps-embroidery',
    category: 'caps',
    title: 'كابات مطبوعة ومطرزة',
    shortDescription: 'كابات عصرية بيسبول وسناب باك بتطريز ميتاليك ثلاثي الأبعاد بارز مقاوم للشمس والاستخدام اليومي.',
    fullDescription: 'تخصيص كابات للفعاليات والمشاريع الشبابية وأصحاب البراندات في أسوان، بخامات قطنية وشبكية عالية الجودة وأقفال معدنية متينة مع دقة فائقة في رسم الغرز والتطريز البارز.',
    icon: 'Cap',
    imageUrl: '/services/service-caps.jpg',
    startingPrice: 'يبدأ من 95 ج.م',
    features: [
      'خامات قطنية وشبكية عالية التهوية تدوم طويلاً',
      'تطريز ميتاليك 3D بخيوط حريرية ذهبية وفضية',
      'مقاس موحد قابل للتعديل بأقفال معدنية محكمة',
      'تشكيلة ألوان رسمية: أسود، أبيض، وأخضر يوزرسيف'
    ],
    deliverables: ['كابات مفحوصة داخل علب حماية من التلف', 'معاينة رقمية للغرز قبل التجهيز'],
    estimatedDays: '2 - 3 أيام عمل',
    badge: 'تطريز بارز'
  },
  {
    id: 'stickers-labels',
    category: 'stickers',
    title: 'استيكرات ولواصق مخصصة (Die-Cut)',
    shortDescription: 'استيكرات فينيل مقاومة للماء والخدش، مقصوصة بدقة دي-كت على شكل الشعار أو أشكال هندسية.',
    fullDescription: 'طباعة ملصقات فينيل لامعة ومطفية تناسب اللابتوب، زجاجات المياه، تغليف المنتجات، والسيارات، مع قص مخصص دقيق حول أدق تفاصيل الشعار ومقاومة كاملة لحرارة وشمس أسوان.',
    icon: 'Sticker',
    imageUrl: '/services/service-stickers.jpg',
    startingPrice: 'يبدأ من 50 ج.م',
    features: [
      'فينيل ألماني مقاوم للماء وأشعة الشمس والخدوش',
      'قص مخصص Die-cut أو Kiss-cut على ورق سهل النزع',
      'ألوان مشبعة تبرز تفاصيل الخطوط الدقيقة',
      'خيارات تشطيب: لامع (Glossy) أو مطفي فاخر (Matte)'
    ],
    deliverables: ['شيتات أو ملصقات مقطعة فردياً جاهزة للتوزيع', 'لاصق قوي لا يترك أثراً عند الإزالة'],
    estimatedDays: '1 - 2 يوم عمل',
    badge: 'تسليم سريع'
  },
  {
    id: 'mugs-promotional-gifts',
    category: 'mugs-gifts',
    title: 'مجّات وهدايا ترويجية مخصصة',
    shortDescription: 'طباعة حرارية عالية الدقة على المجّات السيراميك والمجّات السحرية والثيرموسات والدروع التذكارية.',
    fullDescription: 'هدايا شخصية ودعائية تترك انطباعاً دائماً. طباعة ألوان كاملة ومقاومة لغسالات الأطباق والميكروويف، وتجهيز بوكسات تذكارية للهدايا والمناسبات والتخرج بأسوان.',
    icon: 'Coffee',
    imageUrl: '/services/service-mugs.jpg',
    startingPrice: 'يبدأ من 85 ج.م',
    features: [
      'سيراميك نقي عالي اللمعان أو مجات سحرية حرارية',
      'طباعة سبلميشن بدقة ألوان فوتوغرافية لا تبهت',
      'ثرامس حرارية مزدوجة لحفظ البرودة والحرارة',
      'إمكانية إدراج أسماء، عبارات ملهمة، وصور شخصية'
    ],
    deliverables: ['المج داخل كرتونة حماية مخصصة هدية', 'تغليف ضد الصدمات للشحن الآمن'],
    estimatedDays: '1 - 2 يوم عمل'
  },
  {
    id: 'phone-cases',
    category: 'phone-cases',
    title: 'جرابات هواتف مخصصة (Custom Phone Cases)',
    shortDescription: 'كفرات حماية مدعمة بأحدث تصاميمك وصورك المخصصة لكافة موديلات آيفون وسامسونج وغيرها.',
    fullDescription: 'حوّل هاتفك إلى قطعة فنية تعبر عنك! جرابات سيليكون مرنة أو صلبة مدعمة ضد الصدمات، مع طباعة UV متطورة ثلاثية الأبعاد لا تبهت مع الاستخدام اليومي.',
    icon: 'Smartphone',
    imageUrl: '/services/service-cases.jpg',
    startingPrice: 'يبدأ من 120 ج.م',
    features: [
      'متوفر لأكثر من 100 موديل لهواتف آبل، سامسونج، شاومي، وأوبو',
      'حواف مرتفعة لحماية الشاشة وعدسات الكاميرا',
      'طباعة UV ناصعة الألوان ومقاومة لبصمات الأصابع',
      'إمكانية إضافة اسمك أو تصميمك المفضل'
    ],
    deliverables: ['جراب مخصص داخل غلاف يوزرسيف الشفاف', 'ملمس مريح مانع للانزلاق'],
    estimatedDays: '1 - 3 أيام عمل',
    badge: 'طباعة UV'
  },
  {
    id: 'custom-designs',
    category: 'custom-design',
    title: 'تصاميم مخصصة ومساعدة فنية',
    shortDescription: 'رسم وتجهيز الشعارات وتفريغ الخلفيات وتحويل الأفكار إلى ملفات فيكتور جاهزة للطباعة.',
    fullDescription: 'إذا لم تكن تملك تصميماً جاهزاً للطباعة، مصممونا في أسوان على أهبة الاستعداد لمساعدتك في رسم الشعار أو ضبط دقة الصورة وتحويلها لمقاسات الطباعة المثالية.',
    icon: 'Palette',
    imageUrl: '/services/service-design.jpg',
    startingPrice: 'يبدأ من 70 ج.م',
    features: [
      'تحويل الرسومات اليدوية والسكتشات لملفات رقمية Vector',
      'تفريغ الصور وتحسين جودة الطباعة CMYK بدقة فائقة',
      'اقتراح مقاسات ومواضع الطباعة الأنسب للخامة',
      'بروفة رقمية واقعية (Mockup) قبل التنفيذ'
    ],
    deliverables: ['ملفات التصميم بصيغ AI, PDF, PNG عالية الدقة', 'موك أب توضيحي'],
    estimatedDays: '1 - 2 يوم عمل'
  }
];

export const DEMO_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'port-1',
    title: 'هوديز ملكية مطرزة لطلاب كلية الهندسة بأسوان',
    clientName: 'دفعة هندسة أسوان',
    category: 'clothing',
    serviceId: 'clothing-hoodies',
    description: 'تنفيذ 120 هودي أسود فاخر مع تطريز شعار الكلية بخيوط ميتاليك ذهبية ثلاثية الأبعاد على الصدر وتوزيع مقاسات دقيق.',
    imageUrl: '/showcase/premium-embroidered-hoodie.jpg',
    tags: ['هوديز ملكية', 'تطريز ميتاليك 3D', 'قطن مصري'],
    year: '2024',
    highlight: 'تم فحص جاهزية المقاسات عبر النظام وتسليم الطلبية بالكامل في 4 أيام.'
  },
  {
    id: 'port-2',
    title: 'استيكرات فينيل Die-Cut مقاومة للماء والحرارة',
    clientName: 'براند أسوان كرافت',
    category: 'stickers',
    serviceId: 'stickers-labels',
    description: '500 استيكر Die-cut مقصوص على شكل الشعار بلمعان مطفي يتحمل رطوبة وشمس أسوان لتغليف حقائب المنتجات.',
    imageUrl: '/services/service-stickers.jpg',
    tags: ['استيكرات دي-كت', 'فينيل مقاوم للماء', 'تغليف براند'],
    year: '2024',
    highlight: 'خامات فينيل ممتازة بقص دقيق على حدود التصميم.'
  },
  {
    id: 'port-3',
    title: 'كابات بيسبول بتطريز بارز وشعار ميتاليك',
    clientName: 'فريق الروبوتكس بجامعة أسوان',
    category: 'caps',
    serviceId: 'caps-embroidery',
    description: 'كابات عصرية متينة باللون الأسود الملكي وتطريز دقيق ثلاثي الأبعاد لا يتأثر بالغسيل والعوامل الخارجية.',
    imageUrl: '/services/service-caps.jpg',
    tags: ['كابات رياضية', 'تطريز 3D', 'أقفال معدنية'],
    year: '2024',
    highlight: 'تسليم 200 كاب قبل انطلاق الفعالية بيومين.'
  },
  {
    id: 'port-4',
    title: 'مجّات سيراميك حرارية وهدايا تخرج مخصصة',
    clientName: 'أكاديمية تدريب وبناء بأسوان',
    category: 'mugs-gifts',
    serviceId: 'mugs-promotional-gifts',
    description: 'مجّات سيراميك ناصعة البياض مع طباعة سبلميشن دقيقة لأسماء الخريجين وشعارات الأكاديمية.',
    imageUrl: '/services/service-mugs.jpg',
    tags: ['مج سيراميك', 'هدايا تخرج', 'سبلميشن فوتوغرافي'],
    year: '2024',
    highlight: 'تجهيز وتغليف فردي في علب هدايا أنيقة مبطنة.'
  },
  {
    id: 'port-5',
    title: 'جرابات هواتف بزخارف ونقوش أسوانية ثلاثية الأبعاد',
    clientName: 'متجر أصالة نوبية بأسوان',
    category: 'phone-cases',
    serviceId: 'phone-cases',
    description: 'سلسلة من جرابات آيفون وسامسونج بنقوش وزخارف تراثية ملونة بتقنية UV البارزة المقاومة للخدش.',
    imageUrl: '/services/service-cases.jpg',
    tags: ['جرابات آيفون', 'تراث أسواني', 'طباعة UV بارزة'],
    year: '2024',
    highlight: 'ثبات ألوان مذهل وملمس نافر عالي الفخامة.'
  },
  {
    id: 'port-6',
    title: 'الباقة الشاملة لهوية ومقتنيات يوزرسيف الملكية',
    clientName: 'استوديو يوزرسيف الإبداعي',
    category: 'clothing',
    serviceId: 'clothing-hoodies',
    description: 'استعراض متكامل للمجموعة الرسمية: هوديز، كابات مطرزة، مجات، استيكرات دي-كت، ونوت بوك فاخر.',
    imageUrl: '/showcase/luxury-flat-lay.png',
    tags: ['المجموعة الكاملة', 'تطريز وطباعة', 'هوية بصرية'],
    year: '2024',
    highlight: 'أعلى مقاييس التشطيب والجودة لمنتجات الهوية الرسمية.'
  },
  {
    id: 'port-7',
    title: 'تحويل سكتش يدوي إلى هودي مطرز ملكي',
    clientName: 'عميل براند خاص بأسوان',
    category: 'custom-design',
    serviceId: 'custom-designs',
    description: 'بدأ المشروع برسمة يدوية بالقلم الرصاص، قام فريق يوزرسيف بتحويلها إلى فيكتور متقن وتطريز ثلاثي الأبعاد متراص.',
    imageUrl: '/services/service-design.jpg',
    tags: ['من سكتش لمنتج', 'رسم فيكتور', 'تطريز ميتاليك'],
    year: '2024',
    highlight: 'معاينة التحول الكامل من الفكرة الأولية إلى المنتج النهائي.'
  },
  {
    id: 'port-8',
    title: 'تيشرتات أوفر سايز قطنية لماراثون النيل بأسوان',
    clientName: 'نادي رياضي أسواني',
    category: 'clothing',
    serviceId: 'clothing-hoodies',
    description: 'تيشرتات قطنية بيضاء وخضراء بطباعة متطورة مقاومة للعرق ومريحة للحركة مع أرقام المشاركين.',
    imageUrl: '/showcase/portfolio-scene-1.jpg',
    tags: ['ماراثون النيل', 'قطن مصري', 'طباعة رياضية'],
    year: '2024',
    highlight: 'جاهزية تامة وتسليم دقيق في الموعد المحدد.'
  },
  {
    id: 'port-9',
    title: 'تيشيرت يوزرسيف العنابي الفاخر مع طباعة فليكس ذهبية',
    clientName: 'تشكيلة يوزرسيف الحصرية',
    category: 'clothing',
    serviceId: 'clothing-hoodies',
    description: 'قطعة راقية بلون أحمر عنابي داكن مع كتابة "يوزرسيف" بطباعة فليكس ذهبية لامعة تعكس تفرد العلامة وشعار "خلّيك مختلف".',
    imageUrl: '/realistic/realistic_tshirt_maroon_yuzersef_1792775789403.jpg',
    tags: ['فليكس ذهبي ميتاليك', 'خامة شتوية ثقيلة', 'خلّيك مختلف'],
    year: '2024',
    highlight: 'ألوان عالية التباين وطباعة بارزة لا تتأثر بالغسيل.'
  },
  {
    id: 'port-10',
    title: 'كاب يوزرسيف الكلاسيكي بتطريز ذهبي بارز 3D',
    clientName: 'كابات يوزرسيف المعتمدة',
    category: 'caps',
    serviceId: 'caps-embroidery',
    description: 'كاب بيسبول بلون أخضر يوزرسيف الداكن مع تطريز خيوط حريرية ذهبية بارزة ثلاثية الأبعاد لشعار يوزرسيف العربي وأقفال معدنية متينة.',
    imageUrl: '/realistic/cap_embroidery_showcase_1792774344249.jpg',
    tags: ['كاب بيسبول', 'تطريز 3D ألماني', 'أخضر يوزرسيف'],
    year: '2024',
    highlight: 'خامات قطنية مضلعة وتطريز متراص يدوم طويلاً.'
  },
  {
    id: 'port-11',
    title: 'مج سيراميك يوزرسيف وميدالية جلدية محفورة بالليزر',
    clientName: 'هدايا يوزرسيف التذكارية',
    category: 'mugs-gifts',
    serviceId: 'mugs-promotional-gifts',
    description: 'مج سيراميك فاخر بلون أخضر يوزرسيف ومقبض مريح مع كاليجرافي عربي انسيابي وميدالية جلد طبيعي محفورة بدقة الليزر.',
    imageUrl: '/realistic/mug_and_gift_showcase_1792774344969.jpg',
    tags: ['مج سيراميك', 'حفر ليزر', 'جلد طبيعي'],
    year: '2024',
    highlight: 'بورسلين عالي المقاومة للحرارة مع تغليف هدايا ملكي.'
  },
  {
    id: 'port-12',
    title: 'باقة استيكرات فينيل وكفر هاتف يوزرسيف المقاوم للصدمات',
    clientName: 'المجموعة المعتمدة بأسوان',
    category: 'stickers',
    serviceId: 'stickers-labels',
    description: 'مجموعة ملصقات فينيل مطفية مقصوصة بالليزر Die-Cut بعبارات ملهمة مع كفر هاتف آيفون مدعم بطبقة حماية UV ضد الخدوش.',
    imageUrl: '/realistic/stickers_phonecase_showcase_1792774346393.jpg',
    tags: ['استيكرات دي-كت', 'كفر آيفون', 'حماية UV'],
    year: '2024',
    highlight: 'فينيل ألماني مقاوم للماء وأشعة شمس أسوان.'
  }
];

export const INITIAL_DEMO_REQUESTS: ServiceRequest[] = [
  {
    id: 'YZ-0001',
    customerName: 'محمود عبد الرحيم (تجريبي)',
    phone: '01012345678',
    email: 'mahmoud.aswan@example.com',
    serviceId: 'clothing-hoodies',
    serviceTitle: 'تيشرتات وهوديز وسويت شيرت مطبوعة',
    serviceCategory: 'clothing',
    projectBrief: 'طلب 10 هوديز شتوية لون أسود لفريق العمل، مع طباعة لوجو الشركة على الصدر بمقاس 10 سم وطباعة العبارة على الظهر.',
    quantity: 10,
    clothingColor: 'أسود',
    sizeBreakdown: { s: 2, m: 4, l: 3, xl: 1, xxl: 0 },
    printPlacement: 'both-sides',
    needsDesignHelp: false,
    desiredDate: '2026-10-30',
    receiptPreference: 'aswan-pickup',
    urgency: 'normal',
    budget: '1800 - 2000 ج.م',
    attachments: [
      { id: 'att-1', name: 'team-logo-vector.pdf', size: 1850000, type: 'application/pdf' }
    ],
    status: 'in-progress',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    adminNotes: 'تم فحص وتطابق توزيع المقاسات (10/10). جاري الطباعة الحرارية في المعمل.',
    nextStepText: 'التجهيز والتغليف والاستلام يوم الخميس من مقر يوزرسيف بأسوان.'
  },
  {
    id: 'YZ-0002',
    customerName: 'فاطمة النوبي (تجريبي)',
    phone: '01123456789',
    email: 'fatma.demo@example.com',
    serviceId: 'stickers-labels',
    serviceTitle: 'استيكرات ولواصق مخصصة (Die-Cut)',
    serviceCategory: 'stickers',
    projectBrief: 'استيكرات دائرية مقاس 5×5 سم لتغليف علب الكوكيز المنزلية، نحتاج لمسة مطفية مقاومة للزيوت والماء.',
    quantity: 200,
    stickerWidthCm: 5,
    stickerHeightCm: 5,
    stickerShape: 'circle',
    stickerUsage: 'outdoor-waterproof',
    needsDesignHelp: false,
    desiredDate: '2026-10-28',
    receiptPreference: 'shipping-delivery',
    urgency: 'urgent',
    budget: '250 ج.م',
    attachments: [
      { id: 'att-2', name: 'cookie-label-art.png', size: 920000, type: 'image/png' }
    ],
    status: 'under-review',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    adminNotes: 'طلب مستعجل قيد المراجعة الفنية للتأكد من هوامش القطع الدائري.',
    nextStepText: 'سيتم تأكيد عرض السعر النهائي خلال ساعتين عبر الواتساب.'
  },
  {
    id: 'YZ-0003',
    customerName: 'كريم الشريف (تجريبي)',
    phone: '01234567890',
    email: 'karim.demo@example.com',
    serviceId: 'phone-cases',
    serviceTitle: 'جرابات هواتف مخصصة (Custom Phone Cases)',
    serviceCategory: 'phone-cases',
    projectBrief: 'جراب هاتف آيفون 15 برو، أريد طباعة اسم "KAREEM" مع خلفية سوداء رخامية وتأثير بارز.',
    quantity: 1,
    phoneModel: 'iPhone 15 Pro',
    personalisationText: 'KAREEM',
    needsDesignHelp: true,
    desiredDate: '2026-10-27',
    receiptPreference: 'aswan-pickup',
    urgency: 'normal',
    budget: '120 ج.م',
    attachments: [],
    status: 'approved',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    adminNotes: 'الطلب معتمد. المصمم جهز البروفة الأولية للاعتماد.',
    nextStepText: 'تم إرسال بروفة التصميم على الواتساب وبانتظار موافقة العميل للبدء بالطباعة.'
  },
  {
    id: 'YZ-0004',
    customerName: 'عمر الصادق (تجريبي)',
    phone: '01512345678',
    email: 'omar.demo@example.com',
    serviceId: 'clothing-hoodies',
    serviceTitle: 'تيشرتات وهوديز وسويت شيرت مطبوعة',
    serviceCategory: 'clothing',
    projectBrief: 'طلب 50 تيشرت تخرج بلون أبيض، الميزانية المقترحة 1000 جنيه للكمية بالكامل.',
    quantity: 50,
    clothingColor: 'أبيض',
    sizeBreakdown: { s: 10, m: 20, l: 15, xl: 5, xxl: 0 },
    printPlacement: 'chest',
    needsDesignHelp: false,
    desiredDate: '2026-10-25',
    receiptPreference: 'aswan-pickup',
    urgency: 'normal',
    budget: '1000 ج.م (غير متوافق)',
    attachments: [],
    status: 'rejected',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    adminNotes: 'الميزانية المقدمة من العميل (20 ج.م للتيشرت) غير كافية لتغطية تكلفة خامة القطن المصري الفاخر والطباعة.',
    rejectionReason: 'الميزانية المقترحة أقل من تكلفة خامات القطن الفاخر والطباعة الحرارية المعتمدة لدى يوزرسيف.',
    nextStepText: 'يمكن للعميل تعديل الكمية أو اختيار خامة بديلة والتواصل معنا عبر واتساب 01116891025.'
  }
];

export const DEMO_ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'demo123',
  name: 'مسؤول يوزرسيف (Demo Admin)'
};

export const DEFAULT_SETTINGS: SiteSettings = {
  businessName: 'يوزرسيف للطباعة والتخصيص',
  phone: '01116891025',
  whatsapp: '01116891025',
  whatsappDefaultMessage: 'مرحباً، أود الاستفسار عن خدمات ومنتجات يوزرسيف في أسوان.',
  email: 'contact@usersafe.demo',
  address: 'أسوان، جمهورية مصر العربية (قرب محطة القطار)',
  workingHours: 'السبت - الخميس: 9:00 ص - 10:00 م',
  socialLinks: {
    facebook: 'https://facebook.com/yuzersef.aswan',
    instagram: 'https://instagram.com/yuzersef.aswan',
    tiktok: 'https://tiktok.com/@yuzersef.aswan',
    whatsapp: 'https://wa.me/201116891025',
    telegram: 'https://t.me/yuzersef',
    youtube: 'https://youtube.com/@yuzersef',
    twitter: 'https://x.com/yuzersef',
    behance: 'https://behance.net/yuzersef',
  },
  announcement: {
    enabled: true,
    text: 'خصم 10% على طلبيات التيشرتات والهوديز للجامعات والفرق بأسوان! تواصل معنا عبر واتساب',
    link: '/request',
  },
};

export const DEFAULT_COUPONS: Coupon[] = [
  {
    id: 'c-aswan10',
    code: 'ASWAN10',
    discountType: 'percentage',
    discountValue: 10,
    minQuantity: 1,
    description: 'خصم ترحيبي 10% لعملاء يوزرسيف بأسوان',
    isActive: true,
    usageCount: 24,
  },
  {
    id: 'c-grad2026',
    code: 'GRAD2026',
    discountType: 'percentage',
    discountValue: 15,
    minQuantity: 15,
    description: 'خصم خاص لدفعات التخرج والجامعات (15 قطعة فأكثر)',
    isActive: true,
    usageCount: 8,
  },
  {
    id: 'c-yuzersef50',
    code: 'YUZERSEF50',
    discountType: 'fixed',
    discountValue: 50,
    minBudget: 500,
    description: 'خصم 50 ج.م على الطلبيات التي تتجاوز 500 ج.م',
    isActive: true,
    usageCount: 15,
  },
];

export const DEFAULT_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'ما هي مواعيد العمل وكيف أتواصل معكم؟',
    answer: 'يمكنكم التواصل المباشر عبر الواتساب على الرقم المعتمد: 01116891025. مواعيد العمل من السبت إلى الخميس: 9:00 ص - 10:00 م.',
    category: 'عام',
  },
  {
    id: 'faq-2',
    question: 'ما هي صيغ الملفات المقبولة لرفع التصميمات؟',
    answer: 'نقبل ملفات PNG عالية الدقة بخلفية شفافة، JPG، وكذلك ملفات PDF أو Illustrator Vector بحجم أقصى 15 ميجابايت لضمان أعلى دقة وضوح للطباعة والتطريز.',
    category: 'التصميم والملفات',
  },
  {
    id: 'faq-3',
    question: 'ماذا لو لم يكن لدي تصميم جاهز؟',
    answer: 'يمكنك تفعيل خيار "أحتاج مساعدة في التصميم من فريق يوزرسيف" داخل استمارة الطلب، وسيتواصل معك المصمم لتجهيز الفكرة أو الخط العربي أو تفريغ الشعار.',
    category: 'التصميم والملفات',
  },
  {
    id: 'faq-4',
    question: 'هل يمكن استلام الطلبات من مقر أسوان مباشرة؟',
    answer: 'نعم، يتوفر استلام مباشر ومجاني من مقر يوزرسيف بأسوان بمجرد وصول إشعار جاهزية الطلب، كما نوفر خدمة الشحن السريع لباقي المحافظات.',
    category: 'التسليم والشحن',
  },
  {
    id: 'faq-5',
    question: 'كيف يتأكد مساعد جاهزية الطلب من مقاسات الملابس؟',
    answer: 'يقوم النظام بفحص تطابق مجموع المقاسات الفردية (S, M, L, XL, XXL) مع الكمية الإجمالية بدقة لمنع أي نقص أو خطأ في تشغيل ماكينات الطباعة والتطريز.',
    category: 'الطلبات والإنتاج',
  },
];

export const DEFAULT_POLICIES: WorkshopPolicies = {
  designProofing:
    '• يتم إرسال بروفة رقمية واقعية (Digital Mockup) لاعتمادها من العميل قبل إرسال أي ملفات إلى خطوط الإنتاج والطباعة.\n• تشمل خدمة التصميم 3 جولات تعديل مجانية وفق الشروط المتفق عليها.\n• اعتماد العميل للبروفة يعد موافقة نهائية على صحة النصوص والتهجئة وتوزيع المقاسات.',
  colorAndPrinting:
    '• نستخدم تقنية الطباعة المباشرة DTF وخيوط التطريز الميتاليك 3D الألمانية المقاومة للغسيل والاستخدام المتكرر.\n• نظراً لاختلاف ألوان شاشات الهواتف (RGB) عن أحبار الطباعة (CMYK)، قد يحدث تفاوت طبيعي لا يتعدى 5% في درجات الألوان.\n• خامات الملابس قطن مصري 100% معالج ضد الانكماش.',
  cancellationAndRefund:
    '• يمكن إلغاء الطلب واسترداد كامل التكلفة طالما أن حالة الطلب لا تزال «قيد المراجعة» أو «معتمد» ولم تبدأ مرحلة الطباعة الفعلية.\n• عند بدء مرحلة «قيد الطباعة»، يتم استهلاك الخامات المجهزة خصيصاً للعميل ولا يمكن استردادها.\n• نلتزم بإعادة طباعة أو استبدال أي قطعة يثبت وجود عيب مصنعي صادر من طرفنا فوراً وبدون أي تكلفة إضافية.',
  deliveryAndPickup:
    '• الاستلام متاح من مقر يوزرسيف بأسوان فور تحول حالة الطلب إلى «جاهز للتسليم».\n• يتم تسليم طلبات الشحن الخارجي عبر شركات الشحن السريع مع تزويد العميل برقم بوليصة التتبع.\n• يرجى فحص الطلبية عند الاستلام للتأكد من سلامة التغليف والكميات.',
  rushOrders:
    '• نقبل الطلبيات المستعجلة للفعاليات والمؤتمرات بأسوان مع أولوية تشغيل خاصة في المعمل.\n• يتم تحديد موعد التسليم الدقيق بالتنسيق المباشر عبر الواتساب مع إدارة المعمل.',
};

export const DEFAULT_PROMO_POPUP: PromoPopupConfig = {
  enabled: true,
  title: 'عرض التخرج والفعاليات بأسوان! 🎓',
  subtitle: 'وفر 15% على طلبيات الهوديز والتيشرتات للفرق والمجموعات',
  badge: 'عرض حصري محدود',
  description: 'اطلب الآن واستفد من خصم 15% وتطريز ميتاليك 3D مجاني لشعار الدفعة عند طلب 15 قطعة فأكثر باستخدام الكود:',
  ctaText: 'ابدأ طلبك الآن مع الخصم',
  ctaLink: '/request?service=clothing-hoodies',
  couponCode: 'GRAD2026',
  imageUrl: '/showcase/premium-embroidered-hoodie.jpg',
  showOncePerSession: true,
};

