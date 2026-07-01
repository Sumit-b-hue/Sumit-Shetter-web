"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { SiteSettings } from "@/lib/types";

export default function Hero({ settings }: { settings: SiteSettings | null }) {
  const canvasWrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = canvasWrap.current;
    if (!wrap) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      65,
      wrap.clientWidth / wrap.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 60;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(wrap.clientWidth, wrap.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    wrap.appendChild(renderer.domElement);

    // particle starfield, spiraled outward like a lens/nebula
    const count = 2200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const orange = new THREE.Color("#e8a23a");
    const white = new THREE.Color("#f5f3ef");

    for (let i = 0; i < count; i++) {
      const angle = i * 0.15;
      const radius = 4 + i * 0.045;
      const spin = angle + radius * 0.02;
      positions[i * 3] = Math.cos(spin) * radius;
      positions[i * 3 + 1] = Math.sin(spin) * radius * 0.6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 120;

      const c = Math.random() > 0.88 ? orange : white;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.9,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    let frame = 0;
    let raf = 0;
    const animate = () => {
      frame += 1;
      points.rotation.z += 0.0007;
      camera.position.x += (mouseX * 6 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 4 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      if (!wrap) return;
      camera.aspect = wrap.clientWidth / wrap.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(wrap.clientWidth, wrap.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      wrap.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <section
      id="home"
      className="relative h-screen w-full overflow-hidden bg-[radial-gradient(ellipse_at_50%_30%,#161410_0%,#0a0a0a_70%)]"
    >
      <div ref={canvasWrap} className="absolute inset-0" />

      <div className="absolute inset-x-0 bottom-16 z-20 text-center">
        <h1 className="font-mono text-[clamp(22px,3.2vw,34px)] font-bold tracking-[0.05em]">
          {settings?.hero_name ?? "SUMIT SHETTAR"}
        </h1>
        <p className="mt-2 text-[13px] uppercase tracking-[0.2em] text-gray">
          {settings?.hero_tagline ?? "Cinematic Editor & Videographer"}
        </p>
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-dim">
        Scroll
        <span className="mx-auto mt-2 block h-6 w-px animate-scrollline bg-gray-dim" />
      </div>
    </section>
  );
}
