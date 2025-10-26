// App state
let currentSection = 'home';
let currentTheme = 'light';
let currentLanguage = 'en';
let puzzleState = Array(9).fill('');

// Game state
let gameState = {
    sorting: {
        points: 0,
        difficulty: 'easy',
        items: [],
        bins: [],
        timer: null,
        timeLeft: 600 // 10 minutes in seconds
    },
    matching: {
        points: 0,
        difficulty: 'easy',
        cards: [],
        flippedCards: [],
        matchedPairs: 0,
        timer: null,
        timeLeft: 600 // 10 minutes in seconds
    },
    memory: {
        points: 0,
        difficulty: 'easy',
        cards: [],
        flippedCards: [],
        matchedPairs: 0,
        moves: 0,
        timer: null,
        timeLeft: 600 // 10 minutes in seconds
    }
};

// Rewards state
let rewardsState = {
    totalPoints: 0,
    rewards: {
        1: { name: "First Steps", pointsRequired: 50, earned: false },
        2: { name: "Recycling Master", pointsRequired: 100, earned: false, game: "sorting" },
        3: { name: "Memory Champion", pointsRequired: 150, earned: false, game: "memory" },
        4: { name: "Matching Expert", pointsRequired: 200, earned: false, game: "matching" },
        5: { name: "Eco Hero", pointsRequired: 500, earned: false, game: "total" },
        6: { name: "Difficulty Master", pointsRequired: 0, earned: false, game: "nightmare" }
    }
};

// Enhanced notification system with debouncing and spam prevention
let notificationTimeout = null;
let notificationQueue = [];
let isNotificationActive = false;
let lastNotificationTime = 0;
let notificationDebounceDelay = 1000; // 1 second debounce
let activeMessage = null;
let clickLock = new Set(); // Track locked elements

// Debounce function to prevent rapid firing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Click lock mechanism to prevent spam
function createClickLock(elementId, duration = 1000) {
    if (clickLock.has(elementId)) return false;
    
    clickLock.add(elementId);
    setTimeout(() => clickLock.delete(elementId), duration);
    return true;
}

