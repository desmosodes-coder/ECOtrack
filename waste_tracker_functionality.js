// waste_tracker_functionality.js
// Converted to module-style logic to upload images to Firebase Storage
// and save metadata into Firestore collection `wasteHistory`.
// Make sure Echo3.html includes this file as: <script type="module" src="waste_tracker_functionality.js"></script>

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, collection, addDoc, query, where, orderBy, getDocs, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getStorage, ref as sRef, uploadBytes, getDownloadURL, listAll, deleteObject
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

//
// Paste your firebaseConfig here (same as in Echo3.html) so the module uses the same project
//
const firebaseConfig = {
  apiKey: "AIzaSyAvblGiAIZ26bIbtw6cSv9kfgzSiYyq_10",
  authDomain: "registar-5f3fb.firebaseapp.com",
  projectId: "registar-5f3fb",
  storageBucket: "registar-5f3fb.firebasestorage.app",
  messagingSenderId: "856198150739",
  appId: "1:856198150739:web:801000f564b47f6333e4a6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ---- WasteTracker class (same UI behavior + Firebase integration) ----
class WasteTracker {
    constructor() {
        this.images = [];     // { id, src (dataURL), file (File), name, type, timestamp }
        this.history = [];    // loaded from Firestore grouped by batch timestamp
        this.currentUid = null;

        this.initializeElements();
        this.bindEvents();

        // wait for auth then load history from Firestore
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.currentUid = user.uid;
                this.loadHistoryFromFirestore();
            } else {
                // not signed in — optionally redirect or just keep local-only
                // window.location.href = 'index.html';
                console.warn('No user signed in for WasteTracker.');
            }
        });
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
        this.dropZone?.addEventListener('dragover', this.handleDragOver.bind(this));
        this.dropZone?.addEventListener('dragleave', this.handleDragLeave.bind(this));
        this.dropZone?.addEventListener('drop', this.handleDrop.bind(this));
        this.dropZone?.addEventListener('click', () => this.fileInput.click());
        
        // File input event
        this.fileInput?.addEventListener('change', this.handleFileSelect.bind(this));
        
        // Calculate button event
        this.calculateBtn?.addEventListener('click', this.calculateWaste.bind(this));
        
        // Clear history button event
        this.clearHistoryBtn?.addEventListener('click', this.clearHistory.bind(this));
        
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
        const files = Array.from(e.target.files).filter(f => f.type && f.type.startsWith('image/'));
        this.addImages(files);
        // reset input so same file can be picked again if needed
        e.target.value = '';
    }

    addImages(files) {
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = {
                    id: Date.now() + Math.random(),
                    src: e.target.result,    // dataURL (for immediate preview)
                    file: file,              // keep original File for upload
                    name: file.name,
                    type: document.querySelector('input[name="waste-type"]:checked')?.value || 'biodegradable',
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
            <img src="${imageData.src}" alt="${this.escapeHtml(imageData.name)}">
            <button class="image-remove-btn" data-image-id="${imageData.id}">×</button>
        `;
        
        this.imagePreview.appendChild(imageItem);
        
        // Add remove event
        imageItem.querySelector('.image-remove-btn')?.addEventListener('click', (e) => {
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
            if (this.calcInfo) this.calcInfo.style.display = 'none';
        } else {
            this.calculateBtn.disabled = true;
            if (this.calcInfo) this.calcInfo.style.display = 'inline-block';
        }
    }

    updateWasteTypeSelection() {
        // Visual feedback for waste type selection
        const selectedType = document.querySelector('input[name="waste-type"]:checked')?.value;
        if (!selectedType) return;
        const selectedOption = document.querySelector(`input[value="${selectedType}"]`)?.parentElement;
        if (!selectedOption) return;
        selectedOption.style.animation = 'pulse 0.5s ease';
        setTimeout(() => selectedOption.style.animation = '', 500);
    }

    async calculateWaste() {
        if (this.images.length === 0) return;

        // Calculate results based on images
        const totalItems = this.images.length;
        const biodegradableCount = this.images.filter(img => img.type === 'biodegradable').length;
        const nonBiodegradableCount = this.images.filter(img => img.type === 'non-biodegradable').length;
        
        // Update results display
        if (this.totalItems) this.totalItems.textContent = totalItems;
        
        // Determine earth impact text
        let impact = '';
        let impactEmoji = '';
        if (totalItems <= 3) { impact = 'Great! 🌟'; impactEmoji = '🌍'; }
        else if (totalItems <= 6) { impact = 'Good! 👍'; impactEmoji = '🌱'; }
        else if (totalItems <= 10) { impact = 'Okay 😊'; impactEmoji = '🌿'; }
        else { impact = 'Try to reduce! 💪'; impactEmoji = '♻️'; }
        if (this.earthImpact) this.earthImpact.textContent = impact + ' ' + impactEmoji;

        // Show results UI
        if (this.resultsDisplay) {
            this.resultsDisplay.style.display = 'block';
            this.resultsDisplay.style.animation = 'slideInUp 0.5s ease';
        }

        // Upload images to Firebase Storage and create Firestore docs
        if (!this.currentUid) {
            alert('You must be signed in to upload images.');
            return;
        }

        // Use one batch timestamp for grouping
        const batchTimestamp = Date.now();
        const uploads = [];

        for (const img of this.images) {
            // create storage path
            const safeName = img.name.replace(/\s+/g, '_');
            const storagePath = `wasteHistory/${this.currentUid}/${batchTimestamp}_${safeName}`;
            const storageRef = sRef(storage, storagePath);

            // upload file
            uploads.push((async () => {
                const up = await uploadBytes(storageRef, img.file);
                const url = await getDownloadURL(storageRef);

                // create firestore doc per image
                const docData = {
                    studentUid: this.currentUid,
                    imageUrl: url,
                    storagePath: storagePath,
                    timestamp: batchTimestamp,
                    biodegradableCount,
                    nonBiodegradableCount,
                    totalItems
                };

                await addDoc(collection(db, "wasteHistory"), docData);

                return { storagePath, url, docData };
            })());
        }

        try {
            await Promise.all(uploads);
        } catch (err) {
            console.error('One or more uploads failed:', err);
            alert('Some uploads failed. Check console.');
        }

        // After uploading, save local UI history (still show grouped)
        this.addToHistory({
            totalItems,
            biodegradableCount,
            nonBiodegradableCount,
            images: this.images.map(i => ({ name: i.name, src: i.src })), // keep small preview
            timestamp: new Date(batchTimestamp).toISOString(),
            batchTimestamp
        });

        // clear current images (but not the saved history)
        this.images = [];
        this.imagePreview.innerHTML = '';
        this.updateCalculateButton();

        // animate celebration
        this.celebrateCalculation();

        // reload from Firestore to ensure consistent view
        await this.loadHistoryFromFirestore();
    }

    celebrateCalculation() {
        const emojis = ['🎉', '🌟', '🎊', '🌈', '🦋'];
        const container = this.resultsDisplay || document.body;
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
        this.displayHistory();
    }

    // ----------- Firestore-backed history -----------
    async loadHistoryFromFirestore() {
        if (!this.currentUid) return;
        try {
            // query all documents for this user, ordered by timestamp desc
            const q = query(
                collection(db, "wasteHistory"),
                where("studentUid", "==", this.currentUid),
                orderBy("timestamp", "desc")
            );
            const snap = await getDocs(q);

            const docs = [];
            snap.forEach(d => docs.push({ id: d.id, ...d.data() }));

            // group by batch timestamp (documents uploaded together share same numeric timestamp)
            const grouped = {};
            for (const doc of docs) {
                const t = doc.timestamp || 0;
                grouped[t] = grouped[t] || { timestamp: t, docs: [], totalItems: doc.totalItems || 1, biodegradableCount: doc.biodegradableCount || 0, nonBiodegradableCount: doc.nonBiodegradableCount || 0 };
                grouped[t].docs.push(doc);
            }

            // convert groups to history array (sorted by timestamp desc)
            const groupsArray = Object.values(grouped).sort((a,b)=>b.timestamp - a.timestamp).map(g => {
                return {
                    batchTimestamp: g.timestamp,
                    docs: g.docs,
                    totalItems: g.totalItems,
                    biodegradableCount: g.biodegradableCount,
                    nonBiodegradableCount: g.nonBiodegradableCount,
                    timestampISO: new Date(Number(g.timestamp)).toISOString()
                };
            });

            this.history = groupsArray;
            this.displayHistory();
        } catch (err) {
            console.error('Failed to load history from Firestore:', err);
        }
    }

    displayHistory() {
        if (!this.historyContainer) return;

        if (this.history.length === 0) {
            this.historyContainer.innerHTML = `
                <div class="empty-history">
                    <span class="empty-icon">🌟</span>
                    <p>No waste tracked yet. Start tracking to see your history!</p>
                </div>
            `;
            this.clearHistoryBtn.style.display = 'none';
            return;
        }

        this.historyContainer.innerHTML = '';
        this.clearHistoryBtn.style.display = 'inline-flex';

        this.history.forEach(entry => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';

            const date = new Date(Number(entry.batchTimestamp));
            const formattedDate = date.toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });

            // pick first image URL (if available) to show preview (docs[0].imageUrl)
            const previewUrl = (entry.docs && entry.docs[0] && entry.docs[0].imageUrl) || (entry.docs && entry.docs[0] && entry.docs[0].imagePath) || '';

            historyItem.innerHTML = `
                <img src="${previewUrl || ''}" alt="Waste image" class="history-image">
                <div class="history-details">
                    <div class="history-type">
                        ${entry.totalItems} items tracked
                        ${entry.biodegradableCount ? ` • 🍃 ${entry.biodegradableCount}` : ''}
                        ${entry.nonBiodegradableCount ? ` • 🥤 ${entry.nonBiodegradableCount}` : ''}
                    </div>
                    <div class="history-date">${formattedDate}</div>
                    <div style="margin-top:6px; font-size:12px; color:rgba(255,255,255,0.7)">
                        <button class="view-all-images" data-batch="${entry.batchTimestamp}">View images</button>
                        <button class="delete-batch" data-batch="${entry.batchTimestamp}">Delete batch</button>
                    </div>
                </div>
            `;

            this.historyContainer.appendChild(historyItem);

            // view all images for the batch (opens them in new tabs)
            historyItem.querySelector('.view-all-images')?.addEventListener('click', (e) => {
                e.stopPropagation();
                const batch = e.currentTarget.dataset.batch;
                const group = this.history.find(h => String(h.batchTimestamp) === String(batch));
                if (!group) return alert('No images found for this batch.');
                group.docs.forEach(d => {
                    if (d.imageUrl) window.open(d.imageUrl, '_blank', 'noopener');
                });
            });

            // delete batch: deletes all storage objects and firestore docs for that batch
            historyItem.querySelector('.delete-batch')?.addEventListener('click', async (e) => {
                e.stopPropagation();
                if (!confirm('Delete all images for this batch? This will remove them permanently.')) return;
                const batch = e.currentTarget.dataset.batch;
                await this.deleteBatch(Number(batch));
            });
        });
    }

    async deleteBatch(batchTimestamp) {
        try {
            // find all docs with this timestamp for current user
            const q = query(collection(db, "wasteHistory"), where("studentUid", "==", this.currentUid), where("timestamp", "==", batchTimestamp));
            const snap = await getDocs(q);
            const deletes = [];
            const storageDeletes = [];

            snap.forEach(d => {
                const data = d.data();
                if (data.storagePath) {
                    const objRef = sRef(storage, data.storagePath);
                    storageDeletes.push(deleteObject(objRef).catch(err => {
                        console.warn('Failed to delete storage object:', data.storagePath, err);
                    }));
                }
                deletes.push(d.id ? addDoc(collection(db, "__toDelete__"), { id: d.id }).catch(()=>{}) : null); // placeholder: we will delete properly below
            });

            // Actually delete firestore docs (deleteDoc requires doc ref; we will fetch doc refs)
            // Re-query to get document references and delete them (since earlier we only had IDs)
            const docsSnap = await getDocs(q);
            const firestoreDeletes = [];
            docsSnap.forEach(d => {
                const docRef = d.ref;
                firestoreDeletes.push(docRef.delete ? docRef.delete().catch(err => console.warn('Failed doc delete', err)) : deleteDocFallback(docRef));
            });

            await Promise.all(storageDeletes);
            await Promise.all(firestoreDeletes);

            // reload history view
            await this.loadHistoryFromFirestore();
            alert('Batch deleted.');
        } catch (err) {
            console.error('Failed to delete batch:', err);
            alert('Failed to delete batch: ' + (err.message || err));
        }
    }

    // fallback if docRef.delete isn't a function in this environment
    async deleteDocFallback(docRef) {
        try {
            await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js").then(mod=>{
                if (mod.deleteDoc) return mod.deleteDoc(docRef);
            });
        } catch(e){ console.warn('deleteDoc fallback failed', e); }
    }

    clearHistory() {
        if (confirm('Are you sure you want to clear all your waste history? 🗑️')) {
            // Delete all Firestore docs for this user (careful — this is destructive)
            if (!this.currentUid) return alert('Not signed in.');
            (async () => {
                try {
                    const q = query(collection(db, "wasteHistory"), where("studentUid", "==", this.currentUid));
                    const snap = await getDocs(q);
                    const deletes = [];
                    const storageDeletes = [];
                    snap.forEach(d => {
                        const data = d.data();
                        if (data.storagePath) {
                            storageDeletes.push(deleteObject(sRef(storage, data.storagePath)).catch(()=>{}));
                        }
                        deletes.push(d.ref.delete ? d.ref.delete().catch(()=>{}) : null);
                    });
                    await Promise.all(storageDeletes);
                    await Promise.all(deletes);
                    await this.loadHistoryFromFirestore();
                    alert('All history removed.');
                } catch (err) {
                    console.error('Failed to clear history:', err);
                    alert('Failed to clear history.');
                }
            })();
        }
    }

    escapeHtml(s){ return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"); }
}

// Initialize the tracker when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // instantiate only if DOM has the tracker elements
    if (document.getElementById('drop-zone')) {
        window.wasteTracker = new WasteTracker();
    } else {
        console.warn('WasteTracker DOM elements not found; skipping initialization.');
    }
});
