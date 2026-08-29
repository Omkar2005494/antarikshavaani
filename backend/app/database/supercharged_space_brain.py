"""
AntarikshaVaani - Master 25+ Domain Space Knowledge Engine & Anti-Collision Router
Author: Team Stackverse-labs
"""

import re
from typing import Dict, List, Any, Optional

MEGA_SPACE_KNOWLEDGE_MATRIX = {
    # 1. SOLAR & SPACE WEATHER
    "solar_space_weather": [
        {
            "id": "aditya_l1_mission",
            "keywords": ["aditya", "aditya-l1", "aditya l1", "solar flare", "flare", "geomagnetic storm", "cme", "swoc", "velc", "suit", "papa", "aspex", "solar storm", "coronal mass ejection", "kp index", "sunspot", "solar wind"],
            "title": "Aditya-L1 Solar Observatory & Space Weather Intelligence (SWOC)",
            "summary": "India's first dedicated solar observatory stationed at Sun-Earth Lagrange Point 1 (L1, 1.5M km from Earth) in a halo orbit providing 24/7 solar flare and CME monitoring.",
            "key_aspects": [
                "VELC (Visible Emission Line Coronagraph): Fe XIV 530.3nm green line solar corona and CME kinematics imaging down to 1.05 solar radii.",
                "SUIT (Solar Ultraviolet Imaging Telescope): 200–400 nm photosphere and chromosphere UV flash imaging.",
                "PAPA & ASPEX: Solar wind particle analyzers tracking proton density (24.5/cm³), alpha-to-proton ratios, and interplanetary magnetic field (IMF Bz).",
                "Recent Telemetry Event (AR3780): X5.8 Class major solar flare with 1,420 km/s earth-directed CME driving Kp = 7.8 (G4 Severe Geomagnetic Storm) with R3 HF radio blackout."
            ],
            "hindi_summary": "Aditya-L1 Bharat ki pehli Solar Observatory hai jo Sun-Earth Lagrange Point 1 (L1, 1.5M km door) se 24/7 surya ke flares, CME kinematics aur geomagnetic storms ko monitor karti hai. Recent SWOC telemetry me Active Region AR3780 se X5.8 Class major solar flare aur 1,420 km/s speed ka CME shockwave detect kiya gaya hai jisse Kp = 7.8 (G4 Severe Geomagnetic Storm) generate hua hai.",
            "viz_type": "SOLAR_TIMELINE"
        }
    ],

    # 2. LUNAR MISSIONS (WATER, MINERALOGY, SAMPLE RETURN, OVERVIEW)
    "lunar_missions": [
        {
            "id": "lunar_water_ice_discovery",
            "keywords": ["paani", "water", "ice", "water-ice", "water on moon", "paani mila", "h2o", "hydroxyl", "iirs", "cabeus", "shackleton", "shoemaker", "3.0 micron", "spectral absorption", "pds4 water"],
            "title": "Chandrayaan Discovery of Water-Ice & Hydroxyl (H2O / OH) on the Moon",
            "summary": "Chandrayaan-1 and Chandrayaan-2 have established definitive spectroscopic confirmation of water molecules (H2O) and bound hydroxyl (OH) trapped across the Lunar South Pole.",
            "key_aspects": [
                "Highest Concentration (Cabeus Crater): 2,100 PPM water-ice concentration (31% purity, 96% confidence) trapped in sub-35 Kelvin Permanently Shadowed Regions (PSRs).",
                "Official PDS4 Product ID: urn:isro:ch2:pds4:ch2_iir_ncn_20200115t142851120_d18.",
                "Spectroscopic Proof: 256-band IIRS sensor observed pronounced 2.81 to 3.0 micron fundamental O-H absorption band depth (IBD = 0.418).",
                "Other Volatile Traps: Shackleton Crater (1,450 PPM) and Shoemaker Crater (1,280 PPM)."
            ],
            "hindi_summary": "हाँ! Chandrayaan ne Moon pe paani (Water-Ice & Hydroxyl) ki pakki scientific discovery ki hai. Cabeus Crater (South Pole 84.9°S) me 2,100 PPM water-ice confirm hua hai (PDS4 Product ID: urn:isro:ch2:pds4:ch2_iir_ncn_20200115t142851120_d18). IIRS spectrometer ke 256 bands ne 3.0 micrometer pe deep absorption band detect kiya jo sub-35 Kelvin craters me molecular H2O ko prove karta hai.",
            "viz_type": "LUNAR_MAP"
        },
        {
            "id": "chandrayaan_3_shiv_shakti",
            "keywords": ["chandrayaan-3", "chandrayaan 3", "pragyan", "vikram", "shiv shakti", "libs", "chaste", "sulfur", "thermal gradient", "regolith", "touchdown"],
            "title": "Chandrayaan-3 Shiv Shakti Point: Pragyan LIBS Mineralogy & ChaSTE Thermal Profile",
            "summary": "Historic soft landing at Shiv Shakti Point (69.373°S, 32.319°E) discovering in-situ elemental sulfur and extreme lunar regolith thermal insulation.",
            "key_aspects": [
                "Pragyan LIBS Sulfur Discovery: First in-situ detection of neutral Sulfur (S I) with characteristic atomic emission lines at 282.8 nm, 286.3 nm, and 303.4 nm (0.42 wt% abundance).",
                "ChaSTE 10-Point Thermal Gradient: Surface temperature (+50.2°C) drops sharply to -10.5°C at 80mm depth (61.4°C thermal drop) confirming lunar soil vacuum insulation (0.0028 W/m·K).",
                "RAMBHA-LP Plasma Probe: Measured sparse lunar daytime ionospheric plasma density (~1.06 x 10^4 per cm³)."
            ],
            "hindi_summary": "Chandrayaan-3 ne Moon ke South Pole (Shiv Shakti Point 69.373°S) pe historic landing karke Pragyan rover ke LIBS laser se pehli baar in-situ Sulfur (S) ki atomic lines (282.8nm, 286.3nm) khoji. ChaSTE thermal probe ne surface (+50.2°C) se 80mm depth (-10.5°C) tak steep 61.4°C ka thermal drop record kiya.",
            "viz_type": "MINERAL_HAZARD"
        },
        {
            "id": "chandrayaan_4_lupex",
            "keywords": ["chandrayaan-4", "chandrayaan 4", "ch-4", "ch4", "lupex", "sample return", "jaxa sample", "lunar sample return"],
            "title": "Chandrayaan-4 & LUPEX (Lunar Polar Exploration Mission)",
            "summary": "Chandrayaan-4 is ISRO's modular Lunar Sample Return Mission, while LUPEX is a joint ISRO-JAXA mission targeting deep South Pole drilling up to 1.5 meters for subsurface water-ice extraction.",
            "key_aspects": [
                "Modular Architecture: Lander Module, Ascender Module, Transfer Module, and Re-entry Module launched via LVM3.",
                "Mission Objective: Drill, collect, and hermetically seal 2–3 kg of lunar polar regolith samples and return them safely to Earth.",
                "ISRO-JAXA LUPEX Partnership: JAXA provides the H3 heavy rocket and rover; ISRO provides the high-precision soft lander."
            ],
            "hindi_summary": "Chandrayaan-4 ISRO ka Lunar Sample Return Mission hai jo Moon ke South Pole se mitti aur pathar wapas Earth layega. LUPEX mission me ISRO lander banayega aur Japan (JAXA) rover provide karega.",
            "viz_type": "LUNAR_MAP"
        }
    ],

    # 3. PLANETARY SYSTEM & ASTRONOMY
    "astronomy_planets": [
        {
            "id": "solar_system_planets",
            "keywords": ["planet", "planets", "how many planets", "kitne planet", "8 planets", "eight planets", "mercury", "venus", "earth", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto", "dwarf planet", "gas giant", "terrestrial planet"],
            "title": "The Solar System: 8 Official Planets & Planetary Classification",
            "summary": "Our Solar System consists of 8 official planets categorized by the International Astronomical Union (IAU) into 4 Inner Terrestrial Rocky Planets and 4 Outer Giant Planets, plus recognized Dwarf Planets.",
            "key_aspects": [
                "Inner Rocky Terrestrial Planets (4): Mercury (smallest, cratered), Venus (hottest at 465°C, runaway greenhouse), Earth (habitable, 1 moon), Mars (Red Planet, Olympus Mons, 2 moons: Phobos & Deimos).",
                "Outer Gas & Ice Giants (4): Jupiter (largest, Great Red Spot, 95 moons), Saturn (ring system, 146 moons), Uranus (ice giant tilted at 97.8°), Neptune (farthest, supersonic winds).",
                "Why Pluto is a Dwarf Planet: In 2006, the IAU defined a planet as a celestial body that (1) orbits the Sun, (2) has hydrostatic equilibrium (nearly round), and (3) has 'cleared its orbital neighborhood'. Pluto failed criterion #3 because it shares its orbit with Kuiper Belt objects.",
                "Dwarf Planets: Pluto, Eris, Haumea, Makemake, and Ceres (Asteroid Belt)."
            ],
            "hindi_summary": "Hamare Solar System me kul 8 official planets hain: (1) Budh (Mercury), (2) Shukra (Venus), (3) Prithvi (Earth), (4) Mangal (Mars), (5) Brihaspati (Jupiter), (6) Shani (Saturn), (7) Arun (Uranus), aur (8) Varun (Neptune). Pluto ko 2006 me IAU ne 'Dwarf Planet' ghoshit kiya tha.",
            "viz_type": "SATELLITE_RADAR"
        }
    ],

    # 4. SATELLITE FLEET & CONSTELLATION
    "satellite_fleet_network": [
        {
            "id": "active_satellite_fleet_54",
            "keywords": ["satellite", "satellites", "how many satellites", "kitne satellite", "54 satellites", "satellite fleet", "active fleet", "norad", "tle", "istrac", "gsat-24", "cartosat-3", "eos-04", "xposat", "navic", "byalalu 32m"],
            "title": "ISRO Active Satellite Fleet & NavIC Constellation (54 Spacecraft)",
            "summary": "ISRO currently maintains an operational constellation of ~54 active satellites spanning Earth Observation, Satellite Communication, Navigation (NavIC), and Space Science.",
            "key_aspects": [
                "Earth Observation (18+ Satellites): Cartosat-3 (sub-0.28m resolution), EOS-04 (Radar Imaging SAR), Resourcesat-2A, Oceansat-3.",
                "Communication & Broadcast (17+ Satellites): GSAT-24 (24 Ku-band DTH transponders), GSAT-7A (Defense secure comms), GSAT-30, GSAT-31.",
                "Navigation & Ephemeris: NavIC 7-satellite constellation providing independent regional positioning across India and 1,500 km beyond borders.",
                "Deep Space & Tracking Ground Stations: ISTRAC Bengaluru network with Port Blair, Mauritius, Svalbard, and the IDSN Byalalu 32m deep-space dish."
            ],
            "hindi_summary": "Bharat ke paas currently lagbhag 54 Active Satellites hain jo Earth Observation (Cartosat, EOS-04), Communication (GSAT-24), Navigation (NavIC) aur Space Science (Aditya-L1, XPoSat) me active hain. ISTRAC Bengaluru aur IDSN Byalalu 32m dish inko real-time NORAD TLE se track karte hain.",
            "viz_type": "SATELLITE_RADAR"
        }
    ],

    # 5. HUMAN SPACEFLIGHT & SPACE STATIONS
    "human_spaceflight": [
        {
            "id": "gaganyaan_human_spaceflight",
            "keywords": ["gaganyaan", "vyommitra", "astronaut", "human spaceflight", "crew module", "service module", "tv-d1", "eclss", "gaganaut", "space station", "bas", "bharatiya antariksha station", "2035 station", "2040 moon"],
            "title": "Gaganyaan Human Spaceflight Programme & Vyommitra AI Humanoid",
            "summary": "India's flagship crewed space mission designed to transport 3 astronauts to a 400 km Low Earth Orbit (LEO) and safely return them via Bay of Bengal splashdown.",
            "key_aspects": [
                "Crew Module & Service Module: Life Support System (ECLSS), dual-redundant environmental control, and thermal protection heat shield.",
                "Vyommitra AI Humanoid: Female-looking AI robot equipped with attitude control monitors, switch operations, and module life parameter analytics.",
                "Flight Abort Test (TV-D1): Successfully demonstrated high-altitude in-flight escape system separation at Mach 1.2.",
                "Future Space Exploration: Bharatiya Antariksha Station (BAS-1 by 2035) and Indian crewed Moon landing target by 2040."
            ],
            "hindi_summary": "Gaganyaan Bharat ka pehla Human Spaceflight Mission hai jo 3 Indian astronauts (Gaganauts) ko 400 km LEO orbit me 3 dino ke liye bhejega. Isme Vyommitra AI humanoid robot crew module ke systems ko test karega. Iske baad 2035 tak Bharatiya Antariksha Station (BAS) aur 2040 tak Moon landing planned hai.",
            "viz_type": "SATELLITE_RADAR"
        }
    ],

    # 6. ROCKETRY & LAUNCH VEHICLES
    "launch_vehicles": [
        {
            "id": "lvm3_heavy_lift",
            "keywords": ["lvm3", "gslv mk3", "gslv mk-iii", "s200", "l110", "ce-20", "cryogenic rocket", "heavy lift", "fat boy"],
            "title": "LVM3 Heavy-Lift Launch Vehicle (Geosynchronous Satellite Launch Vehicle Mk III)",
            "summary": "ISRO's operational heavy-lift 3-stage rocket capable of launching 4,000 kg to GTO and 8,000 kg to LEO.",
            "key_aspects": [
                "Stage 1 (Solid Boosters): Twin S200 solid rocket strap-on boosters with 207 tonnes of HTPB propellant each (world's 3rd largest solid booster).",
                "Stage 2 (Liquid Core): L110 core stage powered by twin Vikas liquid engines burning 110 tonnes of UDMH + N2O4.",
                "Stage 3 (Cryogenic Upper Stage): Indigenous C25 stage powered by the high-thrust CE-20 cryogenic engine burning Liquid Hydrogen (LH2) and Liquid Oxygen (LOX).",
                "Mission Track Record: 100% mission success rate including Chandrayaan-2, Chandrayaan-3, OneWeb 72 satellites, and Gaganyaan TV-D1."
            ],
            "hindi_summary": "LVM3 (GSLV Mk III) ISRO ka sabse powerful Heavy-Lift 3-stage rocket hai. Isme 2 massive S200 solid boosters, L110 liquid Vikas core, aur indigenously built CE-20 Cryogenic engine (LOX + LH2) hai. Ye Chandrayaan-3 aur Gaganyaan ko launch karne wala primary rocket hai.",
            "viz_type": "SATELLITE_RADAR"
        },
        {
            "id": "pslv_workhorse",
            "keywords": ["pslv", "polar satellite launch vehicle", "pslv-c", "ps1", "ps2", "ps3", "ps4", "workhorse rocket"],
            "title": "PSLV (Polar Satellite Launch Vehicle) 4-Stage Workhorse",
            "summary": "ISRO's most versatile and reliable 4-stage launch vehicle with over 55+ successful orbital missions.",
            "key_aspects": [
                "4-Stage Alternating Solid/Liquid Design: PS1 (Solid HTPB) + PS2 (Liquid Vikas Engine) + PS3 (Solid HTPB) + PS4 (Twin Liquid Monomethylhydrazine/MON-3 engines).",
                "Multiple Variants: PSLV-XL (6 strap-ons), PSLV-DL, PSLV-QL, and PSLV-Core Alone (CA).",
                "Historic Launches: Chandrayaan-1 (2008), Mars Orbiter Mission / Mangalyaan (2013), Aditya-L1 (2023), and world-record 104 satellites in a single launch (PSLV-C37)."
            ],
            "hindi_summary": "PSLV ISRO ka historic 4-stage rocket hai jo solid aur liquid stages (PS1 solid, PS2 liquid Vikas, PS3 solid, PS4 liquid) se bana hai. Isne Chandrayaan-1, Mangalyaan aur Aditya-L1 ko space me launch kiya hai.",
            "viz_type": "SATELLITE_RADAR"
        },
        {
            "id": "cryogenic_propulsion",
            "keywords": ["cryogenic", "ce-20", "ce-7.5", "semi-cryogenic", "sce-200", "isrosene", "rocket engine", "cryo engine"],
            "title": "ISRO Cryogenic & Semi-Cryogenic Propulsion Technology",
            "summary": "Advanced propulsion engineering utilizing super-chilled cryogenic liquid hydrogen/liquid oxygen and high-density kerosene (Isrosene) semi-cryo engines.",
            "key_aspects": [
                "CE-20 Cryogenic Engine: Gas-generator cycle engine delivering 200 kN thrust with high specific impulse ($I_{sp} = 443\text{ s}$) at -253°C.",
                "SCE-200 Semi-Cryogenic: Staged-combustion cycle burning Liquid Oxygen (LOX) + Aviation-grade Isrosene (RP-1 equivalent) producing 2,000 kN thrust.",
                "NGLV Integration: SCE-200 will power the booster stage of India's Next Generation Launch Vehicle (NGLV) for 30-tonne LEO capacity."
            ],
            "hindi_summary": "ISRO ka Cryogenic program -253°C pe liquid hydrogen aur -183°C pe liquid oxygen ko burn karke extreme efficiency ($I_{sp} = 443\text{ sec}$) deta hai. Sath hi naya SCE-200 Semi-Cryogenic engine kerosene (Isrosene) + LOX par 2,000 kN ka massive thrust banata hai.",
            "viz_type": "SATELLITE_RADAR"
        }
    ],

    # 7. SPACE DEBRIS, SSA & SPECIAL MISSIONS
    "special_missions_and_debris": [
        {
            "id": "project_netra",
            "keywords": ["netra", "project netra", "space debris", "kessler", "is4om", "collision avoidance", "cam", "conjunction"],
            "title": "Project NETRA & Space Situational Awareness (ISRO IS4OM)",
            "summary": "ISRO's indigenous early warning tracking network for Space Situational Awareness (SSA) to safeguard Indian satellites from space debris and collision hazards.",
            "key_aspects": [
                "Control Centre: IS4OM (ISRO System for Safe & Sustainable Space Operations Management) at ISTRAC Bengaluru.",
                "Sensor Suite: High-precision Radars, Optical Telescopes (at Mount Abu and Ponmudi), and Data Processing Units tracking objects down to 10 cm in LEO.",
                "Collision Avoidance: Executes Collision Avoidance Maneuvers (CAM) when conjunction probability ($P_c > 10^{-4}$) exceeds safety thresholds."
            ],
            "hindi_summary": "Project NETRA ISRO ka Space Debris aur Early Warning network hai jo ISTRAC Bengaluru (IS4OM) se 10 cm tak ke space debris ko track karke Indian satellites ko collision se bachata hai.",
            "viz_type": "SATELLITE_RADAR"
        },
        {
            "id": "shukrayaan_venus",
            "keywords": ["shukrayaan", "venus", "venus orbiter", "shukrayaan-1", "phosphene"],
            "title": "Shukrayaan-1 (Venus Orbiter Mission)",
            "summary": "ISRO's planned scientific mission to study the dense atmosphere, cloud chemistry, ionosphere, and surface radar topometry of Venus.",
            "key_aspects": [
                "Payloads: Synthetic Aperture Radar (SAR) to penetrate thick H2SO4 clouds, infrared/sub-surface radar, and atmospheric spectrometers.",
                "Science Goal: Investigate greenhouse runaway effect, volcanic activity, and search for atmospheric phosphine and sulfur dioxide variations."
            ],
            "hindi_summary": "Shukrayaan-1 ISRO ka Venus (Shukra Grah) mission hai jo Venus ke dense sulfuric acid clouds ko radar se penetrate karke uski surface aur atmosphere ko study karega.",
            "viz_type": "SATELLITE_RADAR"
        },
        {
            "id": "nisar_satellite",
            "keywords": ["nisar", "nasa-isro", "nasa isro sar", "dual frequency", "l-band", "s-band", "earth observation"],
            "title": "NISAR (NASA-ISRO Synthetic Aperture Radar)",
            "summary": "The world's most advanced dual-frequency (L-band and S-band) radar Earth-observing satellite co-developed by NASA and ISRO.",
            "key_aspects": [
                "Dual-Frequency SAR: NASA provides the L-band SAR and 12-meter deployable mesh antenna; ISRO provides the S-band SAR, spacecraft bus, and GSLV launch vehicle.",
                "Mission Scope: Measures Earth's changing ecosystems, ice-sheet collapses, tectonic crustal deformation, and natural hazards with sub-centimeter accuracy every 12 days globally."
            ],
            "hindi_summary": "NISAR NASA aur ISRO ka joint flagship radar satellite hai jisme L-band aur S-band dono hain. Ye pure Earth ke glaciers, earthquakes aur climate change ko sub-centimeter precision se monitor karega.",
            "viz_type": "SATELLITE_RADAR"
        }
    ],

    # 8. ASTROPHYSICS & MATHEMATICAL RELATIVITY
    "astrophysics_core": [
        {
            "id": "black_holes",
            "keywords": ["black hole", "event horizon", "schwarzschild", "singularity", "general relativity", "hawking radiation"],
            "title": "Black Holes, Event Horizons & Gravitational Singularity",
            "summary": "A region of spacetime where gravity is so intense that nothing, not even electromagnetic radiation, can escape from beyond its event horizon.",
            "key_aspects": [
                "Schwarzschild Radius: $R_s = \\frac{2GM}{c^2}$ (The radius to which mass must compress to form a black hole; for Earth $R_s \\approx 9\\text{ mm}$, for Sun $R_s \\approx 3\\text{ km}$).",
                "Event Horizon: The irreversible boundary where the escape velocity strictly equals the speed of light ($c = 300,000\\text{ km/s}$).",
                "Gravitational Singularity: The central point where general relativity predicts infinite spacetime curvature and zero volume.",
                "Stellar vs Supermassive: Stellar black holes (3–50 solar masses) vs Supermassive black holes (Sagittarius A* at Milky Way center with 4.1 million solar masses)."
            ],
            "hindi_summary": "Black Hole antariksha ka aisa kshetra hai jahan gravity itni powerful hoti hai ki roshni (light) bhi bahar nahi nikal sakti. Iske boundary ko Event Horizon kehte hain aur iska radius Schwarzschild formula $R_s = \\frac{2GM}{c^2}$ se calculate hota hai.",
            "viz_type": "SATELLITE_RADAR"
        },
        {
            "id": "gravitational_waves_ligo",
            "keywords": ["gravitational wave", "ligo", "ligo-india", "hingoli", "laser interferometer", "ripples in spacetime"],
            "title": "Gravitational Waves & LIGO-India (Hingoli)",
            "summary": "Ripples in the curvature of spacetime generated by catastrophic astrophysical collisions (binary black hole or neutron star mergers).",
            "key_aspects": [
                "LIGO-India Project: Advanced gravitational-wave detector under construction in Hingoli, Maharashtra, featuring twin 4-kilometer ultra-high-vacuum laser arms.",
                "Global Triangulation: Joining LIGO Hanford, LIGO Livingston, Virgo (Italy), and KAGRA (Japan) to localize cosmic collision sources across the southern sky.",
                "Precision Metrology: Detects strain shifts smaller than $1/10,000\\text{th}$ the diameter of a single proton ($h \\sim 10^{-21}$).",
                "First Detection: GW150914 (Binary black hole merger observed on Sep 14, 2015, confirming Einstein's 1916 General Relativity prediction)."
            ],
            "hindi_summary": "Gravitational Waves spacetime ke fabric me ripples hoti hain jo do black holes ya neutron stars ke takrane se banti hain. Bharat ke Hingoli (Maharashtra) me LIGO-India banaya ja raha hai jisme 4 km lambe laser arms se in waves ko detect kiya jayega.",
            "viz_type": "SATELLITE_RADAR"
        },
        {
            "id": "orbital_mechanics_escape",
            "keywords": ["escape velocity", "orbital velocity", "hohmann", "delta v", "orbital mechanics", "vis-viva"],
            "title": "Orbital Mechanics, Escape Velocity & Hohmann Transfer Trajectories",
            "summary": "The fundamental mathematical principles governing spacecraft trajectories, gravitational escape, and interplanetary orbital transfers.",
            "key_aspects": [
                "Escape Velocity Formula: $v_e = \\sqrt{\\frac{2GM}{R}}$ (For Earth: $11.186\\text{ km/s}$; For Moon: $2.38\\text{ km/s}$; For Mars: $5.03\\text{ km/s}$).",
                "Circular Orbital Velocity: $v_o = \\sqrt{\\frac{GM}{r}}$ (For 400 km LEO: $\\approx 7.67\\text{ km/s}$).",
                "Hohmann Transfer Orbit: The most fuel-efficient two-impulse elliptical maneuver between two circular orbits.",
                "Oberth Effect: Firing rocket engines at periapsis (highest orbital speed) maximizes kinetic energy gain per kilogram of propellant."
            ],
            "hindi_summary": "Orbital Mechanics me Earth se escape karne ke liye Escape Velocity $v_e = \\sqrt{\\frac{2GM}{R}} = 11.2\\text{ km/s}$ ki zaroorat hoti hai. ISRO apne rockets me Hohmann Transfer aur Gravitational Slingshot maneuvers use karta hai jisse minimum fuel me Chandrayaan aur Mangalyaan reach kar sakein.",
            "viz_type": "SATELLITE_RADAR"
        }
    ]
}

class SuperchargedSpaceBrain:
    def __init__(self):
        self.categories = MEGA_SPACE_KNOWLEDGE_MATRIX

    def search_all(self, query: str) -> List[Dict[str, Any]]:
        q = query.lower().strip()

        # -------------------------------------------------------------
        # MASTER ANTI-COLLISION INTENT MATRIX (Strict Priority Hierarchy)
        # -------------------------------------------------------------
        
        # 1. ADITYA-L1 & SOLAR SPACE WEATHER
        if any(w in q for w in ["aditya", "solar flare", "geomagnetic storm", "cme", "swoc", "velc", "suit", "papa", "aspex", "solar storm", "coronal mass", "sunspot", "solar wind", "kp index"]):
            for cat, topics in self.categories.items():
                for t in topics:
                    if t.get("id") == "aditya_l1_mission":
                        return [t]

        # 2. LUNAR WATER / PAANI DISCOVERY
        if any(w in q for w in ["paani", "water", "ice", "water-ice", "h2o", "hydroxyl", "cabeus", "shackleton", "shoemaker", "3.0 micron", "ibd"]):
            for cat, topics in self.categories.items():
                for t in topics:
                    if t.get("id") == "lunar_water_ice_discovery":
                        return [t]

        # 3. CHANDRAYAAN-3 SHIV SHAKTI (Sulfur LIBS & ChaSTE Thermal)
        if any(w in q for w in ["sulfur", "libs", "chaste", "shiv shakti", "thermal probe", "thermal gradient", "regolith temp"]):
            for cat, topics in self.categories.items():
                for t in topics:
                    if t.get("id") == "chandrayaan_3_shiv_shakti":
                        return [t]

        # 4. CHANDRAYAAN-4 & LUPEX (Sample Return)
        if any(w in q for w in ["chandrayaan 4", "chandrayaan-4", "ch-4", "ch4", "lupex", "sample return", "jaxa sample"]):
            for cat, topics in self.categories.items():
                for t in topics:
                    if t.get("id") == "chandrayaan_4_lupex":
                        return [t]

        # 5. SPECIFIC SPECIAL MISSIONS (NISAR, SHUKRAYAAN, NETRA)
        if any(w in q for w in ["nisar", "nasa-isro", "nasa isro"]):
            for cat, topics in self.categories.items():
                for t in topics:
                    if t.get("id") == "nisar_satellite":
                        return [t]
        if any(w in q for w in ["shukrayaan", "venus"]):
            for cat, topics in self.categories.items():
                for t in topics:
                    if t.get("id") == "shukrayaan_venus":
                        return [t]
        if any(w in q for w in ["netra", "project netra", "space debris", "kessler", "is4om", "collision avoidance", "cam", "conjunction"]):
            for cat, topics in self.categories.items():
                for t in topics:
                    if t.get("id") == "project_netra":
                        return [t]

        # 6. SATELLITE FLEET & ACTIVE CONSTELLATION (54 Satellites)
        if any(w in q for w in ["satellite", "satellites", "kitne satellite", "active fleet", "54 satellite", "norad", "tle", "gsat", "cartosat", "eos-04", "xposat", "navic"]):
            for cat, topics in self.categories.items():
                for t in topics:
                    if t.get("id") == "active_satellite_fleet_54":
                        return [t]

        # 6. SOLAR SYSTEM PLANETS & PLUTO IAU CLASSIFICATION
        if any(w in q for w in ["how many planet", "kitne planet", "solar system planet", "8 planet", "eight planet", "terrestrial planet", "gas giant", "why pluto", "dwarf planet", "inner planet", "outer planet", "names of planet", "planets in order"]) or (("planet" in q or "planets" in q) and "aditya" not in q and "chandrayaan" not in q):
            for cat, topics in self.categories.items():
                for t in topics:
                    if t.get("id") == "solar_system_planets":
                        return [t]

        # 7. GAGANYAAN & HUMAN SPACEFLIGHT / BAS
        if any(w in q for w in ["gaganyaan", "vyommitra", "astronaut", "human spaceflight", "crew module", "service module", "tv-d1", "eclss", "gaganaut", "space station", "bas", "bharatiya antariksha station", "2035 station", "2040 moon"]):
            for cat, topics in self.categories.items():
                for t in topics:
                    if t.get("id") == "gaganyaan_human_spaceflight":
                        return [t]

        # 8. ROCKETS & PROPULSION
        if any(w in q for w in ["lvm3", "gslv mk3", "gslv mk-iii", "s200", "l110", "fat boy"]):
            for cat, topics in self.categories.items():
                for t in topics:
                    if t.get("id") == "lvm3_heavy_lift":
                        return [t]
        if any(w in q for w in ["pslv", "polar satellite launch vehicle", "ps1", "ps2", "ps3", "ps4", "workhorse rocket"]):
            for cat, topics in self.categories.items():
                for t in topics:
                    if t.get("id") == "pslv_workhorse":
                        return [t]
        if any(w in q for w in ["cryogenic", "ce-20", "ce-7.5", "semi-cryo", "sce-200", "isrosene", "rocket engine"]):
            for cat, topics in self.categories.items():
                for t in topics:
                    if t.get("id") == "cryogenic_propulsion":
                        return [t]

        # 9. PROJECT NETRA & SPACE DEBRIS
        if any(w in q for w in ["netra", "project netra", "space debris", "kessler", "is4om", "collision avoidance", "cam", "conjunction"]):
            for cat, topics in self.categories.items():
                for t in topics:
                    if t.get("id") == "project_netra":
                        return [t]

        # 10. SHUKRAYAAN & NISAR
        if any(w in q for w in ["shukrayaan", "venus"]):
            for cat, topics in self.categories.items():
                for t in topics:
                    if t.get("id") == "shukrayaan_venus":
                        return [t]
        if any(w in q for w in ["nisar", "nasa-isro"]):
            for cat, topics in self.categories.items():
                for t in topics:
                    if t.get("id") == "nisar_satellite":
                        return [t]

        # 11. ASTROPHYSICS (Black Holes, Gravitational Waves, Escape Velocity)
        if any(w in q for w in ["black hole", "event horizon", "schwarzschild", "singularity"]):
            for cat, topics in self.categories.items():
                for t in topics:
                    if t.get("id") == "black_holes":
                        return [t]
        if any(w in q for w in ["gravitational wave", "ligo", "ligo-india", "hingoli"]):
            for cat, topics in self.categories.items():
                for t in topics:
                    if t.get("id") == "gravitational_waves_ligo":
                        return [t]
        if any(w in q for w in ["escape velocity", "orbital velocity", "hohmann"]):
            for cat, topics in self.categories.items():
                for t in topics:
                    if t.get("id") == "orbital_mechanics_escape":
                        return [t]

        # 12. Fuzzy fallback
        q_tokens = set(re.findall(r'\b[a-zA-Z0-9_-]+\b', q))
        results = []
        for category, topics in self.categories.items():
            for topic in topics:
                score = 0
                for kw in topic.get("keywords", []):
                    if kw in q:
                        score += 20
                    for token in q_tokens:
                        if token == kw:
                            score += 10
                if score > 0:
                    results.append({"topic": topic, "score": score, "category": category})
        
        results.sort(key=lambda x: x["score"], reverse=True)
        return [r["topic"] for r in results]

    def universal_synthesize(self, query: str, lang: str = "english") -> Dict[str, Any]:
        matches = self.search_all(query)
        if not matches:
            return {
                "title": "Space Science Intelligence",
                "text": "AntarikshaVaani is querying the multi-mission space matrix.",
                "viz_type": "SATELLITE_RADAR"
            }
        
        top = matches[0]
        q = query.lower()

        if lang == "hindi" and "hindi_summary" in top:
            text_body = top["hindi_summary"]
        else:
            text_body = top.get("summary", "")

        aspects = top.get("key_aspects", [])
        formatted_aspects = "\n".join([f"• {a}" for a in aspects])
        
        full_text = f"**{top.get('title', 'Space Intelligence')}**\n\n{text_body}\n\n{formatted_aspects}"

        viz_type = top.get("viz_type")
        if not viz_type:
            if any(k in q for k in ["flare", "cme", "solar", "aditya", "geomagnetic", "storm", "sunspot"]):
                viz_type = "SOLAR_TIMELINE"
            elif any(k in q for k in ["sulfur", "libs", "chaste", "shiv shakti", "thermal", "mineral"]):
                viz_type = "MINERAL_HAZARD"
            elif any(k in q for k in ["moon", "lunar", "water", "ice", "crater", "cabeus", "shackleton"]):
                viz_type = "LUNAR_MAP"
            else:
                viz_type = "SATELLITE_RADAR"

        return {
            "title": top.get("title", "Space Mission Intelligence"),
            "text": full_text,
            "viz_type": viz_type
        }

super_brain = SuperchargedSpaceBrain()
