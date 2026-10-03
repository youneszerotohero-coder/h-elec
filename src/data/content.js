// Site content. Anything a visitor reads is written as { en, fr, ar } and resolved with l() from useI18n(),
// so the client's real details (name, numbers, brands, contact) can be swapped without touching components.

export const site = {
  name: 'H ELEC',
  legalName: 'SARL H ELEC',
  tagline: { en: 'Electrical equipment for professionals', fr: 'Matériel électrique pour les professionnels', ar: 'معدّات كهربائية للمحترفين' },
  phone: '+00 (0) 00 00 00 00',
  phoneHref: 'tel:+000000000000',
  whatsappHref: 'https://wa.me/000000000000',
  email: 'contact@h-elec.example',
  address: [
    { en: 'Industrial Zone, Lot 00', fr: 'Zone industrielle, lot 00', ar: 'المنطقة الصناعية، القطعة 00' },
    { en: 'Your City, Country', fr: 'Votre ville, pays', ar: 'مدينتك، البلد' },
  ],
  hours: { en: 'Sun – Thu · 8:00 – 17:30', fr: 'Dim – Jeu · 8h00 – 17h30', ar: 'الأحد – الخميس · 8:00 – 17:30' },
  catalogueHref: '/products',
}

export const socials = [
  { label: 'LinkedIn', href: '#', icon: 'linkedin' },
  { label: 'Instagram', href: '#', icon: 'instagram' },
  { label: 'Facebook', href: '#', icon: 'facebook' },
]

const NEW = { en: 'New', fr: 'Nouveau', ar: 'جديد' }

export const menu = {
  products: [
    { label: { en: 'Wiring devices', fr: 'Appareillage', ar: 'أجهزة التوصيل' }, href: '/products?category=wiring-devices' },
    { label: { en: 'Circuit protection', fr: 'Protection des circuits', ar: 'حماية الدوائر' }, href: '/products?category=circuit-protection' },
    { label: { en: 'Cables & conduits', fr: 'Câbles & conduits', ar: 'الكابلات والأنابيب' }, href: '/products?category=cables' },
    { label: { en: 'Lighting', fr: 'Éclairage', ar: 'الإنارة' }, href: '/products?category=lighting' },
  ],
  productsSmall: [
    { label: { en: 'Automation', fr: 'Automatisme', ar: 'الأتمتة' }, href: '/products?category=automation' },
    { label: { en: 'EV charging', fr: 'Recharge VE', ar: 'شحن السيارات' }, href: '/products?category=ev-charging', badge: NEW },
  ],
  explore: [
    { label: { en: 'Our brands', fr: 'Nos marques', ar: 'علاماتنا' }, href: '/brands', count: 12 },
    { label: { en: 'Catalogue', fr: 'Catalogue', ar: 'الكتالوج' }, href: '/products' },
    { label: { en: 'Solutions', fr: 'Solutions', ar: 'الحلول' }, href: '/#solutions' },
    { label: { en: 'Contact', fr: 'Contact', ar: 'اتصل بنا' }, href: '/#contact' },
  ],
}

const FR = { en: 'France', fr: 'France', ar: 'فرنسا' }
const DE = { en: 'Germany', fr: 'Allemagne', ar: 'ألمانيا' }

