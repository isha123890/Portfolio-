const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("show");obs.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll(".reveal").forEach(e=>obs.observe(e));const menu=document.getElementById("menu"),nav=document.getElementById("nav");menu.onclick=()=>nav.classList.toggle("open");nav.querySelectorAll("a").forEach(a=>a.onclick=()=>nav.classList.remove("open"));const c=document.getElementById("cursor");addEventListener("pointermove",e=>{c.style.left=e.clientX+"px";c.style.top=e.clientY+"px"});
// Scroll progress
const progress = document.getElementById("scrollProgress");
function updateProgress(){
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  progress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
}
addEventListener("scroll", updateProgress, {passive:true});
updateProgress();

// Subtle parallax for the hero artwork on pointer movement.
const visual = document.querySelector(".heroVisual");
const girl = document.querySelector(".cyberGirl");
const terminal = document.querySelector(".terminal");
if (visual && matchMedia("(pointer:fine)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  visual.addEventListener("pointermove", e => {
    const r = visual.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    girl.style.marginLeft = `${x * 10}px`;
    girl.style.marginTop = `${y * 7}px`;
    terminal.style.marginRight = `${x * -7}px`;
  });
  visual.addEventListener("pointerleave", () => {
    girl.style.marginLeft = girl.style.marginTop = terminal.style.marginRight = "";
  });
}


// Premium looping typewriter: writes -> pauses -> deletes -> writes next phrase.
const typeTarget = document.getElementById("typewriter");
const typePhrases = [
  "Aspiring Red Teamer",
  "Web Security Learner",
  "Network Security Explorer",
  "Cybersecurity Intern",
  "Always Learning. Always Building."
];

let typePhrase = 0;
let typeChar = 0;
let typeDeleting = false;

function runTypewriter() {
  if (!typeTarget) return;
  const text = typePhrases[typePhrase];

  if (!typeDeleting) {
    typeTarget.textContent = text.slice(0, typeChar + 1);
    typeChar++;

    if (typeChar === text.length) {
      typeDeleting = true;
      setTimeout(runTypewriter, 1450);
      return;
    }
    setTimeout(runTypewriter, 58 + Math.random() * 32);
  } else {
    typeTarget.textContent = text.slice(0, typeChar - 1);
    typeChar--;

    if (typeChar === 0) {
      typeDeleting = false;
      typePhrase = (typePhrase + 1) % typePhrases.length;
      setTimeout(runTypewriter, 380);
      return;
    }
    setTimeout(runTypewriter, 30);
  }
}

if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  setTimeout(runTypewriter, 900);
} else if (typeTarget) {
  typeTarget.textContent = typePhrases[0];
}

// Desktop-only subtle 3D card tilt. Reset cleanly on pointer leave.
if (matchMedia("(pointer:fine)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.querySelectorAll(".cards article, .project .mock, .edu").forEach(card => {
    card.addEventListener("pointermove", e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(850px) rotateX(${y * -5}deg) rotateY(${x * 6}deg) translateY(-5px)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });

  // Small magnetic motion for primary CTA/navigation CTA.
  document.querySelectorAll(".primary, .navbtn").forEach(btn => {
    btn.addEventListener("pointermove", e => {
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX-r.left-r.width/2)*.08}px, ${(e.clientY-r.top-r.height/2)*.12}px)`;
    });
    btn.addEventListener("pointerleave", () => btn.style.transform = "");
  });
}

let lastScrollY = scrollY;
let ticker = document.querySelector(".ticker div");
addEventListener("scroll", () => {
  if (!ticker) return;
  const delta = Math.min(Math.abs(scrollY - lastScrollY), 45);
  ticker.style.letterSpacing = (2 + delta * .025) + "px";
  lastScrollY = scrollY;
}, {passive:true});

// Main hero sentence: type the full multiline headline, pause, erase it,
// pause briefly, then type it again forever.
const heroRetype = document.getElementById("heroRetype");
const heroSegments = [
  { text: "Building skills to\n", accent: false },
  { text: "break assumptions,", accent: true },
  { text: "\nnot systems.", accent: false }
];
const heroPlain = heroSegments.map(s => s.text).join("");

function renderHeroTyped(count) {
  if (!heroRetype) return;
  heroRetype.innerHTML = "";
  let remaining = count;

  for (const seg of heroSegments) {
    if (remaining <= 0) break;
    const take = Math.min(remaining, seg.text.length);
    const partial = seg.text.slice(0, take);

    partial.split("\n").forEach((piece, i, arr) => {
      if (piece) {
        const node = document.createElement(seg.accent ? "em" : "span");
        if (seg.accent) node.className = "accent-type";
        node.textContent = piece;
        heroRetype.appendChild(node);
      }
      if (i < arr.length - 1) heroRetype.appendChild(document.createElement("br"));
    });
    remaining -= take;
  }
}

let heroCount = 0;
let heroDeleting = false;

function animateHeroHeading() {
  if (!heroRetype) return;

  if (!heroDeleting) {
    heroCount++;
    renderHeroTyped(heroCount);

    if (heroCount >= heroPlain.length) {
      heroDeleting = true;
      setTimeout(animateHeroHeading, 1900);
      return;
    }
    setTimeout(animateHeroHeading, 52);
  } else {
    heroCount--;
    renderHeroTyped(heroCount);

    if (heroCount <= 0) {
      heroDeleting = false;
      setTimeout(animateHeroHeading, 520);
      return;
    }
    setTimeout(animateHeroHeading, 25);
  }
}

if (heroRetype) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    renderHeroTyped(heroPlain.length);
  } else {
    setTimeout(animateHeroHeading, 450);
  }
}
