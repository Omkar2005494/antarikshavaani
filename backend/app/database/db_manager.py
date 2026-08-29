"""
AntarikshaVaani - Space Mission Database Query Engine (Authentic ISRO Datasets)
Author: Team Stackverse-labs
"""

import json
import os
from typing import Dict, List, Any, Optional

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PROJECT_ROOT = os.path.dirname(BACKEND_DIR)
DATA_DIR = os.path.join(PROJECT_ROOT, "data")

class SpaceDatabaseManager:
    def __init__(self, data_dir: str = DATA_DIR):
        self.data_dir = data_dir
        self.chandrayaan_db = self._load_json("chandrayaan_real_pds4_db.json")
        self.aditya_db = self._load_json("aditya_l1_real_swoc_db.json")
        self.satellite_db = self._load_json("isro_real_tle_fleet.json")
        self.knowledge_db = self._load_json("isro_scientific_rag_corpus.json")

    def _load_json(self, filename: str) -> Any:
        path = os.path.join(self.data_dir, filename)
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        return {}

    # 1. CHANDRAYAAN PDS4 LUNAR QUERIES
    def search_lunar_sites(self, keyword: Optional[str] = None, water_ice_only: bool = False) -> List[Dict[str, Any]]:
        results = []
        for site in self.chandrayaan_db.get("sites", []):
            if water_ice_only and not site.get("iirs_spectroscopy", {}).get("water_ice_detected"):
                continue
            if keyword:
                kw = keyword.lower()
                name_match = kw in site.get("name", "").lower() or kw in site.get("id", "").lower()
                region_match = kw in site.get("coordinates", {}).get("region", "").lower()
                pds4_match = kw in site.get("pds4_product_id", "").lower()
                elements = site.get("pragyan_libs_apxs_elemental_wt_pct", {}) or site.get("elemental_composition", {})
                elem_match = any(kw in str(k).lower() for k in elements.keys())
                if not (name_match or region_match or pds4_match or elem_match):
                    continue
            results.append(site)
        return results

    def get_lunar_site_by_name(self, name_or_id: str) -> Optional[Dict[str, Any]]:
        target = name_or_id.lower()
        for site in self.chandrayaan_db.get("sites", []):
            if target in site["name"].lower() or target in site["id"].lower():
                return site
        return None

    # 2. ADITYA-L1 SWOC SPACE WEATHER QUERIES
    def get_recent_solar_flares(self, flare_class_prefix: Optional[str] = None) -> List[Dict[str, Any]]:
        events = self.aditya_db.get("recent_solar_events", [])
        if not flare_class_prefix:
            return events
        prefix = flare_class_prefix.upper()
        return [e for e in events if e.get("flare_classification", "").startswith(prefix)]

    # 3. SATELLITE FLEET & NORAD TLE QUERIES
    def search_satellites(self, query: str = "") -> List[Dict[str, Any]]:
        q = query.lower()
        results = []
        for sat in self.satellite_db.get("satellites", []):
            if not q or (q in sat["name"].lower() or q in sat["orbit_type"].lower() or q in str(sat["norad_id"])):
                results.append(sat)
        return results

    def get_satellite_fleet_summary(self) -> Dict[str, Any]:
        sats = self.satellite_db.get("satellites", [])
        return {
            "total_active_satellites": self.satellite_db.get("total_active_satellites", len(sats)),
            "catalog_source": self.satellite_db.get("catalog_source"),
            "last_sync": self.satellite_db.get("last_ephemeris_sync"),
            "satellites_indexed": len(sats)
        }

    # 4. RAG KNOWLEDGE BASE RETRIEVAL
    def search_knowledge_base(self, query: str, limit: int = 3) -> List[Dict[str, Any]]:
        query_words = set(query.lower().split())
        scored_docs = []
        if isinstance(self.knowledge_db, list):
            for doc in self.knowledge_db:
                score = 0
                doc_text = (doc.get("title", "") + " " + " ".join(doc.get("keywords", [])) + " " + doc.get("abstract", "")).lower()
                for word in query_words:
                    if len(word) > 2 and word in doc_text:
                        score += 1
                if score > 0:
                    scored_docs.append((score, doc))
            scored_docs.sort(key=lambda x: x[0], reverse=True)
            return [doc for score, doc in scored_docs[:limit]]
        return []

# Global Instance
db_manager = SpaceDatabaseManager()
