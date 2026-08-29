"""
Dynamic Comprehensive Space Science & ISRO Knowledge Engine
Covers Astronomy, Astrophysics, Rocketry, Orbital Mechanics, ISRO Missions, and Planetary Science.
"""

from typing import Dict, List, Any, Optional
import math
import re

# Comprehensive Knowledge Matrix covering Basic to Advanced Space Topics
SPACE_KNOWLEDGE_MATRIX = {
    "rocketry": [
        {
            "id": "lvm3_rocket",
            "keywords": ["lvm3", "gslv mk3", "gslv mk iii", "cryogenic", "ce-20", "s200", "l110", "heavy lift", "launch vehicle"],
            "title": "LVM3 (Launch Vehicle Mark-3) / Heavy Lift Rocket",
            "summary": "LVM3 is ISRO's most powerful 3-stage heavy-lift rocket with a payload capability of 4,000 kg to GTO and 8,000 kg to LEO.",
            "stages": [
                "Stage 1 (Solid): 2 x S200 solid rocket boosters (each carrying 207 tonnes of HTPB propellant, world's 3rd largest solid booster).",
                "Stage 2 (Liquid Core): L110 stage powered by twin Vikas liquid engines burning UDMH and N2O4.",
                "Stage 3 (Cryogenic): C25 upper stage powered by the indigenously developed CE-20 cryogenic engine burning liquid oxygen (LOX) and liquid hydrogen (LH2) at 200 kN thrust."
            ],
            "missions": ["Chandrayaan-2", "Chandrayaan-3", "Gaganyaan Test Flights", "OneWeb 72-satellite constellation launches."],
            "hindi_summary": "LVM3 ISRO ka sabse powerful 3-stage heavy-lift rocket hai. Isme do S200 solid boosters, ek L110 Vikas liquid core, aur ek indigenous CE-20 Cryogenic Upper Stage (LOX/LH2) shamil hai jo 4,000 kg GTO me bhej sakta hai."
        },
        {
            "id": "pslv_rocket",
            "keywords": ["pslv", "polar satellite launch vehicle", "workhorse", "4 stage", "ps4", "s139", "xl"],
            "title": "PSLV (Polar Satellite Launch Vehicle) - ISRO Workhorse",
            "summary": "PSLV is ISRO's versatile 4-stage workhorse launch vehicle with solid and liquid propulsion operating alternatively.",
            "stages": [
                "Stage 1 (PS1): S139 solid propellant motor with up to 6 strap-on boosters (PSLV-XL).",
                "Stage 2 (PS2): Liquid Vikas engine burning hypergolic propellant.",
                "Stage 3 (PS3): High-thrust HTPB solid rocket motor.",
                "Stage 4 (PS4): Twin liquid storable engines (MMH + MON-3) with multi-restart capability for precise orbital injection and POEM orbital experiments."
            ],
            "missions": ["Chandrayaan-1", "Mars Orbiter Mission (Mangalyaan)", "Aditya-L1", "AstroSat", "XPoSat", "Record 104 satellites in a single launch (PSLV-C37)."],
            "hindi_summary": "PSLV ISRO ka 'Workhorse' launch vehicle hai jisme 4 stages (Solid-Liquid-Solid-Liquid) hoti hain. Isne Chandrayaan-1, Mangalyaan, Aditya-L1 aur ek sath 104 satellites launch karne ka record banaya hai."
        },
        {
            "id": "sslv_rocket",
            "keywords": ["sslv", "small satellite launch vehicle", "mini rocket", "commercial launch", "on-demand"],
            "title": "SSLV (Small Satellite Launch Vehicle)",
            "summary": "SSLV is ISRO's 3-stage all-solid low-cost launch vehicle designed for rapid turnaround (72 hours integration) carrying up to 500 kg into 500 km planar LEO.",
            "stages": ["Three solid propulsion stages (SS1, SS2, SS3) followed by a liquid-fuel Velocity Trimming Module (VTM) for precise satellite separation."],
            "missions": ["Commercial small-satellite launches, rapid tactical space deployment."],
            "hindi_summary": "SSLV ISRO ka naya 3-stage solid propellant rocket hai jo chote satellites (500 kg) ko low-earth orbit me kam cost aur sirf 72 ghante me launch karne ke liye design kiya gaya hai."
        }
    ],

    "gaganyaan_human": [
        {
            "id": "gaganyaan_mission",
            "keywords": ["gaganyaan", "human spaceflight", "astronaut", "vyommitra", "crew module", "service module", "tv-d1", "humanoid", "isro human"],
            "title": "Gaganyaan Human Spaceflight Programme",
            "summary": "Gaganyaan is India's flagship crewed orbital spaceflight programme designed to demonstrate indigenous capability to launch a 3-member crew into a 400 km low Earth orbit for 3 days and return safely to Earth with an Indian sea touchdown.",
            "key_subsystems": [
                "Orbital Module: Consists of the pressurized Crew Module (CM) with life-support systems (ECLSS) and unpressurized Service Module (SM).",
                "Crew Escape System (CES): Quick-acting high-altitude escape motors successfully validated during the TV-D1 abort test mission.",
                "Vyommitra: ISRO's AI-enabled female humanoid robot equipped to monitor module parameters, operate switch panels, and simulate human physiology during uncrewed test flights.",
                "Astronaut Training: 4 Indian Air Force test pilots trained at Yuri Gagarin Cosmonaut Centre and Bengaluru Astronaut Training Facility."
            ],
            "hindi_summary": "Gaganyaan Bharat ka pehla human spaceflight mission hai jo 3 Indian astronauts ko 400 km LEO me 3 din ke liye bhej kar surakshit wapas layega. Isme AI humanoid robot 'Vyommitra' uncrewed test flights me systems monitor karegi."
        },
        {
            "id": "bharatiya_antariksha_station",
            "keywords": ["bharatiya antariksha station", "bas", "space station", "indian space station", "2035", "lunar landing 2040"],
            "title": "Bharatiya Antariksha Station (BAS) & 2040 Lunar Vision",
            "summary": "ISRO's roadmap for a permanent indigenous modular space station (BAS-1 target by 2035) in LEO, leading to an Indian crewed Lunar landing by 2040.",
            "modules": [
                "Base Module (BAS-1): 52-tonne modular space habitat for microgravity research, space medicine, and deep-space staging.",
                "Next-Generation Launch Vehicle (NGLV / Surya): Heavy methalox reusable rocket designed to lift 30 tonnes to LEO."
            ],
            "hindi_summary": "Bharatiya Antariksha Station (BAS) 2035 tak LEO me sthapit hone wala Bharat ka apna space station hoga, aur 2040 tak Indian astronaut ko Moon pe land karane ka roadmap tay kiya gaya hai."
        }
    ],

    "planetary_missions": [
        {
            "id": "chandrayaan_all",
            "keywords": ["chandrayaan", "moon", "lunar", "vikram", "pragyan", "water ice", "sulfur", "chaste", "shiv shakti", "cabeus", "south pole"],
            "title": "ISRO Chandrayaan Lunar Programme (1, 2, 3 & 4)",
            "summary": "India's landmark lunar exploration series establishing historic discoveries of lunar water molecules, in-situ South Pole sulfur, and regolith thermophysics.",
            "missions_detail": [
                "Chandrayaan-1 (2008): Discovered water molecules (H2O/OH) on the Moon using M3 spectrometer and Moon Impact Probe (MIP).",
                "Chandrayaan-2 (2019-Active): 256-band IIRS mapping water-ice traps (2,100 PPM at Cabeus Crater) with 5.5+ years orbiter fuel remaining.",
                "Chandrayaan-3 (2023): Historic first landing near Lunar South Pole (Shiv Shakti Point: 69.373°S). Pragyan LIBS discovered in-situ Sulfur (0.42 wt%), ChaSTE measured 61.4°C thermal drop across 90mm regolith.",
                "Chandrayaan-4 (Upcoming): Lunar Sample Return Mission to collect and return South Pole core regolith back to Earth."
            ],
            "hindi_summary": "Chandrayaan ISRO ka lunar exploration programme hai. Ch-1 ne paani khoja, Ch-2 orbiter ne 256-band spectroscopy ki, Ch-3 ne South Pole (Shiv Shakti Point) pe world-first landing karke Sulfur aur thermal gradient measure kiya, aur Ch-4 Moon se sample wapas layega."
        },
        {
            "id": "mangalyaan_mars",
            "keywords": ["mangalyaan", "mom", "mars", "mars orbiter mission", "mom-2", "red planet", "methane sensor"],
            "title": "Mars Orbiter Mission (Mangalyaan / MOM & MOM-2)",
            "summary": "India's first interplanetary mission making ISRO the 4th agency to reach Mars, and the 1st in the world to succeed on its maiden attempt at a fraction of global mission costs ($74M).",
            "key_achievements": [
                "Operated for over 7.5 years (designed for 6 months).",
                "Mars Colour Camera (MCC) produced full-disk Mars global mosaic and imaged Mars moons Phobos and Deimos.",
                "MOM-2 (Mangalyaan-2): Upcoming multi-instrument Mars orbiter with radar and atmospheric payloads."
            ],
            "hindi_summary": "Mangalyaan (MOM) Bharat ka pehla interplanetary mission tha jisne pehle hi attempt me Mars orbit me entry karke itihaas racha ($74M cost). Isne 7.5 saal tak Mars ke atmospheric data aur Phobos/Deimos ki high-res images bheji."
        },
        {
            "id": "aditya_l1",
            "keywords": ["aditya", "aditya-l1", "sun", "solar", "lagrange point", "halo orbit", "velc", "suit", "papa", "coronagraph", "cme", "solar flare"],
            "title": "Aditya-L1 Solar Observatory & Space Weather Mission",
            "summary": "India's first dedicated solar observatory stationed at the Sun-Earth Lagrangian Point 1 (L1, 1.5 million km from Earth) in a halo orbit for uninterrupted 24/7 solar monitoring.",
            "key_payloads": [
                "VELC (Visible Emission Line Coronagraph): Fe XIV 530.3nm green line solar corona and CME kinematics imaging down to 1.05 solar radii.",
                "SUIT (Solar Ultraviolet Imaging Telescope): 200–400 nm photosphere and chromosphere UV flash imaging.",
                "PAPA & ASPEX: Solar wind particle analyzers tracking proton density, alpha-to-proton ratios, and interplanetary magnetic fields (IMF Bz)."
            ],
            "hindi_summary": "Aditya-L1 Sun-Earth Lagrange Point 1 (15 lakh km door) pe stationed Bharat ki pehli solar observatory hai jo 24/7 bina eclipse ke Sun ke corona, solar flares aur solar storms ko monitor karti hai."
        },
        {
            "id": "xposat_astrosat",
            "keywords": ["xposat", "astrosat", "black hole", "neutron star", "pulsar", "polarimetry", "x-ray", "space telescope"],
            "title": "XPoSat & AstroSat Cosmic Observatories",
            "summary": "ISRO's space-based astronomical observatories studying high-energy celestial phenomena.",
            "key_features": [
                "AstroSat (2015): India's first multi-wavelength space observatory observing UV, optical, and X-ray bands simultaneously.",
                "XPoSat (2024): World's second dedicated X-ray polarimetry mission (after NASA IXPE) using POLIX and XSPECT instruments to study the emission mechanisms and magnetic fields of black holes, magnetars, and neutron stars."
            ],
            "hindi_summary": "AstroSat multi-wavelength cosmic telescope hai aur XPoSat world ka doosra dedicated X-ray polarimeter satellite hai jo black holes aur neutron stars ke extreme radiation aur magnetic fields ko study karta hai."
        }
    ],

    "astronomy_astrophysics": [
        {
            "id": "black_holes",
            "keywords": ["black hole", "event horizon", "singularity", "gravitational singularity", "general relativity", "hawking radiation", "supermassive"],
            "title": "Black Holes & Gravitational Physics",
            "summary": "A black hole is a region of spacetime where gravity is so strong that nothing—no particles or even electromagnetic radiation such as light—can escape from inside its event horizon.",
            "key_concepts": [
                "Event Horizon: The boundary around a black hole beyond which escape velocity exceeds the speed of light ($c = 300,000\text{ km/s}$).",
                "Singularity: The infinite-density gravitational core where general relativity predicts curvature becomes infinite.",
                "Schwarzschild Radius: $R_s = \frac{2GM}{c^2}$ (The radius to which an object must be compressed to become a black hole; for Earth, $R_s \approx 9\text{ mm}$).",
                "Stellar vs Supermassive: Stellar black holes (3–50 solar masses) form from collapsing massive stars; Supermassive black holes (millions to billions of solar masses, like Sagittarius A* at Milky Way's center) reside at galactic cores."
            ],
            "hindi_summary": "Black Hole spacetime ka ek aisa region hai jahan gravity itni intense hoti hai ki light bhi escape nahi kar sakti. Iske boundary ko 'Event Horizon' kehte hain jahan escape velocity speed of light ($c$) se zyada hoti hai."
        },
        {
            "id": "orbital_mechanics",
            "keywords": ["orbital mechanics", "lagrange point", "lagrangian", "hohmann", "escape velocity", "kepler", "delta-v", "gravity assist", "slingshot", "apogee", "perigee"],
            "title": "Orbital Mechanics & Celestial Dynamics",
            "summary": "The physics governing spacecraft motion, trajectories, and gravitational equilibrium points in space.",
            "key_concepts": [
                "Lagrange Points (L1 to L5): Positions in an orbital configuration of two large bodies where gravitational forces and centrifugal force balance out. L1, L2, L3 are collinear equilibrium points; L4 and L5 form stable equilateral triangles.",
                "Escape Velocity: $v_e = \sqrt{\frac{2GM}{R}}$ (Earth: $11.186\text{ km/s}$, Moon: $2.38\text{ km/s}$, Mars: $5.03\text{ km/s}$).",
                "Hohmann Transfer Orbit: The most fuel-efficient two-impulse elliptical orbit transfer between two circular orbits.",
                "Gravity Assist / Slingshot: Utilizing a planet's orbital momentum to increase/decrease spacecraft velocity without expending propellant (used by Mangalyaan and Chandrayaan earth-bound orbit raising maneuvers)."
            ],
            "hindi_summary": "Orbital Mechanics spacecraft ke motion ki physics hai. Lagrange Points (L1-L5) gravitational balance points hote hain jahan spacecraft bina fuel kharch kiye orbit kar sakta hai. Earth se escape velocity $11.2\text{ km/s}$ aur Moon se $2.38\text{ km/s}$ hai."
        },
        {
            "id": "solar_physics",
            "keywords": ["solar flare", "cme", "coronal mass ejection", "space weather", "sunspot", "geomagnetic storm", "kp index", "aurora", "solar wind"],
            "title": "Solar Physics, Flares & Space Weather",
            "summary": "The interaction of solar magnetic fields, high-energy particle emissions, and their effects on planetary magnetospheres and satellites.",
            "key_concepts": [
                "Solar Flare Classes: Categorized by peak soft X-ray flux into logarithmic classes A, B, C, M, and X (where X-class $> 10^{-4}\text{ W/m}^2$ is the most extreme).",
                "Coronal Mass Ejection (CME): Massive bubbles of magnetized plasma ejected from the solar corona at speeds between 250 to over 3,000 km/s.",
                "Geomagnetic Storms & Kp Index: When a CME's southward IMF ($B_z$) reconnects with Earth's magnetosphere, it drives geomagnetic storms rated G1 (minor) to G5 (extreme, $Kp = 9$), causing auroras, satellite drag, and power grid fluctuations."
            ],
            "hindi_summary": "Solar Flares Sun ke magnetic reconnection se release hone wali high-energy radiation hain. CMEs (Coronal Mass Ejections) plasma shockwaves hoti hain jo $1,000+\text{ km/s}$ pe travel karke Earth ke magnetosphere me geomagnetic storms ($Kp$ index) create karti hain."
        }
    ],

    "satellites_fleet": [
        {
            "id": "navic_fleet",
            "keywords": ["navic", "irnss", "indian gps", "navigation", "atomic clock", "rubidium", "constellation"],
            "title": "NavIC (Navigation with Indian Constellation / IRNSS)",
            "summary": "India's independent regional satellite navigation system providing sub-5m position accuracy across India and up to 1,500 km beyond its borders.",
            "architecture": [
                "Constellation: 7 active satellites (3 in Geostationary Orbit at 32.5°E, 83°E, 131.5°E and 4 in Geosynchronous inclined orbits at 29°).",
                "Signals: Dual-frequency L5 (1176.45 MHz) and S-band (2492.028 MHz), now expanding to civilian L1 band (1575.42 MHz) with indigenous Rubidium atomic clocks."
            ],
            "hindi_summary": "NavIC Bharat ka indigenous GPS system hai jo 7 satellites (GEO/GSO) ke zariye pure Bharat aur 1,500 km border area me sub-5 meter high-accuracy positioning provide karta hai."
        },
        {
            "id": "earth_observation_fleet",
            "keywords": ["cartosat", "eos", "risat", "oceansat", "resourcesat", "remote sensing", "gis", "sar"],
            "title": "ISRO Earth Observation & Remote Sensing Constellation",
            "summary": "World-class optical and radar satellite fleet for mapping, agriculture, disaster management, and strategic surveillance.",
            "fleet_detail": [
                "Cartosat-3: Sub-0.28m spatial resolution optical imaging in 505 km SSO.",
                "EOS-04 / RISAT-1A: 529 km SSO C-band Synthetic Aperture Radar (SAR) penetrating clouds and night for 24/7 disaster tracking.",
                "Oceansat-3 / EOS-06: Ocean Color Monitor (OCM-3) and Ku-band scatterometer tracking sea surface winds and chlorophyll."
            ],
            "hindi_summary": "ISRO ka Earth Observation fleet Cartosat (0.28m high-res optical), EOS-04 (C-band all-weather radar), aur Oceansat satellites se bana hai jo disaster management aur agriculture me kaam aate hain."
        }
    ]
}

