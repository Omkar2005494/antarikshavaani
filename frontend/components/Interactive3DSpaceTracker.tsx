"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { X, Globe, Moon, Play, Pause, Satellite, Compass, Maximize2 } from "lucide-react";

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
    status: "ACTIVE • HIGH-RES OPTICAL",
    radius: 3.3,
    speed: 0.012,
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
    speed: 0.01,
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
    speed: 0.011,
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
    radius: 5.0,
    speed: 0.003,
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
    radius: 6.0,
    speed: 0.0015,
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
    discovery: "Pragyan LIBS detected 0.42 wt% Sulfur; ChaSTE recorded 61.4°C subsurface gradient",
    status: "HISTORIC LANDING SITE",
    color: 0x34d399,
    x: 0.5,
    y: -1.8,
    z: 0.7,
  },
  {
    id: "tiranga",
    name: "Tiranga Point (Chandrayaan-2)",
    lat: "70.90° S",
    lon: "22.78° E",
    discovery: "IIR 3.0µm water-ice absorption confirmed (2,100 PPM at Cabeus PSR)",
    status: "SURFACE IMPACT SITE",
    color: 0x38bdf8,
    x: 0.3,
    y: -1.85,
    z: 0.6,
  },
  {
    id: "manzinus",
    name: "Manzinus C Crater Rim",
    lat: "44.9° S",
    lon: "26.3° E",
    discovery: "Deep Permanently Shadowed Region (PSR) with cold-trapped hydroxyl OH volatiles",
    status: "HIGH-PRIORITY TARGET",
    color: 0xfbbf24,
    x: 0.7,
    y: -1.3,
    z: 1.1,
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
  const isRotatingRef = useRef(true);
  isRotatingRef.current = isRotating;

  const [selectedSatellite, setSelectedSatellite] = useState<SatelliteData | null>(SATELLITES[0]);
  const [selectedSite, setSelectedSite] = useState<LunarSiteData | null>(null);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const container = containerRef.current;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3.5, 9.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 2. Standard OrbitControls (Rotates the ENTIRE structure in 3D)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.minDistance = 2.8;
    controls.maxDistance = 20.0;
    controls.autoRotate = isRotatingRef.current;
    controls.autoRotateSpeed = 0.6;

    // 3. Starfield Background
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 180;
      starPositions[i + 1] = (Math.random() - 0.5) * 180;
      starPositions[i + 2] = (Math.random() - 0.5) * 180;
    }
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.28, transparent: true, opacity: 0.85 });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.6);
    sunLight.position.set(16, 9, 14);
    scene.add(sunLight);

    // 5. Authentic NASA Blue Marble Globe / LROC Moon
    const globeRadius = 2.1;
    const globeGeometry = new THREE.SphereGeometry(globeRadius, 64, 64);
    const textureLoader = new THREE.TextureLoader();

    let globe: THREE.Mesh;
    let cloudsMesh: THREE.Mesh | null = null;
    let atmosphereMesh: THREE.Mesh | null = null;

    if (mode === "earth") {
      // Real NASA Blue Marble Texture
      const earthMap = textureLoader.load("/textures/earth_day.jpg");
      const globeMaterial = new THREE.MeshStandardMaterial({
        map: earthMap,
        roughness: 0.55,
        metalness: 0.1,
      });
      globe = new THREE.Mesh(globeGeometry, globeMaterial);
      scene.add(globe);

      // Rotating Cloud Layer
      const cloudsMap = textureLoader.load("/textures/earth_clouds.png");
      const cloudsGeometry = new THREE.SphereGeometry(globeRadius * 1.018, 64, 64);
      const cloudsMaterial = new THREE.MeshStandardMaterial({
        map: cloudsMap,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
      });
      cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
      scene.add(cloudsMesh);

      // Blue Atmospheric Glow Halo
      const atmosphereGeometry = new THREE.SphereGeometry(globeRadius * 1.055, 64, 64);
      const atmosphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.2,
        side: THREE.BackSide,
      });
      atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
      scene.add(atmosphereMesh);
    } else {
      // Real NASA LROC Moon Texture
      const moonMap = textureLoader.load("/textures/moon.jpg");
      const globeMaterial = new THREE.MeshStandardMaterial({
        map: moonMap,
        roughness: 0.9,
        metalness: 0.05,
      });
      globe = new THREE.Mesh(globeGeometry, globeMaterial);
      scene.add(globe);
    }

    // 6. High-Fidelity 3D ISRO Satellite Assembly Builder
    const createSpacecraftModel = (sat: SatelliteData): THREE.Group => {
      const group = new THREE.Group();

      // Central Spacecraft Bus (Golden Kapton MLI thermal blanket)
      const busGeom = new THREE.BoxGeometry(0.14, 0.14, 0.22);
      const busMat = new THREE.MeshStandardMaterial({
        color: 0xeab308,
        metalness: 0.85,
        roughness: 0.25,
      });
      const bus = new THREE.Mesh(busGeom, busMat);
      group.add(bus);

      // White ceramic radiator face
      const radGeom = new THREE.PlaneGeometry(0.12, 0.2);
      const radMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
      const rad1 = new THREE.Mesh(radGeom, radMat);
      rad1.position.x = 0.071;
      rad1.rotation.y = Math.PI / 2;
      group.add(rad1);

      // Dual Photovoltaic Solar Array Wings (Navy Blue Silicon Cells)
      const panelGeom = new THREE.BoxGeometry(0.36, 0.13, 0.012);
      const panelMat = new THREE.MeshStandardMaterial({
        color: 0x1e3a8a,
        metalness: 0.8,
        roughness: 0.2,
      });
      const hingeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 });

      // Left Wing
      const leftWing = new THREE.Mesh(panelGeom, panelMat);
      leftWing.position.x = -0.28;
      group.add(leftWing);

      const leftHingeGeom = new THREE.CylinderGeometry(0.01, 0.01, 0.1);
      const leftHinge = new THREE.Mesh(leftHingeGeom, hingeMat);
      leftHinge.position.x = -0.12;
      leftHinge.rotation.z = Math.PI / 2;
      group.add(leftHinge);

      // Right Wing
      const rightWing = new THREE.Mesh(panelGeom, panelMat);
      rightWing.position.x = 0.28;
      group.add(rightWing);

      const rightHingeGeom = new THREE.CylinderGeometry(0.01, 0.01, 0.1);
      const rightHinge = new THREE.Mesh(rightHingeGeom, hingeMat);
      rightHinge.position.x = 0.12;
      rightHinge.rotation.z = Math.PI / 2;
      group.add(rightHinge);

      // Parabolic Communications Dish Antenna (Nadir-Facing)
      const dishGeom = new THREE.SphereGeometry(0.08, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.4);
      const dishMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.9,
        roughness: 0.2,
        side: THREE.DoubleSide,
      });
      const dish = new THREE.Mesh(dishGeom, dishMat);
      dish.position.z = 0.14;
      dish.rotation.x = Math.PI;
      group.add(dish);

      // Mission Payload Optics
      if (sat.id === "cartosat") {
        const camGeom = new THREE.CylinderGeometry(0.035, 0.045, 0.12, 16);
        const camMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 });
        const cam = new THREE.Mesh(camGeom, camMat);
        cam.position.y = -0.09;
        group.add(cam);
      } else if (sat.id === "aditya") {
        const tubeGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.16, 16);
        const tubeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.7 });
        const tube = new THREE.Mesh(tubeGeom, tubeMat);
        tube.position.y = 0.12;
        group.add(tube);
      }

      // Active Telemetry Beacon LED
      const beaconGeom = new THREE.SphereGeometry(0.025, 8, 8);
      const beaconMat = new THREE.MeshBasicMaterial({ color: sat.color });
      const beacon = new THREE.Mesh(beaconGeom, beaconMat);
      beacon.position.z = 0.18;
      group.add(beacon);

      group.scale.set(1.3, 1.3, 1.3);
      return group;
    };

    const satelliteMeshes: { group: THREE.Group; data: SatelliteData; orbitLine: THREE.Line }[] = [];
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

        // Realistic 3D Spacecraft Model
        const satModel = createSpacecraftModel(sat);
        scene.add(satModel);

        satelliteMeshes.push({ group: satModel, data: sat, orbitLine });
      });
    } else {
      LUNAR_SITES.forEach((site) => {
        const pinGeom = new THREE.SphereGeometry(0.08, 16, 16);
        const pinMat = new THREE.MeshBasicMaterial({ color: site.color });
        const pinMesh = new THREE.Mesh(pinGeom, pinMat);
        pinMesh.position.set(site.x, site.y, site.z);
        globe.add(pinMesh);

        const ringGeom = new THREE.RingGeometry(0.09, 0.13, 32);
        const ringMat = new THREE.MeshBasicMaterial({ color: site.color, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
        const ringMesh = new THREE.Mesh(ringGeom, ringMat);
        ringMesh.position.set(site.x, site.y, site.z);
        ringMesh.lookAt(0, 0, 0);
        globe.add(ringMesh);

        siteMeshes.push({ mesh: pinMesh, data: site });
      });
    }

    // 7. Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Auto-rotation via OrbitControls
      controls.autoRotate = isRotatingRef.current;
      controls.update();

      // Earth spins on its axis
      globe.rotation.y += 0.001;
      if (cloudsMesh) {
        cloudsMesh.rotation.y += 0.0015;
      }

      // Update satellite orbits
      if (mode === "earth") {
        satelliteMeshes.forEach(({ group, data, orbitLine }) => {
          data.angle += data.speed;
          const x = Math.cos(data.angle) * data.radius;
          const z = Math.sin(data.angle) * data.radius;
          const pos = new THREE.Vector3(x, 0, z);
          pos.applyEuler(orbitLine.rotation);
          group.position.copy(pos);
          group.lookAt(0, 0, 0);
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. ResizeObserver
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
      controls.dispose();

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      globeGeometry.dispose();
    };
  }, [isOpen, mode]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 w-screen h-screen bg-[#070e1d] overflow-hidden flex flex-col animate-fadeIn select-none"
      onClick={(e) => e.stopPropagation()}
    >
      {/* 3D WebGL Canvas (100% Fullscreen, Edge-to-Edge, Zero Border) */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0" />

      {/* Floating Top Control HUD */}
      <header className="relative z-10 p-4 sm:p-6 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 bg-slate-900/85 backdrop-blur-2xl px-4 py-2.5 rounded-2xl border border-slate-800 shadow-2xl pointer-events-auto">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/20">
            <Satellite className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">
                {mode === "earth" ? "NASA Blue Marble • ISRO Fleet" : "NASA LROC Moon • Chandrayaan-3"}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Full-Screen 3D
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400">
              Click & drag anywhere to rotate 360° in 3D • Scroll to zoom
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Mode Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900/90 backdrop-blur-2xl border border-slate-800 shadow-2xl">
            <button
              onClick={() => { setMode("earth"); setSelectedSite(null); setSelectedSatellite(SATELLITES[0]); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                mode === "earth" ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20" : "text-slate-400 hover:text-white"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Earth (NASA)</span>
            </button>
            <button
              onClick={() => { setMode("moon"); setSelectedSatellite(null); setSelectedSite(LUNAR_SITES[0]); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                mode === "moon" ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20" : "text-slate-400 hover:text-white"
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Moon (LROC)</span>
            </button>
          </div>

          <button
            onClick={() => setIsRotating(!isRotating)}
            className="p-2.5 rounded-xl bg-slate-900/90 backdrop-blur-2xl hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors shadow-2xl"
            title={isRotating ? "Pause 360° Auto-Orbit" : "Resume 360° Auto-Orbit"}
          >
            {isRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-slate-900/90 backdrop-blur-2xl hover:bg-red-500/20 hover:text-red-400 text-slate-300 border border-slate-800 transition-colors shadow-2xl"
            title="Exit Full-Screen 3D Tracker"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Floating Telemetry Inspector HUD (Left Side) */}
      <div className="absolute top-24 left-4 sm:left-6 max-w-xs w-full p-4 rounded-2xl bg-slate-900/85 backdrop-blur-2xl border border-slate-800 shadow-2xl space-y-3 z-10 pointer-events-auto">
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
              <p><span className="text-slate-500">Speed:</span> <span className="text-emerald-300">{selectedSatellite.velocity}</span></p>
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

      {/* Floating Bottom Selector Pills */}
      <div className="absolute bottom-6 left-4 right-4 flex items-center justify-center gap-2 overflow-x-auto custom-scrollbar z-10 pointer-events-auto">
        {mode === "earth" ? (
          SATELLITES.map((sat) => (
            <button
              key={sat.id}
              onClick={() => setSelectedSatellite(sat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all shrink-0 border backdrop-blur-2xl shadow-xl ${
                selectedSatellite?.id === sat.id
                  ? "bg-cyan-500/25 border-cyan-400 text-white font-bold shadow-cyan-500/20"
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
              className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all shrink-0 border backdrop-blur-2xl shadow-xl ${
                selectedSite?.id === site.id
                  ? "bg-emerald-500/25 border-emerald-400 text-white font-bold shadow-emerald-500/20"
                  : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              {site.name.split("(")[0]}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
