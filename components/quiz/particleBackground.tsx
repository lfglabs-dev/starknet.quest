import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container, Engine } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

const MouseMask = () => {
  const [mousePosition, setMousePosition] = useState<{ x: number | null; y: number | null }>({
    x: null,
    y: null,
  });

  useEffect(() => {
    const storedPosition = sessionStorage.getItem("mousePosition");
    if (storedPosition) {
      const { x, y } = JSON.parse(storedPosition);
      setMousePosition({ x, y });
      sessionStorage.removeItem("mousePosition");
    }

    const updateMousePosition = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  const maskStyle = {
    position: "fixed" as const,
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    pointerEvents: "none" as const,
    background: `radial-gradient(350px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(16, 16, 16, 0) 0%, rgba(16, 16, 16, 1) 100%)`,
  };

  return <div style={maskStyle} />;
};

const ParticleBackground = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    const initializeParticles = async () => {
      await initParticlesEngine(async (engine: Engine) => {
        await loadSlim(engine);
      });
      setInit(true);
    };

    initializeParticles();
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    console.log(container);
  };

  return (
    <>
      {init && (
        <Particles
          id="tsparticles"
          particlesLoaded={particlesLoaded}
          options={{
            background: {
              color: "#101012",
            },
            fpsLimit: 60,
            interactivity: {
              detectsOn: "canvas",
              events: {
                onClick: { enable: true, mode: "push" },
              },
              modes: {
                push: { quantity: 4 },
              },
            },
            particles: {
              color: { value: "#ffffff" },
              links: {
                color: "#ffffff",
                distance: 150,
                enable: true,
                opacity: 0.4,
                width: 1,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: "out",
                random: false,
                speed: 2,
                straight: false,
              },
              number: { density: { enable: true }, value: 300 },
              opacity: { value: 0.5 },
              shape: { type: "circle" },
              size: { value: 3 },
            },
            detectRetina: true,
          }}
        />
      )}
      <MouseMask />
    </>
  );
};

export default ParticleBackground;
