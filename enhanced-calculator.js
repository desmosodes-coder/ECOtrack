// Enhanced Calculator with Complete History Functionality
class EnhancedWasteCalculator {
    constructor() {
        this.history = [];
        this.initializeElements();
        this.bindEvents();
        this.loadHistory();
        this.addMissingElements();
    }

    initializeElements() {
        // Try to get existing elements or add them
        this.frequencyInput = document.getElementById('waste-frequency');
        this.amountInput = document.getElementById('waste-amount');
        this.categoryInput = document.getElementById('waste-category');
        this.calculateBtn = document.getElementById('calculate-waste-btn') || document.getElementById('calculate-btn');
        this.dailyResult = document.getElementById('daily-waste-result');
        this.weeklyResult = document.getElementById('weekly-waste-result');
        this.monthlyResult = document.getElementById('monthly-waste-result');
        this.yearlyResult = document.getElementById('yearly-waste-result');
        this.categoryResult = document.getElementById('category-impact-result');
        
        // History elements
        this.historyContainer = document.getElementById('calculator-history');
        this.clearHistoryBtn = document.getElementById('clear-calculator-history');
    }

    addMissingElements() {
        // Add frequency input if missing
        if (!this.frequencyInput) {
            const amountGroup = document.querySelector('label[for="waste-amount"]')?.parentElement;
            if (amountGroup) {
                const frequencyGroup = document.createElement('div');
                frequencyGroup.className = 'input-group';
                frequencyGroup.innerHTML = `
                    <label for="waste-frequency">How many times per week do you dispose waste?</label>
                    <input type="number" id="waste-frequency" min="1" value="7" placeholder="Enter times per week">
                `;
                amountGroup.parentElement.insertBefore(frequencyGroup, amountGroup);
                this.frequencyInput = document.getElementById('waste-frequency');
            }
        }

        // Update button if needed
        if (this.calculateBtn && this.calculateBtn.id === 'calculate-btn') {
            this.calculateBtn.id = 'calculate-waste-btn';
            this.calculateBtn.innerHTML = '<span>🔢 Calculate My Waste! 🚀</span>';
        }

        // Add history section if missing
        if (!this.historyContainer) {
            const calculatorSection = document.querySelector('.calculator-results')?.parentElement;
            if (calculatorSection) {
                const historySection = document.createElement('div');
                historySection.className = 'calculator-history-section';
                historySection.innerHTML = `
                    <h3>📚 Calculator History 📚</h3>
                    <div id="calculator-history" class="calculator-history-container">
                        <div class="empty-calculator-history">
                            <span class="empty-icon">🧮</span>
                            <p>No calculations yet. Start calculating your waste!</p>
                        </div>
                    </div>
                    <button id="clear-calculator-history" class="clear-button" style="display: none;">
                        <span class="btn-icon">🗑️</span>
                        Clear All History
                    </button>
                `;
                calculatorSection.parentElement.appendChild(historySection);
                this.historyContainer = document.getElementById('calculator-history');
                this.clearHistoryBtn = document.getElementById('clear-calculator-history');
            }
        }

        // Update labels to be more kid-friendly
        if (this.amountInput) {
            const amountLabel = document.querySelector('label[for="waste-amount"]');
            if (amountLabel && amountLabel.textContent.includes('Average amount')) {
                amountLabel.textContent = 'How much waste each time (in kg)?';
                this.amountInput.placeholder = 'Enter amount in kg';
                this.amountInput.value = '5';
            }
        }

        if (this.categoryInput) {
            const categoryLabel = document.querySelector('label[for="waste-category"]');
            if (categoryLabel) {
                categoryLabel.textContent = 'What type of waste?';
            }
            // Update options
            const options = this.categoryInput.querySelectorAll('option');
            if (options[0]) options[0].textContent = '🌱 Biodegradable (Food, Paper)';
            if (options[1]) options[1].textContent = '🗑️ Non-Biodegradable (Plastic, Metal)';
        }

        // Update results headers
        const resultsHeader = document.querySelector('.calculator-results h4');
        if (resultsHeader && resultsHeader.textContent === 'Estimation Results') {
            resultsHeader.innerHTML = '🌍 Your Waste Results 🌍';
        }

        // Update result labels
        this.updateResultLabels();
    }

