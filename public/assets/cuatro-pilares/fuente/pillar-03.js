/*
 * Pillar 03 — original document / cryptographic vault diorama.
 * All SHA-256, NTP, digest, clock and matrix marks are illustrative artwork.
 * The decorative matrix is NOT a valid QR code. This scene performs no signing,
 * hashing, timestamping, network requests, certification or legal verification.
 */
function buildPillar(ctx) {
  'use strict';
  const {T,root,mat,glow,mesh,box,bevel,line,ring,disc,label,panel,
    makeBase,contactShadow,clamp,smooth,pal}=ctx;
  const TAU=Math.PI*2;
  const graph=mat(pal.graphite,.38,.58);
  const metal=mat('#516273',.25,.78);
  const dark=mat('#070e16',.34,.36);
  const sapphire=mat('#18384c',.29,.48);
  const cyanMat=glow(pal.cyan,1.9);
  const cyanColor=new T.Color(pal.cyan);
  const greenColor=new T.Color(pal.green);
  const accentMat=glow(pal.cyan,1.25);
  const groups=[];

  function addGroup(x,y,z,parent=root) {
    const g=new T.Group();g.position.set(x,y,z);parent.add(g);return g;
  }
  function shape(points) {
    const s=new T.Shape();points.forEach((p,i)=>i?s.lineTo(p[0],p[1]):s.moveTo(p[0],p[1]));s.closePath();return s;
  }
  function polygon(points,depth,material,parent,bevelSize=.014) {
    const geo=new T.ExtrudeGeometry(shape(points),{depth,steps:1,curveSegments:1,
      bevelEnabled:bevelSize>0,bevelSegments:1,bevelSize,bevelThickness:bevelSize});
    return mesh(geo,material,parent);
  }
  function setOpacity(object,value) {
    object.visible=value>.0001;
    if(object.material)object.material.opacity=value;
  }
  function bevelAt(w,h,d,cut,b,material,parent,x,y,z) {
    const m=bevel(w,h,d,cut,b,material,parent);m.position.set(x,y,z);return m;
  }

  // Two machined sockets on a single architectural base.
  makeBase(4.32,3.18,.25);
  contactShadow(-.96,.19,1.63,1.22,.45,.247);
  contactShadow(.96,-.27,1.85,1.45,.58,.248);
  const docSocket=disc(.79,.11,graph,root,12);docSocket.position.set(-.97,.305,.19);
  const socketUpper=disc(.73,.025,metal,root,12);socketUpper.position.set(-.97,.369,.19);
  const socketCore=disc(.67,.018,sapphire,root,12);socketCore.position.set(-.97,.39,.19);
  const socketRing=ring(.60,.006,accentMat,root);socketRing.rotation.x=-Math.PI/2;socketRing.position.set(-.97,.407,.19);
  const shieldSocket=disc(.89,.14,graph,root,8);shieldSocket.position.set(.95,.33,-.28);
  const shieldStep=disc(.81,.045,metal,root,8);shieldStep.position.set(.95,.422,-.28);
  const shieldTop=disc(.75,.018,dark,root,8);shieldTop.position.set(.95,.454,-.28);
  for(let i=0;i<8;i++){
    const a=TAU*i/8+Math.PI/8;
    const pin=disc(.025,.014,metal,root,6);pin.position.set(.95+Math.cos(a)*.71,.472,-.28+Math.sin(a)*.71);
  }
  // A quiet connection routed around the two sockets.
  line([[-1.65,.255,1.03],[-1.35,.255,1.31],[-.24,.255,1.31],[.10,.255,.98],[.71,.255,.98]],'#355d6f',.44);
  line([[1.77,.255,.69],[1.77,.255,-.88],[1.24,.255,-1.24],[.41,.255,-1.24]],'#355d6f',.32);
  for(const p of [[-.24,.265,1.31],[.71,.265,.98],[.41,.265,-1.24]]){
    const n=disc(.027,.011,accentMat,root,6);n.position.set(...p);
  }
  const socketName=label('SHA-256',.59,.095,{color:'#91c7d5',fontSize:90},root);
  socketName.position.set(-1.04,.36,.98);socketName.rotation.y=-.25;
  const footer=label('INTEGRIDAD DOCUMENTAL',1.78,.115,{color:'#91a8b9',fontSize:62},root);
  footer.position.set(.48,.23,1.54);

  // A luminous document whose mesh actually rolls into a faceted cylinder.
  const doc=addGroup(-.98,1.89,.14);doc.rotation.y=-.29;
  const paperWidth=1.43,paperHeight=1.90,segments=16;
  const documentPanel=panel(paperWidth,paperHeight,(g,w,h)=>{
    g.fillStyle='#1b3546';g.fillRect(0,0,w,h);
    g.strokeStyle='#4b6c7d';g.lineWidth=2;g.strokeRect(28,28,w-56,h-56);
    g.fillStyle='#b6d0dd';g.font='500 22px Arial';g.fillText('REGISTRO DIGITAL',82,105);
    g.fillStyle='#e0eff4';g.font='500 51px Arial';g.fillText('Integridad',82,194);g.fillText('documental',82,255);
    g.fillStyle='#3ee2fc';g.fillRect(82,292,108,5);
    // Abstract body copy: actual paragraph text is intentionally omitted.
    [784,685,753,580].forEach((length,i)=>{g.fillStyle=i===0?'#537487':'#416175';g.fillRect(82,363+i*45,length,8);});
    g.strokeStyle='#436678';g.lineWidth=2;g.beginPath();g.moveTo(82,584);g.lineTo(w-82,584);g.stroke();
    // Original decorative binary matrix, not a valid or scannable QR.
    const cell=10,originX=86,originY=646;
    g.fillStyle='#7caebf';
    for(let y=0;y<21;y++)for(let x=0;x<21;x++){
      const finder=(x<6&&y<6)||(x>14&&y<6)||(x<6&&y>14);
      const value=((x*31+y*17+x*y*7+13)%11)<5;
      if(value&&!finder)g.fillRect(originX+x*cell,originY+y*cell,cell-2,cell-2);
    }
    for(const [x,y] of [[0,0],[15,0],[0,15]]){
      g.strokeStyle='#98c5d2';g.lineWidth=6;g.strokeRect(originX+x*cell+3,originY+y*cell+3,48,48);
      g.fillStyle='#7caebf';g.fillRect(originX+x*cell+19,originY+y*cell+19,17,17);
    }
    g.fillStyle='#d3eaf1';g.font='500 49px Arial';g.fillText('SHA-256',366,705);
    g.fillStyle='#77a7b9';g.font='400 22px monospace';g.fillText('7D3A · 91C8 · 4F20',368,755);
    g.fillStyle='#4f7e92';g.font='400 18px Arial';g.fillText('HUELLA DIGITAL',369,801);
    g.strokeStyle='#46687b';g.lineWidth=2;g.beginPath();g.moveTo(82,929);g.lineTo(w-82,929);g.stroke();
    g.fillStyle='#537586';g.font='400 17px Arial';g.fillText('DOCUMENTO / 03',82,h-74);
    g.textAlign='right';g.fillText('256 BIT',w-82,h-74);g.textAlign='left';
  },doc);
  const oldGeometry=documentPanel.mesh.geometry;
  const positions=[],uvs=[],indices=[];
  for(let i=0;i<=segments;i++){
    const u=i/segments;
    positions.push((u-.5)*paperWidth,-paperHeight/2,0,(u-.5)*paperWidth,paperHeight/2,0);
    uvs.push(u,0,u,1);
    if(i<segments){const n=i*2;indices.push(n,n+2,n+1,n+2,n+3,n+1);}
  }
  const paperGeometry=new T.BufferGeometry();paperGeometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));
  paperGeometry.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));paperGeometry.setIndex(indices);paperGeometry.computeVertexNormals();
  documentPanel.mesh.geometry=paperGeometry;oldGeometry.dispose();
  documentPanel.texture.colorSpace=T.SRGBColorSpace;
  const oldPaperMaterial=documentPanel.mesh.material;
  const paperMaterial=new T.MeshStandardMaterial({map:documentPanel.texture,color:'#c0d9e4',metalness:.24,roughness:.33,
    emissive:'#0c3042',emissiveIntensity:.23,transparent:true,opacity:.94,side:T.DoubleSide,flatShading:true});
  documentPanel.mesh.material=paperMaterial;
  if(oldPaperMaterial&&oldPaperMaterial.dispose)oldPaperMaterial.dispose();
  documentPanel.mesh.castShadow=false;documentPanel.mesh.receiveShadow=true;documentPanel.mesh.frustumCulled=false;
  // Separate printed stamp layer; its deformation follows the same sheet.
  const stamp=panel(paperWidth,paperHeight,(g,w,h)=>{
    g.clearRect(0,0,w,h);
    const cy=1080;
    g.strokeStyle='#3ef0ae';g.lineWidth=6;g.beginPath();
    for(let i=0;i<=6;i++){const a=TAU*i/6+Math.PI/6;const x=163+Math.cos(a)*71,y=cy+Math.sin(a)*71;i?g.lineTo(x,y):g.moveTo(x,y);}g.stroke();
    g.lineWidth=9;g.beginPath();g.moveTo(132,cy);g.lineTo(155,cy+23);g.lineTo(194,cy-25);g.stroke();
    g.fillStyle='#91f1c8';g.font='500 40px Arial';g.fillText('REGISTRO NTP',284,1066);
    // Fixed, illustrative clock text; this is not an actual trusted timestamp.
    g.fillStyle='#6dab9a';g.font='400 25px monospace';g.fillText('09:41:06 UTC',286,1119);
  },doc);
  stamp.mesh.geometry.dispose();stamp.mesh.geometry=paperGeometry.clone();
  stamp.mesh.material.transparent=true;stamp.mesh.material.depthWrite=false;stamp.mesh.material.opacity=0;
  stamp.mesh.material.side=T.DoubleSide;stamp.mesh.castShadow=false;stamp.mesh.receiveShadow=false;stamp.mesh.frustumCulled=false;
  const borderVertices=(segments+1)*2+1;
  const borderGeo=new T.BufferGeometry();borderGeo.setAttribute('position',new T.Float32BufferAttribute(new Float32Array(borderVertices*3),3));
  const border=new T.Line(borderGeo,new T.LineBasicMaterial({color:'#7fc3d7',transparent:true,opacity:.49,depthWrite:false}));
  border.frustumCulled=false;doc.add(border);
  const foldLines=[];
  for(let i=2;i<segments;i+=2){
    const l=line([[0,-paperHeight/2,0],[0,paperHeight/2,0]],'#77bed4',.025,doc);l.frustumCulled=false;foldLines.push({i,l});
  }
  function warped(u,curl){
    const theta=(u-.5)*5.30,r=paperWidth/5.30;
    return [T.MathUtils.lerp((u-.5)*paperWidth,Math.sin(theta)*r,curl),(Math.cos(theta)-1)*r*curl];
  }
  function deform(curl){
    const p=paperGeometry.attributes.position.array,sp=stamp.mesh.geometry.attributes.position.array;
    for(let i=0;i<=segments;i++){
      const [x,z]=warped(i/segments,curl);
      for(let row=0;row<2;row++){const k=(i*2+row)*3;p[k]=x;p[k+2]=z;sp[k]=x;sp[k+2]=z+.007;}
    }
    paperGeometry.attributes.position.needsUpdate=true;paperGeometry.computeVertexNormals();
    stamp.mesh.geometry.attributes.position.needsUpdate=true;
    const bp=borderGeo.attributes.position.array;let j=0;
    for(let i=0;i<=segments;i++){const [x,z]=warped(i/segments,curl);bp[j++]=x;bp[j++]=paperHeight/2;bp[j++]=z+.006;}
    for(let i=segments;i>=0;i--){const [x,z]=warped(i/segments,curl);bp[j++]=x;bp[j++]=-paperHeight/2;bp[j++]=z+.006;}
    const [x,z]=warped(0,curl);bp[j++]=x;bp[j++]=paperHeight/2;bp[j++]=z+.006;borderGeo.attributes.position.needsUpdate=true;
    foldLines.forEach(({i,l})=>{const [x,z]=warped(i/segments,curl);const a=l.geometry.attributes.position.array;a[0]=a[3]=x;a[2]=a[5]=z+.008;l.geometry.attributes.position.needsUpdate=true;l.material.opacity=.02+.14*curl;});
  }

  // Precision shield chassis; geometric tiles assemble inside a permanent rim.
  const shield=addGroup(.95,1.58,-.29);shield.rotation.y=-.28;
  const outline=[[-.71,.75],[-.51,.94],[.51,.94],[.71,.75],[.71,.03],[.51,-.51],[0,-.94],[-.51,-.51],[-.71,.03]];
  const back=polygon(outline,.105,graph,shield,.028);back.position.z=-.10;
  const rimShape=shape(outline);
  const hole=new T.Path();const inner=outline.map(([x,y])=>[x*.91,y*.91]);
  inner.slice().reverse().forEach((p,i)=>i?hole.lineTo(p[0],p[1]):hole.moveTo(p[0],p[1]));hole.closePath();rimShape.holes.push(hole);
  const rimGeo=new T.ExtrudeGeometry(rimShape,{depth:.065,steps:1,curveSegments:1,bevelEnabled:true,bevelSegments:1,bevelSize:.012,bevelThickness:.012});
  const shieldRim=mesh(rimGeo,metal,shield);shieldRim.position.z=.022;
  const rimLight=line([...inner,inner[0]].map(([x,y])=>[x,y,.106]),pal.cyan,.68,shield);
  const A=[-.63,.72],B=[0,.84],C=[.63,.72],D=[-.63,.03],E=[0,.07],F=[.63,.03],G=[-.45,-.45],H=[0,-.83],I=[.45,-.45];
  const tileVertices=[[A,B,E],[B,C,E],[A,D,E],[C,F,E],[D,G,E],[F,I,E],[G,H,E],[I,H,E]];
  const tiles=tileVertices.map((points,i)=>{
    const center=points.reduce((s,p)=>[s[0]+p[0]/3,s[1]+p[1]/3],[0,0]);
    const local=points.map(p=>[(p[0]-center[0])*.96,(p[1]-center[1])*.96]);
    const tileMat=mat(i%3===0?'#294d60':i%3===1?'#203749':'#314756',.25,.63);
    tileMat.transparent=true;tileMat.opacity=0;
    const piece=polygon(local,.025,tileMat,shield,.006);piece.castShadow=false;
    return {piece,center,start:.28+i*.105,index:i};
  });
  // An inset lock has a polygonal shackle and a dimensional keyhole.
  const lock=addGroup(0,.02,.125,shield);
  const lockBody=bevelAt(.91,.64,.17,.09,.023,mat('#314859',.29,.76),lock,0,-.17,.035);
  const bodyInset=bevelAt(.80,.52,.022,.065,.009,dark,lock,0,-.17,.13);
  const shackleShape=[[-.35,.02],[-.35,.32],[-.26,.53],[-.10,.63],[.10,.63],[.26,.53],[.35,.32],[.35,.02],[.205,.02],[.205,.29],[.15,.40],[.055,.47],[-.055,.47],[-.15,.40],[-.205,.29],[-.205,.02]];
  const shackle=polygon(shackleShape,.075,metal,lock,.012);shackle.position.z=-.027;
  const keyhole=disc(.073,.017,dark,lock,12);keyhole.rotation.x=Math.PI/2;keyhole.position.set(0,-.113,.157);
  const keyStem=box(.055,.11,.018,dark,lock);keyStem.position.set(0,-.196,.157);
  const lockIndicator=box(.26,.014,.014,accentMat,lock);lockIndicator.position.set(0,-.365,.157);
  const lockStuds=[];
  for(const x of [-.322,.322])for(const y of [-.355,.013]){
    const stud=disc(.017,.012,metal,lock,6);stud.rotation.x=Math.PI/2;stud.position.set(x,y,.154);lockStuds.push(stud);
  }
  const smallCode=label('256',.17,.075,{color:'#66899d',fontSize:92},lock);smallCode.position.set(.26,-.17,.158);
  const topCode=label('ARCHIVE / 03',.74,.082,{color:'#8aabbc',fontSize:66},shield);topCode.position.set(0,.78,.11);
  // A separate geometric seal appears after the illustrative timestamp sweep.
  const seal=addGroup(.52,-.66,.25,shield);seal.rotation.z=-.03;
  const sealMat=mat('#105440',.3,.62);sealMat.transparent=true;
  const sealBody=disc(.215,.045,sealMat,seal,6);sealBody.rotation.x=Math.PI/2;
  const sealGlow=glow(pal.green,1.65);sealGlow.transparent=true;
  const sealRing=ring(.182,.008,sealGlow,seal);sealRing.position.z=.028;
  const tick=polygon([[-.10,.0],[-.035,-.065],[.107,.08],[.073,.116],[-.035,-.009],[-.067,.032]],.009,sealGlow,seal,.002);tick.position.z=.03;
  seal.traverse(o=>{if(o.isMesh)o.castShadow=false;});

  // A vertical blade stamps the sheet after it unrolls.
  const laser=addGroup(0,0,.04,doc);
  const beamMat=glow('#92f1ff',2.1);beamMat.transparent=true;
  const beam=box(.009,1.97,.009,beamMat,laser);beam.castShadow=false;
  const washMat=new T.MeshBasicMaterial({color:pal.cyan,transparent:true,opacity:.08,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending});
  const wash=mesh(new T.PlaneGeometry(.094,1.97),washMat,laser);wash.castShadow=false;wash.receiveShadow=false;
  const caps=[];
  for(const y of [-.99,.99]){const cap=box(.08,.009,.012,beamMat,laser);cap.position.y=y;cap.castShadow=false;caps.push(cap);}
  // Restrained orbiting hash blocks; their paths are exactly eight-second periodic.
  const orbiters=[];
  for(let i=0;i<3;i++){
    const node=bevel(.087,.087,.087,.013,.009,mat('#425f70',.24,.78),root);
    const dot=box(.037,.037,.004,cyanMat,node);dot.position.z=.049;dot.castShadow=false;
    node.castShadow=false;
    const trail=line(new Array(10).fill(0).map(()=>[0,0,0]),pal.cyan,.13,root);trail.frustumCulled=false;
    orbiters.push({node,trail,phase:TAU*i/3});
  }

  let lastCurl=-1;
  function update(seconds){
    const t=((seconds%8)+8)%8,phase=t*TAU/8;
    const reset=1-smooth(6.48,7.75,t);
    const assembled=smooth(.38,1.75,t)*reset;
    const locked=smooth(1.72,2.45,t)*(1-smooth(6.55,7.65,t));
    const curl=smooth(1.6,2.62,t)*(1-smooth(3.45,4.35,t));
    const scanning=smooth(4.42,4.62,t)*(1-smooth(5.48,5.69,t));
    const sweep=smooth(4.53,5.56,t);
    const verified=smooth(4.78,5.10,t)*(1-smooth(6.44,7.20,t));
    doc.position.y=1.89+Math.sin(phase)*.021;
    doc.rotation.y=-.29+Math.sin(phase)*.012;
    if(Math.abs(curl-lastCurl)>.000001){deform(curl);lastCurl=curl;}
    tiles.forEach(({piece,center,start,index})=>{
      const p=smooth(start,start+.80,t)*reset;
      const distance=1-p;
      piece.position.set(center[0]+Math.sign(center[0]||1)*.24*distance,
        center[1]+(.23+index*.013)*distance,.075+.20*distance);
      piece.rotation.z=Math.sign(center[0]||1)*distance*.16;
      piece.material.opacity=p*.98;piece.visible=p>.0001;
    });
    shackle.position.y=.215*(1-locked);
    lock.position.z=.125+.026*(1-locked);
    const accent=cyanColor.clone().lerp(greenColor,verified);
    accentMat.color.copy(accent);accentMat.emissive.copy(accent);
    accentMat.emissiveIntensity=1.0+.3*assembled;
    rimLight.material.color.copy(accent);rimLight.material.opacity=.36+.32*assembled;
    stamp.mesh.visible=verified>.0001;stamp.mesh.material.opacity=verified;
    seal.visible=verified>.0001;
    const pop=smooth(4.78,5.12,t);seal.scale.setScalar(.84+.16*pop);
    sealMat.opacity=verified;sealGlow.opacity=verified;
    laser.visible=scanning>.0001;laser.position.x=(sweep-.5)*(paperWidth+.06);
    beamMat.opacity=scanning;beamMat.emissiveIntensity=2.1*scanning;washMat.opacity=.09*scanning;
    orbiters.forEach(({node,trail,phase:offset},i)=>{
      const a=phase+offset;
      node.position.set(Math.cos(a)*1.80,.52+Math.sin(a*2)*.065,Math.sin(a)*1.30);
      node.rotation.set(Math.sin(a)*.42,phase+offset,Math.cos(a)*.28);
      const p=trail.geometry.attributes.position.array;
      for(let j=0;j<10;j++){const b=a-.025*j;p[j*3]=Math.cos(b)*1.8;p[j*3+1]=.52+Math.sin(b*2)*.065;p[j*3+2]=Math.sin(b)*1.3;}
      trail.geometry.attributes.position.needsUpdate=true;
    });
  }
  deform(0);update(0);
  return {update,span:6.2,targetY:1.2,posterTime:5.1,title:'Integridad documental'};
}
