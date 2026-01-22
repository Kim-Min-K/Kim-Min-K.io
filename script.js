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

  window.addEventListener("scroll", () => {
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

    // Particles Geometry
    const geometry = new THREE.BufferGeometry();
    const count = 1200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color(0x38bdf8);

    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 15; // Spread particles
    }

    for (let i = 0; i < count * 3; i += 3) {
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
    camera.position.z = 4;

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
      // Smoothly rotate particles to follow mouse position
      particles.rotation.x += (mouseY * 0.5 - particles.rotation.x) * 0.05;
      particles.rotation.y += (mouseX * 0.5 - particles.rotation.y) * 0.05;

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
});