    updateResultLabels() {
        const resultUpdates = {
            'daily-waste-result': '📅 Daily Waste:',
            'weekly-waste-result': '📆 Weekly Waste:',
            'monthly-waste-result': '📅 Monthly Waste:',
            'yearly-waste-result': '📊 Yearly Waste:',
            'category-impact-result': '🌱 Category Impact:'
        };

        Object.entries(resultUpdates).forEach(([id, label]) => {
            const resultElement = document.getElementById(id);
            if (resultElement) {
                const labelElement = resultElement.parentElement.querySelector('span:first-child');
                if (labelElement && !labelElement.textContent.includes('📅')) {
                    labelElement.textContent = label;
                }
            }
        });
    }

    bindEvents() {
        // Bind calculate button
        if (this.calculateBtn) {
            this.calculateBtn.addEventListener('click', () => this.calculate());
        }

        // Bind clear history button
        if (this.clearHistoryBtn) {
            this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        }

        // Auto-calculate on input change
        const inputs = [this.frequencyInput, this.amountInput, this.categoryInput];
        inputs.forEach(input => {
            if (input) {
                input.addEventListener('input', () => this.calculate());
                if (input.tagName === 'SELECT') {
                    input.addEventListener('change', () => this.calculate());
                }
            }
        });
    }

    calculate() {
        const frequency = parseFloat(this.frequencyInput?.value) || 0;
        const amount = parseFloat(this.amountInput?.value) || 0;
        const category = this.categoryInput?.value || 'biodegradable';

        if (frequency > 0 && amount > 0) {
            // Calculate waste amounts
            const dailyWaste = (frequency * amount) / 7;
            const weeklyWaste = frequency * amount;
            const monthlyWaste = weeklyWaste * 4.33;
            const yearlyWaste = weeklyWaste * 52;

            // Update results display
            if (this.dailyResult) this.dailyResult.textContent = dailyWaste.toFixed(2) + ' kg';
            if (this.weeklyResult) this.weeklyResult.textContent = weeklyWaste.toFixed(2) + ' kg';
            if (this.monthlyResult) this.monthlyResult.textContent = monthlyWaste.toFixed(2) + ' kg';
            if (this.yearlyResult) this.yearlyResult.textContent = yearlyWaste.toFixed(2) + ' kg';

            // Update category impact
            const categoryData = this.getCategoryInfo(category);
            if (this.categoryResult && categoryData) {
                const impactText = `
                    <strong>${categoryData.name}</strong><br>
                    <small>Decomposition: ${categoryData.decompositionTime}</small><br>
                    <small>${categoryData.impact}</small>
                `;
                this.categoryResult.innerHTML = impactText;
            }

            // Add to history
            this.addToHistory({
                frequency,
                amount,
                category,
                dailyWaste,
                weeklyWaste,
                monthlyWaste,
                yearlyWaste,
                timestamp: new Date().toISOString()
            });

            // Show success animation
            this.showSuccessAnimation();
        }
    }

