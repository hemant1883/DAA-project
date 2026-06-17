// DOM Elements
const inputText = document.getElementById('inputText');
const compressBtn = document.getElementById('compressBtn');
const results = document.getElementById('results');
const tabBtns = document.querySelectorAll('.tab-btn');
const textMode = document.getElementById('textMode');
const fileMode = document.getElementById('fileMode');
const fileInput = document.getElementById('fileInput');
const fileUploadArea = document.getElementById('fileUploadArea');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const fileRemove = document.getElementById('fileRemove');

let currentMode = 'text';
let selectedFile = null;

// Tab Switching
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        currentMode = mode;

        // Update tab styles
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Switch modes
        if (mode === 'text') {
            textMode.classList.remove('hidden');
            fileMode.classList.add('hidden');
            selectedFile = null;
        } else {
            textMode.classList.add('hidden');
            fileMode.classList.remove('hidden');
        }
    });
});

// File Upload Handling
fileUploadArea.addEventListener('click', (e) => {
    if (e.target.closest('.file-upload-content')) {
        fileInput.click();
    }
});

fileInput.addEventListener('change', (e) => {
    handleFileSelect(e.target.files[0]);
});

// Drag and Drop
fileUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileUploadArea.classList.add('drag-over');
});

fileUploadArea.addEventListener('dragleave', () => {
    fileUploadArea.classList.remove('drag-over');
});

fileUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    fileUploadArea.classList.remove('drag-over');

    const file = e.dataTransfer.files[0];
    if (file) {
        handleFileSelect(file);
    }
});

function handleFileSelect(file) {
    if (!file) return;

    // Validate file type
    const validExtensions = ['.txt', '.md', '.json', '.csv', '.xml', '.log'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
        alert('Please select a valid file type: TXT, MD, JSON, CSV, XML, or LOG');
        return;
    }

    selectedFile = file;

    // Update UI
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);

    fileUploadArea.querySelector('.file-upload-content').style.display = 'none';
    fileInfo.classList.remove('hidden');
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

fileRemove.addEventListener('click', (e) => {
    e.stopPropagation();
    selectedFile = null;
    fileInput.value = '';
    fileInfo.classList.add('hidden');
    fileUploadArea.querySelector('.file-upload-content').style.display = 'block';
});

// Event Listeners
compressBtn.addEventListener('click', compressText);

async function compressText() {
    let text = '';

    if (currentMode === 'text') {
        text = inputText.value.trim();
        if (!text) {
            alert('Please enter some text to compress!');
            return;
        }
    } else {
        if (!selectedFile) {
            alert('Please select a file to compress!');
            return;
        }

        // Read file content
        try {
            text = await readFileContent(selectedFile);
            if (!text) {
                alert('The file is empty!');
                return;
            }
        } catch (error) {
            alert('Error reading file: ' + error.message);
            return;
        }
    }

    try {
        // Show loading state
        compressBtn.disabled = true;
        compressBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="40" stroke-dashoffset="0"><animateTransform attributeName="transform" type="rotate" from="0 10 10" to="360 10 10" dur="1s" repeatCount="indefinite"/></circle></svg> Processing...';

        // Call C++ backend (simulate for now since we need compilation)
        const data = await callCppBackend(text);

        // Display results
        displayResults(data);

        // Show results section
        results.classList.remove('hidden');

        // Scroll to results
        results.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('Error:', error);
        alert('Error processing compression. Please ensure the C++ backend is compiled and accessible.');
    } finally {
        // Reset button
        compressBtn.disabled = false;
        compressBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3L3 10L10 17M17 3L10 10L17 17" stroke="currentColor" stroke-width="2" fill="none"/></svg> Compress & Analyze';
    }
}

function readFileContent(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            resolve(e.target.result);
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsText(file);
    });
}

async function callCppBackend(text) {
    // Call the Node.js server which executes the C++ program
    try {
        const response = await fetch('http://localhost:3000/api/compress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Backend error:', error);
        throw new Error('Failed to connect to C++ backend. Make sure the server is running (npm start)');
    }
}

