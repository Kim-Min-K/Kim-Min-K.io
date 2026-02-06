document.addEventListener("DOMContentLoaded", () => {
  // 1. Mobile Menu Logic
  const menuToggle = document.getElementById("mobile-menu");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Toggle menu on click
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    menuToggle.classList.toggle("is-active");
  });

  // Close menu when a link is clicked
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
    });
  });

  // 2. Active Scroll Spy (Highlights the navbar link based on scroll position)
  const sections = document.querySelectorAll("section");
  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", () => {
    // Navbar background toggle
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      // 60px offset to trigger change slightly before the section hits top
      if (window.scrollY >= sectionTop - sectionHeight / 3) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((li) => {
      li.classList.remove("active");
      // Check if current is not empty to avoid highlighting all links at top
      if (current && li.getAttribute("href").includes(current)) {
        li.classList.add("active");
      }
    });
  });

  // 5. Typing Animation
  const typingElement = document.querySelector(".typing-text");
  const textToType = "Aspiring Data Analyst.";
  let charIndex = 0;

  function type() {
    if (charIndex < textToType.length) {
      typingElement.textContent += textToType.charAt(charIndex);
      charIndex++;
      setTimeout(type, 100);
    }
  }

  if (typingElement) setTimeout(type, 500);

  // 6. Scroll Reveal Animation
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  const hiddenElements = document.querySelectorAll(".hidden");
  hiddenElements.forEach((el) => observer.observe(el));

  // 7. Smooth Scroll with Offset (Fixes "View My Work" landing)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const navHeight = 80; // var(--nav-height)
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - navHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // 8. Theme Toggle (Light/Dark Mode)
  const themeToggle = document.getElementById("theme-toggle");
  const htmlElement = document.documentElement;
  const themeIcon = themeToggle.querySelector(".theme-icon");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = htmlElement.getAttribute("data-theme");
      const newTheme = currentTheme === "light" ? "dark" : "light";

      htmlElement.setAttribute("data-theme", newTheme);

      // Update Icon
      if (newTheme === "light") {
        // Moon Icon
        themeIcon.innerHTML =
          '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
      } else {
        // Sun Icon
        themeIcon.innerHTML =
          '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
      }
    });
  }

  // 9. Stock Market Ticker (Finnhub API)
  const tickerContainer = document.getElementById("stock-ticker");
  // Use key from config.js if available, otherwise fallback to placeholder
  const apiKey = (typeof config !== 'undefined' && config.API_KEY) ? config.API_KEY : "YOUR_API_KEY";
  const symbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA", "BTC-USD"];

  async function fetchStockData() {
    const stockData = [];

    // If no valid key, use Mock Data (Randomized for demo effect)
    if (apiKey === "YOUR_API_KEY" || apiKey === "YOUR_FINNHUB_API_KEY") {
      symbols.forEach((sym) => {
        const mockPrice = (Math.random() * 200 + 100).toFixed(2);
        const mockChange = (Math.random() * 5 - 2.5).toFixed(2);
        stockData.push({ symbol: sym, price: mockPrice, dp: parseFloat(mockChange) });
      });
    } else {
      // Fetch real data
      for (const symbol of symbols) {
        try {
          const response = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
          );
          const data = await response.json();
          if (data.c) {
            stockData.push({ symbol: symbol, price: data.c, dp: data.dp });
          }
        } catch (error) {
          console.error("Error fetching stock data:", error);
        }
      }
    }
    renderTicker(stockData);
  }

  function renderTicker(data) {
    if (!tickerContainer) return;
    tickerContainer.innerHTML = "";

    // Create items
    const createItem = (stock) => {
      const isUp = stock.dp >= 0;
      const div = document.createElement("div");
      div.className = `ticker-item ${isUp ? "up" : "down"}`;

      // SVG Arrow
      const arrowIcon = isUp
        ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>`
        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>`;

      div.innerHTML = `
        <strong>${stock.symbol}</strong>
        ${arrowIcon}
        <span>$${stock.price} (${stock.dp > 0 ? "+" : ""}${stock.dp}%)</span>
      `;
      return div;
    };

    // Duplicate list 4 times for seamless scrolling on wide screens
    data.forEach((stock) => tickerContainer.appendChild(createItem(stock)));
    data.forEach((stock) => tickerContainer.appendChild(createItem(stock)));
    data.forEach((stock) => tickerContainer.appendChild(createItem(stock)));
    data.forEach((stock) => tickerContainer.appendChild(createItem(stock)));
  }

  fetchStockData();
});
