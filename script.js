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

function startGameTimer(gameType) {
    // Clear existing timer if any
    if (gameState[gameType].timer) {
        clearInterval(gameState[gameType].timer);
    }
    
    // Get time based on difficulty
    const timeLimit = getDifficultyTimeLimit(gameState[gameType].difficulty);
    gameState[gameType].timeLeft = timeLimit;
    
    // Update timer display
    const timerElement = document.getElementById(`${gameType}-timer`);
    if (timerElement) {
        timerElement.textContent = formatTime(gameState[gameType].timeLeft);
    }
    
    // Start new timer
    gameState[gameType].timer = setInterval(() => {
        gameState[gameType].timeLeft--;
        
        // Update timer display
        if (timerElement) {
            timerElement.textContent = formatTime(gameState[gameType].timeLeft);
        }
        
        // Check if time is up
        if (gameState[gameType].timeLeft <= 0) {
            clearInterval(gameState[gameType].timer);
            showNotification(`Time's up! Game over for ${gameType} game.`);
            // Disable game interaction
            disableGameInteraction(gameType);
        }
    }, 1000);
}

function disableGameInteraction(gameType) {
    // Disable game elements when timer runs out
    const gameElement = document.getElementById(`${gameType}-game`);
    if (gameElement) {
        gameElement.classList.add('disabled');
    }
}

function enableGameInteraction(gameType) {
    // Enable game elements when starting/resetting game
    const gameElement = document.getElementById(`${gameType}-game`);
    if (gameElement) {
        gameElement.classList.remove('disabled');
    }
}

function getDifficultyTimeLimit(difficulty) {
    switch(difficulty) {
        case 'easy': return 600; // 10 minutes
        case 'normal': return 480; // 8 minutes
        case 'hard': return 240; // 4 minutes
        case 'nightmare': return 60; // 1 minute
        case 'impossible': return 50; // 50 seconds
        default: return 600; // 10 minutes
    }
}

// Sorting Game Implementation
function resetSortingGame() {
    gameState.sorting.points = 0;
    document.getElementById('sorting-points').textContent = '0';
    
    // Enable game interaction
    enableGameInteraction('sorting');
    
    // Start timer
    startGameTimer('sorting');
    
    const itemsContainer = document.getElementById('sorting-items');
    itemsContainer.innerHTML = '';
    
    // Generate waste items based on difficulty
    const itemCount = getDifficultyItemCount(gameState.sorting.difficulty);
    gameState.sorting.items = generateWasteItems(itemCount);
    
    // Create draggable items
    gameState.sorting.items.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'waste-item';
        itemElement.draggable = true;
        itemElement.innerHTML = `
            <span class="waste-icon">${item.icon}</span>
            <span class="waste-name">${item.name}</span>
        `;
        itemElement.dataset.itemType = item.type;
        itemElement.dataset.itemId = index;
        
        // Add drag events
        itemElement.addEventListener('dragstart', handleDragStart);
        itemElement.addEventListener('dragend', handleDragEnd);
        
        itemsContainer.appendChild(itemElement);
    });
    
    // Setup bins
    const bins = document.querySelectorAll('.bin');
    bins.forEach(bin => {
        bin.addEventListener('dragover', handleDragOver);
        bin.addEventListener('dragenter', handleDragEnter);
        bin.addEventListener('dragleave', handleDragLeave);
        bin.addEventListener('drop', handleDrop);
    });
}

function getDifficultyItemCount(difficulty) {
    switch(difficulty) {
        case 'easy': return 4;
        case 'normal': return 6;
        case 'hard': return 8;
        case 'nightmare': return 12;
        case 'impossible': return 16;
        default: return 4;
    }
}