function displayResults(data) {
    // Update statistics
    document.getElementById('originalSize').textContent = `${data.originalSize} bits`;
    document.getElementById('compressedSize').textContent = `${data.encodedSize} bits`;
    document.getElementById('compressionRatio').textContent = `${data.compressionRatio.toFixed(2)}%`;

    // Display Huffman codes with frequency table
    const codesContainer = document.getElementById('huffmanCodes');
    codesContainer.innerHTML = '';

    let delay = 0;
    Object.entries(data.codes).forEach(([char, code]) => {
        const codeItem = document.createElement('div');
        codeItem.className = 'code-item';
        codeItem.style.animationDelay = `${delay}s`;

        const displayChar = char === 'SPACE' ? 'SPACE' :
            char === '\\n' ? '\\n' :
                char === '\\t' ? '\\t' : char;

        codeItem.innerHTML = `
            <div class="code-char">${displayChar}</div>
            <div class="code-value">${code}</div>
        `;
        codesContainer.appendChild(codeItem);
        delay += 0.05;
    });

    // Display Huffman tree
    const treeContainer = document.getElementById('treeContainer');
    treeContainer.innerHTML = '';

    if (data.tree) {
        const treeElement = createTreeVisualization(data.tree);
        treeContainer.appendChild(treeElement);
    }

    // Display optimal merge steps with better visualization
    const mergeStepsContainer = document.getElementById('mergeSteps');
    mergeStepsContainer.innerHTML = '';

    // Build frequency to character mapping
    const freqToChars = {};
    Object.entries(data.codes).forEach(([char, code]) => {
        // Find frequency for this character from the tree
        const freq = findCharFrequency(data.tree, char);
        if (freq !== null) {
            if (!freqToChars[freq]) {
                freqToChars[freq] = [];
            }
            freqToChars[freq].push(char);
        }
    });

    // Show CHARACTER FREQUENCY TABLE first
    const freqTableDiv = document.createElement('div');
    freqTableDiv.className = 'frequency-table';
    freqTableDiv.innerHTML = '<strong>Character Frequencies:</strong>';

    const freqGrid = document.createElement('div');
    freqGrid.className = 'freq-grid';

    Object.entries(data.codes).forEach(([char, code]) => {
        const freq = findCharFrequency(data.tree, char);
        const freqItem = document.createElement('div');
        freqItem.className = 'freq-item';
        freqItem.innerHTML = `
            <span class="freq-char">'${char}'</span>
            <span class="freq-arrow">→</span>
            <span class="freq-value">${freq}</span>
        `;
        freqGrid.appendChild(freqItem);
    });

    freqTableDiv.appendChild(freqGrid);
    mergeStepsContainer.appendChild(freqTableDiv);

    // Divider
    const divider = document.createElement('div');
    divider.className = 'merge-divider';
    divider.innerHTML = '<strong>Merge Steps:</strong>';
    mergeStepsContainer.appendChild(divider);

    // Track merged nodes - map freq to label (character or "merged")
    const nodeLabels = {};

    // Initialize with single characters
    if (data.optimalMerge && data.optimalMerge.files) {
        data.optimalMerge.files.forEach(freq => {
            if (freqToChars[freq] && freqToChars[freq].length > 0) {
                // Use first character if multiple have same freq
                const char = freqToChars[freq][0];
                nodeLabels[freq] = { label: `'${char}'`, freq: freq };
                // Remove used character
                freqToChars[freq].shift();
            } else {
                nodeLabels[freq] = { label: `Freq`, freq: freq };
            }
        });
    }

    // Process merge steps with character tracking
    data.optimalMerge.steps.forEach((step, index) => {
        const stepElement = document.createElement('div');
        stepElement.className = 'merge-step';
        stepElement.style.animationDelay = `${index * 0.1}s`;

        const freq1 = step.merge[0];
        const freq2 = step.merge[1];
        const resultFreq = freq1 + freq2;

        // Get labels for the two nodes being merged
        const label1 = nodeLabels[freq1]?.label || `(${freq1})`;
        const label2 = nodeLabels[freq2]?.label || `(${freq2})`;

        stepElement.innerHTML = `
            <div class="merge-step-number">${index + 1}</div>
            <div class="merge-detail">
                <div class="merge-node">
                    <span class="node-label">${label1}</span>
                    <span class="merge-box">${freq1}</span>
                </div>
                <span class="merge-plus">+</span>
                <div class="merge-node">
                    <span class="node-label">${label2}</span>
                    <span class="merge-box">${freq2}</span>
                </div>
                <span class="merge-equals">=</span>
                <span class="merge-result">${resultFreq}</span>
            </div>
           <div class="merge-cost">Cost: ${step.cost}</div>
        `;
        mergeStepsContainer.appendChild(stepElement);

        // Update node labels - mark these as merged
        nodeLabels[resultFreq] = {
            label: `Merged`,
            freq: resultFreq
        };

        // Remove the merged nodes from available labels
        delete nodeLabels[freq1];
        delete nodeLabels[freq2];
    });

    document.getElementById('totalCost').textContent = data.optimalMerge.totalCost;

    // Display encoded text
    document.getElementById('encodedText').textContent = data.encoded;
}

// Helper function to find character frequency in tree
function findCharFrequency(node, targetChar) {
    if (!node) return null;

    if (!node.left && !node.right && node.char === targetChar) {
        return node.freq;
    }

    if (node.left) {
        const leftResult = findCharFrequency(node.left, targetChar);
        if (leftResult !== null) return leftResult;
    }

    if (node.right) {
        const rightResult = findCharFrequency(node.right, targetChar);
        if (rightResult !== null) return rightResult;
    }

    return null;
}

