// --- Elements ---
const video = document.getElementById('camera-video');
const canvas = document.getElementById('camera-canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const statusOverlay = document.getElementById('status-overlay');
const activePreview = document.getElementById('active-preview');
const colorNameText = document.getElementById('color-name');
const hexDisplay = document.getElementById('hex-value');
const rgbDisplay = document.getElementById('rgb-value');
const hslDisplay = document.getElementById('hsl-value');
const hsvDisplay = document.getElementById('hsv-value');
const cmykDisplay = document.getElementById('cmyk-value');
const historyList = document.getElementById('history-list');
const toast = document.getElementById('toast');

// Buttons
const btnFreeze = document.getElementById('btn-freeze');
const btnSwitch = document.getElementById('btn-switch');
const btnCopy = document.getElementById('btn-copy');

// --- State ---
let isStreaming = false;
let isFrozen = false;
let stream = null;
let facingMode = 'environment'; // environment = back camera, user = front
let animationId = null;
let history = [];
let currentColor = { r: 0, g: 0, b: 0, hex: '#000000' };

// --- Color Converters ---

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

function rgbToHsv(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, v = max;
    const d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
        h = 0;
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        v: Math.round(v * 100)
    };
}

function rgbToCmyk(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const k = 1 - Math.max(r, g, b);
    const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
    const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
    const y = k === 1 ? 0 : (1 - b - k) / (1 - k);
    return {
        c: Math.round(c * 100),
        m: Math.round(m * 100),
        y: Math.round(y * 100),
        k: Math.round(k * 100)
    };
}

// --- Camera Management ---

async function initCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }

    statusOverlay.style.display = 'flex';
    statusOverlay.innerHTML = '<h3>Menginisialisasi Kamera...</h3><p>Harap berikan izin akses kamera untuk memulai.</p>';

    const constraints = {
        video: {
            facingMode: facingMode,
            width: { ideal: 1920 },
            height: { ideal: 1080 }
        }
    };

    try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        
        video.onloadedmetadata = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            isStreaming = true;
            statusOverlay.style.display = 'none';
            video.play();
            requestAnimationFrame(processFrame);
        };
    } catch (err) {
        console.error("Camera Error:", err);
        statusOverlay.innerHTML = `
            <h3>Kamera Tidak Ditemukan</h3>
            <p>Pastikan Anda menggunakan HTTPS dan telah memberikan izin akses kamera.</p>
            <button onclick="initCamera()" style="margin-top: 16px; padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer;">Coba Lagi</button>
        `;
    }
}

// --- Frame Processing ---

function processFrame() {
    if (!isStreaming) return;

    if (!isFrozen) {
        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Get pixel from center
        const centerX = Math.floor(canvas.width / 2);
        const centerY = Math.floor(canvas.height / 2);
        updateColorAt(centerX, centerY);
    }

    animationId = requestAnimationFrame(processFrame);
}

function updateColorAt(x, y, addToHistoryFlag = false) {
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const r = pixel[0], g = pixel[1], b = pixel[2];
    const hex = rgbToHex(r, g, b);

    // Named color from ntc
    const nMatch = ntc.name(hex);
    const colorName = nMatch[1];

    // Update UI
    currentColor = { r, g, b, hex, name: colorName };
    
    activePreview.style.backgroundColor = hex;
    colorNameText.textContent = colorName;
    hexDisplay.textContent = hex;
    rgbDisplay.textContent = `rgb(${r}, ${g}, ${b})`;
    
    const hsl = rgbToHsl(r, g, b);
    hslDisplay.textContent = `${hsl.h}°, ${hsl.s}%, ${hsl.l}%`;
    
    const hsv = rgbToHsv(r, g, b);
    hsvDisplay.textContent = `${hsv.h}°, ${hsv.s}%, ${hsv.v}%`;
    
    const cmyk = rgbToCmyk(r, g, b);
    cmykDisplay.textContent = `${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%`;

    if (addToHistoryFlag) {
        addToHistory(currentColor);
    }
}

// --- History Management ---

function addToHistory(colorObj) {
    // Avoid duplicates at the start
    if (history.length > 0 && history[0].hex === colorObj.hex) return;

    history.unshift({ ...colorObj });
    if (history.length > 10) history.pop();
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    history.forEach(item => {
        const dot = document.createElement('div');
        dot.className = 'history-swatch';
        dot.style.backgroundColor = item.hex;
        dot.title = `${item.name} (${item.hex})`;
        dot.onclick = () => {
            copyToClipboard(item.hex);
        };
        historyList.appendChild(dot);
    });
}

// --- Interaction Handlers ---

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast(`Disalin: ${text}`);
    });
}

function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

btnFreeze.addEventListener('click', () => {
    isFrozen = !isFrozen;
    if (isFrozen) {
        btnFreeze.textContent = "LANJUTKAN LIVE";
        btnFreeze.classList.add('active');
        // Add current color to history when freezing
        addToHistory(currentColor);
    } else {
        btnFreeze.textContent = "BEKUKAN VIEW";
        btnFreeze.classList.remove('active');
    }
});

btnSwitch.addEventListener('click', () => {
    facingMode = facingMode === 'environment' ? 'user' : 'environment';
    initCamera();
});

btnCopy.addEventListener('click', () => {
    copyToClipboard(currentColor.hex);
    addToHistory(currentColor);
});

// Canvas click to pick color manually if frozen or live
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    updateColorAt(x, y, true);
});

// --- Lifecycle ---
window.addEventListener('load', initCamera);
window.addEventListener('resize', () => {
    if (isStreaming) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    }
});