// Translation data
const translations = {
    en: {
        // Navigation
        'nav.home': 'Home',
        'nav.info': 'Info',
        'nav.games': 'Games',
        'nav.tracker': 'Tracker',
        'nav.about': 'About',
        'nav.settings': 'Settings',
        
        // Hero section
        'hero.title': 'Transform Waste into Worth',
        'hero.description': 'Join the green revolution with our comprehensive waste management platform. Track, reduce, and recycle your way to a sustainable future.',
        'hero.cta': 'Start Tracking',
        
        // Features
        'features.recycling.title': 'Smart Recycling',
        'features.recycling.description': 'Learn how to properly sort and recycle different materials with our intelligent guidance system.',
        'features.analytics.title': 'Waste Analytics',
        'features.analytics.description': 'Track your waste reduction progress with detailed analytics and environmental impact metrics.',
        'features.rewards.title': 'Eco Rewards',
        'features.rewards.description': 'Earn points for sustainable practices and redeem them for eco-friendly merchandise.',
        
        // Info section
        'info.title': 'Waste Management Information',
        'info.subtitle': 'Learn about sustainable waste disposal practices',
        'info.categories.title': 'Waste Categories',
        'info.categories.description': 'Organic waste should be composted to create nutrient-rich soil. Keep food scraps, yard trimmings, and biodegradable materials separate from other waste streams.',
        'info.recycling.title': 'Recycling Guidelines',
        'info.recycling.description': 'Clean containers before recycling. Remove caps and lids from bottles. Check local recycling programs for specific material acceptance policies.',
        'info.hazardous.title': 'Hazardous Waste',
        'info.hazardous.description': 'Electronics, batteries, chemicals, and medical waste require special disposal methods. Never put these items in regular trash or recycling bins.',
        'info.reduction.title': 'Reduction Tips',
        'info.reduction.description': 'Buy only what you need, choose reusable products, repair instead of replacing, and donate items in good condition to reduce overall waste generation.',
        'info.composting.title': 'Composting Guide',
        'info.composting.description': 'Create a balanced mix of green materials (food scraps) and brown materials (dry leaves, paper) for optimal composting conditions.',
        'info.industrial.title': 'Industrial Waste',
        'info.industrial.description': 'Businesses must follow specific regulations for waste disposal. Partner with certified waste management companies for proper handling and documentation.',
        
        // Games section
        'games.title': 'Eco-Friendly Games',
        'games.subtitle': 'Learn while you play',
        
        // Tracker section
        'tracker.title': 'Waste Disposal Calculator',
        'tracker.subtitle': 'Calculate your waste disposal needs',
        'tracker.metrics.wasteReduced': 'Pounds Reduced',
        'tracker.metrics.recyclingRate': 'Recycling Rate %',
        'tracker.metrics.carbonSaved': 'Tons CO2 Saved',
        'tracker.metrics.ecoPoints': 'Eco Points',
        'tracker.report.title': 'Yearly Report',
        'tracker.report.description': 'This week you\'ve improved your recycling rate by 12% and reduced overall waste by 8 pounds. Keep up the excellent work!',
        'tracker.report.button': 'View Full Report',
        'tracker.goals.title': 'Goals & Achievements',
        'tracker.goals.description': 'You\'re 78% towards your monthly goal of reducing waste by 50 pounds. Complete 3 more recycling activities to unlock the "Green Champion" badge!',
        'tracker.goals.button': 'Set New Goals',
        'tracker.comparison.title': 'Impact Comparison',
        'tracker.comparison.description': 'Compared to the average household, you\'re producing 32% less waste and recycling 28% more materials. You\'re making a real difference!',
        'tracker.comparison.button': 'Compare with Others',
        
        // About section
        'about.title': 'About ECOTrack',
        'about.subtitle': 'Our mission for a sustainable future',
        'about.mission.title': 'Our Mission',
        'about.mission.description': 'To create a world where waste is minimized, resources are conserved, and every individual contributes to environmental sustainability through informed actions and smart technology.',
        'about.team.title': 'Our Team',
        'about.team.description': 'A dedicated group of environmental scientists, software engineers, and sustainability experts working together to develop innovative solutions for waste management challenges.',
        'about.impact.title': 'Global Impact',
        'about.impact.description': 'Since our launch, ECOTrack users have diverted over 2 million pounds of waste from landfills and reduced carbon emissions by 15,000 tons through improved recycling practices.',
        'about.technology.title': 'Technology',
        'about.technology.description': 'Our platform uses advanced analytics and machine learning to provide personalized waste reduction recommendations and track environmental impact in real-time.',
        'about.partnerships.title': 'Partnerships',
        'about.partnerships.description': 'We collaborate with local waste management companies, environmental organizations, and municipalities to create comprehensive sustainability programs.',
        'about.education.title': 'Education',
        'about.education.description': 'Through workshops, online resources, and community programs, we educate individuals and businesses about sustainable waste management practices.',
        
        // Settings section
        'settings.title': 'Settings',
        'settings.subtitle': 'Customize your ECOTrack experience',
        'settings.theme.title': 'Choose Theme',
        'settings.theme.light': 'Light',
        'settings.theme.dark': 'Dark',
        'settings.theme.forest': 'Forest',
        'settings.theme.ocean': 'Ocean',
        'settings.theme.sunset': 'Sunset',
        'settings.theme.description': 'Choose from our collection of beautiful themes to personalize your ECOTrack experience.',
        'settings.language.title': 'Language / Idioma',
        'settings.notifications.title': 'Notifications',
        'settings.notifications.description': 'Manage your notification preferences for reminders, achievements, and weekly reports.',
        'settings.notifications.button': 'Configure Notifications',
        'settings.privacy.title': 'Data & Privacy',
        'settings.privacy.description': 'Control your data sharing preferences and privacy settings for a personalized experience.',
        'settings.privacy.button': 'Privacy Settings'
    },
    fil: {
        // Navigation
        'nav.home': 'Home',
        'nav.info': 'Impormasyon',
        'nav.games': 'Mga Laro',
        'nav.tracker': 'Tracker',
        'nav.about': 'Tungkol',
        'nav.settings': 'Mga Setting',
        
        // Hero section
        'hero.title': 'I-Transform ang Basura sa Kabuluhan',
        'hero.description': 'Sumali sa green revolution gamit ang aming comprehensive waste management platform. I-track, bawasan, at i-recycle ang iyong daan patungo sa isang sustainable na hinaharap.',
        'hero.cta': 'Simulan ang Pag-track',
        
        // Features
        'features.recycling.title': 'Smart na Pag-recycle',
        'features.recycling.description': 'Alamin kung paano ng wasto i-sort at i-recycle ang iba\'t ibang materyales gamit ang aming intelligent guidance system.',
        'features.analytics.title': 'Waste Analytics',
        'features.analytics.description': 'I-track ang iyong pag-unlad sa pagbawas ng basura gamit ang detalyadong analytics at environmental impact metrics.',
        'features.rewards.title': 'Eco Rewards',
        'features.rewards.description': 'Kumita ng puntos para sa sustainable practices at i-redeem ang mga ito para sa eco-friendly merchandise.',
        
        // Info section
        'info.title': 'Impormasyon sa Waste Management',
        'info.subtitle': 'Alamin ang tungkol sa sustainable waste disposal practices',
        'info.categories.title': 'Mga Kategorya ng Basura',
        'info.categories.description': 'Ang organic waste ay dapat i-compost para makagawa ng nutrient-rich soil. Panatilihin ang food scraps, yard trimmings, at biodegradable materials na hiwalay sa iba pang waste streams.',
        'info.recycling.title': 'Mga Alituntunin sa Pag-recycle',
        'info.recycling.description': 'Linisin ang mga lalagyan bago i-recycle. Alisin ang mga cap at lid mula sa mga bote. Tingnan ang mga lokal na recycling programs para sa mga patakaran sa pagtanggap ng materyales.',
        'info.hazardous.title': 'Hazardous Waste',
        'info.hazardous.description': 'Ang mga electronics, bateriya, kemikal, at medikal na basura ay nangangailangan ng espesyal na disposal methods. Huwag ilagay ang mga ite, sa regular trash o recycling bins.',
        'info.reduction.title': 'Mga Tip sa Pagbawas',
        'info.reduction.description': 'Bumili lamang ng kung ano ang kailangan, pumili ng mga reusable product, kumpihin sa halip na palitan, at i-donate ang mga gamit na nasa mabuting kondisyon para bawasan ang kabuuang waste generation.',
        'info.composting.title': 'Gabay sa Composting',
        'info.composting.description': 'Gumawa ng balanseng halo ng green materials (tira ng pagkain) at brown materials (tuyot na dahon, papel) para sa pinakamainam na composting conditions.',
        'info.industrial.title': 'Pang-industriyang Basura',
        'info.industrial.description': 'Ang mga negosyo ay dapat sumunod sa mga partikular na regulasyon para sa waste disposal. Makipagtulungan sa mga sertipikadong waste management companies para sa tamang paghahawak at dokumentasyon.',
        
        // Games section
        'games.title': 'Eco-Friendly na Mga Laro',
        'games.subtitle': 'Matuto habang naglalaro',
        
        // Tracker section
        'tracker.title': 'Kalkulator ng Waste Disposal',
        'tracker.subtitle': 'Kalkulahin ang iyong pangangailangan sa waste disposal',
        'tracker.metrics.wasteReduced': 'Pounds na Nabawasan',
        'tracker.metrics.recyclingRate': 'Rate ng Pag-recycle %',
        'tracker.metrics.carbonSaved': 'Tons CO2 na Na-save',
        'tracker.metrics.ecoPoints': 'Eco Points',
        'tracker.report.title': 'Taunang Ulat',
        'tracker.report.description': 'Ngayong linggo ay pinaigi mo ang iyong recycling rate ng 12% at nabawasan ang kabuuang basura ng 8 pounds. Patuloy na gawin ang mahusay na trabaho!',
        'tracker.report.button': 'Tingnan ang Buong Ulat',
        'tracker.goals.title': 'Mga Layunin at Nakamit',
        'tracker.goals.description': 'Ikaw ay 78% na natapos sa iyong buwanang layunin na bawasan ang basura ng 50 pounds. Kumpletuhin ang 3 pang recycling activities para i-unlock ang "Green Champion" badge!',
        'tracker.goals.button': 'Magtakda ng Bagong Mga Layunin',
        'tracker.comparison.title': 'Paghahambing ng Epekto',
        'tracker.comparison.description': 'Ikukumpara sa isang average household, ikaw ay gumagawa ng 32% na mas kaunting basura at nagre-recycle ng 28% na mas maraming materyales. Ikaw ay gumagawa ng tunay na pagbabago!',
        'tracker.comparison.button': 'Ikumpara sa Iba',
        
        // About section
        'about.title': 'Tungkol sa ECOTrack',
        'about.subtitle': 'Ang aming misyon para sa isang sustainable na hinaharap',
        'about.mission.title': 'Ang Aming Misyon',
        'about.mission.description': 'Para lumikha ng isang mundo kung saan ang basura ay nababawasan, ang mga mapagkukunan ay nakakatipid, at bawat indibidwal ay nakakatulong sa environmental sustainability sa pamamagitan ng impormadong aksyon at smart technology.',
        'about.team.title': 'Ang Aming Koponan',
        'about.team.description': 'Isang dedikadong grupo ng environmental scientists, software engineers, at sustainability experts na nagtutulungan para bumuo ng makabagong solusyon sa mga hamon ng waste management.',
        'about.impact.title': 'Global na Epekto',
        'about.impact.description': 'Mula nang aming ilunsad, ang mga gumagamit ng ECOTrack ay nakaiwas ng higit sa 2 milyong pounds ng basura mula sa mga landfill at nabawasan ang carbon emissions ng 15,000 tons sa pamamagitan ng pagpapahusay ng recycling practices.',
        'about.technology.title': 'Teknolohiya',
        'about.technology.description': 'Ang aming platform ay gumagamit ng advanced analytics at machine learning para magbigay ng personalized waste reduction recommendations at i-track ang environmental impact sa real-time.',
        'about.partnerships.title': 'Mga Partership',
        'about.partnerships.description': 'Kami ay nakikipagtulungan sa mga lokal na waste management companies, environmental organizations, at mga munisipalidad para lumikha ng komprehensibong sustainability programs.',
        'about.education.title': 'Edukasyon',
        'about.education.description': 'Sa pamamagitan ng mga workshop, online resources, at komunidad na mga programa, kami ay nagpapalaganap ng kaalaman sa mga indibidwal at negosyo tungkol sa sustainable na waste management practices.',
        
        // Settings section
        'settings.title': 'Mga Setting',
        'settings.subtitle': 'I-customize ang iyong ECOTrack experience',
        'settings.theme.title': 'Pumili ng Tema',
        'settings.theme.light': 'Liwanag',
        'settings.theme.dark': 'Madilim',
        'settings.theme.forest': 'Kagubatan',
        'settings.theme.ocean': 'Karagatan',
        'settings.theme.sunset': 'Takipsilim',
        'settings.theme.description': 'Pumili mula sa aming koleksyon ng magagandang tema para i-personalize ang iyong ECOTrack experience.',
        'settings.language.title': 'Wika / Language',
        'settings.notifications.title': 'Mga Abiso',
        'settings.notifications.description': 'Pamahalaan ang iyong mga kagustuhan sa abiso para sa mga paalala, nakamit, at lingguhang mga ulat.',
        'settings.notifications.button': 'I-configure ang Mga Abiso',
        'settings.privacy.title': 'Datos at Privacy',
        'settings.privacy.description': 'Kontrolin ang iyong mga kagustuhan sa pagbabahagi ng datos at mga setting ng privacy para sa isang personalized na karanasan.',
        'settings.privacy.button': 'Mga Setting ng Privacy'
    }
};

