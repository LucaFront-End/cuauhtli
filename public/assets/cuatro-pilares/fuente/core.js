/* Shared renderer. Every delivered pillar is standalone and embeds this engine. */
(() => {
 'use strict';
 const T=THREE, query=new URLSearchParams(location.search), capture=query.has('capture');
 const host=document.getElementById('scene');
 const pal={graphite:'#111923',cyan:'#3ee2fc',green:'#10B981',amber:'#ffb84a',alloy:'#516273',glass:'#0c2434'};
 let transparent=query.get('background')==='transparent';
 let paused=query.has('paused');
 let seconds=0,visible=true,last=performance.now(),tileMode=false;
 if(query.has('embed')||capture)document.body.classList.add('embedded');
 function syncBackground(){document.documentElement.classList.toggle('transparent',transparent);document.body.classList.toggle('transparent',transparent);}
 syncBackground();
 let renderer;
 try{renderer=new T.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});}catch(e){document.getElementById('fallback').hidden=false;document.getElementById('loading').remove();document.querySelector('.tools').hidden=true;return;}
 renderer.setPixelRatio(capture?1:Math.min(devicePixelRatio,2));renderer.outputColorSpace=T.SRGBColorSpace;
 renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1;
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;
 renderer.setClearColor(0x000000,transparent?0:1);
 renderer.domElement.setAttribute('role','img');renderer.domElement.setAttribute('aria-label',document.title);
 host.appendChild(renderer.domElement);
 const scene=new T.Scene(),root=new T.Group();scene.add(root);
 const camera=new T.OrthographicCamera(-3.1,3.1,3.1,-3.1,.1,100);
 const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
 const smooth=(a,b,t)=>{let p=clamp((t-a)/(b-a));return p*p*(3-2*p);};
 const mat=(color,rough=.45,metal=.35)=>new T.MeshStandardMaterial({color,roughness:rough,metalness:metal,flatShading:true});
 const glow=(color,intensity=1.5)=>new T.MeshStandardMaterial({color,emissive:color,emissiveIntensity:intensity,roughness:.35,metalness:.15});
 function mesh(g,m,parent=root){const o=new T.Mesh(g,m);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
 function box(w,h,d,m,parent=root){return mesh(new T.BoxGeometry(w,h,d),m,parent);}
 function shapeRect(w,h,c){const s=new T.Shape(),x=w/2,y=h/2;s.moveTo(-x+c,-y);s.lineTo(x-c,-y);s.lineTo(x,-y+c);s.lineTo(x,y-c);s.lineTo(x-c,y);s.lineTo(-x+c,y);s.lineTo(-x,y-c);s.lineTo(-x,-y+c);s.closePath();return s;}
 function bevel(w,h,d,cut,b,m,parent=root){
  b=Math.min(b,d*.45);const g=new T.ExtrudeGeometry(shapeRect(w-2*b,h-2*b,cut),{depth:d-2*b,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:b,bevelThickness:b,curveSegments:1});
  g.translate(0,0,-(d-2*b)/2);return mesh(g,m,parent);
 }
 function line(points,color=pal.cyan,opacity=.5,parent=root){const o=new T.Line(new T.BufferGeometry().setFromPoints(points.map(p=>new T.Vector3(...p))),new T.LineBasicMaterial({color,transparent:true,opacity,depthWrite:false}));parent.add(o);return o;}
 function tube(points,radius,m,parent=root){const curve=new T.CurvePath();for(let i=1;i<points.length;i++)curve.add(new T.LineCurve3(new T.Vector3(...points[i-1]),new T.Vector3(...points[i])));return mesh(new T.TubeGeometry(curve,Math.max(8,points.length*6),radius,6,false),m,parent);}
 function ring(r,thickness,m,parent=root){return mesh(new T.TorusGeometry(r,thickness,6,72),m,parent);}
 function disc(r,h,m,parent=root,segments=48){return mesh(new T.CylinderGeometry(r,r,h,segments),m,parent);}
 function panel(w,h,drawFn,parent=root){
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=Math.max(64,Math.round(1024*h/w));
  const c=canvas.getContext('2d');const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=8;
  const material=new T.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,toneMapped:false});
  const o=mesh(new T.PlaneGeometry(w,h),material,parent);o.castShadow=false;o.receiveShadow=false;
  function redraw(fn){c.clearRect(0,0,canvas.width,canvas.height);fn(c,canvas.width,canvas.height);texture.needsUpdate=true;}
  if(drawFn)redraw(drawFn);return{mesh:o,canvas,ctx:c,texture,redraw};
 }
 function label(text,w,h,opts={},parent=root){
  const p=panel(w,h,null,parent);let current;
  function setText(s){s=String(s);if(s===current)return;current=s;
   p.redraw((c,W,H)=>{if(opts.background){c.fillStyle=opts.background;c.fillRect(0,0,W,H);}
    let size=opts.fontSize||70;c.font=(opts.weight||500)+' '+size+'px Arial, sans-serif';const measure=c.measureText(s).width;
    size=Math.min(size,size*(W*.94/Math.max(1,measure)),H*.8);c.font=(opts.weight||500)+' '+size+'px Arial, sans-serif';
    c.fillStyle=opts.color||'#b7cbd7';c.textBaseline='middle';c.textAlign=opts.align||'center';c.fillText(s,opts.align==='left'?W*.035:opts.align==='right'?W*.965:W/2,H/2);});
  }
  setText(text);p.mesh.userData.setText=setText;return p.mesh;
 }
 function contactShadow(x,z,w,h,opacity=.6,y=.245){
  const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');const grd=g.createRadialGradient(64,64,10,64,64,64);grd.addColorStop(0,'rgba(0,0,0,1)');grd.addColorStop(.55,'rgba(0,0,0,.55)');grd.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=grd;g.fillRect(0,0,128,128);
  const o=mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:new T.CanvasTexture(c),transparent:true,opacity,depthWrite:false,toneMapped:false}));o.rotation.x=-Math.PI/2;o.position.set(x,y,z);o.castShadow=false;return o;
 }
 function makeBase(w=4.5,d=3.5,cut=.28){
  const slab=bevel(w,d,.22,cut,.045,mat(pal.graphite,.48,.55));slab.rotation.x=-Math.PI/2;slab.position.y=.11;
  const top=bevel(w-.14,d-.14,.028,cut-.02,.009,mat('#1b242e',.68,.22));top.rotation.x=-Math.PI/2;top.position.y=.233;
  const edge=bevel(w-.05,d-.05,.012,cut,.004,mat('#526171',.30,.7));edge.rotation.x=-Math.PI/2;edge.position.y=.212;
  // Small machined fasteners are shared across the four scenes.
  for(const x of[-w/2+.22,w/2-.22])for(const z of[-d/2+.22,d/2-.22]){const screw=disc(.021,.008,mat('#67717b',.34,.75),root,8);screw.position.set(x,.253,z);}
  return slab;
 }
 scene.add(new T.AmbientLight('#dce5ee',.24));scene.add(new T.HemisphereLight('#eff5fa','#111d2b',.65));
 const key=new T.DirectionalLight('#eef6ff',3.1);key.position.set(-3.5,7,5);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.camera.left=-5;key.shadow.camera.right=5;key.shadow.camera.top=6;key.shadow.camera.bottom=-4;key.shadow.normalBias=.025;key.shadow.bias=-.0002;key.shadow.radius=3;scene.add(key);
 const rim=new T.DirectionalLight('#a3bfdb',1.5);rim.position.set(3,4,-3);scene.add(rim);
 const fill=new T.DirectionalLight('#dce6ed',.45);fill.position.set(4,1,6);scene.add(fill);
 const studio=new T.Scene();studio.background=new T.Color('#141d26');
 function softbox(x,y,z,w,h,d,power){const o=new T.Mesh(new T.BoxGeometry(w,h,d),new T.MeshBasicMaterial({color:new T.Color(power,power*1.01,power*1.025)}));o.position.set(x,y,z);studio.add(o);}
 softbox(-4,4,4,2.5,5,.1,2.8);softbox(3,4,-3,.1,5,3.4,1.8);softbox(0,7,0,4,.1,4,1.3);
 const pmrem=new T.PMREMGenerator(renderer),env=pmrem.fromScene(studio,.08,.1,50);scene.environment=env.texture;pmrem.dispose();
 const ctx={T,root,scene,mat,glow,mesh,box,bevel,line,tube,ring,disc,label,panel,makeBase,contactShadow,clamp,smooth,pal};
 const pillar=buildPillar(ctx),span=pillar.span||6.2,targetY=pillar.targetY||1.2;
 camera.position.set(-8,targetY+6.5319726474,8);camera.lookAt(0,targetY,0);
 seconds=paused?(pillar.posterTime||4.8):.6;
 const options={type:T.HalfFloatType,minFilter:T.LinearFilter,magFilter:T.LinearFilter,depthBuffer:false};
 const sceneRT=new T.WebGLRenderTarget(1,1,{...options,depthBuffer:true,samples:4});
 const brightRT=new T.WebGLRenderTarget(1,1,options),blurRT=new T.WebGLRenderTarget(1,1,options);
 const postScene=new T.Scene(),postCamera=new T.OrthographicCamera(-1,1,1,-1,0,1);
 const postV='varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}';
 const threshold=new T.ShaderMaterial({uniforms:{map:{value:sceneRT.texture}},vertexShader:postV,fragmentShader:'varying vec2 vUv;uniform sampler2D map;void main(){vec3 c=texture2D(map,vUv).rgb;float l=max(c.r,max(c.g,c.b));gl_FragColor=vec4(c*smoothstep(.8,1.9,l),1.);}',depthTest:false,depthWrite:false});
 const blur=new T.ShaderMaterial({uniforms:{map:{value:brightRT.texture},direction:{value:new T.Vector2()}},vertexShader:postV,fragmentShader:'varying vec2 vUv;uniform sampler2D map;uniform vec2 direction;void main(){vec3 c=texture2D(map,vUv).rgb*.227027;c+=texture2D(map,vUv+direction*1.384615).rgb*.316216;c+=texture2D(map,vUv-direction*1.384615).rgb*.316216;c+=texture2D(map,vUv+direction*3.230769).rgb*.07027;c+=texture2D(map,vUv-direction*3.230769).rgb*.07027;gl_FragColor=vec4(c,1.);}',depthTest:false,depthWrite:false});
 const combine=new T.ShaderMaterial({uniforms:{base:{value:sceneRT.texture},bloom:{value:brightRT.texture},transparentBg:{value:transparent?1:0}},vertexShader:postV,fragmentShader:`
 varying vec2 vUv;uniform sampler2D base,bloom;uniform float transparentBg;
 vec3 aces(vec3 v){return clamp((v*(2.51*v+.03))/(v*(2.43*v+.59)+.14),0.,1.);}
 void main(){vec4 src=texture2D(base,vUv);vec3 b=texture2D(bloom,vUv).rgb*.17;gl_FragColor=vec4(aces((src.rgb+b)*1.03),1.);
 float a=max(gl_FragColor.r,max(gl_FragColor.g,gl_FragColor.b));gl_FragColor.a=mix(1.,src.a,transparentBg);}
 `,depthTest:false,depthWrite:false,toneMapped:false});
 const quad=new T.Mesh(new T.PlaneGeometry(2,2),combine);postScene.add(quad);let bloomScale=1;
 function pass(m,rt){quad.material=m;renderer.setRenderTarget(rt);renderer.render(postScene,postCamera);}
 function render(){
  renderer.setClearColor(0,transparent?0:1);renderer.setRenderTarget(sceneRT);renderer.render(scene,camera);
  pass(threshold,brightRT);blur.uniforms.map.value=brightRT.texture;blur.uniforms.direction.value.set(1.7*bloomScale/brightRT.width,0);pass(blur,blurRT);
  blur.uniforms.map.value=blurRT.texture;blur.uniforms.direction.value.set(0,1.7*bloomScale/brightRT.height);pass(blur,brightRT);pass(combine,null);
 }
 function sizeTargets(w,h){const d=renderer.getPixelRatio(),divisor=tileMode?2:3;renderer.setSize(w,h,false);sceneRT.setSize(Math.round(w*d),Math.round(h*d));brightRT.setSize(Math.max(1,Math.round(w*d/divisor)),Math.max(1,Math.round(h*d/divisor)));blurRT.setSize(brightRT.width,brightRT.height);}
 function resize(){if(tileMode)return;const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight),a=w/h,s=span/(a<1?a:1);camera.clearViewOffset();camera.left=-s*a/2;camera.right=s*a/2;camera.top=s/2;camera.bottom=-s/2;camera.updateProjectionMatrix();sizeTargets(w,h);bloomScale=1;renderer.shadowMap.needsUpdate=true;pillar.update(((seconds%8)+8)%8);render();}
 const playButton=document.getElementById('play');
 function syncPlay(){playButton.textContent=paused?'Reproducir':'Pausar';playButton.setAttribute('aria-pressed',String(paused));}
 function setTransparent(v){transparent=!!v;syncBackground();combine.uniforms.transparentBg.value=transparent?1:0;document.getElementById('background').textContent=transparent?'Fondo negro':'Fondo transparente';render();}
 playButton.addEventListener('click',()=>{paused=!paused;last=performance.now();syncPlay();});
 document.getElementById('restart').addEventListener('click',()=>{seconds=0;paused=false;syncPlay();pillar.update(0);render();});
 document.getElementById('background').addEventListener('click',()=>setTransparent(!transparent));
 document.getElementById('save-png').addEventListener('click',()=>{render();const a=document.createElement('a');a.href=renderer.domElement.toDataURL('image/png');a.download=document.body.dataset.slug+'.png';a.click();});
 new ResizeObserver(resize).observe(host);
 document.addEventListener('visibilitychange',()=>{last=performance.now();});
 function tick(now){const dt=Math.min(.1,(now-last)/1000);last=now;if(!paused){seconds+=dt;pillar.update(((seconds%8)+8)%8);if(pillar.dynamicShadows)renderer.shadowMap.needsUpdate=true;render();}if(!capture)requestAnimationFrame(tick);}
 window.pillarAnimation={
  seek(t){seconds=t;pillar.update(((t%8)+8)%8);if(pillar.dynamicShadows)renderer.shadowMap.needsUpdate=true;render();},
  setTransparent,pause(){paused=true;syncPlay();},play(){paused=false;syncPlay();},
  setTile(full,x,y,size=1024,pad=96){const firstTile=!tileMode;tileMode=true;renderer.setPixelRatio(1);camera.left=-span/2;camera.right=span/2;camera.top=span/2;camera.bottom=-span/2;camera.setViewOffset(full,full,x-pad,y-pad,size+pad*2,size+pad*2);camera.updateProjectionMatrix();sizeTargets(size+pad*2,size+pad*2);bloomScale=full/1080*1.5;if(firstTile)renderer.shadowMap.needsUpdate=true;render();},
  clearTile(){tileMode=false;resize();},
  get canvas(){return renderer.domElement;},get ready(){return true;},get posterTime(){return pillar.posterTime||4.8;},get duration(){return 8;},get title(){return pillar.title;}
 };
 resize();syncPlay();document.getElementById('loading').remove();if(!capture)requestAnimationFrame(tick);
})();
