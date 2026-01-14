// ========================================
// Auto Accept v30 - Console Script (Custom Sound + Auto /solve-all!)
// ========================================
// วิธีใช้: Copy ทั้งหมด แล้ว Paste ใน DevTools Console (Ctrl+Shift+I)
// Updated: 2026-01-12 11:14
// ========================================
// ✨ Features in v29:
//   1. 🖥️ Floating Control Panel - ปุ่มลอยพร้อม Settings Panel
//   2. 🎵 Custom MP3 ONLY - ใช้เสียง MP3 จาก Local Server เท่านั้น!
//   3. 📊 Detailed Analytics - สถิติแยกตาม Project, Day, Session
//   4. 💾 Persistent - บันทึกลง localStorage
//   5. 📱 Discord Webhook - แจ้งเตือนไปมือถือ
//   6. 🔁 Sound Rotation - ไล่เล่นเสียงวนลูป
//   7. 🔄 Auto /solve-all - ส่งคำสั่งอัตโนมัติหลัง AI เสร็จ!
// ========================================
// 🎵 วิธีใช้ Custom Sounds:
//   1. รัน sound-server.bat (เปิด local server)
//   2. Paste script นี้ใน DevTools Console
//   3. เลือก "🎵 Custom" ใน Sound dropdown
// ========================================