function generateWasteItems(count) {
    const items = [];
    const types = ['recyclable', 'organic', 'hazardous', 'general'];
    
    for (let i = 0; i < count; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const itemOptions = wasteItems[type];
        const item = itemOptions[Math.floor(Math.random() * itemOptions.length)];
        items.push({
            ...item,
            type: type
        });
    }
    
    return items;
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.itemId);
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

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
    
    const itemId = e.dataTransfer.getData('text/plain');
    const itemElement = document.querySelector(`[data-item-id="${itemId}"]`);
    const itemType = itemElement.dataset.itemType;
    const binType = e.target.dataset.binType;
    
    // Check if item was dropped in correct bin
    if (itemType === binType) {
        // Correct bin - add points
        const points = getDifficultyPoints(gameState.sorting.difficulty);
        gameState.sorting.points += points;
        document.getElementById('sorting-points').textContent = gameState.sorting.points;
        
        // Update total points
        rewardsState.totalPoints += points;
        saveRewardsState();
        updateRewardsDisplay();
        
        // Show success notification
        showNotification(`Correct! +${points} points`);
        
        // Remove item
        itemElement.remove();
        
        // Check if game is complete
        if (document.querySelectorAll('.waste-item').length === 0) {
            clearInterval(gameState.sorting.timer);
            showNotification(`Game complete! Total points: ${gameState.sorting.points}`);
        }
    } else {
        // Wrong bin - show notification
        showNotification('Wrong bin! Try again.');
    }
}

// Matching Game Implementation
function resetMatchingGame() {
    gameState.matching.points = 0;
    gameState.matching.flippedCards = [];
    gameState.matching.matchedPairs = 0;
    document.getElementById('matching-points').textContent = '0';
    
    // Enable game interaction
    enableGameInteraction('matching');
    
    // Start timer
    startGameTimer('matching');
    
    const board = document.getElementById('matching-board');
    board.innerHTML = '';
    
    // Generate cards based on difficulty
    const pairCount = getDifficultyPairCount(gameState.matching.difficulty);
    gameState.matching.cards = generateMatchingCards(pairCount);
    
    // Create card elements
    gameState.matching.cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'matching-card';
        cardElement.innerHTML = `
            <div class="card-front">${card.icon}</div>
            <div class="card-back">❓</div>
        `;
        cardElement.dataset.cardType = card.type;
        cardElement.dataset.cardId = index;
        cardElement.dataset.cardName = card.name;
        
        cardElement.addEventListener('click', () => flipMatchingCard(cardElement));
        board.appendChild(cardElement);
    });
}

function getDifficultyPairCount(difficulty) {
    switch(difficulty) {
        case 'easy': return 4;
        case 'normal': return 5;
        case 'hard': return 6;
        case 'nightmare': return 8;
        case 'impossible': return 10;
        default: return 4;
    }
}

function generateMatchingCards(pairCount) {
    const cards = [];
    const types = ['recyclable', 'organic', 'hazardous', 'general'];
    
    for (let i = 0; i < pairCount; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const itemOptions = wasteItems[type];
        const item = itemOptions[Math.floor(Math.random() * itemOptions.length)];
        
        // Add two cards for each pair
        cards.push({...item, type: type});
        cards.push({...item, type: type});
    }
    
    // Shuffle cards
    return shuffleArray(cards);
}

function flipMatchingCard(cardElement) {
    // Prevent flipping if already matched or two cards are already flipped
    if (cardElement.classList.contains('matched') || 
        gameState.matching.flippedCards.length >= 2 ||
        gameState.matching.flippedCards.includes(cardElement)) {
        return;
    }
    
    // Flip the card
    cardElement.classList.add('flipped');
    gameState.matching.flippedCards.push(cardElement);
    
    // Check for match when two cards are flipped
    if (gameState.matching.flippedCards.length === 2) {
        const [card1, card2] = gameState.matching.flippedCards;
        
        if (card1.dataset.cardType === card2.dataset.cardType &&
            card1.dataset.cardName === card2.dataset.cardName) {
            // Match found
            setTimeout(() => {
                card1.classList.add('matched');
                card2.classList.add('matched');
                
                // Add points
                const points = getDifficultyPoints(gameState.matching.difficulty) * 2;
                gameState.matching.points += points;
                document.getElementById('matching-points').textContent = gameState.matching.points;
                
                // Update total points
                rewardsState.totalPoints += points;
                saveRewardsState();
                updateRewardsDisplay();
                
                // Show notification
                showNotification(`Match found! +${points} points`);
                
                // Reset flipped cards
                gameState.matching.flippedCards = [];
                gameState.matching.matchedPairs++;
                
                // Check if game is complete
                const totalPairs = getDifficultyPairCount(gameState.matching.difficulty);
                if (gameState.matching.matchedPairs === totalPairs) {
                    clearInterval(gameState.matching.timer);
                    showNotification(`Game complete! Total points: ${gameState.matching.points}`);
                }
            }, 1000);
        } else {
            // No match
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                gameState.matching.flippedCards = [];
                showNotification('No match! Try again.');
            }, 1000);
        }
    }
}

