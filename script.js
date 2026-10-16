const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isSmallScreen = window.matchMedia('(max-width: 680px)').matches;
const motionEnabled = !prefersReducedMotion && Boolean(window.gsap && window.ScrollTrigger);
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;

document.documentElement.classList.add('js-ready');

const navbar = document.getElementById('navbar');
const navLinks = Array.from(document.querySelectorAll('.nav-links a[data-section]'));
const sections = Array.from(document.querySelectorAll('main > section'));
const statTargets = {
    projects: 4,
    commits: 200,
    cgpa: 7.04
};
let statsAnimated = false;
let marqueeTweens = [];
let lenis;

const term1Lines = [
    '<span class="term-prompt">rahul@cluster:~/engine$</span> <span class="term-command">npm run scale:workers</span>',
    '<span class="term-output">[INFO] Linking to clustered Redis Core...</span>',
    '<span class="term-success">[OK] Message Broker connection authenticated</span>',
    '<span class="term-output">[INFO] Scaling BullMQ instances across 15 nodes...</span>',
    '<span class="term-success">[OK] Worker node #102 online &amp; listening</span>',
    '<span class="term-output">Processing job payload: {"id": 938217, "type": "img_process"}...</span>',
    '<span class="term-success">Job 938217 compressed &amp; saved in 14ms</span>',
    '<span class="term-output">Processing job payload: {"id": 938218, "type": "db_sync"}...</span>'
];

const term2Lines = [
    '<span class="term-prompt">rahul@cloud-server:~$</span> <span class="term-command">kubectl apply -f gateway-deployment.yaml</span>',
    '<span class="term-output">deployment.apps/api-gateway created</span>',
    '<span class="term-prompt">rahul@cloud-server:~$</span> <span class="term-command">kubectl get pods --namespace=production</span>',
    '<span class="term-output">NAME                                READY   STATUS    RESTARTS   AGE</span>',
    '<span class="term-success">api-gateway-7b9c6f849-lx2zp         1/1     Running   0          12s</span>',
    '<span class="term-success">auth-service-5bbdf8b5bf-z48tr       1/1     Running   0          45m</span>',
    '<span class="term-success">postgres-cluster-0                  2/2     Running   0          14d</span>',
    '<span class="term-prompt">rahul@cloud-server:~$</span> <span class="term-command">curl -I https://api.prod.rahul.com/ping</span>',
    '<span class="term-success">HTTP/2 200 OK</span><br><span class="term-output">x-response-time: 4ms</span>'
];

function renderTerminal(elementId, lines) {
    const element = document.getElementById(elementId);
    if (!element) return;

    element.innerHTML = lines.map((line) => `<div>${line}</div>`).join('');
}

renderTerminal('term1-content', term1Lines);
renderTerminal('term2-content', term2Lines);

function showEverything() {
    document.querySelectorAll('.line-inner, [data-reveal-copy], [data-timeline-entry]').forEach((element) => {
        element.style.opacity = '1';
        element.style.transform = 'none';
    });

    document.querySelectorAll('[data-project-visual]').forEach((element) => {
        element.style.opacity = '1';
        element.style.clipPath = 'inset(0 0 0 0)';
    });

    document.querySelectorAll('[data-project-parallax]').forEach((element) => {
        element.style.transform = 'none';
    });

    document.querySelectorAll('.section-wash').forEach((element) => {
        element.style.transform = 'scaleY(1)';
    });

    const heroPhoto = document.getElementById('hero-photo');
    if (heroPhoto) {
        heroPhoto.style.opacity = '1';
        heroPhoto.style.clipPath = 'inset(0 0 0 0)';
    }
}

function initIntro() {
    const heroLines = document.querySelectorAll('#hero .line-inner');
    const heroPhoto = document.getElementById('hero-photo');
    const heroBadge = document.getElementById('hero-badge');

    gsap.set(heroLines, { yPercent: 110 });
    gsap.set(heroPhoto, { clipPath: 'inset(100% 0 0 0)', opacity: 0 });
    gsap.set([navbar, heroBadge], { opacity: 0, y: 10 });

    gsap.timeline({ defaults: { ease: 'power3.out' } })
        .to(heroLines, { yPercent: 0, duration: 0.44, stagger: 0.1 })
        .to(heroPhoto, { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 0.56 }, '-=0.16')
        .to([navbar, heroBadge], { opacity: 1, y: 0, duration: 0.3, stagger: 0.05 }, '-=0.16');
}

function initSectionHeadings() {
    document.querySelectorAll('.section-title .line-inner').forEach((heading) => {
        gsap.set(heading, { yPercent: 110 });
        gsap.to(heading, {
            yPercent: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: heading.closest('.section-header'),
                start: 'top 85%',
                once: true
            }
        });
    });
}

