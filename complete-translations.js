// Complete Filipino Translation System
class CompleteTranslator {
    constructor() {
        this.translations = {
            fil: {
                // Navigation
                'nav.home': 'Tahanan',
                'nav.info': 'Impormasyon',
                'nav.games': 'Mga Laro',
                'nav.tracker': 'Tracker',
                'nav.about': 'Tungkol',
                'nav.settings': 'Mga Setting',

                // Section Headers
                'waste-information-section': '🌈 Mga Gabay sa Pagtatapon ng Basura para sa mga Bata 🌈',
                'games-section': '🌈 Mga Eco-Friendly na Laro para sa mga Bata 🌈',
                'tracker-section': '🌱 Mga Tracker ng Basura para sa mga Bata 🌱',
                'settings-section': '⚙️ Mga Setting ⚙️',

                // Calculator
                'waste-frequency-label': 'Ilan beses sa isang linggo mo itatapon ang basura?',
                'waste-amount-label': 'Gaano karami ang basura bawat pagkakataon (sa kg)?',
                'waste-category-label': 'Anong uri ng basura?',
                'calculate-button': '🔢 Kalkulahin ang Aking Basura! 🚀',
                'calculator-results': '🌍 Ang Iyong Mga Resulta ng Basura 🌍',
                'daily-waste': '📅 Araw-araw na Basura:',
                'weekly-waste': '📆 Lingguhang Basura:',
                'monthly-waste': '📅 Buwanang Basura:',
                'yearly-waste': '📊 Taunang Basura:',
                'category-impact': '🌱 Epekto ng Kategorya:',

                // Calculator History
                'calculator-history': '📚 Kasaysayan ng Kalkulator 📚',
                'no-calculations': 'Wala pang kalkulasyon. Magsimula sa pagkalkula ng iyong basura!',
                'clear-history': 'Burahin ang Lahat ng Kasaysayan',
                'confirm-clear': 'Sigurado ka ba na buburahin mo ang lahat ng kasaysayan ng kalkulator? 🗑️',
                'history-cleared': 'Natanggal ang kasaysayan ng kalkulator! 🎉',

                // Category Options
                'biodegradable-option': '🌱 Biodegradable (Pagkain, Papel)',
                'non-biodegradable-option': '🗑️ Non-Biodegradable (Plastik, Metal)',

                // Placeholders
                'frequency-placeholder': 'Ilagay ang bilang sa bawat linggo',
                'amount-placeholder': 'Ilagay ang halaga sa kg'
            },
            en: {
                // Navigation
                'nav.home': 'Home',
                'nav.info': 'Info',
                'nav.games': 'Games',
                'nav.tracker': 'Tracker',
                'nav.about': 'About',
                'nav.settings': 'Settings',

                // Section Headers
                'waste-information-section': '🌈 Kids Waste Disposal Guide 🌈',
                'games-section': '🌈 Kids Eco-Friendly Games 🌈',
                'tracker-section': '🌱 Kids Waste Tracker 🌱',
                'settings-section': '⚙️ Settings ⚙️',

                // Calculator
                'waste-frequency-label': 'How many times per week do you dispose waste?',
                'waste-amount-label': 'How much waste each time (in kg)?',
                'waste-category-label': 'What type of waste?',
                'calculate-button': '🔢 Calculate My Waste! 🚀',
                'calculator-results': '🌍 Your Waste Results 🌍',
                'daily-waste': '📅 Daily Waste:',
                'weekly-waste': '📆 Weekly Waste:',
                'monthly-waste': '📅 Monthly Waste:',
                'yearly-waste': '📊 Yearly Waste:',
                'category-impact': '🌱 Category Impact:',

                // Calculator History
                'calculator-history': '📚 Calculator History 📚',
                'no-calculations': 'No calculations yet. Start calculating your waste!',
                'clear-history': 'Clear All History',
                'confirm-clear': 'Are you sure you want to clear all calculator history? 🗑️',
                'history-cleared': 'Calculator history cleared! 🎉',

                // Category Options
                'biodegradable-option': '🌱 Biodegradable (Food, Paper)',
                'non-biodegradable-option': '🗑️ Non-Biodegradable (Plastic, Metal)',

                // Placeholders
                'frequency-placeholder': 'Enter times per week',
                'amount-placeholder': 'Enter amount in kg'
            }
        };
        
        this.currentLanguage = 'en';
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
        this.applyTranslations();
    }

