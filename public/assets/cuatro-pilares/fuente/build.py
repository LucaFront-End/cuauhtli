"""Rebuild the four standalone HTML animations. Python 3; no extra packages.

Run from any directory: python3 path/to/fuente/build.py
The output is the parent folder, beside the original delivered assets.
"""
from pathlib import Path
import base64

root = Path(__file__).resolve().parent
out = root.parent
names = [
    ('01-acceso-facial', 'Acceso facial y torniquete'),
    ('02-jornada-horas-extra', 'Jornada y horas extra'),
    ('03-boveda-criptografica', 'Bóveda e integridad documental'),
    ('04-red-multisede', 'Red de sedes y control centralizado'),
]
for i, (slug, title) in enumerate(names, 1):
    html = (root / 'template.html').read_text(encoding='utf-8')
    html = html.replace('__TITLE__', title).replace('__SLUG__', slug)
    html = html.replace('/*__THREE__*/', (root / 'vendor/three.min.js').read_text(encoding='utf-8'))
    html = html.replace('/*__FACE__*/', (root / 'face-geometry.js').read_text(encoding='utf-8') if i == 1 else '')
    html = html.replace('/*__PILLAR__*/', (root / f'pillar-{i:02d}.js').read_text(encoding='utf-8'))
    html = html.replace('/*__CORE__*/', (root / 'core.js').read_text(encoding='utf-8'))
    poster = out / f'{slug}-transparente.png'
    html = html.replace('__POSTER__', base64.b64encode(poster.read_bytes()).decode('ascii') if poster.exists() else '')
    target = out / f'{slug}.html'
    target.write_text(html, encoding='utf-8')
    print(target.name)