function initCopyReveals() {
    const stagger = isSmallScreen ? 0.04 : 0.08;

    sections.forEach((section) => {
        const elements = section.querySelectorAll('[data-reveal-copy]');
        if (!elements.length) return;

        gsap.set(elements, { opacity: 0, y: 24 });
        gsap.to(elements, {
            opacity: 1,
            y: 0,
            duration: 0.62,
            stagger,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                once: true
            }
        });
    });
}

function initTimeline() {
    const timeline = document.querySelector('.timeline');
    const line = document.querySelector('.timeline-line');
    const entries = Array.from(document.querySelectorAll('[data-timeline-entry]'));
    if (!timeline || !line || !entries.length) return;

    gsap.set(line, { scaleY: 0 });
    gsap.set(entries, { opacity: 0, y: 24 });

    const timelineMotion = gsap.timeline({
        scrollTrigger: {
            trigger: timeline,
            start: 'top 78%',
            end: 'bottom 66%',
            scrub: 0.55
        }
    });

    timelineMotion.to(line, { scaleY: 1, duration: 1, ease: 'none' }, 0);
    entries.forEach((entry, index) => {
        timelineMotion.to(entry, {
            opacity: 1,
            y: 0,
            duration: 0.22,
            ease: 'power2.out'
        }, index / entries.length);
    });
}

function initProjects() {
    document.querySelectorAll('[data-project-visual]').forEach((visual) => {
        const inner = visual.querySelector('[data-project-parallax]');
        gsap.set(visual, { clipPath: 'inset(0 100% 0 0)' });

        gsap.to(visual, {
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.9,
            ease: 'power3.inOut',
            scrollTrigger: {
                trigger: visual,
                start: 'top 85%',
                once: true
            }
        });

        if (inner) {
            gsap.fromTo(inner, { yPercent: -8 }, {
                yPercent: 8,
                ease: 'none',
                scrollTrigger: {
                    trigger: visual,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        }
    });
}

function initToneTransitions() {
    document.querySelectorAll('.tone-alt .section-wash').forEach((wash) => {
        gsap.fromTo(wash, { scaleY: 0 }, {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: wash.parentElement,
                start: 'top 92%',
                end: 'top 52%',
                scrub: true
            }
        });
    });
}

function initMarquees() {
    const tracks = Array.from(document.querySelectorAll('.skills-marquee-track, .marquee-track'));

    tracks.forEach((track) => {
        if (track.classList.contains('marquee-track')) {
            const originalItems = Array.from(track.children);
            originalItems.forEach((item) => track.appendChild(item.cloneNode(true)));
        }

        const tween = gsap.to(track, {
            xPercent: -50,
            duration: track.classList.contains('skills-marquee-track') ? 34 : 28,
            repeat: -1,
            ease: 'none'
        });
        marqueeTweens.push(tween);
    });
}

function renderCounter(element, value, decimals = 0) {
    const formatted = decimals
        ? Number(value).toFixed(decimals)
        : Math.round(Number(value)).toLocaleString();
    element.textContent = formatted;
    element.dataset.value = String(value);
}

function animateCounter(element, target, decimals = 0, start = 0) {
    if (!element) return;

    if (!motionEnabled) {
        renderCounter(element, target, decimals);
        return;
    }

    const state = { value: Number(start) || 0 };
    gsap.killTweensOf(state);
    gsap.to(state, {
        value: target,
        duration: 1.4,
        ease: 'power3.out',
        onUpdate: () => renderCounter(element, state.value, decimals),
        onComplete: () => renderCounter(element, target, decimals)
    });
}

function initStats() {
    const statsContainer = document.querySelector('.stats-container');
    if (!statsContainer) return;

    const animateStats = () => {
        if (statsAnimated) return;
        statsAnimated = true;
        animateCounter(document.getElementById('projects-count'), statTargets.projects);
        animateCounter(document.getElementById('github-commits-count'), statTargets.commits);
        animateCounter(document.getElementById('cgpa-count'), statTargets.cgpa, 2);
    };

    if (motionEnabled) {
        ScrollTrigger.create({
            trigger: statsContainer,
            start: 'top 85%',
            once: true,
            onEnter: animateStats
        });
    } else {
        animateStats();
    }
}

function moveNavIndicator(link, animate = motionEnabled) {
    const indicator = document.querySelector('.nav-indicator');
    const linkGroup = document.querySelector('.nav-links');
    if (!indicator || !link || !linkGroup) return;

    const left = link.offsetLeft;
    const width = link.offsetWidth;
    if (animate) {
        gsap.to(indicator, { x: left, width, duration: 0.35, ease: 'power3.out', overwrite: true });
    } else {
        indicator.style.transform = `translateX(${left}px)`;
        indicator.style.width = `${width}px`;
    }
}

function setActiveNav(sectionId, animate = motionEnabled) {
    navLinks.forEach((link) => {
        const active = link.dataset.section === sectionId;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
    });

    const activeLink = navLinks.find((link) => link.dataset.section === sectionId);
    if (activeLink) moveNavIndicator(activeLink, animate);
    else {
        const indicator = document.querySelector('.nav-indicator');
        if (indicator) {
            if (animate) gsap.to(indicator, { width: 0, duration: 0.2 });
            else indicator.style.width = '0';
        }
    }
}

function updateActiveSection() {
    const marker = window.innerHeight * 0.45;
    let activeId = '';

    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= marker && rect.bottom >= marker) activeId = section.id;
    });

    if (activeId && navLinks.some((link) => link.dataset.section === activeId)) {
        setActiveNav(activeId, false);
    } else if (!activeId || activeId === 'hero') {
        setActiveNav('', false);
    }
}

