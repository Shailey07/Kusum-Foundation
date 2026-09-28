// Central STATIC fallback content for the public marketing pages.
//
// At runtime the site loads editable content from the API (see
// src/context/SiteData.jsx). This file is the offline fallback used before the
// API responds or if it is unreachable, and it mirrors the server seed so the
// site always shows real photography.
//
// Images are 100% LOCAL — the foundation's own uploaded photos, bundled with
// the site under client/public/images/photos. NO external/online image service
// is used anywhere. flick() and face() keep their original signatures so every
// existing reference just resolves to a real, bundled photo:
//   flick(keywords, lock) -> a real field/programme photo (from the pool)
//   face(gender, n)       -> a real portrait photo (from the portrait pool)
// <SmartImg> degrades any broken URL to a local rose-gradient placeholder.
import {
  Users, Scissors, GraduationCap, HeartPulse, Utensils, Sprout,
} from 'lucide-react';

// Full pool of the foundation's uploaded photographs.
const PHOTOS = [
  'photo-01.png', 'photo-02.png', 'photo-03.jpg', 'photo-04.jpg', 'photo-05.png',
  'photo-06.jpg', 'photo-07.jpg', 'photo-08.png', 'photo-09.jpg', 'photo-10.png',
  'photo-11.jpg', 'photo-12.jpg', 'photo-13.jpg', 'photo-14.png', 'photo-15.png',
  'photo-16.jpg', 'photo-17.jpg', 'photo-18.jpg', 'photo-19.jpg', 'photo-20.jpg',
  'photo-21.jpg', 'photo-22.jpg', 'photo-23.jpg', 'photo-24.jpg', 'photo-25.jpg',
  'photo-26.jpg', 'photo-27.webp', 'photo-28.webp', 'photo-29.jpg', 'photo-30.jpg',
  'photo-31.jpg', 'photo-32.jpg', 'photo-33.jpg', 'photo-34.jpg', 'photo-35.jpg',
  'photo-36.jpg', 'photo-37.jpg', 'photo-38.jpg', 'photo-39.jpg', 'photo-40.jpg',
  'photo-41.webp', 'photo-42.jpg', 'photo-43.jpg', 'photo-44.jpg', 'photo-45.jpg',
  'photo-46.jpg', 'photo-47.jpg', 'photo-48.jpg', 'photo-49.jpg', 'photo-50.jpg',
  'photo-51.jpg', 'photo-52.jpg', 'photo-53.jpg',
].map((f) => `/images/photos/${f}`);

// Subset that are close-up portraits — used for people/testimonial avatars.
const PORTRAITS = [
  'photo-01.png', 'photo-13.jpg', 'photo-14.png', 'photo-30.jpg', 'photo-31.jpg',
  'photo-32.jpg', 'photo-33.jpg', 'photo-35.jpg', 'photo-36.jpg', 'photo-37.jpg',
].map((f) => `/images/photos/${f}`);

// Stable hash so the same arguments always map to the same photo (no flicker).
const pluck = (arr, seed) => {
  const s = String(seed);
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return arr[h % arr.length];
};

export const flick = (kw, lock) => pluck(PHOTOS, `${kw}|${lock}`);
export const face = (gender, n) => pluck(PORTRAITS, `${gender}|${n}`);

// Theme keywords for auto-filling an empty "From the field" gallery with
// matching real photos. Known programmes/projects map to hand-picked keywords;
// anything else (e.g. a brand-new item added in the admin panel) derives its
// keywords from its own name/title so the photos still match its theme.
const GALLERY_KW = {
  'women-empowerment': 'women,india,group',
  'vocational-training': 'sewing,training,workshop',
  education: 'classroom,school,students',
  healthcare: 'doctor,health,camp',
  'food-distribution': 'food,charity,india',
  environment: 'tree,planting,garden',
  'silai-se-swavlamban': 'sewing,tailor,embroidery',
  'digital-disha': 'computer,laptop,students',
  'roshni-shg-network': 'women,group,india',
  'aarogya-health-camps': 'doctor,medical,health',
  'anna-seva-relief': 'food,rice,relief',
  'hara-bhara-gaon': 'tree,garden,plant',
};

