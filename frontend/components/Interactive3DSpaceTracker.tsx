"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { X, Globe, Moon, Play, Pause, Satellite, Compass, Target, RotateCcw, MessageSquare, ChevronDown, ChevronUp, Activity } from "lucide-react";

interface Interactive3DSpaceTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "earth" | "moon";
  onQueryMission?: (query: string) => void;
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

// Earth Orbiting Satellites
const EARTH_SATELLITES: SatelliteData[] = [
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

// Moon Orbiting Satellites (Authentic Lunar Polar Orbiters)
const LUNAR_ORBITERS: SatelliteData[] = [
  {
    id: "ch2_orbiter",
    name: "Chandrayaan-2 Orbiter (CH2-O)",
    orbit: "Lunar Polar Circular (100x100 km)",
    altitude: "100 km",
    velocity: "1.63 km/s",
    norad: "44441",
    status: "ACTIVE • 0.32m OHRC CAMERA",
    radius: 2.7,
    speed: 0.014,
    color: 0x38bdf8,
    angle: 0.5,
    tilt: 1.52, // 87° polar inclination
  },
  {
    id: "ch3_pm",
    name: "Chandrayaan-3 Propulsion Module",
    orbit: "Lunar High Elliptical Orbit",
    altitude: "153 km",
    velocity: "1.60 km/s",
    norad: "57320",
    status: "ACTIVE • SHAPE EARTH PAYLOAD",
    radius: 3.15,
    speed: 0.011,
    color: 0xf59e0b,
    angle: Math.PI * 0.8,
    tilt: 1.42,
  },
  {
    id: "nasa_lro",
    name: "NASA Lunar Reconnaissance Orbiter",
    orbit: "Lunar Polar Science Orbit",
    altitude: "50 km",
    velocity: "1.66 km/s",
    norad: "35315",
    status: "ACTIVE • LROC SURFACE RADAR",
    radius: 2.45,
    speed: 0.016,
    color: 0x34d399,
    angle: Math.PI * 1.4,
    tilt: 1.57, // 90° true polar
  },
];

// Moon Surface Historic Sites
const LUNAR_SITES: LunarSiteData[] = [
  {
    id: "shiv_shakti",
    name: "Shiv Shakti Point (Vikram & Pragyan)",
    lat: "69.373° S",
    lon: "32.319° E",
    discovery: "Vikram soft-landed Aug 23, 2023. Pragyan detected Sulfur & ChaSTE measured 61.4°C subsurface gradient.",
    status: "HISTORIC LANDING SITE",
    color: 0x34d399,
    x: 0.5,
    y: -1.95,
    z: 0.7,
  },
  {
    id: "tiranga",
    name: "Tiranga Point (Chandrayaan-2 MIP)",
    lat: "70.90° S",
    lon: "22.78° E",
    discovery: "Impact site of Chandrayaan-2 Moon Impact Probe; confirmed 3.0µm water-ice absorption depth.",
    status: "SURFACE IMPACT SITE",
    color: 0x38bdf8,
    x: 0.35,
    y: -1.98,
    z: 0.6,
  },
  {
    id: "manzinus",
    name: "Manzinus C Crater Rim",
    lat: "44.9° S",
    lon: "26.3° E",
    discovery: "Deep Permanently Shadowed Region (PSR) cold trap with volatile OH hydroxyl deposits.",
    status: "TARGET SITE",
    color: 0xfbbf24,
    x: 0.75,
    y: -1.45,
    z: 1.2,
  },
];

export default function Interactive3DSpaceTracker({
  isOpen,
  onClose,
  initialMode = "earth",
  onQueryMission,
}: Interactive3DSpaceTrackerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"earth" | "moon">(initialMode);
  const [isRotating, setIsRotating] = useState(true);
  const isRotatingRef = useRef(true);
  isRotatingRef.current = isRotating;

  const [selectedSatellite, setSelectedSatellite] = useState<SatelliteData | null>(EARTH_SATELLITES[0]);
  const [selectedSite, setSelectedSite] = useState<LunarSiteData | null>(null);
  const [hudExpanded, setHudExpanded] = useState(true);

  const targetFocusRef = useRef<{ id: string; type: "sat" | "site" | "overview" }>({
    id: "cartosat",
    type: "sat",
  });

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

    // 2. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.minDistance = 2.4;
    controls.maxDistance = 22.0;
    controls.autoRotate = false;

    // 3. Starfield
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.7);
    sunLight.position.set(16, 9, 14);
    scene.add(sunLight);

    // 5. Authentic NASA 2K Blue Marble Globe / LROC Moon
    const globeRadius = 2.1;
    const globeGeometry = new THREE.SphereGeometry(globeRadius, 64, 64);
    const textureLoader = new THREE.TextureLoader();

    let globe: THREE.Mesh;
    let cloudsMesh: THREE.Mesh | null = null;
    let atmosphereMesh: THREE.Mesh | null = null;

    if (mode === "earth") {
      const earthMap = textureLoader.load("/textures/earth_day.jpg");
      const globeMaterial = new THREE.MeshStandardMaterial({
        map: earthMap,
        roughness: 0.55,
        metalness: 0.1,
      });
      globe = new THREE.Mesh(globeGeometry, globeMaterial);
      scene.add(globe);

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
      const moonMap = textureLoader.load("/textures/moon.jpg");
      const globeMaterial = new THREE.MeshStandardMaterial({
        map: moonMap,
        roughness: 0.9,
        metalness: 0.05,
      });
      globe = new THREE.Mesh(globeGeometry, globeMaterial);
      scene.add(globe);
    }

    // 6. Authentic Spacecraft CAD Builders
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.85, roughness: 0.25 });
    const solarMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.8, roughness: 0.2 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
    const darkOpticMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6, metalness: 0.8 });

    // Build Lunar Chandrayaan-2 Orbiter (OHRC Camera + Solar Wings + Steerable Dish)
    const buildCH2Orbiter = (): THREE.Group => {
      const g = new THREE.Group();
      const bus = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.22), goldMat);
      g.add(bus);

      // OHRC Optical High-Resolution Camera barrel pointing down
      const ohrc = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.18, 16), darkOpticMat);
      ohrc.position.z = 0.15;
      ohrc.rotation.x = Math.PI / 2;
      g.add(ohrc);

      // Parabolic Communication Dish
      const dish = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.4), goldMat);
      dish.position.set(0.14, 0.08, 0);
      dish.rotation.y = Math.PI / 2;
      g.add(dish);

      // Dual Solar Wings
      const leftWing = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.14, 0.012), solarMat);
      leftWing.position.set(-0.35, 0, 0);
      g.add(leftWing);

      const rightWing = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.14, 0.012), solarMat);
      rightWing.position.set(0.35, 0, 0);
      g.add(rightWing);

      g.scale.set(1.4, 1.4, 1.4);
      return g;
    };

    // Build Chandrayaan-3 Propulsion Module
    const buildCH3PM = (): THREE.Group => {
      const g = new THREE.Group();
      // Cylindrical propulsion bus
      const bus = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.2, 16), goldMat);
      g.add(bus);

      // Top conical adapter ring (lander interface)
      const adapter = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.12, 0.08, 16), metalMat);
      adapter.position.y = 0.14;
      g.add(adapter);

      // Bottom liquid rocket engine nozzle
      const engine = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.1, 16, 1, true), metalMat);
      engine.position.y = -0.14;
      engine.rotation.x = Math.PI;
      g.add(engine);

      // Solar Panel Array
      const wing = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.16, 0.012), solarMat);
      wing.position.set(0.35, 0, 0);
      g.add(wing);

      g.scale.set(1.4, 1.4, 1.4);
      return g;
    };

    // Build NASA LRO
    const buildNASALRO = (): THREE.Group => {
      const g = new THREE.Group();
      const bus = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.18), whiteMat);
      g.add(bus);

      // High-gain dish on boom
      const dish = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.4), goldMat);
      dish.position.set(-0.16, 0.1, 0);
      dish.rotation.z = Math.PI / 4;
      g.add(dish);

      const wing = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.14, 0.012), solarMat);
      wing.position.set(0.32, 0, 0);
      g.add(wing);

      g.scale.set(1.4, 1.4, 1.4);
      return g;
    };

    // Build 3D Vikram Lander & Pragyan Rover Model on Lunar Surface
    const buildVikramLander = (): THREE.Group => {
      const g = new THREE.Group();

      // Lander Octagonal Body
      const landerBody = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.12, 0.14), goldMat);
      landerBody.position.y = 0.08;
      g.add(landerBody);

      // Top Solar Panel Deck
      const topDeck = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.01, 0.15), solarMat);
      topDeck.position.y = 0.145;
      g.add(topDeck);

      // 4 Splayed Landing Legs with Footpads
      const legPositions = [
        [0.09, 0.09, 0.5],
        [-0.09, 0.09, -0.5],
        [0.09, -0.09, 0.5],
        [-0.09, -0.09, -0.5]
      ];
      legPositions.forEach(([lx, lz, angle]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.14), metalMat);
        leg.position.set(lx, 0.04, lz);
        leg.rotation.z = angle * 0.5;
        g.add(leg);

        const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.006), goldMat);
        foot.position.set(lx * 1.35, 0.005, lz * 1.35);
        g.add(foot);
      });

      // Pragyan Rover on the ground nearby
      const rover = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.025, 0.05), goldMat);
      rover.position.set(0.18, 0.015, 0.1);
      g.add(rover);

      const roverPanel = new THREE.Mesh(new THREE.PlaneGeometry(0.035, 0.04), solarMat);
      roverPanel.position.set(0.18, 0.03, 0.1);
      roverPanel.rotation.x = -Math.PI / 2;
      g.add(roverPanel);

      // Pulsing Green Transmission Beacon
      const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), new THREE.MeshBasicMaterial({ color: 0x34d399 }));
      beacon.position.set(0, 0.17, 0);
      g.add(beacon);

      return g;
    };

    const createSpacecraftModel = (sat: SatelliteData): THREE.Group => {
      let model: THREE.Group;
      if (mode === "earth") {
        // Earth models
        if (sat.id === "cartosat") {
          const g = new THREE.Group();
          g.add(new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.22), goldMat));
          const tel = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.2, 24), darkOpticMat);
          tel.position.z = 0.16;
          tel.rotation.x = Math.PI / 2;
          g.add(tel);
          const lw = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.14, 0.012), solarMat);
          lw.position.set(-0.32, 0, 0);
          g.add(lw);
          const rw = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.14, 0.012), solarMat);
          rw.position.set(0.32, 0, 0);
          g.add(rw);
          model = g;
        } else if (sat.id === "risat") {
          const g = new THREE.Group();
          g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.22, 16), goldMat));
          const umbrella = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.42), new THREE.MeshStandardMaterial({ color: 0xf59e0b, wireframe: true, side: THREE.DoubleSide }));
          umbrella.position.z = 0.18;
          umbrella.rotation.x = Math.PI;
          g.add(umbrella);
          const wing = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.15, 0.012), solarMat);
          wing.position.set(0, -0.25, 0);
          g.add(wing);
          model = g;
        } else if (sat.id === "gsat30") {
          const g = new THREE.Group();
          g.add(new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.24), whiteMat));
          const ld = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.45), goldMat);
          ld.position.set(-0.22, 0, 0.08);
          g.add(ld);
          const rd = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.45), goldMat);
          rd.position.set(0.22, 0, 0.08);
          g.add(rd);
          const lw = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.16, 0.012), solarMat);
          lw.position.set(-0.52, 0, -0.05);
          g.add(lw);
          const rw = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.16, 0.012), solarMat);
          rw.position.set(0.52, 0, -0.05);
          g.add(rw);
          model = g;
        } else if (sat.id === "aditya") {
          const g = new THREE.Group();
          g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.22, 6), goldMat));
          const coronagraph = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.045, 0.24, 16), whiteMat);
          coronagraph.position.set(0, 0.14, 0.08);
          g.add(coronagraph);
          const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.35, 8), metalMat);
          boom.position.set(-0.25, 0, -0.05);
          boom.rotation.z = Math.PI / 2;
          g.add(boom);
          const lw = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.14, 0.012), solarMat);
          lw.position.set(-0.32, -0.05, 0);
          g.add(lw);
          const rw = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.14, 0.012), solarMat);
          rw.position.set(0.32, -0.05, 0);
          g.add(rw);
          model = g;
        } else {
          // EOS-04
          const g = new THREE.Group();
          const sar = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.2, 0.025), goldMat);
          sar.position.set(0, 0, 0.12);
          g.add(sar);
          const bus = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.16, 0.16), whiteMat);
          bus.position.set(0, 0, 0.02);
          g.add(bus);
          const tw = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.14, 0.012), solarMat);
          tw.position.set(0, 0.2, -0.02);
          g.add(tw);
          const bw = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.14, 0.012), solarMat);
          bw.position.set(0, -0.2, -0.02);
          g.add(bw);
          model = g;
        }
      } else {
        // Lunar models
        if (sat.id === "ch2_orbiter") {
          model = buildCH2Orbiter();
        } else if (sat.id === "ch3_pm") {
          model = buildCH3PM();
        } else {
          model = buildNASALRO();
        }
      }

      // Add active telemetry beacon
      const beacon = new THREE.Mesh(
        new THREE.SphereGeometry(0.03, 8, 8),
        new THREE.MeshBasicMaterial({ color: sat.color })
      );
      beacon.position.set(0, 0, 0.22);
      model.add(beacon);

      return model;
    };

    // 7. Holographic Selection Reticle
    const reticleGroup = new THREE.Group();
    const reticleRingGeom = new THREE.RingGeometry(0.35, 0.38, 32);
    const reticleRingMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.85 });
    const reticleRing = new THREE.Mesh(reticleRingGeom, reticleRingMat);
    reticleGroup.add(reticleRing);

    const chMat = new THREE.LineBasicMaterial({ color: 0x38bdf8 });
    const chPoints1 = [new THREE.Vector3(-0.45, 0, 0), new THREE.Vector3(-0.38, 0, 0)];
    const chLine1 = new THREE.Line(new THREE.BufferGeometry().setFromPoints(chPoints1), chMat);
    reticleGroup.add(chLine1);
    const chPoints2 = [new THREE.Vector3(0.38, 0, 0), new THREE.Vector3(0.45, 0, 0)];
    const chLine2 = new THREE.Line(new THREE.BufferGeometry().setFromPoints(chPoints2), chMat);
    reticleGroup.add(chLine2);
    scene.add(reticleGroup);

    // Active Satellites Array (Earth vs Moon)
    const activeSatellites = mode === "earth" ? EARTH_SATELLITES : LUNAR_ORBITERS;
    const satelliteMeshes: { group: THREE.Group; data: SatelliteData; orbitLine: THREE.Line }[] = [];
    const siteMeshes: { group: THREE.Group; data: LunarSiteData }[] = [];

    // Render Orbiters for BOTH Earth and Moon!
    activeSatellites.forEach((sat) => {
      const orbitCurve = new THREE.EllipseCurve(0, 0, sat.radius, sat.radius, 0, 2 * Math.PI, false, 0);
      const points = orbitCurve.getPoints(80);
      const orbitGeom = new THREE.BufferGeometry().setFromPoints(points.map((p) => new THREE.Vector3(p.x, 0, p.y)));
      const orbitMat = new THREE.LineBasicMaterial({ color: sat.color, transparent: true, opacity: 0.45 });
      const orbitLine = new THREE.Line(orbitGeom, orbitMat);
      orbitLine.rotation.x = sat.tilt;
      orbitLine.rotation.z = sat.tilt * 0.3;
      scene.add(orbitLine);

      const satModel = createSpacecraftModel(sat);
      scene.add(satModel);

      satelliteMeshes.push({ group: satModel, data: sat, orbitLine });
    });

    // If in Moon mode, also add the 3D surface landing sites
    if (mode === "moon") {
      LUNAR_SITES.forEach((site) => {
        const siteGroup = new THREE.Group();

        if (site.id === "shiv_shakti") {
          // Add 3D Vikram Lander & Pragyan Rover Model!
          const vikram = buildVikramLander();
          siteGroup.add(vikram);
        } else {
          // Landing pin for other impact / crater sites
          const pinGeom = new THREE.SphereGeometry(0.06, 16, 16);
          const pinMat = new THREE.MeshBasicMaterial({ color: site.color });
          siteGroup.add(new THREE.Mesh(pinGeom, pinMat));
        }

        // Holographic ground beacon ring
        const ringGeom = new THREE.RingGeometry(0.08, 0.12, 32);
        const ringMat = new THREE.MeshBasicMaterial({ color: site.color, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
        const ringMesh = new THREE.Mesh(ringGeom, ringMat);
        ringMesh.lookAt(0, 0, 0);
        siteGroup.add(ringMesh);

        siteGroup.position.set(site.x, site.y, site.z);
        siteGroup.lookAt(site.x * 2, site.y * 2, site.z * 2); // Point straight outward from Moon surface
        globe.add(siteGroup);

        siteMeshes.push({ group: siteGroup, data: site });
      });
    }

    // 8. Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Planetary axis spin
      globe.rotation.y += 0.001;
      if (cloudsMesh) {
        cloudsMesh.rotation.y += 0.0015;
      }

      // Update active satellite orbital positions
      let activeSatMesh: THREE.Group | null = null;
      satelliteMeshes.forEach(({ group, data, orbitLine }) => {
        data.angle += data.speed;
        const x = Math.cos(data.angle) * data.radius;
        const z = Math.sin(data.angle) * data.radius;
        const pos = new THREE.Vector3(x, 0, z);
        pos.applyEuler(orbitLine.rotation);
        group.position.copy(pos);
        group.lookAt(0, 0, 0);

        if (targetFocusRef.current.type === "sat" && targetFocusRef.current.id === data.id) {
          activeSatMesh = group;
        }
      });

      // Reticle targeting
      if (activeSatMesh) {
        const satPos = (activeSatMesh as THREE.Group).position;
        reticleGroup.position.copy(satPos);
        reticleGroup.lookAt(camera.position);
        reticleGroup.visible = true;
      } else if (mode === "moon" && targetFocusRef.current.type === "site") {
        const activeSite = siteMeshes.find((s) => s.data.id === targetFocusRef.current.id);
        if (activeSite) {
          const worldPos = new THREE.Vector3();
          activeSite.group.getWorldPosition(worldPos);
          reticleGroup.position.copy(worldPos);
          reticleGroup.lookAt(camera.position);
          reticleGroup.visible = true;
        }
      } else {
        reticleGroup.visible = false;
      }

      controls.autoRotate = isRotatingRef.current;
      controls.autoRotateSpeed = 0.6;
      controls.update();

      renderer.render(scene, camera);
    };

    animate();

    // 9. ResizeObserver
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

  const handleSelectSatellite = (sat: SatelliteData) => {
    setSelectedSatellite(sat);
    setSelectedSite(null);
    targetFocusRef.current = { id: sat.id, type: "sat" };
  };

  const handleSelectLunarSite = (site: LunarSiteData) => {
    setSelectedSite(site);
    setSelectedSatellite(null);
    targetFocusRef.current = { id: site.id, type: "site" };
  };

  const handleResetOverview = () => {
    targetFocusRef.current = { id: "overview", type: "overview" };
  };

  const handleAskAboutSatellite = () => {
    if (selectedSatellite && onQueryMission) {
      onQueryMission(`Tell me all real-time telemetry, mission payload, and orbital details of ${selectedSatellite.name} (NORAD #${selectedSatellite.norad})`);
      onClose();
    } else if (selectedSite && onQueryMission) {
      onQueryMission(`Explain the authentic ground data and scientific discoveries made at ${selectedSite.name}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 w-screen h-screen bg-[#070e1d] overflow-hidden flex flex-col animate-fadeIn select-none"
      onClick={(e) => e.stopPropagation()}
    >
      {/* 3D WebGL Canvas */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0" />

      {/* Floating Top Control HUD */}
      <header className="relative z-10 p-4 sm:p-6 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 bg-slate-900/85 backdrop-blur-2xl px-4 py-2.5 rounded-2xl border border-slate-800 shadow-2xl pointer-events-auto">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/20">
            <Satellite className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight font-display">
                {mode === "earth" ? "NASA Blue Marble • ISRO Fleet" : "NASA LROC Moon • Lunar Orbiters & Vikram Lander"}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Full 360° Orbit
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400">
              {mode === "earth" ? "Tracking 5 Earth satellites in real-time orbit" : "Tracking Chandrayaan-2 & 3 Lunar Orbiters + Vikram Lander on surface"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Mode Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900/90 backdrop-blur-2xl border border-slate-800 shadow-2xl">
            <button
              onClick={() => { setMode("earth"); setSelectedSite(null); handleSelectSatellite(EARTH_SATELLITES[0]); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                mode === "earth" ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20" : "text-slate-400 hover:text-white"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Earth (NASA)</span>
            </button>
            <button
              onClick={() => { setMode("moon"); setSelectedSatellite(null); handleSelectSatellite(LUNAR_ORBITERS[0]); }}
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
            title={isRotating ? "Pause 360° Orbit" : "Resume 360° Orbit"}
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

      {/* Sleek Aerospace Telemetry HUD (Bottom-Left Dock) */}
      <div className="absolute bottom-24 left-4 sm:left-6 z-20 pointer-events-auto max-w-sm w-full transition-all duration-300">
        {!hudExpanded ? (
          <button
            onClick={() => setHudExpanded(true)}
            className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-950/70 backdrop-blur-2xl border border-cyan-500/30 hover:border-cyan-400 text-xs font-mono text-cyan-300 hover:text-white shadow-2xl transition-all group"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>
              {selectedSatellite ? selectedSatellite.name : selectedSite?.name.split("(")[0]} Telemetry
            </span>
            <ChevronUp className="w-3.5 h-3.5 text-slate-400 group-hover:translate-y-[-1px] transition-transform" />
          </button>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-950/60 backdrop-blur-3xl border-l-2 border-l-cyan-400 border border-white/10 shadow-2xl shadow-cyan-950/40 text-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-semibold flex items-center gap-1">
                  ISRO Deep Space Telemetry
                </span>
              </div>
              <button
                onClick={() => setHudExpanded(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
                title="Minimize Telemetry HUD"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {selectedSatellite && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <Satellite className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-tight">{selectedSatellite.name}</h4>
                      <p className="text-[10px] font-mono text-slate-400">
                        {mode === "earth" ? "Earth Observation Satellite" : "Active Lunar Polar Orbiter"}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/40">
                    NORAD #{selectedSatellite.norad}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 block mb-0.5">Orbit</span>
                    <span className="text-white font-bold text-[11px] truncate block">{selectedSatellite.orbit.split("(")[0]}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 block mb-0.5">Altitude</span>
                    <span className="text-cyan-300 font-bold text-[11px]">{selectedSatellite.altitude}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 block mb-0.5">Orbital Velocity</span>
                    <span className="text-emerald-400 font-bold text-[11px]">{selectedSatellite.velocity}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 block mb-0.5">Status</span>
                    <span className="text-emerald-300 font-bold text-[11px] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> NOMINAL
                    </span>
                  </div>
                </div>

                {onQueryMission && (
                  <button
                    onClick={handleAskAboutSatellite}
                    className="w-full py-2 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-300 border border-cyan-500/40 flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-950/40"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Query Mission in AI Chat</span>
                  </button>
                )}
              </div>
            )}

            {selectedSite && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight">{selectedSite.name}</h4>
                    <p className="text-[10px] font-mono text-emerald-400">Lunar Surface Ground-Truth</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">
                    {selectedSite.status}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs font-mono space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Coordinates:</span>
                    <span className="text-cyan-300 font-bold">{selectedSite.lat}, {selectedSite.lon}</span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-relaxed pt-1 border-t border-white/5">
                    {selectedSite.discovery}
                  </p>
                </div>

                {onQueryMission && (
                  <button
                    onClick={handleAskAboutSatellite}
                    className="w-full py-2 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 text-emerald-300 border border-emerald-500/40 flex items-center justify-center gap-2 transition-all shadow-lg"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Analyze Landing Telemetry</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Bottom Selector Pills (Orbiters + Landing Sites) */}
      <div className="absolute bottom-6 left-4 right-4 flex items-center justify-center gap-2.5 overflow-x-auto custom-scrollbar z-10 pointer-events-auto">
        {mode === "earth" ? (
          EARTH_SATELLITES.map((sat) => (
            <button
              key={sat.id}
              onClick={() => handleSelectSatellite(sat)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-mono transition-all shrink-0 border backdrop-blur-2xl shadow-xl flex items-center gap-2 ${
                selectedSatellite?.id === sat.id
                  ? "bg-cyan-500 text-slate-950 font-bold border-cyan-300 shadow-cyan-500/30 scale-105"
                  : "bg-slate-900/85 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
              }`}
            >
              <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: `#${sat.color.toString(16).padStart(6, "0")}` }} />
              <span>{sat.name}</span>
            </button>
          ))
        ) : (
          <>
            {/* Lunar Orbiters */}
            {LUNAR_ORBITERS.map((sat) => (
              <button
                key={sat.id}
                onClick={() => handleSelectSatellite(sat)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-mono transition-all shrink-0 border backdrop-blur-2xl shadow-xl flex items-center gap-2 ${
                  selectedSatellite?.id === sat.id
                    ? "bg-cyan-500 text-slate-950 font-bold border-cyan-300 shadow-cyan-500/30 scale-105"
                    : "bg-slate-900/85 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
                }`}
              >
                <Satellite className="w-3.5 h-3.5 text-cyan-400" />
                <span>{sat.name.split("(")[0]}</span>
              </button>
            ))}

            {/* Lunar Surface Sites */}
            {LUNAR_SITES.map((site) => (
              <button
                key={site.id}
                onClick={() => handleSelectLunarSite(site)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-mono transition-all shrink-0 border backdrop-blur-2xl shadow-xl flex items-center gap-2 ${
                  selectedSite?.id === site.id
                    ? "bg-emerald-500 text-slate-950 font-bold border-emerald-300 shadow-emerald-500/30 scale-105"
                    : "bg-slate-900/85 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: `#${site.color.toString(16).padStart(6, "0")}` }} />
                <span>{site.name.split("(")[0]}</span>
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
