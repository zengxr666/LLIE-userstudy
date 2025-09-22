// document.addEventListener('DOMContentLoaded', function() {

//     // --- 1. 配置区域 (简化) ---
//     // 方法文件夹保持不变
//     const METHODS = ['A', 'B', 'C', 'D'];
//     // 清单文件的路径
//     const IMAGE_LIST_URL = 'imagelist.json';

//     // --- 2. 全局变量和DOM元素 ---
//     let IMAGE_NAMES = []; // 这个列表将从JSON文件动态加载
//     let currentImageIndex = 0;
//     let userResults = [];
//     const userId = 'user_' + Math.random().toString(36).substring(2, 11);

//     const imageGrid = document.getElementById('image-grid');
//     const nextBtn = document.getElementById('next-btn');
//     const progressIndicator = document.getElementById('progress-indicator');
//     const studyContainer = document.getElementById('study-container');
//     const completionScreen = document.getElementById('completion-screen');
//     const downloadBtn = document.getElementById('download-btn');
//     const userIdDisplay = document.getElementById('user-id-display');

//     const zoomOverlay = document.getElementById('zoom-overlay');
//     const zoomGrid = document.getElementById('zoom-grid');
//     let zoomState = { scale: 1, x: 0, y: 0 };

//     // --- 3. 核心功能函数 (大部分不变) ---

//     function loadImageSet(index) {
//         if (index >= IMAGE_NAMES.length) {
//             endStudy();
//             return;
//         }
//         const imageName = IMAGE_NAMES[index];
//         imageGrid.innerHTML = '';
//         const shuffledMethods = [...METHODS].sort(() => Math.random() - 0.5);
//         shuffledMethods.forEach(method => {
//             const container = document.createElement('div');
//             container.className = 'image-container';
//             container.dataset.method = method;
//             const img = document.createElement('img');
//             img.src = `imgs/${method}/${imageName}`;
//             img.alt = `Image from method ${method}`;
//             img.addEventListener('click', () => showZoomView(imageName));
//             const controls = document.createElement('div');
//             controls.className = 'ranking-controls';
//             controls.innerHTML = `
//                 <label><input type="radio" name="rank-${method}" value="1"> 1</label>
//                 <label><input type="radio" name="rank-${method}" value="2"> 2</label>
//                 <label><input type="radio" name="rank-${method}" value="3"> 3</label>
//                 <label><input type="radio" name="rank-${method}" value="4"> 4</label>
//             `;
//             container.appendChild(img);
//             container.appendChild(controls);
//             imageGrid.appendChild(container);
//         });
//         updateProgress();
//         resetRankings();
//         checkRankings();
//     }

//     function checkRankings() {
//         const selectedValues = new Set();
//         document.querySelectorAll('.ranking-controls input:checked').forEach(input => {
//             selectedValues.add(input.value);
//         });
//         const allRadioButtons = document.querySelectorAll('.ranking-controls input');
//         allRadioButtons.forEach(radio => {
//             radio.disabled = !radio.checked && selectedValues.has(radio.value);
//         });
//         const totalRanked = document.querySelectorAll('.ranking-controls input:checked').length;
//         nextBtn.disabled = totalRanked !== 4;
//     }

//     function resetRankings() {
//         document.querySelectorAll('.ranking-controls input').forEach(radio => {
//             radio.checked = false;
//             radio.disabled = false;
//         });
//         nextBtn.disabled = true;
//     }

//     function collectResults() {
//         const currentResult = {
//             imageName: IMAGE_NAMES[currentImageIndex],
//             ranking: {}
//         };
//         document.querySelectorAll('.image-container').forEach(container => {
//             const method = container.dataset.method;
//             const checkedRadio = container.querySelector('input:checked');
//             if (checkedRadio) {
//                 currentResult.ranking[method] = parseInt(checkedRadio.value, 10);
//             }
//         });
//         userResults.push(currentResult);
//     }

//     function updateProgress() {
//         progressIndicator.textContent = `进度: ${currentImageIndex + 1} / ${IMAGE_NAMES.length}`;
//     }

//     function endStudy() {
//         studyContainer.style.display = 'none';
//         completionScreen.style.display = 'block';
//         userIdDisplay.textContent = userId;
//     }

//     function downloadResults() {
//         const finalData = {
//             userId: userId,
//             studyDate: new Date().toISOString(),
//             results: userResults
//         };
//         const jsonString = JSON.stringify(finalData, null, 2);
//         const blob = new Blob([jsonString], { type: 'application/json' });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = `${userId}_result.json`;
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//         URL.revokeObjectURL(url);
//     }

