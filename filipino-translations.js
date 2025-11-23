// Complete Filipino translations for ECOTrack

const filipinoTranslations = {
    // Navigation
    'nav.home': 'Tahanan',
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

    // Games section
    'games.title': 'Eco-Friendly na Mga Laro',
    'games.subtitle': 'Matuto habang naglalaro',

    // Tracker section
    'tracker.title': 'Kids Waste Tracker',
    'tracker.subtitle': 'Track your waste and help save the Earth!',

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
};

// Function to apply Filipino translations
function applyFilipinoTranslations() {
    // Update navigation text
    const navItems = document.querySelectorAll('.nav-text');
    const filipinoNavTexts = ['Tahanan', 'Impormasyon', 'Mga Laro', 'Tracker', 'Tungkol', 'Mga Setting'];
    
    navItems.forEach((item, index) => {
        if (filipinoNavTexts[index]) {
            item.textContent = filipinoNavTexts[index];
        }
    });

    // Update elements with data-key attributes
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        if (filipinoTranslations[key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = filipinoTranslations[key];
            } else {
                element.textContent = filipinoTranslations[key];
            }
        }
    });

    // Update specific text content
    const translations = {
        'h2[data-testid="settings-title"]': 'Mga Setting',
        'p[data-testid="settings-subtitle"]': 'I-customize ang iyong ECOTrack experience',
        'h3[data-key="settings.theme.title"]': 'Pumili ng Tema',
        'h3[data-key="settings.language.title"]': 'Wika / Language',
        'h3[data-key="settings.notifications.title"]': 'Mga Abiso',
        'h3[data-key="settings.privacy.title"]': 'Datos at Privacy',
        '.section-header h2': {
            'waste-information-section': '🌈 Kids Waste Disposal Guide 🌈',
            'games-section': '🌈 Kids Eco-Friendly Games 🌈',
            'tracker-section': '🌱 Kids Waste Tracker 🌱'
        }
    };

    // Apply specific translations
    Object.entries(translations).forEach(([selector, text]) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (typeof text === 'string') {
                element.textContent = text;
            } else if (typeof text === 'object') {
                const sectionId = element.closest('section')?.id;
                if (sectionId && text[sectionId]) {
                    element.textContent = text[sectionId];
                }
            }
        });
    });

    // Update button texts
    const buttonTranslations = {
        'button-set-goals': 'Magtakda ng Bagong Mga Layunin',
        'button-configure-notifications': 'I-configure ang Mga Abiso',
        'button-privacy-settings': 'Mga Setting ng Privacy'
    };

    Object.entries(buttonTranslations).forEach(([testId, text]) => {
        const button = document.querySelector(`[data-testid="${testId}"]`);
        if (button) {
            button.textContent = text;
        }
    });
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { filipinoTranslations, applyFilipinoTranslations };
}