// `slug` matches the logo file in src/assets/brands/ and the /brands/:slug page; `color` is the identity dot.
export const brands = [
  {
    name: 'Legrand', slug: 'legrand', code: 'FR', color: '#e4002b', founded: 1865, website: 'https://www.legrand.com',
    country: FR,
    hq: { en: 'Limoges, France', fr: 'Limoges, France', ar: 'ليموج، فرنسا' },
    category: { en: 'Wiring devices', fr: 'Appareillage', ar: 'أجهزة التوصيل' },
    specialty: { en: 'Switches, sockets & building systems', fr: 'Interrupteurs, prises & systèmes du bâtiment', ar: 'مفاتيح ومقابس وأنظمة المباني' },
    description: {
      en: 'French specialist in electrical and digital building infrastructure — wiring devices, cable management and building systems found in homes and commercial projects worldwide.',
      fr: 'Spécialiste français des infrastructures électriques et numériques du bâtiment — appareillage, cheminement de câbles et systèmes présents dans les logements et projets tertiaires du monde entier.',
      ar: 'شركة فرنسية متخصصة في البنية التحتية الكهربائية والرقمية للمباني — أجهزة التوصيل وتمديد الكابلات وأنظمة المباني المستخدمة في المنازل والمشاريع التجارية حول العالم.',
    },
  },
  {
    name: 'Schneider Electric', short: 'Schneider', slug: 'schneider', code: 'FR', color: '#3dcd58', founded: 1836, website: 'https://www.se.com',
    country: FR,
    hq: { en: 'Rueil-Malmaison, France', fr: 'Rueil-Malmaison, France', ar: 'رويل-مالميزون، فرنسا' },
    category: { en: 'Circuit protection', fr: 'Protection des circuits', ar: 'حماية الدوائر' },
    specialty: { en: 'Protection & energy management', fr: 'Protection & gestion de l’énergie', ar: 'الحماية وإدارة الطاقة' },
    description: {
      en: 'Global leader in energy management and automation, from Acti9 circuit protection and Resi9 consumer units to the Unica range of wiring devices.',
      fr: 'Leader mondial de la gestion de l’énergie et des automatismes, de la protection Acti9 aux coffrets Resi9 en passant par l’appareillage Unica.',
      ar: 'رائد عالمي في إدارة الطاقة والأتمتة، من حماية الدوائر Acti9 ولوحات التوزيع Resi9 إلى تشكيلة أجهزة التوصيل Unica.',
    },
  },
  {
    name: 'ABB', slug: 'abb', code: 'CH', color: '#ff000f', founded: 1988, website: 'https://www.abb.com',
    country: { en: 'Switzerland', fr: 'Suisse', ar: 'سويسرا' },
    hq: { en: 'Zurich, Switzerland', fr: 'Zurich, Suisse', ar: 'زيورخ، سويسرا' },
    category: { en: 'Drives & automation', fr: 'Variateurs & automatisme', ar: 'مغيّرات السرعة والأتمتة' },
    specialty: { en: 'Electrification & motion control', fr: 'Électrification & contrôle du mouvement', ar: 'الكهربة والتحكم في الحركة' },
    description: {
      en: 'Technology group covering electrification, motion and automation — variable speed drives, motors, MCBs and switchgear for industry and buildings.',
      fr: 'Groupe technologique de l’électrification, du mouvement et de l’automatisation — variateurs de vitesse, moteurs, disjoncteurs et appareillage pour l’industrie et le bâtiment.',
      ar: 'مجموعة تقنية في مجالات الكهربة والحركة والأتمتة — مغيّرات السرعة والمحركات والقواطع ومعدّات التوزيع للصناعة والمباني.',
    },
  },
  {
    name: 'Hager', slug: 'hager', code: 'DE', color: '#1f5c99', founded: 1955, website: 'https://www.hager.com',
    country: DE,
    hq: { en: 'Blieskastel, Germany', fr: 'Blieskastel, Allemagne', ar: 'بليسكاستل، ألمانيا' },
    category: { en: 'Distribution boards', fr: 'Tableaux électriques', ar: 'لوحات التوزيع' },
    specialty: { en: 'Consumer units & enclosures', fr: 'Coffrets & enveloppes', ar: 'لوحات التوزيع والخزائن' },
    description: {
      en: 'Family-owned group dedicated to electrical installations in residential and commercial buildings: consumer units, protection devices and wiring accessories.',
      fr: 'Groupe familial dédié aux installations électriques des bâtiments résidentiels et tertiaires : coffrets, appareils de protection et accessoires de câblage.',
      ar: 'مجموعة عائلية متخصصة في التركيبات الكهربائية للمباني السكنية والتجارية: لوحات التوزيع وأجهزة الحماية وملحقات التوصيل.',
    },
  },
  {
    name: 'Siemens', slug: 'siemens', code: 'DE', color: '#009999', founded: 1847, website: 'https://www.siemens.com',
    country: DE,
    hq: { en: 'Munich, Germany', fr: 'Munich, Allemagne', ar: 'ميونخ، ألمانيا' },
    category: { en: 'Industrial control', fr: 'Contrôle industriel', ar: 'التحكم الصناعي' },
    specialty: { en: 'Contactors, PLCs & switching', fr: 'Contacteurs, automates & commutation', ar: 'الملامسات ووحدات PLC والتبديل' },
    description: {
      en: 'Industrial technology group whose SIMATIC controllers and SIRIUS switching devices run production lines and machines around the world.',
      fr: 'Groupe technologique industriel dont les automates SIMATIC et les appareils SIRIUS font tourner lignes de production et machines dans le monde entier.',
      ar: 'مجموعة تقنية صناعية تُشغِّل وحدات التحكم SIMATIC وأجهزة التبديل SIRIUS خطوط الإنتاج والآلات حول العالم.',
    },
  },
  {
    name: 'Philips', slug: 'philips', code: 'NL', color: '#0b5ed7', founded: 1891, website: 'https://www.lighting.philips.com',
    country: { en: 'Netherlands', fr: 'Pays-Bas', ar: 'هولندا' },
    hq: { en: 'Eindhoven, Netherlands', fr: 'Eindhoven, Pays-Bas', ar: 'آيندهوفن، هولندا' },
    category: { en: 'LED lighting', fr: 'Éclairage LED', ar: 'إنارة LED' },
    specialty: { en: 'Professional LED lamps & luminaires', fr: 'Lampes & luminaires LED professionnels', ar: 'مصابيح وتجهيزات إنارة LED احترافية' },
    description: {
      en: 'Professional lighting from Signify, the company behind Philips lighting — efficient LED lamps and luminaires for offices, retail and industry.',
      fr: 'L’éclairage professionnel de Signify, l’entreprise derrière l’éclairage Philips — lampes et luminaires LED performants pour bureaux, commerces et industrie.',
      ar: 'إنارة احترافية من Signify، الشركة التي تقف وراء إنارة Philips — مصابيح وتجهيزات LED عالية الكفاءة للمكاتب والمحلات والصناعة.',
    },
  },
  {
    name: 'Nexans', slug: 'nexans', code: 'FR', color: '#e30613', founded: 2000, website: 'https://www.nexans.com',
    country: FR,
    hq: { en: 'Paris, France', fr: 'Paris, France', ar: 'باريس، فرنسا' },
    category: { en: 'Cables', fr: 'Câbles', ar: 'الكابلات' },
    specialty: { en: 'Power & building cables', fr: 'Câbles d’énergie & du bâtiment', ar: 'كابلات الطاقة والمباني' },
    description: {
      en: 'Cable maker designing power, building and data cables for construction, infrastructure and industry, with a focus on electrification.',
      fr: 'Câblier qui conçoit des câbles d’énergie, du bâtiment et de données pour la construction, les infrastructures et l’industrie, tourné vers l’électrification.',
      ar: 'مصنّع كابلات يصمّم كابلات الطاقة والمباني والبيانات للبناء والبنية التحتية والصناعة، مع تركيز على الكهربة.',
    },
  },
  {
    name: 'Ledvance', slug: 'ledvance', code: 'DE', color: '#f18a00', founded: 2016, website: 'https://www.ledvance.com',
    country: DE,
    hq: { en: 'Garching, Germany', fr: 'Garching, Allemagne', ar: 'غارشينغ، ألمانيا' },
    category: { en: 'Luminaires', fr: 'Luminaires', ar: 'تجهيزات الإنارة' },
    specialty: { en: 'Panels, downlights & floodlights', fr: 'Dalles, downlights & projecteurs', ar: 'ألواح وسبوتات وكشافات' },
    description: {
      en: 'Lighting manufacturer born out of Osram, offering LED luminaires, lamps and smart lighting built for professional installers.',
      fr: 'Fabricant d’éclairage issu d’Osram, qui propose luminaires LED, lampes et éclairage connecté pensés pour les installateurs.',
      ar: 'مصنّع إنارة انبثق عن Osram، يقدّم تجهيزات LED ومصابيح وإنارة ذكية مصمّمة للمركّبين المحترفين.',
    },
  },
  {
    name: 'Wago', slug: 'wago', code: 'DE', color: '#6ec800', founded: 1951, website: 'https://www.wago.com',
    country: DE,
    hq: { en: 'Minden, Germany', fr: 'Minden, Allemagne', ar: 'ميندن، ألمانيا' },
    category: { en: 'Connection technology', fr: 'Connectique', ar: 'تقنيات التوصيل' },
    specialty: { en: 'Lever connectors & terminal blocks', fr: 'Bornes à levier & blocs de jonction', ar: 'موصلات بذراع وكتل توصيل' },
    description: {
      en: 'Pioneer of spring-pressure connection technology — the lever connectors and rail-mount terminal blocks electricians reach for every day.',
      fr: 'Pionnier de la connexion à ressort — les bornes à levier et blocs de jonction sur rail que les électriciens utilisent chaque jour.',
      ar: 'رائد تقنية التوصيل بالضغط الزنبركي — الموصلات بذراع وكتل التوصيل على القضبان التي يستخدمها الكهربائيون يوميًا.',
    },
  },
  {
    name: 'Eaton', slug: 'eaton', code: 'IE', color: '#005eb8', founded: 1911, website: 'https://www.eaton.com',
    country: { en: 'Ireland', fr: 'Irlande', ar: 'أيرلندا' },
    hq: { en: 'Dublin, Ireland', fr: 'Dublin, Irlande', ar: 'دبلن، أيرلندا' },
    category: { en: 'Power management', fr: 'Gestion de l’énergie', ar: 'إدارة الطاقة' },
    specialty: { en: 'UPS, metering & power quality', fr: 'Onduleurs, comptage & qualité réseau', ar: 'مزوّدات UPS والقياس وجودة الطاقة' },
    description: {
      en: 'Power management company supplying UPS systems, circuit protection and power distribution for buildings, data centres and industry.',
      fr: 'Spécialiste de la gestion de l’énergie : onduleurs, protection des circuits et distribution pour bâtiments, data centers et industrie.',
      ar: 'شركة متخصصة في إدارة الطاقة توفّر أنظمة UPS وحماية الدوائر وتوزيع الطاقة للمباني ومراكز البيانات والصناعة.',
    },
  },
  {
    name: 'Chint', slug: 'chint', code: 'CN', color: '#1f4e9c', founded: 1984, website: 'https://www.chint.com',
    country: { en: 'China', fr: 'Chine', ar: 'الصين' },
    hq: { en: 'Wenzhou, China', fr: 'Wenzhou, Chine', ar: 'ونتشو، الصين' },
    category: { en: 'Low-voltage protection', fr: 'Protection basse tension', ar: 'حماية الجهد المنخفض' },
    specialty: { en: 'MCBs, RCDs & contactors', fr: 'Disjoncteurs, différentiels & contacteurs', ar: 'قواطع وقواطع تفاضلية وملامسات' },
    description: {
      en: 'One of the largest low-voltage equipment makers in the world, offering dependable MCBs, contactors and protection at competitive prices.',
      fr: 'L’un des plus grands fabricants mondiaux de matériel basse tension : disjoncteurs, contacteurs et protection fiables à prix compétitifs.',
      ar: 'من أكبر مصنّعي معدّات الجهد المنخفض في العالم، يقدّم قواطع وملامسات وحماية موثوقة بأسعار تنافسية.',
    },
  },
  {
    name: 'Mennekes', slug: 'mennekes', code: 'DE', color: '#e2231a', founded: 1935, website: 'https://www.mennekes.de',
    country: DE,
    hq: { en: 'Kirchhundem, Germany', fr: 'Kirchhundem, Allemagne', ar: 'كيرشهوندم، ألمانيا' },
    category: { en: 'EV charging', fr: 'Recharge VE', ar: 'شحن السيارات الكهربائية' },
    specialty: { en: 'Wallboxes & industrial plugs', fr: 'Bornes murales & prises industrielles', ar: 'شواحن جدارية ومقابس صناعية' },
    description: {
      en: 'Specialist in industrial plugs and sockets and the company behind the Type 2 connector used by electric vehicles across Europe.',
      fr: 'Spécialiste des prises industrielles et créateur du connecteur Type 2 utilisé par les véhicules électriques dans toute l’Europe.',
      ar: 'متخصص في المقابس الصناعية والشركة التي طوّرت موصل Type 2 المستخدم في السيارات الكهربائية عبر أوروبا.',
    },
  },
]

