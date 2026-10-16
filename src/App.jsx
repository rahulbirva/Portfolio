import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { ArrowUpRight } from 'lucide-react';
import { motionState } from './motionState';
import profilePhoto from '../rahul.jpeg';
import {
    navItems,
    projects,
    skills,
    timelineItems
} from './content';

const BackgroundScene = lazy(() => import('./BackgroundScene').then((module) => ({ default: module.BackgroundScene })));

gsap.registerPlugin(ScrollTrigger);

function TerminalLine({ line }) {
    return (
        <div>
            {line.prompt && <span className="term-prompt">{line.prompt}</span>}
            {line.command && <span className="term-command"> {line.command}</span>}
            {line.output && <span className="term-output">{line.output}</span>}
            {line.success && <span className="term-success">{line.success}</span>}
        </div>
    );
}

function SectionHeader({ index, title, alias }) {
    return (
        <div className="section-header" data-section-header>
            {alias && <span id={alias} className="anchor-alias" aria-hidden="true" />}
            <p className="section-index">{index}</p>
            <h2 className="section-title" data-scramble={title}>
                <span className="line-mask"><span className="line-inner">{title}</span></span>
            </h2>
        </div>
    );
}

function SkillCard({ skill }) {
    const cardRef = useRef();

    const handlePointerMove = (event) => {
        const card = cardRef.current;
        if (!card || window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 700) return;
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        card.style.setProperty('--tilt-x', `${y * -5}deg`);
        card.style.setProperty('--tilt-y', `${x * 5}deg`);
    };

    const resetPointer = () => {
        if (cardRef.current) {
            cardRef.current.style.setProperty('--tilt-x', '0deg');
            cardRef.current.style.setProperty('--tilt-y', '0deg');
        }
    };

    return (
        <div
            ref={cardRef}
            className="skill-card glass-card"
            data-reveal
            onPointerMove={handlePointerMove}
            onPointerLeave={resetPointer}
        >
            <img src={skill.icon} alt={skill.label} className="skill-logo" loading="lazy" width="56" height="56" />
            <p>{skill.label}</p>
        </div>
    );
}

function StatusBadge() {
    return (
        <div className="hero-badge" id="hero-badge">
            <span className="status-dot" aria-hidden="true"></span>
            <span>Available for Internships &amp; Junior Roles</span>
        </div>
    );
}

function ProjectRow({ project }) {
    return (
        <article className="project-row" data-project={project.id}>
            <div className="project-visual glass-card" data-project-visual>
                <div className="project-visual-inner" data-project-parallax>
                    <div className="terminal-header" aria-hidden="true">
                        <span className="terminal-dot"></span>
                        <span className="terminal-dot"></span>
                        <span className="terminal-dot"></span>
                    </div>
                    <div className="terminal-body" id={`${project.id}-content`}>
                        {project.lines.map((line, index) => <TerminalLine key={`${project.id}-${index}`} line={line} />)}
                    </div>
                </div>
            </div>
            <div className="project-info">
                <h3 data-reveal>{project.title}</h3>
                {project.subtitle && <p data-reveal>{project.subtitle}</p>}
                <div className="tech-stack" data-reveal>
                    {Array.from({ length: 4 }, (_, index) => <span className="tech-pill" key={`${project.id}-tech-${index}`}>N/A</span>)}
                </div>
                <a href="#contact" className="btn btn-secondary" data-reveal>
                    {project.cta}
                    <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
                </a>
            </div>
        </article>
    );
}

function Stat({ id, label, initial = '0' }) {
    return (
        <div className="stat-item" data-stat={id}>
            <div className="stat-num" id={id}>{initial}</div>
            <div className="stat-label">{label}</div>
        </div>
    );
}

