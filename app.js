const morseMap = {
    'ㄱ': '.-..', 'ㄴ': '..-.', 'ㄷ': '-...', 'ㄹ': '...-', 'ㅁ': '--', 'ㅂ': '.--', 'ㅅ': '--.', 'ㅇ': '-.-', 'ㅈ': '.---', 'ㅊ': '-.-.', 'ㅋ': '-..-', 'ㅌ': '--..', 'ㅍ': '---.', 'ㅎ': '.---.',
    'ㄲ': '.-.. .-..', 'ㄸ': '-... -...', 'ㅃ': '.-- .--', 'ㅆ': '--. --.', 'ㅉ': '.--- .---',
    'ㅏ': '.', 'ㅑ': '..', 'ㅓ': '-', 'ㅕ': '...', 'ㅗ': '.-', 'ㅛ': '-.', 'ㅜ': '....', 'ㅠ': '.-.', 'ㅡ': '-..', 'ㅣ': '..-', 'ㅐ': '--.-', 'ㅔ': '-.--',
    'ㅚ': '.- ..-', 'ㅟ': '.... ..-', 'ㅢ': '-.. ..-', 'ㅘ': '.- .', 'ㅝ': '.... -',
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..',
    '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', ' ': '/',

    // ITU-R M.1677-1 표준
    '.': '.-.-.-',
    ',': '--..--',
    '?': '..--..',
    '!': '-.-.--',
    '-': '-....-',
    '/': '-..-.',
    '@': '.--.-.',
    '(': '-.--.',
    ')': '-.--.-',
    ':': '---...',
    ';': '-.-.-.',
    '=': '-...-',
    '+': '.-.-.',
    '_': '..--.-',
    '"': '.-..-.',
    '\'': '.----.',
    '$': '...-..-',
    '&': '.-...',

    // 키보드 특수문자 (관용 코드)
    '#': '-.--.',
    '%': '----- -..-. -----',
    '*': '-..-',
    '`': '.----.',
    '~': '..-.-',
    '^': '.-.-.',
    '|': '-...-',
    '\\': '.-..-.',
    '{': '-.--.',
    '}': '-.--.-',
    '[': '-.--.',
    ']': '-.--.-',
    '<': '.-.-.',
    '>': '.-.-.',

    // 많이 쓰이는 비키보드 특수문자
    '×': '-..-',
    '÷': '-..-.',
    '°': '----.',
    '±': '.-.-.',
    '€': '.-...',
    '£': '.-...',
    '¥': '-.--.',
    '¢': '-.-.',
    '…': '......',
    '–': '-....-',
    '—': '---...',
    '•': '.-.-.-',
    '′': '.----.',
    '″': '.-..-.',
    '©': '-.-. ---',
    '®': '.-. ---',
    '™': '- --',
    '§': '....',
    '¶': '.-.-',
    '∞': '.-.-.-.-',
    '≠': '-.--.',
    '≈': '.-.-.',
    '≤': '.-.-.',
    '≥': '.-.-.',
    '√': '...-.',
    '←': '.-',
    '→': '-.',
    '↑': '.',
    '↓': '-',
    '↔': '.-.',
};

const cho = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
const jung = ["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"];
const jong = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄴㅈ", "ㄴㅎ", "ㄷ", "ㄹ", "ㄹㄱ", "ㄹㅁ", "ㄹㅂ", "ㄹㅅ", "ㄹㅌ", "ㄹㅍ", "ㄹㅎ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];

function disassemble(str) {
    let res = [];
    for (let i = 0; i < str.length; i++) {
        let code = str.charCodeAt(i) - 44032;
        if (code > -1 && code < 11172) {
            res.push(cho[Math.floor(code / 588)]);
            res.push(jung[Math.floor((code % 588) / 28)]);
            if (code % 28 !== 0) res.push(jong[code % 28]);
        } else {
            res.push(str[i].toUpperCase());
        }
    }
    return res;
}

let audioCtx = null;
let currentOscillators = [];