function updateNavVisibility(scroll) {
    if (prefersReducedMotion || !navbar) return;
    const previous = Number(navbar.dataset.lastScroll || 0);

    if (scroll <= 24 || scroll < previous - 4) navbar.classList.remove('nav-hidden');
    else if (scroll > previous + 4 && scroll > 80) navbar.classList.add('nav-hidden');

    navbar.dataset.lastScroll = String(scroll);
}

function updateMarqueeSpeed(velocity = 0) {
    if (!marqueeTweens.length) return;
    const speed = Math.max(0.72, Math.min(1.55, 1 + Math.abs(velocity) / 1800));
    marqueeTweens.forEach((tween) => {
        tween.timeScale(speed);
        gsap.to(tween, { timeScale: 1, duration: 0.8, overwrite: true });
    });
}

function initNavigation() {
    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (prefersReducedMotion) setTimeout(updateActiveSection, 0);
        });
    });

    if (motionEnabled) {
        navLinks.forEach((link) => {
            const section = document.getElementById(link.dataset.section);
            if (!section) return;

            ScrollTrigger.create({
                trigger: section,
                start: 'top 45%',
                end: 'bottom 45%',
                onToggle: (self) => {
                    if (self.isActive) setActiveNav(section.id, true);
                }
            });
        });
    } else {
        window.addEventListener('scroll', updateActiveSection, { passive: true });
        updateActiveSection();
    }
}

function initLenis() {
    if (!window.Lenis) return null;

    const smoothScroll = new window.Lenis({
        duration: 1.05,
        smoothWheel: true,
        syncTouch: false
    });

    smoothScroll.on('scroll', (event) => {
        updateNavVisibility(event.scroll);
        updateMarqueeSpeed(event.velocity);
        ScrollTrigger.update();
    });

    gsap.ticker.add((time) => smoothScroll.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    return smoothScroll;
}

async function fetchGitHubCommits(username) {
    try {
        const response = await fetch(`https://api.github.com/search/commits?q=author:${username}`, {
            headers: { Accept: 'application/vnd.github.cloak-preview+json' }
        });

        if (!response.ok) throw new Error('GitHub commit request failed');
        const data = await response.json();
        statTargets.commits = data.total_count || 200;
    } catch (error) {
        console.warn('GitHub API fetch failed, using fallback:', error);
    }

    const element = document.getElementById('github-commits-count');
    if (statsAnimated && element) {
        animateCounter(element, statTargets.commits, 0, Number(element.dataset.value || 0));
    }
}

async function fetchGitHubProjects(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        if (!response.ok) throw new Error('GitHub profile request failed');
        const data = await response.json();
        statTargets.projects = data.public_repos || 4;
    } catch (error) {
        console.warn('GitHub API fetch failed for projects:', error);
    }

    const element = document.getElementById('projects-count');
    if (statsAnimated && element) {
        animateCounter(element, statTargets.projects, 0, Number(element.dataset.value || 0));
    }
}

function start() {
    if (!motionEnabled) {
        showEverything();
        initStats();
        initNavigation();
        fetchGitHubCommits('rahulbirva');
        fetchGitHubProjects('rahulbirva');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);
    lenis = initLenis();

    if (!lenis) {
        window.addEventListener('scroll', () => {
            updateNavVisibility(window.scrollY);
            updateMarqueeSpeed(0);
        }, { passive: true });
    }

    initIntro();
    initSectionHeadings();
    initCopyReveals();
    initTimeline();
    initProjects();
    initToneTransitions();
    initMarquees();
    initStats();
    initNavigation();

    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
    fetchGitHubCommits('rahulbirva');
    fetchGitHubProjects('rahulbirva');
}

start();