export default function App() {
    const appRef = useRef();
    const navbarRef = useRef();
    const indicatorRef = useRef();
    const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const statValues = useRef({ projects: 0, commits: 0 });
    const statsReady = useRef(false);
    const [activeSection, setActiveSection] = useState('');

    const duplicatedSkills = useMemo(() => [...skills, ...skills], []);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handleMotionChange = (event) => setReducedMotion(event.matches);
        mediaQuery.addEventListener?.('change', handleMotionChange);
        return () => mediaQuery.removeEventListener?.('change', handleMotionChange);
    }, []);

    useEffect(() => {
        motionState.reducedMotion = reducedMotion;
    }, [reducedMotion]);

    useEffect(() => {
        const app = appRef.current;
        if (!app) return undefined;

        const navLinks = Array.from(app.querySelectorAll('.nav-links a[data-section]'));
        const sections = Array.from(app.querySelectorAll('main > section'));
        const revealElements = Array.from(app.querySelectorAll('[data-reveal]'));
        const headingElements = Array.from(app.querySelectorAll('[data-scramble]'));
        const timelineEntries = Array.from(app.querySelectorAll('[data-timeline-entry]'));
        const projectVisuals = Array.from(app.querySelectorAll('[data-project-visual]'));
        const cleanup = [];
        let lenis;
        let statsStarted = false;
        let lastScroll = window.scrollY;

        const renderStatic = () => {
            revealElements.forEach((element) => {
                element.style.opacity = '1';
                element.style.transform = 'none';
            });
            timelineEntries.forEach((element) => {
                element.style.opacity = '1';
                element.style.transform = 'none';
            });
            projectVisuals.forEach((element) => {
                element.style.opacity = '1';
                element.style.clipPath = 'inset(0 0 0 0)';
            });
            app.querySelectorAll('.line-inner').forEach((element) => {
                element.style.transform = 'none';
            });
        };

        const setIndicator = (link, animate = !reducedMotion) => {
            if (!indicatorRef.current || !link) return;
            const x = link.offsetLeft;
            const width = link.offsetWidth;
            if (animate) gsap.to(indicatorRef.current, { x, width, duration: 0.35, ease: 'power3.out', overwrite: true });
            else {
                indicatorRef.current.style.transform = `translateX(${x}px)`;
                indicatorRef.current.style.width = `${width}px`;
            }
        };

        const activateSection = (sectionId, animate = !reducedMotion) => {
            setActiveSection(sectionId);
            navLinks.forEach((link) => {
                const active = link.dataset.section === sectionId;
                link.classList.toggle('active', active);
                if (active) link.setAttribute('aria-current', 'page');
                else link.removeAttribute('aria-current');
            });
            const activeLink = navLinks.find((link) => link.dataset.section === sectionId);
            if (activeLink) setIndicator(activeLink, animate);
            else if (indicatorRef.current) {
                if (animate) gsap.to(indicatorRef.current, { width: 0, duration: 0.2 });
                else indicatorRef.current.style.width = '0';
            }
        };

        const updateNavVisibility = (scroll) => {
            if (reducedMotion) return;
            if (scroll <= 24 || scroll < lastScroll - 4) navbarRef.current?.classList.remove('nav-hidden');
            else if (scroll > lastScroll + 4 && scroll > 80) navbarRef.current?.classList.add('nav-hidden');
            lastScroll = scroll;
        };

        const scramble = (element) => {
            const target = element.querySelector('.line-inner') || element;
            const finalText = element.dataset.scramble;
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let iteration = 0;
            const total = finalText.length;
            const timer = window.setInterval(() => {
                target.textContent = finalText.split('').map((character, index) => {
                    if (character === ' ') return ' ';
                    if (index < iteration) return finalText[index];
                    return characters[Math.floor(Math.random() * characters.length)];
                }).join('');
                iteration += 1.8;
                if (iteration >= total) {
                    window.clearInterval(timer);
                    target.textContent = finalText;
                }
            }, 24);
            cleanup.push(() => window.clearInterval(timer));
        };

        const animateStat = (element, target, decimals = 0) => {
            if (!element) return;
            if (reducedMotion) {
                element.textContent = decimals ? Number(target).toFixed(decimals) : Math.round(target).toLocaleString();
                return;
            }
            const state = { value: 0 };
            gsap.to(state, {
                value: target,
                duration: 1.4,
                ease: 'power3.out',
                onUpdate: () => {
                    element.textContent = decimals ? state.value.toFixed(decimals) : Math.floor(state.value).toLocaleString();
                },
                onComplete: () => {
                    element.textContent = decimals ? Number(target).toFixed(decimals) : Math.round(target).toLocaleString();
                }
            });
        };

        const animateStats = () => {
            if (statsStarted || !statsReady.current) return;
            statsStarted = true;
            animateStat(app.querySelector('#projects-count'), statValues.current.projects);
            animateStat(app.querySelector('#github-commits-count'), statValues.current.commits);
        };

        const writeStats = () => {
            const projectsElement = app.querySelector('#projects-count');
            const commitsElement = app.querySelector('#github-commits-count');
            if (!projectsElement || !commitsElement) return;
            projectsElement.textContent = Math.round(statValues.current.projects).toLocaleString();
            commitsElement.textContent = Math.round(statValues.current.commits).toLocaleString();
        };

        const fetchGitHubStats = async () => {
            const headers = {
                Accept: 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28'
            };
            const [profile, commitSearch] = await Promise.all([
                fetch('https://api.github.com/users/rahulbirva', { headers })
                    .then((response) => response.ok ? response.json() : null)
                    .catch(() => null),
                fetch('https://api.github.com/search/commits?q=author%3Arahulbirva', { headers })
                    .then((response) => response.ok ? response.json() : null)
                    .catch(() => null)
            ]);

            statValues.current.projects = Number.isFinite(Number(profile?.public_repos))
                ? Number(profile.public_repos)
                : 0;
            statValues.current.commits = Number.isFinite(Number(commitSearch?.total_count))
                ? Number(commitSearch.total_count)
                : 0;
            statsReady.current = true;

            if (statsStarted) {
                animateStat(app.querySelector('#projects-count'), statValues.current.projects);
                animateStat(app.querySelector('#github-commits-count'), statValues.current.commits);
            } else {
                writeStats();
            }
        };

        if (reducedMotion) {
            renderStatic();
            fetchGitHubStats();
            navLinks.forEach((link) => {
                link.addEventListener('click', () => window.setTimeout(() => activateSection(link.dataset.section, false), 0));
            });
            return () => cleanup.forEach((callback) => callback());
        }

        const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
        intro.set(app.querySelectorAll('#hero .line-inner'), { yPercent: 110 });
        intro.set(app.querySelector('#hero-photo'), { clipPath: 'inset(100% 0 0 0)', opacity: 0 });
        intro.set([navbarRef.current, app.querySelector('#hero-badge')], { opacity: 0, y: 12 });
        intro.to(app.querySelectorAll('#hero .line-inner'), { yPercent: 0, duration: 0.44, stagger: 0.1 });
        intro.to(app.querySelector('#hero-photo'), { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 0.56 }, '-=0.16');
        intro.to([navbarRef.current, app.querySelector('#hero-badge')], { opacity: 1, y: 0, duration: 0.3, stagger: 0.05 }, '-=0.16');

        headingElements.forEach((heading) => {
            gsap.set(heading.querySelector('.line-inner'), { yPercent: 110 });
            ScrollTrigger.create({
                trigger: heading.closest('.section-header'),
                start: 'top 85%',
                once: true,
                onEnter: () => {
                    gsap.to(heading.querySelector('.line-inner'), { yPercent: 0, duration: 0.7, ease: 'power3.out' });
                    scramble(heading);
                }
            });
        });

        sections.forEach((section) => {
            const elements = section.querySelectorAll('[data-reveal]');
            if (!elements.length) return;
            gsap.set(elements, { opacity: 0, y: 24 });
            gsap.to(elements, {
                opacity: 1,
                y: 0,
                duration: 0.62,
                stagger: window.innerWidth < 680 ? 0.04 : 0.08,
                ease: 'power3.out',
                scrollTrigger: { trigger: section, start: 'top 85%', once: true }
            });
        });

        const timeline = app.querySelector('.timeline');
        const timelineLine = app.querySelector('.timeline-line');
        if (timeline && timelineLine) {
            gsap.set(timelineLine, { scaleY: 0 });
            gsap.set(timelineEntries, { opacity: 0, y: 24 });
            const timelineMotion = gsap.timeline({
                scrollTrigger: { trigger: timeline, start: 'top 78%', end: 'bottom 66%', scrub: 0.55 }
            });
            timelineMotion.to(timelineLine, { scaleY: 1, duration: 1, ease: 'none' }, 0);
            timelineEntries.forEach((entry, index) => {
                timelineMotion.to(entry, { opacity: 1, y: 0, duration: 0.22, ease: 'power2.out' }, index / timelineEntries.length);
            });
        }

        projectVisuals.forEach((visual) => {
            const inner = visual.querySelector('[data-project-parallax]');
            gsap.set(visual, { clipPath: 'inset(0 100% 0 0)' });
            gsap.to(visual, {
                clipPath: 'inset(0 0% 0 0)',
                duration: 0.9,
                ease: 'power3.inOut',
                scrollTrigger: { trigger: visual, start: 'top 85%', once: true }
            });
            if (inner) {
                gsap.fromTo(inner, { yPercent: -8 }, {
                    yPercent: 8,
                    ease: 'none',
                    scrollTrigger: { trigger: visual, start: 'top bottom', end: 'bottom top', scrub: true }
                });
            }
        });

        lenis = new Lenis({ duration: 1.05, smoothWheel: true, syncTouch: false });
        lenis.on('scroll', ({ scroll, velocity }) => {
            motionState.velocity = velocity || 0;
            updateNavVisibility(scroll);
            ScrollTrigger.update();
        });
        const ticker = (time) => lenis.raf(time * 1000);
        gsap.ticker.add(ticker);
        gsap.ticker.lagSmoothing(0);
        cleanup.push(() => {
            gsap.ticker.remove(ticker);
            lenis.destroy();
        });

        const globalProgress = ScrollTrigger.create({
            start: 0,
            end: 'max',
            onUpdate: (self) => {
                motionState.progress = self.progress;
            }
        });
        cleanup.push(() => globalProgress.kill());

        sections.forEach((section) => {
            ScrollTrigger.create({
                trigger: section,
                start: 'top 45%',
                end: 'bottom 45%',
                onToggle: (self) => {
                    if (self.isActive && navItems.some((item) => item.section === section.id)) activateSection(section.id);
                }
            });
        });

        navLinks.forEach((link) => {
            const handleClick = (event) => {
                const target = document.querySelector(link.getAttribute('href'));
                if (!target) return;
                event.preventDefault();
                lenis.scrollTo(target, { offset: -96 });
            };
            link.addEventListener('click', handleClick);
            cleanup.push(() => link.removeEventListener('click', handleClick));
        });

        const handlePointer = (event) => {
            motionState.pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
            motionState.pointerY = (event.clientY / window.innerHeight - 0.5) * -2;
        };
        window.addEventListener('pointermove', handlePointer, { passive: true });
        cleanup.push(() => window.removeEventListener('pointermove', handlePointer));

        const statsTrigger = ScrollTrigger.create({
            trigger: app.querySelector('.stats-container'),
            start: 'top 85%',
            once: true,
            onEnter: animateStats
        });
        cleanup.push(() => statsTrigger.kill());

        fetchGitHubStats();
        ScrollTrigger.refresh();

        return () => {
            intro.kill();
            cleanup.forEach((callback) => callback());
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, [reducedMotion]);

    return (
        <div ref={appRef} className="portfolio-app">
            <Suspense fallback={null}>
                <BackgroundScene reducedMotion={reducedMotion} />
            </Suspense>

            <nav id="navbar" ref={navbarRef} aria-label="Primary navigation">
                <div className="container nav-content">
                    <a href="#hero" className="brand">Rahul_Portfolio</a>
                    <div className="nav-links" role="list">
                        {navItems.map((item) => (
                            <a href={item.href} data-section={item.section} role="listitem" key={item.label} className={activeSection === item.section ? 'active' : ''}>
                                {item.label}
                            </a>
                        ))}
                        <span className="nav-indicator" ref={indicatorRef} aria-hidden="true"></span>
                    </div>
                </div>
            </nav>

            <main>
                <section id="hero" className="tone-section tone-bone">
                    <div className="container hero-layout">
                        <div className="hero-copy">
                            <StatusBadge />
                            <h1 className="hero-title" aria-label="Student building the internet's backbone.">
                                <span className="line-mask"><span className="line-inner">Student building the</span></span>
                                <span className="line-mask"><span className="line-inner">internet's</span></span>
                                <span className="line-mask"><span className="line-inner hl">backbone.</span></span>
                            </h1>
                            <p className="hero-subtitle">
                                I am Rahul, a Computer Science student and Backend Developer. I'm passionate about mastering
                                microservices, deep-diving into databases, and writing clean, scalable code.
                            </p>
                            <div className="cta-group">
                                <a href="#projects" className="btn btn-primary">Analyze Systems</a>
                                <a href="#contact" className="btn btn-secondary">Contact Me</a>
                            </div>
                        </div>

                        <div className="hero-media" id="hero-photo">
                            <img src={profilePhoto} alt="My Photo" className="profile-photo" id="my-photo" width="1018" height="1018" fetchPriority="high" />
                        </div>
                    </div>

                    <div className="container stats-wrap">
                        <div className="stats-container" aria-label="Portfolio statistics">
                            <Stat id="projects-count" label="Major Projects" initial="0" />
                            <Stat id="github-commits-count" label="GitHub Commits" initial="0" />
                        </div>
                    </div>
                </section>

                <section id="about" className="tone-section tone-alt">
                    <div className="section-wash" aria-hidden="true"></div>
                    <div className="container section-inner">
                        <SectionHeader index="01 / Journey" title="Education & Growth" alias="journey" />
                        <div className="timeline">
                            <span className="timeline-track" aria-hidden="true"></span>
                            <span className="timeline-line" aria-hidden="true"></span>
                            {timelineItems.map((item) => (
                                <div className="timeline-item" data-timeline-entry key={item.date}>
                                    <div className="timeline-dot" aria-hidden="true"></div>
                                    <span className="timeline-date">{item.date}</span>
                                    <div className="timeline-content glass-card">
                                        <h3>{item.title}</h3>
                                        <p></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="skills" className="tone-section tone-bone">
                    <div className="container section-inner">
                        <SectionHeader index="02 / Arsenal" title="Technical Arsenal" alias="arsenal" />
                        <div className="skills-grid">
                            {skills.map((skill) => <SkillCard key={skill.label} skill={skill} />)}
                        </div>
                        <div className="skills-marquee" aria-label="Technical skills moving marquee">
                            <div className="skills-marquee-track">
                                {duplicatedSkills.map((skill, index) => (
                                    <span key={`${skill.label}-${index}`}>
                                        <img src={skill.icon} alt="" loading="lazy" width="32" height="32" />
                                        {skill.label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section id="projects" className="tone-section tone-alt">
                    <div className="section-wash" aria-hidden="true"></div>
                    <div className="container section-inner">
                        <SectionHeader index="03 / Architectures" title="Scale Architectures" alias="architectures" />
                        <div className="projects-list">
                            {projects.map((project) => <ProjectRow project={project} key={project.id} />)}
                        </div>
                    </div>
                </section>

                <section id="oss" className="tone-section tone-bone short-section">
                    <div className="container section-inner">
                        <SectionHeader index="04 / Open Source" title="Open Source Init" alias="open-source" />
                    </div>
                </section>

                <section id="testimonials" className="tone-section tone-alt">
                    <div className="section-wash" aria-hidden="true"></div>
                    <div className="container section-inner">
                        <SectionHeader index="05 / Testimonials" title="Mentor Feedback" />
                    </div>
                </section>

                <section id="contact" className="contact-section">
                    <div className="container section-inner">
                        <div className="contact-card">
                            <p className="section-index">06 / Contact</p>
                            <h2 className="contact-title" data-reveal>Let's build my career.</h2>
                            <p data-reveal>Currently looking for Backend Engineering internships, junior roles, or just an opportunity to learn
                                from the best in the industry. Provide your endpoint, and I'll ping back.</p>
                            <div className="social-links" data-reveal>
                                <a href="mailto:rp1327123@gmail.com">Send an Email <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" /></a>
                                <a href="https://github.com/rahulbirva" target="_blank" rel="noopener noreferrer">My GitHub <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" /></a>
                                <a href="https://linkedin.com/in/rahul" target="_blank" rel="noopener noreferrer">My LinkedIn <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" /></a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer>
                <div className="container">
                    <p>Architected &amp; Assembled by Rahul. © 2026. Data streams secured.</p>
                </div>
            </footer>
        </div>
    );
}