// Return `count` theme-matched photos for an item that carries no gallery of
// its own. Never overrides a real gallery — callers use this only as a fallback.
export const autoGallery = (item = {}, count = 4) => {
  const derived = String(item.name || item.title || 'community,charity,india')
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, ',')
    .replace(/^,|,$/g, '');
  const kw = GALLERY_KW[item.slug] || `${derived},india`;
  const seed = String(item.slug || item.name || item.title || 'kf');
  let base = 900;
  for (let i = 0; i < seed.length; i += 1) base += seed.charCodeAt(i);
  return Array.from({ length: count }, (_, i) => flick(kw, base + i));
};

export const orgInfo = {
  name: 'Kusum Foundation',
  estd: 2008,
  tagline: 'Empowering rural women, youth and families in Bihar since 2008.',
  address: 'Katesar, Saran District, Bihar 841301, India',
  phone: '+91 7419921792',
  email: 'kusumfoundatiooinfo@gmail.com',
  registration: {
    society: 'BIH/2008/0192847 (Societies Registration Act, 1860)',
    pan: 'AABTK1907K',
    reg12A: '12A — AABTK1907KE2021',
    reg80G: '80G — AABTK1907KF2021 (donations tax-deductible)',
    darpan: 'NGO Darpan ID: BR/2016/0102938',
  },
};

export const socials = {
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
  twitter: 'https://twitter.com',
  linkedin: 'https://linkedin.com',
  youtube: '',
};

// Main editable photos on the Home and About pages. Each value is either an
// uploaded/pasted URL (set from admin → Site Settings) or, when left blank,
// falls back to the matching file in client/public/images/. Keeping the local
// file as the fallback means the site never breaks if a photo is unset.
export const siteImages = {
  heroImage: '/images/gallery1.jpeg',            // Home hero (top-right)
  womenFeatureImage: '/images/gallery2.jpeg', // Home "When a woman earns…"
  aboutStoryImage: '/images/photos/photo-49.jpg', // About "How it began"
  aboutWomenImage: '/images/photos/photo-03.jpg', // About "Why women first"
};

export const impactStats = [
  { value: '17+', label: 'Years of service' },
  { value: '4,500+', label: 'Lives touched' },
  { value: '500+', label: 'Youth trained' },
  { value: '350+', label: 'Women in self-help groups' },
  { value: '1,200+', label: 'Families supported' },
  { value: '12', label: 'Villages reached' },
];
// __C_STORIES__

export const stories = [
  { name: 'Priya Kumari', role: 'Tailoring graduate', location: 'Katesar, Bihar', image: face('women', 65),
    quote: 'The sewing course gave me more than a skill — it gave me the courage to earn for my family.',
    story: 'When I joined the sewing class I could barely stitch a straight line. Today I run a small tailoring business from home, my daughter goes to school, and I pay her fees myself.' },
  { name: 'Anita Devi', role: 'Self-help group leader', location: 'Katesar, Bihar', image: face('women', 68),
    quote: "The women's group taught me that my voice matters — at home and in the community.",
    story: "After my husband's illness our family struggled. The self-help group didn't just help me start a small business — it showed me that women can lead change. I now mentor other women in my village." },
  { name: 'Sunita Kumari', role: 'Embroidery entrepreneur', location: 'Katesar, Bihar', image: face('women', 12),
    quote: 'I used to wait for work to come to me. Now buyers come looking for my designs.',
    story: 'The embroidery course helped me turn a hobby into an income. With a small group of women, I now take orders for festival wear and supply a shop in the town nearby.' },
  { name: 'Ravi Kumar', role: 'Digital skills trainee', location: 'Saran District, Bihar', image: face('men', 32),
    quote: 'I got my first job after the computer training. My future finally feels like my own.',
    story: "I dropped out after class 10 and was helping at a shop. The basic computer course helped me land a data-entry job nearby. I now support my parents and my younger brother's studies." },
  { name: 'Meena Devi', role: 'Kitchen-garden farmer', location: 'Katesar, Bihar', image: face('women', 45),
    quote: 'My little garden feeds my children and still leaves enough to sell.',
    story: 'The kitchen-garden training taught me to grow vegetables through the year. What began as food for the house is now a small, steady income at the weekly market.' },
  { name: 'Rekha Kumari', role: 'Adult-literacy learner', location: 'Katesar, Bihar', image: face('women', 22),
    quote: 'For the first time in my life, I signed my own name.',
    story: "I never went to school as a child. The evening literacy class changed that. Now I read my children's homework, keep my group's savings record, and help other women learn too." },
  { name: 'Kavita Devi', role: 'Micro-enterprise owner', location: 'Katesar, Bihar', image: face('women', 50),
    quote: 'A small loan and a little training were all I needed to begin.',
    story: 'With support from my self-help group I started making papad and pickles at home. Today four women work with me, and our little enterprise supplies shops across the block.' },
  { name: 'Pooja Kumari', role: 'Scholarship student', location: 'Saran District, Bihar', image: face('women', 28),
    quote: 'The scholarship kept me in school when my family could not.',
    story: 'When money was tight, dropping out felt certain. The scholarship and study material meant I could stay. I am now the first girl in my family to reach college.' },
];