//     // --- 4. 放大同步缩放功能 (不变) ---

//     function showZoomView(imageName) {
//         zoomGrid.innerHTML = '';
//         imageGrid.querySelectorAll('.image-container').forEach(container => {
//             const method = container.dataset.method;
//             const zoomContainer = document.createElement('div');
//             zoomContainer.className = 'zoom-image-container';
//             const img = document.createElement('img');
//             img.src = `imgs/${method}/${imageName}`;
//             zoomContainer.appendChild(img);
//             zoomGrid.appendChild(zoomContainer);
//         });
//         zoomOverlay.style.display = 'flex';
//         resetZoom();
//     }

//     function hideZoomView() {
//         zoomOverlay.style.display = 'none';
//     }

//     function resetZoom() {
//         zoomState = { scale: 1, x: 0, y: 0 };
//         applyTransformToAll();
//     }
    
//     function applyTransformToAll() {
//         const zoomImages = zoomGrid.querySelectorAll('img');
//         const transform = `translate(${zoomState.x}px, ${zoomState.y}px) scale(${zoomState.scale})`;
//         zoomImages.forEach(img => {
//             img.style.transform = transform;
//         });
//     }

//     // --- 5. 事件监听器 (不变) ---

//     nextBtn.addEventListener('click', () => {
//         collectResults();
//         currentImageIndex++;
//         loadImageSet(currentImageIndex);
//     });
//     downloadBtn.addEventListener('click', downloadResults);
//     imageGrid.addEventListener('change', checkRankings);
//     zoomOverlay.addEventListener('click', (e) => {
//         if (e.target === zoomOverlay) hideZoomView();
//     });
//     zoomGrid.addEventListener('wheel', (e) => {
//         e.preventDefault();
//         const scaleAmount = e.deltaY > 0 ? -0.1 : 0.1;
//         zoomState.scale = Math.max(1, zoomState.scale + scaleAmount);
//         applyTransformToAll();
//     });
//     let isDragging = false, startPos = { x: 0, y: 0 }, lastPos = { x: 0, y: 0 };
//     zoomGrid.addEventListener('mousedown', (e) => {
//         if (e.target.tagName === 'IMG') {
//             isDragging = true;
//             startPos = { x: e.clientX, y: e.clientY };
//             lastPos = { x: zoomState.x, y: zoomState.y };
//             zoomGrid.style.cursor = 'grabbing';
//         }
//     });
//     window.addEventListener('mousemove', (e) => {
//         if (isDragging) {
//             const dx = e.clientX - startPos.x;
//             const dy = e.clientY - startPos.y;
//             zoomState.x = lastPos.x + dx;
//             zoomState.y = lastPos.y + dy;
//             applyTransformToAll();
//         }
//     });
//     window.addEventListener('mouseup', () => {
//         isDragging = false;
//         zoomGrid.style.cursor = 'default';
//     });

//     // --- 6. 初始化 (全新) ---
//     async function initializeStudy() {
//         try {
//             const response = await fetch(IMAGE_LIST_URL);
//             if (!response.ok) {
//                 throw new Error(`无法加载清单文件: ${response.statusText}`);
//             }
//             IMAGE_NAMES = await response.json();
            
//             if (IMAGE_NAMES.length === 0) {
//                 imageGrid.innerHTML = '<p style="text-align: center; color: red;">错误: 找不到任何图片。请先运行Python脚本生成imagelist.json文件。</p>';
//                 return;
//             }
            
//             // 随机化图片顺序
//             IMAGE_NAMES.sort(() => Math.random() - 0.5);

//             loadImageSet(currentImageIndex);

//         } catch (error) {
//             console.error('初始化研究失败:', error);
//             imageGrid.innerHTML = `<p style="text-align: center; color: red;">初始化失败: ${error.message}。请检查'${IMAGE_LIST_URL}'文件是否存在并且格式正确。</p>`;
//         }
//     }

//     initializeStudy();
// });

