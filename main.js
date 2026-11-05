// Pixel War site. Everything drawn here is the game's own art:
//  - headings in the game's 5x7 pixel font (assets/pixel_big.fnt + .png, the BMFont the game uses)
//  - effects from the trimmed, packed sheets the game ships (assets/fx/index.json: frames [page, x, y, w, h, ox, oy])
//  - the knight from the per-weapon hero sheets (assets/hero/hero.json: grid sheets)
"use strict";

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const loadImage = (src) => new Promise((ok, fail) => { const i = new Image(); i.onload = () => ok(i); i.onerror = fail; i.src = src; });
const loadJSON = (src) => fetch(src).then((r) => r.json());

// ------------------------------------------------------------ pixel font headings
async function pixelText() {
  const [fnt, img] = await Promise.all([fetch("assets/pixel_big.fnt").then((r) => r.text()), loadImage("assets/pixel_big.png")]);
  const glyphs = {};
  let lineH = 10;
  for (const line of fnt.split("\n")) {
    if (line.startsWith("common")) lineH = +/lineHeight=(\d+)/.exec(line)[1];
    if (!line.startsWith("char ")) continue;
    const g = Object.fromEntries([...line.matchAll(/(\w+)=(-?\d+)/g)].map((m) => [m[1], +m[2]]));
    glyphs[g.id] = g;
  }
  document.querySelectorAll(".px[data-text]").forEach((el) => {
    const text = el.dataset.text, color = el.dataset.color || "#ffe26b";
    let scale = +el.dataset.scale || 4;
    let w = 0;
    for (const ch of text) w += (glyphs[ch.codePointAt(0)] || glyphs[32]).xadvance;
    // shrink on narrow screens, in whole pixels
    const room = (el.parentElement.clientWidth || innerWidth) - 8;
    while (scale > 1 && (w + 1) * scale > room) scale--;
    const h = 7, cv = document.createElement("canvas");
    cv.width = (w + 1) * scale;
    cv.height = (h + 1) * scale;
    const ctx = cv.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    // glyphs are white: draw them, then tint (once in ink for the drop shadow, once in colour)
    const mask = document.createElement("canvas");
    mask.width = cv.width; mask.height = cv.height;
    const m = mask.getContext("2d");
    m.imageSmoothingEnabled = false;
    let x = 0;
    for (const ch of text) {
      const g = glyphs[ch.codePointAt(0)] || glyphs[32];
      if (g.width) m.drawImage(img, g.x, g.y, g.width, g.height, x * scale, 0, g.width * scale, g.height * scale);
      x += g.xadvance;
    }
    const tint = (c) => {
      const t = document.createElement("canvas");
      t.width = mask.width; t.height = mask.height;
      const tc = t.getContext("2d");
      tc.drawImage(mask, 0, 0);
      tc.globalCompositeOperation = "source-in";
      tc.fillStyle = c;
      tc.fillRect(0, 0, t.width, t.height);
      return t;
    };
    ctx.drawImage(tint("#0b0a12"), scale, scale);
    ctx.drawImage(tint(color), 0, 0);
    cv.setAttribute("role", "img");
    cv.setAttribute("aria-label", text);
    el.textContent = "";
    el.appendChild(cv);
  });
}

// ------------------------------------------------------------ sprite players
const players = [];
let fxIndex = null, heroIndex = null;
const pageCache = {};
const page = (src) => (pageCache[src] ??= loadImage(src));

/** A pixelfx sheet on a canvas at a whole-pixel scale; loops play on, one-shots replay after a beat. */
async function fxPlayer(canvas, id, scale) {
  const e = fxIndex[id];
  if (!e) return;
  const [fw, fh] = e.frameSize;
  canvas.width = fw * scale; canvas.height = fh * scale;
  const pages = await Promise.all(e.pages.map((p) => page("assets/fx/" + p)));
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  const p = { canvas, t: Math.random() * 2, draw(dt) {
    p.t += dt;
    const n = e.frames.length, total = n / e.fps + (e.loop ? 0 : 0.8);
    let i = Math.floor(((p.t % total) * e.fps));
    if (i >= n) i = n - 1;
    if (!e.loop && (p.t % total) * e.fps >= n) i = -1;   // the pause between replays
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (i < 0) return;
    const f = e.frames[i];
    if (f[3] === 0) return;
    ctx.drawImage(pages[f[0]], f[1], f[2], f[3], f[4], f[5] * scale, f[6] * scale, f[3] * scale, f[4] * scale);
  } };
  players.push(p);
}