export const galleryCategories = [
  'All', 'Vocational Training', 'Women Empowerment', 'Education', 'Community Welfare', 'Events',
];

export const galleryItems = [
  { src: flick('sewing', 201), category: 'Vocational Training', title: 'Sewing & Tailoring', location: 'Katesar, Bihar', date: 'Jan 2026' },
  { src: flick('computer', 202), category: 'Vocational Training', title: 'Computer Literacy', location: 'Katesar, Bihar', date: 'Feb 2026' },
  { src: flick('women,india', 203), category: 'Women Empowerment', title: 'Self-Help Group Meet', location: 'Katesar, Bihar', date: 'Feb 2026' },
  { src: flick('health', 204), category: 'Community Welfare', title: 'Health & Hygiene Drive', location: 'Saran District', date: 'Mar 2026' },
  { src: flick('workshop', 205), category: 'Vocational Training', title: 'Skill Development', location: 'Katesar, Bihar', date: 'Mar 2026' },
  { src: flick('embroidery', 206), category: 'Vocational Training', title: 'Embroidery & Handicraft', location: 'Katesar, Bihar', date: 'Apr 2026' },
  { src: flick('doctor', 207), category: 'Community Welfare', title: 'Medical Assistance Camp', location: 'Saran District', date: 'Apr 2026' },
  { src: flick('training', 208), category: 'Vocational Training', title: 'Youth Skill Workshop', location: 'Katesar, Bihar', date: 'May 2026' },
  { src: flick('market,india', 209), category: 'Women Empowerment', title: 'Livelihood Support', location: 'Katesar, Bihar', date: 'May 2026' },
  { src: flick('village,india', 210), category: 'Events', title: 'Community Gathering', location: 'Saran District', date: 'Jun 2026' },
  { src: flick('classroom', 211), category: 'Education', title: 'Adult Literacy Class', location: 'Katesar, Bihar', date: 'Jun 2026' },
  { src: flick('school,india', 212), category: 'Education', title: "Girls' Education Drive", location: 'Katesar, Bihar', date: 'Jul 2026' },
  { src: flick('women,group', 213), category: 'Women Empowerment', title: "Women's Leadership Circle", location: 'Katesar, Bihar', date: 'Jul 2026' },
  { src: flick('garden', 214), category: 'Vocational Training', title: 'Kitchen Garden Training', location: 'Katesar, Bihar', date: 'Aug 2026' },
  { src: flick('painting', 215), category: 'Education', title: 'Painting & Art Class', location: 'Katesar, Bihar', date: 'Aug 2026' },
  { src: flick('money', 216), category: 'Women Empowerment', title: 'Financial Literacy', location: 'Katesar, Bihar', date: 'Aug 2026' },
  { src: flick('crowd', 217), category: 'Events', title: 'Awareness Rally', location: 'Saran District', date: 'Sep 2026' },
  { src: flick('water,well', 218), category: 'Community Welfare', title: 'Clean Water Initiative', location: 'Saran District', date: 'Sep 2026' },
  { src: flick('india,flag', 219), category: 'Events', title: 'Independence Day', location: 'Katesar, Bihar', date: 'Aug 2026' },
  { src: flick('market', 220), category: 'Women Empowerment', title: 'Micro-Enterprise Fair', location: 'Katesar, Bihar', date: 'Sep 2026' },
  { src: flick('students', 221), category: 'Education', title: 'Scholarship Distribution', location: 'Katesar, Bihar', date: 'Sep 2026' },
  { src: flick('health,women', 222), category: 'Community Welfare', title: 'Menstrual Health Workshop', location: 'Katesar, Bihar', date: 'Sep 2026' },
  { src: flick('computer', 223), category: 'Vocational Training', title: 'Digital Skills Bootcamp', location: 'Katesar, Bihar', date: 'Sep 2026' },
  { src: flick('tree,planting', 224), category: 'Community Welfare', title: 'Tree Plantation Drive', location: 'Saran District', date: 'Jul 2026' },
  { src: flick('festival,india', 225), category: 'Events', title: 'Diwali Community Event', location: 'Katesar, Bihar', date: 'Nov 2025' },
  { src: flick('handicraft', 226), category: 'Women Empowerment', title: 'Handmade Products Stall', location: 'Katesar, Bihar', date: 'Dec 2025' },
  { src: flick('volunteers', 227), category: 'Events', title: 'Volunteer Orientation', location: 'Katesar, Bihar', date: 'Jan 2026' },
];
// __C_PROGRAMS__

