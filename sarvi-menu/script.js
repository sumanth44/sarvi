/* ============================================================
   SARVI — script.js
   ============================================================ */

// ---------- Navbar scroll effect ----------
const navbar = document.getElementById('header')?.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }
});

// ---------- Hamburger ----------
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navLinks.classList.toggle('open');
    });
    // Close on nav link click
    navLinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navLinks.classList.remove('open');
        });
    });
}

// ---------- Category Filter ----------
const catBtns = document.querySelectorAll('.cat-btn');
const menuCats = document.querySelectorAll('.menu-category');

catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        catBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const selected = btn.dataset.cat;

        menuCats.forEach(cat => {
            if (selected === 'all' || cat.dataset.cat === selected) {
                cat.classList.remove('hidden');
                // Re-trigger entrance animation
                cat.classList.remove('visible');
                setTimeout(() => cat.classList.add('visible'), 30);
            } else {
                cat.classList.add('hidden');
                cat.classList.remove('visible');
            }
        });

        // Scroll to menu
        if (selected !== 'all') {
            const target = document.querySelector(`.menu-category[data-cat="${selected}"]`);
            if (target) {
                setTimeout(() => {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 80);
            }
        }
    });
});

// ---------- Intersection Observer (scroll reveal) ----------
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
};
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe menu categories
menuCats.forEach(el => revealObserver.observe(el));

// Observe any .reveal elements (for future use)
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ---------- Initial reveal for visible items ----------
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        menuCats.forEach(cat => {
            const rect = cat.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                cat.classList.add('visible');
            }
        });
    }, 100);
});
