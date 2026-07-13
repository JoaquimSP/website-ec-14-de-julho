/* ============================================================
   Esporte Clube 14 de Julho — Interações (Vanilla JS)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Header sticky ---------- */
  const header = document.getElementById("header")
  const onScrollHeader = () => {
    header.classList.toggle("scrolled", window.scrollY > 40)
  }
  onScrollHeader()
  window.addEventListener("scroll", onScrollHeader, { passive: true })

  /* ---------- Menu responsivo (hambúrguer) ---------- */
  const hamburger = document.getElementById("hamburger")
  const nav = document.getElementById("nav")

  const closeNav = () => {
    nav.classList.remove("open")
    hamburger.classList.remove("open")
    hamburger.setAttribute("aria-expanded", "false")
    hamburger.setAttribute("aria-label", "Abrir menu")
  }

  hamburger.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open")
    hamburger.classList.toggle("open", isOpen)
    hamburger.setAttribute("aria-expanded", String(isOpen))
    hamburger.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu")
  })

  nav.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", closeNav)
  })

  /* ---------- Slider ---------- */
  const slides = Array.from(document.querySelectorAll(".slide"))
  const dotsWrap = document.getElementById("sliderDots")
  const prevBtn = document.getElementById("prevSlide")
  const nextBtn = document.getElementById("nextSlide")
  let current = 0
  let timer

  // Criar indicadores
  slides.forEach((_, i) => {
    const dot = document.createElement("button")
    dot.setAttribute("role", "tab")
    dot.setAttribute("aria-label", `Ir para o slide ${i + 1}`)
    if (i === 0) dot.classList.add("active")
    dot.addEventListener("click", () => goTo(i))
    dotsWrap.appendChild(dot)
  })
  const dots = Array.from(dotsWrap.children)

  const render = () => {
    slides.forEach((s, i) => s.classList.toggle("is-active", i === current))
    dots.forEach((d, i) => d.classList.toggle("active", i === current))
  }

  const goTo = (index) => {
    current = (index + slides.length) % slides.length
    render()
    restartAuto()
  }
  const next = () => goTo(current + 1)
  const prev = () => goTo(current - 1)

  nextBtn.addEventListener("click", next)
  prevBtn.addEventListener("click", prev)

  const startAuto = () => {
    timer = setInterval(next, 6000)
  }
  const restartAuto = () => {
    clearInterval(timer)
    startAuto()
  }
  startAuto()

  // Pausar no hover
  const hero = document.querySelector(".hero")
  hero.addEventListener("mouseenter", () => clearInterval(timer))
  hero.addEventListener("mouseleave", startAuto)

  // Navegação por teclado no slider
  hero.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") next()
    if (e.key === "ArrowLeft") prev()
  })

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal")
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            entry.target.style.transitionDelay = `${(entry.target.dataset.delay || (idx % 4) * 80)}ms`
            entry.target.classList.add("in-view")
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    )
    revealEls.forEach((el) => io.observe(el))
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"))
  }

  /* ---------- Voltar ao topo ---------- */
  const toTop = document.getElementById("toTop")
  const onScrollTop = () => {
    toTop.classList.toggle("show", window.scrollY > 500)
  }
  onScrollTop()
  window.addEventListener("scroll", onScrollTop, { passive: true })
  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  })

  /* ---------- Menu ativo conforme seção visível (scrollspy) ---------- */
  const sections = document.querySelectorAll("main section[id]")
  const navLinks = document.querySelectorAll(".nav__link")

  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id")
            navLinks.forEach((link) => {
              link.classList.toggle("active", link.getAttribute("href") === `#${id}`)
            })
          }
        })
      },
      { threshold: 0.4, rootMargin: `-${header.offsetHeight}px 0px -40% 0px` },
    )
    sections.forEach((s) => spy.observe(s))
  }
})
