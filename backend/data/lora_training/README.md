# 🛰️ AntarikshaVaani - Custom ISRO LoRA Training Kit
**Organization:** Stackverse-labs (Dayananda Sagar University)

This directory contains the dataset, prompt captions, and Google Colab notebook to train a custom **FLUX.1 / SDXL LoRA** for authentic Indian Spacecraft.

## 📁 Directory Structure
```
lora_training/
├── images/                  # Reference photos of ISRO spacecraft
├── captions/                # Matching .txt trigger captions
├── dataset_manifest.json    # Metadata and trigger tokens
└── train_isro_flux_lora.ipynb # 1-Click Google Colab training notebook
```

## 🏷️ Active Trigger Tokens
- `isro_vikram_lander`: Chandrayaan-3 lander with gold MLI foil & 4 thrusters
- `isro_pragyan_rover`: 6-wheel rocker-bogie rover with solar panel
- `isro_gaganyaan_capsule`: Indian crew module orbiting Earth
- `isro_aditya_l1`: L1 halo orbit solar satellite with VELC & SUIT
- `isro_antariksh_station`: Bharatiya Antariksh Station (BAS)

## 🚀 How to Train on Google Colab (Free)
1. Open [Google Colab](https://colab.research.google.com).
2. Upload `train_isro_flux_lora.ipynb`.
3. Set Runtime to **T4 GPU** (Free).
4. Run all cells — within ~25 minutes, it outputs `isro_spacecraft_flux_lora.safetensors`!