(function () {
    'use strict';

    // ========================================
    // Trusted Types Policy (Fix Chrome CSP Error)
    // ========================================
    var trustedPolicy = null;
    if (window.trustedTypes && window.trustedTypes.createPolicy) {
        try {
            trustedPolicy = window.trustedTypes.createPolicy('aa-policy', {
                createHTML: function (input) { return input; }
            });
        } catch (e) {
            // Policy might already exist, try to get it or ignore
            console.log('[AA] Trusted Types policy already exists or not available');
        }
    }

    // Helper function for safe innerHTML assignment
    function safeSetInnerHTML(element, html) {
        if (trustedPolicy) {
            element.innerHTML = trustedPolicy.createHTML(html);
        } else {
            element.innerHTML = html;
        }
    }

    // ========================================
    // Stop Previous Versions
    // ========================================
    for (var v = 15; v <= 30; v++) {
        if (window['AA' + v + '_INTERVAL']) clearInterval(window['AA' + v + '_INTERVAL']);
        if (window['AA' + v + '_WATCHER']) clearInterval(window['AA' + v + '_WATCHER']);
        if (window['AA' + v + '_ENTER']) clearInterval(window['AA' + v + '_ENTER']);
    }

    // Remove old UI if exists
    var oldPanel = document.getElementById('aa-floating-panel');
    if (oldPanel) oldPanel.remove();
    var oldBtn = document.getElementById('aa-floating-btn');
    if (oldBtn) oldBtn.remove();

    // ========================================
    // Configuration & State
    // ========================================
    var VERSION = 'v30';
    var STORAGE_KEY = 'autoAcceptV27';
    var SOUND_SERVER = 'http://127.0.0.1:8765';

    // Custom sound files (น้าค่อม collection! 😂)
    var customSoundFiles = [
        'น้าค่อม 1.mp3',
        'น้าค่อม 2.mp3',
        'น้าค่อม 3.mp3',
        'น้าค่อม 4.mp3',
        'น้าค่อม 5.mp3',
        'น้าค่อม 6.mp3',
        'น้าค่อม 7.mp3'
    ];

    var defaultConfig = {
        enabled: true,
        // Custom sounds only! No more built-in options
        discordWebhook: '',
        cooldownMs: 3000,
        checkIntervalMs: 2000,
        btnPosition: { top: 8, right: 140 },
        currentSoundIndex: 0,
        // Auto /solve-all settings
        autoSolveAll: false,
        solveAllDelay: 3000,
        solveAllCount: 0
    };

    var defaultStats = {
        clicks: 0,
        timeSaved: 0,
        sessionStart: Date.now(),
        dailyStats: {},
        projectStats: {},
        sessionHistory: []
    };

    var state = {
        wasAIWorking: false,
        lastClickTime: 0,
        panelOpen: false,
        currentTab: 'overview',
        soundServerOnline: false,
        audioCache: [], // Preloaded audio objects for instant playback!
        audioCacheReady: false
    };

    // Load from localStorage
    function loadConfig() {
        try {
            var saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                var parsed = JSON.parse(saved);
                return Object.assign({}, defaultConfig, parsed.config || {});
            }
        } catch (e) { }
        return Object.assign({}, defaultConfig);
    }

    function loadStats() {
        try {
            var saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                var parsed = JSON.parse(saved);
                if (parsed.stats) {
                    return Object.assign({}, defaultStats, parsed.stats, { sessionStart: Date.now() });
                }
            }
        } catch (e) { }
        return Object.assign({}, defaultStats, { sessionStart: Date.now() });
    }

    function saveData() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                config: config,
                stats: {
                    clicks: stats.clicks,
                    timeSaved: stats.timeSaved,
                    dailyStats: stats.dailyStats,
                    projectStats: stats.projectStats,
                    sessionHistory: stats.sessionHistory
                }
            }));
        } catch (e) { }
    }

    var config = loadConfig();
    var stats = loadStats();

    function log(msg) {
        console.log('[AA26]', msg);
    }

    // ========================================
    // Error Filter
    // ========================================
    if (!window.AA_ERROR_FILTERED) {
        window.AA_ERROR_FILTERED = true;
        var originalError = console.error;
        var originalWarn = console.warn;
        console.error = function () {
            var msg = arguments[0] ? String(arguments[0]) : '';
            if (msg.includes('no unacknowledged steps') ||
                msg.includes('Failed to close all diff zones') ||
                msg.includes('acknowledging Cascade edit') ||
                msg.includes('No renderer found for step case') ||
                msg.includes('Failed to send message')) {
                return;
            }
            originalError.apply(console, arguments);
        };
        // Also filter warnings
        console.warn = function () {
            var msg = arguments[0] ? String(arguments[0]) : '';
            if (msg.includes('No renderer found for step case')) {
                return;
            }
            originalWarn.apply(console, arguments);
        };
    }

    // ========================================
    // Utility Functions
    // ========================================
    function getTodayKey() {
        var d = new Date();
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }

    function formatTime(seconds) {
        var m = Math.floor(seconds / 60);
        var s = seconds % 60;
        return m + 'm ' + s + 's';
    }

    function formatDuration(ms) {
        var seconds = Math.floor(ms / 1000);
        var m = Math.floor(seconds / 60);
        var s = seconds % 60;
        return m + ':' + (s < 10 ? '0' : '') + s;
    }

    function detectCurrentProject() {
        var title = document.title || '';
        var match = title.match(/^(.+?)\s*[-–—]\s*Antigravity/i);
        if (match) return match[1].trim();
        match = title.match(/^(.+?)\s*[-–—]/);
        if (match) return match[1].trim();
        return 'Unknown Project';
    }

    function recordClick() {
        var today = getTodayKey();
        var project = detectCurrentProject();

        stats.clicks++;
        stats.timeSaved += 5;

        if (!stats.dailyStats[today]) {
            stats.dailyStats[today] = { clicks: 0, timeSaved: 0 };
        }
        stats.dailyStats[today].clicks++;
        stats.dailyStats[today].timeSaved += 5;

        if (!stats.projectStats[project]) {
            stats.projectStats[project] = { clicks: 0, timeSaved: 0 };
        }
        stats.projectStats[project].clicks++;
        stats.projectStats[project].timeSaved += 5;

        saveData();
    }

    function saveSessionOnUnload() {
        var session = {
            start: stats.sessionStart,
            end: Date.now(),
            clicks: stats.clicks,
            project: detectCurrentProject(),
            duration: Date.now() - stats.sessionStart
        };

        if (!stats.sessionHistory) stats.sessionHistory = [];
        stats.sessionHistory.unshift(session);
        if (stats.sessionHistory.length > 10) {
            stats.sessionHistory = stats.sessionHistory.slice(0, 10);
        }
        saveData();
    }

    window.addEventListener('beforeunload', saveSessionOnUnload);

    // ========================================
    // Sound System - Custom MP3 Only!
    // ========================================
    // No more built-in tones - Custom sounds only!

    // ========================================
    // Custom MP3 Sound System
    // ========================================
    function checkSoundServer() {
        fetch(SOUND_SERVER + '/' + encodeURIComponent(customSoundFiles[0]), { method: 'HEAD', mode: 'cors' })
            .then(function (res) {
                var wasOnline = state.soundServerOnline;
                state.soundServerOnline = res.ok;
                log(state.soundServerOnline ? '🎵 Sound server online!' : '⚠️ Sound server offline');
                updateServerStatus();

                // Preload audio when server comes online!
                if (state.soundServerOnline && !wasOnline) {
                    preloadAudioFiles();
                }
            })
            .catch(function () {
                state.soundServerOnline = false;
                state.audioCacheReady = false;
                log('⚠️ Sound server not available. Run sound-server.bat first!');
                updateServerStatus();
            });
    }

    function updateServerStatus() {
        var statusEl = document.getElementById('aa-server-status');
        if (statusEl) {
            if (state.soundServerOnline) {
                statusEl.textContent = '🟢 Server Online';
                statusEl.style.color = '#10b981';
            } else {
                statusEl.textContent = '🔴 Server Offline - Run sound-server.bat';
                statusEl.style.color = '#ef4444';
            }
        }
    }

    // Preload all audio files for instant playback!
    function preloadAudioFiles() {
        if (state.audioCacheReady) return;

        log('🔄 Preloading audio files...');
        state.audioCache = [];
        var loadedCount = 0;

        customSoundFiles.forEach(function (soundFile, index) {
            var url = SOUND_SERVER + '/' + encodeURIComponent(soundFile);
            var audio = new Audio();
            audio.preload = 'auto';
            audio.volume = 0.8;

            audio.addEventListener('canplaythrough', function () {
                loadedCount++;
                if (loadedCount === customSoundFiles.length) {
                    state.audioCacheReady = true;
                    log('✅ All ' + loadedCount + ' audio files preloaded! (instant playback ready)');
                }
            }, { once: true });

            audio.addEventListener('error', function () {
                log('⚠️ Failed to preload: ' + soundFile);
            }, { once: true });

            audio.src = url;
            audio.load();
            state.audioCache[index] = audio;
        });
    }

    function playCustomSound() {
        if (!state.soundServerOnline) {
            log('⚠️ Sound server offline! รัน sound-server.bat ก่อน');
            return;
        }

        var soundFile = customSoundFiles[config.currentSoundIndex];

        try {
            // Use preloaded audio if available (INSTANT!)
            if (state.audioCacheReady && state.audioCache[config.currentSoundIndex]) {
                var cachedAudio = state.audioCache[config.currentSoundIndex];
                cachedAudio.currentTime = 0; // Reset to start
                cachedAudio.play()
                    .then(function () {
                        log('🎵 Playing (cached): ' + soundFile);
                    })
                    .catch(function () {
                        log('⚠️ Cached audio failed, trying fresh load');
                        playFreshAudio(soundFile);
                    });
            } else {
                // Fallback: load fresh (slower)
                playFreshAudio(soundFile);
            }

            // Move to next sound (rotation)
            config.currentSoundIndex = (config.currentSoundIndex + 1) % customSoundFiles.length;
            saveData();
            updateCurrentSoundDisplay();
        } catch (e) {
            log('⚠️ Audio error: ' + e.message);
        }
    }

    function playFreshAudio(soundFile) {
        var url = SOUND_SERVER + '/' + encodeURIComponent(soundFile);
        var audio = new Audio(url);
        audio.volume = 0.8;
        audio.play()
            .then(function () {
                log('🎵 Playing (fresh): ' + soundFile);
            })
            .catch(function (e) {
                log('⚠️ Failed to play: ' + soundFile + ' - รัน sound-server.bat ก่อน!');
            });
    }

    function updateCurrentSoundDisplay() {
        var el = document.getElementById('aa-current-sound');
        if (el) {
            el.textContent = customSoundFiles[config.currentSoundIndex];
        }
    }

    // Custom sound only - no built-in sounds!
    function playSound() {
        playCustomSound();
    }

    // ========================================
    // Notification System
    // ========================================
    function showNotification(title, body) {
        try {
            if (Notification.permission === 'granted') {
                new Notification(title, { body: body, silent: false });
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission();
            }
        } catch (e) { }
    }

    function speak(text) {
        try {
            window.speechSynthesis.cancel();
            var utterance = new SpeechSynthesisUtterance(text);
            var voices = window.speechSynthesis.getVoices();
            var thaiVoice = voices.find(function (v) { return v.lang.includes('th'); });
            if (thaiVoice) {
                utterance.voice = thaiVoice;
                utterance.lang = 'th-TH';
            }
            utterance.rate = 1.0;
            utterance.volume = 1.0;
            window.speechSynthesis.speak(utterance);
        } catch (e) { }
    }

    // ========================================
    // Discord Webhook
    // ========================================
    function sendDiscordNotification(message) {
        if (!config.discordWebhook) return;

        try {
            var payload = {
                content: null,
                embeds: [{
                    title: '🤖 Auto Accept Notification',
                    description: message,
                    color: 4437377,
                    fields: [
                        { name: '📊 Total Clicks', value: String(stats.clicks), inline: true },
                        { name: '⏱️ Time Saved', value: formatTime(stats.timeSaved), inline: true }
                    ],
                    timestamp: new Date().toISOString()
                }]
            };

            fetch(config.discordWebhook, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).then(function (res) {
                if (res.ok) log('📱 Discord notification sent!');
            }).catch(function () { });
        } catch (e) { }
    }

    function notifyComplete() {
        playSound(); // เล่น custom sound เฉพาะตอน AI finished!
        showNotification('🎉 AI เสร็จแล้ว!', 'Antigravity ทำงานเสร็จเรียบร้อย');
        // ปิด speak() เพื่อไม่ให้เสียงแทรก custom sound
        // setTimeout(function () { speak('เสร็จแล้ว'); }, 500);
        sendDiscordNotification('✅ AI ทำงานเสร็จแล้ว!');
        updateStatsDisplay();

        // Auto /solve-all
        if (config.autoSolveAll) {
            log('⏳ Waiting ' + (config.solveAllDelay / 1000) + 's before /solve-all...');
            setTimeout(sendSolveAllCommand, config.solveAllDelay);
        }
    }

    // ========================================
    // Auto /solve-all Functions
    // ========================================
    function findInputField() {
        // วิธี 1: หา Lexical Editor (ตรงกับ Element ที่ User ให้มา)
        var lexical = document.querySelector('[data-lexical-editor="true"]');
        if (lexical) return { el: lexical, type: 'lexical' };

        // วิธี 2: หา contenteditable div ที่มี role="textbox"
        var textbox = document.querySelector('[role="textbox"][contenteditable="true"]');
        if (textbox) return { el: textbox, type: 'lexical' };

        // วิธี 3: หา contenteditable ทั่วไป
        var editable = document.querySelector('[contenteditable="true"]');
        if (editable) return { el: editable, type: 'editable' };

        // วิธี 4: หา textarea
        var textarea = document.querySelector('textarea');
        if (textarea) return { el: textarea, type: 'textarea' };

        return null;
    }

    function findSubmitButton() {
        // วิธี 1: หาจาก data-tooltip-id
        var btn = document.querySelector('[data-tooltip-id="input-send-button-send-tooltip"]');
        if (btn && isVisible(btn)) return btn;

        // วิธี 2: หา button ที่มี arrow-right icon
        var buttons = document.querySelectorAll('button');
        for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].querySelector('.lucide-arrow-right') && isVisible(buttons[i])) return buttons[i];
        }

        // วิธี 3: หา button ที่มี Submit text
        for (var i = 0; i < buttons.length; i++) {
            var text = buttons[i].textContent || '';
            if (text.includes('Submit') && isVisible(buttons[i])) return buttons[i];
        }

        return null;
    }

    function typeIntoLexicalEditor(editorEl, text) {
        // Focus the editor
        editorEl.focus();

        // Select all and delete existing content first!
        try {
            // Method 1: Select all content
            var selection = window.getSelection();
            var range = document.createRange();
            range.selectNodeContents(editorEl);
            selection.removeAllRanges();
            selection.addRange(range);

            // Delete selected content
            document.execCommand('delete', false, null);

            // Insert new text
            document.execCommand('insertText', false, text);

            log('📝 Lexical: Inserted "' + text + '" using execCommand');
        } catch (e) {
            // Fallback: Direct DOM manipulation
            var p = editorEl.querySelector('p');
            if (p) {
                p.textContent = text;  // Use textContent to replace, not append
            } else {
                safeSetInnerHTML(editorEl, '<p class="text-sm">' + text + '</p>');
            }

            // Dispatch input event
            editorEl.dispatchEvent(new InputEvent('input', {
                bubbles: true,
                cancelable: true,
                inputType: 'insertText',
                data: text
            }));

            log('📝 Lexical: Set content using fallback method');
        }
    }

    function sendSolveAllCommand() {
        if (!config.autoSolveAll) return;

        // ⚠️ Safeguard: ตรวจสอบว่า AI ไม่ได้กำลังทำงานอยู่
        if (isAIWorking()) {
            log('⏳ AI is still working, waiting...');
            return;
        }

        var inputField = findInputField();
        var submitBtn = findSubmitButton();

        if (!inputField) {
            log('⚠️ Cannot find input field for /solve-all');
            return;
        }
        if (!submitBtn) {
            log('⚠️ Cannot find submit button for /solve-all');
            return;
        }

        log('🔍 Found input field type: ' + inputField.type);

        // พิมพ์ /solve-all ตาม type ของ input
        if (inputField.type === 'lexical') {
            typeIntoLexicalEditor(inputField.el, '/solve-all');
        } else if (inputField.type === 'editable') {
            inputField.el.focus();
            inputField.el.textContent = '/solve-all';
            inputField.el.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
            inputField.el.value = '/solve-all';
            inputField.el.dispatchEvent(new Event('input', { bubbles: true }));
        }

        log('📝 Typed /solve-all into input field');

        // รอ 500ms แล้วกด submit
        setTimeout(function () {
            if (clickElement(submitBtn)) {
                config.solveAllCount++;
                saveData();
                log('🔄 Sent /solve-all (round ' + config.solveAllCount + ')');
                updateSolveAllCountDisplay();
            } else {
                log('⚠️ Failed to click submit button');
            }
        }, 500);
    }

    function updateSolveAllCountDisplay() {
        var el = document.getElementById('aa-solveall-count');
        if (el) el.textContent = config.solveAllCount || 0;
    }

    // ========================================
    // Cross-Frame Functions
    // ========================================
    function findInAllFrames(selector) {
        var el = document.querySelector(selector);
        if (el) return el;
        try {
            var iframes = document.querySelectorAll('iframe, webview');
            for (var i = 0; i < iframes.length; i++) {
                try {
                    var iframeDoc = iframes[i].contentDocument || iframes[i].contentWindow.document;
                    if (iframeDoc) {
                        el = iframeDoc.querySelector(selector);
                        if (el) return el;
                    }
                } catch (e) { }
            }
        } catch (e) { }
        return null;
    }

    function isAIWorking() {
        return findInAllFrames('[data-tooltip-id="input-send-button-cancel-tooltip"]') !== null;
    }

    function watchAIStatus() {
        var isWorking = isAIWorking();
        if (state.wasAIWorking && !isWorking) {
            log('✅ AI finished working!');
            notifyComplete();
        }
        state.wasAIWorking = isWorking;
        updateFloatingBtn();
    }

    // ========================================
    // Button Detection & Click
    // ========================================
    function isVisible(el) {
        try {
            var rect = el.getBoundingClientRect();
            if (rect.width <= 0 || rect.height <= 0) return false;
            var style = window.getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
            return true;
        } catch (e) { return false; }
    }

    function findAcceptButtonInDoc(doc) {
        try {
            var buttons = doc.querySelectorAll('button.bg-ide-button-background');
            for (var i = 0; i < buttons.length; i++) {
                var btn = buttons[i];
                var firstChild = btn.childNodes[0];
                var text = firstChild ? (firstChild.textContent || firstChild.nodeValue || '').trim() : '';
                if (text === 'Accept' && isVisible(btn)) {
                    return { el: btn, type: 'Accept' };
                }
                // Detect Retry button!
                if (text === 'Retry' && isVisible(btn)) {
                    return { el: btn, type: 'Retry' };
                }
                // Detect Allow This Conversation button!
                if (text === 'Allow This Conversation' && isVisible(btn)) {
                    return { el: btn, type: 'Allow This Conversation' };
                }
            }
            // Also check button text content directly for Allow This Conversation
            var allButtons = doc.querySelectorAll('button');
            for (var i = 0; i < allButtons.length; i++) {
                var btn = allButtons[i];
                var btnText = btn.textContent ? btn.textContent.trim() : '';
                if (btnText === 'Allow This Conversation' && isVisible(btn)) {
                    return { el: btn, type: 'Allow This Conversation' };
                }
            }
            var spans = doc.querySelectorAll('span.bg-ide-button-background');
            for (var i = 0; i < spans.length; i++) {
                var span = spans[i];
                var text = span.textContent ? span.textContent.trim() : '';
                if (text === 'Accept all' && isVisible(span)) {
                    return { el: span, type: 'Accept all' };
                }
            }
            var allElements = doc.querySelectorAll('button, span, div, a');
            for (var i = 0; i < allElements.length; i++) {
                var el = allElements[i];
                var txt = el.textContent ? el.textContent.trim() : '';
                if (txt.match(/^Accept(\s*all)?(\s*Alt.*)?$/i) && !txt.includes('Reject')) {
                    if (isVisible(el)) {
                        return { el: el, type: 'Accept' };
                    }
                }
            }
        } catch (e) { }
        return null;
    }

    function findAcceptButton() {
        var found = findAcceptButtonInDoc(document);
        if (found) return found;
        try {
            var iframes = document.querySelectorAll('iframe, webview');
            for (var i = 0; i < iframes.length; i++) {
                try {
                    var iframeDoc = iframes[i].contentDocument || iframes[i].contentWindow.document;
                    if (iframeDoc) {
                        found = findAcceptButtonInDoc(iframeDoc);
                        if (found) return found;
                    }
                } catch (e) { }
            }
        } catch (e) { }
        return null;
    }

    function clickElement(el) {
        try {
            var rect = el.getBoundingClientRect();
            el.focus();
            el.click();
            ['mousedown', 'mouseup', 'click'].forEach(function (type) {
                el.dispatchEvent(new MouseEvent(type, {
                    bubbles: true, cancelable: true, view: window, button: 0,
                    clientX: rect.left + rect.width / 2,
                    clientY: rect.top + rect.height / 2
                }));
            });
            return true;
        } catch (e) { return false; }
    }

    function findAndClick() {
        if (!config.enabled) return false;

        var now = Date.now();
        if (now - state.lastClickTime < config.cooldownMs) return false;

        var found = findAcceptButton();
        if (found) {
            log('🎯 Found: ' + found.type);
            if (clickElement(found.el)) {
                state.lastClickTime = now;
                recordClick();
                log('✅ Clicked! Total: ' + stats.clicks);
                // ไม่เล่นเสียงตอนกด Accept - เล่นเฉพาะตอน AI finished!
                updateStatsDisplay();
                return true;
            }
        }
        return false;
    }

    // ========================================
    // Export Function
    // ========================================
    function exportStats() {
        var data = {
            exportDate: new Date().toISOString(),
            version: VERSION,
            totalClicks: stats.clicks,
            totalTimeSaved: stats.timeSaved,
            dailyStats: stats.dailyStats,
            projectStats: stats.projectStats,
            sessionHistory: stats.sessionHistory
        };
        var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'auto-accept-stats-' + getTodayKey() + '.json';
        a.click();
        URL.revokeObjectURL(url);
        log('📤 Stats exported!');
    }

    // ========================================
    // UI Styles
    // ========================================
    var styles = `
        #aa-floating-btn {
            position: fixed;
            top: ${config.btnPosition.top}px;
            right: ${config.btnPosition.right}px;
            width: 32px;
            height: 32px;
            border-radius: 6px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border: none;
            cursor: grab;
            box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            transition: box-shadow 0.3s ease, background 0.3s ease;
            animation: aa-pulse 2s infinite;
            user-select: none;
        }
        #aa-floating-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.6);
        }
        #aa-floating-btn.dragging {
            cursor: grabbing;
            transform: scale(1.1);
            box-shadow: 0 8px 25px rgba(16, 185, 129, 0.8);
            animation: none;
        }
        #aa-floating-btn.disabled {
            background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
            box-shadow: 0 4px 15px rgba(107, 114, 128, 0.4);
            animation: none;
        }
        #aa-floating-btn.ai-working {
            animation: aa-spin 1s linear infinite;
        }
        @keyframes aa-pulse {
            0%, 100% { box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4); }
            50% { box-shadow: 0 4px 25px rgba(16, 185, 129, 0.8); }
        }
        @keyframes aa-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        #aa-floating-panel {
            position: fixed;
            top: 48px;
            right: 60px;
            width: 360px;
            max-height: 520px;
            background: rgba(24, 24, 27, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            z-index: 999998;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #fff;
            overflow: hidden;
            display: none;
        }
        #aa-floating-panel.open { display: block; }
        .aa-header {
            padding: 16px 20px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .aa-header h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
        }
        .aa-close {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            opacity: 0.8;
        }
        .aa-close:hover { opacity: 1; }
        .aa-tabs {
            display: flex;
            background: rgba(0, 0, 0, 0.3);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .aa-tab {
            flex: 1;
            padding: 10px 8px;
            text-align: center;
            font-size: 11px;
            color: #9ca3af;
            cursor: pointer;
            border: none;
            background: none;
            transition: all 0.2s;
        }
        .aa-tab:hover { color: #fff; background: rgba(255, 255, 255, 0.05); }
        .aa-tab.active {
            color: #10b981;
            background: rgba(16, 185, 129, 0.1);
            border-bottom: 2px solid #10b981;
        }
        .aa-tab-content {
            display: none;
            max-height: 380px;
            overflow-y: auto;
        }
        .aa-tab-content.active { display: block; }
        .aa-section {
            padding: 16px 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .aa-section:last-child { border-bottom: none; }
        .aa-section h4 {
            margin: 0 0 12px 0;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #9ca3af;
        }
        .aa-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }
        .aa-row:last-child { margin-bottom: 0; }
        .aa-label {
            font-size: 14px;
            color: #e5e7eb;
        }
        .aa-toggle {
            position: relative;
            width: 48px;
            height: 26px;
            background: #4b5563;
            border-radius: 13px;
            cursor: pointer;
            transition: background 0.3s;
        }
        .aa-toggle.active { background: #10b981; }
        .aa-toggle::after {
            content: '';
            position: absolute;
            top: 3px;
            left: 3px;
            width: 20px;
            height: 20px;
            background: white;
            border-radius: 50%;
            transition: transform 0.3s;
        }
        .aa-toggle.active::after { transform: translateX(22px); }
        .aa-select {
            background: #374151;
            border: 1px solid #4b5563;
            border-radius: 8px;
            padding: 8px 12px;
            color: white;
            font-size: 14px;
            cursor: pointer;
            min-width: 120px;
        }
        .aa-input {
            width: 100%;
            background: #374151;
            border: 1px solid #4b5563;
            border-radius: 8px;
            padding: 10px 12px;
            color: white;
            font-size: 13px;
            margin-top: 8px;
            box-sizing: border-box;
        }
        .aa-input::placeholder { color: #9ca3af; }
        .aa-stat-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
        }
        .aa-stat-item {
            text-align: center;
            padding: 12px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
        }
        .aa-stat-value {
            font-size: 20px;
            font-weight: 700;
            color: #10b981;
        }
        .aa-stat-label {
            font-size: 11px;
            color: #9ca3af;
            margin-top: 4px;
        }
        .aa-btn {
            padding: 10px 16px;
            border-radius: 8px;
            border: none;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        }
        .aa-btn-primary { background: #10b981; color: white; }
        .aa-btn-primary:hover { background: #059669; }
        .aa-btn-secondary { background: #374151; color: white; }
        .aa-btn-secondary:hover { background: #4b5563; }
        .aa-btn-danger { background: #ef4444; color: white; }
        .aa-btn-danger:hover { background: #dc2626; }
        .aa-btn-row {
            display: flex;
            gap: 8px;
        }
        .aa-btn-row .aa-btn { flex: 1; }
        .aa-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
        }
        .aa-table th {
            text-align: left;
            padding: 8px;
            color: #9ca3af;
            font-weight: 500;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .aa-table td {
            padding: 8px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .aa-table tr:hover td { background: rgba(255, 255, 255, 0.03); }
        .aa-empty {
            text-align: center;
            padding: 20px;
            color: #6b7280;
            font-size: 13px;
        }
        .aa-sound-info {
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.3);
            border-radius: 8px;
            padding: 12px;
            margin-top: 12px;
        }
        .aa-sound-info-title {
            font-size: 11px;
            color: #10b981;
            margin-bottom: 6px;
            font-weight: 600;
        }
        .aa-sound-info-text {
            font-size: 12px;
            color: #9ca3af;
        }
        .aa-server-status {
            font-size: 11px;
            margin-top: 8px;
        }
    `;

    // ========================================
    // Create UI Elements
    // ========================================
    function createUI() {
        var styleEl = document.createElement('style');
        styleEl.textContent = styles;
        document.head.appendChild(styleEl);

        var btn = document.createElement('button');
        btn.id = 'aa-floating-btn';
        btn.textContent = '🤖';
        btn.title = 'Auto Accept ' + VERSION + ' (Drag to move)';
        document.body.appendChild(btn);

        btn.style.top = config.btnPosition.top + 'px';
        btn.style.right = config.btnPosition.right + 'px';

        var isDragging = false;
        var dragStartX, dragStartY, btnStartRight, btnStartTop;
        var hasMoved = false;

        btn.addEventListener('mousedown', function (e) {
            if (e.button !== 0) return;
            isDragging = true;
            hasMoved = false;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            btnStartRight = parseInt(btn.style.right) || config.btnPosition.right;
            btnStartTop = parseInt(btn.style.top) || config.btnPosition.top;
            btn.classList.add('dragging');
            e.preventDefault();
        });

        document.addEventListener('mousemove', function (e) {
            if (!isDragging) return;
            var deltaX = dragStartX - e.clientX;
            var deltaY = e.clientY - dragStartY;

            if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
                hasMoved = true;
            }

            var newRight = btnStartRight + deltaX;
            var newTop = btnStartTop + deltaY;

            newRight = Math.max(10, Math.min(window.innerWidth - 50, newRight));
            newTop = Math.max(10, Math.min(window.innerHeight - 50, newTop));

            btn.style.right = newRight + 'px';
            btn.style.top = newTop + 'px';
        });

        document.addEventListener('mouseup', function (e) {
            if (!isDragging) return;
            isDragging = false;
            btn.classList.remove('dragging');

            config.btnPosition.top = parseInt(btn.style.top) || 8;
            config.btnPosition.right = parseInt(btn.style.right) || 140;
            saveData();

            if (!hasMoved) {
                togglePanel();
            }

            log('📍 Position saved: top=' + config.btnPosition.top + ', right=' + config.btnPosition.right);
        });

        var panel = document.createElement('div');
        panel.id = 'aa-floating-panel';
        safeSetInnerHTML(panel, createPanelHTML());
        document.body.appendChild(panel);

        setupEventListeners();

        setInterval(function () {
            var sessionEl = document.getElementById('aa-stat-session');
            if (sessionEl) {
                sessionEl.textContent = formatDuration(Date.now() - stats.sessionStart);
            }
        }, 1000);
    }

    function createPanelHTML() {
        return `
            <div class="aa-header">
                <h3>🤖 Auto Accept ${VERSION}</h3>
                <button class="aa-close" onclick="document.getElementById('aa-floating-panel').classList.remove('open')">&times;</button>
            </div>
            <div class="aa-tabs">
                <button class="aa-tab active" data-tab="overview">📊 Overview</button>
                <button class="aa-tab" data-tab="sounds">🎵 Sounds</button>
                <button class="aa-tab" data-tab="daily">📅 Daily</button>
                <button class="aa-tab" data-tab="projects">📁 Projects</button>
            </div>
            
            <!-- Overview Tab -->
            <div class="aa-tab-content active" id="aa-tab-overview">
                <div class="aa-section">
                    <h4>⚙️ Settings</h4>
                    <div class="aa-row">
                        <span class="aa-label">Auto Accept</span>
                        <div class="aa-toggle ${config.enabled ? 'active' : ''}" id="aa-toggle-enabled"></div>
                    </div>
                    <div class="aa-row">
                        <span class="aa-label">🔊 Sound</span>
                        <span style="color: #10b981;">🎵 Custom Only (น้าค่อม)</span>
                    </div>
                    <div class="aa-row" style="flex-direction: column; align-items: stretch;">
                        <span class="aa-label">📱 Discord Webhook</span>
                        <input type="text" class="aa-input" id="aa-discord-input" 
                               placeholder="https://discord.com/api/webhooks/..." 
                               value="${config.discordWebhook || ''}">
                    </div>
                    <div class="aa-row" style="margin-top: 12px;">
                        <span class="aa-label">🔄 Auto /solve-all</span>
                        <div class="aa-toggle ${config.autoSolveAll ? 'active' : ''}" id="aa-toggle-solveall"></div>
                    </div>
                    <div class="aa-row">
                        <span class="aa-label">Rounds Sent</span>
                        <span id="aa-solveall-count" style="color: #10b981;">${config.solveAllCount || 0}</span>
                    </div>
                    <div class="aa-row" style="margin-top: 8px;">
                        <button class="aa-btn aa-btn-primary" id="aa-btn-start-solveall" style="width: 100%;">▶️ Start /solve-all Now</button>
                    </div>
                </div>
                <div class="aa-section">
                    <h4>📊 Statistics</h4>
                    <div class="aa-stat-grid">
                        <div class="aa-stat-item">
                            <div class="aa-stat-value" id="aa-stat-clicks">${stats.clicks}</div>
                            <div class="aa-stat-label">Clicks</div>
                        </div>
                        <div class="aa-stat-item">
                            <div class="aa-stat-value" id="aa-stat-time">${formatTime(stats.timeSaved)}</div>
                            <div class="aa-stat-label">Time Saved</div>
                        </div>
                        <div class="aa-stat-item">
                            <div class="aa-stat-value" id="aa-stat-session">0:00</div>
                            <div class="aa-stat-label">Session</div>
                        </div>
                    </div>
                </div>
                <div class="aa-section">
                    <div class="aa-btn-row">
                        <button class="aa-btn aa-btn-primary" id="aa-btn-test">🔊 Test</button>
                        <button class="aa-btn aa-btn-secondary" id="aa-btn-export">📤 Export</button>
                        <button class="aa-btn aa-btn-danger" id="aa-btn-stop">🛑 Stop</button>
                    </div>
                </div>
            </div>
            
            <!-- Sounds Tab -->
            <div class="aa-tab-content" id="aa-tab-sounds">
                <div class="aa-section">
                    <h4>🎵 Custom Sound Settings</h4>
                    <div id="aa-server-status" class="aa-server-status">Checking server...</div>
                    <div class="aa-sound-info">
                        <div class="aa-sound-info-title">📂 Sound Files (${customSoundFiles.length})</div>
                        <div class="aa-sound-info-text">
                            ${customSoundFiles.map(function (f, i) {
            return (i === config.currentSoundIndex ? '▶️ ' : '• ') + f;
        }).join('<br>')}
                        </div>
                    </div>
                    <div class="aa-row" style="margin-top: 12px;">
                        <span class="aa-label">Next Sound</span>
                        <span id="aa-current-sound" style="color: #10b981;">${customSoundFiles[config.currentSoundIndex]}</span>
                    </div>
                </div>
                <div class="aa-section">
                    <h4>🔧 How to Use</h4>
                    <div class="aa-sound-info-text" style="font-size: 11px; line-height: 1.6;">
                        1. รัน <b>sound-server.bat</b><br>
                        2. เลือก "🎵 Custom" ใน Sound dropdown<br>
                        3. เสียงจะไล่เล่นวนลูปอัตโนมัติ! 🔁
                    </div>
                </div>
                <div class="aa-section">
                    <div class="aa-btn-row">
                        <button class="aa-btn aa-btn-primary" id="aa-btn-test-custom">🔊 Test Sound</button>
                        <button class="aa-btn aa-btn-secondary" id="aa-btn-check-server">🔄 Check Server</button>
                    </div>
                </div>
            </div>
            
            <!-- Daily Tab -->
            <div class="aa-tab-content" id="aa-tab-daily">
                <div class="aa-section">
                    <h4>📅 Daily Statistics</h4>
                    <div id="aa-daily-stats"></div>
                </div>
            </div>
            
            <!-- Projects Tab -->
            <div class="aa-tab-content" id="aa-tab-projects">
                <div class="aa-section">
                    <h4>📁 Project Statistics</h4>
                    <div id="aa-project-stats"></div>
                </div>
            </div>
        `;
    }

    function setupEventListeners() {
        document.querySelectorAll('.aa-tab').forEach(function (tab) {
            tab.addEventListener('click', function () {
                var tabName = this.getAttribute('data-tab');
                switchTab(tabName);
            });
        });

        document.getElementById('aa-toggle-enabled').onclick = function () {
            config.enabled = !config.enabled;
            this.classList.toggle('active', config.enabled);
            updateFloatingBtn();
            saveData();
            log(config.enabled ? '▶️ Enabled' : '⏸️ Disabled');
        };

        // Sound select removed - Custom only!

        document.getElementById('aa-discord-input').onchange = function () {
            config.discordWebhook = this.value.trim();
            saveData();
            log('📱 Discord webhook updated');
        };

        document.getElementById('aa-toggle-solveall').onclick = function () {
            config.autoSolveAll = !config.autoSolveAll;
            this.classList.toggle('active', config.autoSolveAll);
            saveData();
            log(config.autoSolveAll ? '🔄 Auto /solve-all enabled' : '⏹️ Auto /solve-all disabled');

            // Auto start first round when enabled!
            if (config.autoSolveAll && !isAIWorking()) {
                log('▶️ Starting first /solve-all round...');
                setTimeout(sendSolveAllCommand, 1000);
            }
        };

        document.getElementById('aa-btn-start-solveall').onclick = function () {
            if (isAIWorking()) {
                log('⚠️ AI is still working, please wait...');
                return;
            }
            config.autoSolveAll = true;
            document.getElementById('aa-toggle-solveall').classList.add('active');
            saveData();
            log('▶️ Manual start /solve-all...');
            sendSolveAllCommand();
        };

        document.getElementById('aa-btn-test').onclick = function () {
            playSound();
            if (config.discordWebhook) {
                sendDiscordNotification('🔔 Test notification from Auto Accept!');
            }
        };

        document.getElementById('aa-btn-export').onclick = function () {
            exportStats();
        };

        document.getElementById('aa-btn-stop').onclick = function () {
            stopScript();
        };

        document.getElementById('aa-btn-test-custom').onclick = function () {
            playCustomSound();
        };

        document.getElementById('aa-btn-check-server').onclick = function () {
            checkSoundServer();
        };
    }

    function switchTab(tabName) {
        state.currentTab = tabName;

        document.querySelectorAll('.aa-tab').forEach(function (t) {
            t.classList.toggle('active', t.getAttribute('data-tab') === tabName);
        });

        document.querySelectorAll('.aa-tab-content').forEach(function (c) {
            c.classList.toggle('active', c.id === 'aa-tab-' + tabName);
        });

        if (tabName === 'daily') {
            renderDailyStats();
        } else if (tabName === 'projects') {
            renderProjectStats();
        } else if (tabName === 'sounds') {
            checkSoundServer();
        }
    }

    function renderDailyStats() {
        var container = document.getElementById('aa-daily-stats');
        if (!container) return;

        var days = Object.keys(stats.dailyStats || {}).sort().reverse();
        if (days.length === 0) {
            safeSetInnerHTML(container, '<div class="aa-empty">📅 No daily data yet</div>');
            return;
        }

        var html = '<table class="aa-table"><thead><tr><th>Date</th><th>Clicks</th><th>Time Saved</th></tr></thead><tbody>';
        days.forEach(function (day) {
            var d = stats.dailyStats[day];
            html += '<tr><td>' + day + '</td><td>' + d.clicks + '</td><td>' + formatTime(d.timeSaved) + '</td></tr>';
        });
        html += '</tbody></table>';
        safeSetInnerHTML(container, html);
    }

    function renderProjectStats() {
        var container = document.getElementById('aa-project-stats');
        if (!container) return;

        var projects = Object.keys(stats.projectStats || {});
        if (projects.length === 0) {
            safeSetInnerHTML(container, '<div class="aa-empty">📁 No project data yet</div>');
            return;
        }

        projects.sort(function (a, b) {
            return stats.projectStats[b].clicks - stats.projectStats[a].clicks;
        });

        var html = '<table class="aa-table"><thead><tr><th>Project</th><th>Clicks</th><th>Time Saved</th></tr></thead><tbody>';
        projects.forEach(function (proj) {
            var p = stats.projectStats[proj];
            html += '<tr><td>' + proj + '</td><td>' + p.clicks + '</td><td>' + formatTime(p.timeSaved) + '</td></tr>';
        });
        html += '</tbody></table>';
        safeSetInnerHTML(container, html);
    }

    function togglePanel() {
        var panel = document.getElementById('aa-floating-panel');
        var btn = document.getElementById('aa-floating-btn');
        if (panel && btn) {
            panel.classList.toggle('open');
            state.panelOpen = panel.classList.contains('open');

            if (state.panelOpen) {
                var btnRect = btn.getBoundingClientRect();
                var panelWidth = 360;
                var panelRight = window.innerWidth - btnRect.right;
                var panelTop = btnRect.bottom + 8;

                if (panelRight + panelWidth > window.innerWidth - 20) {
                    panelRight = window.innerWidth - panelWidth - 20;
                }
                if (panelTop + 520 > window.innerHeight) {
                    panelTop = btnRect.top - 520 - 8;
                }

                panel.style.right = Math.max(10, panelRight) + 'px';
                panel.style.top = Math.max(10, panelTop) + 'px';

                switchTab(state.currentTab);
            }
        }
    }

    function updateFloatingBtn() {
        var btn = document.getElementById('aa-floating-btn');
        if (btn) {
            btn.classList.toggle('disabled', !config.enabled);
            btn.classList.toggle('ai-working', state.wasAIWorking);
            btn.textContent = state.wasAIWorking ? '⚡' : (config.enabled ? '🤖' : '💤');
        }
    }

    function updateStatsDisplay() {
        var clicksEl = document.getElementById('aa-stat-clicks');
        var timeEl = document.getElementById('aa-stat-time');
        if (clicksEl) clicksEl.textContent = stats.clicks;
        if (timeEl) timeEl.textContent = formatTime(stats.timeSaved);

        if (state.panelOpen) {
            if (state.currentTab === 'daily') renderDailyStats();
            if (state.currentTab === 'projects') renderProjectStats();
        }
    }

    function stopScript() {
        saveSessionOnUnload();
        if (window.AA27_INTERVAL) clearInterval(window.AA27_INTERVAL);
        if (window.AA27_WATCHER) clearInterval(window.AA27_WATCHER);
        var btn = document.getElementById('aa-floating-btn');
        var panel = document.getElementById('aa-floating-panel');
        if (btn) btn.remove();
        if (panel) panel.remove();
        log('🛑 Script stopped');
    }

    // ========================================
    // Initialize
    // ========================================

    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
        Notification.requestPermission();
    }

    if (window.speechSynthesis) {
        window.speechSynthesis.getVoices();
    }

    createUI();

    // Check sound server
    setTimeout(checkSoundServer, 500);

    window.AA27_INTERVAL = setInterval(findAndClick, config.checkIntervalMs);
    window.AA27_WATCHER = setInterval(watchAIStatus, 1000);

    findAndClick();
    updateFloatingBtn();

    console.log('------------------------------------------------');
    console.log('🚀 Auto Accept ' + VERSION + ' Started!');
    console.log('🎵 Custom Sounds: ' + customSoundFiles.length + ' files (น้าค่อม edition!)');
    console.log('📌 Run sound-server.bat first for custom sounds');
    console.log('💾 Stats saved: ' + stats.clicks + ' clicks, ' + formatTime(stats.timeSaved) + ' saved');
    console.log('------------------------------------------------');

})();
