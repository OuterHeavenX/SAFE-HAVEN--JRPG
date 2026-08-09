# Kael HD pixel sprites

Production-candidate sprites generated from the authoritative Kael reference. Existing runtime sprites remain unchanged as fallback.

- Overworld cells: 64×80 RGBA PNG
- Battle cells: 128×160 RGBA PNG
- Anchor: integer bottom-center, two pixels above the frame edge
- Filtering: nearest-neighbor only; render with `imageSmoothingEnabled = false` and `image-rendering: pixelated`
- `manifest.json` is the integration contract.
- `preview.html` is a non-runtime visual inspection page.

Runtime selection is exposed through `window.SafeHavenKaelSprites`. The authoritative family is `hd`, and major-level family swapping is temporarily pinned off through `config.enableMajorFamilySwap`. Future HD variants can be registered with `registerHDMajorSet(major, set)` and enabled with `setMajorFamilySwapping(true)` without changing progression or save data.

Rebuild with `python tools/kael-hd/build_assets.py`; validate with `python tools/kael-hd/validate_assets.py`.
