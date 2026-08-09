from pathlib import Path
import json, sys
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
manifest_path = ROOT / "assets/characters/kael/hd/manifest.json"
data = json.loads(manifest_path.read_text(encoding="utf-8"))
errors, warnings, checked, total = [], [], 0, 0

for name, anim in data["animations"].items():
    fw, fh, count = anim["frameWidth"], anim["frameHeight"], anim["frames"]
    sheet = Image.open(ROOT / anim["sheet"])
    if sheet.mode != "RGBA": errors.append(f"{name}: sheet mode {sheet.mode}, expected RGBA")
    if sheet.size != (fw * count, fh): errors.append(f"{name}: sheet {sheet.size}, expected {(fw*count, fh)}")
    for i in range(count):
        p = ROOT / (anim["framePattern"] % i)
        if not p.exists(): errors.append(f"{name}: missing {p}"); continue
        im = Image.open(p)
        checked += 1; total += fw * fh
        if im.size != (fw, fh): errors.append(f"{name}[{i}]: {im.size}")
        if im.mode != "RGBA": errors.append(f"{name}[{i}]: mode {im.mode}")
        alpha = im.getchannel("A")
        bbox = alpha.getbbox()
        if not bbox: errors.append(f"{name}[{i}]: empty frame"); continue
        if alpha.getpixel((0, 0)) != 0: errors.append(f"{name}[{i}]: corner not transparent")
        if any(a and g > 35 and g > r * 1.15 and g > b * 1.18 for r, g, b, a in im.get_flattened_data()):
            errors.append(f"{name}[{i}]: chroma-key fringe remains")
        if bbox[0] < 1 or bbox[2] > fw - 1 or bbox[1] < 1: warnings.append(f"{name}[{i}]: tight edge {bbox}")
        # All normalized frames use the same sole/ground baseline.
        if bbox[3] != fh - 2: errors.append(f"{name}[{i}]: baseline {bbox[3]}, expected {fh-2}")

print(json.dumps({"animations": len(data["animations"]), "frames": checked, "errors": errors, "warnings": warnings[:30]}, indent=2))
sys.exit(1 if errors else 0)