// Waste disposal API configuration
const WASTE_API_CONFIG = {
    baseUrl: 'https://api.waste-tracker.com/v1',
    endpoints: {
        disposal: '/disposal',
        metrics: '/metrics',
        categories: '/categories'
    },
    refreshInterval: 30000 // 30 seconds
};

// Live waste disposal data
let wasteData = {
    totalDisposal: 0,
    categories: {},
    recentActivity: [],
    lastUpdated: null
};

// Waste items for games
const wasteItems = {
    recyclable: [
        { name: "Plastic Bottle", icon: "🥤" },
        { name: "Glass Jar", icon: "🍯" },
        { name: "Aluminum Can", icon: "🥫" },
        { name: "Newspaper", icon: "🗞️" },
        { name: "Cardboard Box", icon: "📦" },
        { name: "Steel Can", icon: "🥫" }
    ],
    organic: [
        { name: "Apple Core", icon: "🍎" },
        { name: "Banana Peel", icon: "🍌" },
        { name: "Egg Shells", icon: "🥚" },
        { name: "Coffee Grounds", icon: "☕" },
        { name: "Grass Clippings", icon: "🌿" },
        { name: "Vegetable Scraps", icon: "🥕" }
    ],
    hazardous: [
        { name: "Battery", icon: "🔋" },
        { name: "Paint Can", icon: "🛢️" },
        { name: "Medicine Bottle", icon: "💊" },
        { name: "Motor Oil", icon: "🛢️" },
        { name: "Electronic Device", icon: "📱" },
        { name: "Cleaning Chemical", icon: "🧴" }
    ],
    general: [
        { name: "Plastic Bag", icon: "🛍️" },
        { name: "Ceramic Bowl", icon: "🥣" },
        { name: "Styrofoam", icon: "🍱" },
        { name: "Used Tissue", icon: "🧻" },
        { name: "Broken Glass", icon: "🍷" },
        { name: "Food Wrapper", icon: "🥡" }
    ]
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadSavedSettings();
    setupEventListeners();
    showSection('home');
    updateLanguage();
    applyTheme();
    startWasteTracker();
    
    // Initialize games
    initGames();
    
    // Load rewards state
    loadRewardsState();
    
    // Update rewards display
    updateRewardsDisplay();
}

