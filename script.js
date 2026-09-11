/* =========================================================
   GOSTO DE RICA
   Landing Page - script.js
========================================================= */


/* =========================================================
   UTILITÁRIOS
========================================================= */

function safeConfigValue(value, fallback = null) {
  return value !== undefined && value !== null
    ? value
    : fallback;
}


function logDebug(...args) {
  if (
    typeof CONFIG !== "undefined" &&
    CONFIG.debug
  ) {
    console.log(
      "[Gosto de Rica]",
      ...args
    );
  }
}


function generateEventId() {
  if (
    window.crypto &&
    typeof window.crypto.randomUUID === "function"
  ) {
    return window.crypto.randomUUID();
  }

  return (
    "event_" +
    Date.now() +
    "_" +
    Math.random()
      .toString(36)
      .substring(2, 12)
  );
}


/* =========================================================
   ANO ATUAL
========================================================= */

function setupCurrentYear() {
  const yearElement =
    document.getElementById("currentYear");

  if (!yearElement) {
    return;
  }

  yearElement.textContent =
    new Date().getFullYear();
}


/* =========================================================
   UTMs
========================================================= */

function captureTrackingParameters() {

  if (
    !CONFIG?.tracking?.enableUtmCapture
  ) {
    return {};
  }


  const urlParams =
    new URLSearchParams(
      window.location.search
    );


  const trackingKeys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "fbclid"
  ];


  const trackingData = {};


  trackingKeys.forEach((key) => {

    const value =
      urlParams.get(key);

    if (value) {

      trackingData[key] = value;

      try {
        sessionStorage.setItem(
          key,
          value
        );
      } catch (error) {
        logDebug(
          "Não foi possível salvar",
          key,
          error
        );
      }

    }

  });


  trackingKeys.forEach((key) => {

    if (trackingData[key]) {
      return;
    }

    try {

      const savedValue =
        sessionStorage.getItem(key);

      if (savedValue) {
        trackingData[key] =
          savedValue;
      }

    } catch (error) {
      logDebug(
        "Erro ao recuperar tracking",
        error
      );
    }

  });


  logDebug(
    "Tracking capturado:",
    trackingData
  );


  return trackingData;
}


/* =========================================================
   META PIXEL
========================================================= */

function setupMetaPixel() {

  const enabled =
    CONFIG?.tracking?.enableMetaPixel;


  const pixelId =
    CONFIG?.metaPixelId;


  if (
    !enabled ||
    !pixelId ||
    pixelId === "SEU_PIXEL_ID"
  ) {

    logDebug(
      "Meta Pixel não configurado."
    );

    return;
  }


  if (
    typeof window.initializeMetaPixel ===
    "function"
  ) {

    window.initializeMetaPixel(
      pixelId
    );


    setTimeout(() => {

      trackMetaEvent(
        "ViewContent",
        {
          content_name:
            "Landing Gosto de Rica",

          content_category:
            "WhatsApp Group"
        }
      );

    }, 500);

  }

}


/* =========================================================
   EVENTOS META
========================================================= */

function trackMetaEvent(
  eventName,
  data = {},
  eventId = null
) {

  if (
    typeof fbq !== "function"
  ) {

    logDebug(
      "fbq indisponível:",
      eventName
    );

    return;
  }


  try {

    if (eventId) {

      fbq(
        "track",
        eventName,
        data,
        {
          eventID: eventId
        }
      );

    } else {

      fbq(
        "track",
        eventName,
        data
      );

    }


    logDebug(
      "Evento Meta:",
      eventName,
      data
    );

  } catch (error) {

    logDebug(
      "Erro no Meta Pixel:",
      error
    );

  }

}


function trackCustomMetaEvent(
  eventName,
  data = {},
  eventId = null
) {

  if (
    typeof fbq !== "function"
  ) {
    return;
  }


  if (
    !CONFIG?.tracking?.enableCustomEvents
  ) {
    return;
  }


  try {

    if (eventId) {

      fbq(
        "trackCustom",
        eventName,
        data,
        {
          eventID: eventId
        }
      );

    } else {

      fbq(
        "trackCustom",
        eventName,
        data
      );

    }

  } catch (error) {

    logDebug(
      "Erro evento customizado:",
      error
    );

  }

}


/* =========================================================
   BARRA DE OCUPAÇÃO
========================================================= */

