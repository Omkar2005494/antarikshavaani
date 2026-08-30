"use client";

import React, { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
}

export default function SpaceCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    window.addEventListener("resize", handleResize);

    // Star colors: white, cyan, subtle saffron
    const starColors = ["#ffffff", "#7df4ff", "#dce2f8", "#ffb77a", "#53ffab"];

    let stars: Star[] = [];
    const numStars = 140;

    const initStars = () => {
      stars = [];
      for (let i = 0; i < numStars; i++) {
        const baseAlpha = Math.random() * 0.7 + 0.2;
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.5 + 0.4,
          vx: (Math.random() - 0.5) * 0.15, // Slow horizontal drift
          vy: Math.random() * 0.2 + 0.05,   // Gentle downward drift
          alpha: baseAlpha,
          baseAlpha: baseAlpha,
          twinkleSpeed: Math.random() * 0.03 + 0.01,
          twinklePhase: Math.random() * Math.PI * 2,
          color: starColors[Math.floor(Math.random() * starColors.length)],
        });
      }
    };

    initStars();

    // Shooting Stars Queue
    const shootingStars: ShootingStar[] = [];
    const maxShootingStars = 3;

    const spawnShootingStar = () => {
      if (shootingStars.filter((s) => s.active).length >= maxShootingStars) return;

      shootingStars.push({
        x: Math.random() * width * 1.2,
        y: Math.random() * (height * 0.4),
        length: Math.random() * 90 + 70,
        speed: Math.random() * 10 + 14,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3, // ~45 deg downward diagonal
        opacity: 1,
        active: true,
      });
    };

    // Periodically spawn shooting stars (every 3-5 seconds)
    const shootingInterval = setInterval(() => {
      spawnShootingStar();
    }, 3500);

    // Initial spawn
    setTimeout(spawnShootingStar, 1000);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Moving Background Stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Move star
        star.x += star.vx;
        star.y += star.vy;

        // Wrap around screen edges
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y > height) star.y = 0;

        // Twinkle effect
        star.twinklePhase += star.twinkleSpeed;
        star.alpha = star.baseAlpha + Math.sin(star.twinklePhase) * 0.25;
        const currentAlpha = Math.max(0.1, Math.min(1, star.alpha));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = currentAlpha;
        ctx.shadowBlur = star.radius > 1.2 ? 6 : 0;
        ctx.shadowColor = star.color;
        ctx.fill();
      }

      // 2. Draw Shooting Stars (Meteors with Glowing Trail)
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const meteor = shootingStars[i];
        if (!meteor.active) continue;

        const tailX = meteor.x - Math.cos(meteor.angle) * meteor.length;
        const tailY = meteor.y - Math.sin(meteor.angle) * meteor.length;

        // Create linear gradient for meteor trail
        const gradient = ctx.createLinearGradient(meteor.x, meteor.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${meteor.opacity})`);
        gradient.addColorStop(0.2, `rgba(125, 244, 255, ${meteor.opacity * 0.8})`);
        gradient.addColorStop(1, `rgba(125, 244, 255, 0)`);

        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.8;
        ctx.lineCap = "round";
        ctx.globalAlpha = meteor.opacity;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#7df4ff";
        ctx.stroke();

        // Meteor Head Glow
        ctx.beginPath();
        ctx.arc(meteor.x, meteor.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.globalAlpha = meteor.opacity;
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#ffffff";
        ctx.fill();

        // Update meteor position
        meteor.x += Math.cos(meteor.angle) * meteor.speed;
        meteor.y += Math.sin(meteor.angle) * meteor.speed;
        meteor.opacity -= 0.014;

        if (meteor.opacity <= 0 || meteor.x > width + 100 || meteor.y > height + 100) {
          meteor.active = false;
          shootingStars.splice(i, 1);
        }
      }

      // Reset global alpha & shadows
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(shootingInterval);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.85 }}
    />
  );
}
