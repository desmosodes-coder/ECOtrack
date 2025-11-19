// Kids Waste Tracker JavaScript

class WasteTracker {
    constructor() {
        this.images = [];
        this.history = [];
        this.initializeElements();
        this.bindEvents();
        this.loadHistory();
    }

    initializeElements() {
        // Get DOM elements
        this.dropZone = document.getElementById('drop-zone');
        this.fileInput = document.getElementById('file-input');
        this.imagePreview = document.getElementById('image-preview');
        this.calculateBtn = document.getElementById('calculate-btn');
        this.resultsDisplay = document.getElementById('results-display');
        this.totalItems = document.getElementById('total-items');
        this.earthImpact = document.getElementById('earth-impact');
        this.historyContainer = document.getElementById('history-container');
        this.clearHistoryBtn = document.getElementById('clear-history');
        this.calcInfo = document.querySelector('.calc-info');
    }

    bindEvents() {
        // Drop zone events
        this.dropZone.addEventListener('dragover', this.handleDragOver.bind(this));
        this.dropZone.addEventListener('dragleave', this.handleDragLeave.bind(this));
        this.dropZone.addEventListener('drop', this.handleDrop.bind(this));
        this.dropZone.addEventListener('click', () => this.fileInput.click());
        
        // File input event
        this.fileInput.addEventListener('change', this.handleFileSelect.bind(this));
        
        // Calculate button event
        this.calculateBtn.addEventListener('click', this.calculateWaste.bind(this));
        
        // Clear history button event
        this.clearHistoryBtn.addEventListener('click', this.clearHistory.bind(this));
        
        // Waste type radio buttons
        document.querySelectorAll('input[name="waste-type"]').forEach(radio => {
            radio.addEventListener('change', this.updateWasteTypeSelection.bind(this));
        });
    }

    handleDragOver(e) {
        e.preventDefault();
        this.dropZone.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.dropZone.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        this.dropZone.classList.remove('dragover');
        
        const files = Array.from(e.dataTransfer.files).filter(file => 
            file.type.startsWith('image/')
        );
        
        this.addImages(files);
    }

    handleFileSelect(e) {
        const files = Array.from(e.target.files);
        this.addImages(files);
    }

