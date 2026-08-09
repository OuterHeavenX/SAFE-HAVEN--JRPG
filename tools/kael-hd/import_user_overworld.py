from pathlib import Path
import json
from PIL import Image

ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'assets/characters/kael/user-source'
OUT=ROOT/'assets/characters/kael/hd/overworld/user'
MANIFEST=ROOT/'assets/characters/kael/hd/manifest.json'
DIRECTIONS={'south':'down','south-east':'down-right','east':'right','north-east':'up-right','north':'up','north-west':'up-left','west':'left','south-west':'down-left'}

OUT.mkdir(parents=True,exist_ok=True)
manifest=json.loads(MANIFEST.read_text(encoding='utf-8'))

def export(name,frames,fps,loop):
    images=[Image.open(path).convert('RGBA') for path in frames]
    if not images or any(im.size!=(256,256) for im in images):
        raise ValueError(f'{name}: expected 256x256 source frames')
    for index,im in enumerate(images):
        im.save(OUT/f'{name}_{index:02d}.png',optimize=True)
    sheet=Image.new('RGBA',(256*len(images),256),(0,0,0,0))
    for index,im in enumerate(images):sheet.alpha_composite(im,(index*256,0))
    sheet.save(OUT/f'{name}.png',optimize=True)
    manifest['animations'][name]={'frameWidth':256,'frameHeight':256,'frames':len(images),'fps':fps,'loop':loop,'anchor':{'x':128,'y':256},'sheet':f'assets/characters/kael/hd/overworld/user/{name}.png','framePattern':f'assets/characters/kael/hd/overworld/user/{name}_%02d.png','source':'user-authored'}

for source,direction in DIRECTIONS.items():
    export(f'idle_{direction}',[SOURCE/f'Idle/rotations/{source}.png'],1,True)
    export(f'walk_{direction}',sorted((SOURCE/f'Idle/animations/Walking/{source}').glob('frame_*.png')),10,True)

MANIFEST.write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
print('Imported 8 idle rotations and 64 walking frames without resizing')