export const programs = [
  {
    slug: 'women-empowerment', name: 'Women Empowerment', icon: Users, iconName: 'Users',
    color: 'bg-rose-50 text-rose-700 ring-rose-100', image: flick('women,india', 301),
    tagline: 'Self-help groups, savings circles and livelihoods led by women.',
    summary: 'We organise rural women into self-help groups where they save together, access small loans, and start home enterprises — turning household skills into steady, independent income.',
    whatWeDo: [
      'Kusum Foundation began with a simple belief: when a woman earns, her whole family rises. We form and mentor self-help groups (SHGs) of 10–20 women who pool small monthly savings, learn to manage group finances, and take turns accessing interest-free internal loans.',
      'Beyond finance, the groups become a space where women find their voice — discussing health, children’s schooling, and their rights, and speaking up in the village on issues that matter to them.',
    ],
    activities: [
      'Formation and hand-holding of women’s self-help groups',
      'Financial literacy, bookkeeping and digital-banking training',
      'Micro-enterprise support: tailoring units, pickle & papad making, kitchen gardens',
      'Linkage to government schemes and bank credit',
    ],
    impact: [
      { value: '350+', label: 'Women in SHGs' }, { value: '28', label: 'Active groups' }, { value: '₹18L+', label: 'Group savings mobilised' },
    ],
    gallery: [flick('women,group', 302), flick('market,india', 303), flick('women,india', 304), flick('women,rural,india', 305)],
  },
  {
    slug: 'vocational-training', name: 'Vocational Training', icon: Scissors, iconName: 'Scissors',
    color: 'bg-amber-50 text-amber-700 ring-amber-100', image: flick('sewing', 311),
    tagline: 'Turning a skill into a steady, dignified home income.',
    summary: 'Free courses in sewing, embroidery, handicrafts and computer basics equip rural women and youth with a marketable skill and the confidence to earn on their own terms.',
    whatWeDo: [
      'Our training centre in Katesar runs batches in tailoring, cutting & embroidery, and handicrafts, alongside a digital-literacy lab teaching computer and smartphone basics.',
      'Every course ends with a placement or self-employment plan — a sewing machine on easy instalments, a link to a local boutique, or help registering as a home-based enterprise.',
    ],
    activities: [
      'Sewing, cutting, embroidery and handicraft batches',
      'Computer and digital-literacy classes for rural youth',
      'Tool kits and starter equipment on graduation',
      'Placement and self-employment support',
    ],
    impact: [
      { value: '500+', label: 'Youth & women trained' }, { value: '70%', label: 'Now earning independently' }, { value: '6', label: 'Courses offered' },
    ],
    gallery: [flick('sewing', 312), flick('computer', 313), flick('embroidery', 314), flick('handicraft', 315)],
  },
  {
    slug: 'education', name: 'Education Support', icon: GraduationCap, iconName: 'GraduationCap',
    color: 'bg-indigo-50 text-indigo-700 ring-indigo-100', image: flick('classroom', 321),
    tagline: 'Scholarships, study material and adult literacy.',
    summary: 'From school kits for children to evening literacy classes for mothers, we keep learning within reach for families who would otherwise be left behind.',
    whatWeDo: [
      'We provide books, uniforms and scholarships to children at risk of dropping out, and run remedial after-school classes so first-generation learners can keep pace.',
      'For adults — especially women who never had the chance to study — evening literacy circles teach reading, writing and everyday numeracy.',
    ],
    activities: [
      'Scholarships and school kits for underprivileged children',
      'Remedial after-school learning centres',
      'Adult and women’s literacy classes',
      'Career guidance for rural teenagers',
    ],
    impact: [
      { value: '800+', label: 'Children supported' }, { value: '15', label: 'Learning circles' }, { value: '90%', label: 'Retention in school' },
    ],
    gallery: [flick('classroom', 322), flick('school,india', 323), flick('students', 324), flick('books,study', 325)],
  },
  {
    slug: 'healthcare', name: 'Health & Hygiene', icon: HeartPulse, iconName: 'HeartPulse',
    color: 'bg-teal-50 text-teal-700 ring-teal-100', image: flick('doctor', 331),
    tagline: 'Bringing basic healthcare closer to the village.',
    summary: 'Free medical camps, maternal-health awareness and hygiene drives help rural families prevent illness and reach care before small problems become emergencies.',
    whatWeDo: [
      'In partnership with local doctors, we run periodic health camps offering check-ups, medicines and referrals. Special sessions focus on maternal and child health, anaemia and menstrual hygiene.',
      'Our volunteers also lead sanitation and clean-water awareness drives, and distribute hygiene kits to adolescent girls and new mothers.',
    ],
    activities: [
      'Free general and maternal-health camps',
      'Menstrual-hygiene awareness and kit distribution',
      'Blood-donation and eye-check-up drives',
      'Sanitation and safe-water education',
    ],
    impact: [
      { value: '3,000+', label: 'Camp beneficiaries' }, { value: '40+', label: 'Health camps held' }, { value: '1,500+', label: 'Hygiene kits given' },
    ],
    gallery: [flick('doctor', 332), flick('health', 333), flick('medical', 334), flick('clinic,nurse', 335)],
  },
  {
    slug: 'food-distribution', name: 'Food Distribution', icon: Utensils, iconName: 'Utensils',
    color: 'bg-orange-50 text-orange-700 ring-orange-100', image: flick('food,india', 341),
    tagline: 'No family should go to sleep hungry.',
    summary: 'Through ration drives, festival meals and disaster relief, we make sure the most vulnerable families and elderly have food security through the hardest months.',
    whatWeDo: [
      'We distribute monthly dry-ration kits to widows, elderly people living alone, and families hit by illness or job loss. During floods and other emergencies, we mobilise rapid relief.',
      'Festival and community-kitchen meals bring dignity and togetherness to those who are usually forgotten.',
    ],
    activities: [
      'Monthly dry-ration kits for vulnerable families',
      'Emergency and flood-relief food distribution',
      'Community kitchens on festivals',
      'Nutrition support for children and new mothers',
    ],
    impact: [
      { value: '1,200+', label: 'Families reached' }, { value: '25,000+', label: 'Meals served' }, { value: '5', label: 'Relief drives' },
    ],
    gallery: [flick('food', 342), flick('rice', 343), flick('charity', 344), flick('donation,volunteer', 345)],
  },
  {
    slug: 'environment', name: 'Environment & Livelihoods', icon: Sprout, iconName: 'Sprout',
    color: 'bg-green-50 text-green-700 ring-green-100', image: flick('tree,planting', 351),
    tagline: 'Greener villages, sustainable incomes.',
    summary: 'Tree plantation, kitchen gardens and clean-energy awareness protect the environment while opening up sustainable livelihoods for rural households.',
    whatWeDo: [
      'We run plantation drives on village commons and school grounds, and help families set up kitchen gardens that improve both nutrition and household savings.',
      'Awareness sessions on waste, water and clean cooking fuel encourage practical, low-cost habits that are better for health and for the land.',
    ],
    activities: [
      'Tree-plantation and green-village drives',
      'Household kitchen gardens and organic composting',
      'Clean-cooking and waste-segregation awareness',
      'Water-conservation initiatives',
    ],
    impact: [
      { value: '6,000+', label: 'Saplings planted' }, { value: '300+', label: 'Kitchen gardens' }, { value: '12', label: 'Villages engaged' },
    ],
    gallery: [flick('tree', 352), flick('garden', 353), flick('plant', 354), flick('forest,green', 355)],
  },
];
// __C_PROJECTS__