document.addEventListener('DOMContentLoaded', function() {

    // --- 1. CONFIGURATION ---
    const METHODS = ['A', 'B', 'C', 'D', 'E', 'F'];
    const IMAGE_LIST_URL = 'imagelist.json';

    // --- 2. GLOBAL VARIABLES & DOM ELEMENTS ---
    let IMAGE_NAMES = [];
    let currentImageIndex = 0;
    let userResults = [];
    const userId = 'user_' + Math.random().toString(36).substring(2, 11);
    
    // ▼▼▼ NEW: We need a variable to track the last clicked radio button ▼▼▼
    let lastSelection = { name: null, value: null };

    // DOM Elements (resetBtn is removed)
    const imageGrid = document.getElementById('image-grid');
    const nextBtn = document.getElementById('next-btn');
    const progressIndicator = document.getElementById('progress-indicator');
    const studyContainer = document.getElementById('study-container');
    const completionScreen = document.getElementById('completion-screen');
    const downloadBtn = document.getElementById('download-btn');
    const userIdDisplay = document.getElementById('user-id-display');

    const zoomOverlay = document.getElementById('zoom-overlay');
    const zoomGrid = document.getElementById('zoom-grid');
    let zoomState = { scale: 1, x: 0, y: 0 };


    // --- 3. CORE FUNCTIONS ---

    function loadImageSet(index) {
        if (index >= IMAGE_NAMES.length) {
            endStudy();
            return;
        }
        
        // ▼▼▼ IMPORTANT: Reset the tracker for each new set of images ▼▼▼
        lastSelection = { name: null, value: null };
        
        const imageName = IMAGE_NAMES[index];
        imageGrid.innerHTML = '';
        const shuffledMethods = [...METHODS].sort(() => Math.random() - 0.5);
        shuffledMethods.forEach(method => {
            const container = document.createElement('div');
            container.className = 'image-container';
            container.dataset.method = method;
            const img = document.createElement('img');
            img.src = `imgs/${method}/${imageName}`;
            img.alt = `Image from method ${method}`;
            img.addEventListener('click', () => showZoomView(imageName));
            const controls = document.createElement('div');
            controls.className = 'ranking-controls';
            controls.innerHTML = `
                <label><input type="radio" name="rank-${method}" value="1"> 1</label>
                <label><input type="radio" name="rank-${method}" value="2"> 2</label>
                <label><input type="radio" name="rank-${method}" value="3"> 3</label>
                <label><input type="radio" name="rank-${method}" value="4"> 4</label>
                <label><input type="radio" name="rank-${method}" value="5"> 5</label>
                <label><input type="radio" name="rank-${method}" value="6"> 6</label>
            `;
            container.appendChild(img);
            container.appendChild(controls);
            imageGrid.appendChild(container);
        });
        updateProgress();
        resetRankings(); // This still clears the visual state initially
        checkRankings(); // And updates button state
    }

    /**
     * ▼▼▼ NEW: This function now handles both selection and deselection. ▼▼▼
     */
    function handleRadioClick(event) {
        const target = event.target;

        // Ensure we only act on radio buttons
        if (target.type !== 'radio') {
            return;
        }

        // Check if the user is clicking the *same radio button again*
        if (target.name === lastSelection.name && target.value === lastSelection.value) {
            // If so, uncheck it and reset the tracker
            target.checked = false;
            lastSelection = { name: null, value: null };
        } else {
            // Otherwise, it's a new selection, so update the tracker
            lastSelection = { name: target.name, value: target.value };
        }

        // After any click, we must re-evaluate the state of all rankings
        checkRankings();
    }
    
    // The `checkRankings` and `resetRankings` functions are still valid and do not need changes.
    function checkRankings() {
        const selectedValues = new Set();
        document.querySelectorAll('.ranking-controls input:checked').forEach(input => {
            selectedValues.add(input.value);
        });
        const allRadioButtons = document.querySelectorAll('.ranking-controls input');
        allRadioButtons.forEach(radio => {
            radio.disabled = !radio.checked && selectedValues.has(radio.value);
        });
        const totalRanked = document.querySelectorAll('.ranking-controls input:checked').length;
        nextBtn.disabled = totalRanked !== 6;
    }

    function resetRankings() {
        document.querySelectorAll('.ranking-controls input').forEach(radio => {
            radio.checked = false;
            radio.disabled = false;
        });
        nextBtn.disabled = true;
    }

    // ... (collectResults, updateProgress, endStudy, etc. all remain unchanged) ...


    // --- 5. EVENT LISTENERS ---

    nextBtn.addEventListener('click', () => {
        collectResults();
        currentImageIndex++;
        loadImageSet(currentImageIndex);
    });

    downloadBtn.addEventListener('click', downloadResults);
    
    // ▼▼▼ MODIFIED: We now listen for 'click' instead of 'change' and call our new handler ▼▼▼
    imageGrid.addEventListener('click', handleRadioClick);
    

    // ... (all other event listeners for zoom, drag, etc. remain unchanged) ...


    // --- 6. INITIALIZATION ---
    // ... (initializeStudy function remains unchanged) ...
    

    // =========================================================================
    // PASTE ALL THE OTHER UNCHANGED FUNCTIONS HERE TO HAVE A COMPLETE FILE
    // =========================================================================
    function collectResults() { const currentResult = { imageName: IMAGE_NAMES[currentImageIndex], ranking: {} }; document.querySelectorAll('.image-container').forEach(container => { const method = container.dataset.method; const checkedRadio = container.querySelector('input:checked'); if (checkedRadio) { currentResult.ranking[method] = parseInt(checkedRadio.value, 10); } }); userResults.push(currentResult); }
    function updateProgress() { progressIndicator.textContent = `Progress: ${currentImageIndex + 1} / ${IMAGE_NAMES.length}`; }
    function endStudy() { studyContainer.style.display = 'none'; completionScreen.style.display = 'block'; userIdDisplay.textContent = userId; }
    function downloadResults() { const finalData = { userId: userId, studyDate: new Date().toISOString(), results: userResults }; const jsonString = JSON.stringify(finalData, null, 2); const blob = new Blob([jsonString], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${userId}_result.json`; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); }
    function showZoomView(imageName) { zoomGrid.innerHTML = ''; imageGrid.querySelectorAll('.image-container').forEach(container => { const method = container.dataset.method; const zoomContainer = document.createElement('div'); zoomContainer.className = 'zoom-image-container'; const img = document.createElement('img'); img.src = `imgs/${method}/${imageName}`; zoomContainer.appendChild(img); zoomGrid.appendChild(zoomContainer); }); zoomOverlay.style.display = 'flex'; resetZoom(); }
    function hideZoomView() { zoomOverlay.style.display = 'none'; }
    function resetZoom() { zoomState = { scale: 1, x: 0, y: 0 }; applyTransformToAll(); }
    function applyTransformToAll() { const zoomImages = zoomGrid.querySelectorAll('img'); const transform = `translate(${zoomState.x}px, ${zoomState.y}px) scale(${zoomState.scale})`; zoomImages.forEach(img => { img.style.transform = transform; }); }
    zoomOverlay.addEventListener('click', (e) => { if (e.target === zoomOverlay) hideZoomView(); });
    zoomGrid.addEventListener('wheel', (e) => { e.preventDefault(); const scaleAmount = e.deltaY > 0 ? -0.1 : 0.1; zoomState.scale = Math.max(1, zoomState.scale + scaleAmount); applyTransformToAll(); });
    let isDragging = false, startPos = { x: 0, y: 0 }, lastPos = { x: 0, y: 0 };
    zoomGrid.addEventListener('mousedown', (e) => { if (e.target.tagName === 'IMG') { isDragging = true; startPos = { x: e.clientX, y: e.clientY }; lastPos = { x: zoomState.x, y: zoomState.y }; zoomGrid.style.cursor = 'grabbing'; } });
    window.addEventListener('mousemove', (e) => { if (isDragging) { const dx = e.clientX - startPos.x; const dy = e.clientY - startPos.y; zoomState.x = lastPos.x + dx; zoomState.y = lastPos.y + dy; applyTransformToAll(); } });
    window.addEventListener('mouseup', () => { isDragging = false; zoomGrid.style.cursor = 'default'; });
    async function initializeStudy() { try { const response = await fetch(IMAGE_LIST_URL); if (!response.ok) { throw new Error(`Could not load image list: ${response.statusText}`); } IMAGE_NAMES = await response.json(); if (IMAGE_NAMES.length === 0) { imageGrid.innerHTML = '<p style="text-align: center; color: red;">Error: No images found. Please run the Python script to generate imagelist.json.</p>'; return; } IMAGE_NAMES.sort(() => Math.random() - 0.5); loadImageSet(currentImageIndex); } catch (error) { console.error('Failed to initialize study:', error); imageGrid.innerHTML = `<p style="text-align: center; color: red;">Initialization Failed: ${error.message}. Please check that '${IMAGE_LIST_URL}' exists and is formatted correctly.</p>`; } }
    initializeStudy();
});