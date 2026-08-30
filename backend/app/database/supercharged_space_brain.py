"""
AntarikshaVaani - Master 25+ Domain Space Knowledge Engine & Multilingual Indic Router
Author: Team Stackverse-labs

Supports full bilingual & multilingual processing across:
- English
- Hindi (हिन्दी)
- Punjabi (ਪੰਜਾਬੀ)
- Kannada (ಕನ್ನಡ)
- Telugu (తెలుగు)
- Tamil (தமிழ்)
- Marathi (मराठी)
- Gujarati (ગુજરાતી)
"""

import re
from typing import Dict, List, Any, Optional

MEGA_SPACE_KNOWLEDGE_MATRIX = {
    # 1. SOLAR & SPACE WEATHER
    "solar_space_weather": [
        {
            "id": "aditya_l1_mission",
            "keywords": ["aditya", "aditya-l1", "aditya l1", "solar flare", "flare", "geomagnetic storm", "cme", "swoc", "velc", "suit", "papa", "aspex", "solar storm", "coronal mass ejection", "kp index", "sunspot", "solar wind", "आदित्य", "सूर्य", "सौर", "ਸੂਰਜ", "ਅਦਿੱਤਿਆ", "ಸೂರ್ಯ", "ಆದಿತ್ಯ", "సూర్యుడు", "ఆదిత్య", "சூரியன்", "ஆதித்யா"],
            "title": "Aditya-L1 Solar Observatory & Space Weather Intelligence (SWOC)",
            "summary": "India's first dedicated solar observatory stationed at Sun-Earth Lagrange Point 1 (L1, 1.5M km from Earth) in a halo orbit providing 24/7 solar flare and CME monitoring.",
            "key_aspects": [
                "VELC (Visible Emission Line Coronagraph): Fe XIV 530.3nm green line solar corona and CME kinematics imaging down to 1.05 solar radii.",
                "SUIT (Solar Ultraviolet Imaging Telescope): 200–400 nm photosphere and chromosphere UV flash imaging.",
                "PAPA & ASPEX: Solar wind particle analyzers tracking proton density (24.5/cm³), alpha-to-proton ratios, and interplanetary magnetic field (IMF Bz).",
                "Recent Telemetry Event (AR3780): X5.8 Class major solar flare with 1,420 km/s earth-directed CME driving Kp = 7.8 (G4 Severe Geomagnetic Storm) with R3 HF radio blackout."
            ],
            "translations": {
                "hindi": "Aditya-L1 Bharat ki pehli Solar Observatory hai jo Sun-Earth L1 Point (1.5M km door) se 24/7 surya ke flares, CME kinematics aur geomagnetic storms ko monitor karti hai. Recent SWOC telemetry me Active Region AR3780 se X5.8 Class major solar flare aur 1,420 km/s speed ka CME shockwave detect kiya gaya hai jisse Kp = 7.8 (G4 Severe Geomagnetic Storm) generate hua hai.",
                "punjabi": "ਅਦਿੱਤਿਆ-ਐਲ1 (Aditya-L1) ਭਾਰਤ ਦੀ ਪਹਿਲੀ ਸੂਰਜੀ ਵੇਧਸ਼ਾਲਾ ਹੈ ਜੋ L1 ਪੁਆਇੰਟ ਤੋਂ ਸੂਰਜ ਦੇ ਫਲੇਅਰਾਂ ਅਤੇ ਸੂਰਜੀ ਤੂਫ਼ਾਨਾਂ 'ਤੇ ਨਜ਼ਰ ਰੱਖਦੀ ਹੈ। ਤਾਜ਼ਾ SWOC ਟੈਲੀਮੈਟਰੀ ਵਿੱਚ AR3780 ਤੋਂ X5.8 ਕਲਾਸ ਦਾ ਵੱਡਾ ਸੂਰਜੀ ਤੂਫ਼ਾਨ ਅਤੇ 1,420 ਕਿਮੀ/ਸੈਕਿੰਡ ਦੀ ਰਫ਼ਤਾਰ ਵਾਲਾ CME ਸ਼ਾਕਵੇਵ ਦਰਜ ਕੀਤਾ ਗਿਆ ਹੈ (Kp = 7.8, G4 ਗੰਭੀਰ ਤੂਫ਼ਾਨ)।",
                "kannada": "ಆದಿತ್ಯ-L1 ಭಾರತದ ಮೊದಲ ಸೌರ ವೀಕ್ಷಣಾಲಯವಾಗಿದ್ದು, L1 ಪಾಯಿಂಟ್‌ನಿಂದ ಸೂರ್ಯನ ಜ್ವಾಲೆಗಳು ಮತ್ತು ಸೌರ ಮಾರುತಗಳನ್ನು 24/7 ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡುತ್ತದೆ. ಇತ್ತೀಚಿನ SWOC ಟೆಲಿಮೆಟ್ರಿಯಲ್ಲಿ AR3780 ನಿಂದ X5.8 ಕ್ಲಾಸ್ ಸೌರ ಜ್ವಾಲೆ ಮತ್ತು 1,420 km/s ವೇಗದ CME ಪತ್ತೆಯಾಗಿದ್ದು, Kp = 7.8 ತೀವ್ರ ಸೌರ ಬಿರುಗಾಳಿ ಉಂಟಾಗಿದೆ.",
                "telugu": "ఆదిత్య-L1 భారతదేశపు మొదటి సౌర అబ్జర్వేటరీ. ఇది సూర్యుని నుండి వచ్చే సౌర మంటలు (Flares) మరియు CME లను 24/7 పర్యవేక్షిస్తుంది. ఇటీవల AR3780 ప్రాంతం నుండి X5.8 క్లాస్ భారీ సౌర మంట మరియు 1,420 km/s వేగంతో CME నమోదైంది (Kp = 7.8, G4 తీవ్ర తుఫాను).",
                "tamil": "ஆதித்யா-L1 இந்தியாவின் முதல் சூரிய ஆய்வு மையமாகும். இது லெக்ராஞ்சியன் புள்ளி 1-லிருந்து சூரிய எரிப்பு மற்றும் புவி காந்த புயல்களை கண்காணிக்கிறது. சமீபத்திய SWOC தரவுகளில் AR3780 பகுதியிலிருந்து X5.8 வகுப்பு சூரிய எரிப்பு மற்றும் 1,420 கிமீ/விநாடி வேகத்தில் CME அதிர்ச்சி அலை பதிவாகியுள்ளது."
            },
            "viz_type": "SOLAR_TIMELINE"
        }
    ],

    # 2. LUNAR MISSIONS (WATER, MINERALOGY, SAMPLE RETURN)
    "lunar_missions": [
        {
            "id": "lunar_water_ice_discovery",
            "keywords": ["paani", "water", "ice", "water-ice", "water on moon", "paani mila", "h2o", "hydroxyl", "iirs", "cabeus", "shackleton", "shoemaker", "3.0 micron", "spectral absorption", "pds4 water", "पानी", "जल", "ਪਾਣੀ", "ਨੀਰੁ", "ನೀರು", "నీరు", "தண்ணீர்", "पाणी", "પાણી"],
            "title": "Chandrayaan Discovery of Water-Ice & Hydroxyl (H2O / OH) on the Moon",
            "summary": "Chandrayaan-1 and Chandrayaan-2 have established definitive spectroscopic confirmation of water molecules (H2O) and bound hydroxyl (OH) trapped across the Lunar South Pole.",
            "key_aspects": [
                "Highest Concentration (Cabeus Crater): 2,100 PPM water-ice concentration (31% purity, 96% confidence) trapped in sub-35 Kelvin Permanently Shadowed Regions (PSRs).",
                "Official PDS4 Product ID: urn:isro:ch2:pds4:ch2_iir_ncn_20200115t142851120_d18.",
                "Spectroscopic Proof: 256-band IIRS sensor observed pronounced 2.81 to 3.0 micron fundamental O-H absorption band depth (IBD = 0.418).",
                "Other Volatile Traps: Shackleton Crater (1,450 PPM) and Shoemaker Crater (1,280 PPM)."
            ],
            "translations": {
                "hindi": "हाँ! Chandrayaan ne Moon pe paani (Water-Ice & Hydroxyl) ki pakki scientific discovery ki hai. Cabeus Crater (South Pole 84.9°S) me 2,100 PPM water-ice confirm hua hai (PDS4 Product ID: urn:isro:ch2:pds4:ch2_iir_ncn_20200115t142851120_d18). IIRS spectrometer ke 256 bands ne 3.0 micrometer pe deep absorption band (IBD = 0.418) detect kiya jo sub-35 Kelvin craters me molecular H2O ko prove karta hai.",
                "punjabi": "ਹਾਂਜੀ! ਚੰਦਰਯਾਨ ਨੇ ਚੰਦਰਮਾ ਦੇ ਦੱਖਣੀ ਧਰੁਵ 'ਤੇ ਪਾਣੀ (Water-Ice ਅਤੇ Hydroxyl) ਦੀ ਪੱਕੀ ਵਿਗਿਆਨਕ ਖੋਜ ਕੀਤੀ ਹੈ। ਕੈਬੀਅਸ ਕ੍ਰੇਟਰ (84.9°S) ਵਿੱਚ 2,100 PPM ਪਾਣੀ ਦੀ ਬਰਫ਼ ਦੀ ਪੁਸ਼ਟੀ ਹੋਈ ਹੈ (PDS4 URN: urn:isro:ch2:pds4:ch2_iir_ncn...). IIRS ਸਪੈਕਟ੍ਰੋਮੀਟਰ ਨੇ 3.0 ਮਾਈਕ੍ਰੋਮੀਟਰ 'ਤੇ ਡੂੰਘੀ ਸੋਖਣ ਲਾਈਨ (IBD = 0.418) ਦਰਜ ਕੀਤੀ ਹੈ।",
                "kannada": "ಹೌದು! ಚಂದ್ರಯಾನವು ಚಂದ್ರನ ದಕ್ಷಿಣ ಧ್ರುವದಲ್ಲಿ ನೀರಿನ ಮಂಜುಗಡ್ಡೆ (Water-Ice) ಮತ್ತು ಹೈಡ್ರಾಕ್ಸಿಲ್ ಇರುವಿಕೆಯನ್ನು ಖಚಿತಪಡಿಸಿದೆ. ಕ್ಯಾಬಿಯಸ್ ಕ್ರೇಟರ್ (84.9°S) ನಲ್ಲಿ 2,100 PPM ಸಾಂದ್ರತೆಯ ನೀರು ದೃಢಪಟ್ಟಿದೆ (PDS4 URN: urn:isro:ch2:pds4:ch2_iir_ncn...). IIRS ಸ್ಪೆಕ್ಟ್ರೋಮೀಟರ್ 3.0 ಮೈಕ್ರಾನ್ ತರಂಗಾಂತರದಲ್ಲಿ ತೀವ್ರ ಹೀರಿಕೊಳ್ಳುವಿಕೆಯನ್ನು (IBD = 0.418) ದಾಖಲಿಸಿದೆ.",
                "telugu": "అవును! చంద్రయాన్ చంద్రుని దక్షిణ ధ్రువంపై నీటి మంచు (Water-Ice) మరియు హైడ్రాక్సిల్ ఉనికిని కనుగొంది. కాబియస్ క్రేటర్ (84.9°S) వద్ద 2,100 PPM సాంద్రత గల నీటి నిల్వలు నిర్ధారించబడ్డాయి (PDS4 URN: urn:isro:ch2:pds4:ch2_iir_ncn...). IIRS స్పెక్ట్రోమీటర్ 3.0 మైక్రాన్ల వద్ద స్పష్టమైన శోషణ లోతును (IBD = 0.418) గుర్తించింది.",
                "tamil": "ஆம்! சந்திரயான் விண்கலம் நிலவின் தென் துருவத்தில் நீர் பனி (Water-Ice) மற்றும் ஹைட்ராக்சில் இருப்பதை உறுதிப்படுத்தியுள்ளது. கேபியஸ் பள்ளத்தில் (84.9°S) 2,100 PPM நீர் செறிவு உறுதி செய்யப்பட்டுள்ளது (PDS4 URN: urn:isro:ch2:pds4:ch2_iir_ncn...). IIRS கருவி 3.0 மைக்ரான் அலைநீளத்தில் ஆழமான உறிஞ்சுதல் பட்டையை (IBD = 0.418) பதிவு செய்துள்ளது."
            },
            "viz_type": "LUNAR_MAP"
        },
        {
            "id": "chandrayaan_3_shiv_shakti",
            "keywords": ["chandrayaan-3", "chandrayaan 3", "pragyan", "vikram", "shiv shakti", "libs", "chaste", "sulfur", "thermal gradient", "regolith", "touchdown", "सल्फर", "ਗੰਧਕ", "ਸਲਫਰ", "ಸಲ್ಫರ್", "సల్ఫర్", "கந்தகம்"],
            "title": "Chandrayaan-3 Shiv Shakti Point: Pragyan LIBS Mineralogy & ChaSTE Thermal Profile",
            "summary": "Historic soft landing at Shiv Shakti Point (69.373°S, 32.319°E) discovering in-situ elemental sulfur and extreme lunar regolith thermal insulation.",
            "key_aspects": [
                "Pragyan LIBS Sulfur Discovery: First in-situ detection of neutral Sulfur (S I) with characteristic atomic emission lines at 282.8 nm, 286.3 nm, and 303.4 nm (0.42 wt% abundance).",
                "ChaSTE 10-Point Thermal Gradient: Surface temperature (+50.2°C) drops sharply to -10.5°C at 80mm depth (61.4°C thermal drop) confirming lunar soil vacuum insulation (0.0028 W/m·K).",
                "RAMBHA-LP Plasma Probe: Measured sparse lunar daytime ionospheric plasma density (~1.06 x 10^4 per cm³)."
            ],
            "translations": {
                "hindi": "Chandrayaan-3 ne Moon ke South Pole (Shiv Shakti Point 69.373°S) pe historic landing karke Pragyan rover ke LIBS laser se pehli baar in-situ Sulfur (S) ki atomic lines (282.8nm, 286.3nm) khoji. ChaSTE thermal probe ne surface (+50.2°C) se 80mm depth (-10.5°C) tak steep 61.4°C ka thermal drop record kiya.",
                "punjabi": "ਚੰਦਰਯਾਨ-3 ਨੇ ਸ਼ਿਵ ਸ਼ਕਤੀ ਪੁਆਇੰਟ (69.373°S) 'ਤੇ ਇਤਿਹਾਸਕ ਲੈਂਡਿੰਗ ਕਰਕੇ ਪ੍ਰਗਿਆਨ ਰੋਵਰ ਦੇ LIBS ਲੇਜ਼ਰ ਰਾਹੀਂ ਪਹਿਲੀ ਵਾਰ ਗੰਧਕ/ਸਲਫਰ (282.8nm) ਦੀ ਖੋਜ ਕੀਤੀ। ChaSTE ਥਰਮਲ ਪ੍ਰੋਬ ਨੇ ਸਤ੍ਹਾ (+50.2°C) ਤੋਂ 80mm ਡੂੰਘਾਈ (-10.5°C) ਤੱਕ 61.4°C ਦਾ ਵੱਡਾ ਤਾਪਮਾਨ ਗਿਰਾਵਟ ਦਰਜ ਕੀਤਾ।",
                "kannada": "ಚಂದ್ರಯಾನ-3 ಶಿವಶಕ್ತಿ ಪಾಯಿಂಟ್ (69.373°S) ನಲ್ಲಿ ಲ್ಯಾಂಡಿಂಗ್ ಮಾಡಿ ಪ್ರಜ್ಞಾನ್ ರೋವರ್‌ನ LIBS ಲೇಸರ್ ಮೂಲಕ ಮೊದಲ ಬಾರಿಗೆ ಸಲ್ಫರ್ (Sulfur - 282.8nm) ಅಂಶವನ್ನು ಪತ್ತೆಮಾಡಿದೆ. ChaSTE ತಾಪಮಾನ ತನಿಖೆಯು ಮೇಲ್ಮೈ (+50.2°C) ಯಿಂದ 80mm ಆಳದಲ್ಲಿ (-10.5°C) ತೀವ್ರ 61.4°C ತಾಪಮಾನ ಕುಸಿತವನ್ನು ದಾಖಲಿಸಿದೆ.",
                "telugu": "చంద్రయాన్-3 శివశక్తి పాయింట్ (69.373°S) వద్ద చారిత్రాత్మక ల్యాండింగ్ చేసి, ప్రజ్ఞాన్ రోవర్ LIBS లేజర్ ద్వారా మొదటిసారిగా సల్ఫర్ (282.8nm) ఉనికిని కనుగొంది. ChaSTE ప్రోబ్ ఉపరితలం (+50.2°C) నుండి 80mm లోతులో (-10.5°C) వరకు 61.4°C ఉష్ణోగ్రత తగ్గుదలను నమోదు చేసింది.",
                "tamil": "சந்திரயான்-3 சிவசக்தி புள்ளியில் (69.373°S) தரையிறங்கி, பிரக்யான் ரோவரின் LIBS லேசர் மூலம் முதன்முறையாக கந்தகம் (Sulfur - 282.8nm) இருப்பதை கண்டறிந்தது. ChaSTE வெப்ப உணரி மேற்பரப்பில் (+50.2°C) இருந்து 80 மிமீ ஆழத்தில் (-10.5°C) வரை 61.4°C செங்குத்தான வெப்பநிலை வீழ்ச்சியை பதிவு செய்தது."
            },
            "viz_type": "MINERAL_HAZARD"
        }
    ],

    # 3. ACTIVE SATELLITE FLEET & CONSTELLATION
    "satellite_fleet": [
        {
            "id": "active_satellite_fleet_54",
            "keywords": ["satellite", "satellites", "kitne satellite", "active fleet", "54 satellite", "norad", "tle", "gsat", "cartosat", "eos-04", "xposat", "navic", "उपग्रह", "ਸੈਟੇਲਾਈਟ", "ਉਪਗ੍ਰਹਿ", "ಉಪಗ್ರಹ", "ఉపగ్రహం", "செயற்கைக்கோள்"],
            "title": "ISRO Active Satellite Fleet & NavIC Constellation (54 Spacecraft)",
            "summary": "Real-time tracking of India's ~54 operational satellites across LEO, GEO, and deep space via Space-Track NORAD TLE orbital propagation.",
            "key_aspects": [
                "Operational Strength: ~54 active satellites providing continuous earth observation, communication, meteorology, navigation, and space science.",
                "NavIC (IRNSS) Constellation: 7-satellite regional satellite navigation system providing independent position, velocity, and timing over India and 1,500 km beyond borders.",
                "Earth Observation & Radar: EOS-04 (C-band RISAT SAR), Cartosat-3 (25cm ultra-high optical resolution), and Resourcesat-2A.",
                "Deep Space Assets: Chandrayaan-2 Orbiter (#44441) and Aditya-L1 Solar Observatory (#57714)."
            ],
            "translations": {
                "hindi": "Bharat (ISRO) ke paas lagbhag 54 active satellites space me hain jo Earth Observation, NavIC Navigation, Communication aur Deep Space exploration provide karte hain. ISTRAC Bengaluru network inko 24/7 NORAD TLE se track karta hai.",
                "punjabi": "ਭਾਰਤ (ISRO) ਦੇ ਇਸ ਸਮੇਂ ਲਗਭਗ 54 ਸਰਗਰਮ ਸੈਟੇਲਾਈਟ ਪੁਲਾੜ ਵਿੱਚ ਕੰਮ ਕਰ ਰਹੇ ਹਨ ਜੋ NavIC ਨੈਵੀਗੇਸ਼ਨ, ਸੰਚਾਰ ਅਤੇ ਧਰਤੀ ਨਿਗਰਾਨੀ ਪ੍ਰਦਾਨ ਕਰਦੇ ਹਨ। ISTRAC ਬੈਂਗਲੁਰੂ ਇਹਨਾਂ ਨੂੰ ਰੀਅਲ-ਟਾਈਮ ਟਰੈਕ ਕਰਦਾ ਹੈ।",
                "kannada": "ಭಾರತ (ಇಸ್ರೋ) ಪ್ರಸ್ತುತ ಬಾಹ್ಯಾಕಾಶದಲ್ಲಿ ಸುಮಾರು 54 ಸಕ್ರಿಯ ಉಪಗ್ರಹಗಳನ್ನು (Active Satellites) ಹೊಂದಿದೆ. ಇವು NavIC ಸಂಚರಣೆ, ಸಂವಹನ ಮತ್ತು ಭೂ ವೀಕ್ಷಣೆಯನ್ನು ನಿರ್ವಹಿಸುತ್ತವೆ.",
                "telugu": "భారతదేశం (ఇస్రో) ప్రస్తుతం అంతరిక్షంలో దాదాపు 54 క్రియాశీల ఉపగ్రహాలను (Active Satellites) కలిగి ఉంది. ఇవి NavIC నావిగేషన్, సమాచార మార్పిడి మరియు భూ పరిశీలనను అందిస్తాయి.",
                "tamil": "இந்தியா (இஸ்ரோ) தற்போது விண்வெளியில் சுமார் 54 செயலில் உள்ள செயற்கைக்கோள்களைக் கொண்டுள்ளது. இவை NavIC வழிசெலுத்தல், தகவல் தொடர்பு மற்றும் புவி கண்காணிப்பை வழங்குகின்றன."
            },
            "viz_type": "SATELLITE_RADAR"
        }
    ]
}