/** The knight: plays a sequence of hero animations (grid sheets), e.g. attack then idle. */
async function heroPlayer(canvas, scale, seq, onLoop) {
  const anims = await Promise.all(seq.map(async (k) => ({ k, e: heroIndex[k], img: await page("assets/hero/" + heroIndex[k].image) })));
  const [fw, fh] = anims[0].e.frameSize;
  canvas.width = fw * scale; canvas.height = fh * scale;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  const p = { canvas, a: 0, t: 0, anims, draw(dt) {
    p.t += dt;
    let cur = p.anims[p.a];
    const n = cur.e.frames;
    let i = Math.floor(p.t * cur.e.fps);
    if (i >= n) {
      p.a = (p.a + 1) % p.anims.length;
      p.t = 0;
      if (p.a === 0 && onLoop) onLoop(p);
      cur = p.anims[p.a];
      i = 0;
    }
    const cols = cur.e.columns;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(cur.img, (i % cols) * fw, Math.floor(i / cols) * fh, fw, fh, 0, 0, fw * scale, fh * scale);
  } };
  players.push(p);
  return p;
}

// only animate what's on screen
const visible = new WeakSet();
const io = new IntersectionObserver((es) => es.forEach((en) => (en.isIntersecting ? visible.add(en.target) : visible.delete(en.target))), { rootMargin: "100px" });
// run fn once, the first time el comes within a screen of the viewport (that's when its sheets download)
const near = new IntersectionObserver((es) => es.forEach((en) => {
  if (!en.isIntersecting) return;
  near.unobserve(en.target);
  en.target._start();
}), { rootMargin: "600px 0px" });
const whenNear = (el, fn) => { el._start = fn; near.observe(el); };
let last = performance.now();
function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  for (const p of players) if (visible.has(p.canvas)) p.draw(dt);
  requestAnimationFrame(frame);
}

// ------------------------------------------------------------ the arsenal (the game's weapon data)
const WEAPONS = [
  ["sword", "Sword", "Fast and reliable.", 19, 64, 0, "#62c8f4"],
  ["daggers", "Daggers", "Seven quick stabs, great crit chance.", 6, 50, 90, "#e8edf6"],
  ["claws", "Claws", "Three rakes. Short but relentless.", 9, 46, 120, "#c684ff"],
  ["spear", "Spear", "Long reach, sweeps behind you too.", 24, 104, 150, "#ffe26b"],
  ["whip", "Whip", "The longest reach. Stuns.", 16, 130, 180, "#ff8a2a"],
  ["hammer", "Hammer", "Slow. Crushes and stuns everything near.", 48, 76, 260, "#f2a23a"],
  ["greatsword", "Greatsword", "A huge cleave. Slow, wide, heavy.", 40, 86, 320, "#b8c9e8"],
  ["scythe", "Scythe", "Reaps both sides and heals you a little.", 30, 96, 400, "#8cf08c"],
  ["bow", "Ranger", "A new hero: arrows fly across the arena. Moves faster.", 16, 280, 220, "#9ccc6a"],
  ["staff", "Arcane Mage", "A new hero: arcane bolts at range, skills hit harder.", 15, 175, 260, "#c48ae8"],
];
function buildWeapons() {
  const grid = document.getElementById("weapons");
  for (const [id, name, desc, dmg, reach, cost, col] of WEAPONS) {
    const card = document.createElement("article");
    card.className = "card weapon";
    card.innerHTML = `<canvas width="320" height="192"></canvas>
      <h3><img src="assets/ui/ic_${id}.png" alt=""> ${name}</h3>
      <p>${desc}</p>
      <p class="price">${cost ? cost + " coins" : "Starting weapon"}</p>
      <div class="bars" style="--c:${col}">
        <span>Damage</span><span class="bar"><i style="width:${Math.min(100, (dmg / 48) * 100)}%"></i></span>
        <span>Reach</span><span class="bar"><i style="width:${Math.min(100, (reach / 130) * 100)}%"></i></span>
      </div>`;
    grid.appendChild(card);
    const cv = card.querySelector("canvas");
    io.observe(cv);
    whenNear(cv, () => heroPlayer(cv, phone ? 1 : 2, [`${id}/attack`, `${id}/idle`]));
  }
}