// Memory Game Implementation
function resetMemoryGame() {
    gameState.memory.points = 0;
    gameState.memory.flippedCards = [];
    gameState.memory.matchedPairs = 0;
    gameState.memory.moves = 0;
    document.getElementById('memory-points').textContent = '0';
    
    // Enable game interaction
    enableGameInteraction('memory');
    
    // Start timer
    startGameTimer('memory');
    
    const board = document.getElementById('memory-board');
    board.innerHTML = '';
    
    // Generate cards based on difficulty
    const pairCount = getDifficultyPairCount(gameState.memory.difficulty);
    gameState.memory.cards = generateMemoryCards(pairCount);
    
    // Create card elements
    gameState.memory.cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'memory-card';
        cardElement.innerHTML = `
            <div class="card-front">${card.icon}</div>
            <div class="card-back">❓</div>
        `;
        cardElement.dataset.cardId = index;
        cardElement.dataset.cardValue = card.value;
        
        cardElement.addEventListener('click', () => flipMemoryCard(cardElement));
        board.appendChild(cardElement);
    });
}

function generateMemoryCards(pairCount) {
    const cards = [];
    const values = [];
    
    // Create pairs of values
    for (let i = 1; i <= pairCount; i++) {
        values.push(i);
        values.push(i);
    }
    
    // Create card objects with values and icons
    values.forEach((value, index) => {
        cards.push({
            value: value,
            icon: getMemoryCardIcon(value)
        });
    });
    
    // Shuffle cards
    return shuffleArray(cards);
}

function getMemoryCardIcon(value) {
    const icons = ['♻️', '🌱', '⚠️', '🗑️', '🍎', '🥥', '📦', '🔋', '📱', '🧴'];
    return icons[value - 1] || '❓';
}

function flipMemoryCard(cardElement) {
    // Prevent flipping if already matched or two cards are already flipped
    if (cardElement.classList.contains('matched') || 
        gameState.memory.flippedCards.length >= 2 ||
        gameState.memory.flippedCards.includes(cardElement)) {
        return;
    }
    
    // Flip the card
    cardElement.classList.add('flipped');
    gameState.memory.flippedCards.push(cardElement);
    gameState.memory.moves++;
    
    // Check for match when two cards are flipped
    if (gameState.memory.flippedCards.length === 2) {
        const [card1, card2] = gameState.memory.flippedCards;
        
        if (card1.dataset.cardValue === card2.dataset.cardValue) {
            // Match found
            setTimeout(() => {
                card1.classList.add('matched');
                card2.classList.add('matched');
                
                // Add points (more points for fewer moves)
                const points = Math.max(10, getDifficultyPoints(gameState.memory.difficulty) - (gameState.memory.moves * 0.5));
                gameState.memory.points += Math.floor(points);
                document.getElementById('memory-points').textContent = gameState.memory.points;
                
                // Update total points
                rewardsState.totalPoints += Math.floor(points);
                saveRewardsState();
                updateRewardsDisplay();
                
                // Show notification
                showNotification(`Match found! +${Math.floor(points)} points`);
                
                // Reset flipped cards
                gameState.memory.flippedCards = [];
                gameState.memory.matchedPairs++;
                
                // Check if game is complete
                const totalPairs = getDifficultyPairCount(gameState.memory.difficulty);
                if (gameState.memory.matchedPairs === totalPairs) {
                    clearInterval(gameState.memory.timer);
                    showNotification(`Game complete! Total points: ${gameState.memory.points}`);
                }
            }, 1000);
        } else {
            // No match
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                gameState.memory.flippedCards = [];
                showNotification('No match! Try again.');
            }, 1000);
        }
    }
}