async function playMorse(morse) {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') await audioCtx.resume();

    currentOscillators.forEach(osc => {
        try { osc.stop(); } catch (e) { }
    });
    currentOscillators = [];

    const unit = 0.1;
    const t = audioCtx.currentTime;
    let offset = 0.05;

    morse.split('').forEach(char => {
        if (char === '.' || char === '-') {
            const duration = char === '.' ? unit : unit * 3;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.value = 600;

            gain.gain.setValueAtTime(0, t + offset);
            gain.gain.linearRampToValueAtTime(0.1, t + offset + 0.01);
            gain.gain.setValueAtTime(0.1, t + offset + duration - 0.01);
            gain.gain.linearRampToValueAtTime(0, t + offset + duration);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(t + offset);
            osc.stop(t + offset + duration);

            currentOscillators.push(osc);
            offset += duration + unit;
        } else if (char === ' ') {
            offset += unit * 2;
        } else if (char === '/') {
            offset += unit * 4;
        }
    });
}

const toMorse = str => disassemble(str).map(c => morseMap[c] || `[${c}]`).join(' ');
const toBinary = str => str.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
const toHex = str => str.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
const toOctal = str => str.split('').map(c => c.charCodeAt(0).toString(8).padStart(3, '0')).join(' ');
const toBase64 = str => btoa(unescape(encodeURIComponent(str)));
const toBase64Url = str => toBase64(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

const toBase32 = (str) => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    const bytes = new TextEncoder().encode(str);
    let binary = '';
    for (let b of bytes) binary += b.toString(2).padStart(8, '0');
    let base32 = '';
    for (let i = 0; i < binary.length; i += 5) {
        const chunk = binary.substr(i, 5).padEnd(5, '0');
        base32 += alphabet[parseInt(chunk, 2)];
    }
    while (base32.length % 8 !== 0) base32 += '=';
    return base32;
};

async function getHash(str, algo) {
    const msgUint8 = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest(algo, msgUint8);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.innerText = msg;
    toast.style.opacity = '1';
    setTimeout(() => toast.style.opacity = '0', 1500);
}

function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
        document.execCommand('copy');
        showToast("Copied!");
    } catch (err) {
        showToast("Failed to copy");
    }
    document.body.removeChild(ta);
}

function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text)
            .then(() => showToast("Copied!"))
            .catch(() => fallbackCopy(text));
    } else {
        fallbackCopy(text);
    }
}

async function process() {
    const str = document.getElementById('input').value;
    const container = document.getElementById('output');
    container.innerHTML = '';

    const mv = toMorse(str);
    const md = document.createElement('div');
    md.className = 'result-item full';
    md.onclick = (e) => {
        if (!e.target.closest('.play-icon-btn')) copyToClipboard(mv);
    };

    const labelRow = document.createElement('div');
    labelRow.className = 'label-row';

    const labelSpan = document.createElement('span');
    labelSpan.className = 'label';
    labelSpan.textContent = 'Morse Code';

    const btn = document.createElement('button');
    btn.className = 'play-icon-btn';
    btn.title = 'Play Sound';
    btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        playMorse(mv);
    });

    const valSpan = document.createElement('span');
    valSpan.className = 'value';
    valSpan.textContent = mv;

    labelRow.appendChild(labelSpan);
    labelRow.appendChild(btn);
    md.appendChild(labelRow);
    md.appendChild(valSpan);
    container.appendChild(md);

    const ar = (l, v) => {
        const d = document.createElement('div');
        d.className = 'result-item';
        d.onclick = () => copyToClipboard(v);
        d.innerHTML = `<span class="label">${l}</span><span class="value">${v}</span>`;
        container.appendChild(d);
    };

    ar('Binary ', toBinary(str));
    ar('Hex ', toHex(str));
    ar('Octal ', toOctal(str));
    ar('Base64 ', toBase64(str));
    ar('Base64Url ', toBase64Url(str));
    ar('Base32 ', toBase32(str));
    ar('SHA-1 ', await getHash(str, 'SHA-1'));
    ar('SHA-256 ', await getHash(str, 'SHA-256'));
    ar('SHA-384 ', await getHash(str, 'SHA-384'));
    ar('SHA-512 ', await getHash(str, 'SHA-512'));
}

process();
