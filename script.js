// 1. Scroll Events handling (Navbar)
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// 2. Reveal Elements on Scroll
const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

reveals.forEach(reveal => {
    revealObserver.observe(reveal);
});

// 3. Dynamic "Terminal Typing" effect for project visuals using DOM Manipulation
const term1Lines = [
    '<span class="term-prompt">rahul@cluster:~/engine$</span> <span class="term-command">npm run scale:workers</span>',
    '<span class="term-output">[INFO] Linking to clustered Redis Core...</span>',
    '<span class="term-success">[OK] Message Broker connection authenticated</span>',
    '<span class="term-output">[INFO] Scaling BullMQ instances across 15 nodes...</span>',
    '<span class="term-success">[OK] Worker node #102 online & listening</span>',
    '<span class="term-output">Processing job payload: {"id": 938217, "type": "img_process"}...</span>',
    '<span class="term-success">Job 938217 compressed & saved in 14ms</span>',
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

function typeWriterTerminal(elementId, lines, msDelay = 800) {
    const el = document.getElementById(elementId);
    if (!el) return;

    let i = 0;
    const typeLine = () => {
        if (i < lines.length) {
            const lineDiv = document.createElement('div');
            lineDiv.innerHTML = lines[i];
            lineDiv.style.opacity = '0';
            el.appendChild(lineDiv);

            setTimeout(() => {
                lineDiv.style.transition = 'opacity 0.2s ease';
                lineDiv.style.opacity = '1';
            }, 50);

            i++;
            setTimeout(typeLine, msDelay);
        } else {
            const cursor = document.createElement('span');
            cursor.innerHTML = '█';
            cursor.style.animation = 'blink 1s step-end infinite';
            const cursorWrapper = document.createElement('div');
            cursorWrapper.innerHTML = '<span class="term-prompt">rahul@server:~$</span> ';
            cursorWrapper.appendChild(cursor);
            el.appendChild(cursorWrapper);

            if (!document.getElementById('cursor-style')) {
                const style = document.createElement('style');
                style.id = 'cursor-style';
                style.innerHTML = '@keyframes blink { 0%, 100% {opacity: 1;} 50% {opacity: 0;} }';
                document.head.appendChild(style);
            }
        }
    };

    const terminalObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            setTimeout(typeLine, 800);
            terminalObserver.disconnect();
        }
    }, { threshold: 0.1 });

    terminalObserver.observe(el.parentElement);
}

document.addEventListener('DOMContentLoaded', () => {
    typeWriterTerminal('term1-content', term1Lines, 700);
    typeWriterTerminal('term2-content', term2Lines, 800);

    // 4. Interactive 3D Tilt for Skill Cards
    const skillCards = document.querySelectorAll('.skill-card');

    skillCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = 'transform 0.5s ease, box-shadow 0.4s ease, border-color 0.4s ease, background 0.4s ease';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.1s ease';
        });
    });

    // 5. Profile Photo Zoom Feature
    const profilePhoto = document.getElementById('my-photo');
    if (profilePhoto) {
        profilePhoto.style.cursor = 'zoom-in';
        
        const overlay = document.createElement('div');
        overlay.className = 'photo-overlay';
        
        const zoomedImg = document.createElement('img');
        zoomedImg.src = profilePhoto.src;
        zoomedImg.className = 'zoomed-photo';
        
        overlay.appendChild(zoomedImg);
        document.body.appendChild(overlay);

        profilePhoto.addEventListener('click', () => {
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        overlay.addEventListener('click', () => {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // 6. Fetch Real GitHub Commit Count
    fetchGitHubCommits('rahulbirva');
});

/**
 * Fetches the total number of GitHub commits for a user across all public repos.
 * Uses the GitHub Search Commits API to count commits authored by the user.
 */
async function fetchGitHubCommits(username) {
    const commitEl = document.getElementById('github-commits-count');
    if (!commitEl) return;

    try {
        // Use the GitHub Search Commits API to count total commits by the user
        const response = await fetch(
            `https://api.github.com/search/commits?q=author:${username}`,
            {
                headers: {
                    'Accept': 'application/vnd.github.cloak-preview+json'
                }
            }
        );

        if (response.ok) {
            const data = await response.json();
            const totalCommits = data.total_count;

            // Animate the number counting up
            animateCount(commitEl, totalCommits);
        } else {
            // Fallback: try to count via events API (limited to recent events)
            await fetchCommitsFromEvents(username, commitEl);
        }
    } catch (error) {
        console.warn('GitHub API fetch failed, using fallback:', error);
        commitEl.textContent = '200+';
    }
}

/**
 * Fallback: Count commits from the GitHub Events API (last 90 days, max 300 events).
 */
async function fetchCommitsFromEvents(username, commitEl) {
    try {
        let totalCommits = 0;
        // Fetch up to 3 pages of events
        for (let page = 1; page <= 3; page++) {
            const res = await fetch(
                `https://api.github.com/users/${username}/events?per_page=100&page=${page}`
            );
            if (!res.ok) break;
            const events = await res.json();
            if (events.length === 0) break;

            events.forEach(event => {
                if (event.type === 'PushEvent' && event.payload && event.payload.commits) {
                    totalCommits += event.payload.commits.length;
                }
            });
        }

        if (totalCommits > 0) {
            animateCount(commitEl, totalCommits);
        } else {
            commitEl.textContent = '200+';
        }
    } catch {
        commitEl.textContent = '200+';
    }
}

/**
 * Smoothly animate a number counting up from 0 to the target value.
 */
function animateCount(element, target) {
    const duration = 1500; // ms
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic for smooth deceleration
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        element.textContent = current.toLocaleString() + '+';

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target.toLocaleString() + '+';
        }
    }

    requestAnimationFrame(update);
}