// Falling Leaves Animation
function createFallingLeaves() {
    const container = document.querySelector('.falling-leaves-container');
    if (!container) return;
    
    // Clear existing leaves
    container.innerHTML = '';
    
    // Create leaves
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const leaf = document.createElement('div');
            leaf.className = 'leaf';
            
            // Random position
            leaf.style.left = Math.random() * 100 + '%';
            
            // Random animation duration
            const duration = 8 + Math.random() * 12;
            leaf.style.animationDuration = duration + 's';
            
            // Random delay
            leaf.style.animationDelay = Math.random() * 5 + 's';
            
            // Random size
            const size = 15 + Math.random() * 10;
            leaf.style.width = size + 'px';
            leaf.style.height = size + 'px';
            
            container.appendChild(leaf);
        }, i * 300);
    }
}

// Initialize falling leaves when waste information section is shown
function initWasteInformationSection() {
    const wasteInfoSection = document.getElementById('waste-information-section');
    if (!wasteInfoSection) return;
    
    // Create observer to detect when section becomes visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                createFallingLeaves();
            }
        });
    }, { threshold: 0.1 });
    
    observer.observe(wasteInfoSection);
}

// Update falling leaves when theme changes
function updateLeavesForTheme() {
    const leaves = document.querySelectorAll('.leaf');
    leaves.forEach(leaf => {
        // Force re-render to apply new theme colors
        leaf.style.display = 'none';
        setTimeout(() => {
            leaf.style.display = '';
        }, 10);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initWasteInformationSection();
    
    // Listen for theme changes
    const themeButtons = document.querySelectorAll('[data-theme]');
    themeButtons.forEach(button => {
        button.addEventListener('click', function() {
            setTimeout(updateLeavesForTheme, 100);
        });
    });
});

// Export functions for use in main script
window.wasteInfoAnimations = 
    createFallingLeaves,
    updateLeavesForTheme,
    initWasteInformationSection