function loadSavedSettings() {
    const saved = localStorage.getItem('ecotrack-settings');
    if (saved) {
        try {
            const settings = JSON.parse(saved);
            currentTheme = settings.theme || 'light';
            currentLanguage = settings.language || 'en';
        } catch (error) {
            console.error('Error loading saved settings:', error);
        }
    }
}

function saveSettings() {
    const settings = {
        theme: currentTheme,
        language: currentLanguage
    };
    localStorage.setItem('ecotrack-settings', JSON.stringify(settings));
}

function setupEventListeners() {
    // Navigation links
    document.querySelectorAll('[data-section]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });

    // Theme selection with enhanced protection
    document.querySelectorAll('[data-theme]').forEach((themeBtn, index) => {
        themeBtn.addEventListener('click', debounce(() => {
            if (createClickLock(`theme-${index}`)) {
                const theme = themeBtn.getAttribute('data-theme');
                setTheme(theme);
            }
        }, 1000));
    });

    // Language selection with enhanced protection
    document.querySelectorAll('[data-language]').forEach((langBtn, index) => {
        langBtn.addEventListener('click', debounce(() => {
            if (createClickLock(`language-${index}`)) {
                const language = langBtn.getAttribute('data-language');
                setLanguage(language);
            }
        }, 1000));
    });

    // Enhanced button handlers with triple protection (debounce + click lock + notification dedupe)
    function createSafeClickHandler(element, message, elementId) {
        const safeHandler = debounce(() => {
            if (createClickLock(elementId)) {
                showNotification(message);
            }
        }, 1000);
        
        if (element) {
            element.addEventListener('click', safeHandler);
        }
    }

    // Game buttons
    document.getElementById('sorting-game-btn').addEventListener('click', () => {
        showGame('sorting');
    });
    
    document.getElementById('matching-game-btn').addEventListener('click', () => {
        showGame('matching');
    });
    
    document.getElementById('memory-game-btn').addEventListener('click', () => {
        showGame('memory');
    });
    
    // Difficulty selectors
    document.getElementById('sorting-difficulty').addEventListener('change', (e) => {
        gameState.sorting.difficulty = e.target.value;
        resetSortingGame();
    });
    
    document.getElementById('matching-difficulty').addEventListener('change', (e) => {
        gameState.matching.difficulty = e.target.value;
        resetMatchingGame();
    });
    
    document.getElementById('memory-difficulty').addEventListener('change', (e) => {
        gameState.memory.difficulty = e.target.value;
        resetMemoryGame();
    });
    
    // Reset buttons
    document.getElementById('reset-sorting').addEventListener('click', resetSortingGame);
    document.getElementById('reset-matching').addEventListener('click', resetMatchingGame);
    document.getElementById('reset-memory').addEventListener('click', resetMemoryGame);
}

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionName;
    }

    // Update navigation active state
    document.querySelectorAll('[data-section]').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionName) {
            link.classList.add('active');
        }
    });

    // Special handling for tracker section
    if (sectionName === 'tracker') {
        animateMetrics();
        updateTrackerData();
    }
    
    // Special handling for games section
    if (sectionName === 'games') {
        hideAllGames();
    }
}

// Improved notification system
// Enhanced notification system with debouncing and spam prevention
function showNotification(message) {
    const now = Date.now();
    
    // Prevent spam: skip if same message is already active or too recent
    if (message === activeMessage || (now - lastNotificationTime) < notificationDebounceDelay) {
        return;
    }
    
    // Add to queue only if not already in queue
    if (!notificationQueue.includes(message)) {
        notificationQueue.push(message);
    }
    
    processNotificationQueue();
}

function processNotificationQueue() {
    if (isNotificationActive || notificationQueue.length === 0) {
        return;
    }

    isNotificationActive = true;
    const message = notificationQueue.shift();
    const notification = document.getElementById('notification');
    
    // Clear any existing timeout
    if (notificationTimeout) {
        clearTimeout(notificationTimeout);
    }
    
    // Update content and show
    activeMessage = message;
    notification.textContent = message;
    notification.classList.add('show');
    lastNotificationTime = Date.now();
    
    // Hide after delay
    notificationTimeout = setTimeout(() => {
        notification.classList.remove('show');
        isNotificationActive = false;
        activeMessage = null;
        
        // Clear queue to prevent buildup
        notificationQueue = [];
        
        // Small delay before processing next
        setTimeout(() => {
            processNotificationQueue();
        }, 300);
    }, 2500);
}

