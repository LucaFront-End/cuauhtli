from pathlib import Path
import base64

root = Path(__file__).parent
out = root.parent
out.mkdir(exist_ok=True)
html = (root/'template.html').read_text()
html = html.replace('/*__THREE__*/', (root/'vendor/three.min.js').read_text())
html = html.replace('/*__FACE__*/', (root/'face-geometry.js').read_text())
html = html.replace('/*__SCENE__*/', (root/'scene.js').read_text())
poster = out/'biometrico-transparente.png'
html = html.replace('/*__POSTER__*/', base64.b64encode(poster.read_bytes()).decode() if poster.exists() else '')
(out/'animacion-biometrica.html').write_text(html)
print(out/'animacion-biometrica.html', len(html.encode()))
