/* script.js */
document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. PRELOADER Y ANIMACIONES --- */
    const preloader = document.getElementById('preloader');
    const progressBar = document.querySelector('.loading-progress');
    const reveals = document.querySelectorAll('.reveal');

    let progress = 0;
    const loadInterval = setInterval(() => {
        progress += Math.random() * 12;
        if (progress >= 100) {
            progress = 100;
            progressBar.style.width = '100%';
            clearInterval(loadInterval);
            
            setTimeout(() => {
                preloader.classList.add('hidden');
                document.body.classList.remove('is-loading');
                reveals.forEach(el => { setTimeout(() => { el.style.opacity = 1; el.style.transform = 'translateY(0)'; }, el.classList.contains('delay-1') ? 300 : el.classList.contains('delay-2') ? 600 : el.classList.contains('delay-3') ? 900 : 0); });
                initAOS();
            }, 800);
        } else { progressBar.style.width = `${progress}%`; }
    }, 150);

    /* --- 2. NAVEGACIÓN --- */
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => { if (window.scrollY > 50) navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled'); });
    hamburger.addEventListener('click', () => { hamburger.classList.toggle('active'); navMenu.classList.toggle('active'); });
    navLinks.forEach(link => { link.addEventListener('click', () => { hamburger.classList.remove('active'); navMenu.classList.remove('active'); }); });

    /* --- 3. ANIMACIONES AL SCROLL --- */
    function initAOS() {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.getAttribute('data-aos-delay') || 0;
                    entry.target.style.transition = `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`;
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0) scale(1)';
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        document.querySelectorAll('[data-aos]').forEach(el => {
            const effect = el.getAttribute('data-aos');
            if (effect === 'fade-up') { el.style.opacity = 0; el.style.transform = 'translateY(40px)'; }
            if (effect === 'fade-right') { el.style.opacity = 0; el.style.transform = 'translateX(-40px)'; }
            if (effect === 'fade-left') { el.style.opacity = 0; el.style.transform = 'translateX(40px)'; }
            if (effect === 'zoom-in') { el.style.opacity = 0; el.style.transform = 'scale(0.85)'; }
            observer.observe(el);
        });
    }

    const bCanvas = document.getElementById('bokeh-canvas');
    if (bCanvas) {
        const bCtx = bCanvas.getContext('2d');
        let bw, bh; let bParticles = [];
        function resizeBokeh() { bw = bCanvas.width = window.innerWidth; bh = bCanvas.height = window.innerHeight; }
        window.addEventListener('resize', resizeBokeh); resizeBokeh();
        for (let i = 0; i < 40; i++) { bParticles.push({ x: Math.random() * bw, y: Math.random() * bh, r: Math.random() * 12 + 3, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, alpha: Math.random() * 0.4 + 0.1, color: Math.random() > 0.5 ? '229, 152, 155' : '212, 163, 115' }); }
        function drawBokeh() {
            bCtx.clearRect(0, 0, bw, bh);
            bParticles.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > bw) p.vx *= -1; if (p.y < 0 || p.y > bh) p.vy *= -1;
                bCtx.beginPath(); bCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2); bCtx.fillStyle = `rgba(${p.color}, ${p.alpha})`; bCtx.fill();
            });
            requestAnimationFrame(drawBokeh);
        }
        drawBokeh();
    }

    /* --- 4. TOCADISCOS --- */
    const playBtn = document.getElementById('vinyl-play-btn');
    const audioEl = document.getElementById('romantic-audio');
    const theVinyl = document.getElementById('the-vinyl');
    const theTonearm = document.getElementById('the-tonearm');
    const volSlider = document.getElementById('volume-slider');
    let isPlaying = false;

    if (audioEl) {
        audioEl.volume = volSlider.value;
        volSlider.addEventListener('input', e => audioEl.volume = e.target.value);
        playBtn.addEventListener('click', () => {
            if (!isPlaying) {
                audioEl.play().catch(e => console.log('Autoplay bloqueado', e));
                theTonearm.classList.add('playing');
                setTimeout(() => { theVinyl.classList.add('spinning'); }, 800);
                playBtn.innerHTML = `<span class="btn-icon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg></span><span class="btn-text">Pausar</span>`;
            } else {
                audioEl.pause();
                theTonearm.classList.remove('playing');
                theVinyl.classList.remove('spinning');
                playBtn.innerHTML = `<span class="btn-icon"><svg viewBox="0 0 24 24" fill="currentColor" class="icon-play"><path d="M8 5v14l11-7z"/></svg></span><span class="btn-text">Reproducir</span>`;
            }
            isPlaying = !isPlaying;
        });
    }

    /* --- 5. CRONÓMETRO --- */
    const startDate = new Date(2023, 7, 18, 0, 0, 0); 
    function updateCounter() {
        const now = new Date();
        const diff = now - startDate;
        if(diff < 0) return;
        let years = now.getFullYear() - startDate.getFullYear();
        let months = now.getMonth() - startDate.getMonth();
        let days = now.getDate() - startDate.getDate();
        if (days < 0) { months--; const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0); days += prevMonth.getDate(); }
        if (months < 0) { years--; months += 12; }
        const totalSecs = Math.floor(diff / 1000);
        const hours = Math.floor(totalSecs / 3600) % 24;
        const mins = Math.floor(totalSecs / 60) % 60;
        const secs = totalSecs % 60;
        document.getElementById('t-years').innerText = years.toString().padStart(2, '0');
        document.getElementById('t-months').innerText = months.toString().padStart(2, '0');
        document.getElementById('t-days').innerText = days.toString().padStart(2, '0');
        document.getElementById('t-hours').innerText = hours.toString().padStart(2, '0');
        document.getElementById('t-minutes').innerText = mins.toString().padStart(2, '0');
        document.getElementById('t-seconds').innerText = secs.toString().padStart(2, '0');
    }
    setInterval(updateCounter, 1000); updateCounter();

    /* --- 6. GENERADOR DE RAZONES --- */
    const generateBtn = document.getElementById('generate-reason-btn');
    const reasonText = document.getElementById('reason-text');
    const secretMsg = document.getElementById('secret-message');
    
    const razones = [
        "Por todo el amor incondicional que me das.",
        "Porque consigues que cualquier día malo se vuelva el mejor.",
        "Por todas las veces que me has escuchado.",
        "Por tu forma de reírte de mis bromas.",
        "Porque contigo aprendí que el amor verdadero es hermoso.",
        "Por la paciencia que tienes conmigo.",
        "Porque eres la única que me entiende",
        "Porque eres mi mayor motivación para querer ser la mejor versión de mí.",
        "Por cómo te brillan los ojos cuando hablas de lo que te gusta.",
        "Porque a pesar de todo sigues a mi lado y amándome",
        "Porque a tu lado siempre me siento en casa.",
        "Por cómo me abrazas cuando más lo necesito sin que yo tenga que pedirlo.",
        "Porque me conoces mejor que nadie, me aceptas y me amas como soy.",
        "Por todas nuestras bromas internas que nadie más entendería.",
        "Por siempre estar ahí para mí",
        "Porque haces que el mundo sea un lugar mucho más bonito y mejor.",
        "Porque sin ti nada sería igual",

    ];
    
    let clickCount = 0;
    let prevIndex = -1;

    if(generateBtn && reasonText) {
        generateBtn.addEventListener('click', () => {
            clickCount++;
            
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * razones.length);
            } while (randomIndex === prevIndex);
            prevIndex = randomIndex;

            reasonText.classList.add('fade-out');
            setTimeout(() => {
                reasonText.innerText = razones[randomIndex];
                reasonText.classList.remove('fade-out');
            }, 500);

            if(clickCount === 10) {
                secretMsg.innerText = "¿No te cansas de leerlo? Te amo por absolutamente todo.";
                secretMsg.classList.add('show');
                triggerConfetti(30);
            }
        });
    }

    /* --- 7. CARTA MODAL (CON SCROLL NATIVO Y REVERTIDO EL DISPARADOR AL SELLO) --- */
    const mailStage = document.querySelector('.mail-stage');
    const waxSeal = document.getElementById('wax-seal');
    
    const cinematicModal = document.getElementById('cinematic-letter');
    const closeLetterBtn = document.getElementById('close-letter');
    const instruction = document.getElementById('letter-instruction');

    let letterOpen = false;

    if(waxSeal) {
        waxSeal.addEventListener('click', (e) => {
            e.stopPropagation();
            if(!letterOpen) {
                letterOpen = true;
                
                mailStage.classList.add('is-open');
                if(instruction) instruction.style.opacity = '0';
                
                setTimeout(() => {
                    document.body.classList.add('modal-open');
                    cinematicModal.classList.add('active');
                    triggerConfetti(80);
                }, 800); 
            }
        });
    }

    const closeLetterAction = () => {
        if(letterOpen) {
            cinematicModal.classList.remove('active');
            document.body.classList.remove('modal-open');
            
            setTimeout(() => {
                letterOpen = false;
                mailStage.classList.remove('is-open');
                if(instruction) instruction.style.opacity = '1';
            }, 500);
        }
    };

    if(closeLetterBtn) closeLetterBtn.addEventListener('click', closeLetterAction);
    
    if(cinematicModal) {
        cinematicModal.addEventListener('click', (e) => {
            if(e.target.classList.contains('letter-modal-scroll-container') || e.target.classList.contains('cinematic-bg-elements')) {
                closeLetterAction();
            }
        });
    }

    /* --- 8. MOTOR CONFETI --- */
    const cCanvas = document.getElementById('confetti-canvas');
    const cCtx = cCanvas.getContext('2d');
    let cw, ch; let confettis = []; let confettiActive = false;

    function resizeConfetti() { cw = cCanvas.width = window.innerWidth; ch = cCanvas.height = window.innerHeight; }
    window.addEventListener('resize', resizeConfetti); resizeConfetti();

    function triggerConfetti(amount = 50) {
        const colors = ['#d4a373', '#e5989b', '#8c4a52', '#ffffff'];
        for(let i=0; i<amount; i++) {
            confettis.push({ x: cw / 2, y: ch, vx: (Math.random() - 0.5) * 30, vy: -(Math.random() * 20 + 15), w: Math.random() * 8 + 4, h: Math.random() * 8 + 4, color: colors[Math.floor(Math.random() * colors.length)], rot: Math.random() * 360, rotSpeed: (Math.random() - 0.5) * 20 });
        }
        if(!confettiActive) renderConfetti();
    }

    function renderConfetti() {
        confettiActive = true;
        cCtx.clearRect(0, 0, cw, ch);
        for(let i = confettis.length-1; i >= 0; i--) {
            let c = confettis[i];
            c.x += c.vx; c.y += c.vy; c.vy += 0.5; c.rot += c.rotSpeed;
            cCtx.save(); cCtx.translate(c.x, c.y); cCtx.rotate(c.rot * Math.PI / 180); cCtx.fillStyle = c.color; cCtx.fillRect(-c.w/2, -c.h/2, c.w, c.h); cCtx.restore();
            if(c.y > ch + 50) confettis.splice(i, 1);
        }
        if(confettis.length > 0) requestAnimationFrame(renderConfetti);
        else confettiActive = false;
    }

    document.getElementById('year').textContent = new Date().getFullYear();

    document.querySelectorAll('.masonry-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault(); // Evita que salte arriba
            
            // AÑADE ESTA LÍNEA: Si detecta un vídeo, cancela el clic
            if(item.querySelector('video')) return;
            
            const wrapper = item.querySelector('.image-wrapper');
            const bgClass = Array.from(wrapper.classList).find(c => c.startsWith('bg-img-'));
            const title = item.querySelector('.overlay-title') ? item.querySelector('.overlay-title').innerText : '';
            const caption = item.querySelector('.frame-caption') ? item.querySelector('.frame-caption').innerText : '';
            
            lightboxImg.className = 'lightbox-placeholder';
            if(bgClass) lightboxImg.classList.add(bgClass);
            
            lightboxTitle.innerText = title;
            lightboxDesc.innerText = caption;
            lightbox.classList.add('active');
        });
    });

});