// Waste disposal tracker API functions
async function fetchWasteData() {
    try {
        // Simulate API call - replace with real API endpoint
        const mockData = {
            totalDisposal: Math.floor(Math.random() * 1000) + 500,
            categories: {
                organic: Math.floor(Math.random() * 300) + 100,
                recyclable: Math.floor(Math.random() * 250) + 150,
                electronic: Math.floor(Math.random() * 100) + 50,
                hazardous: Math.floor(Math.random() * 50) + 10,
                general: Math.floor(Math.random() * 200) + 100
            },
            recentActivity: [
                { type: 'recycled', amount: Math.floor(Math.random() * 50) + 10, timestamp: new Date().toISOString() },
                { type: 'disposed', amount: Math.floor(Math.random() * 30) + 5, timestamp: new Date().toISOString() }
            ],
            lastUpdated: new Date().toISOString()
        };
        
        return mockData;
    } catch (error) {
        console.error('Error fetching waste data:', error);
        return null;
    }
}

function updateTrackerDisplay(data) {
    if (!data) return;
    
    // Update metrics with live data
    const wasteReducedEl = document.querySelector('[data-testid="metric-waste-reduced"]');
    const recyclingRateEl = document.querySelector('[data-testid="metric-recycling-rate"]');
    const carbonSavedEl = document.querySelector('[data-testid="metric-carbon-saved"]');
    const ecoPointsEl = document.querySelector('[data-testid="metric-eco-points"]');
    
    if (wasteReducedEl) {
        animateValue(wasteReducedEl, 0, data.totalDisposal, 1000);
    }
    
    if (recyclingRateEl) {
        const recyclingRate = Math.round((data.categories.recyclable / data.totalDisposal) * 100);
        animateValue(recyclingRateEl, 0, recyclingRate, 1000);
    }
    
    if (carbonSavedEl) {
        const carbonSaved = (data.categories.recyclable * 0.002).toFixed(1);
        animateValue(carbonSavedEl, 0, parseFloat(carbonSaved), 1000, true);
    }
    
    if (ecoPointsEl) {
        const ecoPoints = data.categories.recyclable * 10;
        animateValue(ecoPointsEl, 0, ecoPoints, 1000);
    }
    
    // Update category values
    const categories = ['organic', 'recyclable', 'electronic', 'hazardous', 'general'];
    categories.forEach(category => {
        const element = document.querySelector(`[data-category="${category}"]`);
        if (element && data.categories[category] !== undefined) {
            animateValue(element, 0, data.categories[category], 1000, false, ' lbs');
        }
    });
}

function animateValue(element, start, end, duration, isDecimal = false, suffix = '') {
    const startTime = performance.now();
    const currentText = element.textContent;
    const numericValue = parseFloat(currentText) || 0;
    
    function updateValue(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = start + (end - start) * progress;
        const displayValue = isDecimal ? current.toFixed(1) : Math.floor(current);
        element.textContent = displayValue + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateValue);
        }
    }
    
    requestAnimationFrame(updateValue);
}

async function updateTrackerData() {
    const data = await fetchWasteData();
    if (data) {
        wasteData = data;
        updateTrackerDisplay(data);
    }
}

function startWasteTracker() {
    // Initial load
    updateTrackerData();
    
    // Set up periodic updates
    setInterval(() => {
        if (currentSection === 'tracker') {
            updateTrackerData();
        }
    }, WASTE_API_CONFIG.refreshInterval);
}

function setTheme(theme) {
    currentTheme = theme;
    applyTheme();
    saveSettings();
    showNotification(`Theme changed to ${theme}`);
}

function applyTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update theme selection UI
    document.querySelectorAll('[data-theme]').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeThemeBtn = document.querySelector(`[data-theme="${currentTheme}"]`);
    if (activeThemeBtn) {
        activeThemeBtn.classList.add('active');
    }
}

function setLanguage(language) {
    // Only allow English and Filipino
    if (language !== 'en' && language !== 'fil') {
        return;
    }
    
    currentLanguage = language;
    updateLanguage();
    saveSettings();
    showNotification(`Language changed to ${language === 'en' ? 'English' : 'Filipino'}`);
}

function translate(key) {
    return translations[currentLanguage][key] || translations['en'][key] || key;
}

function updateLanguage() {
    // Update all elements with data-key attributes
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        const translation = translate(key);
        
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = translation;
        } else {
            element.textContent = translation;
        }
    });
    
    // Update navigation text
    const navItems = document.querySelectorAll('.nav-text');
    navItems.forEach((item, index) => {
        const keys = ['nav.home', 'nav.info', 'nav.games', 'nav.tracker', 'nav.about', 'nav.settings'];
        if (keys[index]) {
            item.textContent = translate(keys[index]);
        }
    });
    
    // Update HTML lang attribute
    document.documentElement.lang = currentLanguage;
}

function animateMetrics() {
    // This function is now handled by updateTrackerDisplay
    // Kept for backward compatibility
}

// Game functions
function initGames() {
    // Initialize all games with default settings
    resetSortingGame();
    resetMatchingGame();
    resetMemoryGame();
}

function hideAllGames() {
    document.querySelectorAll('.game-content').forEach(game => {
        game.style.display = 'none';
    });
    
    // Show the games grid
    document.querySelector('.games-grid').style.display = 'grid';
}

function showGame(gameType) {
    hideAllGames();
    
    // Hide the games grid
    document.querySelector('.games-grid').style.display = 'none';
    
    // Show the selected game
    const gameElement = document.getElementById(`${gameType}-game`);
    if (gameElement) {
        gameElement.style.display = 'block';
    }
    
    // Reset the game when shown
    switch(gameType) {
        case 'sorting':
            resetSortingGame();
            break;
        case 'matching':
            resetMatchingGame();
            break;
        case 'memory':
            resetMemoryGame();
            break;
    }
}