// Build encoding paths map for tooltips
function buildEncodingPaths(node, currentPath = '', paths = {}) {
    if (!node) return paths;

    if (!node.left && !node.right && node.ch !== null) {
        // Leaf node - store the path
        const displayChar = node.ch === ' ' ? 'SPACE' :
            node.ch === '\n' ? '\\n' :
                node.ch === '\t' ? '\\t' : node.ch;
        paths[displayChar] = currentPath || '0';
    }

    if (node.left) buildEncodingPaths(node.left, currentPath + '0', paths);
    if (node.right) buildEncodingPaths(node.right, currentPath + '1', paths);

    return paths;
}

// Helper to get all characters in a subtree
function getSubtreeChars(node) {
    if (!node) return [];

    // If it's a leaf node with a valid character
    if (!node.left && !node.right && node.ch !== null && node.ch !== undefined) {
        // Handle special characters for display
        const displayChar = node.ch === ' ' ? '␣' :
            node.ch === '\n' ? '\\n' :
                node.ch === '\t' ? '\\t' : node.ch;
        return [displayChar];
    }

    // Recursively get chars from children
    const leftChars = node.left ? getSubtreeChars(node.left) : [];
    const rightChars = node.right ? getSubtreeChars(node.right) : [];

    return [...leftChars, ...rightChars];
}

function createTreeVisualization(node, depth = 0, isLeft = null, encodingPaths = null) {
    if (!node) return null;

    // Build encoding paths on first call
    if (encodingPaths === null && depth === 0) {
        encodingPaths = buildEncodingPaths(node);
    }

    const treeNode = document.createElement('div');
    treeNode.className = 'tree-node';
    treeNode.style.animationDelay = `${depth * 0.1}s`;

    const nodeContent = document.createElement('div');
    const isLeaf = !node.left && !node.right;
    nodeContent.className = isLeaf ? 'node-content leaf-node' : 'node-content internal-node';
    nodeContent.style.animationDelay = `${depth * 0.1}s`;

    // Check if it's a leaf node (has a character)
    if (isLeaf && node.ch !== null && node.ch !== undefined) {
        // Leaf node with character
        const displayChar = node.ch === ' ' ? 'SPACE' :
            node.ch === '\n' ? '\\n' :
                node.ch === '\t' ? '\\t' : node.ch;

        const encodingPath = encodingPaths[displayChar] || '';

        nodeContent.innerHTML = `
            <div class="node-char">${displayChar}</div>
            <div class="node-freq">${node.freq}</div>
            <div class="node-tooltip">
                <strong>Character:</strong> '${displayChar}'<br>
                <strong>Frequency:</strong> ${node.freq}<br>
                <strong>Code:</strong> ${encodingPath}
            </div>
        `;
    } else {
        // Internal node (merged node)
        // Get all characters in this subtree
        const subtreeChars = getSubtreeChars(node);
        const charCount = subtreeChars.length;

        // Decide what to show in the circle
        let displaySymbol = '●';
        let displayFontSize = '1.3rem';

        if (charCount <= 2) {
            displaySymbol = subtreeChars.join('+');
            if (displaySymbol.length > 3) displayFontSize = '0.9rem';
        } else if (charCount <= 3) {
            displaySymbol = subtreeChars.join('');
            displayFontSize = '0.8rem';
        }

        nodeContent.innerHTML = `
            <div class="node-char" style="font-size: ${displayFontSize}">${displaySymbol}</div>
            <div class="node-freq">${node.freq}</div>
            <div class="node-tooltip">
                <strong>Internal Node</strong><br>
                <strong>Combined Freq:</strong> ${node.freq}<br>
                <strong>Contains:</strong> ${subtreeChars.join(', ')}
            </div>
        `;
    }

    treeNode.appendChild(nodeContent);

    if (node.left || node.right) {
        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'tree-children';

        if (node.left) {
            const leftChild = createTreeVisualization(node.left, depth + 1, true, encodingPaths);
            if (leftChild) {
                const leftWrapper = document.createElement('div');
                leftWrapper.className = 'tree-child-wrapper';

                // Add edge label for left (0)
                const edgeLabel = document.createElement('div');
                edgeLabel.className = 'tree-edge-label left-edge';
                edgeLabel.textContent = '0';
                leftWrapper.appendChild(edgeLabel);

                leftWrapper.appendChild(leftChild);
                childrenContainer.appendChild(leftWrapper);
            }
        }

        if (node.right) {
            const rightChild = createTreeVisualization(node.right, depth + 1, false, encodingPaths);
            if (rightChild) {
                const rightWrapper = document.createElement('div');
                rightWrapper.className = 'tree-child-wrapper';

                // Add edge label for right (1)
                const edgeLabel = document.createElement('div');
                edgeLabel.className = 'tree-edge-label right-edge';
                edgeLabel.textContent = '1';
                rightWrapper.appendChild(edgeLabel);

                rightWrapper.appendChild(rightChild);
                childrenContainer.appendChild(rightWrapper);
            }
        }

        treeNode.appendChild(childrenContainer);
    }

    return treeNode;
}

// Add some default text for demonstration
window.addEventListener('load', () => {
    inputText.value = 'hello world hello';
});