export const projects = [
  {
    slug: 'silai-se-swavlamban', title: 'Silai Se Swavlamban', status: 'Running',
    location: 'Katesar, Saran', year: 2024, budget: 800000, spent: 520000, progress: 65, beneficiaries: 180,
    image: flick('sewing', 401),
    summary: 'Expanding our tailoring & embroidery centre with more machines, a second batch shift and a small production unit so graduates can earn while they learn.',
    highlights: [
      '20 new sewing machines and a cutting table added',
      'Evening batch launched for working women',
      'Tie-up with two local boutiques for order supply',
    ],
    gallery: [flick('sewing', 402), flick('embroidery', 403), flick('tailor', 404), flick('textile,fabric', 405)],
  },
  {
    slug: 'digital-disha', title: 'Digital Disha', status: 'Running',
    location: 'Saran District', year: 2025, budget: 600000, spent: 240000, progress: 40, beneficiaries: 220,
    image: flick('computer', 411),
    summary: 'A computer & digital-literacy lab giving rural youth the skills to find jobs, access government services online, and start small digital enterprises.',
    highlights: [
      '10-seat computer lab set up in Katesar',
      'Basic computing, typing and internet-safety curriculum',
      'First batch of 40 students enrolled',
    ],
    gallery: [flick('computer', 412), flick('laptop', 413), flick('students', 414), flick('keyboard,typing', 415)],
  },
  {
    slug: 'roshni-shg-network', title: 'Roshni Women’s SHG Network', status: 'Running',
    location: '12 villages, Saran', year: 2022, budget: 1000000, spent: 750000, progress: 75, beneficiaries: 350,
    image: flick('women,india', 421),
    summary: 'Building a network of women’s self-help groups across twelve villages, linked to banks and government schemes, with training in savings, credit and enterprise.',
    highlights: [
      '28 self-help groups formed and mentored',
      '₹18 lakh+ in group savings mobilised',
      'Bank-linkage achieved for 19 groups',
    ],
    gallery: [flick('women,group', 422), flick('women,india', 423), flick('market,india', 424), flick('women,meeting', 425)],
  },
  {
    slug: 'aarogya-health-camps', title: 'Aarogya Health Camps', status: 'Completed',
    location: 'Saran District', year: 2023, budget: 450000, spent: 450000, progress: 100, beneficiaries: 3000,
    image: flick('doctor', 431),
    summary: 'A year-long series of free medical and maternal-health camps that brought check-ups, medicines and referrals to families with little access to care.',
    highlights: [
      '40 camps across 12 villages',
      '3,000+ patients seen, 1,500 hygiene kits distributed',
      'Partnership with local doctors and a district hospital',
    ],
    gallery: [flick('doctor', 432), flick('health', 433), flick('medical', 434), flick('medicine,camp', 435)],
  },
  {
    slug: 'anna-seva-relief', title: 'Anna Seva Flood Relief', status: 'Completed',
    location: 'Katesar & nearby', year: 2023, budget: 300000, spent: 300000, progress: 100, beneficiaries: 1200,
    image: flick('food,india', 441),
    summary: 'Rapid dry-ration and essentials distribution to families displaced by seasonal flooding, followed by nutrition support for children and new mothers.',
    highlights: [
      '1,200 families received ration kits',
      '25,000+ meals equivalent distributed',
      'Special nutrition packs for 200 children',
    ],
    gallery: [flick('food', 442), flick('rice', 443), flick('flood', 444), flick('ration,grain', 445)],
  },
  {
    slug: 'hara-bhara-gaon', title: 'Hara Bhara Gaon', status: 'Running',
    location: '8 villages, Saran', year: 2025, budget: 350000, spent: 140000, progress: 40, beneficiaries: 300,
    image: flick('tree,planting', 451),
    summary: 'A green-village drive combining tree plantation, household kitchen gardens and clean-cooking awareness to improve both the environment and family nutrition.',
    highlights: [
      '6,000+ saplings targeted across 8 villages',
      '300 kitchen gardens being set up',
      'Composting and waste-segregation workshops',
    ],
    gallery: [flick('tree', 452), flick('garden', 453), flick('plant', 454), flick('seedling,soil', 455)],
  },
];

