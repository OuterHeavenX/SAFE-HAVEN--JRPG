from pathlib import Path
import json
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "assets/characters/kael/hd"
SRC = OUT / "sources"
RESAMPLE = Image.Resampling.NEAREST


def remove_key(im):
    im = im.convert("RGBA")
    px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, _ = px[x, y]
            # Generated key is vivid green with small compression/color variations.
            if g > 35 and g > r * 1.15 and g > b * 1.18:
                px[x, y] = (0, 0, 0, 0)
    # Atlas generators occasionally leak a disconnected sliver from a neighboring
    # cell. Retain the principal 8-connected sprite component only.
    alpha = im.getchannel("A")
    seen, components = set(), []
    for y in range(im.height):
        for x in range(im.width):
            if (x, y) in seen or alpha.getpixel((x, y)) == 0:
                continue
            stack, component = [(x, y)], []
            seen.add((x, y))
            while stack:
                cx, cy = stack.pop(); component.append((cx, cy))
                for ny in range(max(0, cy - 1), min(im.height, cy + 2)):
                    for nx in range(max(0, cx - 1), min(im.width, cx + 2)):
                        if (nx, ny) not in seen and alpha.getpixel((nx, ny)):
                            seen.add((nx, ny)); stack.append((nx, ny))
            components.append(component)
    if components:
        keep = set(max(components, key=len))
        for y in range(im.height):
            for x in range(im.width):
                if alpha.getpixel((x, y)) and (x, y) not in keep:
                    px[x, y] = (0, 0, 0, 0)
    return im


def grid_cell(im, cols, rows, col, row):
    x0, x1 = round(col * im.width / cols), round((col + 1) * im.width / cols)
    y0, y1 = round(row * im.height / rows), round((row + 1) * im.height / rows)
    return remove_key(im.crop((x0, y0, x1, y1)))


def normalize(cell, size, margin):
    bbox = cell.getchannel("A").getbbox()
    canvas = Image.new("RGBA", size, (0, 0, 0, 0))
    if not bbox:
        return canvas
    art = cell.crop(bbox)
    maxw, maxh = size[0] - margin * 2, size[1] - margin * 2
    scale = min(maxw / art.width, maxh / art.height)
    nw, nh = max(1, round(art.width * scale)), max(1, round(art.height * scale))
    art = art.resize((nw, nh), RESAMPLE)
    # Integer bottom-center anchor; fixed two-pixel sole clearance.
    x, y = (size[0] - nw) // 2, size[1] - 2 - nh
    canvas.alpha_composite(art, (x, y))
    return canvas


manifest = {"schemaVersion": 1, "character": "kael", "standard": "safehaven-hd-pixel-v1", "animations": {}}


