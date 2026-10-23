/* Pilar 04 — three industrial sites, one central control tower.
 * Original procedural architecture. No regulatory certification is represented.
 * A deterministic eight-second animation; no requests, clocks or RAF here.
 */
function buildPillar(ctx) {
  'use strict';
  const {T, root, mat, glow, mesh, box, bevel, line, tube, ring, disc,
    label, makeBase, contactShadow, clamp, smooth, pal} = ctx;
  const graphite=mat(pal.graphite,.57,.38);
  const dark=mat('#080f17',.40,.43);
  const steel=mat('#4a5866',.34,.72);
  const edge=mat('#71818f',.26,.78);
  const roofMat=mat('#293846',.49,.58);
  const glass=new T.MeshStandardMaterial({color:pal.glass,roughness:.12,metalness:.52,
    transparent:true,opacity:.38,depthWrite:false});
  const cyanMat=glow(pal.cyan,1.6);
  const greenMat=glow(pal.green,1.7);
  const quietCyan=glow('#124756',.65);
  const place=(obj,x,y,z)=>{obj.position.set(x,y,z);return obj;};
  const block=(w,h,d,m,parent,x,y,z)=>place(box(w,h,d,m,parent),x,y,z);
  makeBase(4.5,3.5,.30);

  // Individual steps make the three facilities legible as distinct sites.
  function pedestal(x,z,w,d,height) {
    const g=new T.Group();g.position.set(x,.245,z);root.add(g);
    const lower=bevel(w,d,height,.11,.025,graphite,g);
    lower.rotation.x=-Math.PI/2;lower.position.y=height/2;
    const top=bevel(w-.08,d-.08,.026,.09,.009,mat('#273443',.64,.30),g);
    top.rotation.x=-Math.PI/2;top.position.y=height+.015;
    const accent=block(w*.46,.008,.008,quietCyan,g,0,height+.016,d/2-.02);
    contactShadow(x,z,w+.35,d+.35,.65);
    return {g,y:height+.031,accent};
  }
  const factory=pedestal(-1.26,.64,1.20,.98,.15);
  const office=pedestal(1.22,.67,1.02,1.02,.29);
  const depot=pedestal(-1.10,-1.05,1.22,.91,.22);
  const hub=pedestal(.32,-.46,1.02,1.07,.17);

  // Site A: small sawtooth factory, loading doors and an exposed service spine.
  const f=new T.Group();f.position.y=factory.y;factory.g.add(f);
  const fbody=bevel(1.04,.43,.70,.025,.012,mat('#23313c',.63,.26),f);
  fbody.position.y=.215;
  const saw=new T.Shape();saw.moveTo(-.52,0);
  for(let i=0;i<3;i++){
    const x=-.52+i*(1.04/3);
    saw.lineTo(x+.265,.17);saw.lineTo(x+1.04/3,.025);
    if(i<2)saw.lineTo(x+1.04/3,0);
  }
  saw.lineTo(.52,0);saw.closePath();
  const sawGeo=new T.ExtrudeGeometry(saw,{depth:.73,bevelEnabled:false,steps:1,curveSegments:1});
  sawGeo.translate(0,0,-.365);
  const sawMesh=mesh(sawGeo,roofMat,f);sawMesh.position.y=.425;
  for(let i=0;i<3;i++){
    const x=-.52+i*(1.04/3);
    const skylight=block(.070,.13,.67,glass.clone(),f,x+.296,.525,0);
    skylight.rotation.z=-.49;skylight.castShadow=false;
    const sill=block(.010,.135,.70,edge,f,x+.333,.495,0);sill.rotation.z=-.49;
    const door=block(.218,.275,.013,dark,f,-.32+i*.32,.153,.357);
    for(let j=0;j<4;j++)block(.203,.006,.008,steel,f,-.32+i*.32,.06+j*.052,.370);
    block(.025,.024,.007,cyanMat,f,-.32+i*.32,.335,.368);
  }
  const service=block(.09,.34,.52,steel,f,-.56,.20,-.02);
  block(.11,.045,.56,edge,f,-.56,.383,-.02);
  const factoryPlaque=label('PLANTA 01',.38,.064,{fontSize:86,color:'#94b6c4'},f);
  factoryPlaque.position.set(0,.425,.371);

  // Site B: architectural dark glass, fine mullions and an offset entry canopy.
  const o=new T.Group();o.position.y=office.y;office.g.add(o);
  const ocore=bevel(.70,.72,.67,.035,.018,graphite,o);ocore.position.y=.36;
  const oglass=block(.746,.70,.716,glass.clone(),o,0,.374,.01);oglass.castShadow=false;
  for(let j=0;j<4;j++){
    const y=.10+j*.195;
    block(.78,.018,.75,steel,o,0,y,0);
  }
  for(let i=0;i<5;i++)block(.012,.69,.016,edge,o,-.36+i*.18,.375,.378);
  for(let i=0;i<4;i++)block(.016,.69,.012,edge,o,-.385,.375,-.30+i*.20);
  const interiorGlow=new T.MeshBasicMaterial({color:'#2b8294',transparent:true,opacity:.18,depthWrite:false});
  block(.66,.55,.005,interiorGlow,o,0,.37,.367).castShadow=false;
  block(.012,.54,.60,interiorGlow,o,-.371,.37,.0).castShadow=false;
  const officeRoof=bevel(.84,.80,.048,.035,.013,steel,o);officeRoof.rotation.x=-Math.PI/2;officeRoof.position.y=.762;
  for(let i=0;i<3;i++)block(.14,.025,.25,roofMat,o,-.20+i*.20,.80,-.10);
  const entrance=bevel(.27,.31,.025,.025,.007,dark,o);entrance.position.set(.11,.155,.40);
  block(.38,.027,.21,edge,o,.11,.33,.445);
  block(.20,.011,.01,cyanMat,o,.11,.322,.548);
  const officePlaque=label('SEDE 02',.33,.06,{fontSize:87,color:'#b2cbd6'},o);
  officePlaque.position.set(0,.675,.39);

  // Site C: a distribution shed with a gabled roof, roof panels and loading bay.
  const d=new T.Group();d.position.y=depot.y;depot.g.add(d);
  block(1.03,.37,.64,mat('#2b3540',.66,.30),d,0,.185,0);
  const profile=new T.Shape();profile.moveTo(-.57,0);profile.lineTo(0,.22);
  profile.lineTo(.57,0);profile.closePath();
  const roofGeometry=new T.ExtrudeGeometry(profile,{depth:.73,bevelEnabled:false,steps:1});roofGeometry.translate(0,0,-.365);
  const roof=mesh(roofGeometry,roofMat,d);roof.position.y=.365;
  // Three inset photovoltaic-looking architectural roof modules.
  for(let i=0;i<3;i++){
    const p=block(.36,.015,.16,mat('#0b2939',.19,.62),d,-.28,.477,-.22+i*.22);p.rotation.z=.368;
    const rails=block(.36,.005,.005,quietCyan,d,-.28,.49,-.22+i*.22);rails.rotation.z=.368;
  }
  for(let i=0;i<2;i++){
    block(.28,.255,.014,dark,d,-.25+i*.50,.13,.329);
    for(let j=0;j<4;j++)block(.26,.006,.005,steel,d,-.25+i*.50,.05+j*.054,.34);
    block(.025,.020,.01,cyanMat,d,-.25+i*.50,.30,.343);
  }
  block(.76,.04,.17,steel,d,0,.02,.38);
  const depotPlaque=label('NODO 03',.34,.064,{fontSize:86,color:'#94b6c4'},d);
  depotPlaque.position.set(0,.363,.37);

  // Central server tower: suspended aluminum fins and graphite rack bays.
  const tower=new T.Group();tower.position.y=hub.y;hub.g.add(tower);
  const towerCase=bevel(.74,1.30,.68,.045,.023,steel,tower);towerCase.position.y=.65;
  const towerBody=bevel(.66,1.23,.692,.032,.014,graphite,tower);towerBody.position.y=.65;
  const frontGlass=block(.605,1.12,.015,glass.clone(),tower,0,.65,.363);frontGlass.castShadow=false;
  const rackLeds=[];
  for(let j=0;j<6;j++){
    const y=.20+j*.18;
    const slot=bevel(.55,.117,.031,.012,.003,dark,tower);slot.position.set(0,y,.368);
    block(.36,.006,.005,steel,tower,-.065,y+.020,.387);
    block(.27,.006,.005,steel,tower,-.11,y-.020,.387);
    const ledMat=glow(pal.cyan,1.2);
    const led=block(.022,.018,.009,ledMat,tower,.225,y,.395);rackLeds.push(led);
    block(.03,.012,.008,quietCyan,tower,.172,y,.394);
  }
  for(let i=0;i<7;i++)block(.033,.055,.59,edge,tower,-.374,.17+i*.16,-.01);
  const crown=bevel(.85,.78,.075,.06,.018,edge,tower);crown.rotation.x=-Math.PI/2;crown.position.y=1.35;
  const crownInset=bevel(.70,.61,.018,.05,.006,graphite,tower);crownInset.rotation.x=-Math.PI/2;crownInset.position.y=1.395;
  const beaconMat=glow(pal.cyan,1.7);
  const beacon=disc(.10,.018,beaconMat,tower,12);beacon.position.set(0,1.416,0);
  const towerName=label('CORE',.24,.065,{fontSize:94,color:'#c8d9df'},tower);towerName.position.set(0,1.22,.389);

  // Recessed circuit channels with actual moving packets directed into the hub.
  const routes=[
    [[-.94,.428,1.15],[-.71,.30,1.34],[-.25,.285,1.35],[.02,.285,1.12],[.02,.285,.35],[.26,.445,.08]],
    [[.67,.555,.67],[.59,.31,.67],[.26,.285,.67],[.23,.285,.34],[.47,.445,.08]],
    [[-.47,.485,-.91],[-.34,.32,-.82],[-.30,.30,-.65],[-.19,.445,-.46]]
  ];
  const paths=[];
  const conduits=[];
  const packets=[];
  const portMats=[];
  routes.forEach((points,i)=>{
    const channelCurve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)),false,'centripetal');
    const channel=mesh(new T.TubeGeometry(channelCurve,48,.028,6,false),dark);channel.castShadow=false;
    // The luminous core rides on the exposed upper groove, not inside the
    // opaque conduit. Packets follow this same visible optical rail.
    const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(p[0],p[1]+.038,p[2])),false,'centripetal');paths.push(curve);
    const conduitMat=glow(i===1?pal.green:pal.cyan,2.4);
    const conduit=mesh(new T.TubeGeometry(curve,48,.011,6,false),conduitMat);conduit.castShadow=false;conduits.push(conduit);
    const start=points[0];const portMat=glow(pal.cyan,1.3);portMats.push(portMat);
    const port=disc(.038,.018,portMat,root,6);port.position.set(...start);port.castShadow=false;
    for(let j=0;j<3;j++){
      const pm=glow(i===1?pal.green:pal.cyan,4.5);
      const packet=mesh(new T.OctahedronGeometry(.037,0),pm);packet.castShadow=false;
      packets.push({packet,curve,branch:i,offset:j/3+i*.08});
    }
  });
  // Small, low-contrast underfloor guide traces are fixed to the architecture.
  line([[-1.89,.249,1.40],[-1.89,.249,1.04],[-1.72,.249,.90]],'#2a6172',.24);
  line([[1.83,.249,1.28],[1.83,.249,-.90],[1.43,.249,-1.30]],'#2a6172',.24);
  line([[-.35,.249,1.40],[.08,.249,1.40],[.37,.249,1.13]],'#2a6172',.24);

  // A six-piece mechanical shield assembles above the central tower.
  const badge=new T.Group();root.add(badge);badge.position.set(.32,2.77,-.46);badge.rotation.y=-Math.PI/4;
  const wedges=[];
  const radius=.53;
  for(let i=0;i<6;i++){
    const a=Math.PI/6+i*Math.PI/3,b=a+Math.PI/3;
    const s=new T.Shape();s.moveTo(0,0);s.lineTo(Math.cos(a)*radius,Math.sin(a)*radius);
    s.lineTo(Math.cos(b)*radius,Math.sin(b)*radius);s.closePath();
    const geometry=new T.ExtrudeGeometry(s,{depth:.045,bevelEnabled:true,bevelThickness:.009,bevelSize:.008,bevelSegments:1,steps:1,curveSegments:1});
    const material=mat(i%2?'#124d3d':'#143e34',.27,.66);material.transparent=true;material.emissive=new T.Color('#063322');
    const piece=mesh(geometry,material,badge);piece.castShadow=false;
    const mid=(a+b)/2;wedges.push({piece,dx:Math.cos(mid),dy:Math.sin(mid),angle:mid});
  }
  const hexPoints=[];for(let i=0;i<=6;i++){const a=Math.PI/6+i*Math.PI/3;hexPoints.push([Math.cos(a)*radius,Math.sin(a)*radius,.064]);}
  const rimMat=glow(pal.green,2);rimMat.transparent=true;
  const badgeRim=tube(hexPoints,.009,rimMat,badge);badgeRim.castShadow=false;
  const checkShape=new T.Shape();checkShape.moveTo(-.235,-.015);checkShape.lineTo(-.093,-.155);
  checkShape.lineTo(.247,.180);checkShape.lineTo(.181,.249);checkShape.lineTo(-.093,-.020);
  checkShape.lineTo(-.171,.057);checkShape.closePath();
  const checkMat=mat('#c9e6dd',.23,.60);checkMat.emissive=new T.Color('#37ac81');checkMat.emissiveIntensity=.42;checkMat.transparent=true;
  const check=mesh(new T.ExtrudeGeometry(checkShape,{depth:.033,bevelEnabled:true,bevelSegments:1,bevelSize:.009,bevelThickness:.009,steps:1}),checkMat,badge);
  check.position.z=.076;check.castShadow=false;
  const badgeLabel=label('SEDES SINCRONIZADAS',1.12,.083,{color:'#8de8c6',fontSize:79},badge);badgeLabel.position.set(0,-.61,.08);
  badgeLabel.material.transparent=true;
  // Two quiet hexagonal ripple rings, restrained to the certification moment.
  const waveRings=[];
  for(let i=0;i<2;i++){
    const wm=new T.MeshBasicMaterial({color:pal.green,transparent:true,opacity:0,depthWrite:false});
    const shape=new T.Shape();for(let j=0;j<6;j++){const a=Math.PI/6+j*Math.PI/3;const x=Math.cos(a)*.59,y=Math.sin(a)*.59;j?shape.lineTo(x,y):shape.moveTo(x,y);}shape.closePath();
    const hole=new T.Path();for(let j=0;j<6;j++){const a=Math.PI/6-j*Math.PI/3;const x=Math.cos(a)*.582,y=Math.sin(a)*.582;j?hole.lineTo(x,y):hole.moveTo(x,y);}hole.closePath();shape.holes.push(hole);
    const m=mesh(new T.ShapeGeometry(shape),wm,badge);m.position.z=.01;m.castShadow=false;waveRings.push(m);
  }
  const beamMaterial=new T.MeshBasicMaterial({color:pal.green,transparent:true,opacity:0,depthWrite:false,side:T.DoubleSide,blending:T.AdditiveBlending});
  const beam=mesh(new T.CylinderGeometry(.30,.095,.70,6,1,true),beamMaterial);beam.position.set(.32,2.16,-.46);beam.castShadow=false;
  const hubPulse=new T.PointLight(pal.green,0,2.4,2);hubPulse.position.set(.32,2.2,-.46);ctx.scene.add(hubPulse);
  const cyan=new T.Color(pal.cyan),green=new T.Color(pal.green);

  function update(time){
    const t=((time%8)+8)%8;
    const confirm=smooth(2.2,3.1,t)*(1-smooth(6.3,7.25,t));
    const assembled=smooth(2.05,3.05,t)*(1-smooth(6.45,7.3,t));
    const labelFade=smooth(3.05,3.45,t)*(1-smooth(6.1,6.7,t));
    const ripple=smooth(3.05,3.25,t)*(1-smooth(5.45,5.85,t));
    badge.visible=assembled>.001;
    badge.position.y=2.77+.018*Math.sin(t*Math.PI/4);
    wedges.forEach(({piece,dx,dy},i)=>{
      const partial=smooth(2.05+i*.04,2.82+i*.04,t)*(1-smooth(6.45+i*.025,7.15+i*.025,t));
      const spread=(1-partial)*.31;piece.position.set(dx*spread,dy*spread,-(1-partial)*.16);
      piece.rotation.y=(i%2?-1:1)*(1-partial)*.55;
      piece.material.opacity=assembled;piece.material.emissiveIntensity=.18*confirm;
    });
    badgeRim.material.opacity=confirm;
    check.material.opacity=confirm;
    check.scale.setScalar(.83+.17*smooth(2.88,3.28,t));
    check.position.z=.076+.08*(1-smooth(2.88,3.28,t));
    badgeLabel.material.opacity=labelFade;
    waveRings.forEach((m,i)=>{
      const p=((t-3.12+i*.68)%1.6+1.6)%1.6/1.6;
      m.scale.setScalar(1+p*.28);m.material.opacity=(1-p)*.22*ripple;
    });
    beamMaterial.opacity=.035*confirm;hubPulse.intensity=.45*confirm;
    beaconMat.color.copy(cyan).lerp(green,confirm);beaconMat.emissive.copy(beaconMat.color);
    beaconMat.emissiveIntensity=1.4+.4*Math.sin(t*Math.PI/2)**2;
    rackLeds.forEach((led,j)=>{
      led.material.color.copy(cyan).lerp(green,confirm);led.material.emissive.copy(led.material.color);
      led.material.emissiveIntensity=.65+1.2*(.5+.5*Math.sin(t*Math.PI+j*.9));
    });
    portMats.forEach((m,i)=>{m.color.copy(cyan).lerp(green,confirm);m.emissive.copy(m.color);m.emissiveIntensity=.9+.35*Math.sin(t*Math.PI+i)**2;});
    conduits.forEach((m,i)=>{m.material.emissiveIntensity=2.3+.45*Math.sin(t*Math.PI/2+i)**2;});
    packets.forEach(({packet,curve,offset,branch})=>{
      const u=(t/2+offset)%1;packet.position.copy(curve.getPointAt(u));
      const scale=Math.max(.001,Math.sqrt(Math.sin(u*Math.PI)));packet.scale.setScalar(scale);
      packet.rotation.set(t*Math.PI/4+branch,0,t*Math.PI/4);
      packet.material.color.copy(cyan).lerp(green,confirm*.7+branch*.12);
      packet.material.emissive.copy(packet.material.color);
    });
  }
  update(0);
  return {update,span:6.2,targetY:1.20,posterTime:4.9,title:'Red de sedes'};
}