export const brandBySlug = (slug) => brands.find((b) => b.slug === slug)

export const categories = [
  {
    slug: 'wiring-devices',
    title: { en: 'Wiring devices', fr: 'Appareillage', ar: 'أجهزة التوصيل' },
    art: 'switch',
    refs: 1850,
    items: [
      { en: 'Switches', fr: 'Interrupteurs', ar: 'مفاتيح' },
      { en: 'Sockets', fr: 'Prises', ar: 'مقابس' },
      { en: 'Dimmers', fr: 'Variateurs', ar: 'مخفّتات إضاءة' },
      { en: 'USB outlets', fr: 'Prises USB', ar: 'مقابس USB' },
      { en: 'Smart home', fr: 'Maison connectée', ar: 'المنزل الذكي' },
    ],
    text: {
      en: 'Complete ranges in every finish — from standard residential to designer plates.',
      fr: 'Des gammes complètes dans toutes les finitions — du résidentiel standard aux plaques design.',
      ar: 'تشكيلات كاملة بجميع التشطيبات — من السكني القياسي إلى الألواح المصمَّمة.',
    },
    theme: 'dark',
  },
  {
    slug: 'circuit-protection',
    title: { en: 'Circuit protection', fr: 'Protection des circuits', ar: 'حماية الدوائر' },
    art: 'breaker',
    refs: 1320,
    items: [
      { en: 'MCBs', fr: 'Disjoncteurs', ar: 'قواطع مصغّرة' },
      { en: 'RCDs', fr: 'Différentiels', ar: 'قواطع تفاضلية' },
      { en: 'Surge protection', fr: 'Parafoudres', ar: 'مانعات الصواعق' },
      { en: 'MCCBs', fr: 'Boîtiers moulés', ar: 'قواطع العلبة المقولبة' },
    ],
    theme: 'light',
  },
  {
    slug: 'cables',
    title: { en: 'Cables & conduits', fr: 'Câbles & conduits', ar: 'الكابلات والأنابيب' },
    art: 'cable',
    refs: 960,
    items: [
      { en: 'Power cables', fr: 'Câbles d’énergie', ar: 'كابلات الطاقة' },
      { en: 'Flexible', fr: 'Souples', ar: 'مرنة' },
      { en: 'Trunking', fr: 'Goulottes', ar: 'مجاري الكابلات' },
      { en: 'Conduits', fr: 'Conduits', ar: 'أنابيب' },
    ],
    theme: 'light',
  },
  {
    slug: 'lighting',
    title: { en: 'Lighting', fr: 'Éclairage', ar: 'الإنارة' },
    art: 'bulb',
    refs: 1410,
    items: [
      { en: 'LED lamps', fr: 'Lampes LED', ar: 'مصابيح LED' },
      { en: 'Panels', fr: 'Dalles', ar: 'ألواح إنارة' },
      { en: 'Floodlights', fr: 'Projecteurs', ar: 'كشافات' },
      { en: 'Emergency', fr: 'Secours', ar: 'إنارة الطوارئ' },
    ],
    theme: 'volt',
  },
  {
    slug: 'distribution',
    title: { en: 'Distribution', fr: 'Distribution', ar: 'التوزيع' },
    art: 'board',
    refs: 540,
    items: [
      { en: 'Consumer units', fr: 'Tableaux', ar: 'لوحات التوزيع' },
      { en: 'Cabinets', fr: 'Armoires', ar: 'خزائن كهربائية' },
      { en: 'DIN rails', fr: 'Rails DIN', ar: 'قضبان DIN' },
    ],
    theme: 'light',
  },
  {
    slug: 'automation',
    title: { en: 'Automation', fr: 'Automatisme', ar: 'الأتمتة' },
    art: 'plc',
    refs: 780,
    items: [
      { en: 'Contactors', fr: 'Contacteurs', ar: 'ملامسات' },
      { en: 'Relays', fr: 'Relais', ar: 'مرحّلات' },
      { en: 'PLCs', fr: 'Automates', ar: 'وحدات PLC' },
      { en: 'Drives', fr: 'Variateurs', ar: 'مغيّرات السرعة' },
    ],
    theme: 'light',
  },
  {
    slug: 'ev-charging',
    title: { en: 'EV charging', fr: 'Recharge VE', ar: 'شحن السيارات' },
    art: 'ev',
    refs: 120,
    items: [
      { en: 'Wallboxes', fr: 'Bornes murales', ar: 'شواحن جدارية' },
      { en: 'Charging stations', fr: 'Stations de recharge', ar: 'محطات الشحن' },
      { en: 'Accessories', fr: 'Accessoires', ar: 'ملحقات' },
    ],
    theme: 'red',
    badge: NEW,
  },
]