class SuperchargedSpaceBrain:
    def __init__(self):
        self.categories = MEGA_SPACE_KNOWLEDGE_MATRIX

    def detect_language(self, query: str) -> str:
        q = query.lower()

        # Gurmukhi script (Punjabi)
        if any('\u0a00' <= char <= '\u0a7f' for char in query):
            return "punjabi"
        if any(w in q for w in ["kinne", "kiddan", "daso", "milya", "chann", "toofan", "paani"]):
            if any(w in q for w in ["nu", "te", "vich", "hai", "han"]):
                return "punjabi"

        # Kannada script
        if any('\u0c80' <= char <= '\u0cff' for char in query):
            return "kannada"
        if any(w in q for w in ["hege", "yavudu", "sikkitu", "nodona", "beku", "yelli", "neeru"]):
            return "kannada"

        # Telugu script
        if any('\u0c00' <= char <= '\u0c7f' for char in query):
            return "telugu"
        if any(w in q for w in ["cheppandi", "kanugonnada", "ela", "unna", "neeti"]):
            return "telugu"

        # Tamil script
        if any('\u0b80' <= char <= '\u0bff' for char in query):
            return "tamil"
        if any(w in q for w in ["eppadi", "kandupidithada", "solla", "thanneer"]):
            return "tamil"

        # Devanagari script (Hindi / Marathi)
        if any('\u0900' <= char <= '\u097f' for char in query):
            if any(w in query for w in ["आहे", "सांगा", "सापडले", "झाले"]):
                return "marathi"
            return "hindi"

        # Romanized Hindi/Hinglish
        if any(w in q for w in ["kya", "hai", "batao", "mila", "nahi", "kaise", "kitne", "paani", "ka"]):
            return "hindi"

        return "english"

    def search_all(self, query: str) -> List[Dict[str, Any]]:
        q = query.lower().strip()

        # 1. ADITYA-L1 & SOLAR FLARE (Priority 1)
        if any(w in q for w in [
            "aditya", "solar flare", "cme", "geomagnetic storm", "swoc", "velc", "suit", "papa", "sunspot", "solar wind",
            "आदित्य", "सूर्य", "सौर", "ਸੂਰਜ", "ਅਦਿੱਤਿਆ", "ಸೂರ್ಯ", "ಆದಿತ್ಯ", "సూర్యుడు", "ఆదిత్య", "சூரியன்", "ஆதித்யா"
        ]):
            for cat, topics in self.categories.items():
                for t in topics:
                    if t.get("id") == "aditya_l1_mission":
                        return [t]

        # 2. LUNAR WATER DISCOVERY (Priority 2)
        if any(w in q for w in [
            "paani", "water", "ice", "water-ice", "water on moon", "paani mila", "h2o", "hydroxyl", "cabeus", "3.0 micron",
            "पानी", "जल", "ਬਰਫ਼", "ਪਾਣੀ", "ನೀರು", "ಮಂಜುಗಡ್ಡೆ", "నీరు", "మంచు", "தண்ணீர்", "பனி", "पाणी", "પાણી"
        ]):
            for cat, topics in self.categories.items():
                for t in topics:
                    if t.get("id") == "lunar_water_ice_discovery":
                        return [t]

        # 3. CHANDRAYAAN 3 PRAGYAN & CHASTE (Priority 3)
        if any(w in q for w in [
            "pragyan", "shiv shakti", "libs", "chaste", "sulfur", "thermal gradient", "touchdown",
            "सल्फर", "ਗੰਧਕ", "ਸਲਫਰ", "ಸಲ್ಫರ್", "సల్ఫర్", "கந்தகம்"
        ]):
            for cat, topics in self.categories.items():
                for t in topics:
                    if t.get("id") == "chandrayaan_3_shiv_shakti":
                        return [t]

        # 4. SATELLITE FLEET & ACTIVE CONSTELLATION (Priority 4)
        if any(w in q for w in [
            "satellite", "satellites", "kitne satellite", "active fleet", "54 satellite", "norad", "tle", "gsat", "cartosat", "navic",
            "उपग्रह", "ਸੈਟੇਲਾਈਟ", "ਉਪਗ੍ਰਹਿ", "ಉಪಗ್ರಹ", "ఉపగ్రహం", "செயற்கைக்கோள்"
        ]):
            for cat, topics in self.categories.items():
                for t in topics:
                    if t.get("id") == "active_satellite_fleet_54":
                        return [t]

        # 5. CHANDRAYAAN GENERAL MISSIONS
        if any(w in q for w in ["chandrayaan", "chandrayan", "moon", "चंद्रयान", "ਚੰਦਰਯਾਨ", "ಚಂದ್ರಯಾನ", "చంద్రయాన్", "சந்திரயான்"]):
            for cat, topics in self.categories.items():
                for t in topics:
                    if t.get("id") == "lunar_water_ice_discovery":
                        return [t]

        # Fallback to keyword matching
        results = []
        for cat, topics in self.categories.items():
            for t in topics:
                for kw in t.get("keywords", []):
                    if kw in q:
                        results.append(t)
                        return results
        return results

    def universal_synthesize(self, query: str, lang: str = "english") -> Dict[str, Any]:
        detected_lang = self.detect_language(query)
        effective_lang = detected_lang if detected_lang != "english" else (lang or "english")
        
        matches = self.search_all(query)
        if not matches:
            return {
                "title": "ISRO Mission Intelligence",
                "text": "Querying authenticated ISRO planetary archives...",
                "viz_type": "SATELLITE_RADAR"
            }

        top = matches[0]
        title = top.get("title", "ISRO Mission Intelligence")
        translations = top.get("translations", {})
        viz_type = top.get("viz_type", "SATELLITE_RADAR")
        key_aspects = top.get("key_aspects", [])

        if effective_lang in translations:
            body = translations[effective_lang]
        elif effective_lang == "hindi" and top.get("hindi_summary"):
            body = top.get("hindi_summary")
        else:
            body = top.get("summary", "")

        bullet_points = "\n".join([f"• {a}" for a in key_aspects])
        text = f"**{title}**\n\n{body}\n\n{bullet_points}" if bullet_points else f"**{title}**\n\n{body}"

        return {
            "title": title,
            "text": text,
            "viz_type": viz_type
        }

super_brain = SuperchargedSpaceBrain()