// Timer functions
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function startTimer(gameType) {
    const game = gameState[gameType];
    if (game.timer) {
        clearInterval(game.timer);
    }
    
    game.timer = setInterval(() => {
        game.timeLeft--;
        const timerElement = document.getElementById(`${gameType}-timer`);
        if (timerElement) {
            timerElement.textContent = formatTime(game.timeLeft);
        }
        
        if (game.timeLeft <= 0) {
            clearInterval(game.timer);
            endGame(gameType, false); // Time's up
        }
    }, 1000);
}

function stopTimer(gameType) {
    const game = gameState[gameType];
    if (game.timer) {
        clearInterval(game.timer);
        game.timer = null;
    }
}

// Sorting Game Functions
function resetSortingGame() {
    const game = gameState.sorting;
    game.points = 0;
    game.timeLeft = 600; // 10 minutes
    
    // Update points display
    const pointsElement = document.getElementById('sorting-points');
    if (pointsElement) {
        pointsElement.textContent = game.points;
    }
    
    // Update timer display
    const timerElement = document.getElementById('sorting-timer');
    if (timerElement) {
        timerElement.textContent = formatTime(game.timeLeft);
    }
    
    // Generate waste items
    generateSortingItems();
    
    // Stop any existing timer
    stopTimer('sorting');
}

function generateSortingItems() {
    const itemsContainer = document.getElementById('sorting-items');
    if (!itemsContainer) return;
    
    itemsContainer.innerHTML = '';
    
    // Get difficulty settings
    const difficultySettings = {
        easy: { count: 6, time: 600 },
        normal: { count: 10, time: 600 },
        hard: { count: 15, time: 600 },
        nightmare: { count: 20, time: 300 },
        impossible: { count: 30, time: 300 }
    };
    
    const settings = difficultySettings[gameState.sorting.difficulty] || difficultySettings.easy;
    gameState.sorting.timeLeft = settings.time;
    
    // Create items
    for (let i = 0; i < settings.count; i++) {
        // Randomly select a category
        const categories = ['recyclable', 'organic', 'hazardous', 'general'];
        const category = categories[Math.floor(Math.random() * categories.length)];
        
        // Randomly select an item from that category
        const items = wasteItems[category];
        const item = items[Math.floor(Math.random() * items.length)];
        
        const itemElement = document.createElement('div');
        itemElement.className = 'waste-item';
        itemElement.setAttribute('data-category', category);
        itemElement.setAttribute('data-testid', `waste-item-${i}`);
        itemElement.draggable = true;
        itemElement.innerHTML = `
            <div class="item-icon">${item.icon}</div>
            <div class="item-name">${item.name}</div>
        `;
        
        // Add drag events
        itemElement.addEventListener('dragstart', handleDragStart);
        itemElement.addEventListener('dragend', handleDragEnd);
        
        itemsContainer.appendChild(itemElement);
    }
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.getAttribute('data-category'));
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

// Add drop events to bins
document.addEventListener('DOMContentLoaded', function() {
    const bins = document.querySelectorAll('.bin');
    bins.forEach(bin => {
        bin.addEventListener('dragover', handleDragOver);
        bin.addEventListener('dragenter', handleDragEnter);
        bin.addEventListener('dragleave', handleDragLeave);
        bin.addEventListener('drop', handleDrop);
    });
});

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragEnter(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.target.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.target.classList.remove('drag-over');
    
    const category = e.dataTransfer.getData('text/plain');
    const binType = e.target.closest('.bin').getAttribute('data-bin-type');
    
    // Check if correct bin
    if (category === binType) {
        gameState.sorting.points += 10;
        showNotification('Correct! +10 points');
    } else {
        gameState.sorting.points -= 5;
        showNotification('Wrong bin! -5 points');
    }
    
    // Update points display
    const pointsElement = document.getElementById('sorting-points');
    if (pointsElement) {
        pointsElement.textContent = gameState.sorting.points;
    }
    
    // Remove the item
    const draggedItem = document.querySelector('.dragging');
    if (draggedItem) {
        draggedItem.remove();
    }
    
    // Check if game is complete
    const itemsContainer = document.getElementById('sorting-items');
    if (itemsContainer && itemsContainer.children.length === 0) {
        endGame('sorting', true);
    }
}

function endGame(gameType, isCompleted) {
    stopTimer(gameType);
    
    if (isCompleted) {
        showNotification(`Game completed! Final score: ${gameState[gameType].points} points`);
    } else {
        showNotification(`Time's up! Final score: ${gameState[gameType].points} points`);
    }
    
    // Update rewards
    updateRewards(gameType, gameState[gameType].points);
}

// Matching Game Functions
function resetMatchingGame() {
    const game = gameState.matching;
    game.points = 0;
    game.matchedPairs = 0;
    game.timeLeft = 600; // 10 minutes
    game.cards = [];
    game.flippedCards = [];
    
    // Update points display
    const pointsElement = document.getElementById('matching-points');
    if (pointsElement) {
        pointsElement.textContent = game.points;
    }
    
    // Update timer display
    const timerElement = document.getElementById('matching-timer');
    if (timerElement) {
        timerElement.textContent = formatTime(game.timeLeft);
    }
    
    // Generate cards
    generateMatchingCards();
    
    // Stop any existing timer
    stopTimer('matching');
}

