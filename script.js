const EVENT = {
  startsAt: new Date("2026-11-23T20:00:00+01:00"),
  endsAt: new Date("2026-11-24T01:00:00+01:00"),
  title: "Angelo 18 — Black Party",
  location: "LUHMA Beef & Sushi Bar, Via Stabia 6, 84012 Angri SA",
  iban: "IT00 0000 0000 0000 0000 0000 000", // Sostituisci con l’IBAN reale.
  youtubeId: "dScPWds_mZI",
};

const intro = document.querySelector("#intro");
const enterButton = document.querySelector("#enter-party");
const player = document.querySelector("#audio-player");
const musicToggle = document.querySelector("#music-toggle");
const musicLabel = musicToggle.querySelector(".music-toggle__label");
const header = document.querySelector("#site-header");
const heroImage = document.querySelector(".hero__image");
const ibanValue = document.querySelector("#iban-value");
const ibanNote = document.querySelector("#iban-note");
const copyIbanButton = document.querySelector("#copy-iban");
const toast = document.querySelector("#toast");

let isMusicPlaying = false;
let toastTimer;

document.body.classList.add("is-locked");
musicToggle.hidden = true;

function startMusic() {
  const source = new URL(`https://www.youtube-nocookie.com/embed/${EVENT.youtubeId}`);
  source.search = new URLSearchParams({
    autoplay: "1",
    loop: "1",
    playlist: EVENT.youtubeId,
    controls: "0",
    disablekb: "1",
    fs: "0",
    playsinline: "1",
    rel: "0",
  });

  player.replaceChildren();
  const iframe = document.createElement("iframe");
  iframe.src = source.toString();
  iframe.allow = "autoplay; encrypted-media";
  iframe.title = "Movin’ To The Sun — HUGEL, Imael Angel & Ultra Naté";
  iframe.tabIndex = -1;
  player.append(iframe);
  isMusicPlaying = true;
  updateMusicButton();
}

function stopMusic() {
  player.replaceChildren();
  isMusicPlaying = false;
  updateMusicButton();
}

function updateMusicButton() {
  musicToggle.classList.toggle("is-paused", !isMusicPlaying);
  musicToggle.setAttribute("aria-pressed", String(isMusicPlaying));
  musicToggle.setAttribute("aria-label", isMusicPlaying ? "Metti in pausa la musica" : "Avvia la musica");
  musicLabel.textContent = isMusicPlaying ? "Sound on" : "Sound off";
}

enterButton.addEventListener("click", () => {
  startMusic();
  intro.classList.add("is-hidden");
  document.body.classList.remove("is-locked");
  musicToggle.hidden = false;
  window.setTimeout(() => intro.remove(), 900);
});

musicToggle.addEventListener("click", () => {
  if (isMusicPlaying) {
    stopMusic();
  } else {
    startMusic();
  }
});

function pad(value, length = 2) {
  return String(value).padStart(length, "0");
}

function updateCountdown() {
  const remaining = Math.max(0, EVENT.startsAt.getTime() - Date.now());
  const totalSeconds = Math.floor(remaining / 1000);
  const values = {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };

  document.querySelector("#days").textContent = pad(values.days, 3);
  document.querySelector("#hours").textContent = pad(values.hours);
  document.querySelector("#minutes").textContent = pad(values.minutes);
  document.querySelector("#seconds").textContent = pad(values.seconds);

  if (remaining === 0) {
    document.querySelector("#countdown-after").hidden = false;
  }
}

updateCountdown();
window.setInterval(updateCountdown, 1000);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -5%" },
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  revealObserver.observe(element);
});

function onScroll() {
  const scrollY = window.scrollY;
  header.classList.toggle("is-scrolled", scrollY > 24);

  if (scrollY < window.innerHeight * 1.15 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    heroImage.style.transform = `scale(1.08) translate3d(0, ${scrollY * 0.1}px, 0)`;
  }
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

function formatCalendarDate(date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

document.querySelector("#calendar-button").addEventListener("click", () => {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Angelo 18//Black Party//IT",
    "BEGIN:VEVENT",
    `UID:angelo-18-${EVENT.startsAt.getTime()}@invite`,
    `DTSTAMP:${formatCalendarDate(new Date())}`,
    `DTSTART:${formatCalendarDate(EVENT.startsAt)}`,
    `DTEND:${formatCalendarDate(EVENT.endsAt)}`,
    `SUMMARY:${EVENT.title}`,
    `LOCATION:${EVENT.location}`,
    "DESCRIPTION:Dress code: Black. Obviously.",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  const file = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = "angelo-18-black-party.ics";
  link.click();
  URL.revokeObjectURL(link.href);
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

const hasRealIban = !EVENT.iban.startsWith("IT00 0000");
ibanValue.textContent = EVENT.iban;
copyIbanButton.disabled = !hasRealIban;
ibanNote.hidden = hasRealIban;

copyIbanButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(EVENT.iban.replaceAll(" ", ""));
    showToast("IBAN copiato");
  } catch {
    showToast("Seleziona e copia l’IBAN");
  }
});

document.querySelector("#share-button").addEventListener("click", () => {
  const message = [
    "Angelo compie 18 anni ✦",
    "23 novembre 2026 · ore 20:00",
    "LUHMA Beef & Sushi Bar · Angri",
    window.location.href,
  ].join("\n");
  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
});

document.querySelectorAll(".magnetic").forEach((button) => {
  button.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    const bounds = button.getBoundingClientRect();
    const x = (event.clientX - bounds.left - bounds.width / 2) * 0.12;
    const y = (event.clientY - bounds.top - bounds.height / 2) * 0.12;
    button.style.transform = `translate(${x}px, ${y}px)`;
  });

  button.addEventListener("pointerleave", () => {
    button.style.transform = "";
  });
});
