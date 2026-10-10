// ---------- settings (edit these) ----------
const VIDEO_ID = "";                 // YouTube video id of the trailer, example: "dQw4w9WgXcQ"
const SHARE_TITLE = "Shadows and Sails";
const SHARE_TEXT = "A Tunisian action adventure made by two ISAMM students";

// ---------- elements ----------
const hero = document.getElementById('sec1');
const socials = document.getElementById('sec6');
const bar = document.getElementById('bar');
const play = document.getElementById('play');
const video = document.getElementById('video');
const share = document.getElementById('share');

// current year in the footer
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- scroll reveal ----------
const reveal = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in');
            reveal.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => reveal.observe(el));

// ---------- floating follow bar ----------
// visible only after the hero and hidden again once the socials section is on screen
let heroVisible = true;
let socialsVisible = false;

function updateBar() {
    bar.classList.toggle('show', !heroVisible && !socialsVisible);
}

new IntersectionObserver(entries => {
    heroVisible = entries[0].isIntersecting;
    updateBar();
}, { threshold: 0.2 }).observe(hero);

new IntersectionObserver(entries => {
    socialsVisible = entries[0].isIntersecting;
    updateBar();
}, { threshold: 0.2 }).observe(socials);

// ---------- screenshots slider ----------
// touch screens scroll natively, on pc the slider can be dragged with the mouse or moved with the arrows
const slider = document.getElementById('s3_2');
let dragging = false;
let startX = 0;
let startScroll = 0;

slider.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse') return;
    dragging = true;
    startX = e.clientX;
    startScroll = slider.scrollLeft;
    slider.classList.add('drag');
});
addEventListener('pointermove', e => {
    if (!dragging) return;
    slider.scrollLeft = startScroll - (e.clientX - startX);
});
addEventListener('pointerup', () => {
    dragging = false;
    slider.classList.remove('drag');
});
document.getElementById('prev').addEventListener('click', () => slider.scrollBy({ left: -slider.clientWidth * 0.5, behavior: 'smooth' }));
document.getElementById('next').addEventListener('click', () => slider.scrollBy({ left: slider.clientWidth * 0.5, behavior: 'smooth' }));

// ---------- trailer ----------
// the YouTube player is only loaded when the user taps play (keeps the page light on mobile data)
play.addEventListener('click', () => {
    if (!VIDEO_ID) {
        console.log("Set VIDEO_ID in qr.js to play the trailer.");
        return;
    }
    video.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0"
        title="Trailer" allow="autoplay; encrypted-media; fullscreen" allowfullscreen
        style="position:absolute;inset:0;width:100%;height:100%;border:0"></iframe>`;
    play.remove();
});

// ---------- share button ----------
// uses the phone's share sheet, or copies the link if it is not available
share.addEventListener('click', async () => {
    try {
        if (navigator.share) {
            await navigator.share({ title: SHARE_TITLE, text: SHARE_TEXT, url: location.href });
        } else {
            await navigator.clipboard.writeText(location.href);
            share.textContent = "LINK COPIED ✓";
            setTimeout(() => share.textContent = "SHARE THIS PAGE", 2000);
        }
    } catch (error) {
        console.log("Share cancelled.");
    }
});
