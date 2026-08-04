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
    const orbitHint3D = document.getElementById('orbitHint3D');
    let ritual3D = null;
    
    const toolTilak = document.getElementById('toolTilak');
    const toolRakhi = document.getElementById('toolRakhi');
    const toolAarti = document.getElementById('toolAarti');
    const plateItems = document.querySelectorAll('.plate-item');
    const instructionText = document.getElementById('instructionText');
    
    // Memory Carousel
    const memoryCards = document.querySelectorAll('.memory-card');
    const carouselDots = document.querySelectorAll('.carousel-dots .dot');
    

    
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
    let droneOsc1 = null;
    let droneOsc2 = null;
    let droneGain = null;
    let melodyStep = 0;
    
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

    let finalLetterMessage = "";

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
            finalLetterMessage = customMsg;
        } else if (wishPresets[presetKey]) {
            finalLetterMessage = wishPresets[presetKey];
        } else {
            finalLetterMessage = wishPresets.default;
        }
        
        // Clear message for typewriter
        letterBodyText.textContent = '';
    }

    function runTypewriterEffect() {
        const text = finalLetterMessage;
        letterBodyText.textContent = '';
        let index = 0;
        
        function typeChar() {
            if (index < text.length) {
                letterBodyText.textContent += text.charAt(index);
                index++;
                setTimeout(typeChar, 35);
            } else {
                // Fade in next step button
                const actionContainer = document.getElementById('wishActionContainer');
                if (actionContainer) {
                    actionContainer.classList.remove('hidden');
                    actionContainer.style.opacity = '0';
                    actionContainer.style.transition = 'opacity 0.8s ease';
                    setTimeout(() => {
                        actionContainer.style.opacity = '1';
                    }, 50);
                }
            }
        }
        
        typeChar();
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
                    
                    // Show music button and start background song
                    musicToggle.classList.remove('hidden');
                    startAmbientMusic();
                    
                    // Show Back button
                    const btnCardBack = document.getElementById('btnCardBack');
                    if (btnCardBack) {
                        btnCardBack.classList.remove('hidden');
                    }
                    
                    // Initialize sliding indicator underline position and run typewriter
                    setTimeout(() => {
                        updateTabIndicator();
                        runTypewriterEffect();
                    }, 200);
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
    
    function switchTab(targetTab) {
        const btn = document.querySelector(`.tab-btn[data-tab="${targetTab}"]`);
        if (!btn) return;
        
        // Remove locked and disabled states
        btn.classList.remove('locked');
        btn.removeAttribute('disabled');
        
        // Set button state
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateTabIndicator();
        
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
        playAudioTick();
    }
    
    // Listen to resize to keep indicator aligned
    window.addEventListener('resize', updateTabIndicator);

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Ignore locked or disabled tabs
            if (btn.hasAttribute('disabled') || btn.classList.contains('locked')) return;
            const targetTab = btn.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });

    // Add Next Buttons Event Listeners
    const btnGoToRitual = document.getElementById('btnGoToRitual');
    const btnGoToMemories = document.getElementById('btnGoToMemories');
    
    if (btnGoToRitual) {
        btnGoToRitual.addEventListener('click', () => {
            // Unlock step 2 tab button
            const stepRitual = document.getElementById('stepRitual');
            if (stepRitual) {
                stepRitual.classList.remove('locked');
                stepRitual.removeAttribute('disabled');
            }
            // Mark step 1 tab button as completed
            const stepWish = document.getElementById('stepWish');
            if (stepWish) {
                stepWish.classList.add('completed');
            }
            switchTab('ritual');
        });
    }
    
    if (btnGoToMemories) {
        btnGoToMemories.addEventListener('click', () => {
            // Unlock step 3 tab button
            const stepMemories = document.getElementById('stepMemories');
            if (stepMemories) {
                stepMemories.classList.remove('locked');
                stepMemories.removeAttribute('disabled');
            }
            // Mark step 2 tab button as completed
            const stepRitual = document.getElementById('stepRitual');
            if (stepRitual) {
                stepRitual.classList.add('completed');
            }
            switchTab('memories');
        });
    }

    // Back Button Event Listener
    const btnCardBack = document.getElementById('btnCardBack');
    if (btnCardBack) {
        btnCardBack.addEventListener('click', () => {
            const activeTabBtn = document.querySelector('.tab-btn.active');
            if (!activeTabBtn) return;
            
            const currentTab = activeTabBtn.getAttribute('data-tab');
            playAudioTick();
            
            if (currentTab === 'wish') {
                // Go back to closed envelope screen
                btnCardBack.classList.add('hidden');
                cardScreen.classList.add('hidden');
                introScreen.classList.remove('hidden', 'fade-out');
                
                // Reset wax seal and envelope states
                waxSeal.classList.remove('broken');
                envelopeWrapper.classList.remove('open');
                
                // Reset letter typewriter state and lock stepper tabs
                letterBodyText.textContent = '';
                const wishActionContainer = document.getElementById('wishActionContainer');
                if (wishActionContainer) {
                    wishActionContainer.classList.add('hidden');
                }
                
                // Relock stepper tabs
                const stepWish = document.getElementById('stepWish');
                const stepRitual = document.getElementById('stepRitual');
                const stepMemories = document.getElementById('stepMemories');
                
                if (stepWish) {
                    stepWish.classList.remove('completed');
                    stepWish.classList.add('active');
                }
                if (stepRitual) {
                    stepRitual.classList.add('locked');
                    stepRitual.setAttribute('disabled', 'true');
                    stepRitual.classList.remove('completed', 'active');
                }
                if (stepMemories) {
                    stepMemories.classList.add('locked');
                    stepMemories.setAttribute('disabled', 'true');
                    stepMemories.classList.remove('completed', 'active');
                }
                
                // stopAmbientMusic(); // disabled — add your own audio file
            } else if (currentTab === 'ritual') {
                // Switch back to Wish step
                switchTab('wish');
            } else if (currentTab === 'memories') {
                // Switch back to Ritual step
                switchTab('ritual');
            }
        });
    }

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

    // Swipe support for Memories Carousel (working from both sides, infinite loop)
    const carouselContainer = document.querySelector('.memories-carousel-container');
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (carouselContainer) {
        // Touch events for mobile
        carouselContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            // Clear auto rotate timer when user interacts
            if (carouselTimer) {
                clearInterval(carouselTimer);
                carouselTimer = null;
            }
        }, { passive: true });
        
        carouselContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        // Mouse events for desktop dragging
        let isMouseDown = false;
        carouselContainer.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            touchStartX = e.screenX;
            if (carouselTimer) {
                clearInterval(carouselTimer);
                carouselTimer = null;
            }
        });
        
        carouselContainer.addEventListener('mouseup', (e) => {
            if (!isMouseDown) return;
            isMouseDown = false;
            touchEndX = e.screenX;
            handleSwipe();
        });
        
        carouselContainer.addEventListener('mouseleave', () => {
            isMouseDown = false;
        });
    }
    
    function handleSwipe() {
        const threshold = 40; // minimum drag distance
        const diffX = touchEndX - touchStartX;
        
        if (Math.abs(diffX) > threshold) {
            if (diffX < 0) {
                // Swiped Left -> Next Card (never-ending loop)
                activeMemoryIndex = (activeMemoryIndex + 1) % memoryCards.length;
            } else {
                // Swiped Right -> Prev Card (never-ending loop)
                activeMemoryIndex = (activeMemoryIndex - 1 + memoryCards.length) % memoryCards.length;
            }
            updateCarousel();
            playAudioTick();
        }
    }

    // 6. VIRTUAL RITUAL LOGIC & 3D ENGINE INTEGRATION

    // Photorealistic 3D Hand & 3D Rakhi Engine Class
    class Ritual3DEngine {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) return;
            
            this.isInitialized = false;
            this.isTied = false;
            this.isAnimating = false;
            this.wrapProgress = 0;
            
            this.isDragging = false;
            this.previousMousePosition = { x: 0, y: 0 };
            this.targetRotation = { x: 0.15, y: 0 };
            this.currentRotation = { x: 0.15, y: 0 };

            this.initScene();
        }

        initScene() {
            if (typeof THREE === 'undefined') return;

            const rect = this.canvas.parentElement.getBoundingClientRect();
            this.width = rect.width || 400;
            this.height = rect.height || 300;

            this.renderer = new THREE.WebGLRenderer({
                canvas: this.canvas,
                alpha: true,
                antialias: true,
                powerPreference: 'high-performance'
            });
            this.renderer.setSize(this.width, this.height);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

            this.scene = new THREE.Scene();

            this.camera = new THREE.PerspectiveCamera(38, this.width / this.height, 0.1, 100);
            this.camera.position.set(0, 0, 5.2);
            this.camera.lookAt(0, -0.5, 0);

            this.setupLights();

            this.handGroup = new THREE.Group();
            this.scene.add(this.handGroup);

            this.create3DHand();
            this.create3DRakhi();
            this.createParticleSystem();
            this.setupEventListeners();

            this.isInitialized = true;
            this.animate();
        }

        setupLights() {
            // Soft Warm Ambient Light
            const ambientLight = new THREE.AmbientLight(0xfff1e6, 0.55);
            this.scene.add(ambientLight);

            // Primary Warm Key Directional Light
            this.keyLight = new THREE.DirectionalLight(0xfff7ed, 0.9);
            this.keyLight.position.set(2.5, 4, 3);
            this.keyLight.castShadow = true;
            this.keyLight.shadow.mapSize.width = 1024;
            this.keyLight.shadow.mapSize.height = 1024;
            this.keyLight.shadow.bias = -0.0005;
            this.scene.add(this.keyLight);

            // Gold Festival Rim Light
            const rimLight = new THREE.DirectionalLight(0xfbbf24, 0.5);
            rimLight.position.set(-3.5, 2, -2);
            this.scene.add(rimLight);

            // Warm Skin Bounce Light
            const bounceLight = new THREE.DirectionalLight(0x7c2d12, 0.35);
            bounceLight.position.set(0, -3.5, 2);
            this.scene.add(bounceLight);

            // Interactive Aarti Diya Light (used in Step 3)
            this.aartiLight = new THREE.PointLight(0xf97316, 0, 8);
            this.aartiLight.position.set(0, 0, 3);
            this.scene.add(this.aartiLight);
        }

        create3DHand() {
            // Skin hand mesh removed per user request.
            // 3D Rakhi medallion and woven threads animate directly over the brother's wrist illustration.
            this.handGroup.position.set(0, 0, 0);
            this.handGroup.rotation.set(0, 0, 0);
        }

        create3DRakhi() {
            this.rakhiGroup = new THREE.Group();

            // Center Gold Medallion Disc
            const discGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.04, 32);
            const goldMat = new THREE.MeshStandardMaterial({
                color: 0xf59e0b,
                metalness: 0.9,
                roughness: 0.2
            });
            const discMesh = new THREE.Mesh(discGeo, goldMat);
            discMesh.castShadow = true;
            this.rakhiGroup.add(discMesh);

            // 8 Lotus Petals
            const petalGeo = new THREE.ConeGeometry(0.09, 0.18, 4);
            petalGeo.rotateX(Math.PI / 2);
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                const petal = new THREE.Mesh(petalGeo, goldMat);
                petal.position.set(Math.cos(angle) * 0.22, 0, Math.sin(angle) * 0.22);
                petal.rotation.y = -angle;
                petal.scale.set(1, 0.3, 1);
                this.rakhiGroup.add(petal);
            }

            // 12 Pearl Ring
            const pearlGeo = new THREE.SphereGeometry(0.025, 16, 16);
            const pearlMat = new THREE.MeshStandardMaterial({
                color: 0xfffef0,
                roughness: 0.1,
                metalness: 0.1
            });
            for (let i = 0; i < 12; i++) {
                const angle = (i / 12) * Math.PI * 2;
                const pearl = new THREE.Mesh(pearlGeo, pearlMat);
                pearl.position.set(Math.cos(angle) * 0.16, 0.03, Math.sin(angle) * 0.16);
                this.rakhiGroup.add(pearl);
            }

            // Center Ruby Gem
            const rubyGeo = new THREE.CylinderGeometry(0.09, 0.07, 0.05, 8);
            const rubyMat = new THREE.MeshStandardMaterial({
                color: 0xdc2626,
                roughness: 0.05,
                metalness: 0.1
            });
            const rubyMesh = new THREE.Mesh(rubyGeo, rubyMat);
            rubyMesh.position.y = 0.035;
            this.rakhiGroup.add(rubyMesh);

            // Dynamic Thread Groups
            this.leftThreadGroup = new THREE.Group();
            this.rightThreadGroup = new THREE.Group();
            this.rakhiGroup.add(this.leftThreadGroup);
            this.rakhiGroup.add(this.rightThreadGroup);

            this.saffronMat = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.6 });
            this.crimsonMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.6 });
            this.brightGoldMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.8, roughness: 0.2 });

            this.rakhiGroup.position.set(0, -0.65, 0.1);
            this.rakhiGroup.visible = false; // Hidden until Kumkum is applied
            this.scene.add(this.rakhiGroup);

            this.updateThreads(0);
        }

        showRakhi() {
            if (this.rakhiGroup) {
                this.rakhiGroup.visible = true;
                this.rakhiGroup.position.set(0, -0.65, 0.1);
            }
        }

        updateThreads(progress) {
            while (this.leftThreadGroup.children.length > 0) {
                const child = this.leftThreadGroup.children[0];
                if (child.geometry) child.geometry.dispose();
                this.leftThreadGroup.remove(child);
            }
            while (this.rightThreadGroup.children.length > 0) {
                const child = this.rightThreadGroup.children[0];
                if (child.geometry) child.geometry.dispose();
                this.rightThreadGroup.remove(child);
            }

            const wristR = 0.32;

            const leftPoints = [];
            const leftMaxAngle = progress * Math.PI * 1.05;
            const steps = 24;

            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const currentAngle = t * leftMaxAngle;
                const z = Math.cos(currentAngle) * wristR - wristR;
                const y = -Math.sin(currentAngle) * wristR;
                const x = -t * 0.7 * (1 - progress * 0.5);
                leftPoints.push(new THREE.Vector3(x, y, z));
            }

            const rightPoints = [];
            const rightMaxAngle = progress * Math.PI * 1.05;

            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const currentAngle = t * rightMaxAngle;
                const z = Math.cos(currentAngle) * wristR - wristR;
                const y = -Math.sin(currentAngle) * wristR;
                const x = t * 0.7 * (1 - progress * 0.5);
                rightPoints.push(new THREE.Vector3(x, y, z));
            }

            if (leftPoints.length > 1) {
                const leftCurve = new THREE.CatmullRomCurve3(leftPoints);
                const tube1 = new THREE.Mesh(new THREE.TubeGeometry(leftCurve, 32, 0.016, 8, false), this.saffronMat);
                const tube2 = new THREE.Mesh(new THREE.TubeGeometry(leftCurve, 32, 0.012, 8, false), this.crimsonMat);
                tube2.position.z += 0.01;
                this.leftThreadGroup.add(tube1);
                this.leftThreadGroup.add(tube2);
            }

            if (rightPoints.length > 1) {
                const rightCurve = new THREE.CatmullRomCurve3(rightPoints);
                const tube1 = new THREE.Mesh(new THREE.TubeGeometry(rightCurve, 32, 0.016, 8, false), this.saffronMat);
                const tube2 = new THREE.Mesh(new THREE.TubeGeometry(rightCurve, 32, 0.012, 8, false), this.brightGoldMat);
                tube2.position.z += 0.01;
                this.rightThreadGroup.add(tube1);
                this.rightThreadGroup.add(tube2);
            }

            if (progress > 0.8) {
                const beadGeo = new THREE.SphereGeometry(0.04, 12, 12);
                const beadLeft = new THREE.Mesh(beadGeo, this.brightGoldMat);
                const beadRight = new THREE.Mesh(beadGeo, this.brightGoldMat);
                
                if (leftPoints.length > 0) beadLeft.position.copy(leftPoints[leftPoints.length - 1]);
                if (rightPoints.length > 0) beadRight.position.copy(rightPoints[rightPoints.length - 1]);

                this.leftThreadGroup.add(beadLeft);
                this.rightThreadGroup.add(beadRight);
            }
        }

        createParticleSystem() {
            const count = 120;
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(count * 3);
            const velocities = new Float32Array(count * 3);
            const colors = new Float32Array(count * 3);

            const palette = [
                new THREE.Color(0xfbbf24),
                new THREE.Color(0xf97316),
                new THREE.Color(0xffffff),
                new THREE.Color(0xef4444)
            ];

            for (let i = 0; i < count; i++) {
                positions[i * 3] = 0;
                positions[i * 3 + 1] = 0;
                positions[i * 3 + 2] = 0;

                const speed = 0.5 + Math.random() * 1.5;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.random() * Math.PI;

                velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
                velocities[i * 3 + 1] = Math.cos(phi) * speed;
                velocities[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * speed;

                const c = palette[Math.floor(Math.random() * palette.length)];
                colors[i * 3] = c.r;
                colors[i * 3 + 1] = c.g;
                colors[i * 3 + 2] = c.b;
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const pMat = new THREE.PointsMaterial({
                size: 0.08,
                vertexColors: true,
                transparent: true,
                opacity: 0
            });

            this.particles = new THREE.Points(geometry, pMat);
            this.particleVelocities = velocities;
            this.scene.add(this.particles);
        }

        triggerGoldParticles() {
            const positions = this.particles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i++) {
                positions[i] = 0;
            }
            this.particles.geometry.attributes.position.needsUpdate = true;
            this.particles.material.opacity = 1;
            this.particleTime = 0;
        }

        updateParticles(delta) {
            if (!this.particles || this.particles.material.opacity <= 0) return;
            this.particleTime += delta;

            const positions = this.particles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length / 3; i++) {
                positions[i * 3] += this.particleVelocities[i * 3] * delta;
                positions[i * 3 + 1] += this.particleVelocities[i * 3 + 1] * delta;
                positions[i * 3 + 2] += this.particleVelocities[i * 3 + 2] * delta;
            }

            this.particles.geometry.attributes.position.needsUpdate = true;
            this.particles.material.opacity = Math.max(0, 1 - this.particleTime * 0.8);
        }

        animateTieRakhi(onComplete) {
            if (this.isAnimating || this.isTied) return;
            this.isAnimating = true;
            if (this.rakhiGroup) this.rakhiGroup.visible = true;

            if (typeof gsap === 'undefined') {
                this.updateThreads(1.0);
                this.rakhiGroup.position.set(0, -0.1, 0.4);
                this.isTied = true;
                this.isAnimating = false;
                if (onComplete) onComplete();
                return;
            }

            const tl = gsap.timeline({
                onComplete: () => {
                    this.isTied = true;
                    this.isAnimating = false;
                    if (onComplete) onComplete();
                }
            });

            tl.to(this.rakhiGroup.position, {
                y: -1.18,
                z: 0.15,
                duration: 0.6,
                ease: "power2.out"
            });

            const self = this;
            const progressObj = { value: 0 };
            tl.to(progressObj, {
                value: 1.0,
                duration: 1.4,
                ease: "power2.inOut",
                onUpdate: function() {
                    self.wrapProgress = progressObj.value;
                    self.updateThreads(progressObj.value);
                }
            });

            tl.to(this.handGroup.position, {
                y: 0.1,
                duration: 0.25,
                yoyo: true,
                repeat: 1,
                ease: "sine.inOut"
            }, "-=0.3");

            tl.add(() => {
                self.triggerGoldParticles();
            }, "-=0.3");

            tl.to(this.targetRotation, {
                x: 0.25,
                y: 0.35,
                duration: 0.8,
                ease: "power2.out"
            });
        }

        updateAartiLight(x, y) {
            if (!this.aartiLight) return;
            const normX = (x / this.width) * 2 - 1;
            const normY = -(y / this.height) * 2 + 1;

            this.aartiLight.position.x = normX * 2.5;
            this.aartiLight.position.y = normY * 1.8;
            this.aartiLight.position.z = 2.0;
            this.aartiLight.intensity = 1.8;
        }

        setupEventListeners() {
            const canvas = this.canvas;

            canvas.addEventListener('mousedown', (e) => {
                if (!this.isTied) return;
                this.isDragging = true;
                this.previousMousePosition = { x: e.clientX, y: e.clientY };
            });

            window.addEventListener('mousemove', (e) => {
                if (!this.isDragging) return;
                const deltaX = e.clientX - this.previousMousePosition.x;
                const deltaY = e.clientY - this.previousMousePosition.y;

                this.targetRotation.y += deltaX * 0.008;
                this.targetRotation.x += deltaY * 0.008;
                this.targetRotation.x = Math.max(-0.4, Math.min(0.6, this.targetRotation.x));

                this.previousMousePosition = { x: e.clientX, y: e.clientY };
            });

            window.addEventListener('mouseup', () => {
                this.isDragging = false;
            });

            canvas.addEventListener('touchstart', (e) => {
                if (!this.isTied || e.touches.length === 0) return;
                this.isDragging = true;
                this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }, { passive: true });

            window.addEventListener('touchmove', (e) => {
                if (!this.isDragging || e.touches.length === 0) return;
                const deltaX = e.touches[0].clientX - this.previousMousePosition.x;
                const deltaY = e.touches[0].clientY - this.previousMousePosition.y;

                this.targetRotation.y += deltaX * 0.008;
                this.targetRotation.x += deltaY * 0.008;
                this.targetRotation.x = Math.max(-0.4, Math.min(0.6, this.targetRotation.x));

                this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }, { passive: true });

            window.addEventListener('touchend', () => {
                this.isDragging = false;
            });

            window.addEventListener('resize', () => {
                if (!this.canvas || !this.renderer || !this.camera) return;
                const rect = this.canvas.parentElement.getBoundingClientRect();
                this.width = rect.width || 400;
                this.height = rect.height || 300;
                this.camera.aspect = this.width / this.height;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(this.width, this.height);
            });
        }

        animate() {
            requestAnimationFrame(() => this.animate());

            if (!this.isInitialized) return;

            this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.08;
            this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.08;
            this.handGroup.rotation.x = this.currentRotation.x;
            this.handGroup.rotation.y = this.currentRotation.y;

            if (this.isTied && this.rakhiGroup) {
                const time = Date.now() * 0.001;
                this.rakhiGroup.rotation.y = Math.sin(time * 0.5) * 0.05;
            }

            this.updateParticles(0.016);
            this.renderer.render(this.scene, this.camera);
        }
    }

    // Initialize 3D Engine
    try {
        if (typeof THREE !== 'undefined') {
            ritual3D = new Ritual3DEngine('ritual3dCanvas');
        }
    } catch (e) {
        console.warn('3D WebGL initialization skipped:', e);
    }
    
    // Plate Item Tool selection
    plateItems.forEach(item => {
        item.addEventListener('click', () => {
            const toolType = item.id.replace('tool', '').toLowerCase();
            
            if (currentRitualStep === 'completed') {
                return;
            }
            
            if (toolType === currentRitualStep) {
                setActiveTool(toolType);
                playAudioTick();
            } else {
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
            instructionText.textContent = "Tap on the wrist target to tie the realistic 3D Rakhi thread on hand!";
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
            const actionContainer = document.getElementById('ritualActionContainer');
            if (actionContainer) {
                actionContainer.classList.remove('hidden');
                actionContainer.style.opacity = '0';
                actionContainer.style.transition = 'opacity 0.8s ease';
                setTimeout(() => {
                    actionContainer.style.opacity = '1';
                }, 50);
            }
        }
    }

    // Tilak Apply Interaction
    foreheadTarget.addEventListener('click', () => {
        if (currentRitualStep === 'tilak' && activeTool === 'tilak') {
            appliedTilak.classList.remove('hidden');
            triggerConfetti(5);
            playHighChime();
            
            indicatorTilak.classList.add('completed');
            indicatorTilak.classList.remove('active');
            const stepNum = indicatorTilak.querySelector('.step-num');
            if (stepNum) stepNum.innerHTML = '✓';
            
            const lineFill = document.getElementById('lineFill1');
            if (lineFill) lineFill.classList.add('active');
            
            indicatorRakhi.classList.add('active');
            
            currentRitualStep = 'rakhi';
            updateRitualLayout();
        }
    });

    // Rakhi Tie Interaction (Triggers Photorealistic 3D Hand & 3D Rakhi Tie Animation)
    wristTarget.addEventListener('click', () => {
        if (currentRitualStep === 'rakhi' && activeTool === 'rakhi') {
            if (ritual3D && !ritual3D.isTied && !ritual3D.isAnimating) {
                ritual3D.animateTieRakhi(() => {
                    if (orbitHint3D) orbitHint3D.classList.remove('hidden');
                    triggerConfetti(35);
                    playRitualSuccessSound();
                    
                    indicatorRakhi.classList.add('completed');
                    indicatorRakhi.classList.remove('active');
                    const stepNum = indicatorRakhi.querySelector('.step-num');
                    if (stepNum) stepNum.innerHTML = '✓';
                    
                    const lineFill = document.getElementById('lineFill2');
                    if (lineFill) lineFill.classList.add('active');
                    
                    indicatorAarti.classList.add('active');
                    
                    currentRitualStep = 'aarti';
                    updateRitualLayout();
                });
            } else if (!ritual3D || ritual3D.isTied) {
                if (tiedRakhiThreads) tiedRakhiThreads.classList.remove('hidden');
                arenaDisplay.classList.add('wrist-active-tied');
                if (tiedRakhiWrapper) {
                    tiedRakhiWrapper.classList.remove('hidden');
                    tiedRakhiWrapper.classList.add('show');
                }
                triggerConfetti(25);
                playRitualSuccessSound();
                
                indicatorRakhi.classList.add('completed');
                indicatorRakhi.classList.remove('active');
                const stepNum = indicatorRakhi.querySelector('.step-num');
                if (stepNum) stepNum.innerHTML = '✓';
                
                const lineFill = document.getElementById('lineFill2');
                if (lineFill) lineFill.classList.add('active');
                
                indicatorAarti.classList.add('active');
                
                currentRitualStep = 'aarti';
                updateRitualLayout();
            }
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

        if (ritual3D) {
            ritual3D.updateAartiLight(x, y);
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

    // 9. WEB AUDIO API SYNTHESIZER
    
    // // Frequencies mapping for Bansuri Flute Synth (Phoolon Ka Taaron Ka tune)
    // const freqMap = {
    //     'C3': 130.81,
    //     'G3': 196.00,
    //     'B3': 246.94,
    //     'C4': 261.63,
    //     'D4': 293.66,
    //     'E4': 329.63,
    //     'F4': 349.23,
    //     'G4': 392.00,
    //     'A4': 440.00,
    //     'B4': 493.88,
    //     'C5': 523.25,
    //     'D5': 587.33,
    //     'E5': 659.25,
    //     '-': 0
    // };
    
    // Emotional bansuri flute medley (Phoolon Ka Taaron Ka + Bhaiya Mere Rakhi Ke Bandhan)
    // const bansuriSong = [
    //     // Phoolon ka taaron ka sabka kehna hai
    //     'C4', 'E4', 'G4', 'G4', 'A4', 'G4', '-', '-',
    //     'F4', 'E4', 'D4', 'E4', 'C4', '-', '-', '-',
    //     // Ek hazaron mein meri behna hai
    //     'C4', 'D4', 'E4', 'F4', 'E4', 'D4', '-', '-',
    //     'D4', 'E4', 'C4', 'B3', 'C4', '-', '-', '-',
    //     // Bhaiya mere rakhi ke bandhan ko nibhana
    //     'G4', 'A4', 'G4', 'E4', 'G4', 'A4', 'C5', '-',
    //     'A4', 'G4', 'E4', 'D4', 'E4', 'G4', '-', '-',
    //     // Bhaiya mere...
    //     'G4', 'A4', 'G4', 'E4', 'D4', 'E4', 'D4', 'C4',
    //     '-', '-', '-', '-', '-', '-', '-', '-'
    // ];

    function initAudio() {
        if (audioCtx) return;
        
        // Standard cross-browser setup
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();
    }
    
    function playFluteNote(noteName) {
        if (!audioCtx || audioCtx.state === 'suspended' || noteName === '-') return;
        const freq = freqMap[noteName];
        if (!freq) return;
        
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const oscTri = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        // Soft breath vibrato LFO
        const vibratoLfo = audioCtx.createOscillator();
        const vibratoGain = audioCtx.createGain();
        vibratoLfo.frequency.setValueAtTime(5.5, now);
        vibratoGain.gain.setValueAtTime(3.5, now);
        
        vibratoLfo.connect(vibratoGain);
        vibratoGain.connect(osc.frequency);
        vibratoGain.connect(oscTri.frequency);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        
        oscTri.type = 'triangle';
        oscTri.frequency.setValueAtTime(freq, now);
        
        const mixGain = audioCtx.createGain();
        mixGain.gain.setValueAtTime(0.04, now);
        
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.06, now + 0.12);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
        
        osc.connect(mixGain);
        oscTri.connect(mixGain);
        mixGain.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        vibratoLfo.start(now);
        osc.start(now);
        oscTri.start(now);
        
        vibratoLfo.stop(now + 1.0);
        osc.stop(now + 1.0);
        oscTri.stop(now + 1.0);
    }

    function startTanpuraDrone() {
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        
        droneOsc1 = audioCtx.createOscillator();
        droneOsc2 = audioCtx.createOscillator();
        droneGain = audioCtx.createGain();
        
        droneOsc1.type = 'sine';
        droneOsc1.frequency.setValueAtTime(freqMap['C3'], now);
        
        droneOsc2.type = 'triangle';
        droneOsc2.frequency.setValueAtTime(freqMap['G3'], now);
        
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, now);
        
        droneGain.gain.setValueAtTime(0, now);
        droneGain.gain.linearRampToValueAtTime(0.025, now + 1.5);
        
        droneOsc1.connect(filter);
        droneOsc2.connect(filter);
        filter.connect(droneGain);
        droneGain.connect(audioCtx.destination);
        
        droneOsc1.start(now);
        droneOsc2.start(now);
    }
    
    function stopTanpuraDrone() {
        const now = audioCtx ? audioCtx.currentTime : 0;
        if (droneGain && audioCtx) {
            try {
                droneGain.gain.cancelScheduledValues(now);
                droneGain.gain.linearRampToValueAtTime(0, now + 0.5);
                setTimeout(() => {
                    if (droneOsc1) { droneOsc1.stop(); droneOsc1 = null; }
                    if (droneOsc2) { droneOsc2.stop(); droneOsc2 = null; }
                }, 600);
            } catch(e) {}
        }
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

    // ============================================================
    //  BACKGROUND MUSIC — plays assets/song.mp3 on loop
    // ============================================================
    const bgAudio = new Audio('assets/song.mp3');
    bgAudio.loop = true;
    bgAudio.volume = 0.25;

    function startAmbientMusic() {
        bgAudio.play().catch(() => {}); // autoplay policy safe
        isMusicPlaying = true;
        musicOnIcon.classList.remove('hidden');
        musicOffIcon.classList.add('hidden');
    }

    function stopAmbientMusic() {
        bgAudio.pause();
        isMusicPlaying = false;
        musicOnIcon.classList.add('hidden');
        musicOffIcon.classList.remove('hidden');
    }

    musicToggle.addEventListener('click', () => {
        if (isMusicPlaying) {
            stopAmbientMusic();
        } else {
            startAmbientMusic();
        }
    });
});