export const categoryBySlug = (slug) => categories.find((c) => c.slug === slug)

export const stats = [
  {
    value: 12,
    suffix: '+',
    label: { en: 'Official brands', fr: 'Marques officielles', ar: 'علامات معتمدة' },
    note: { en: 'Direct partnerships with manufacturers', fr: 'Partenariats directs avec les fabricants', ar: 'شراكات مباشرة مع المصنّعين' },
  },
  {
    value: 8500,
    suffix: '+',
    label: { en: 'References in stock', fr: 'Références en stock', ar: 'مرجع في المخزون' },
    note: { en: 'Ready to ship from our warehouse', fr: 'Prêtes à partir de notre entrepôt', ar: 'جاهزة للشحن من مستودعنا' },
  },
  {
    value: 24,
    suffix: { en: 'h', fr: 'h', ar: ' ساعة' },
    label: { en: 'Quote turnaround', fr: 'Délai de devis', ar: 'مدة إعداد العرض' },
    note: { en: 'Detailed pricing, on working days', fr: 'Chiffrage détaillé, jours ouvrés', ar: 'تسعير مفصّل في أيام العمل' },
  },
  {
    value: 1200,
    suffix: '+',
    label: { en: 'Pro customers', fr: 'Clients pros', ar: 'عميل محترف' },
    note: { en: 'Electricians, contractors & industry', fr: 'Électriciens, installateurs & industrie', ar: 'كهربائيون ومقاولون وصناعيون' },
  },
]

