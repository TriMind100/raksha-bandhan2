document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const introScreen = document.getElementById('introScreen');
    const cardScreen = document.getElementById('cardScreen');
    const envelopeWrapper = document.getElementById('envelopeWrapper');
    const waxSeal = document.getElementById('waxSeal');
    
    // Header names and badge
    const badgeFromText = document.getElementById('badgeFromText');
    const badgeToText = document.getElementById('badgeToText');
    
    // Tab inputs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    // Sibling wishes letter elements
    const letterTo = document.getElementById('letterTo');
    const letterFrom = document.getElementById('letterFrom');
    const letterBodyText = document.getElementById('letterBodyText');
    
    // Virtual Ritual elements
    const indicatorTilak = document.getElementById('indicatorTilak');
    const indicatorRakhi = document.getElementById('indicatorRakhi');
    const indicatorAarti = document.getElementById('indicatorAarti');
    
    const foreheadTarget = document.getElementById('foreheadTarget');
    const wristTarget = document.getElementById('wristTarget');
    const arenaDisplay = document.getElementById('arenaDisplay');
    const appliedTilak = document.getElementById('appliedTilak');
    const tiedRakhiThreads = document.getElementById('tiedRakhiThreads');
    const tiedRakhiWrapper = document.getElementById('tiedRakhiWrapper');
    const aartiGlowOverlay = document.getElementById('aartiGlowOverlay');
    const aartiHighlight = document.getElementById('aartiHighlight');
    const virtualDiyaOverlay = document.getElementById('virtualDiyaOverlay');
    
    const toolTilak = document.getElementById('toolTilak');
    const toolRakhi = document.getElementById('toolRakhi');
    const toolAarti = document.getElementById('toolAarti');
    const plateItems = document.querySelectorAll('.plate-item');
    const instructionText = document.getElementById('instructionText');
    
    // Memory Carousel
    const memoryCards = document.querySelectorAll('.memory-card');
    const carouselDots = document.querySelectorAll('.carousel-dots .dot');
    
    // Link Builder Form
    const createWishForm = document.getElementById('createWishForm');
    const inputFrom = document.getElementById('inputFrom');
    const inputTo = document.getElementById('inputTo');
    const selectMessage = document.getElementById('selectMessage');
    const customMessageGroup = document.getElementById('customMessageGroup');
    const textCustomMessage = document.getElementById('textCustomMessage');
    const shareOutput = document.getElementById('shareOutput');
    const outputUrl = document.getElementById('outputUrl');
    const btnCopy = document.getElementById('btnCopy');
    const shareWhatsApp = document.getElementById('shareWhatsApp');
    const btnNewWish = document.getElementById('btnNewWish');
    
    // Music Controls
    const musicToggle = document.getElementById('musicToggle');
    const musicOnIcon = document.getElementById('musicOnIcon');
    const musicOffIcon = document.getElementById('musicOffIcon');
    
    // Sparkles
    const sparkleContainer = document.getElementById('sparkleContainer');

    // Web Audio Synthesizer State
    let audioCtx = null;
    let synthInterval = null;
    let isMusicPlaying = false;
    
    // Ritual state
    let activeTool = 'tilak'; // 'tilak', 'rakhi', 'aarti'
    let currentRitualStep = 'tilak'; // 'tilak', 'rakhi', 'aarti', 'completed'
    let isAartiActive = false;
    let lastAartiAngle = null;
    let totalAartiRotation = 0;
    
    // Carousel state
    let activeMemoryIndex = 0;

    // Custom Greeting Preset Messages
    const wishPresets = {
        default: "On this auspicious day of Raksha Bandhan, I want to thank you for always being my pillar of strength, my partner in crime, and my protector. No matter how far we are, the sacred thread of Rakhi ties our hearts together forever. Wishing you endless happiness, good health, and success!",
        sweet: "From sharing the last piece of Kaju Katli to constant sibling fights that always ended in laughter. You make my life sweeter just by being in it. Wishing you a wonderful, sweet-filled Raksha Bandhan Bhaiya!",
        protective: "As we celebrate this sacred bond of protection, I pray for your lifelong happiness, prosperity, and joy. You have always protected me, and I wish you all the blessings of the universe. Happy Raksha Bandhan!",
        funny: "Happy Rakhi to the one who still owes me half of their pocket money! Thanks for being my favorite sibling to annoy. Let's promise not to fight today (or at least till the sweets are finished!)."
    };

    // 1. PARTICLES & VISUALS
    function createSparkle() {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        
        // Random dimensions and styling
        const size = Math.random() * 8 + 3;
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        sparkle.style.left = `${Math.random() * 100}vw`;
        
        const duration = Math.random() * 3 + 3;
        sparkle.style.animationDuration = `${duration}s`;
        
        // Slightly random delays
        sparkle.style.animationDelay = `${Math.random() * 2}s`;
        
        sparkleContainer.appendChild(sparkle);
        
        // Remove after animation completes
        setTimeout(() => {
            sparkle.remove();
        }, duration * 1000 + 2000);
    }
    
    // Spawn background sparkles continuously
    setInterval(createSparkle, 300);

    // 2. URL PARSER & CUSTOM MESSAGE LOADER
    function getQueryParams() {
        const params = {};
        const queryString = window.location.search.substring(1);
        const pairs = queryString.split('&');
        for (let i = 0; i < pairs.length; i++) {
            if (!pairs[i]) continue;
            const pair = pairs[i].split('=');
            params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        }
        return params;
    }

    function initCustomGreeting() {
        const params = getQueryParams();
        
        // Fallback names
        let toName = params.to || 'Bhaiya';
        let fromName = params.from || 'Behna';
        let customMsg = params.msg || '';
        let presetKey = params.preset || 'default';
        
        // Update dashboard values
        badgeToText.textContent = toName;
        badgeFromText.textContent = fromName;
        
        letterTo.textContent = toName;
        letterFrom.textContent = fromName;
        
        // Message determination
        if (customMsg) {
            letterBodyText.textContent = customMsg;
        } else if (wishPresets[presetKey]) {
            letterBodyText.textContent = wishPresets[presetKey];
        } else {
            letterBodyText.textContent = wishPresets.default;
        }
    }
    
    initCustomGreeting();

    // 3. ENVELOPE OPENING HANDLER
    waxSeal.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Break seal
        waxSeal.classList.add('broken');
        
        // Sound and audio init
        initAudio();
        
        setTimeout(() => {
            // Open top flap
            envelopeWrapper.classList.add('open');
            
            // Short delay, then slide card out and transition screen
            setTimeout(() => {
                introScreen.classList.add('fade-out');
                
                setTimeout(() => {
                    introScreen.classList.add('hidden');
                    cardScreen.classList.remove('hidden');
                    
                    // Trigger custom celebratory sparkles
                    for (let i = 0; i < 20; i++) {
                        setTimeout(createSparkle, i * 100);
                    }
                    
                    // Show music toggle buttons
                    musicToggle.classList.remove('hidden');
                    startAmbientMusic();
                    // Initialize sliding indicator underline position
                    setTimeout(updateTabIndicator, 200);
                }, 1000);
            }, 1200);
        }, 600);
    });

    // 4. TAB NAVIGATION & INDICATOR
    function updateTabIndicator() {
        const activeTab = document.querySelector('.tab-btn.active');
        const indicator = document.getElementById('tabIndicatorLine');
        if (activeTab && indicator) {
            indicator.style.width = `${activeTab.offsetWidth}px`;
            indicator.style.left = `${activeTab.offsetLeft}px`;
        }
    }
    
    // Listen to resize to keep indicator aligned
    window.addEventListener('resize', updateTabIndicator);

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Set button state
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateTabIndicator(); // Slide indicator underline to new tab!
            
            // Display matching pane
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === `pane${targetTab.charAt(0).toUpperCase() + targetTab.slice(1)}`) {
                    pane.classList.add('active');
                }
            });
            
            // Clean up custom states when leaving Ritual tab
            if (targetTab !== 'ritual') {
                stopAartiTracking();
            } else {
                updateRitualLayout();
            }
        });
    });

    // 5. MEMORY CAROUSEL CONTROL
    function updateCarousel() {
        memoryCards.forEach((card, index) => {
            card.className = 'memory-card';
            
            if (index === activeMemoryIndex) {
                card.classList.add('active');
            } else if (index === (activeMemoryIndex + 1) % memoryCards.length) {
                card.classList.add('next');
            } else {
                card.classList.add('prev');
            }
        });
        
        carouselDots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === activeMemoryIndex) {
                dot.classList.add('active');
            }
        });
    }
    
    carouselDots.forEach(dot => {
        dot.addEventListener('click', () => {
            activeMemoryIndex = parseInt(dot.getAttribute('data-index'));
            updateCarousel();
            playAudioTick();
        });
    });
    
    // Auto rotate memories slowly
    let carouselTimer = setInterval(() => {
        if (!cardScreen.classList.contains('hidden') && document.getElementById('paneMemories').classList.contains('active')) {
            activeMemoryIndex = (activeMemoryIndex + 1) % memoryCards.length;
            updateCarousel();
        }
    }, 7000);

    // 6. VIRTUAL RITUAL LOGIC
    
    // Plate Item Tool selection
    plateItems.forEach(item => {
        item.addEventListener('click', () => {
            // Cannot select tools out of order or if complete
            const toolType = item.id.replace('tool', '').toLowerCase();
            
            if (currentRitualStep === 'completed') {
                return;
            }
            
            if (toolType === currentRitualStep) {
                setActiveTool(toolType);
                playAudioTick();
            } else {
                // Show warning message
                let missingAction = '';
                if (currentRitualStep === 'tilak') missingAction = 'Apply Kumkum Tilak first!';
                else if (currentRitualStep === 'rakhi') missingAction = 'Tie the Sacred Rakhi first!';
                else if (currentRitualStep === 'aarti') missingAction = 'Perform the Aarti ritual first!';
                
                instructionText.textContent = `⚠️ Please follow the sequence. ${missingAction}`;
                instructionText.style.color = '#ef4444';
                setTimeout(() => {
                    instructionText.style.color = 'var(--text-light)';
                    updateRitualInstructions();
                }, 2000);
            }
        });
    });

    function setActiveTool(tool) {
        activeTool = tool;
        plateItems.forEach(item => item.classList.remove('active-tool'));
        document.getElementById(`tool${tool.charAt(0).toUpperCase() + tool.slice(1)}`).classList.add('active-tool');
        
        // Remove old cursor classes
        arenaDisplay.className = 'arena-display';
        
        if (tool === 'tilak') {
            arenaDisplay.classList.add('cursor-tilak');
        } else if (tool === 'rakhi') {
            arenaDisplay.classList.add('cursor-rakhi');
        } else if (tool === 'aarti') {
            arenaDisplay.classList.add('cursor-aarti');
        }
        
        updateRitualInstructions();
    }

    function updateRitualInstructions() {
        if (currentRitualStep === 'tilak') {
            instructionText.textContent = "Tap on Bhaiya's forehead in the glowing target area to apply Tilak.";
        } else if (currentRitualStep === 'rakhi') {
            instructionText.textContent = "Tap on the wrist target to tie the premium Rakhi threads.";
        } else if (currentRitualStep === 'aarti') {
            instructionText.textContent = "Click & move in circular motions around the arena to perform virtual Aarti.";
        } else if (currentRitualStep === 'completed') {
            instructionText.textContent = "Virtual Rakhi rituals successfully completed with love! ❤️";
        }
    }

    function updateRitualLayout() {
        arenaDisplay.classList.remove('forehead-active', 'wrist-active');
        
        if (currentRitualStep === 'tilak') {
            arenaDisplay.classList.add('forehead-active');
            setActiveTool('tilak');
        } else if (currentRitualStep === 'rakhi') {
            arenaDisplay.classList.add('wrist-active');
            setActiveTool('rakhi');
        } else if (currentRitualStep === 'aarti') {
            setActiveTool('aarti');
            startAartiTracking();
        } else if (currentRitualStep === 'completed') {
            arenaDisplay.className = 'arena-display';
            updateRitualInstructions();
        }
    }

    // Tilak Apply Interaction
    foreheadTarget.addEventListener('click', () => {
        if (currentRitualStep === 'tilak' && activeTool === 'tilak') {
            appliedTilak.classList.remove('hidden');
            triggerConfetti(5);
            playHighChime();
            
            // Advance step
            indicatorTilak.classList.add('completed');
            indicatorTilak.classList.remove('active');
            // Change number to checkmark
            const stepNum = indicatorTilak.querySelector('.step-num');
            if (stepNum) stepNum.innerHTML = '✓';
            
            // Animate line fill
            const lineFill = document.getElementById('lineFill1');
            if (lineFill) lineFill.classList.add('active');
            
            indicatorRakhi.classList.add('active');
            
            currentRitualStep = 'rakhi';
            updateRitualLayout();
        }
    });

    // Rakhi Tie Interaction
    wristTarget.addEventListener('click', () => {
        if (currentRitualStep === 'rakhi' && activeTool === 'rakhi') {
            // Show SVG wrapping threads
            if (tiedRakhiThreads) tiedRakhiThreads.classList.remove('hidden');
            // Add tied thread class for SVG drawing
            arenaDisplay.classList.add('wrist-active-tied');
            // Show main luxury medallion overlay
            if (tiedRakhiWrapper) {
                tiedRakhiWrapper.classList.remove('hidden');
                tiedRakhiWrapper.classList.add('show');
            }
            triggerConfetti(25);
            playRitualSuccessSound();
            
            // Advance step
            indicatorRakhi.classList.add('completed');
            indicatorRakhi.classList.remove('active');
            // Change number to checkmark
            const stepNum = indicatorRakhi.querySelector('.step-num');
            if (stepNum) stepNum.innerHTML = '✓';
            
            // Animate line fill
            const lineFill = document.getElementById('lineFill2');
            if (lineFill) lineFill.classList.add('active');
            
            indicatorAarti.classList.add('active');
            
            currentRitualStep = 'aarti';
            updateRitualLayout();
        }
    });

    // Aarti Circle Tracking Interaction
    function startAartiTracking() {
        virtualDiyaOverlay.classList.remove('hidden');
        arenaDisplay.addEventListener('mousemove', handleAartiMovement);
        arenaDisplay.addEventListener('touchmove', handleAartiTouchMovement, { passive: false });
        lastAartiAngle = null;
        totalAartiRotation = 0;
    }

    function stopAartiTracking() {
        virtualDiyaOverlay.classList.add('hidden');
        arenaDisplay.removeEventListener('mousemove', handleAartiMovement);
        arenaDisplay.removeEventListener('touchmove', handleAartiTouchMovement);
    }

    function handleAartiTouchMovement(e) {
        e.preventDefault();
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            const rect = arenaDisplay.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            processAartiPosition(x, y);
        }
    }

    function handleAartiMovement(e) {
        const rect = arenaDisplay.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        processAartiPosition(x, y);
    }

    function processAartiPosition(x, y) {
        // Move thali plate overlay (centered)
        virtualDiyaOverlay.style.left = `${x - 55}px`;
        virtualDiyaOverlay.style.top = `${y - 55}px`;
        
        // Update circular flame lighting overlay dynamically
        if (aartiHighlight) {
            aartiHighlight.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(253, 224, 71, 0.28) 0%, rgba(253, 224, 71, 0.08) 45%, rgba(0,0,0,0) 70%)`;
        }
        
        // Calculate angle relative to center of arena
        const centerX = arenaDisplay.clientWidth / 2;
        const centerY = arenaDisplay.clientHeight / 2;
        
        const dx = x - centerX;
        const dy = y - centerY;
        const currentAngle = Math.atan2(dy, dx);
        
        if (lastAartiAngle !== null) {
            let diff = currentAngle - lastAartiAngle;
            
            // Handle wrap-around boundary crossings (-PI to PI)
            if (diff > Math.PI) {
                diff -= 2 * Math.PI;
            } else if (diff < -Math.PI) {
                diff += 2 * Math.PI;
            }
            
            totalAartiRotation += diff;
            
            // Aarti glow change based on movement
            const pct = Math.min(Math.abs(totalAartiRotation) / (4 * Math.PI), 1);
            aartiGlowOverlay.style.background = `radial-gradient(circle at 50% 50%, rgba(251, 191, 36, ${pct * 0.45}) 0%, rgba(0,0,0,0) 70%)`;
            
            // Completed 2 full rotations (4 * PI)
            if (Math.abs(totalAartiRotation) >= 4 * Math.PI) {
                completeRituals();
            }
        }
        
        lastAartiAngle = currentAngle;
    }

    function completeRituals() {
        stopAartiTracking();
        currentRitualStep = 'completed';
        indicatorAarti.classList.add('completed');
        indicatorAarti.classList.remove('active');
        // Change number to checkmark
        const stepNum = indicatorAarti.querySelector('.step-num');
        if (stepNum) stepNum.innerHTML = '✓';
        
        // Ritual Success visual cues
        aartiGlowOverlay.style.background = 'radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.5) 0%, rgba(0,0,0,0) 80%)';
        triggerConfetti(50);
        playRitualSuccessSound();
        
        // Light up background sparkles
        for (let i = 0; i < 20; i++) {
            setTimeout(createSparkle, i * 150);
        }
        
        updateRitualLayout();
    }

    // 7. CUSTOM CONFETTI GENERATOR
    function triggerConfetti(count) {
        for (let i = 0; i < count; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = `${Math.random() * 8 + 6}px`;
            confetti.style.height = `${Math.random() * 12 + 8}px`;
            
            // Premium festival colors
            const colors = ['#f59e0b', '#ea580c', '#ec4899', '#3b82f6', '#10b981', '#ffffff'];
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Random source at bottom/mid-screen
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.bottom = `-10px`;
            confetti.style.zIndex = '9999';
            confetti.style.borderRadius = '2px';
            
            document.body.appendChild(confetti);
            
            // Dynamics
            const destX = (Math.random() - 0.5) * 400; // spread
            const destY = -(Math.random() * 600 + 400); // height
            const rotation = Math.random() * 720;
            
            confetti.animate([
                { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
                { transform: `translate(${destX}px, ${destY}px) rotate(${rotation}deg)`, opacity: 0 }
            ], {
                duration: Math.random() * 1500 + 1500,
                easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)',
                fill: 'forwards'
            });
            
            setTimeout(() => confetti.remove(), 3000);
        }
    }

    // 8. SHARE LINK GENERATION FORM
    selectMessage.addEventListener('change', () => {
        if (selectMessage.value === 'custom') {
            customMessageGroup.classList.remove('hidden');
        } else {
            customMessageGroup.classList.add('hidden');
        }
    });

    createWishForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const fromVal = inputFrom.value.trim();
        const toVal = inputTo.value.trim();
        const presetVal = selectMessage.value;
        let msgVal = '';
        
        if (presetVal === 'custom') {
            msgVal = textCustomMessage.value.trim();
        }
        
        // Base URI
        const baseUrl = window.location.href.split('?')[0];
        let shareUrl = `${baseUrl}?to=${encodeURIComponent(toVal)}&from=${encodeURIComponent(fromVal)}`;
        
        if (presetVal === 'custom') {
            shareUrl += `&msg=${encodeURIComponent(msgVal)}`;
        } else {
            shareUrl += `&preset=${encodeURIComponent(presetVal)}`;
        }
        
        // Display generated url
        outputUrl.value = shareUrl;
        shareOutput.classList.remove('hidden');
        
        // WhatsApp API text setup
        const whatsappText = `✨ Open this beautiful premium Raksha Bandhan wishing card from ${fromVal}! ❤️ Apply virtual Tilak, tie a Rakhi, and perform Aarti! Click here: ${shareUrl}`;
        shareWhatsApp.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`;
        
        playHighChime();
    });

    btnCopy.addEventListener('click', () => {
        outputUrl.select();
        outputUrl.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(outputUrl.value).then(() => {
            btnCopy.textContent = 'Copied!';
            playHighChime();
            setTimeout(() => {
                btnCopy.textContent = 'Copy Link';
            }, 2500);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    });

    btnNewWish.addEventListener('click', () => {
        createWishForm.reset();
        customMessageGroup.classList.add('hidden');
        shareOutput.classList.add('hidden');
        playAudioTick();
    });


    // 9. WEB AUDIO API SYNTHESIZER
    
    function initAudio() {
        if (audioCtx) return;
        
        // Standard cross-browser setup
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();
    }
    
    // Play sweet pentatonic classical chimes
    function playAmbientChime() {
        if (!audioCtx || audioCtx.state === 'suspended') return;
        
        // Pentatonic Scale representing beautiful meditative bells (Raga Bhupali vibes: C, D, E, G, A)
        const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];
        // Select random note
        const freq = notes[Math.floor(Math.random() * notes.length)];
        
        const now = audioCtx.currentTime;
        
        // Primary oscillator (Sine)
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        
        // Sub-oscillator (Triangle) for rich wood-like chime warmth
        const oscSub = audioCtx.createOscillator();
        oscSub.type = 'triangle';
        oscSub.frequency.setValueAtTime(freq / 2, now); // Octave down
        
        // Chime metallic high ring (overtone sine)
        const oscRing = audioCtx.createOscillator();
        oscRing.type = 'sine';
        oscRing.frequency.setValueAtTime(freq * 3.01, now); // Metallic non-harmonic overtone
        
        // Envelope/Gain Node
        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.12, now + 0.05); // quick attack
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 3.0); // long decay
        
        // Filter for warmth
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.Q.value = 1;
        filter.frequency.setValueAtTime(1200, now);
        filter.frequency.exponentialRampToValueAtTime(300, now + 2.5);
        
        // Connections
        osc.connect(filter);
        oscSub.connect(filter);
        oscRing.connect(filter);
        
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        // Play
        osc.start(now);
        oscSub.start(now);
        oscRing.start(now);
        
        osc.stop(now + 3.2);
        oscSub.stop(now + 3.2);
        oscRing.stop(now + 3.2);
    }
    
    function playAudioTick() {
        if (!audioCtx || audioCtx.state === 'suspended') return;
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.08);
        
        gainNode.gain.setValueAtTime(0.03, now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.start(now);
        osc.stop(now + 0.1);
    }
    
    function playHighChime() {
        if (!audioCtx || audioCtx.state === 'suspended') return;
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, now); // B5 note
        osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6 note
        
        gainNode.gain.setValueAtTime(0.08, now);
        gainNode.gain.linearRampToValueAtTime(0.08, now + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.start(now);
        osc.stop(now + 0.7);
    }

    function playRitualSuccessSound() {
        if (!audioCtx || audioCtx.state === 'suspended') return;
        const now = audioCtx.currentTime;
        
        // Happy chord arpeggio (C Major Arpeggio: C5 -> E5 -> G5 -> C6)
        const chord = [523.25, 659.25, 783.99, 1046.50];
        
        chord.forEach((freq, idx) => {
            const noteTime = now + (idx * 0.12);
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, noteTime);
            
            gainNode.gain.setValueAtTime(0, noteTime);
            gainNode.gain.linearRampToValueAtTime(0.08, noteTime + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.8);
            
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            osc.start(noteTime);
            osc.stop(noteTime + 0.9);
        });
    }

    function startAmbientMusic() {
        if (!audioCtx) return;
        
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        
        isMusicPlaying = true;
        musicToggle.classList.add('playing');
        musicOnIcon.classList.add('hidden');
        musicOffIcon.classList.remove('hidden');
        
        // Play first chime immediately
        playAmbientChime();
        
        // Loop ambient notes periodically
        synthInterval = setInterval(() => {
            if (isMusicPlaying) {
                // Occasional chime, randomize timing slightly
                if (Math.random() > 0.3) {
                    playAmbientChime();
                }
            }
        }, 1800);
    }

    function stopAmbientMusic() {
        isMusicPlaying = false;
        musicToggle.classList.remove('playing');
        musicOnIcon.classList.remove('hidden');
        musicOffIcon.classList.add('hidden');
        
        if (synthInterval) {
            clearInterval(synthInterval);
            synthInterval = null;
        }
    }

    musicToggle.addEventListener('click', () => {
        if (isMusicPlaying) {
            stopAmbientMusic();
        } else {
            initAudio();
            startAmbientMusic();
        }
    });
});