def export(name, frames, size, fps, loop, folder, anchor=None):
    dest = OUT / folder
    dest.mkdir(parents=True, exist_ok=True)
    safe = name.replace("/", "_")
    for i, frame in enumerate(frames):
        frame.save(dest / f"{safe}_{i:02d}.png", optimize=True)
    sheet = Image.new("RGBA", (size[0] * len(frames), size[1]), (0, 0, 0, 0))
    for i, frame in enumerate(frames):
        sheet.alpha_composite(frame, (i * size[0], 0))
    sheet_path = dest / f"{safe}.png"
    sheet.save(sheet_path, optimize=True)
    manifest["animations"][name] = {
        "frameWidth": size[0], "frameHeight": size[1], "frames": len(frames),
        "fps": fps, "loop": loop, "anchor": anchor or {"x": size[0] // 2, "y": size[1] - 2},
        "sheet": sheet_path.relative_to(ROOT).as_posix(),
        "framePattern": (dest / f"{safe}_%02d.png").relative_to(ROOT).as_posix()
    }


def row_frames(path, cols, rows, row, count, size, margin=2, sample=None):
    im = Image.open(path)
    indexes = sample or list(range(count))
    return [normalize(grid_cell(im, cols, rows, i, row), size, margin) for i in indexes]


def sequence_frames(path, cols, rows, count, size, margin=2):
    im = Image.open(path)
    return [normalize(grid_cell(im, cols, rows, i % cols, i // cols), size, margin) for i in range(count)]


def shared_sequence_frames(path, cols, rows, positions, size, margin=2):
    """Preserve inter-frame motion by applying one crop and scale to a full sequence."""
    im = Image.open(path)
    cells = [grid_cell(im, cols, rows, col, row) for col, row in positions]
    boxes = [cell.getchannel("A").getbbox() for cell in cells]
    boxes = [box for box in boxes if box]
    if not boxes:
        return [Image.new("RGBA", size, (0, 0, 0, 0)) for _ in cells]
    maxw=max(b[2]-b[0] for b in boxes);maxh=max(b[3]-b[1] for b in boxes)
    scale = min((size[0] - margin * 2) / maxw, (size[1] - margin * 2) / maxh)
    frames = []
    for cell,box in zip(cells,[cell.getchannel("A").getbbox() for cell in cells]):
        if not box:
            frames.append(Image.new("RGBA",size,(0,0,0,0)));continue
        art=cell.crop(box);nw=max(1,round(art.width*scale));nh=max(1,round(art.height*scale));art=art.resize((nw,nh),RESAMPLE)
        canvas = Image.new("RGBA", size, (0, 0, 0, 0))
        canvas.alpha_composite(art, ((size[0] - nw) // 2, size[1] - 2 - nh))
        frames.append(canvas)
    return frames


# Overworld: 64x80 exact cells.
run = SRC / "run_source.png"
dirs = ["down", "left", "right", "up"]
walk_sources = {direction: SRC / f"walk_{direction}_v2_source.png" for direction in dirs}
idle_source = SRC / "idle_v2_source.png"
for row, direction in enumerate(dirs):
    wf = shared_sequence_frames(walk_sources[direction], 4, 2, [(i % 4, i // 4) for i in range(8)], (64, 80), 2)
    idle = shared_sequence_frames(idle_source, 6, 4, [(i, row) for i in range(6)], (64, 80), 2)
    export(f"idle_{direction}", idle, (64, 80), 6, True, "overworld/idle")
    export(f"walk_{direction}", wf, (64, 80), 10, True, "overworld/walk")
    export(f"run_{direction}", row_frames(run, 8, 4, row, 8, (64, 80), 2), (64, 80), 12, True, "overworld/run")

actions = SRC / "actions_source.png"
for row, name in enumerate(["interact", "item_pickup", "surprised", "hurt", "kneel", "sword_draw", "sword_sheathe"]):
    export(name, row_frames(actions, 6, 7, row, 6, (64, 80), 2), (64, 80), 10, False, "overworld/actions")

# Battle: 128x160 exact cells. Subsample hold-heavy 12/16-frame source rows where requested.
core = SRC / "battle_core_source.png"
core_specs = [
    ("battle_idle", 0, [0, 2, 4, 6, 8, 10], 6, True, "battle/idle"),
    ("battle_ready", 1, [0, 2, 4, 6, 8, 10], 8, True, "battle/ready"),
    ("heavy_attack", 3, list(range(12)), 12, False, "battle/heavy_attack"),
    ("magic", 4, list(range(10)), 12, False, "battle/magic"),
    ("defend", 5, [0, 2, 4, 6, 8, 10], 8, False, "battle/defend"),
]
for name, row, indexes, fps, loop, folder in core_specs:
    export(name, row_frames(core, 12, 6, row, len(indexes), (128, 160), 4, indexes), (128, 160), fps, loop, folder)
export("attack", sequence_frames(SRC / "attack_source.png", 5, 2, 10, (128, 160), 4), (128, 160), 14, False, "battle/attack")

states = SRC / "battle_state_source.png"
state_specs = [
    ("battle_hurt", 0, [0, 1, 2, 3, 5, 7], 12, False, "battle/hurt"),
    ("critical", 1, [0, 2, 4, 6, 8, 10], 6, True, "battle/critical"),
    ("victory", 3, list(range(12)), 10, False, "battle/victory"),
    ("levelup", 4, list(range(16)), 12, False, "battle/levelup"),
]
for name, row, indexes, fps, loop, folder in state_specs:
    export(name, row_frames(states, 16, 5, row, len(indexes), (128, 160), 4, indexes), (128, 160), fps, loop, folder)
export("ko", sequence_frames(SRC / "ko_source.png", 5, 2, 10, (128, 160), 4), (128, 160), 10, False, "battle/ko")

(OUT / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
print(f"Exported {sum(v['frames'] for v in manifest['animations'].values())} frames across {len(manifest['animations'])} animations")
