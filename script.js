document.addEventListener("DOMContentLoaded", () => {
  // 0. Loading Screen
  const loadingScreen = document.getElementById("loading-screen");
  const loadingText = document.querySelector(".loading-text");
  const wittyMessages = [
    "Refactoring spaghetti code...",
    "Optimizing coffee intake...",
    "Training AI models...",
  ];

  if (loadingScreen) {
    let messageIndex = 0;
    const interval = setInterval(() => {
      if (loadingText && messageIndex < wittyMessages.length) {
        loadingText.textContent = wittyMessages[messageIndex++];
      } else {
        clearInterval(interval);
      }
    }, 500);

    setTimeout(() => {
      loadingScreen.classList.add("fade-out");
    }, 2500); // Show animation for 2.5s
  }

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

  // 3. Three.js Background Animation (Particle Cloud)
  const initThreeJS = () => {
    const container = document.getElementById("canvas-container");
    if (!container || typeof THREE === "undefined") return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Deep Data Field (Random Particles)
    const geometry = new THREE.BufferGeometry();
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color(0x38bdf8);

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20; // Spread particles wide
      positions[i + 1] = (Math.random() - 0.5) * 20;
      positions[i + 2] = (Math.random() - 0.5) * 20;

      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Material (Matching the blue #38bdf8 from your SVGs)
    const material = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Position camera
    camera.position.z = 5;

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;

    // Raycaster for hover effect
    const raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = 0.1; // Hitbox size
    const hoverColor = new THREE.Color(0xffffff); // White on hover
    const baseColor = new THREE.Color(0x38bdf8); // Base Blue
    let hoveredIndex = -1;

    document.addEventListener("mousemove", (event) => {
      mouseX = event.clientX / window.innerWidth - 0.5;
      mouseY = event.clientY / window.innerHeight - 0.5;
    });

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Scroll Interaction: Rotate the entire system based on scroll Y
      // Dividing by 1000 slows it down to a pleasant speed
      particles.rotation.y = window.scrollY * 0.0005;
      particles.rotation.x = window.scrollY * 0.0002;

      // Mouse Interaction: Subtle tilt on top of the scroll rotation
      particles.rotation.y += mouseX * 0.05;
      particles.rotation.x += mouseY * 0.05;

      // Raycasting
      const rayMouse = new THREE.Vector2(mouseX * 2, -mouseY * 2);
      raycaster.setFromCamera(rayMouse, camera);
      const intersects = raycaster.intersectObject(particles);

      if (intersects.length > 0) {
        const index = intersects[0].index;
        if (hoveredIndex !== index) {
          // Reset previous particle
          if (hoveredIndex !== -1)
            geometry.attributes.color.setXYZ(
              hoveredIndex,
              baseColor.r,
              baseColor.g,
              baseColor.b,
            );

          // Highlight new particle
          hoveredIndex = index;
          geometry.attributes.color.setXYZ(
            hoveredIndex,
            hoverColor.r,
            hoverColor.g,
            hoverColor.b,
          );
          geometry.attributes.color.needsUpdate = true;
        }
      } else if (hoveredIndex !== -1) {
        // Reset if no intersection
        geometry.attributes.color.setXYZ(
          hoveredIndex,
          baseColor.r,
          baseColor.g,
          baseColor.b,
        );
        geometry.attributes.color.needsUpdate = true;
        hoveredIndex = -1;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    window.addEventListener("resize", () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
  };

  initThreeJS();

  // 4. Project Cards 3D Tilt Effect
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate rotation (max +/- 10 degrees)
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      // Remove transition for instant follow, apply 3D transform
      card.style.transition = "none";
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener("mouseleave", () => {
      // Add smooth transition for reset
      card.style.transition = "transform 0.5s ease";
      card.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";

      // Clean up inline styles after animation
      setTimeout(() => {
        card.style.transition = "";
        card.style.transform = "";
      }, 500);
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
});