export const news = [
  { date: '2026-09-10', tag: 'Announcement', image: flick('computer', 501), title: 'Digital Disha computer lab opens in Katesar',
    excerpt: 'Our new 10-seat digital-literacy lab welcomed its first batch of 40 rural youth this month, with classes in basic computing, typing and online safety.' },
  { date: '2026-08-22', tag: 'Milestone', image: flick('women,india', 502), title: '28th women’s self-help group formed under Roshni',
    excerpt: 'The Roshni network crossed 350 active members as its 28th group began saving together in a neighbouring village.' },
  { date: '2026-07-15', tag: 'Event', image: flick('doctor', 503), title: 'Independence Day health camp serves 300+ families',
    excerpt: 'A free general and maternal-health camp offered check-ups, medicines and hygiene kits to over 300 families across three villages.' },
  { date: '2026-06-05', tag: 'Environment', image: flick('tree,planting', 504), title: 'World Environment Day: 1,000 saplings planted',
    excerpt: 'Volunteers and school children planted 1,000 saplings on village commons as part of the Hara Bhara Gaon drive.' },
];
// __C_LISTS__

export const events = [
  { date: '2026-10-12', title: 'Vocational training graduation & job mela', place: 'Katesar Centre', type: 'Ceremony' },
  { date: '2026-10-26', title: 'Free maternal-health & anaemia camp', place: 'Rasulpur village', type: 'Health Camp' },
  { date: '2026-11-09', title: 'Women’s enterprise & handicraft exhibition', place: 'Chapra town hall', type: 'Exhibition' },
  { date: '2026-11-30', title: 'Winter ration & blanket distribution', place: 'Saran district', type: 'Relief Drive' },
];