export const sectors = [
  {
    title: { en: 'Residential', fr: 'Résidentiel', ar: 'سكني' },
    art: 'house',
    tags: [
      { en: 'Apartments', fr: 'Appartements', ar: 'شقق' },
      { en: 'Villas', fr: 'Villas', ar: 'فلل' },
      { en: 'Renovation', fr: 'Rénovation', ar: 'ترميم' },
    ],
    text: {
      en: 'Everything an electrician needs for a home — consumer units, wiring devices, cabling and lighting, sized to the job.',
      fr: 'Tout ce qu’il faut à l’électricien pour un logement — tableaux, appareillage, câblage et éclairage, adaptés au chantier.',
      ar: 'كل ما يحتاجه الكهربائي لمنزل — لوحات التوزيع وأجهزة التوصيل والكابلات والإنارة، بحسب حجم المشروع.',
    },
  },
  {
    title: { en: 'Commercial', fr: 'Tertiaire', ar: 'تجاري' },
    art: 'tower',
    tags: [
      { en: 'Offices', fr: 'Bureaux', ar: 'مكاتب' },
      { en: 'Retail', fr: 'Commerces', ar: 'محلات تجارية' },
      { en: 'Hotels', fr: 'Hôtels', ar: 'فنادق' },
    ],
    text: {
      en: 'Structured cabling, emergency lighting and distribution for offices, shops and hospitality, with project pricing.',
      fr: 'Câblage structuré, éclairage de sécurité et distribution pour bureaux, commerces et hôtellerie, avec des prix projet.',
      ar: 'كابلات منظّمة وإنارة طوارئ وتوزيع للمكاتب والمحلات والفنادق، بأسعار خاصة بالمشاريع.',
    },
  },
  {
    title: { en: 'Industrial', fr: 'Industrie', ar: 'صناعي' },
    art: 'factory',
    tags: [
      { en: 'Plants', fr: 'Usines', ar: 'مصانع' },
      { en: 'Workshops', fr: 'Ateliers', ar: 'ورش' },
      { en: 'Warehouses', fr: 'Entrepôts', ar: 'مستودعات' },
    ],
    text: {
      en: 'Motor control, automation, industrial plugs and high-capacity protection from the brands your sites already run on.',
      fr: 'Commande moteur, automatisme, prises industrielles et protection forte puissance, des marques déjà présentes sur vos sites.',
      ar: 'التحكم بالمحركات والأتمتة والمقابس الصناعية والحماية عالية القدرة، من العلامات التي تعمل بها مواقعك أصلًا.',
    },
  },
  {
    title: { en: 'Public works', fr: 'Travaux publics', ar: 'أشغال عمومية' },
    art: 'pylon',
    tags: [
      { en: 'Infrastructure', fr: 'Infrastructures', ar: 'بنية تحتية' },
      { en: 'Utilities', fr: 'Réseaux', ar: 'شبكات' },
      { en: 'Street lighting', fr: 'Éclairage public', ar: 'الإنارة العمومية' },
    ],
    text: {
      en: 'Volume supply and technical support for public projects — cables, enclosures and outdoor lighting, delivered on schedule.',
      fr: 'Approvisionnement en volume et support technique pour les projets publics — câbles, coffrets et éclairage extérieur, livrés dans les délais.',
      ar: 'توريد بكميات كبيرة ودعم تقني للمشاريع العمومية — كابلات وخزائن وإنارة خارجية، تُسلَّم في الآجال.',
    },
  },
]