    addImages(files) {
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = {
                    id: Date.now() + Math.random(),
                    src: e.target.result,
                    name: file.name,
                    type: document.querySelector('input[name="waste-type"]:checked').value,
                    timestamp: new Date().toISOString()
                };
                
                this.images.push(imageData);
                this.displayImage(imageData);
                this.updateCalculateButton();
            };
            reader.readAsDataURL(file);
        });
    }

    displayImage(imageData) {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-preview-item';
        imageItem.dataset.imageId = imageData.id;
        
        imageItem.innerHTML = `
            <img src="${imageData.src}" alt="${imageData.name}">
            <button class="image-remove-btn" data-image-id="${imageData.id}">×</button>
        `;
        
        this.imagePreview.appendChild(imageItem);
        
        // Add remove event
        imageItem.querySelector('.image-remove-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeImage(imageData.id);
        });
    }

    removeImage(imageId) {
        this.images = this.images.filter(img => img.id !== imageId);
        
        const imageElement = document.querySelector(`[data-image-id="${imageId}"]`);
        if (imageElement) {
            imageElement.remove();
        }
        
        this.updateCalculateButton();
    }

    updateCalculateButton() {
        if (this.images.length > 0) {
            this.calculateBtn.disabled = false;
            this.calcInfo.style.display = 'none';
        } else {
            this.calculateBtn.disabled = true;
            this.calcInfo.style.display = 'inline-block';
        }
    }

    updateWasteTypeSelection() {
        // Visual feedback for waste type selection
        const selectedType = document.querySelector('input[name="waste-type"]:checked').value;
        
        // Add animation effect
        const selectedOption = document.querySelector(`input[value="${selectedType}"]`).parentElement;
        selectedOption.style.animation = 'pulse 0.5s ease';
        
        setTimeout(() => {
            selectedOption.style.animation = '';
        }, 500);
    }

    calculateWaste() {
        if (this.images.length === 0) {
            return;
        }

        // Calculate results based on images
        const totalItems = this.images.length;
        const biodegradableCount = this.images.filter(img => img.type === 'biodegradable').length;
        const nonBiodegradableCount = this.images.filter(img => img.type === 'non-biodegradable').length;
        
        // Update results display
        this.totalItems.textContent = totalItems;
        
        // Determine earth impact
        let impact = '';
        let impactEmoji = '';
        
        if (totalItems <= 3) {
            impact = 'Great! 🌟';
            impactEmoji = '🌍';
        } else if (totalItems <= 6) {
            impact = 'Good! 👍';
            impactEmoji = '🌱';
        } else if (totalItems <= 10) {
            impact = 'Okay 😊';
            impactEmoji = '🌿';
        } else {
            impact = 'Try to reduce! 💪';
            impactEmoji = '♻️';
        }
        
        this.earthImpact.textContent = impact + ' ' + impactEmoji;
        
        // Show results with animation
        this.resultsDisplay.style.display = 'block';
        this.resultsDisplay.style.animation = 'slideInUp 0.5s ease';
        
        // Add to history
        this.addToHistory({
            totalItems,
            biodegradableCount,
            nonBiodegradableCount,
            images: [...this.images],
            timestamp: new Date().toISOString()
        });
        
        // Celebration animation
        this.celebrateCalculation();
    }

    celebrateCalculation() {
        // Create floating emojis animation
        const emojis = ['🎉', '🌟', '🎊', '🌈', '🦋'];
        const container = this.resultsDisplay;
        
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const emoji = document.createElement('div');
                emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                emoji.style.cssText = `
                    position: absolute;
                    font-size: 2em;
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

    addToHistory(entry) {
        entry.id = Date.now();
        this.history.unshift(entry);
        this.saveHistory();
        this.displayHistory();
    }

    displayHistory() {
        if (this.history.length === 0) {
            this.historyContainer.innerHTML = `
                <div class="empty-history">
                    <span class="empty-icon">🌟</span>
                    <p>No waste tracked yet. Start tracking to see your history!</p>
                </div>
            `;
            this.clearHistoryBtn.style.display = 'none';
        } else {
            this.historyContainer.innerHTML = '';
            this.clearHistoryBtn.style.display = 'inline-flex';
            
            this.history.forEach(entry => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                
                const date = new Date(entry.timestamp);
                const formattedDate = date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                // Use first image as preview
                const previewImage = entry.images[0];
                
                historyItem.innerHTML = `
                    <img src="${previewImage.src}" alt="Waste image" class="history-image">
                    <div class="history-details">
                        <div class="history-type">
                            ${entry.totalItems} items tracked
                            ${entry.biodegradableCount > 0 ? `🍃 ${entry.biodegradableCount}` : ''}
                            ${entry.nonBiodegradableCount > 0 ? `🥤 ${entry.nonBiodegradableCount}` : ''}
                        </div>
                        <div class="history-date">${formattedDate}</div>
                    </div>
                    <button class="history-delete" data-history-id="${entry.id}">🗑️</button>
                `;
                
                this.historyContainer.appendChild(historyItem);
                
                // Add delete event
                historyItem.querySelector('.history-delete').addEventListener('click', (e) => {
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
        if (confirm('Are you sure you want to clear all your waste history? 🗑️')) {
            this.history = [];
            this.saveHistory();
            this.displayHistory();
            
            // Show confirmation animation
            const message = document.createElement('div');
            message.textContent = 'History cleared! 🎉';
            message.style.cssText = `
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
            document.body.appendChild(message);
            setTimeout(() => message.remove(), 2000);
        }
    }

    saveHistory() {
        localStorage.setItem('wasteTrackerHistory', JSON.stringify(this.history));
    }

    loadHistory() {
        const saved = localStorage.getItem('wasteTrackerHistory');
        if (saved) {
            try {
                this.history = JSON.parse(saved);
                this.displayHistory();
            } catch (e) {
                console.error('Error loading history:', e);
                this.history = [];
            }
        }
    }
}

// Add required CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
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
document.head.appendChild(style);

// Initialize the tracker when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.wasteTracker = new WasteTracker();
});