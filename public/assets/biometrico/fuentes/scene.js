/* Original biometric diorama. Three.js r160.1. No network requests or tracking. */
(() => {
  'use strict';
  const host = document.getElementById('biometric');
  const params = new URLSearchParams(location.search);
  const capture = params.has('capture');
  const embedded = params.has('embed') || capture;
  const CYCLE = 8;
  const T = THREE;
  const cyan = new T.Color('#4ee6ff');
  const green = new T.Color('#64f5ab');
  let transparent = params.get('background') === 'transparent';
  let paused = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let runningTime = paused ? 5.5 : .7;
  let last = performance.now(), visible = true;
  let w = 1, h = 1;
  if (embedded) document.body.classList.add('embedded');
  document.body.classList.toggle('transparent', transparent);
  document.documentElement.classList.toggle('transparent', transparent);

  const scene = new T.Scene();
  const camera = new T.OrthographicCamera(-3.0,3.0,3.0,-3.0,.1,60);
  const target = new T.Vector3(0,1.10,0);
  // Orthographic camera, exactly 30 degrees of elevation.
  camera.position.set(-8.0,7.632,8.0);
  camera.lookAt(target);
  let renderer;
  try {
    renderer = new T.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});
  } catch (error) {
    document.getElementById('loading').remove();
    document.getElementById('fallback').hidden=false;
    document.querySelector('.tools').style.display='none';
    return;
  }
  renderer.setPixelRatio(capture ? 1 : Math.min(devicePixelRatio,2));
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.setClearColor(0x000000,transparent?0:1);
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=T.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate=false;
  renderer.domElement.setAttribute('role','img');
  renderer.domElement.setAttribute('aria-label','Terminal biométrico isométrico de grafito. Un láser cian escanea un rostro poligonal y un check verde confirma la identidad.');
  host.appendChild(renderer.domElement);

  const root = new T.Group();
  scene.add(root);
  const std = (color,rough=.45,metal=.3) => new T.MeshStandardMaterial({color,roughness:rough,metalness:metal,flatShading:true});
  const matte = std('#242b33',.72,.12);
  const baseMat = std('#111923',.45,.55);
  const alloy = std('#34404c',.3,.72);
  const edgeMat = std('#506378',.27,.78);
  const carbon = std('#080e16',.34,.28);
  const dark = std('#03070b',.22,.3);
  const glow = (color,intensity=2) => new T.MeshStandardMaterial({color,emissive:color,emissiveIntensity:intensity,roughness:.35,metalness:.1,toneMapped:true});
  const cyanGlow=glow('#53e5ff',2.1), greenGlow=glow('#60f8ab',2);
  const faintGlow=glow('#164750',.6);

  function mesh(geometry,material,parent=root){
    const m=new T.Mesh(geometry,material);parent.add(m);m.castShadow=true;m.receiveShadow=true;return m;
  }
  function box(x,y,z,sx,sy,sz,mat,parent=root){
    const m=mesh(new T.BoxGeometry(sx,sy,sz),mat,parent);m.position.set(x,y,z);return m;
  }
  function shapeRect(width,height,cut){
    const s=new T.Shape(),x=width/2,y=height/2,c=cut;
    s.moveTo(-x+c,-y);s.lineTo(x-c,-y);s.lineTo(x,-y+c);s.lineTo(x,y-c);
    s.lineTo(x-c,y);s.lineTo(-x+c,y);s.lineTo(-x,y-c);s.lineTo(-x,-y+c);s.closePath();return s;
  }
  function bevelPlate(width,height,depth,cut,bevel,mat,parent=root){
    const g=new T.ExtrudeGeometry(shapeRect(width-2*bevel,height-2*bevel,cut),{depth:depth-2*bevel,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:bevel,bevelThickness:bevel,curveSegments:1});
    g.translate(0,0,-(depth-2*bevel)/2);return mesh(g,mat,parent);
  }
  function lines(points,color='#3ee2fc',opacity=.45,parent=root){
    const m=new T.Line(new T.BufferGeometry().setFromPoints(points.map(v=>new T.Vector3(...v))),new T.LineBasicMaterial({color,transparent:true,opacity,depthWrite:false}));parent.add(m);return m;
  }
  function cylinder(r,depth,mat,parent,segments=24){
    const m=mesh(new T.CylinderGeometry(r,r,depth,segments),mat,parent);m.rotation.x=Math.PI/2;return m;
  }
  function ring(r,thickness,mat,parent){
    return mesh(new T.TorusGeometry(r,thickness,5,32),mat,parent);
  }
  function label(text,width,height,fontSize,color='#9bb3c4',weight=500){
    const c=document.createElement('canvas');c.width=1024;c.height=Math.round(1024*height/width);
    const ctx=c.getContext('2d');ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.font=weight+' '+fontSize+'px Arial, sans-serif';ctx.fillText(text,c.width/2,c.height/2);
    const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=4;
    const m=mesh(new T.PlaneGeometry(width,height),new T.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false,toneMapped:false}),root);
    m.castShadow=false;m.receiveShadow=false;return m;
  }

  // A deliberately small architectural slice anchors the object.
  const foundation=bevelPlate(3.82,2.95,.22,.20,.055,baseMat);
  foundation.rotation.x=-Math.PI/2;foundation.position.set(0,.11,.03);
  const top=bevelPlate(3.66,2.79,.035,.18,.015,std('#151d27',.68,.24));
  top.rotation.x=-Math.PI/2;top.position.set(0,.233,.03);
  function contactShadow(x,z,width,height,opacity){
    const c=document.createElement('canvas');c.width=128;c.height=128;const ctx=c.getContext('2d');
    const gradient=ctx.createRadialGradient(64,64,18,64,64,64);gradient.addColorStop(0,'rgba(0,0,0,1)');gradient.addColorStop(.55,'rgba(0,0,0,.55)');gradient.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);
    const texture=new T.CanvasTexture(c);const shadow=mesh(new T.PlaneGeometry(width,height),new T.MeshBasicMaterial({map:texture,transparent:true,opacity,depthWrite:false,toneMapped:false}));shadow.rotation.x=-Math.PI/2;shadow.position.set(x,.255,z);shadow.castShadow=false;return shadow;
  }
  contactShadow(.9,.54,1.85,1.85,.65);contactShadow(-.73,-.63,2.5,.90,.8);
  const wall=bevelPlate(1.96,2.79,.30,.16,.045,matte);
  wall.position.set(-.73,1.655,-.87);
  const wallFace=bevelPlate(1.8,2.62,.022,.12,.007,std('#252e38',.82,.1));
  wallFace.position.set(-.73,1.655,-.705);
  // Recessed architectural joins, restrained and non-luminous.
  lines([[-1.43,.42,-.689],[-1.43,2.9,-.689]],'#111a25',.75);
  lines([[-.03,.42,-.689],[-.03,2.9,-.689]],'#405165',.45);
  box(-.73,.31,-.60,1.6,.09,.28,carbon);

  const terminal=new T.Group();terminal.position.set(-.73,1.67,-.42);root.add(terminal);
  const spacer=bevelPlate(.85,1.65,.14,.08,.018,carbon,terminal);spacer.position.z=-.19;
  const chassis=bevelPlate(1.12,1.94,.34,.10,.045,alloy,terminal);
  const trim=bevelPlate(1.055,1.87,.018,.085,.007,edgeMat,terminal);trim.position.z=.182;
  const fascia=bevelPlate(1.015,1.83,.026,.08,.009,carbon,terminal);fascia.position.z=.199;
  // Side heat sink seams and tiny concealed fastening points.
  for(let i=0;i<6;i++)box(-.557,-.34+i*.095,-.012,.014,.045,.17,dark,terminal);
  for(const x of [-.465,.465])for(const y of [-.805,.805]){
    const screw=cylinder(.016,.009,dark,terminal,8);screw.position.set(x,y,.219);
    box(x,y,.225,.017,.003,.002,edgeMat,terminal);
  }
  // Camera, concentric beveled lens, and an auxiliary IR emitter.
  const lensMount=cylinder(.115,.025,edgeMat,terminal,24);lensMount.position.set(0,.692,.23);
  const lensInner=cylinder(.094,.034,dark,terminal,24);lensInner.position.set(0,.692,.246);
  const lensGlass=cylinder(.068,.009,std('#101b34',.09,.72),terminal,24);lensGlass.position.set(0,.692,.267);
  const lensRing=ring(.079,.004,cyanGlow,terminal);lensRing.position.set(0,.692,.271);
  const iris=cylinder(.033,.012,std('#0a2540',.06,.64),terminal,20);iris.position.set(0,.692,.278);
  const glint=mesh(new T.CircleGeometry(.012,12),new T.MeshBasicMaterial({color:'#a4eaff'}),terminal);glint.position.set(-.024,.716,.286);
  for(const x of [-.24,.24]){
    const ir=cylinder(.028,.012,edgeMat,terminal,12);ir.position.set(x,.692,.227);
    const dot=cylinder(.015,.014,x<0?glow('#65c5de',.7):dark,terminal,12);dot.position.set(x,.692,.237);
  }

  // Display: original canvas artwork, not a downloaded texture.
  const screenCanvas=document.createElement('canvas');screenCanvas.width=512;screenCanvas.height=640;
  const sx=screenCanvas.getContext('2d');
  const screenTex=new T.CanvasTexture(screenCanvas);screenTex.colorSpace=T.SRGBColorSpace;screenTex.anisotropy=8;
  const screenMaterial=new T.MeshBasicMaterial({map:screenTex,toneMapped:false});
  const screen=mesh(new T.PlaneGeometry(.81,1.013),screenMaterial,terminal);screen.position.set(0,-.006,.224);
  screen.castShadow=false;
  const screenBevel=bevelPlate(.864,1.066,.014,.025,.005,dark,terminal);screenBevel.position.set(0,-.006,.216);
  const screenBorder=lines([[-.41,-.52,.231],[-.41,.505,.231],[.41,.505,.231],[.41,-.52,.231],[-.41,-.52,.231]],'#3a566b',.50,terminal);
  // Faceted fingerprint sensor and a subtle lower status rail.
  const fpFrame=bevelPlate(.32,.205,.023,.035,.006,edgeMat,terminal);fpFrame.position.set(0,-.69,.229);
  const fpGlass=bevelPlate(.285,.17,.025,.029,.003,dark,terminal);fpGlass.position.set(0,-.69,.242);
  for(let j=0;j<6;j++){
    const pts=[];for(let k=0;k<=14;k++){const a=.25+(Math.PI*1.52)*k/14;const r=.019+j*.012;pts.push([r*Math.cos(a),-.69+r*.65*Math.sin(a),.258]);}
    lines(pts,'#36c9dd',.28,terminal);
  }
  const status=box(0,-.861,.224,.44,.015,.012,cyanGlow.clone(),terminal);
  const smallBrand=label('B I O   /   0 1',.34,.04,56,'#8ba0b2',500);terminal.add(smallBrand);smallBrand.position.set(0,-.565,.232);

  // Etched floor circuits follow the isometric base, without filling the scene.
  const tracks=[
    [[-1.45,.257,.16],[-1.45,.257,.72],[-.87,.257,1.12],[-.10,.257,1.12]],
    [[-.31,.257,-.48],[.10,.257,-.48],[.45,.257,-.09],[1.37,.257,-.09]],
    [[.02,.257,1.25],[.49,.257,1.25],[.87,.257,.93]],
    [[1.52,.257,.96],[1.52,.257,-.68],[1.08,.257,-1.12]]
  ];
  tracks.forEach(p=>lines(p,'#397b8c',.28));
  for(const p of [[-.10,.261,1.12],[1.37,.261,-.09],[.87,.261,.93]]){
    const d=mesh(new T.CylinderGeometry(.024,.024,.008,6),faintGlow);d.position.set(...p);
  }
  // Low projection plinth, with three quiet concentric faceted rings.
  const projectionBase=mesh(new T.CylinderGeometry(.70,.72,.055,12),std('#101c2a',.45,.55));projectionBase.position.set(.90,.278,.54);
  const rings=[];
  for(let i=0;i<3;i++){
    const r=mesh(new T.RingGeometry(.40+i*.11,.405+i*.11,48),new T.MeshBasicMaterial({color:'#3bc5db',transparent:true,opacity:.16,side:T.DoubleSide,depthWrite:false}));
    r.rotation.x=-Math.PI/2;r.position.set(.9,.31+i*.001,.54);rings.push(r);
  }

  // A sculpted polygonal head; its actual geometry produces every triangular edge.
  const faceData=makeFaceGeometryData();
  const faceGeo=new T.BufferGeometry();faceGeo.setAttribute('position',new T.Float32BufferAttribute(faceData.positions,3));faceGeo.setIndex(faceData.indices);faceGeo.computeVertexNormals();
  const faceFlat=faceGeo.toNonIndexed();faceFlat.computeVertexNormals();
  const faceGroup=new T.Group();faceGroup.position.set(.90,1.84,.54);faceGroup.rotation.y=-.36;root.add(faceGroup);
  const uniforms={uTime:{value:0},uOpacity:{value:1},uScan:{value:.3},uReveal:{value:-1},uSuccess:{value:0},uScanning:{value:1}};
  const vert=`varying vec3 vP;varying vec3 vN;void main(){vP=position;vN=normal;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
  const faceMat=new T.ShaderMaterial({uniforms,vertexShader:vert,fragmentShader:`
    uniform float uOpacity,uScan,uReveal,uSuccess,uScanning;varying vec3 vP;varying vec3 vN;
    void main(){float reveal=smoothstep(uReveal-.07,uReveal+.07,vP.y);if(uOpacity*reveal<.01)discard;float band=exp(-abs(vP.y-uScan)*32.)*uScanning;
    float light=.12+.88*max(0.,dot(normalize(vN),normalize(vec3(-.8,.65,1.))));
    vec3 c=mix(vec3(.018,.19,.26),vec3(.02,.28,.16),uSuccess*.7);
    c=c*(.12+light*1.0)+vec3(.25,1.,1.15)*band*1.5;
    gl_FragColor=vec4(c,(.78+band*.20)*uOpacity*reveal);}
  `,transparent:true,depthWrite:true,side:T.FrontSide,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1});
  const face=mesh(faceFlat,faceMat,faceGroup);face.castShadow=false;face.receiveShadow=false;
  face.renderOrder=1;
  const wireMat=new T.ShaderMaterial({uniforms,vertexShader:`varying vec3 vP;void main(){vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`
    uniform float uOpacity,uScan,uReveal,uSuccess,uScanning;varying vec3 vP;
    void main(){float reveal=smoothstep(uReveal-.07,uReveal+.07,vP.y);float band=exp(-abs(vP.y-uScan)*32.)*uScanning;
    vec3 c=mix(vec3(.13,.78,.97),vec3(.20,1.,.53),uSuccess*.8);
    gl_FragColor=vec4(c*(.68+band*1.8),(.28+band*.72)*uOpacity*reveal);}
  `,transparent:true,depthWrite:false});
  const wire=new T.LineSegments(new T.WireframeGeometry(faceGeo),wireMat);faceGroup.add(wire);
  wire.renderOrder=2;
  // Selected vertices pulse as the scan passes; only a small number remain lit.
  const pointMat=new T.ShaderMaterial({uniforms:{...uniforms,uPixelRatio:{value:renderer.getPixelRatio()}},vertexShader:`
    uniform float uScan,uScanning,uPixelRatio;varying vec3 vP;varying float vBand;void main(){vP=position;vBand=exp(-abs(position.y-uScan)*24.)*uScanning;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_PointSize=(1.6+vBand*3.5)*uPixelRatio;}
  `,fragmentShader:`uniform float uOpacity,uReveal,uSuccess;varying vec3 vP;varying float vBand;void main(){vec2 p=gl_PointCoord-.5;if(dot(p,p)>.25)discard;
    float reveal=smoothstep(uReveal-.07,uReveal+.07,vP.y);gl_FragColor=vec4(mix(vec3(.4,1.,1.2),vec3(.45,1.2,.7),uSuccess),uOpacity*reveal*(.22+vBand*.78));}
  `,transparent:true,depthWrite:false});
  const nodes=new T.Points(faceGeo,pointMat);faceGroup.add(nodes);
  nodes.renderOrder=3;

  // Horizontal scanning sheet and its luminous leading perimeter.
  const scanGroup=new T.Group();root.add(scanGroup);
  const sheetGeo=new T.PlaneGeometry(1.5,1.18,1,1);
  const sheet=mesh(sheetGeo,new T.MeshBasicMaterial({color:'#4ee8ff',transparent:true,opacity:.07,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending}),scanGroup);
  sheet.rotation.x=-Math.PI/2;sheet.castShadow=false;
  const perimeter=lines([[-.75,0,-.59],[.75,0,-.59],[.75,0,.59],[-.75,0,.59],[-.75,0,-.59]],'#8cefff',.72,scanGroup);
  const scanLine=box(0,.001,.59,1.5,.008,.008,cyanGlow.clone(),scanGroup);scanLine.castShadow=false;
  // A handful of interior grid lines make the laser a mesh, not a solid slab.
  const gridLines=[];
  for(let i=-2;i<=2;i++)gridLines.push(lines([[i*.24,0,-.59],[i*.24,0,.59]],'#4ce9ff',.10,scanGroup));
  for(let i=-1;i<=1;i++)gridLines.push(lines([[-.75,0,i*.29],[.75,0,i*.29]],'#4ce9ff',.10,scanGroup));
  scanGroup.position.set(.9,2,.54);
  const rayGeom=new T.BufferGeometry();rayGeom.setAttribute('position',new T.Float32BufferAttribute(new Array(18).fill(0),3));
  const rayMat=new T.LineBasicMaterial({color:'#56dcf4',transparent:true,opacity:.12,depthWrite:false});
  const rays=new T.LineSegments(rayGeom,rayMat);root.add(rays);
  // Floating polygon confirmation badge, with a real extruded checkmark.
  const badge=new T.Group();badge.position.set(1.60,2.62,.54);badge.rotation.y=-.35;root.add(badge);
  const badgeBody=mesh(new T.CylinderGeometry(.31,.31,.065,6),std('#123b2c',.33,.55),badge);badgeBody.rotation.x=Math.PI/2;
  const badgeRim=mesh(new T.RingGeometry(.293,.312,6),greenGlow,badge);badgeRim.rotation.z=Math.PI/6;badgeRim.position.z=.035;
  const checkShape=new T.Shape();checkShape.moveTo(-.17,-.005);checkShape.lineTo(-.075,-.10);checkShape.lineTo(.17,.13);checkShape.lineTo(.125,.18);checkShape.lineTo(-.075,-.027);checkShape.lineTo(-.12,.025);checkShape.closePath();
  const check=mesh(new T.ExtrudeGeometry(checkShape,{depth:.017,bevelEnabled:true,bevelSegments:1,bevelSize:.006,bevelThickness:.006,steps:1}),greenGlow,badge);check.position.z=.038;
  badge.traverse(o=>{if(o.isMesh){o.castShadow=false;o.material.transparent=true;}});

  // Broad studio lighting maintains graphite surfaces and crisp chamfer highlights.
  scene.add(new T.AmbientLight('#d6e0ea',.35));
  scene.add(new T.HemisphereLight('#e9f0f7','#17212d',.85));
  const key=new T.DirectionalLight('#ecf4ff',3.0);key.position.set(-3.5,7,5);key.castShadow=true;
  key.shadow.mapSize.set(2048,2048);key.shadow.camera.left=-5;key.shadow.camera.right=5;key.shadow.camera.top=6;key.shadow.camera.bottom=-4;
  key.shadow.normalBias=.025;key.shadow.bias=-.0002;key.shadow.radius=3;scene.add(key);
  const rim=new T.DirectionalLight('#aac7e1',1.8);rim.position.set(3,4,-3);scene.add(rim);
  const fill=new T.DirectionalLight('#acd5e9',.7);fill.position.set(4,1,6);scene.add(fill);
  const scanLight=new T.PointLight('#34d7fb',.9,4,2);scanLight.position.set(.8,1.5,.6);scene.add(scanLight);
  const deviceLight=new T.PointLight('#4ee9ff',.25,2,2);deviceLight.position.set(-.73,1.7,.2);scene.add(deviceLight);

  // Procedural studio reflections bring glass and metal to life without HDR files.
  const studio=new T.Scene();studio.background=new T.Color('#18212a');
  function softbox(x,y,z,sx,sy,sz,intensity){const m=new T.Mesh(new T.BoxGeometry(sx,sy,sz),new T.MeshBasicMaterial({color:new T.Color(intensity,intensity*1.01,intensity*1.035)}));m.position.set(x,y,z);studio.add(m);}
  softbox(-4,4,4,2.5,5,.1,3.3);softbox(3,4,-3,.1,5,3.4,2.1);softbox(0,7,0,4,.1,4,1.5);
  const pmrem=new T.PMREMGenerator(renderer);const envMap=pmrem.fromScene(studio,.08,.1,50);scene.environment=envMap.texture;pmrem.dispose();

  // Small HDR bloom passes, kept off the solid black background except at emitters.
  const rtOpts={type:T.HalfFloatType,minFilter:T.LinearFilter,magFilter:T.LinearFilter,depthBuffer:false};
  const sceneRT=new T.WebGLRenderTarget(1,1,{...rtOpts,depthBuffer:true,samples:4});
  const brightRT=new T.WebGLRenderTarget(1,1,rtOpts), blurRT=new T.WebGLRenderTarget(1,1,rtOpts);
  const postScene=new T.Scene(), postCamera=new T.OrthographicCamera(-1,1,1,-1,0,1);
  const postV=`varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`;
  const thresholdMat=new T.ShaderMaterial({uniforms:{map:{value:sceneRT.texture}},vertexShader:postV,fragmentShader:`varying vec2 vUv;uniform sampler2D map;void main(){vec3 c=texture2D(map,vUv).rgb;float l=max(c.r,max(c.g,c.b));gl_FragColor=vec4(c*smoothstep(.72,1.7,l),1.);}`,depthTest:false,depthWrite:false});
  const blurMat=new T.ShaderMaterial({uniforms:{map:{value:brightRT.texture},direction:{value:new T.Vector2()}},vertexShader:postV,fragmentShader:`varying vec2 vUv;uniform sampler2D map;uniform vec2 direction;void main(){vec3 c=texture2D(map,vUv).rgb*.227027;c+=texture2D(map,vUv+direction*1.384615).rgb*.316216;c+=texture2D(map,vUv-direction*1.384615).rgb*.316216;c+=texture2D(map,vUv+direction*3.230769).rgb*.07027;c+=texture2D(map,vUv-direction*3.230769).rgb*.07027;gl_FragColor=vec4(c,1.);}`,depthTest:false,depthWrite:false});
  const combineMat=new T.ShaderMaterial({uniforms:{base:{value:sceneRT.texture},bloom:{value:brightRT.texture},uTransparent:{value:transparent?1:0}},vertexShader:postV,fragmentShader:`
    varying vec2 vUv;uniform sampler2D base,bloom;uniform float uTransparent;
    vec3 aces(vec3 v){return clamp((v*(2.51*v+.03))/(v*(2.43*v+.59)+.14),0.,1.);}
    void main(){vec4 src=texture2D(base,vUv);vec3 b=texture2D(bloom,vUv).rgb*.20;vec3 c=aces((src.rgb+b)*1.05);
    gl_FragColor=vec4(c,1.);
    #include <colorspace_fragment>
    float glowAlpha=max(gl_FragColor.r,max(gl_FragColor.g,gl_FragColor.b));
    gl_FragColor.a=mix(1.,clamp(max(src.a,glowAlpha),0.,1.),uTransparent);
    }
  `,depthTest:false,depthWrite:false,transparent:false,toneMapped:false});
  const quad=new T.Mesh(new T.PlaneGeometry(2,2),combineMat);postScene.add(quad);
  function pass(mat,rt){quad.material=mat;renderer.setRenderTarget(rt);renderer.render(postScene,postCamera);}
  function render(){
    renderer.setClearColor(0x000000,transparent?0:1);renderer.setRenderTarget(sceneRT);renderer.render(scene,camera);
    pass(thresholdMat,brightRT);
    blurMat.uniforms.map.value=brightRT.texture;blurMat.uniforms.direction.value.set(1.7/brightRT.width,0);pass(blurMat,blurRT);
    blurMat.uniforms.map.value=blurRT.texture;blurMat.uniforms.direction.value.set(0,1.7/brightRT.height);pass(blurMat,brightRT);
    pass(combineMat,null);
  }
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const smooth=(a,b,t)=>{const p=clamp((t-a)/(b-a));return p*p*(3-2*p);};
  const easeOutBack=t=>{const c=1.5;return 1+(c+1)*(t-1)**3+c*(t-1)**2;};
  function roundPath(ctx,x,y,width,height,r){ctx.beginPath();ctx.roundRect(x,y,width,height,r);}
  let lastScreenKey='';
  function drawScreen(t,progress,success,active){
    const key=[Math.floor(t*12),Math.floor(success*50)].join('/');if(key===lastScreenKey)return;lastScreenKey=key;
    sx.fillStyle='#07121e';sx.fillRect(0,0,512,640);
    const color=success>.45?'#7cf3b4':'#70e9ff';
    sx.fillStyle='#aac2ce';sx.font='500 16px Arial';sx.textAlign='left';sx.fillText('IDENTITY',35,41);
    sx.fillStyle=color;sx.beginPath();sx.arc(461,35,4,0,Math.PI*2);sx.fill();
    sx.fillStyle='#c6d9e1';sx.font='400 57px Arial';sx.textAlign='center';sx.fillText('09:41',256,121);
    sx.font='400 13px Arial';sx.fillStyle='#638396';sx.fillText('CONTROL DE ACCESO',256,152);
    sx.strokeStyle=success>.45?'#183d35':'#173746';sx.lineWidth=1;
    for(let x=114;x<=398;x+=35){sx.beginPath();sx.moveTo(x,192);sx.lineTo(x,458);sx.stroke();}
    for(let y=192;y<=458;y+=33){sx.beginPath();sx.moveTo(114,y);sx.lineTo(398,y);sx.stroke();}
    sx.strokeStyle=color;sx.lineWidth=3;
    for(const [x,y,dx,dy] of [[113,192,1,1],[399,192,-1,1],[113,458,1,-1],[399,458,-1,-1]]){sx.beginPath();sx.moveTo(x,y+dy*23);sx.lineTo(x,y);sx.lineTo(x+dx*23,y);sx.stroke();}
    if(success>.45){
      sx.strokeStyle=color;sx.lineWidth=8;sx.lineCap='square';sx.beginPath();sx.moveTo(190,323);sx.lineTo(238,370);sx.lineTo(326,275);sx.stroke();
    }else{
      sx.strokeStyle='#3db4c8';sx.lineWidth=1.7;
      const pts=[[256,218],[206,233],[184,279],[191,337],[216,383],[256,402],[296,383],[321,337],[328,279],[306,233]];
      sx.beginPath();pts.forEach((p,i)=>i?sx.lineTo(...p):sx.moveTo(...p));sx.closePath();sx.stroke();
      for(const [a,b] of [[0,2],[0,8],[1,9],[1,3],[9,7],[2,8],[2,4],[8,6],[3,7],[4,6],[3,5],[7,5]]){sx.beginPath();sx.moveTo(...pts[a]);sx.lineTo(...pts[b]);sx.stroke();}
      sx.beginPath();sx.moveTo(256,272);sx.lineTo(239,328);sx.lineTo(273,328);sx.closePath();sx.stroke();
      sx.beginPath();sx.moveTo(228,354);sx.lineTo(256,362);sx.lineTo(284,354);sx.stroke();
      if(active>.01){const y=204+progress*238;sx.fillStyle='rgba(84,230,255,.12)';sx.fillRect(117,y-14,278,28);sx.fillStyle='#8bf2ff';sx.fillRect(116,y-1,280,2);}
    }
    sx.fillStyle=color;sx.font='500 16px Arial';sx.fillText(success>.45?'IDENTIDAD VERIFICADA':active>.1?'VERIFICANDO IDENTIDAD':'LISTO PARA ESCANEAR',256,518);
    sx.fillStyle='#18323d';roundPath(sx,114,544,284,4,2);sx.fill();
    sx.fillStyle=color;roundPath(sx,114,544,Math.max(1,284*(success>.45?1:progress)),4,2);sx.fill();
    sx.fillStyle='#7593a3';sx.font='400 12px Arial';sx.fillText(success>.45?'Asistencia registrada':'Reconocimiento biométrico',256,591);
    screenTex.needsUpdate=true;
  }

  function update(time){
    const t=((time%CYCLE)+CYCLE)%CYCLE;
    const appear=smooth(.15,1.0,t)*(1-smooth(6.45,7.35,t));
    const scanProgress=smooth(1.25,4.50,t)*(1-smooth(6.8,7.5,t));
    const scanning=smooth(1.05,1.35,t)*(1-smooth(4.45,4.8,t));
    const success=smooth(4.65,5.05,t)*(1-smooth(6.2,6.75,t));
    const reveal=.86-1.85*smooth(.15,1.1,t);
    uniforms.uTime.value=t;uniforms.uOpacity.value=appear;uniforms.uScan.value=.79-scanProgress*1.52;
    uniforms.uReveal.value=reveal;uniforms.uSuccess.value=success;uniforms.uScanning.value=scanning;
    faceGroup.position.y=1.83+Math.sin(t*Math.PI/4)*.025;
    faceGroup.rotation.y=-.36+Math.sin(t*Math.PI/4)*.018;
    faceGroup.visible=appear>.001;
    scanGroup.position.y=faceGroup.position.y+uniforms.uScan.value;
    scanGroup.visible=scanning>.001;sheet.material.opacity=.065*scanning;perimeter.material.opacity=.62*scanning;
    scanLine.material.emissiveIntensity=1.7*scanning;
    gridLines.forEach(l=>{l.material.opacity=.10*scanning;});
    rayMat.opacity=.14*scanning;
    const sy=scanGroup.position.y, pos=rayGeom.attributes.position.array;
    pos.set([-.73,2.362,-.135,.15,sy,-.05,-.73,2.362,-.135,1.65,sy,-.05,-.73,2.362,-.135,.15,sy,1.13]);rayGeom.attributes.position.needsUpdate=true;
    const pop=easeOutBack(smooth(4.68,5.15,t));badge.scale.setScalar(Math.max(.001,pop*.96));badge.visible=success>.001;
    badge.position.y=2.65+Math.sin(t*Math.PI/4)*.025;
    badge.traverse(o=>{if(o.isMesh)o.material.opacity=success;});
    const current=cyan.clone().lerp(green,success);status.material.color.copy(current);status.material.emissive.copy(current);
    status.material.emissiveIntensity=1.5+Math.sin(t*Math.PI/4)*.22;
    scanLight.color.copy(current);scanLight.intensity=scanning*.95+success*.4;scanLight.position.y=scanGroup.position.y;
    deviceLight.color.copy(current);rings.forEach((r,i)=>{r.material.color.copy(current);r.material.opacity=(.12+.12*appear)*(1-.16*i);});
    drawScreen(t,scanProgress,success,scanning);
    const state=document.getElementById('state');
    if(state)state.textContent=success>.5?'Identidad verificada':scanning>.1?'Reconocimiento en curso':'Sistema listo';
  }
  function resize(){
    w=Math.max(1,host.clientWidth);h=Math.max(1,host.clientHeight);renderer.setSize(w,h,false);
    const aspect=w/h;let span=5.4;if(aspect<1)span/=aspect;
    camera.left=-span*aspect/2;camera.right=span*aspect/2;camera.top=span/2;camera.bottom=-span/2;camera.updateProjectionMatrix();
    const d=renderer.getPixelRatio();sceneRT.setSize(Math.round(w*d),Math.round(h*d));brightRT.setSize(Math.round(w*d/3),Math.round(h*d/3));blurRT.setSize(Math.round(w*d/3),Math.round(h*d/3));
    renderer.shadowMap.needsUpdate=true;update(runningTime);render();
  }
  new ResizeObserver(resize).observe(host);
  new IntersectionObserver(e=>{visible=e[0].isIntersecting;}).observe(host);
  document.addEventListener('visibilitychange',()=>{last=performance.now();});
  const play=document.getElementById('play');
  function syncPlay(){play.textContent=paused?'Reproducir':'Pausar';play.setAttribute('aria-pressed',String(paused));}
  play.addEventListener('click',()=>{paused=!paused;last=performance.now();syncPlay();});
  document.getElementById('restart').addEventListener('click',()=>{runningTime=0;paused=false;syncPlay();update(0);render();});
  document.getElementById('background').addEventListener('click',()=>{transparent=!transparent;document.body.classList.toggle('transparent',transparent);document.documentElement.classList.toggle('transparent',transparent);combineMat.uniforms.uTransparent.value=transparent?1:0;document.getElementById('background').textContent=transparent?'Fondo negro':'Fondo transparente';render();});
  document.getElementById('save-png').addEventListener('click',()=>{render();const a=document.createElement('a');a.download=transparent?'biometrico-transparente.png':'biometrico.png';a.href=renderer.domElement.toDataURL('image/png');a.click();});
  syncPlay();
  function animate(now){
    const dt=Math.min(.1,(now-last)/1000);last=now;
    if(!paused&&visible&&!document.hidden){runningTime+=dt;update(runningTime);render();}
    if(!capture)requestAnimationFrame(animate);
  }
  window.biometricAnimation={
    seek(seconds){runningTime=seconds;update(seconds);render();},
    setTransparent(value){transparent=!!value;document.body.classList.toggle('transparent',transparent);document.documentElement.classList.toggle('transparent',transparent);combineMat.uniforms.uTransparent.value=transparent?1:0;render();},
    pause(){paused=true;syncPlay();},play(){paused=false;syncPlay();},
    get canvas(){return renderer.domElement;},get duration(){return CYCLE;},get ready(){return true;}
  };
  resize();update(runningTime);render();
  document.getElementById('loading').remove();
  if(!capture)requestAnimationFrame(animate);
})();
