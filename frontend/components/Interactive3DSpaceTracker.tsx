"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { X, Globe, Moon, Play, Pause, Satellite, Compass, Radio, CheckCircle2 } from "lucide-react";

interface Interactive3DSpaceTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "earth" | "moon";
}

interface SatelliteData {
  id: string;
  name: string;
  orbit: string;
  altitude: string;
  velocity: string;
  norad: string;
  status: string;
  radius: number;
  speed: number;
  color: number;
  angle: number;
  tilt: number;
}

interface LunarSiteData {
  id: string;
  name: string;
  lat: string;
  lon: string;
  discovery: string;
  status: string;
  color: number;
  x: number;
  y: number;
  z: number;
}

const SATELLITES: SatelliteData[] = [
  {
    id: "cartosat",
    name: "Cartosat-3",
    orbit: "Sun-Synchronous (SSO)",
    altitude: "505 km",
    velocity: "7.61 km/s",
    norad: "44804",
    status: "ACTIVE • NOMINAL",
    radius: 3.3,
    speed: 0.015,
    color: 0x38bdf8,
    angle: 0,
    tilt: 0.8,
  },
  {
    id: "risat",
    name: "RISAT-2BR1",
    orbit: "Low Earth Orbit (LEO)",
    altitude: "576 km",
    velocity: "7.56 km/s",
    norad: "44857",
    status: "ACTIVE • X-BAND SAR",
    radius: 3.6,
    speed: 0.012,
    color: 0x34d399,
    angle: Math.PI / 3,
    tilt: 0.6,
  },
  {
    id: "eos4",
    name: "EOS-04 (Radar)",
    orbit: "Polar SSO",
    altitude: "529 km",
    velocity: "7.59 km/s",
    norad: "51656",
    status: "ACTIVE • C-BAND SAR",
    radius: 3.4,
    speed: 0.014,
    color: 0xa78bfa,
    angle: Math.PI,
    tilt: 1.2,
  },
  {
    id: "gsat30",
    name: "GSAT-30",
    orbit: "Geostationary (GEO)",
    altitude: "35,786 km",
    velocity: "3.07 km/s",
    norad: "45026",
    status: "ACTIVE • Ku/C-BAND",
    radius: 4.8,
    speed: 0.004,
    color: 0xfbbf24,
    angle: Math.PI * 1.5,
    tilt: 0.1,
  },
  {
    id: "aditya",
    name: "Aditya-L1 (Deep Space)",
    orbit: "Sun-Earth L1 Halo",
    altitude: "1.5M km",
    velocity: "1.42 km/s",
    norad: "57790",
    status: "ACTIVE • SOLAR CORONA",
    radius: 5.6,
    speed: 0.002,
    color: 0xf97316,
    angle: Math.PI * 0.7,
    tilt: 0.3,
  },
];

const LUNAR_SITES: LunarSiteData[] = [
  {
    id: "shiv_shakti",
    name: "Shiv Shakti Point (Chandrayaan-3)",
    lat: "69.373° S",
    lon: "32.319° E",
    discovery: "In-situ 0.42 wt% Sulfur detected by Pragyan LIBS; 61.4°C thermal drop by ChaSTE",
    status: "CONFIRMED LANDING",
    color: 0x34d399,
    x: 0.6,
    y: -1.7,
    z: 0.9,
  },
  {
    id: "tiranga",
    name: "Tiranga Point (Chandrayaan-2)",
    lat: "70.90° S",
    lon: "22.78° E",
    discovery: "IIR 3.0µm water-ice absorption confirmed (2,100 PPM at Cabeus PSR)",
    status: "SURFACE IMPACT SITE",
    color: 0x38bdf8,
    x: 0.4,
    y: -1.75,
    z: 0.7,
  },
  {
    id: "manzinus",
    name: "Manzinus C Crater Rim",
    lat: "44.9° S",
    lon: "26.3° E",
    discovery: "Deep Permanently Shadowed Region (PSR) with hydroxyl OH retention",
    status: "HIGH-PRIORITY SCIENCE",
    color: 0xfbbf24,
    x: 0.8,
    y: -1.2,
    z: 1.2,
  },
];