function generateMatchingCards() {
    const board = document.getElementById('matching-board');
    if (!board) return;
    
    board.innerHTML = '';
    
    // Get difficulty settings
    const difficultySettings = {
        easy: { pairs: 6, time: 600 },
        normal: { pairs: 8, time: 600 },
        hard: { pairs: 10, time: 600 },
        nightmare: { pairs: 12, time: 300 },
        impossible: { pairs: 15, time: 300 }
    };
    
    const settings = difficultySettings[gameState.matching.difficulty] || difficultySettings.easy;
    gameState.matching.timeLeft = settings.time;
    
    // Create pairs of waste items
    const allItems = [];
    Object.values(wasteItems).forEach(category => {
        allItems.push(...category);
    });
    
    // Select random items for pairs
    const selectedItems = [];
    while (selectedItems.length < settings.pairs && allItems.length > 0) {
        const randomIndex = Math.floor(Math.random() * allItems.length);
        const item = allItems.splice(randomIndex, 1)[0];
        selectedItems.push(item);
        selectedItems.push({...item}); // Add duplicate for matching
    }
    
    // Shuffle the items
    shuffleArray(selectedItems);
    
    // Create card elements
    selectedItems.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'matching-card';
        card.setAttribute('data-item', item.name);
        card.setAttribute('data-testid', `matching-card-${index}`);
        card.innerHTML = `
            <div class="card-front"></div>
            <div class="card-back">${item.icon}</div>
        `;
        
        card.addEventListener('click', () => flipCard(card, item.name));
        board.appendChild(card);
        
        gameState.matching.cards.push({
            element: card,
            item: item.name,
            isFlipped: false,
            isMatched: false
        });
    });
    
    // Update board grid
    board.style.gridTemplateColumns = `repeat(${Math.ceil(Math.sqrt(settings.pairs * 2))}, 1fr)`;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function flipCard(cardElement, itemName) {
    const game = gameState.matching;
    
    // Don't allow flipping if two cards are already flipped or card is matched
    if (game.flippedCards.length >= 2 || 
        game.flippedCards.some(card => card.element === cardElement) ||
        game.cards.find(c => c.element === cardElement && c.isMatched)) {
        return;
    }
    
    // Flip the card
    cardElement.classList.add('flipped');
    const card = game.cards.find(c => c.element === cardElement);
    if (card) {
        card.isFlipped = true;
        game.flippedCards.push(card);
    }
    
    // Check for match when two cards are flipped
    if (game.flippedCards.length === 2) {
        const [card1, card2] = game.flippedCards;
        
        if (card1.item === card2.item) {
            // Match found
            card1.isMatched = true;
            card2.isMatched = true;
            game.matchedPairs++;
            game.points += 20;
            
            // Update points display
            const pointsElement = document.getElementById('matching-points');
            if (pointsElement) {
                pointsElement.textContent = game.points;
            }
            
            showNotification('Match found! +20 points');
            
            // Check if game is complete
            if (game.matchedPairs === game.cards.length / 2) {
                endGame('matching', true);
            }
        } else {
            // No match, flip cards back after delay
            game.points -= 5;
            
            // Update points display
            const pointsElement = document.getElementById('matching-points');
            if (pointsElement) {
                pointsElement.textContent = game.points;
            }
            
            setTimeout(() => {
                card1.element.classList.remove('flipped');
                card2.element.classList.remove('flipped');
                card1.isFlipped = false;
                card2.isFlipped = false;
            }, 1000);
        }
        
        // Clear flipped cards
        game.flippedCards = [];
    }
}

// Memory Game Functions
function resetMemoryGame() {
    const game = gameState.memory;
    game.points = 0;
    game.matchedPairs = 0;
    game.moves = 0;
    game.timeLeft = 600; // 10 minutes
    game.cards = [];
    game.flippedCards = [];
    
    // Update points display
    const pointsElement = document.getElementById('memory-points');
    if (pointsElement) {
        pointsElement.textContent = game.points;
    }
    
    // Update timer display
    const timerElement = document.getElementById('memory-timer');
    if (timerElement) {
        timerElement.textContent = formatTime(game.timeLeft);
    }
    
    // Generate cards
    generateMemoryCards();
    
    // Stop any existing timer
    stopTimer('memory');
}

function generateMemoryCards() {
    const board = document.getElementById('memory-board');
    if (!board) return;
    
    board.innerHTML = '';
    
    // Get difficulty settings
    const difficultySettings = {
        easy: { pairs: 6, time: 600 },
        normal: { pairs: 8, time: 600 },
        hard: { pairs: 10, time: 600 },
        nightmare: { pairs: 12, time: 300 },
        impossible: { pairs: 15, time: 300 }
    };
    
    const settings = difficultySettings[gameState.memory.difficulty] || difficultySettings.easy;
    gameState.memory.timeLeft = settings.time;
    
    // Create pairs of waste items
    const allItems = [];
    Object.values(wasteItems).forEach(category => {
        allItems.push(...category);
    });
    
    // Select random items for pairs
    const selectedItems = [];
    while (selectedItems.length < settings.pairs && allItems.length > 0) {
        const randomIndex = Math.floor(Math.random() * allItems.length);
        const item = allItems.splice(randomIndex, 1)[0];
        selectedItems.push(item);
        selectedItems.push({...item}); // Add duplicate for matching
    }
    
    // Shuffle the items
    shuffleArray(selectedItems);
    
    // Create card elements
    selectedItems.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.setAttribute('data-item', item.name);
        card.setAttribute('data-testid', `memory-card-${index}`);
        card.innerHTML = `
            <div class="card-front"></div>
            <div class="card-back">${item.icon}</div>
        `;
        
        card.addEventListener('click', () => flipMemoryCard(card, item.name));
        board.appendChild(card);
        
        gameState.memory.cards.push({
            element: card,
            item: item.name,
            isFlipped: false,
            isMatched: false
        });
    });
    
    // Update board grid
    board.style.gridTemplateColumns = `repeat(${Math.ceil(Math.sqrt(settings.pairs * 2))}, 1fr)`;
}

