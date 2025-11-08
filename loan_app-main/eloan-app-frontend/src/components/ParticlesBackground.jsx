// src/components/ParticlesBackground.jsx
import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim"; // loads tsparticles-slim

function ParticlesBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    // console.log(container); // Optional: for debugging
  }, []);

  // Configure particles for a subtle, modern effect
  const options = {
    background: {
      color: {
        value: "#111827", // Dark background to match your theme
      },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: {
          enable: false, // No interaction on click
          mode: "push",
        },
        onHover: {
          enable: true, // Particles react on hover
          mode: "grab", // Grab effect on hover
        },
        resize: true,
      },
      modes: {
        push: {
          quantity: 4,
        },
        grab: { // Customize grab mode
          distance: 150, // How close the mouse needs to be
          links: {
            opacity: 0.2, // Links appear on hover
          },
        },
      },
    },
    particles: {
      color: {
        // Adjust particle colors to fit your theme
        value: ["#27ae60", "#f39c12", "#ffffff", "#cccccc"], // primary-green, accent-orange, white, light-gray
      },
      links: {
        color: {
          value: "#27ae60", // Links color, use primary-green
        },
        distance: 150,
        enable: true,
        opacity: 0.1, // Very subtle links
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: true, // Random movement
        speed: 0.5, // Slow movement
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 80, // Number of particles
      },
      opacity: {
        value: 0.5, // Particle opacity
      },
      shape: {
        type: "circle", // Simple circle shape
      },
      size: {
        value: { min: 1, max: 3 }, // Varying particle sizes
      },
    },
    detectRetina: true,
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={options}
      className="absolute inset-0 z-0" // Ensure it covers the whole screen
    />
  );
}

export default ParticlesBackground;