class DynamicSpaceBrain:
    """Intelligent semantic search and real-time scientific synthesis engine."""
    
    def __init__(self):
        self.categories = SPACE_KNOWLEDGE_MATRIX

    def search_knowledge(self, query: str) -> List[Dict[str, Any]]:
        q_tokens = set(re.findall(r'\w+', query.lower()))
        results = []

        for category, topics in self.categories.items():
            for topic in topics:
                score = 0
                keywords = topic.get("keywords", [])
                
                # Direct keyword matching
                for kw in keywords:
                    if kw in query.lower():
                        score += 5
                    for token in q_tokens:
                        if token in kw:
                            score += 1
                
                # Check title / summary words
                title_words = set(re.findall(r'\w+', topic.get("title", "").lower()))
                score += len(q_tokens.intersection(title_words)) * 2

                if score > 0:
                    results.append({"topic": topic, "score": score, "category": category})

        results.sort(key=lambda x: x["score"], reverse=True)
        return [r["topic"] for r in results[:3]]

    def synthesize_answer(self, query: str, lang: str = "english") -> Dict[str, Any]:
        matched_topics = self.search_knowledge(query)
        
        if not matched_topics:
            # General astrophysics / space fallback
            if lang == "hindi":
                text = (
                    f"**Space Science & ISRO Mission Intelligence Report:**\n\n"
                    f"Aapne '{query}' ke baare me poocha hai.\n\n"
                    f"• **Space Exploration Context:** ISRO aur global astronomy deep-space science, orbital mechanics aur advanced planetary research pe lagatar kaam kar rahe hain.\n"
                    f"• **Key Pillars:** Launch Vehicles (LVM3, PSLV), Planetary Probes (Chandrayaan, Aditya-L1, Mangalyaan), aur Deep Space Tracking (ISTRAC Byalalu 32m IDSN).\n"
                    f"• **Detailed Telemetry:** Aap Chandrayaan spectroscopy, Aditya-L1 solar storms, ya active 54-satellite fleet ki specific telemetry bhi query kar sakte hain."
                )
            else:
                text = (
                    f"**Space Science & ISRO Mission Intelligence Synthesis:**\n\n"
                    f"Query analysis for: *'{query}'*\n\n"
                    f"• **Domain Overview:** In planetary astrophysics and aerospace engineering, this involves celestial dynamics, advanced propulsion systems, and real-time telemetry cross-referencing.\n"
                    f"• **ISRO Operational Capabilities:** ISRO deploys multidisciplinary platforms ranging from high-energy space telescopes (AstroSat, XPoSat) to interplanetary deep-space orbiters and heavy-lift rocketry (LVM3/CE-20).\n"
                    f"• **Telemetry Integration:** You can explore calibrated PDS4 lunar datasets, solar flare CME kinematics from Aditya-L1, or NORAD Two-Line Element (TLE) satellite ephemeris using AntarikshaVaani."
                )
            viz_type = "SATELLITE_RADAR"
            title = "ISRO Constellation & Space Tracking Network"
        else:
            top = matched_topics[0]
            title = top.get("title", "Space Science Intelligence")
            
            if lang == "hindi":
                # Hindi synthesis
                summary = top.get("hindi_summary", top.get("summary", ""))
                points = []
                
                if "stages" in top:
                    points.extend([f"• **Rocket Stage:** {s}" for s in top["stages"]])
                if "missions_detail" in top:
                    points.extend([f"• {m}" for m in top["missions_detail"]])
                elif "missions" in top:
                    points.append(f"• **Major Missions:** {', '.join(top['missions'])}")
                if "key_subsystems" in top:
                    points.extend([f"• {k}" for k in top["key_subsystems"]])
                if "key_payloads" in top:
                    points.extend([f"• {k}" for k in top["key_payloads"]])
                if "key_concepts" in top:
                    points.extend([f"• {k}" for k in top["key_concepts"]])
                if "architecture" in top:
                    points.extend([f"• {k}" for k in top["architecture"]])
                if "fleet_detail" in top:
                    points.extend([f"• {k}" for k in top["fleet_detail"]])

                body_points = "\n".join(points[:5])
                text = f"**{title}**\n\n{summary}\n\n{body_points}"
            else:
                # English synthesis
                summary = top.get("summary", "")
                points = []
                
                if "stages" in top:
                    points.extend([f"• **Stage Architecture:** {s}" for s in top["stages"]])
                if "missions_detail" in top:
                    points.extend([f"• {m}" for m in top["missions_detail"]])
                elif "missions" in top:
                    points.append(f"• **Key Flights & Payloads:** {', '.join(top['missions'])}")
                if "key_subsystems" in top:
                    points.extend([f"• {k}" for k in top["key_subsystems"]])
                if "key_payloads" in top:
                    points.extend([f"• {k}" for k in top["key_payloads"]])
                if "key_concepts" in top:
                    points.extend([f"• {k}" for k in top["key_concepts"]])
                if "architecture" in top:
                    points.extend([f"• {k}" for k in top["architecture"]])
                if "fleet_detail" in top:
                    points.extend([f"• {k}" for k in top["fleet_detail"]])

                body_points = "\n".join(points[:5])
                text = f"**{title}**\n\n{summary}\n\n{body_points}"

            # Select suitable visualization
            tid = top.get("id", "")
            if "chandrayaan" in tid or "moon" in tid or "water" in tid or "lunar" in tid:
                viz_type = "LUNAR_MAP"
            elif "pragyan" in tid or "sulfur" in tid or "mineral" in tid:
                viz_type = "MINERAL_HAZARD"
            elif "aditya" in tid or "solar" in tid or "flare" in tid or "cme" in tid:
                viz_type = "SOLAR_TIMELINE"
            else:
                viz_type = "SATELLITE_RADAR"

        return {
            "text": text,
            "title": title,
            "visualization_type": viz_type,
            "matched_topics": [t.get("title") for t in matched_topics]
        }

space_brain = DynamicSpaceBrain()
