(() => {
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("menu");
  hamburger?.addEventListener("click", () => menu.classList.toggle("is-open"));
  document.querySelectorAll(".menu a").forEach(a => a.addEventListener("click", () => menu.classList.remove("is-open")));

  document.getElementById("year").textContent = new Date().getFullYear();

  const nav = document.getElementById("nav");
  const onScroll = () => (window.scrollY > 40 ? nav.classList.add("isSolid") : nav.classList.remove("isSolid"));
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // WhatsApp booking (EDIT NUMBER HERE)
  const WHATSAPP_NUMBER = "910000000000"; // e.g. 919999999999
  const bookingForm = document.getElementById("bookingForm");
  const bookingMsg = document.getElementById("bookingMsg");

  bookingForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(bookingForm);
    const d = Object.fromEntries(fd.entries());
    const msg =
`PLAYHAUZ Booking Request
Experience: ${d.experience}
Date: ${d.date}
Location: ${d.location}
Guests: ${d.guests}
Note: ${d.note || "-"}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    bookingMsg.textContent = "✅ Opening WhatsApp…";
    window.open(url, "_blank");
  });

  // Check/Cancel demo
  const checkMsg = document.getElementById("checkMsg");
  document.getElementById("checkBtn")?.addEventListener("click", () => {
    checkMsg.textContent = "🔎 Demo: Backend connect hone ke baad booking status yaha show hoga.";
  });
  document.getElementById("cancelBtn")?.addEventListener("click", () => {
    checkMsg.textContent = "❌ Demo: Backend connect hone ke baad cancel request yaha process hogi.";
  });

  // Tilt
  const tiltEls = Array.from(document.querySelectorAll(".tilt"));
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const isTouch = window.matchMedia("(hover: none)").matches;

  const setupTilt = (el) => {
    let raf = 0;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      const rx = clamp((0.5 - y) * 10, -10, 10);
      const ry = clamp((x - 0.5) * 12, -12, 12);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.transform = `perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
  };
  if (!isTouch) tiltEls.forEach(setupTilt);

  // Hero parallax
  const heroBg = document.getElementById("heroBg");
  let heroRaf = 0;
  if (!isTouch && heroBg) {
    window.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      cancelAnimationFrame(heroRaf);
      heroRaf = requestAnimationFrame(() => {
        heroBg.style.transform = `translate3d(${x * 10}px, ${y * 10}px, 0) scale(1.02)`;
      });
    }, { passive: true });
  }

  // GSAP cinematic reveals
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".badge", { y: 14, opacity: 0, duration: 0.8, ease: "power3.out" });
    gsap.from(".title", { y: 18, opacity: 0, duration: 0.9, delay: 0.05, ease: "power3.out" });
    gsap.from(".sub", { y: 18, opacity: 0, duration: 0.9, delay: 0.1, ease: "power3.out" });
    gsap.from(".actions", { y: 12, opacity: 0, duration: 0.8, delay: 0.18, ease: "power3.out" });
    gsap.from(".stats .stat", { y: 14, opacity: 0, duration: 0.8, stagger: 0.08, delay: 0.22, ease: "power3.out" });
    gsap.from("#slotCard", { y: 18, opacity: 0, duration: 0.9, delay: 0.15, ease: "power3.out" });
    gsap.from(".hero__miniGrid .miniCard", { y: 16, opacity: 0, duration: 0.7, stagger: 0.06, delay: 0.2, ease: "power3.out" });

    document.querySelectorAll(".reveal").forEach((el) => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" }
      });
    });
  }

  // Ambient particles
  const canvas = document.getElementById("fx");
  const ctx = canvas.getContext("2d");
  let w, h, dpr;
  const particles = [];
  const count = 70;
  const colors = [[255,60,172],[43,134,197],[0,245,160]];

  const resize = () => {
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    w = canvas.width = Math.floor(window.innerWidth * dpr);
    h = canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
  };
  window.addEventListener("resize", resize, { passive: true });
  resize();

  const rand = (a,b) => a + Math.random()*(b-a);
  const init = () => {
    particles.length = 0;
    for (let i=0;i<count;i++){
      const c = colors[(Math.random()*colors.length)|0];
      particles.push({x:rand(0,w),y:rand(0,h),r:rand(1.2,3.2)*dpr,vx:rand(-0.25,0.25)*dpr,vy:rand(-0.15,0.15)*dpr,a:rand(0.15,0.45),c});
    }
  };
  init();

  const draw = () => {
    ctx.clearRect(0,0,w,h);

    const grad = ctx.createRadialGradient(w*0.3, h*0.2, 0, w*0.5, h*0.5, Math.max(w,h));
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(1, "rgba(0,0,0,0.55)");
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,w,h);

    for (const p of particles){
      p.x += p.vx; p.y += p.vy;
      if (p.x < -20) p.x = w+20;
      if (p.x > w+20) p.x = -20;
      if (p.y < -20) p.y = h+20;
      if (p.y > h+20) p.y = -20;

      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle = `rgba(${p.c[0]},${p.c[1]},${p.c[2]},${p.a})`;
      ctx.fill();
    }

    for (let i=0;i<particles.length;i++){
      for (let j=i+1;j<particles.length;j++){
        const a = particles[i], b = particles[j];
        const dx = a.x-b.x, dy = a.y-b.y;
        const dist = Math.hypot(dx,dy);
        const max = 140*dpr;
        if (dist < max){
          const alpha = (1 - dist/max) * 0.12;
          ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
          ctx.lineWidth = 1*dpr;
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  };
  draw();
})();