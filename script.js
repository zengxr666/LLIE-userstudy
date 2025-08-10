// document.addEventListener('DOMContentLoaded', function() {

//     // --- 1. 配置区域 ---
//     // 在这里配置你要进行研究的图像文件名列表。
//     // 确保每个方法文件夹 (a, b, c, d) 下都有同名的文件。
//     const IMAGE_NAMES = [
//         "001.png",
//         "002.png",
//         "scenery.jpg",
//         "portrait.jpg"
//         // ... 在这里添加更多图片文件名
//     ];
//     const METHODS = ['a', 'b', 'c', 'd'];

//     // --- 2. 全局变量和DOM元素 ---
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


//     // --- 3. 核心功能函数 ---

//     /**
//      * 加载并显示一组特定的图像
//      * @param {number} index - 图像在 IMAGE_NAMES 数组中的索引
//      */
//     function loadImageSet(index) {
//         if (index >= IMAGE_NAMES.length) {
//             endStudy();
//             return;
//         }

//         const imageName = IMAGE_NAMES[index];
//         imageGrid.innerHTML = ''; // 清空上一组图像
        
//         // 随机打乱方法顺序，避免位置偏见
//         const shuffledMethods = [...METHODS].sort(() => Math.random() - 0.5);

//         shuffledMethods.forEach(method => {
//             const container = document.createElement('div');
//             container.className = 'image-container';
//             container.dataset.method = method; // 记录原始方法

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
//         checkRankings(); // 初始检查
//     }
    
//     /**
//      * 检查排名选择状态，实现相同序号不可重复选择的逻辑
//      */
//     function checkRankings() {
//         const selectedValues = new Set();
//         document.querySelectorAll('.ranking-controls input:checked').forEach(input => {
//             selectedValues.add(input.value);
//         });

//         const allRadioButtons = document.querySelectorAll('.ranking-controls input');
//         allRadioButtons.forEach(radio => {
//             if (!radio.checked && selectedValues.has(radio.value)) {
//                 radio.disabled = true;
//             } else {
//                 radio.disabled = false;
//             }
//         });

//         // 检查是否所有4张图都已排名
//         const totalRanked = document.querySelectorAll('.ranking-controls input:checked').length;
//         if (totalRanked === 4) {
//             nextBtn.disabled = false;
//         } else {
//             nextBtn.disabled = true;
//         }
//     }
    
//     /**
//      * 重置排名选择
//      */
//     function resetRankings() {
//         const allRadioButtons = document.querySelectorAll('.ranking-controls input');
//         allRadioButtons.forEach(radio => {
//             radio.checked = false;
//             radio.disabled = false;
//         });
//         nextBtn.disabled = true;
//     }
    
//     /**
//      * 收集当前组的排名结果
//      */
//     function collectResults() {
//         const currentResult = {
//             imageName: IMAGE_NAMES[currentImageIndex],
//             ranking: {}
//         };
//         const containers = document.querySelectorAll('.image-container');
//         containers.forEach(container => {
//             const method = container.dataset.method;
//             const checkedRadio = container.querySelector('input:checked');
//             if (checkedRadio) {
//                 currentResult.ranking[method] = parseInt(checkedRadio.value, 10);
//             }
//         });
//         userResults.push(currentResult);
//     }
    
//     /**
//      * 更新进度指示器
//      */
//     function updateProgress() {
//         progressIndicator.textContent = `进度: ${currentImageIndex + 1} / ${IMAGE_NAMES.length}`;
//     }

//     /**
//      * 结束研究，显示完成界面
//      */
//     function endStudy() {
//         studyContainer.style.display = 'none';
//         completionScreen.style.display = 'block';
//         userIdDisplay.textContent = userId;
//     }

//     /**
//      * 将结果打包成JSON文件并触发下载
//      */
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

//     // --- 4. 放大同步缩放功能 ---

//     /**
//      * 显示放大视图
//      * @param {string} imageName - 当前图像的名称
//      */
//     function showZoomView(imageName) {
//         zoomGrid.innerHTML = '';
//         const imageContainers = imageGrid.querySelectorAll('.image-container');
//         imageContainers.forEach(container => {
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
    
//     /**
//      * 将变换应用到所有放大的图像上
//      */
//     function applyTransformToAll() {
//         const zoomImages = zoomGrid.querySelectorAll('img');
//         const transform = `translate(${zoomState.x}px, ${zoomState.y}px) scale(${zoomState.scale})`;
//         zoomImages.forEach(img => {
//             img.style.transform = transform;
//         });
//     }

//     // --- 5. 事件监听器 ---

//     nextBtn.addEventListener('click', () => {
//         collectResults();
//         currentImageIndex++;
//         loadImageSet(currentImageIndex);
//     });

//     downloadBtn.addEventListener('click', downloadResults);
    
//     // 使用事件委托来监听所有单选按钮的变化
//     imageGrid.addEventListener('change', checkRankings);

//     // 放大视图的事件
//     zoomOverlay.addEventListener('click', (e) => {
//         // 如果点击的是背景而不是图片，则关闭
//         if (e.target === zoomOverlay) {
//             hideZoomView();
//         }
//     });
    
//     // 滚轮缩放
//     zoomGrid.addEventListener('wheel', (e) => {
//         e.preventDefault();
//         const scaleAmount = e.deltaY > 0 ? -0.1 : 0.1;
//         zoomState.scale = Math.max(1, zoomState.scale + scaleAmount); // 最小缩放为1
//         applyTransformToAll();
//     });

//     // 拖动平移
//     let isDragging = false;
//     let startPos = { x: 0, y: 0 };
//     let lastPos = { x: 0, y: 0 };

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


//     // --- 6. 初始化 ---
//     loadImageSet(currentImageIndex);