export const steps = [
  {
    title: { en: 'Send your list', fr: 'Envoyez votre liste', ar: 'أرسل قائمتك' },
    text: {
      en: 'Share references, a bill of quantities, a photo of your panel — or just describe the job.',
      fr: 'Références, métré, photo de votre tableau — ou décrivez simplement le chantier.',
      ar: 'شارك المراجع أو جدول الكميات أو صورة للوحتك — أو صِف المشروع ببساطة.',
    },
    chips: ['BOQ.xlsx', { en: 'Photo', fr: 'Photo', ar: 'صورة' }, { en: 'WhatsApp', fr: 'WhatsApp', ar: 'واتساب' }],
  },
  {
    title: { en: 'Get your quote in 24h', fr: 'Votre devis sous 24 h', ar: 'عرض السعر خلال 24 ساعة' },
    text: {
      en: 'Our technical team checks compatibility, suggests equivalents and sends a detailed quote at pro pricing.',
      fr: 'Notre équipe technique vérifie la compatibilité, propose des équivalences et envoie un devis détaillé aux prix pros.',
      ar: 'يتحقق فريقنا التقني من التوافق، ويقترح البدائل، ويرسل عرض سعر مفصّلًا بأسعار المحترفين.',
    },
    chips: [
      { en: 'Pro pricing', fr: 'Prix pros', ar: 'أسعار المحترفين' },
      { en: 'Equivalents', fr: 'Équivalences', ar: 'بدائل' },
      { en: 'Stock check', fr: 'Vérif. stock', ar: 'فحص المخزون' },
    ],
  },
  {
    title: { en: 'Pick up or get delivered', fr: 'Retrait ou livraison', ar: 'الاستلام أو التوصيل' },
    text: {
      en: 'Collect from our warehouse or have it delivered straight to your site, anywhere in the country.',
      fr: 'Retirez en entrepôt ou faites livrer directement sur chantier, partout dans le pays.',
      ar: 'استلم من مستودعنا أو اطلب التوصيل مباشرة إلى موقعك، في أي مكان من البلد.',
    },
    chips: [
      { en: 'Pickup', fr: 'Retrait', ar: 'استلام' },
      { en: 'Site delivery', fr: 'Livraison chantier', ar: 'توصيل للموقع' },
      { en: 'Nationwide', fr: 'Tout le pays', ar: 'على المستوى الوطني' },
    ],
  },
]

