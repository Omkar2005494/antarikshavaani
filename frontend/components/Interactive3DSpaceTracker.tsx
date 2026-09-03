"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { X, Globe, Moon, Play, Pause, RotateCcw, Satellite, Compass, Info, CheckCircle2 } from "lucide-react";

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
    radius: 3.2,
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
    radius: 3.5,
    speed: 0.012,
    color: 0x34d399,
    angle: Math.PI / 3,
    tilt: 0.6,
  },
  {
    id: "eos4",
    name: "EOS-04 (Radar Imaging)",
    orbit: "Polar SSO",
    altitude: "529 km",
    velocity: "7.59 km/s",
    norad: "51656",
    status: "ACTIVE • C-BAND SAR",
    radius: 3.3,
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
    name: "Aditya-L1 (Deep Space Transfer)",
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

export default function Interactive3DSpaceTracker({
  isOpen,
  onClose,
  initialMode = "earth",
}: Interactive3DSpaceTrackerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"earth" | "moon">(initialMode);
  const [isRotating, setIsRotating] = useState(true);
  const [selectedSatellite, setSelectedSatellite] = useState<SatelliteData | null>(SATELLITES[0]);
  const [selectedSite, setSelectedSite] = useState<LunarSiteData | null>(null);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 2. Starfield Background
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1200;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 120;
      starPositions[i + 1] = (Math.random() - 0.5) * 120;
      starPositions[i + 2] = (Math.random() - 0.5) * 120;
    }
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.25, transparent: true, opacity: 0.8 });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0x222638, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
    sunLight.position.set(15, 6, 12);
    scene.add(sunLight);

    // 4. Main Globe Mesh
    const globeRadius = 2.0;
    const globeGeometry = new THREE.SphereGeometry(globeRadius, 48, 48);
    
    // Procedural Earth / Moon Material
    let globeMaterial: THREE.MeshStandardMaterial;
    if (mode === "earth") {
      globeMaterial = new THREE.MeshStandardMaterial({
        color: 0x1d4ed8,
        roughness: 0.5,
        metalness: 0.1,
        emissive: 0x051d40,
        emissiveIntensity: 0.3,
      });
    } else {
      globeMaterial = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        roughness: 0.85,
        metalness: 0.05,
        emissive: 0x1e293b,
        emissiveIntensity: 0.2,
      });
    }

    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    // Subtle atmospheric glow
    const atmosphereGeometry = new THREE.SphereGeometry(globeRadius * 1.03, 48, 48);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: mode === "earth" ? 0x38bdf8 : 0xcbd5e1,
      transparent: true,
      opacity: 0.18,
      side: THREE.BackSide,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // 5. Satellites / Lunar Sites Objects
    const satelliteMeshes: { mesh: THREE.Mesh; data: SatelliteData; orbitLine: THREE.Line }[] = [];
    const siteMeshes: { mesh: THREE.Mesh; data: LunarSiteData }[] = [];

    if (mode === "earth") {
      SATELLITES.forEach((sat) => {
        // Orbit ring
        const orbitCurve = new THREE.EllipseCurve(0, 0, sat.radius, sat.radius, 0, 2 * Math.PI, false, 0);
        const points = orbitCurve.getPoints(64);
        const orbitGeom = new THREE.BufferGeometry().setFromPoints(points.map((p) => new THREE.Vector3(p.x, 0, p.y)));
        const orbitMat = new THREE.LineBasicMaterial({ color: sat.color, transparent: true, opacity: 0.35 });
        const orbitLine = new THREE.Line(orbitGeom, orbitMat);
        orbitLine.rotation.x = sat.tilt;
        orbitLine.rotation.z = sat.tilt * 0.4;
        scene.add(orbitLine);

        // Satellite body
        const satGeom = new THREE.SphereGeometry(0.08, 16, 16);
        const satMat = new THREE.MeshBasicMaterial({ color: sat.color });
        const satMesh = new THREE.Mesh(satGeom, satMat);
        scene.add(satMesh);

        satelliteMeshes.push({ mesh: satMesh, data: sat, orbitLine });
      });
    } else {
      LUNAR_SITES.forEach((site) => {
        const pinGeom = new THREE.SphereGeometry(0.07, 16, 16);
        const pinMat = new THREE.MeshBasicMaterial({ color: site.color });
        const pinMesh = new THREE.Mesh(pinGeom, pinMat);
        pinMesh.position.set(site.x, site.y, site.z);
        globe.add(pinMesh);

        siteMeshes.push({ mesh: pinMesh, data: site });
      });
    }

    // 6. Mouse / Touch Drag Controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      globe.rotation.y += deltaX * 0.006;
      globe.rotation.x += deltaY * 0.006;
      atmosphere.rotation.y += deltaX * 0.006;
      atmosphere.rotation.x += deltaY * 0.006;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(4.5, Math.min(14, camera.position.z + e.deltaY * 0.008));
    };

    // Touch Support for Mobile
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      globe.rotation.y += deltaX * 0.006;
      globe.rotation.x += deltaY * 0.006;

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
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
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (isRotating && !isDragging) {
        globe.rotation.y += 0.002;
        atmosphere.rotation.y += 0.002;
      }

      // Update Satellite Orbits
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

    // 8. Handle Window Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      dom.removeEventListener("wheel", onWheel);
      dom.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", handleResize);

      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isOpen, mode, isRotating]);

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
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
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
                  Real-Time WebGL
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

        {/* Interactive 3D Canvas Area */}
        <div className="relative flex-1 w-full h-full bg-[#070e1d] overflow-hidden">
          <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Telemetry Inspector Overlay (Left/Top) */}
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
