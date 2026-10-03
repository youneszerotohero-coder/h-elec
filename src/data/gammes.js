// Product ranges ("gammes") — each brand's product lines. A product points to its range with `gamme: <slug>`.
// Brand pages list these; a range card opens the catalogue filtered on /products?brand=<brand>&gamme=<slug>.
// `name` is a plain string for trade names, or { en, fr, ar } when it needs translating. `art` picks the illustration.

import { products } from './products'

const tr = (en, fr, ar) => ({ en, fr, ar })

export const gammes = [
  // Legrand
  {
    slug: 'mosaic', brand: 'legrand', name: 'Mosaic', art: 'socket',
    summary: tr(
      'Modular sockets, switches and outlets that clip into one frame system.',
      'Prises, interrupteurs et sorties modulaires qui s’assemblent sur un même support.',
      'مقابس ومفاتيح ومخارج معيارية تُركَّب على نظام إطار واحد.',
    ),
  },
  {
    slug: 'celiane', brand: 'legrand', name: 'Céliane', art: 'switch',
    summary: tr(
      'Premium wiring devices and dimmers with a wide choice of finishes.',
      'Appareillage et variateurs haut de gamme, avec un large choix de finitions.',
      'أجهزة توصيل ومخفّتات إضاءة فاخرة بخيارات تشطيب متعددة.',
    ),
  },
  {
    slug: 'dx3', brand: 'legrand', name: 'DX³', art: 'breaker',
    summary: tr(
      'Modular circuit breakers and RCDs for residential and commercial boards.',
      'Disjoncteurs et différentiels modulaires pour tableaux résidentiels et tertiaires.',
      'قواطع وحماية تفاضلية معيارية للوحات السكنية والتجارية.',
    ),
  },

  // Schneider Electric
  {
    slug: 'acti9', brand: 'schneider', name: 'Acti9', art: 'breaker',
    summary: tr(
      'Modular protection for final distribution — MCBs, RCDs and auxiliaries.',
      'Protection modulaire de la distribution terminale — disjoncteurs, différentiels et auxiliaires.',
      'حماية معيارية للتوزيع النهائي — قواطع وحماية تفاضلية وملحقات.',
    ),
  },
  {
    slug: 'resi9', brand: 'schneider', name: 'Resi9', art: 'board',
    summary: tr(
      'Consumer units and enclosures sized for homes and small shops.',
      'Coffrets et tableaux dimensionnés pour les logements et petits commerces.',
      'لوحات توزيع وخزائن مصمّمة للمنازل والمحلات الصغيرة.',
    ),
  },
  {
    slug: 'unica', brand: 'schneider', name: 'Unica', art: 'switch',
    summary: tr(
      'Switches and sockets built for quick installation and clean lines.',
      'Interrupteurs et prises pensés pour une pose rapide et des lignes épurées.',
      'مفاتيح ومقابس مصمّمة لتركيب سريع وخطوط أنيقة.',
    ),
  },

  // ABB
  {
    slug: 'acs580', brand: 'abb', name: 'ACS580', art: 'drive',
    summary: tr(
      'General-purpose variable speed drives for pumps, fans and conveyors.',
      'Variateurs de vitesse polyvalents pour pompes, ventilateurs et convoyeurs.',
      'مغيّرات سرعة متعددة الاستخدامات للمضخات والمراوح والسيور.',
    ),
  },
  {
    slug: 's200', brand: 'abb', name: 'System pro M S200', art: 'breaker',
    summary: tr(
      'Compact MCBs from 0.5 to 63 A for buildings and industry.',
      'Disjoncteurs compacts de 0,5 à 63 A pour le bâtiment et l’industrie.',
      'قواطع مدمجة من 0.5 إلى 63 أمبير للمباني والصناعة.',
    ),
  },

  // Hager
  {
    slug: 'volta', brand: 'hager', name: 'Volta', art: 'board',
    summary: tr(
      'Surface-mounted consumer units from one to four rows.',
      'Coffrets en saillie d’une à quatre rangées.',
      'لوحات توزيع سطحية من صف واحد إلى أربعة صفوف.',
    ),
  },
  {
    slug: 'hager-protection', brand: 'hager', name: tr('Modular protection', 'Protection modulaire', 'الحماية المعيارية'), art: 'breaker',
    summary: tr(
      'MCBs, RCBOs and RCCBs that drop straight into Hager boards.',
      'Disjoncteurs et différentiels qui s’intègrent directement aux tableaux Hager.',
      'قواطع وحماية تفاضلية تُركَّب مباشرة في لوحات Hager.',
    ),
  },

  // Siemens
  {
    slug: 'simatic', brand: 'siemens', name: 'SIMATIC', art: 'plc',
    summary: tr(
      'Programmable controllers, from compact CPUs to modular systems.',
      'Automates programmables, des CPU compactes aux systèmes modulaires.',
      'وحدات تحكم قابلة للبرمجة، من المعالجات المدمجة إلى الأنظمة المعيارية.',
    ),
  },
  {
    slug: 'sirius', brand: 'siemens', name: 'SIRIUS', art: 'plc',
    summary: tr(
      'Contactors, motor starters and relays for control panels.',
      'Contacteurs, départs-moteurs et relais pour armoires de commande.',
      'ملامسات ومشغّلات محركات ومرحّلات للوحات التحكم.',
    ),
  },

  // Philips
  {
    slug: 'coreline', brand: 'philips', name: 'CoreLine', art: 'panel',
    summary: tr(
      'Efficient LED luminaires that replace fluorescent fittings one for one.',
      'Luminaires LED performants qui remplacent les fluorescents un pour un.',
      'تجهيزات LED عالية الكفاءة تحلّ محل الإنارة الفلورية واحدة بواحدة.',
    ),
  },
  {
    slug: 'master', brand: 'philips', name: 'MASTER', art: 'bulb',
    summary: tr(
      'Professional LED lamps with high efficacy and long lifetime.',
      'Lampes LED professionnelles à haute efficacité et longue durée de vie.',
      'مصابيح LED احترافية بكفاءة عالية وعمر طويل.',
    ),
  },

  // Nexans
  {
    slug: 'u1000-r2v', brand: 'nexans', name: 'U-1000 R2V', art: 'cable',
    summary: tr(
      'Rigid power cables for fixed installations, indoors and buried in conduit.',
      'Câbles d’énergie rigides pour installations fixes, en intérieur ou enterrés sous fourreau.',
      'كابلات طاقة صلبة للتركيبات الثابتة، داخلية أو مدفونة في أنابيب.',
    ),
  },
  {
    slug: 'h07v', brand: 'nexans', name: 'H07V-U / H07V-R', art: 'cable',
    summary: tr(
      'Single-core building wire for conduits and distribution boards.',
      'Fils de câblage unipolaires pour conduits et tableaux.',
      'أسلاك أحادية القلب للمباني تُمدّ في الأنابيب ولوحات التوزيع.',
    ),
  },

  // Ledvance
  {
    slug: 'floodlight-performance', brand: 'ledvance', name: 'Floodlight Performance', art: 'panel',
    summary: tr(
      'Robust IP65 LED floodlights for façades, yards and car parks.',
      'Projecteurs LED IP65 robustes pour façades, cours et parkings.',
      'كشافات LED متينة بحماية IP65 للواجهات والساحات والمواقف.',
    ),
  },
  {
    slug: 'downlight-slim', brand: 'ledvance', name: 'Downlight Slim', art: 'panel',
    summary: tr(
      'Ultra-thin recessed downlights for low ceiling voids.',
      'Downlights encastrés ultra-plats pour faibles plénums.',
      'سبوتات مدمجة فائقة النحافة للأسقف ذات الفراغ المحدود.',
    ),
  },

  // Wago
  {
    slug: 'wago-221', brand: 'wago', name: tr('221 Series', 'Série 221', 'سلسلة 221'), art: 'terminal',
    summary: tr(
      'Compact lever connectors for every conductor type.',
      'Bornes à levier compactes pour tous types de conducteurs.',
      'موصلات مدمجة بذراع لجميع أنواع الموصّلات.',
    ),
  },
  {
    slug: 'topjob-s', brand: 'wago', name: 'TOPJOB® S', art: 'terminal',
    summary: tr(
      'Push-in rail-mount terminal blocks for control cabinets.',
      'Blocs de jonction sur rail à connexion directe pour armoires.',
      'كتل توصيل على القضبان بالإدخال المباشر لخزائن التحكم.',
    ),
  },

  // Eaton
  {
    slug: 'eaton-5e', brand: 'eaton', name: '5E', art: 'meter',
    summary: tr(
      'Line-interactive UPS for workstations, tills and network gear.',
      'Onduleurs line-interactive pour postes de travail, caisses et réseau.',
      'مزوّدات UPS تفاعلية لمحطات العمل وأجهزة الدفع ومعدّات الشبكة.',
    ),
  },
  {
    slug: 'xeffect', brand: 'eaton', name: 'xEffect', art: 'breaker',
    summary: tr(
      'Residential and commercial protection — MCBs, RCCBs and RCBOs.',
      'Protection résidentielle et tertiaire — disjoncteurs et différentiels.',
      'حماية سكنية وتجارية — قواطع وحماية تفاضلية.',
    ),
  },

  // Chint
  {
    slug: 'nxb', brand: 'chint', name: 'NXB', art: 'breaker',
    summary: tr(
      'Miniature circuit breakers with dependable performance at a fair price.',
      'Disjoncteurs modulaires fiables à prix juste.',
      'قواطع مصغّرة موثوقة بسعر مناسب.',
    ),
  },
  {
    slug: 'nxc', brand: 'chint', name: 'NXC', art: 'plc',
    summary: tr(
      'AC contactors for motor control and switching loads.',
      'Contacteurs AC pour la commande de moteurs et de charges.',
      'ملامسات تيار متناوب للتحكم في المحركات وتبديل الأحمال.',
    ),
  },

  // Mennekes
  {
    slug: 'amtron', brand: 'mennekes', name: 'AMTRON', art: 'ev',
    summary: tr(
      'Wallboxes for home and fleet charging, up to 22 kW.',
      'Bornes murales pour la recharge à domicile et de flottes, jusqu’à 22 kW.',
      'شواحن جدارية للمنازل والأساطيل حتى 22 كيلوواط.',
    ),
  },
  {
    slug: 'mennekes-cee', brand: 'mennekes', name: tr('CEE industrial plugs', 'Prises industrielles CEE', 'مقابس CEE الصناعية'), art: 'socket',
    summary: tr(
      'Industrial plugs and sockets for sites, workshops and events.',
      'Prises et fiches industrielles pour chantiers, ateliers et événements.',
      'مقابس وقوابس صناعية للورش ومواقع البناء والفعاليات.',
    ),
  },
]

export const gammeBySlug = (slug) => gammes.find((g) => g.slug === slug)
export const gammesByBrand = (brand) => gammes.filter((g) => g.brand === brand)
export const productsByGamme = (slug) => products.filter((p) => p.gamme === slug)