// Helper function to get points based on difficulty
function getDifficultyPoints(difficulty) {
    switch(difficulty) {
        case 'easy': return 10;
        case 'normal': return 15;
        case 'hard': return 20;
        case 'nightmare': return 30;
        case 'impossible': return 50;
        default: return 10;
    }
}

// Helper function to shuffle array
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Eco Rewards System Implementation
function loadRewardsState() {
    const saved = localStorage.getItem('ecotrack-rewards');
    if (saved) {
        try {
            rewardsState = JSON.parse(saved);
        } catch (error) {
            console.error('Error loading rewards state:', error);
        }
    }
}

function saveRewardsState() {
    localStorage.setItem('ecotrack-rewards', JSON.stringify(rewardsState));
}

function updateRewardsDisplay() {
    // Update rewards status
    Object.entries(rewardsState.rewards).forEach(([id, reward]) => {
        const rewardCard = document.querySelector(`[data-reward-id="${id}"]`);
        if (rewardCard) {
            const statusElement = rewardCard.querySelector('.reward-status');
            if (reward.earned) {
                statusElement.textContent = 'Earned!';
                statusElement.className = 'reward-status earned';
            } else {
                statusElement.textContent = 'Locked';
                statusElement.className = 'reward-status locked';
            }
        }
    });
    
    // Check for reward completion
    checkRewardsCompletion();
}

function checkRewardsCompletion() {
    Object.entries(rewardsState.rewards).forEach(([id, reward]) => {
        if (!reward.earned) {
            let rewardEarned = false;
            
            switch(reward.game) {
                case 'total':
                    rewardEarned = rewardsState.totalPoints >= reward.pointsRequired;
                    break;
                case 'nightmare':
                    // Check if all games have been completed on nightmare difficulty
                    rewardEarned = (gameState.sorting.difficulty === 'nightmare' && gameState.sorting.points > 0) &&
                                   (gameState.matching.difficulty === 'nightmare' && gameState.matching.points > 0) &&
                                   (gameState.memory.difficulty === 'nightmare' && gameState.memory.points > 0);
                    break;
                default:
                    // Check if specific game points meet requirement
                    if (gameState[reward.game]) {
                        rewardEarned = gameState[reward.game].points >= reward.pointsRequired;
                    }
                    break;
            }
            
            if (rewardEarned) {
                rewardsState.rewards[id].earned = true;
                showNotification(`🏆 Reward earned: ${reward.name}!`);
                saveRewardsState();
                updateRewardsDisplay();
            }
        }
    });
}
// ===================================
// AUDIO CONTROLS
// ===================================

// Get audio element
const backgroundAudio = document.getElementById('background-audio');
const autoplayToggle = document.getElementById('autoplay-toggle');
const volumeSlider = document.getElementById('volume-slider');
const volumeValue = document.getElementById('volume-value');
const testAudioBtn = document.getElementById('test-audio-btn');

// Load saved settings
function loadAudioSettings() {
    const savedAutoplay = localStorage.getItem('audioAutoplay');
    const savedVolume = localStorage.getItem('audioVolume');
    
    if (savedAutoplay !== null) {
        autoplayToggle.checked = savedAutoplay === 'true';
    }
    
    if (savedVolume !== null) {
        const volume = parseInt(savedVolume);
        volumeSlider.value = volume;
        volumeValue.textContent = volume + '%';
        if (backgroundAudio) {
            backgroundAudio.volume = volume / 100;
        }
    } else {
        // Default volume
        if (backgroundAudio) {
            backgroundAudio.volume = 0.7;
        }
    }
    
    // Handle autoplay
    if (autoplayToggle.checked && backgroundAudio) {
        // Try to play, handle autoplay restrictions
        const playPromise = backgroundAudio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Autoplay prevented:', error);
            });
        }
    }
}

// Autoplay toggle
if (autoplayToggle) {
    autoplayToggle.addEventListener('change', function() {
        localStorage.setItem('audioAutoplay', this.checked);
        
        if (backgroundAudio) {
            if (this.checked) {
                backgroundAudio.play().catch(error => {
                    console.log('Play prevented:', error);
                });
            } else {
                backgroundAudio.pause();
            }
        }
    });
}