function flipMemoryCard(cardElement, itemName) {
    const game = gameState.memory;
    
    // Don't allow flipping if two cards are already flipped or card is matched
    if (game.flippedCards.length >= 2 || 
        game.flippedCards.some(card => card.element === cardElement) ||
        game.cards.find(c => c.element === cardElement && c.isMatched)) {
        return;
    }
    
    // Flip the card
    cardElement.classList.add('flipped');
    const card = game.cards.find(c => c.element === cardElement);
    if (card) {
        card.isFlipped = true;
        game.flippedCards.push(card);
    }
    
    // Check for match when two cards are flipped
    if (game.flippedCards.length === 2) {
        game.moves++;
        const [card1, card2] = game.flippedCards;
        
        if (card1.item === card2.item) {
            // Match found
            card1.isMatched = true;
            card2.isMatched = true;
            game.matchedPairs++;
            game.points += Math.max(10, 50 - game.moves); // More points for fewer moves
            
            // Update points display
            const pointsElement = document.getElementById('memory-points');
            if (pointsElement) {
                pointsElement.textContent = game.points;
            }
            
            showNotification('Match found! +' + Math.max(10, 50 - game.moves) + ' points');
            
            // Check if game is complete
            if (game.matchedPairs === game.cards.length / 2) {
                endGame('memory', true);
            }
        } else {
            // No match, flip cards back after delay
            setTimeout(() => {
                card1.element.classList.remove('flipped');
                card2.element.classList.remove('flipped');
                card1.isFlipped = false;
                card2.isFlipped = false;
            }, 1000);
        }
        
        // Clear flipped cards
        game.flippedCards = [];
    }
}

// Rewards Functions
function loadRewardsState() {
    const saved = localStorage.getItem('ecotrack-rewards');
    if (saved) {
        try {
            const savedState = JSON.parse(saved);
            rewardsState = {...rewardsState, ...savedState};
        } catch (error) {
            console.error('Error loading rewards state:', error);
        }
    }
}

function saveRewardsState() {
    localStorage.setItem('ecotrack-rewards', JSON.stringify(rewardsState));
}

function updateRewards(gameType, points) {
    // Update total points
    rewardsState.totalPoints += points;
    
    // Check rewards
    Object.values(rewardsState.rewards).forEach(reward => {
        // Special handling for Difficulty Master reward
        if (reward.game === "nightmare") {
            // Check if all games have been completed on nightmare difficulty
            const nightmareCompleted = ['sorting', 'matching', 'memory'].every(game => 
                gameState[game].difficulty === 'nightmare'
            );
            if (nightmareCompleted && !reward.earned) {
                reward.earned = true;
                showNotification(`🎉 Achievement Unlocked: ${reward.name}!`);
            }
        } 
        // Special handling for Eco Hero reward
        else if (reward.game === "total") {
            if (rewardsState.totalPoints >= reward.pointsRequired && !reward.earned) {
                reward.earned = true;
                showNotification(`🎉 Achievement Unlocked: ${reward.name}!`);
            }
        }
        // Regular game-specific rewards
        else if (reward.game === gameType) {
            if (points >= reward.pointsRequired && !reward.earned) {
                reward.earned = true;
                showNotification(`🎉 Achievement Unlocked: ${reward.name}!`);
            }
        }
        // First Steps reward (any game)
        else if (reward.game === "sorting" && gameType === "sorting") {
            if (points >= reward.pointsRequired && !reward.earned) {
                reward.earned = true;
                showNotification(`🎉 Achievement Unlocked: ${reward.name}!`);
            }
        }
    });
    
    saveRewardsState();
    updateRewardsDisplay();
}

function updateRewardsDisplay() {
    Object.entries(rewardsState.rewards).forEach(([id, reward]) => {
        const card = document.querySelector(`.reward-card[data-reward-id="${id}"]`);
        if (card) {
            const statusElement = card.querySelector('.reward-status');
            if (statusElement) {
                statusElement.textContent = reward.earned ? 'Unlocked' : 'Locked';
                statusElement.className = reward.earned ? 'reward-status unlocked' : 'reward-status locked';
            }
        }
    });
}

// Calculator Functions
document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculate-btn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateWaste);
    }
});

function calculateWaste() {
    const frequency = parseInt(document.getElementById('waste-frequency').value) || 0;
    const amount = parseInt(document.getElementById('waste-amount').value) || 0;
    const wasteType = document.getElementById('waste-type').value;
    
    if (frequency <= 0 || amount <= 0) {
        showNotification('Please enter valid values');
        return;
    }
    
    const daily = frequency * amount / 7;
    const weekly = frequency * amount;
    const monthly = weekly * 4.33; // Average weeks per month
    const yearly = weekly * 52;
    
    // Update results
    document.getElementById('daily-waste-result').textContent = daily.toFixed(1) + ' kg';
    document.getElementById('weekly-waste-result').textContent = weekly.toFixed(1) + ' kg';
    document.getElementById('monthly-waste-result').textContent = monthly.toFixed(1) + ' kg';
    document.getElementById('yearly-waste-result').textContent = yearly.toFixed(1) + ' kg';
    
    showNotification('Waste calculation completed!');
}

// Task Tracker Functions
document.addEventListener('DOMContentLoaded', function() {
    // Load saved task states
    const savedTasks = localStorage.getItem('ecotrack-tasks');
    if (savedTasks) {
        try {
            const tasks = JSON.parse(savedTasks);
            Object.entries(tasks).forEach(([id, completed]) => {
                const checkbox = document.getElementById(id);
                if (checkbox) {
                    checkbox.checked = completed;
                }
            });
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    }
    
    // Add event listeners to task checkboxes
    document.querySelectorAll('.task-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            saveTaskState();
            
            if (this.checked) {
                showNotification('Task completed! Great job!');
            }
        });
    });
});

function saveTaskState() {
    const tasks = {};
    document.querySelectorAll('.task-item input[type="checkbox"]').forEach(checkbox => {
        tasks[checkbox.id] = checkbox.checked;
    });
    localStorage.setItem('ecotrack-tasks', JSON.stringify(tasks));
}