"use client";

import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseSize: number; // Kept base size small
  color: string;
  alpha: number;
  phase: number;
}

// Slightly softer, more pastel brand colors for "cuteness"
const BRAND_COLORS = [
  "#5a75b5", // Soft blue
  "#a4c0fc", // Baby blue
  "#eef7be", // Pale yellow/green
  "#dce5fc"  // Very pale blue
];

export default function CuteParticlesBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const mouseRef = useRef({ 
    x: -1000, y: -1000, 
    targetX: -1000, targetY: -1000 
  });
  
  const particlesRef = useRef<Particle[]>([]);
  const { scrollY } = useScroll();
  // Reduced parallax slightly for a calmer feel
  const yParallax = useTransform(scrollY, [0, 1000], [0, 100]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      
      initParticles(); 
    };

    const initParticles = () => {
      const particles: Particle[] = [];
      // Increased density slightly since they are smaller now
      const particleCount = Math.floor((width * height) / 10000); 
      
      for (let i = 0; i < particleCount; i++) {
        // CHANGE 1: Much smaller sizes
        const size = Math.random() * 1.5 + 0.5; // Range: 0.5px to 2.0px
        
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3, // Slower initial speed
          vy: (Math.random() - 0.5) * 0.3,
          baseSize: size,
          color: BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)],
          // Slightly lower alpha for delicacy
          alpha: 0.2 + Math.random() * 0.6, 
          phase: Math.random() * Math.PI * 2,
        });
      }
      particlesRef.current = particles;
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Slower mouse smoothing track
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      const time = Date.now() * 0.001;
      const particles = particlesRef.current;

      // --- 1. Draw Delicate Connections ---
      ctx.lineWidth = 0.4; // Thinner lines
      const connectionDist = 110; // CHANGE 2: Shorter connection distance (was 150)
      const connectionDistSq = connectionDist * connectionDist;

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < connectionDistSq) { 
            const dist = Math.sqrt(distSq);
            // Lower max opacity (0.15 instead of 0.2)
            const opacity = (1 - dist / connectionDist) * 0.15;
            
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            // Using the baby blue color for lines
            ctx.strokeStyle = `rgba(164, 192, 252, ${opacity})`; 
            ctx.stroke();
          }
        }
      }

      // --- 2. Update & Draw Particles ---
      particles.forEach((p) => {
        // Natural Drift
        const driftX = Math.sin(time + p.phase) * 0.015;
        const driftY = Math.cos(time + p.phase * 0.7) * 0.015;
        p.vx += driftX;
        p.vy += driftY;

        // Mouse Interaction (Gentler)
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);
        
        // CHANGE 3: Smaller influence area (was 250)
        const influenceRadius = 160; 

        if (dist < influenceRadius) {
          const force = (1 - dist / influenceRadius) * 0.05;
          // CHANGE 4: Reduced forces for gentler movement
          p.vx += dx * force * 0.15; // Attraction
          p.vx -= dy * force * 0.3;  // Swirl
          p.vy += dy * force * 0.15; // Attraction
          p.vy += dx * force * 0.3;  // Swirl
        }

        // Friction
        p.vx *= 0.96; 
        p.vy *= 0.96;
        p.x += p.vx;
        p.y += p.vy;

        // Screen Wrap with padding
        const pad = 50;
        if (p.x < -pad) p.x = width + pad;
        if (p.x > width + pad) p.x = -pad;
        if (p.y < -pad) p.y = height + pad;
        if (p.y > height + pad) p.y = -pad;

        // --- Rendering (The "Cuter" part) ---
        // Less dynamic size variation based on speed
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        // Size fluctuates gently. Speed has less impact.
        const currentSize = p.baseSize + Math.sin(time * 2 + p.phase) * 0.3 + speed * 0.5;

        // CHANGE 5: Sharper Gradients.
        // The draw radius is smaller relative to the core size.
        const drawRadius = currentSize * 2.5; 

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, drawRadius);
        // Core color stays solid longer (up to 30%) for a sharper point
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(0.3, p.color); 
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.beginPath();
        ctx.arc(p.x, p.y, drawRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.globalAlpha = p.alpha;
        
        // CHANGE 6: Removed 'lighter' composite operation.
        // This keeps colors soft instead of blowing out to white.
        ctx.globalCompositeOperation = 'source-over'; 
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
    };
    
    const handleMouseLeave = () => {
       mouseRef.current.targetX = -1000;
       mouseRef.current.targetY = -1000;
    }

    window.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <motion.div 
      ref={containerRef}
      // Changed background tint to be barely perceptible
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-slate-50/20"
      style={{ y: yParallax }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block w-full h-full"
      />
    </motion.div>
  );
}