// ------------------------------------------------------------ hero section: the knight shows off every weapon
async function heroKnight() {
  const cv = document.getElementById("hero-knight");
  const label = document.getElementById("hero-weapon-name");
  let w = 0;
  const p = await heroPlayer(cv, phone ? 2 : (+cv.dataset.scale || 4), [`${WEAPONS[0][0]}/attack`, `${WEAPONS[0][0]}/idle`]);
  io.observe(cv);
  const next = async () => {
    w = (w + 1) % WEAPONS.length;
    const id = WEAPONS[w][0];
    const imgs = await Promise.all([`${id}/attack`, `${id}/idle`].map(async (k) => ({ k, e: heroIndex[k], img: await page("assets/hero/" + heroIndex[k].image) })));
    p.anims = imgs; p.a = 0; p.t = 0;
    label.textContent = WEAPONS[w][1].toUpperCase();
  };
  setInterval(() => { if (!document.hidden) next(); }, 3200);
}

// ------------------------------------------------------------ fireflies, sound, lightbox
function fireflies() {
  if (reduceMotion) return;
  const box = document.querySelector(".fireflies");
  for (let i = 0; i < (phone ? 14 : 34); i++) {
    const f = document.createElement("i");
    f.style.left = Math.random() * 100 + "%";
    f.style.top = 10 + Math.random() * 75 + "%";
    f.style.setProperty("--x", (Math.random() * 120 - 60).toFixed(0) + "px");
    f.style.setProperty("--y", (Math.random() * 80 - 40).toFixed(0) + "px");
    f.style.setProperty("--d", (5 + Math.random() * 7).toFixed(1) + "s");
    f.style.setProperty("--b", (1.2 + Math.random() * 2.5).toFixed(1) + "s");
    box.appendChild(f);
  }
}

function sound() {
  const btn = document.getElementById("sound");
  let music = null, click = null, on = false;
  btn.addEventListener("click", () => {
    on = !on;
    btn.setAttribute("aria-pressed", on);
    btn.querySelector("span").textContent = on ? "Music on" : "Music off";
    if (on && !music) {
      music = new Audio("assets/audio/menu.mp3");
      music.loop = true;
      music.volume = 0.45;
      click = new Audio("assets/audio/ui_click.wav");
      click.volume = 0.4;
    }
    if (on) music.play().catch(() => {}); else music.pause();
  });
  document.querySelectorAll(".btn").forEach((b) => b.addEventListener("click", () => { if (on) { click.currentTime = 0; click.play().catch(() => {}); } }));
}

function lightbox() {
  const lb = document.getElementById("lightbox"), img = lb.querySelector("img");
  document.querySelectorAll(".shot").forEach((s) => s.addEventListener("click", () => {
    img.src = s.dataset.full;
    img.alt = s.querySelector("img").alt;
    lb.hidden = false;
    document.getElementById("lb-close").focus();
  }));
  const close = () => (lb.hidden = true);
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
  document.getElementById("lb-close").addEventListener("click", close);
  addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
}

// ------------------------------------------------------------ go
function menu() {
  const btn = document.getElementById("menu-btn"), links = document.getElementById("nav-links");
  btn.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    btn.setAttribute("aria-expanded", open);
  });
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => { links.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }));
}

// phones: fewer fireflies, smaller knight
const phone = matchMedia("(max-width: 640px)").matches;

(async () => {
  menu();
  fireflies();
  sound();
  lightbox();
  pixelText().catch(() => document.querySelectorAll(".px").forEach((el) => el.classList.add("fallback")));
  [fxIndex, heroIndex] = await Promise.all([loadJSON("assets/fx/index.json"), loadJSON("assets/hero/hero.json")]);
  document.querySelectorAll("canvas.fx[data-fx]").forEach((cv) => { io.observe(cv); whenNear(cv, () => fxPlayer(cv, cv.dataset.fx, Math.max(1, (+cv.dataset.scale || 2) - (phone && cv.closest('.hero-stage') ? 1 : 0)))); });
  buildWeapons();
  heroKnight();
  requestAnimationFrame(frame);
})();
