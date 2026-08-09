# Kael HD asset pipeline

The authoritative overworld artwork is preserved byte-for-byte under
`assets/characters/kael/user-source/`. Generated runtime sheets and individual
frames live in `assets/characters/kael/hd/overworld/user/`.

To rebuild the complete library, run the base builder first and the user import
last so the authored idle and walking animations remain authoritative:

```powershell
python tools/kael-hd/build_assets.py
python tools/kael-hd/import_user_overworld.py
python tools/kael-hd/validate_assets.py
```

The import does not resize, interpolate, crop, or recenter the supplied 256 px
RGBA frames. Battle animations remain in the existing HD directories because
the supplied archive contains overworld idle and walking artwork only.
