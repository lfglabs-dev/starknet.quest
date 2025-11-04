"use client";
import React, { useEffect, useRef } from "react";
import styles from "@styles/components/shapes.module.css";

const AnimatedBackground: React.FC = () => {
  const interactiveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let curX = 0;
    let curY = 0;
    let tgX = 0;
    let tgY = 0;
    
    const interBubble = interactiveRef.current;
    if (!interBubble) return;

    const handleMouseMove = (event: MouseEvent) => {
      tgX = event.clientX;
      tgY = event.clientY;
    };

    function move() {
      curX += (tgX - curX) / 20;
      curY += (tgY - curY) / 20;
      if (interBubble) {
        interBubble.style.transform = `translate(${Math.round(curX / 5)}px, ${Math.round(curY / 5)}px)`;
      }
      requestAnimationFrame(move);
    }

    window.addEventListener("mousemove", handleMouseMove);
    move();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className={styles.gradientBg}>
      <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0">
        <defs>
          <filter id="gooey-effect">
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur" />
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -8" 
              result="goo" 
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
      <div className={styles.gradientsContainer}>
        <div className={styles.g1}></div>
        <div className={styles.g2}></div>
        <div className={styles.g3}></div>
        <div className={styles.g4}></div>
        <div ref={interactiveRef} className={styles.interactive}></div>
      </div>
    </div>
  );
};

export default AnimatedBackground;