// Volume slider
if (volumeSlider) {
    volumeSlider.addEventListener('input', function() {
        const volume = this.value;
        volumeValue.textContent = volume + '%';
        localStorage.setItem('audioVolume', volume);
        
        if (backgroundAudio) {
            backgroundAudio.volume = volume / 100;
        }
        
        // Update slider background
        const percentage = (volume / 100) * 100;
        this.style.background = `linear-gradient(to right, var(--primary) 0%, var(--primary) ${percentage}%, #ddd ${percentage}%, #ddd 100%)`;
    });
}

// Test audio button
if (testAudioBtn) {
    testAudioBtn.addEventListener('click', function() {
        if (backgroundAudio) {
            if (backgroundAudio.paused) {
                backgroundAudio.play().catch(error => {
                    alert('Unable to play audio. Please check your browser settings.');
                });
                this.textContent = '⏸️ Pause Audio';
            } else {
                backgroundAudio.pause();
                this.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"></path></svg> Test Audio';
            }
        }
    });
}

// Initialize audio settings on page load
loadAudioSettings();

// ===================================
// ENHANCED CALCULATOR WITH NEW CATEGORIES
// ===================================

const calculateBtn = document.getElementById('calculate-btn');
const wasteFrequency = document.getElementById('waste-frequency');
const wasteAmount = document.getElementById('waste-amount');
const wasteCategory = document.getElementById('waste-category');

// Category information
const categoryInfo = {
    biodegradable: {
        name: 'Biodegradable',
        decompositionTime: '2-8 weeks',
        examples: 'Food scraps, yard waste, paper products, natural fibers',
        impact: 'Low environmental impact - breaks down naturally and can be composted',
        tips: 'Compost at home to reduce landfill waste and create nutrient-rich soil',
        color: '#22c55e'
    },
    'non-biodegradable': {
        name: 'Non-Biodegradable',
        decompositionTime: '100-1000+ years',
        examples: 'Plastics, metals, glass, synthetic materials',
        impact: 'High environmental impact - persists in environment for centuries',
        tips: 'Recycle whenever possible and reduce usage of single-use items',
        color: '#ef4444'
    }
};

if (calculateBtn) {
    calculateBtn.addEventListener('click', function() {
        const frequency = parseFloat(wasteFrequency.value) || 0;
        const amount = parseFloat(wasteAmount.value) || 0;
        const category = wasteCategory.value;
        
        if (frequency > 0 && amount > 0) {
            // Calculate waste amounts
            const dailyWaste = (frequency * amount) / 7;
            const weeklyWaste = frequency * amount;
            const monthlyWaste = weeklyWaste * 4.33;
            const yearlyWaste = weeklyWaste * 52;
            
            // Update results
            document.getElementById('daily-waste-result').textContent = dailyWaste.toFixed(2) + ' kg';
            document.getElementById('weekly-waste-result').textContent = weeklyWaste.toFixed(2) + ' kg';
            document.getElementById('monthly-waste-result').textContent = monthlyWaste.toFixed(2) + ' kg';
            document.getElementById('yearly-waste-result').textContent = yearlyWaste.toFixed(2) + ' kg';
            
            // Update category impact
            const categoryData = categoryInfo[category];
            if (categoryData) {
                const impactText = `
                    <strong>${categoryData.name}</strong><br>
                    <small>Decomposition: ${categoryData.decompositionTime}</small><br>
                    <small>${categoryData.impact}</small>
                `;
                document.getElementById('category-impact-result').innerHTML = impactText;
            }
            
            // Show notification
            showNotification(`Calculation complete! Your yearly ${categoryData.name.toLowerCase()} waste: ${yearlyWaste.toFixed(2)} kg`, 'success');
        } else {
            showNotification('Please enter valid values for frequency and amount', 'error');
        }
    });
}

// Auto-calculate on input change
if (wasteFrequency && wasteAmount && wasteCategory) {
    [wasteFrequency, wasteAmount, wasteCategory].forEach(element => {
        element.addEventListener('change', function() {
            if (calculateBtn) {
                calculateBtn.click();
            }
        });
    });
}