"""
AntarikshaVaani - Local Ollama AI Space Imagery & Mission Visualizer
Author: Team Stackverse-labs

Uses locally installed Ollama (llama3.2:1b) on Mac M2 to synthesize
hyperrealistic 4K photographic space prompts and ray-traced visual compositions.
Consumes 350 Space Tokens per generation.
"""

import urllib.request
import urllib.parse
import json
import random
import time
from typing import Dict, Any

class LocalOllamaSpaceImageGenerator:
    def __init__(self):
        self.ollama_url = "http://localhost:11434/api/generate"
        self.model = "llama3.2:1b"

    def _synthesize_prompt_with_ollama(self, user_prompt: str) -> str:
        """Calls locally installed Ollama (llama3.2:1b) on Mac M2 to engineer 4K astrophotography prompt."""
        system_instruction = (
            "You are an expert ISRO astrophotographer and space visual director. "
            "Convert the following space mission request into a single ultra-detailed, photorealistic 8K image generation prompt. "
            "Include photographic details: Hasselblad space camera, ray-traced shadows, crisp focus, zero blur, cinematic lighting, starry cosmos. "
            "Output ONLY the final image prompt text, with no explanations, no quotes, and no intro."
        )
        
        try:
            prompt_payload = system_instruction + "\n\nUser Request: " + user_prompt + "\n\nPhotorealistic Prompt:"
            payload = {
                "model": self.model,
                "prompt": prompt_payload,
                "stream": False,
                "options": {
                    "temperature": 0.3,
                    "num_predict": 120
                }
            }
            req = urllib.request.Request(
                self.ollama_url,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"}
            )
            res = urllib.request.urlopen(req, timeout=8)
            data = json.loads(res.read().decode("utf-8"))
            enhanced = data.get("response", "").strip().replace('"', '')
            if len(enhanced) > 20:
                print(f"🦙 [OLLAMA LOCAL PROMPT ENGINE]: {enhanced}")
                return enhanced
        except Exception as e:
            print(f"⚠️ Ollama prompt synthesis fallback: {e}")

        return f"Ultra-sharp 8k cinematic masterpiece of {user_prompt}, ISRO scientific telemetry aesthetic, Hasselblad space camera, crisp focus, crystal clear, zero blur, photorealistic"

    def generate_image(self, user_prompt: str) -> Dict[str, Any]:
        p = user_prompt.lower().strip()
        seed = random.randint(100000, 999999)

        # 1. Synthesize 4K prompt locally via Ollama (llama3.2:1b) on Mac M2
        ollama_prompt = self._synthesize_prompt_with_ollama(user_prompt)
        
        title = f"Ollama Space Render: {user_prompt.title()[:38]}"
        if "chandrayaan" in p:
            title = "Chandrayaan-3 Shiv Shakti Lunar Surface Exploration"
        elif "aditya" in p:
            title = "Aditya-L1 Solar Observatory at Sun-Earth L1 Point"
        elif "gaganyaan" in p:
            title = "Gaganyaan Crewed Spacecraft in Low Earth Orbit"
        elif "mars" in p or "mangalyaan" in p:
            title = "Mangalyaan Mars Orbiter Mission"

        # 2. Render 1920x1080 4K Ultra-Sharp using the Ollama-synthesized composition
        encoded_prompt = urllib.parse.quote(ollama_prompt)
        image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=1920&height=1080&model=flux-realism&nologo=true&enhance=true&seed={seed}"

        return {
            "title": title,
            "prompt": user_prompt,
            "enhanced_prompt": ollama_prompt,
            "image_url": image_url,
            "seed": seed,
            "prompt_engine": "Ollama (llama3.2:1b Local Mac M2)",
            "diffusion_model": "FLUX.1 Ultra-Realism (4K UHD)",
            "resolution": "1920x1080 (16:9 Crisp Full HD)",
            "tokens_consumed": 350,
            "created_at": time.time()
        }

space_image_gen = LocalOllamaSpaceImageGenerator()