// Placeholder testimonials — replace with real quotes from the client's customers.
export const testimonials = [
  {
    quote: {
      en: 'We send our list in the morning and have a priced quote before lunch. The equivalents they suggest have saved us more than once on tight projects.',
      fr: 'Nous envoyons notre liste le matin et avons un devis chiffré avant midi. Les équivalences proposées nous ont sauvés plus d’une fois sur des chantiers serrés.',
      ar: 'نرسل قائمتنا صباحًا ونحصل على عرض سعر قبل الظهر. البدائل التي يقترحونها أنقذتنا أكثر من مرة في المشاريع ذات الآجال الضيقة.',
    },
    name: 'Karim B.',
    role: { en: 'Electrical contractor', fr: 'Électricien installateur', ar: 'مقاول كهرباء' },
    company: 'KB Électricité',
  },
  {
    quote: {
      en: 'Genuine Legrand and Schneider, always in stock, and a team that actually knows the products. They have become our only supplier for protection gear.',
      fr: 'Du Legrand et du Schneider authentiques, toujours en stock, et une équipe qui connaît vraiment les produits. Ils sont devenus notre unique fournisseur en protection.',
      ar: 'منتجات Legrand وSchneider أصلية ومتوفرة دائمًا، وفريق يعرف المنتجات حقًا. أصبحوا مورّدنا الوحيد لمعدّات الحماية.',
    },
    name: 'Sofia M.',
    role: { en: 'Procurement manager', fr: 'Responsable achats', ar: 'مسؤولة المشتريات' },
    company: 'Atlas Industries',
  },
  {
    quote: {
      en: 'Delivery straight to site changed how we plan jobs. No more half days lost driving between wholesalers to complete an order.',
      fr: 'La livraison directe sur chantier a changé notre façon de planifier. Fini les demi-journées perdues entre grossistes pour compléter une commande.',
      ar: 'غيّر التوصيل المباشر إلى الموقع طريقة تخطيطنا للأعمال. لا مزيد من أنصاف الأيام الضائعة بين تجّار الجملة لإكمال طلبية.',
    },
    name: 'Yanis R.',
    role: { en: 'Site manager', fr: 'Conducteur de travaux', ar: 'مدير موقع' },
    company: 'Nord Bâtiment',
  },
  {
    quote: {
      en: 'Their technical advice on a factory retrofit was spot on — the right contactors and drives first time, and pricing that kept us within budget.',
      fr: 'Leurs conseils techniques pour la rénovation d’une usine étaient parfaits — les bons contacteurs et variateurs du premier coup, à un prix qui a tenu notre budget.',
      ar: 'كانت نصائحهم التقنية في تجديد مصنع دقيقة تمامًا — الملامسات ومغيّرات السرعة المناسبة من أول مرة، وبسعر حافظ على ميزانيتنا.',
    },
    name: 'Amel T.',
    role: { en: 'Maintenance engineer', fr: 'Ingénieure maintenance', ar: 'مهندسة صيانة' },
    company: 'Médi Packaging',
  },
]