    translate(key) {
        return this.translations[this.currentLanguage][key] || key;
    }

    applyTranslations() {
        // Update section headers
        Object.entries(this.translations[this.currentLanguage]).forEach(([key, value]) => {
            if (key.includes('-section')) {
                const section = document.getElementById(key);
                if (section) {
                    const header = section.querySelector('.section-header h2');
                    if (header && !header.hasAttribute('data-key')) {
                        header.textContent = value;
                    }
                }
            }
        });

        // Update calculator labels
        const labelUpdates = {
            'waste-frequency-label': 'label[for="waste-frequency"]',
            'waste-amount-label': 'label[for="waste-amount"]',
            'waste-category-label': 'label[for="waste-category"]'
        };

        Object.entries(labelUpdates).forEach(([key, selector]) => {
            const element = document.querySelector(selector);
            if (element) {
                element.textContent = this.translate(key);
            }
        });

        // Update button
        const calculateBtn = document.getElementById('calculate-waste-btn');
        if (calculateBtn) {
            calculateBtn.innerHTML = `<span>${this.translate('calculate-button')}</span>`;
        }

        // Update results header
        const resultsHeader = document.querySelector('.calculator-results h4');
        if (resultsHeader) {
            resultsHeader.innerHTML = this.translate('calculator-results');
        }

        // Update result labels
        const resultLabels = {
            'daily-waste': 'daily-waste-result',
            'weekly-waste': 'weekly-waste-result',
            'monthly-waste': 'monthly-waste-result',
            'yearly-waste': 'yearly-waste-result',
            'category-impact': 'category-impact-result'
        };

        Object.entries(resultLabels).forEach(([key, id]) => {
            const resultElement = document.getElementById(id);
            if (resultElement) {
                const labelElement = resultElement.parentElement.querySelector('span:first-child');
                if (labelElement) {
                    labelElement.textContent = this.translate(key);
                }
            }
        });

        // Update calculator history
        const historySection = document.querySelector('.calculator-history-section');
        if (historySection) {
            const historyHeader = historySection.querySelector('h3');
            if (historyHeader) {
                historyHeader.textContent = this.translate('calculator-history');
            }
        }

        // Update category options
        const categorySelect = document.getElementById('waste-category');
        if (categorySelect) {
            const options = categorySelect.querySelectorAll('option');
            if (options[0]) options[0].textContent = this.translate('biodegradable-option');
            if (options[1]) options[1].textContent = this.translate('non-biodegradable-option');
        }

        // Update placeholders
        const frequencyInput = document.getElementById('waste-frequency');
        const amountInput = document.getElementById('waste-amount');
        
        if (frequencyInput) {
            frequencyInput.placeholder = this.translate('frequency-placeholder');
        }
        if (amountInput) {
            amountInput.placeholder = this.translate('amount-placeholder');
        }
    }
}

// Initialize and integrate with existing language system
document.addEventListener('DOMContentLoaded', () => {
    window.completeTranslator = new CompleteTranslator();
    
    // Override the existing updateLanguage function
    const originalUpdateLanguage = window.updateLanguage;
    window.updateLanguage = function() {
        // Call original function first
        if (originalUpdateLanguage) {
            originalUpdateLanguage();
        }
        
        // Then apply complete translations
        const currentLang = window.currentLanguage || 'en';
        window.completeTranslator.setLanguage(currentLang);
    };
    
    // Apply translations immediately if language is already set
    if (window.currentLanguage) {
        window.completeTranslator.setLanguage(window.currentLanguage);
    }
});