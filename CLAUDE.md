# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a web-based user study platform for evaluating low-light image enhancement algorithms. Participants rank 6 different enhancement methods (A, B, C, D, E, F) on a scale of 1-6 across multiple test images. The platform handles randomization, data collection, and comprehensive analysis.

## Architecture

### Frontend Components
- **index.html**: Main study interface with Chinese title support
- **script.js**: Core ranking logic with randomization, zoom functionality, and validation (387 lines)
- **style.css**: Responsive grid layout with synchronized zoom/pan features

### Backend/Analysis
- **analyze_results.py**: Statistical analysis tool for individual or aggregate results
- **gen_list.py**: Generates imagelist.json from imgs/ folder structure
- **clip_image.py**: Image preprocessing utility for cropping

### Data Structure
- **imgs/**: Image storage organized by method folders (A, B, C, D, E, F)
- **imagelist.json**: Configuration file listing test images
- **result/**: JSON files containing participant rankings

## Common Development Commands

### Setup New Study
```bash
# 1. Add images to imgs/A/, imgs/B/, imgs/C/, imgs/D/
# 2. Generate image list
python gen_list.py

# 3. Serve the web interface (any HTTP server)
python -m http.server 8000
```

### Data Analysis
```bash
# Run statistical analysis
python analyze_results.py
# Choose option 1 for single file analysis or 2 for combined analysis
```

### Image Preprocessing
```bash
# Crop images to consistent dimensions
python clip_image.py
```

## Key Configuration Points

### Adding New Enhancement Methods
1. Create new folder in `imgs/` (already supports A, B, C, D, E, F)
2. Update `METHODS` array in script.js:232
3. Update `METHODS` array in analyze_results.py:8
4. Regenerate imagelist.json with `gen_list.py`

### Current Method Mapping
- A: GSAD
- B: RetinexFormer
- C: CID
- D: "Ours" (researcher's method)
- E: LightenDiff
- F: Method6

### Test Images
Currently using 8 images: 00.png, 01.png, 12.png, 26.png, 49.png, 51.png, 54.png, 63.png

## Data Format

Results are stored as JSON with structure:
```json
{
  "userId": "user_randomId",
  "studyDate": "ISO timestamp",
  "results": [
    {
      "imageName": "00.png",
      "ranking": {"A": 2, "B": 4, "C": 3, "D": 1}
    }
  ]
}
```

## Study Features

- **Randomization**: Both image order and method positions are randomized per participant
- **Validation**: Ensures unique rankings (1-6) with visual feedback
- **Zoom Functionality**: Click any image to zoom, synchronized pan across all methods
- **Progress Tracking**: Shows current position in study
- **Deselection**: Users can uncheck radio buttons to change rankings

## Analysis Capabilities

The analyze_results.py script provides:
- Average ranking per method
- Top1/Top2 percentage calculations
- Rank distribution visualization with matplotlib
- Support for both individual and aggregate analysis

## Dependencies

**Python**: pandas, matplotlib, PIL (Pillow), json, os
**Frontend**: Vanilla JavaScript, CSS Grid, HTML5

No package.json or requirements.txt - dependencies managed manually.