// });

document.addEventListener('DOMContentLoaded', function() {

    // --- 1. 配置区域 (简化) ---
    // 方法文件夹保持不变
    const METHODS = ['a', 'b', 'c', 'd'];
    // 清单文件的路径
    const IMAGE_LIST_URL = 'imagelist.json';

    // --- 2. 全局变量和DOM元素 ---
    let IMAGE_NAMES = []; // 这个列表将从JSON文件动态加载
    let currentImageIndex = 0;
    let userResults = [];
    const userId = 'user_' + Math.random().toString(36).substring(2, 11);

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

    // --- 3. 核心功能函数 (大部分不变) ---

    function loadImageSet(index) {
        if (index >= IMAGE_NAMES.length) {
            endStudy();
            return;
        }
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
            `;
            container.appendChild(img);
            container.appendChild(controls);
            imageGrid.appendChild(container);
        });
        updateProgress();
        resetRankings();
        checkRankings();
    }

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
        nextBtn.disabled = totalRanked !== 4;
    }

    function resetRankings() {
        document.querySelectorAll('.ranking-controls input').forEach(radio => {
            radio.checked = false;
            radio.disabled = false;
        });
        nextBtn.disabled = true;
    }

    function collectResults() {
        const currentResult = {
            imageName: IMAGE_NAMES[currentImageIndex],
            ranking: {}
        };
        document.querySelectorAll('.image-container').forEach(container => {
            const method = container.dataset.method;
            const checkedRadio = container.querySelector('input:checked');
            if (checkedRadio) {
                currentResult.ranking[method] = parseInt(checkedRadio.value, 10);
            }
        });
        userResults.push(currentResult);
    }

    function updateProgress() {
        progressIndicator.textContent = `进度: ${currentImageIndex + 1} / ${IMAGE_NAMES.length}`;
    }

    function endStudy() {
        studyContainer.style.display = 'none';
        completionScreen.style.display = 'block';
        userIdDisplay.textContent = userId;
    }

    function downloadResults() {
        const finalData = {
            userId: userId,
            studyDate: new Date().toISOString(),
            results: userResults
        };
        const jsonString = JSON.stringify(finalData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${userId}_result.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // --- 4. 放大同步缩放功能 (不变) ---

    function showZoomView(imageName) {
        zoomGrid.innerHTML = '';
        imageGrid.querySelectorAll('.image-container').forEach(container => {
            const method = container.dataset.method;
            const zoomContainer = document.createElement('div');
            zoomContainer.className = 'zoom-image-container';
            const img = document.createElement('img');
            img.src = `imgs/${method}/${imageName}`;
            zoomContainer.appendChild(img);
            zoomGrid.appendChild(zoomContainer);
        });
        zoomOverlay.style.display = 'flex';
        resetZoom();
    }

    function hideZoomView() {
        zoomOverlay.style.display = 'none';
    }

    function resetZoom() {
        zoomState = { scale: 1, x: 0, y: 0 };
        applyTransformToAll();
    }
    
    function applyTransformToAll() {
        const zoomImages = zoomGrid.querySelectorAll('img');
        const transform = `translate(${zoomState.x}px, ${zoomState.y}px) scale(${zoomState.scale})`;
        zoomImages.forEach(img => {
            img.style.transform = transform;
        });
    }

    // --- 5. 事件监听器 (不变) ---

    nextBtn.addEventListener('click', () => {
        collectResults();
        currentImageIndex++;
        loadImageSet(currentImageIndex);
    });
    downloadBtn.addEventListener('click', downloadResults);
    imageGrid.addEventListener('change', checkRankings);
    zoomOverlay.addEventListener('click', (e) => {
        if (e.target === zoomOverlay) hideZoomView();
    });
    zoomGrid.addEventListener('wheel', (e) => {
        e.preventDefault();
        const scaleAmount = e.deltaY > 0 ? -0.1 : 0.1;
        zoomState.scale = Math.max(1, zoomState.scale + scaleAmount);
        applyTransformToAll();
    });
    let isDragging = false, startPos = { x: 0, y: 0 }, lastPos = { x: 0, y: 0 };
    zoomGrid.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'IMG') {
            isDragging = true;
            startPos = { x: e.clientX, y: e.clientY };
            lastPos = { x: zoomState.x, y: zoomState.y };
            zoomGrid.style.cursor = 'grabbing';
        }
    });
    window.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const dx = e.clientX - startPos.x;
            const dy = e.clientY - startPos.y;
            zoomState.x = lastPos.x + dx;
            zoomState.y = lastPos.y + dy;
            applyTransformToAll();
        }
    });
    window.addEventListener('mouseup', () => {
        isDragging = false;
        zoomGrid.style.cursor = 'default';
    });

    // --- 6. 初始化 (全新) ---
    async function initializeStudy() {
        try {
            const response = await fetch(IMAGE_LIST_URL);
            if (!response.ok) {
                throw new Error(`无法加载清单文件: ${response.statusText}`);
            }
            IMAGE_NAMES = await response.json();
            
            if (IMAGE_NAMES.length === 0) {
                imageGrid.innerHTML = '<p style="text-align: center; color: red;">错误: 找不到任何图片。请先运行Python脚本生成imagelist.json文件。</p>';
                return;
            }
            
            // 随机化图片顺序
            IMAGE_NAMES.sort(() => Math.random() - 0.5);

            loadImageSet(currentImageIndex);

        } catch (error) {
            console.error('初始化研究失败:', error);
            imageGrid.innerHTML = `<p style="text-align: center; color: red;">初始化失败: ${error.message}。请检查'${IMAGE_LIST_URL}'文件是否存在并且格式正确。</p>`;
        }
    }

    initializeStudy();
});