    getCategoryInfo(category) {
        const categories = {
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
        return categories[category];
    }

    addToHistory(entry) {
        entry.id = Date.now();
        this.history.unshift(entry);
        this.saveHistory();
        this.displayHistory();
    }

    displayHistory() {
        if (!this.historyContainer) return;

        if (this.history.length === 0) {
            this.historyContainer.innerHTML = `
                <div class="empty-calculator-history">
                    <span class="empty-icon">🧮</span>
                    <p>No calculations yet. Start calculating your waste!</p>
                </div>
            `;
            if (this.clearHistoryBtn) {
                this.clearHistoryBtn.style.display = 'none';
            }
        } else {
            this.historyContainer.innerHTML = '';
            if (this.clearHistoryBtn) {
                this.clearHistoryBtn.style.display = 'inline-flex';
            }

            this.history.forEach(entry => {
                const historyItem = document.createElement('div');
                historyItem.className = 'calculator-history-item';

                const date = new Date(entry.timestamp);
                const formattedDate = date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                const categoryData = this.getCategoryInfo(entry.category);
                const categoryEmoji = entry.category === 'biodegradable' ? '🌱' : '🗑️';

                historyItem.innerHTML = `
                    <div class="calc-history-content">
                        <div class="calc-history-header">
                            <span class="calc-category">${categoryEmoji} ${categoryData.name}</span>
                            <span class="calc-date">${formattedDate}</span>
                        </div>
                        <div class="calc-history-details">
                            <div class="calc-params">
                                <span>${entry.frequency}x/week × ${entry.amount}kg</span>
                            </div>
                            <div class="calc-results">
                                <span class="calc-yearly">${entry.yearlyWaste.toFixed(1)} kg/year</span>
                            </div>
                        </div>
                    </div>
                    <button class="calc-history-delete" data-history-id="${entry.id}">🗑️</button>
                `;

                this.historyContainer.appendChild(historyItem);

                // Add delete event
                historyItem.querySelector('.calc-history-delete').addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.removeFromHistory(entry.id);
                });
            });
        }
    }

    removeFromHistory(historyId) {
        this.history = this.history.filter(entry => entry.id !== historyId);
        this.saveHistory();
        this.displayHistory();
    }

    clearHistory() {
        if (confirm('Are you sure you want to clear all calculator history? 🗑️')) {
            this.history = [];
            this.saveHistory();
            this.displayHistory();
            
            // Show confirmation animation
            this.showNotification('Calculator history cleared! 🎉');
        }
    }

    saveHistory() {
        localStorage.setItem('enhancedWasteCalculatorHistory', JSON.stringify(this.history));
    }

    loadHistory() {
        const saved = localStorage.getItem('enhancedWasteCalculatorHistory');
        if (saved) {
            try {
                this.history = JSON.parse(saved);
                this.displayHistory();
            } catch (e) {
                console.error('Error loading calculator history:', e);
                this.history = [];
            }
        }
    }

    showSuccessAnimation() {
        // Create floating confetti animation
        const container = document.querySelector('.calculator-results');
        if (!container) return;

        const emojis = ['🎉', '✨', '🌟', '🎊', '🦄'];
        
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const emoji = document.createElement('div');
                emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                emoji.style.cssText = `
                    position: absolute;
                    font-size: 1.5em;
                    left: ${Math.random() * 100}%;
                    top: 100%;
                    animation: floatUp 2s ease-out forwards;
                    pointer-events: none;
                    z-index: 1000;
                `;
                container.style.position = 'relative';
                container.appendChild(emoji);
                
                setTimeout(() => emoji.remove(), 2000);
            }, i * 100);
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #4ecdc4, #44a3aa);
            color: white;
            padding: 20px 40px;
            border-radius: 20px;
            font-size: 1.2em;
            font-weight: bold;
            z-index: 10000;
            animation: fadeInOut 2s ease forwards;
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    }
}

// Add required CSS animations
const calculatorStyles = document.createElement('style');
calculatorStyles.textContent = `
    .calculator-history-item {
        background: white;
        border-radius: 15px;
        padding: 15px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 15px;
        transition: all 0.3s ease;
        box-shadow: 0 3px 10px rgba(0,0,0,0.1);
    }

    .calculator-history-item:hover {
        transform: translateX(5px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }

    .calc-history-content {
        flex: 1;
    }

    .calc-history-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
    }

    .calc-category {
        font-weight: bold;
        color: #2c3e50;
        font-size: 1.1em;
    }

    .calc-date {
        color: #7f8c8d;
        font-size: 0.9em;
    }

    .calc-history-details {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .calc-params {
        color: #7f8c8d;
        font-size: 0.9em;
    }

    .calc-results {
        font-weight: bold;
        color: #4ecdc4;
    }

    .calc-yearly {
        font-size: 1.1em;
    }

    .calc-history-delete {
        background: #ff6b6b;
        color: white;
        border: none;
        border-radius: 10px;
        padding: 8px 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 1em;
    }

    .calc-history-delete:hover {
        background: #ff5252;
        transform: scale(1.1);
    }

    .empty-calculator-history {
        text-align: center;
        padding: 40px;
        color: #7f8c8d;
        font-size: 1.1em;
    }

    .empty-calculator-history .empty-icon {
        font-size: 3em;
        display: block;
        margin-bottom: 15px;
    }

    .calculator-history-section {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 30px;
        border-radius: 20px;
        margin-top: 30px;
        box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
    }

    .calculator-history-section h3 {
        color: white;
        text-align: center;
        font-size: 1.8em;
        margin-bottom: 25px;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }

    .calculator-history-container {
        min-height: 200px;
        margin-bottom: 20px;
    }

    @keyframes floatUp {
        to {
            transform: translateY(-100px);
            opacity: 0;
        }
    }

    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
`;
document.head.appendChild(calculatorStyles);

// Initialize the enhanced calculator
document.addEventListener('DOMContentLoaded', () => {
    window.enhancedCalculator = new EnhancedWasteCalculator();
});