function setupScarcityBar() {

  const scarcitySection =
    document.getElementById("vagas");


  if (
    !CONFIG?.enableScarcityBar
  ) {

    if (scarcitySection) {
      scarcitySection.style.display =
        "none";
    }

    return;
  }


  const currentMembers =
    Number(
      safeConfigValue(
        CONFIG.currentMembers,
        0
      )
    );


  const maxMembers =
    Number(
      safeConfigValue(
        CONFIG.maxMembers,
        1
      )
    );


  if (
    maxMembers <= 0
  ) {
    return;
  }


  const percentage =
    Math.min(
      100,
      Math.max(
        0,
        Math.round(
          (
            currentMembers /
            maxMembers
          ) * 100
        )
      )
    );


  const percentageElement =
    document.getElementById(
      "occupancyPercentage"
    );


  const progressElement =
    document.getElementById(
      "occupancyProgress"
    );


  const textElement =
    document.getElementById(
      "occupancyText"
    );


  const titleElement =
    document.getElementById(
      "scarcityTitle"
    );


  if (percentageElement) {

    percentageElement.textContent =
      `${percentage}%`;

  }


  if (progressElement) {

    requestAnimationFrame(() => {

      setTimeout(() => {

        progressElement.style.width =
          `${percentage}%`;

      }, 250);

    });

  }


  if (textElement) {

    textElement.textContent =
      `${currentMembers.toLocaleString(
        "pt-BR"
      )} de ${maxMembers.toLocaleString(
        "pt-BR"
      )} vagas ocupadas`;

  }


  if (titleElement) {

    let message =
      CONFIG?.scarcityMessages?.normal;


    if (percentage >= 90) {

      message =
        CONFIG?.scarcityMessages
          ?.critical;

    } else if (
      percentage >= 80
    ) {

      message =
        CONFIG?.scarcityMessages?.high;

    }


    if (message) {

      titleElement.textContent =
        message;

    }

  }


  logDebug(
    "Ocupação:",
    percentage + "%"
  );

}


/* =========================================================
   WHATSAPP
========================================================= */

function setupWhatsappButtons(
  trackingData
) {

  const buttons =
    document.querySelectorAll(
      "[data-whatsapp-cta]"
    );


  const whatsappUrl =
    CONFIG?.whatsappGroupUrl;


  if (
    !whatsappUrl ||
    whatsappUrl.includes(
      "SEU_LINK_DO_GRUPO"
    )
  ) {

    logDebug(
      "Link do WhatsApp não configurado."
    );

  }


  buttons.forEach(
    (button) => {

      if (
        whatsappUrl &&
        !whatsappUrl.includes(
          "SEU_LINK_DO_GRUPO"
        )
      ) {

        button.href =
          whatsappUrl;

      }


      button.setAttribute(
        "target",
        "_blank"
      );


      button.setAttribute(
        "rel",
        "noopener noreferrer"
      );


      button.addEventListener(
        "click",
        () => {

          const location =
            button.dataset.ctaLocation ||
            "unknown";


          const eventId =
            generateEventId();


          const eventData = {

            content_name:
              "Grupo WhatsApp Gosto de Rica",

            content_category:
              "WhatsApp Group",

            cta_location:
              location,

            ...trackingData

          };


          trackMetaEvent(
            "Lead",
            eventData,
            eventId
          );


          trackCustomMetaEvent(
            "WhatsAppGroupClick",
            eventData,
            eventId
          );


          saveLocalConversion({
            eventId,
            location,
            timestamp:
              new Date().toISOString(),
            tracking:
              trackingData
          });


          logDebug(
            "Clique WhatsApp:",
            eventData
          );

        }
      );

    }
  );

}


/* =========================================================
   SALVAR CONVERSÃO LOCALMENTE
========================================================= */

function saveLocalConversion(
  conversion
) {

  try {

    const existing =
      JSON.parse(
        localStorage.getItem(
          "gostoDeRicaConversions"
        )
      ) || [];


    existing.push(
      conversion
    );


    const limited =
      existing.slice(-20);


    localStorage.setItem(
      "gostoDeRicaConversions",
      JSON.stringify(
        limited
      )
    );

  } catch (error) {

    logDebug(
      "Erro ao salvar conversão:",
      error
    );

  }

}


/* =========================================================
   CTA FLUTUANTE
========================================================= */

