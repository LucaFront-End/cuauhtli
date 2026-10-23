/* Pilar 01: a rigged collaborator approaches, validates in 0.2 s and passes the gates. */
function buildPillar(ctx){
 const {T,root,scene,mat,glow,mesh,box,bevel,line,tube,ring,disc,label,panel,makeBase,contactShadow,clamp,smooth,pal}=ctx;
 const dark=mat(pal.graphite,.42,.55),alloy=mat('#51606e',.31,.8),steel=mat('#2b3742',.4,.62),black=mat('#040910',.18,.35);
 const cyan=new T.Color(pal.cyan),green=new T.Color(pal.green);
 const cyanM=glow(pal.cyan,1.4),greenM=glow(pal.green,1.6);
 makeBase(4.5,3.5,.28);
 // Two long speed-gate housings. Chamfered bodies and satin-metal lids.
 const leds=[];
 for(const x of[-.83,.83]){
  const base=bevel(.46,.93,1.75,.075,.035,dark);base.position.set(x,.72,-.20);
  const lid=bevel(.48,.065,1.77,.04,.016,alloy);lid.position.set(x,1.20,-.20);
  const inset=box(.35,.012,1.58,black);inset.position.set(x,1.24,-.20);
  const strip=box(.025,.017,1.33,cyanM.clone());strip.position.set(x-(x>0?.18:-.18),1.25,-.15);strip.castShadow=false;leds.push(strip);
  const front=bevel(.29,.37,.018,.035,.006,black);front.position.set(x,.82,.685);
  for(let i=0;i<3;i++){const slot=box(.14,.013,.012,alloy);slot.position.set(x,.74+i*.08,.70);}
  contactShadow(x,-.2,.88,2.2,.55);
 }
 // Glass wings rotate away from the central passage, following actual hinges.
 const gates=[];
 for(const side of[-1,1]){
  const hinge=new T.Group();hinge.position.set(side*.60,.87,-.23);root.add(hinge);
  const glass=new T.MeshPhysicalMaterial({color:pal.glass,metalness:.28,roughness:.12,transparent:true,opacity:.32,side:T.DoubleSide,depthWrite:false});
  const wing=bevel(.59,.96,.027,.035,.006,glass,hinge);wing.position.x=-side*.295;wing.castShadow=false;
  const outline=[[-side*.015,-.48,.02],[-side*.55,-.48,.02],[-side*.59,-.44,.02],[-side*.59,.44,.02],[-side*.55,.48,.02],[-side*.015,.48,.02]];
  const rail=tube(outline,.008,cyanM.clone(),hinge);rail.castShadow=false;leds.push(rail);
  const pivot=disc(.035,.94,alloy,hinge,16);pivot.position.x=0;
  const axis=disc(.055,.055,alloy,hinge,16);axis.position.y=.49;
  gates.push({hinge,side});
 }
 // Architectural reader pillar, recognizably separate from the speed-gate body.
 const post=bevel(.25,.75,.21,.035,.018,alloy);post.position.set(-.86,1.61,.49);
 const terminal=new T.Group();terminal.position.set(-.86,1.93,.63);terminal.rotation.y=-.16;root.add(terminal);
 const body=bevel(.57,.93,.145,.055,.022,steel,terminal);
 const trim=bevel(.54,.89,.015,.045,.004,alloy,terminal);trim.position.z=.081;
 const fascia=bevel(.51,.86,.016,.04,.004,black,terminal);fascia.position.z=.093;
 const lens=disc(.052,.016,alloy,terminal,24);lens.rotation.x=Math.PI/2;lens.position.set(0,.328,.111);
 const lensGlass=disc(.041,.019,black,terminal,24);lensGlass.rotation.x=Math.PI/2;lensGlass.position.set(0,.328,.122);
 const lensRing=ring(.043,.003,cyanM.clone(),terminal);lensRing.position.set(0,.328,.134);
 const lensDot=mesh(new T.CircleGeometry(.009,12),new T.MeshBasicMaterial({color:'#b2eaff'}),terminal);lensDot.position.set(-.014,.34,.14);lensDot.castShadow=false;
 const screen=panel(.408,.59,null,terminal);screen.mesh.position.set(0,-.052,.105);
 const readerLed=box(.23,.012,.01,cyanM.clone(),terminal);readerLed.position.set(0,-.394,.107);readerLed.castShadow=false;leds.push(readerLed);
 const name=label('BIO / 01',.18,.026,{color:'#98adbb',fontSize:90},terminal);name.position.set(0,-.355,.112);
 // Human silhouette with independently articulated legs, knees and shoulders.
 const person=new T.Group();root.add(person);const materials=[];
 function pm(color,rough=.68,metal=.05){const m=mat(color,rough,metal);m.transparent=true;materials.push(m);return m;}
 const suit=pm('#314350'),pants=pm('#151f2a'),skin=pm('#a3aeb7',.64,.08),shoes=pm('#090f17',.4,.3);
 const torso=mesh(new T.CylinderGeometry(.255,.20,.64,8,1,false),suit,person);torso.position.y=1.23;torso.scale.z=.64;
 const hips=bevel(.39,.21,.26,.06,.025,pants,person);hips.position.y=.85;
 const collar=disc(.10,.10,pants,person,12);collar.position.y=1.58;
 const neck=disc(.078,.14,skin,person,12);neck.position.y=1.64;
 const headGroup=new T.Group();headGroup.position.set(0,1.85,0);headGroup.rotation.y=-.78;person.add(headGroup);
 const fd=makeFaceGeometryData(),fg=new T.BufferGeometry();fg.setAttribute('position',new T.Float32BufferAttribute(fd.positions,3));fg.setIndex(fd.indices);fg.computeVertexNormals();
 const head=mesh(fg.toNonIndexed(),skin,headGroup);head.geometry.computeVertexNormals();head.scale.setScalar(.32);
 // Sparse cropped hair cap preserves the angular facial landmarks.
 const hairPos=[];for(let i=0;i<fd.indices.length;i+=3){const ids=fd.indices.slice(i,i+3);if(ids.every(k=>fd.positions[k*3+1]>.24)){for(const k of ids)hairPos.push(fd.positions[k*3]*.324,fd.positions[k*3+1]*.324,fd.positions[k*3+2]*.324);}}
 const hg=new T.BufferGeometry();hg.setAttribute('position',new T.Float32BufferAttribute(hairPos,3));hg.computeVertexNormals();mesh(hg,pm('#26323c',.78,0),headGroup);
 const wireM=new T.LineBasicMaterial({color:pal.cyan,transparent:true,opacity:0,depthWrite:false});
 const faceWire=new T.LineSegments(new T.WireframeGeometry(fg),wireM);faceWire.scale.setScalar(.325);faceWire.renderOrder=2;headGroup.add(faceWire);
 const trackingFrame=line([[-.19,-.24,.16],[-.19,.25,.16],[.19,.25,.16],[.19,-.24,.16],[-.19,-.24,.16]],pal.cyan,0,headGroup);
 const scanMesh=mesh(new T.PlaneGeometry(.46,.38),new T.MeshBasicMaterial({color:pal.cyan,transparent:true,opacity:0,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending}),headGroup);scanMesh.rotation.x=-Math.PI/2;scanMesh.position.z=.07;scanMesh.castShadow=false;
 const sweep=tube([[-.23,0,.26],[.23,0,.26]],.003,cyanM.clone(),headGroup);sweep.castShadow=false;
 const legs=[],arms=[];
 for(const s of[-1,1]){
  const leg=new T.Group();leg.position.set(s*.105,.87,0);person.add(leg);
  const thigh=mesh(new T.CylinderGeometry(.087,.066,.38,7),pants,leg);thigh.position.y=-.19;
  const knee=new T.Group();knee.position.y=-.38;leg.add(knee);
  const shin=mesh(new T.CylinderGeometry(.067,.052,.37,7),pants,knee);shin.position.y=-.185;
  const shoe=bevel(.145,.105,.27,.03,.017,shoes,knee);shoe.position.set(0,-.395,-.065);
  legs.push({leg,knee,s});
  const arm=new T.Group();arm.position.set(s*.258,1.46,0);arm.rotation.z=s*.13;person.add(arm);
  const upper=mesh(new T.CylinderGeometry(.071,.055,.32,7),suit,arm);upper.position.y=-.16;
  const fore=new T.Group();fore.position.y=-.32;fore.rotation.x=-.1;arm.add(fore);
  const sleeve=mesh(new T.CylinderGeometry(.054,.041,.27,7),suit,fore);sleeve.position.y=-.135;
  const hand=mesh(new T.IcosahedronGeometry(.065,0),skin,fore);hand.position.y=-.32;hand.scale.set(.7,1.2,.7);arms.push({arm,s});
 }
 person.traverse(o=>{if(o.isMesh){o.castShadow=false;o.receiveShadow=true;}});
 const personShadow=contactShadow(.12,1.35,.92,.8,.5);
 // Traces and lane arrows lead toward the opening.
 for(const x of[-1.52,1.52])line([[x,.255,1.35],[x,.255,-.8],[x*.7,.255,-1.36]],'#42717f',.28);
 for(const z of[-.85,.0,.85]){
  const ar=line([[-.15,.258,z+.08],[0,.258,z-.07],[.15,.258,z+.08]],pal.cyan,.22);ar.material.color.set(pal.cyan);
 }
 const accessLabel=label('ACCESO INTELIGENTE',1.34,.12,{color:'#a4bac7',fontSize:72});accessLabel.rotation.x=-Math.PI/2;accessLabel.position.set(0,.257,1.51);
 const badge=new T.Group();badge.position.set(1.34,2.43,-.35);badge.rotation.y=-.5;root.add(badge);
 const badgeMat=mat('#0c342b',.35,.55);badgeMat.transparent=true;
 const badgeBack=disc(.32,.06,badgeMat,badge,6);badgeBack.rotation.x=Math.PI/2;
 const badgeEdge=mesh(new T.RingGeometry(.30,.319,6),greenM.clone(),badge);badgeEdge.rotation.z=Math.PI/6;badgeEdge.position.z=.033;
 const checkS=new T.Shape();checkS.moveTo(-.16,0);checkS.lineTo(-.065,-.09);checkS.lineTo(.16,.13);checkS.lineTo(.115,.18);checkS.lineTo(-.065,-.02);checkS.lineTo(-.115,.045);checkS.closePath();
 const check=mesh(new T.ExtrudeGeometry(checkS,{depth:.018,bevelEnabled:true,bevelSegments:1,bevelSize:.006,bevelThickness:.006,steps:1}),greenM.clone(),badge);check.position.z=.036;
 badge.traverse(o=>{if(o.isMesh){o.castShadow=false;o.material.transparent=true;}});
 const verifyLabel=label('IDENTITY VERIFIED',1.25,.13,{color:pal.green,fontSize:76});verifyLabel.position.set(.91,2.85,-.35);verifyLabel.rotation.y=-.5;
 const raysGeo=new T.BufferGeometry();raysGeo.setAttribute('position',new T.Float32BufferAttribute(new Array(12).fill(0),3));const raysMat=new T.LineBasicMaterial({color:pal.cyan,transparent:true,opacity:0,depthWrite:false});const rays=new T.LineSegments(raysGeo,raysMat);root.add(rays);
 const signal=new T.PointLight(pal.cyan,.5,2.5,2);signal.position.set(-.5,1.6,.8);scene.add(signal);
 let screenState='';
 function drawScreen(state){if(state===screenState)return;screenState=state;screen.redraw((c,W,H)=>{
  c.fillStyle='#06121e';c.fillRect(0,0,W,H);c.fillStyle='#b6cbd7';c.font='500 42px Arial';c.textAlign='center';c.fillText('BIOMETRIC ACCESS',W/2,96);
  c.strokeStyle=state==='verified'?pal.green:pal.cyan;c.lineWidth=5;
  for(const [x,y,dx,dy]of[[160,250,1,1],[864,250,-1,1],[160,960,1,-1],[864,960,-1,-1]]){c.beginPath();c.moveTo(x,y+dy*70);c.lineTo(x,y);c.lineTo(x+dx*70,y);c.stroke();}
  if(state==='verified'){c.lineWidth=22;c.beginPath();c.moveTo(325,600);c.lineTo(465,745);c.lineTo(728,448);c.stroke();}
  else{c.lineWidth=4;const p=[[512,305],[350,380],[313,560],[360,757],[512,854],[664,757],[711,560],[674,380]];c.beginPath();p.forEach((a,i)=>i?c.lineTo(...a):c.moveTo(...a));c.closePath();c.stroke();for(const [a,b]of[[0,2],[0,6],[1,7],[2,6],[2,4],[6,4],[3,5]]){c.beginPath();c.moveTo(...p[a]);c.lineTo(...p[b]);c.stroke();}}
  c.fillStyle=state==='verified'?pal.green:pal.cyan;c.font='500 48px Arial';c.fillText(state==='verified'?'IDENTITY VERIFIED':state==='scan'?'SCANNING':'READY',W/2,1105);
  c.fillStyle='#7896aa';c.font='400 37px Arial';c.fillText('SHA-256',W/2,1190);
 });}
 function update(t){
  t=((t%8)+8)%8;
  const appear=smooth(.12,.5,t)*(1-smooth(6.1,6.65,t));
  const approach=smooth(.3,1.4,t),cross=smooth(3.0,5.65,t);
  person.position.set(.12,.25,1.42-.45*approach-2.25*cross);
  const walk=(1-smooth(1.15,1.45,t))*smooth(.2,.4,t)+smooth(2.9,3.2,t)*(1-smooth(5.4,5.7,t));
  const step=Math.sin(t*Math.PI*3.5)*walk;
  legs.forEach(({leg,knee,s})=>{leg.rotation.x=step*s*.48;knee.rotation.x=Math.max(0,-step*s)*.58;});
  arms.forEach(({arm,s})=>{arm.rotation.x=-step*s*.38;});
  torso.rotation.z=Math.sin(t*Math.PI*3.5)*.015*walk;
  headGroup.rotation.y=-.78-(Math.PI-.78)*smooth(2.9,3.4,t);
  materials.forEach(m=>m.opacity=appear);person.visible=appear>.001;
  personShadow.position.z=person.position.z;personShadow.material.opacity=.48*appear;
  // The recognition event itself lasts exactly 0.20 s within the eight-second story.
  const scan=smooth(1.60,1.63,t)*(1-smooth(1.78,1.80,t));
  const verify=smooth(1.8,1.86,t)*(1-smooth(5.9,6.25,t));
  const tracked=smooth(1.45,1.6,t)*(1-smooth(3.2,3.45,t));
  wireM.color.copy(cyan).lerp(green,verify);wireM.opacity=tracked*.82;
  trackingFrame.material.color.copy(wireM.color);trackingFrame.material.opacity=tracked*.42;
  scanMesh.position.y=.24-.48*clamp((t-1.6)/.2);scanMesh.material.opacity=.18*scan;sweep.position.y=scanMesh.position.y;sweep.visible=scan>.001;
  const open=smooth(2.03,2.68,t)*(1-smooth(6.02,6.82,t));gates.forEach(({hinge,side})=>hinge.rotation.y=-side*open*Math.PI/2);
  leds.forEach(o=>{o.material.color.copy(cyan).lerp(green,verify);o.material.emissive.copy(o.material.color);});
  badge.visible=verify>.001;badge.scale.setScalar(.86+.14*smooth(1.8,2.1,t));badge.position.y=2.43+Math.sin(t*Math.PI/4)*.025;badge.traverse(o=>{if(o.isMesh)o.material.opacity=verify;});
  verifyLabel.material.opacity=verify;
  signal.color.copy(cyan).lerp(green,verify);signal.intensity=.25+.65*scan+.35*verify;
  raysMat.opacity=.35*scan;raysGeo.attributes.position.array.set([-.86,2.258,.79,-.04,2.1,person.position.z+.1,-.86,2.258,.79,.30,2.1,person.position.z+.1]);raysGeo.attributes.position.needsUpdate=true;
  drawScreen(verify>.5?'verified':scan>.01?'scan':'ready');
 }
 update(0);
 return{update,span:6.2,targetY:1.17,posterTime:2.45,title:'Acceso facial y torniquete'};
}