export const press = [
  { outlet: 'Dainik Jagran', title: 'Rural women of Saran find independence through Kusum Foundation', date: '2026-05-18', url: '' },
  { outlet: 'The Times of India', title: 'A Bihar NGO quietly rewrites the story of village livelihoods', date: '2026-03-02', url: '' },
  { outlet: 'Prabhat Khabar', title: 'Sewing centre turns homemakers into entrepreneurs', date: '2025-12-11', url: '' },
];

export const reports = [
  { year: 2025, title: 'Annual Report 2024–25', type: 'Annual', pages: 14, summary: 'Programmes, reach, stories and audited highlights for the year.', fileUrl: '/reports/annual-report-2024-25.pdf' },
  { year: 2025, title: 'Audited Financial Statement 2024–25', type: 'Financial', pages: 10, summary: 'Balance sheet, income & expenditure, and receipts & payments.', fileUrl: '/reports/audited-financial-statement-2024-25.pdf' },
  { year: 2025, title: 'Independent Auditor’s Report 2024–25', type: 'Audit', pages: 9, summary: 'Statutory audit opinion by our chartered accountants.', fileUrl: '/reports/independent-auditor-report-2024-25.pdf' },
  { year: 2024, title: 'Annual Report 2023–24', type: 'Annual', pages: 14, summary: 'A year of health camps, flood relief and SHG growth.', fileUrl: '/reports/annual-report-2023-24.pdf' },
  { year: 2024, title: 'Audited Financial Statement 2023–24', type: 'Financial', pages: 10, summary: 'Full financial statements for FY 2023–24.', fileUrl: '/reports/audited-financial-statement-2023-24.pdf' },
];

export const fundUtilization = [
  { label: 'Programmes & field work', pct: 78, color: 'bg-rose-600' },
  { label: 'Training & materials', pct: 10, color: 'bg-rose-400' },
  { label: 'Administration', pct: 8, color: 'bg-amber-400' },
  { label: 'Fundraising & outreach', pct: 4, color: 'bg-gray-300' },
];

export const causes = [
  { id: 'where-most-needed', label: 'Where it’s needed most', desc: 'Let us direct your gift to the highest-priority need.' },
  { id: 'women-empowerment', label: 'Women empowerment', desc: 'Self-help groups, training and livelihoods for rural women.' },
  { id: 'education', label: 'Educate a child', desc: 'Scholarships, books and after-school learning.' },
  { id: 'vocational', label: 'Skill a youth', desc: 'Sponsor a tailoring or computer-course seat.' },
  { id: 'healthcare', label: 'Health camps', desc: 'Bring free check-ups and medicines to a village.' },
  { id: 'food', label: 'Feed a family', desc: 'Monthly ration for a vulnerable household.' },
];

export const donationPresets = {
  'one-time': [500, 1000, 2500, 5000],
  monthly: [300, 600, 1200, 2500],
};

export const impactHighlights = [
  { value: '4,500+', label: 'Lives touched since 2008' },
  { value: '₹52L+', label: 'Deployed into programmes' },
  { value: '12', label: 'Villages reached' },
  { value: '8', label: 'Schools engaged' },
];