function setupFloatingCTA() {

  const floatingCta =
    document.getElementById(
      "floatingCta"
    );


  if (!floatingCta) {
    return;
  }


  const hero =
    document.querySelector(
      ".hero"
    );


  const finalSection =
    document.getElementById(
      "entrar"
    );


  function updateFloatingCTA() {

    const scrollY =
      window.scrollY;


    const heroBottom =
      hero
        ? hero.offsetTop +
          hero.offsetHeight
        : 400;


    let shouldShow =
      scrollY >
      heroBottom * 0.7;


    if (finalSection) {

      const finalRect =
        finalSection.getBoundingClientRect();


      const finalVisible =
        finalRect.top <
        window.innerHeight * 0.8;


      if (finalVisible) {
        shouldShow = false;
      }

    }


    floatingCta.classList.toggle(
      "is-visible",
      shouldShow
    );

  }


  updateFloatingCTA();


  window.addEventListener(
    "scroll",
    updateFloatingCTA,
    {
      passive: true
    }
  );


  window.addEventListener(
    "resize",
    updateFloatingCTA
  );

}


/* =========================================================
   SCROLL DEPTH
========================================================= */

function setupScrollTracking() {

  const tracked = {
    25: false,
    50: false,
    75: false,
    90: false
  };


  function checkScrollDepth() {

    const documentHeight =
      document.documentElement
        .scrollHeight -
      window.innerHeight;


    if (
      documentHeight <= 0
    ) {
      return;
    }


    const percentage =
      Math.round(
        (
          window.scrollY /
          documentHeight
        ) * 100
      );


    Object.keys(
      tracked
    ).forEach(
      (point) => {

        const numericPoint =
          Number(point);


        if (
          percentage >=
            numericPoint &&
          !tracked[point]
        ) {

          tracked[point] =
            true;


          trackCustomMetaEvent(
            "ScrollDepth",
            {
              percentage:
                numericPoint
            }
          );


          logDebug(
            "Scroll:",
            numericPoint + "%"
          );

        }

      }
    );

  }


  window.addEventListener(
    "scroll",
    checkScrollDepth,
    {
      passive: true
    }
  );

}


/* =========================================================
   TEMPO NA PÁGINA
========================================================= */

function setupEngagementTracking() {

  const intervals = [
    15,
    30,
    60
  ];


  intervals.forEach(
    (seconds) => {

      setTimeout(() => {

        trackCustomMetaEvent(
          "PageEngagement",
          {
            seconds:
              seconds
          }
        );

      }, seconds * 1000);

    }
  );

}


/* =========================================================
   VISIBILIDADE DOS ELEMENTOS
========================================================= */

function setupRevealAnimations() {

  const elements =
    document.querySelectorAll(
      ".benefit-card, .scarcity-card, .experience-card, .final-cta-card"
    );


  if (
    !("IntersectionObserver" in window)
  ) {

    elements.forEach(
      (element) => {
        element.classList.add(
          "is-revealed"
        );
      }
    );

    return;
  }


  const observer =
    new IntersectionObserver(
      (entries) => {

        entries.forEach(
          (entry) => {

            if (
              entry.isIntersecting
            ) {

              entry.target.classList.add(
                "is-revealed"
              );


              observer.unobserve(
                entry.target
              );

            }

          }
        );

      },
      {
        threshold: 0.12
      }
    );


  elements.forEach(
    (element) => {

      element.classList.add(
        "reveal-element"
      );

      observer.observe(
        element
      );

    }
  );

}


/* =========================================================
   CSS DAS ANIMAÇÕES
========================================================= */

function injectRevealStyles() {

  const style =
    document.createElement(
      "style"
    );


  style.textContent = `
    .reveal-element {
      opacity: 0;
      transform: translateY(20px);
      transition:
        opacity 0.65s ease,
        transform 0.65s ease;
    }

    .reveal-element.is-revealed {
      opacity: 1;
      transform: translateY(0);
    }

    @media (prefers-reduced-motion: reduce) {
      .reveal-element {
        opacity: 1;
        transform: none;
      }
    }
  `;


  document.head.appendChild(
    style
  );

}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

function initializeLandingPage() {

  if (
    typeof CONFIG ===
    "undefined"
  ) {

    console.error(
      "CONFIG não foi carregado. Verifique o arquivo config.js."
    );

    return;
  }


  logDebug(
    "Inicializando landing..."
  );


  const trackingData =
    captureTrackingParameters();


  setupCurrentYear();

  setupMetaPixel();

  setupScarcityBar();

  setupWhatsappButtons(
    trackingData
  );

  setupFloatingCTA();

  setupScrollTracking();

  setupEngagementTracking();

  injectRevealStyles();

  setupRevealAnimations();


  logDebug(
    "Landing inicializada."
  );

}


/* =========================================================
   DOM READY
========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializeLandingPage
  );

} else {

  initializeLandingPage();

}