// Generates procedural texture for Earth with continents & oceans
function createEarthCanvasTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  // Deep Ocean Gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, 512);
  oceanGrad.addColorStop(0, "#082f49");
  oceanGrad.addColorStop(0.5, "#0369a1");
  oceanGrad.addColorStop(1, "#082f49");
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // Continents Landmass Shapes
  ctx.fillStyle = "#15803d"; // Forest green
  
  // Eurasia & India
  ctx.beginPath();
  ctx.ellipse(650, 180, 140, 80, 0, 0, Math.PI * 2);
  ctx.fill();

  // Indian Subcontinent (Prominent triangle)
  ctx.fillStyle = "#16a34a";
  ctx.beginPath();
  ctx.moveTo(680, 180);
  ctx.lineTo(720, 260);
  ctx.lineTo(640, 240);
  ctx.closePath();
  ctx.fill();

  // Africa
  ctx.fillStyle = "#15803d";
  ctx.beginPath();
  ctx.ellipse(520, 260, 70, 100, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Americas
  ctx.beginPath();
  ctx.ellipse(250, 160, 80, 90, -0.2, 0, Math.PI * 2); // North
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(320, 320, 60, 90, 0.3, 0, Math.PI * 2); // South
  ctx.fill();

  // Australia
  ctx.beginPath();
  ctx.ellipse(820, 340, 50, 40, 0, 0, Math.PI * 2);
  ctx.fill();

  // Polar Ice Caps
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, 1024, 30);
  ctx.fillRect(0, 480, 1024, 32);

  // Cloud swirls
  ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
  for (let i = 0; i < 16; i++) {
    ctx.beginPath();
    ctx.arc(60 + i * 65, 120 + Math.sin(i) * 50, 35, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(40 + i * 65, 300 + Math.cos(i) * 60, 45, 0, Math.PI * 2);
    ctx.fill();
  }

  // Latitude / Longitude coordinate lines
  ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
  ctx.lineWidth = 1;
  for (let lat = 60; lat < 512; lat += 60) {
    ctx.beginPath();
    ctx.moveTo(0, lat);
    ctx.lineTo(1024, lat);
    ctx.stroke();
  }
  for (let lon = 100; lon < 1024; lon += 100) {
    ctx.beginPath();
    ctx.moveTo(lon, 0);
    ctx.lineTo(lon, 512);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// Generates procedural texture for Moon with basaltic craters
function createMoonCanvasTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  // Grey basaltic regolith base
  ctx.fillStyle = "#64748b";
  ctx.fillRect(0, 0, 1024, 512);

  // Dark Lunar Maria basins
  ctx.fillStyle = "#334155";
  ctx.beginPath();
  ctx.ellipse(320, 200, 120, 90, 0.2, 0, Math.PI * 2); // Oceanus Procellarum
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(560, 180, 80, 60, 0, 0, Math.PI * 2); // Mare Imbrium
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(700, 220, 70, 50, -0.2, 0, Math.PI * 2); // Mare Tranquillitatis
  ctx.fill();

  // Impact craters
  ctx.fillStyle = "#94a3b8";
  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 2;
  const craterSeeds = [
    [150, 120, 25], [240, 360, 35], [450, 300, 20], [620, 390, 40],
    [800, 150, 30], [890, 320, 22], [500, 440, 28]
  ];
  craterSeeds.forEach(([cx, cy, r]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });

  // South Pole beacon (Shiv Shakti Point location highlight)
  ctx.fillStyle = "#34d399";
  ctx.beginPath();
  ctx.arc(710, 460, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(52, 211, 153, 0.6)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(710, 460, 18, 0, Math.PI * 2);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export default function Interactive3DSpaceTracker({
  isOpen,
  onClose,
  initialMode = "earth",
}: Interactive3DSpaceTrackerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"earth" | "moon">(initialMode);
  const [isRotating, setIsRotating] = useState(true);
  const isRotatingRef = useRef(true);
  isRotatingRef.current = isRotating;

  const [selectedSatellite, setSelectedSatellite] = useState<SatelliteData | null>(SATELLITES[0]);
  const [selectedSite, setSelectedSite] = useState<LunarSiteData | null>(null);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const container = containerRef.current;
    let width = container.clientWidth || 800;
    let height = container.clientHeight || 500;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2.8, 8.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 2. Starfield
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1400;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 140;
      starPositions[i + 1] = (Math.random() - 0.5) * 140;
      starPositions[i + 2] = (Math.random() - 0.5) * 140;
    }
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.25, transparent: true, opacity: 0.85 });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.2);
    sunLight.position.set(12, 8, 10);
    scene.add(sunLight);

    // 4. Globe Sphere with Procedural Map Texture
    const globeRadius = 2.0;
    const globeGeometry = new THREE.SphereGeometry(globeRadius, 64, 64);
    
    const texture = mode === "earth" ? createEarthCanvasTexture() : createMoonCanvasTexture();
    const globeMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: mode === "earth" ? 0.6 : 0.9,
      metalness: mode === "earth" ? 0.1 : 0.05,
    });

    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    // Atmosphere Glow
    const atmosphereGeometry = new THREE.SphereGeometry(globeRadius * 1.04, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: mode === "earth" ? 0x38bdf8 : 0x94a3b8,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // 5. Satellites / Lunar Sites
    const satelliteMeshes: { mesh: THREE.Mesh; data: SatelliteData; orbitLine: THREE.Line }[] = [];
    const siteMeshes: { mesh: THREE.Mesh; data: LunarSiteData }[] = [];

    if (mode === "earth") {
      SATELLITES.forEach((sat) => {
        // Orbit ring
        const orbitCurve = new THREE.EllipseCurve(0, 0, sat.radius, sat.radius, 0, 2 * Math.PI, false, 0);
        const points = orbitCurve.getPoints(80);
        const orbitGeom = new THREE.BufferGeometry().setFromPoints(points.map((p) => new THREE.Vector3(p.x, 0, p.y)));
        const orbitMat = new THREE.LineBasicMaterial({ color: sat.color, transparent: true, opacity: 0.45 });
        const orbitLine = new THREE.Line(orbitGeom, orbitMat);
        orbitLine.rotation.x = sat.tilt;
        orbitLine.rotation.z = sat.tilt * 0.4;
        scene.add(orbitLine);

        // Satellite node with glow
        const satGeom = new THREE.SphereGeometry(0.1, 16, 16);
        const satMat = new THREE.MeshBasicMaterial({ color: sat.color });
        const satMesh = new THREE.Mesh(satGeom, satMat);
        scene.add(satMesh);

        satelliteMeshes.push({ mesh: satMesh, data: sat, orbitLine });
      });
    } else {
      LUNAR_SITES.forEach((site) => {
        const pinGeom = new THREE.SphereGeometry(0.08, 16, 16);
        const pinMat = new THREE.MeshBasicMaterial({ color: site.color });
        const pinMesh = new THREE.Mesh(pinGeom, pinMat);
        pinMesh.position.set(site.x, site.y, site.z);
        globe.add(pinMesh);

        siteMeshes.push({ mesh: pinMesh, data: site });
      });
    }

    // 6. Mouse / Touch Drag Controls
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;

      globe.rotation.y += dx * 0.007;
      globe.rotation.x += dy * 0.007;
      atmosphere.rotation.y += dx * 0.007;
      atmosphere.rotation.x += dy * 0.007;

      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(4.0, Math.min(13.0, camera.position.z + e.deltaY * 0.008));
    };

    // Mobile Touch
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - prevMouse.x;
      const dy = e.touches[0].clientY - prevMouse.y;

      globe.rotation.y += dx * 0.007;
      globe.rotation.x += dy * 0.007;
      atmosphere.rotation.y += dx * 0.007;
      atmosphere.rotation.x += dy * 0.007;

      prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    dom.addEventListener("wheel", onWheel, { passive: false });
    dom.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    // 7. Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (isRotatingRef.current && !isDragging) {
        globe.rotation.y += 0.003;
        atmosphere.rotation.y += 0.003;
      }

      if (mode === "earth") {
        satelliteMeshes.forEach(({ mesh, data, orbitLine }) => {
          data.angle += data.speed;
          const x = Math.cos(data.angle) * data.radius;
          const z = Math.sin(data.angle) * data.radius;
          const pos = new THREE.Vector3(x, 0, z);
          pos.applyEuler(orbitLine.rotation);
          mesh.position.copy(pos);
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Robust ResizeObserver (guarantees non-zero dimensions)
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    ro.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      dom.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      dom.removeEventListener("wheel", onWheel);
      dom.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);

      if (container && dom && container.contains(dom)) {
        container.removeChild(dom);
      }
      renderer.dispose();
      globeGeometry.dispose();
      globeMaterial.dispose();
      texture.dispose();
    };
  }, [isOpen, mode]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-6xl h-[92vh] bg-[#0c1322] border border-slate-800 rounded-3xl shadow-2xl shadow-cyan-950/50 flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/20">
              <Satellite className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  {mode === "earth" ? "ISRO Satellite Fleet 3D Orbit Radar" : "Chandrayaan Lunar Surface 3D Navigator"}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  WebGL 3D Active
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                Drag to rotate • Scroll to zoom • Grounded on ISRO & NORAD ephemeris
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mode Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
              <button
                onClick={() => { setMode("earth"); setSelectedSite(null); setSelectedSatellite(SATELLITES[0]); }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                  mode === "earth" ? "bg-cyan-500 text-slate-950 font-bold shadow-sm" : "text-slate-400 hover:text-white"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Earth Fleet</span>
              </button>
              <button
                onClick={() => { setMode("moon"); setSelectedSatellite(null); setSelectedSite(LUNAR_SITES[0]); }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                  mode === "moon" ? "bg-cyan-500 text-slate-950 font-bold shadow-sm" : "text-slate-400 hover:text-white"
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Moon Surface</span>
              </button>
            </div>

            <button
              onClick={() => setIsRotating(!isRotating)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
              title={isRotating ? "Pause Rotation" : "Play Rotation"}
            >
              {isRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3D Canvas Area */}
        <div className="relative flex-1 w-full h-full bg-[#070e1d] overflow-hidden">
          <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Telemetry Inspector Overlay */}
          <div className="absolute top-4 left-4 max-w-xs w-full p-4 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-2xl space-y-3 pointer-events-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                <Compass className="w-3 h-3 text-cyan-400" /> Active Mission Telemetry
              </span>
              <span className="text-[9px] font-mono text-emerald-400">IDSN Live</span>
            </div>

            {mode === "earth" && selectedSatellite && (
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold text-sm">{selectedSatellite.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    NORAD #{selectedSatellite.norad}
                  </span>
                </div>
                <div className="space-y-1 text-slate-300 text-[11px]">
                  <p><span className="text-slate-500">Orbit:</span> {selectedSatellite.orbit}</p>
                  <p><span className="text-slate-500">Altitude:</span> <span className="text-cyan-300">{selectedSatellite.altitude}</span></p>
                  <p><span className="text-slate-500">Orbital Speed:</span> <span className="text-emerald-300">{selectedSatellite.velocity}</span></p>
                  <p><span className="text-slate-500">Telemetry:</span> {selectedSatellite.status}</p>
                </div>
              </div>
            )}

            {mode === "moon" && selectedSite && (
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold text-sm">{selectedSite.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {selectedSite.status}
                  </span>
                </div>
                <div className="space-y-1 text-slate-300 text-[11px]">
                  <p><span className="text-slate-500">Coordinates:</span> <span className="text-cyan-300">{selectedSite.lat}, {selectedSite.lon}</span></p>
                  <p className="text-[10px] text-slate-400 leading-relaxed pt-1 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                    {selectedSite.discovery}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Object Selector Pills (Bottom) */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2 overflow-x-auto custom-scrollbar pointer-events-auto">
            {mode === "earth" ? (
              SATELLITES.map((sat) => (
                <button
                  key={sat.id}
                  onClick={() => setSelectedSatellite(sat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all shrink-0 border backdrop-blur-md ${
                    selectedSatellite?.id === sat.id
                      ? "bg-cyan-500/20 border-cyan-400 text-white font-bold shadow-lg shadow-cyan-500/20"
                      : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {sat.name}
                </button>
              ))
            ) : (
              LUNAR_SITES.map((site) => (
                <button
                  key={site.id}
                  onClick={() => setSelectedSite(site)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all shrink-0 border backdrop-blur-md ${
                    selectedSite?.id === site.id
                      ? "bg-emerald-500/20 border-emerald-400 text-white font-bold shadow-lg shadow-emerald-500/20"
                      : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {site.name.split("(")[0]}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
