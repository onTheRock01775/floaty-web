'use strict';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const tabs = Array.from(document.querySelectorAll('.layout-option'));
const screen = document.getElementById('demo-screen');
const panel = document.getElementById('demo-panel');
const descriptions = {
  pip: 'จอหลักเต็มพื้นที่ พร้อม PiP ลอยอยู่ด้านขวา',
  small: 'PiP ขนาดเล็กลง พร้อมความโปร่งใสที่ช่วยให้เห็นจอหลัก',
  split: 'จอหลักฝั่งซ้าย อีกสองจอฝั่งขวา ไม่ต้องวางซ้อนกัน',
  grid: 'แบ่งพื้นที่เท่ากัน 4 ช่อง เห็นครบทุกหน้าต่าง',
};

function selectLayout(button, focus = false) {
  const layout = button.dataset.layout;
  if (!Object.hasOwn(descriptions, layout)) return;
  tabs.forEach(tab => {
    const selected = tab === button;
    tab.classList.toggle('is-active', selected);
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  screen.dataset.layout = layout;
  panel.textContent = descriptions[layout];
  panel.setAttribute('aria-labelledby', button.id);
  document.getElementById('demo-key').textContent = String(tabs.indexOf(button) + 1);
  if (focus) button.focus();
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectLayout(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      selectLayout(tabs[next], true);
    }
  });
});

const pinButton = document.querySelector('.pin-toggle');
pinButton.addEventListener('click', () => {
  const pinned = pinButton.getAttribute('aria-pressed') !== 'true';
  pinButton.setAttribute('aria-pressed', String(pinned));
  pinButton.closest('.pin-playground').dataset.pinned = String(pinned);
  pinButton.querySelector('span').textContent = pinned ? 'PIN เปิดอยู่' : 'PIN ปิดอยู่';
});

const opacityRange = document.getElementById('opacity-range');
opacityRange.addEventListener('input', () => {
  const value = Number(opacityRange.value);
  document.getElementById('opacity-value').textContent = `${value}%`;
  document.querySelector('.opacity-window').style.opacity = String(value / 100);
  const position = (value - 20) / 80 * 100;
  opacityRange.style.background = `linear-gradient(to right, var(--purple) ${position}%, #dfd6ee ${position}%)`;
});

// Content stays readable without JS and when reduced motion is enabled.
if ('IntersectionObserver' in window && !reduceMotion.matches) {
  document.documentElement.classList.add('motion-enabled');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}

// Animate native details without taking away their keyboard semantics.
document.querySelectorAll('.faq details').forEach(detail => {
  const summary = detail.querySelector('summary');
  const content = detail.querySelector('.faq-content');
  let animation;
  let closing = false;
  summary.addEventListener('click', event => {
    if (reduceMotion.matches || typeof content.animate !== 'function') return;
    event.preventDefault();
    const open = !detail.open || closing;
    const from = content.getBoundingClientRect().height;
    animation?.cancel();
    if (open) detail.open = true;
    closing = !open;
    const to = open ? content.scrollHeight : 0;
    animation = content.animate([{ height: `${from}px`, opacity: open ? 0 : 1 }, { height: `${to}px`, opacity: open ? 1 : 0 }], {
      duration: 240, easing: 'cubic-bezier(.2,.75,.2,1)',
    });
    animation.onfinish = () => {
      detail.open = open;
      closing = false;
      animation = undefined;
    };
  });
});

document.getElementById('year').textContent = String(new Date().getFullYear());

// Public release metadata only. The working /latest/download link is retained
// when offline, rate limited, or if GitHub's API cannot be reached.
async function loadRelease() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6500);
  try {
    const response = await fetch('https://api.github.com/repos/onTheRock01775/floaty/releases/latest', {
      headers: { Accept: 'application/vnd.github+json' }, signal: controller.signal,
    });
    if (!response.ok) return;
    const release = await response.json();
    if (release.draft || release.prerelease || !/^v?\d+\.\d+\.\d+$/.test(release.tag_name || '')) return;
    const asset = Array.isArray(release.assets) && release.assets.find(item => item.name === 'Floaty.exe' && item.state === 'uploaded');
    if (!asset || !Number.isFinite(asset.size) || asset.size <= 0) return;
    const expected = `https://github.com/onTheRock01775/floaty/releases/download/${encodeURIComponent(release.tag_name)}/Floaty.exe`;
    if (asset.browser_download_url !== expected) return;
    document.querySelectorAll('.download-asset').forEach(link => { link.href = expected; });
    document.querySelectorAll('[data-release-version]').forEach(element => { element.textContent = release.tag_name; });
    const size = new Intl.NumberFormat('en', { maximumFractionDigits: 1 }).format(asset.size / 1024 / 1024);
    document.querySelectorAll('[data-release-meta]').forEach(element => { element.textContent = `${release.tag_name} · ${size} MB · ไฟล์ EXE เดียว`; });
  } catch {
    // A metadata failure must never disable the download button.
  } finally {
    clearTimeout(timeout);
  }
}
loadRelease();
