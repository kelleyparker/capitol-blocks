'use strict';
(() => {
const $=id=>document.getElementById(id), canvas=$('world'), gl=canvas.getContext('webgl',{antialias:true,alpha:false});
if(!gl){$('error').textContent='WebGL is unavailable. Please enable hardware acceleration in your browser.';$('play').disabled=true;return;}
const vs=`attribute vec3 p;attribute vec3 c;uniform mat4 vp;varying vec3 color;varying vec3 world;void main(){gl_Position=vp*vec4(p,1.);color=c;world=p;}`;
const fs=`precision mediump float;varying vec3 color;varying vec3 world;uniform vec3 eye;uniform vec3 fog;void main(){float f=smoothstep(160.,440.,distance(world,eye));gl_FragColor=vec4(mix(color,fog,f),1.);}`;
function shader(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
const prog=gl.createProgram();gl.attachShader(prog,shader(gl.VERTEX_SHADER,vs));gl.attachShader(prog,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(prog);if(!gl.getProgramParameter(prog,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(prog));gl.useProgram(prog);
const data=[],solids=[];let seed=42;function rand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
function rgb(h){return [parseInt(h.slice(0,2),16)/255,parseInt(h.slice(2,4),16)/255,parseInt(h.slice(4,6),16)/255];}
const faces=[[[0,1,0],[0,1,1],[1,1,1],[1,1,0],1],[[0,0,1],[0,0,0],[1,0,0],[1,0,1],.55],[[1,0,0],[1,1,0],[1,1,1],[1,0,1],.83],[[0,0,1],[0,1,1],[0,1,0],[0,0,0],.69],[[1,0,1],[1,1,1],[0,1,1],[0,0,1],.91],[[0,0,0],[0,1,0],[1,1,0],[1,0,0],.76]];
function box(x,y,z,w,h,d,col,solid=false){const color=rgb(col);for(const f of faces)for(const i of [0,1,2,0,2,3]){const v=f[i];data.push(x+(v[0]-.5)*w,y+v[1]*h,z+(v[2]-.5)*d,...color.map(c=>c*f[4]));}if(solid)solids.push({x1:x-w/2,x2:x+w/2,z1:z-d/2,z2:z+d/2,y1:y,y2:y+h});}
function path(x,z,w,d){box(x,.025,z,w,.075,d,'d9cfb0');}
function tree(x,z,s=1){box(x,0,z,1.1*s,6*s,1.1*s,'75604a',true);for(const a of [-1,1]){box(x+a*s,3*s,z,.75*s,2*s,.8*s,'75604a');box(x,4*s,z+a*s,.8*s,2*s,.75*s,'75604a');}for(const [dx,dy,dz,w,h,d,c] of [[0,7,0,5,2,5,'547645'],[-2,5,0,4,3,5,'42673e'],[2,5,1,4,3,5,'67864b'],[0,5,-2,5,3,4,'587b44'],[-1,5,3,5,2,4,'6e8b50'],[1,8,0,3,1,3,'729555'],[-3,6,-2,3,2,3,'4e733e'],[3,6,-2,3,3,3,'6b8b4e']])box(x+dx*s,dy*s,z+dz*s,w*s,h*s,d*s,c);}
function lamp(x,z){box(x,0,z,1,.3,1,'304842');box(x,.3,z,.6,.6,.6,'304842');box(x,.9,z,.22,4.8,.22,'304842');box(x,5.6,z,.7,.25,.7,'304842');box(x,5.85,z,.9,.35,.9,'f0ead4');box(x,6.2,z,1.15,.8,1.15,'fff5db');box(x,7,z,.8,.3,.8,'f0ead4');}
function bench(x,z){box(x,.8,z,3.8,.4,1.3,'916c4c');box(x,1.2,z-.5,3.8,1,.2,'916c4c');for(const a of [-1.4,1.4])box(x+a,0,z,.3,.8,.8,'394b43');}
// Site plan: north is -Z; Congress approaches from the south.
box(0,-1,0,700,1,700,'8eaa64');
for(const [x,y,z,w] of [[-100,95,-180,48],[115,105,-250,65],[-210,115,60,55],[240,90,10,45]]){box(x,y,z,w,5,16,'e7eee0');box(x+8,y+5,z,w*.55,5,12,'f1f2e5');}
for(let x=-330;x<330;x+=18)for(let z=-330;z<330;z+=18)if(rand()>.68)box(x,.003,z,18,.008,18,rand()>.5?'90ac66':'8ba661');
function road(x,z,w,d){box(x,.04,z,w,.08,d,'626965');if(w>d){path(x,z-d/2-2,w,3);path(x,z+d/2+2,w,3);for(let a=x-w/2;a<x+w/2;a+=12)box(a,.14,z,5,.02,.28,'e5cb7e');}else{path(x-w/2-2,z,3,d);path(x+w/2+2,z,3,d);for(let a=z-d/2;a<z+d/2;a+=12)box(x,.14,a,.28,.02,5,'e5cb7e');}}
for(const x of [-190,-106,106,184,262])road(x,0,14,620);
for(const z of [124,204,-154,-232])road(0,z,620,14);
road(0,244,16,226);for(const z of [56,-76]){road(-240,z,252,12);road(230,z,236,12);}
for(const x of [-106,0,106])for(let a=-5;a<=5;a+=2)box(x+a,.15,114,1,.03,5,'ece7cf');
path(0,80,12,83);path(0,-97,14,100);path(-51,40,104,5);path(51,40,104,5);path(-75,0,6,76);path(75,0,6,76);path(0,-43,150,5);
for(const sign of [-1,1]){path(sign*30,84,5,66);path(sign*15,115,30,5);path(sign*15,51,30,5);for(let z=52;z<116;z+=20){tree(sign*(49+rand()*25),z,.9+rand()*.3);lamp(sign*10,z);bench(sign*20,z);}for(let z=-130;z<-40;z+=22){path(sign*40,z,70,4);tree(sign*77,z,1.1);}}
function building(x,z,w,d,h,col){box(x,0,z,w,h,d,col,true);box(x,h,z,w+1,1,d+1,'e0d4b7');box(x,h+1,z,w-4,.5,d-4,'838b7f');for(let y=3;y<h-2;y+=4)for(let a=-w/2+3;a<w/2-2;a+=5){box(x+a,y,z+d/2+.03,1.8,2,.1,'526b6a');box(x+a,y,z-d/2-.03,1.8,2,.1,'526b6a');}for(let y=3;y<h-2;y+=4)for(let a=-d/2+3;a<d/2-2;a+=5){box(x+w/2+.03,y,z+a,.1,2,1.8,'526b6a');box(x-w/2-.03,y,z+a,.1,2,1.8,'526b6a');}}
for(const x of [-239,-148,145,222,300])for(const z of [-278,-194,-113,-28,83,165,251]){if(x===145&&z===83)continue;building(x+(rand()-.5)*8,z,25+rand()*20,29+rand()*20,10+rand()*27,['b7a78d','b8b4a2','c8b99b','b09d84'][Math.floor(rand()*4)]);}
building(79,93,15,26,10,'c7a178');building(-148,166,26,20,10,'e9e0c3');for(let x=-159;x<-135;x+=5)box(x,0,178,1.1,8,1.1,'fff0cf');
for(let i=0;i<95;i++){const x=(rand()-.5)*580,z=(rand()-.5)*560;if(Math.abs(x)>280||Math.abs(z)>275)tree(x,z,1+rand());}
// Hollow Capitol, connected lobbies and office corridors from supplied plan.
const pink='c5a48b', trim='e0c2a0', cream='e1d0a9';
function wall(x,z,w,d,h=16,y=0,col=pink){box(x,y,z,w,h,d,col,true);}
function capitol(ox,basement=false){
const h=basement?8:17, col=basement?'b8aa8e':pink;
box(ox,0,0,130,.18,29,'d7c7a7');box(ox,0,0,29,.18,65,'d7c7a7');
for(const s of [-1,1]){wall(ox+s*40,s*0+14,50,1,h,0,col);wall(ox+s*40,-14,50,1,h,0,col);wall(ox+s*65,10,1,8,h,0,col);wall(ox+s*65,-10,1,8,h,0,col);box(ox+s*65,h-5,0,1,5,12,col,true);wall(ox+s*14,23,1,18,h,0,col);wall(ox+s*14,-23,1,18,h,0,col);for(const z of [-32,32]){wall(ox+s*9,z,10,1,h,0,col);box(ox,h-6,z,8,6,1,col,true);}
for(const z of [-8,8]){for(let x=18;x<61;x+=11){wall(ox+s*x,z,6,.6,basement?7:9,0,cream);box(ox+s*(x+4),6,z,4,2,.65,cream);wall(ox+s*(x+3),z>0?11:-11,.6,6,basement?7:9,0,cream);box(ox+s*x,0,z>0?11:-11,3,1.2,1.4,'815d42');box(ox+s*x,1.2,z>0?11:-11,3,.15,1.4,'b99669');}}
if(!basement){box(ox+s*40,h,0,52,1,29,trim);box(ox+s*40,h+1,0,50,2,27,'b88b76');box(ox+s*40,h+3,0,47,1,24,trim);for(let x=20;x<65;x+=6)for(const z of [-14.55,14.55]){box(ox+s*x,3,z,2.5,4,.14,'567070');box(ox+s*x,11,z,2.5,3.5,.14,'567070');box(ox+s*x,2.7,z,3,.3,.5,trim);}for(const z of [-33,33])for(const x of [-10,-5,5,10]){box(ox+x,0,z,1.2,11,1.2,trim,true);box(ox+x,10.5,z,2,.7,2,cream);}box(ox,h,23,29,1,20,trim);box(ox,h,-23,29,1,20,trim);}}
// Tiled corridors and a star in the rotunda.
for(let x=-60;x<=60;x+=3)for(let z=-6;z<=6;z+=3)box(ox+x,.19,z,2.9,.02,2.9,((x+z)/3)%2===0?'e4d7b9':'c1ac8b');
for(let z=-29;z<=29;z+=3)for(let x=-6;x<=6;x+=3)if(Math.abs(z)>8)box(ox+x,.19,z,2.9,.02,2.9,((x+z)/3)%2===0?'e4d7b9':'c1ac8b');
for(let x=-9;x<=9;x++)for(let z=-9;z<=9;z++)if(x*x+z*z<90)box(ox+x,.22,z,1,.02,1,x*x+z*z>65?'745b49':'e8dbc0');
for(let x=-5;x<=5;x++)for(let z=-5;z<=5;z++)if((Math.abs(x)<1.5&&Math.abs(z)<5)||(Math.abs(z)<1.5&&Math.abs(x)<5)||Math.abs(x)+Math.abs(z)<4)box(ox+x,.25,z,1,.025,1,'846a46');
for(const x of [-11,11])for(const z of [-11,11]){box(ox+x,0,z,2,h,2,cream,true);box(ox+x,h-1,z,3,1,3,trim);}
if(basement){box(ox,8,0,130,1,29,cream);box(ox,8,0,29,1,65,cream);wall(ox,32,8,1,8,0,cream);wall(ox,-32,8,1,8,0,cream);wall(ox-65,0,1,12,8,0,cream);wall(ox+65,0,1,12,8,0,cream);}else{
// Detailed hollow dome is built with the photo-inspired exterior.
}
// Lift pad in the north lobby.
box(ox, .24,-26,7,.03,5,'739b89');for(const x of [-4,4])box(ox+x,0,-27,.3,5,.3,'bfa26d');
}
capitol(0);capitol(600,true);
// Second-floor galleries. Leave the rotunda and both stairwells open.
const upperY=10.35;
function deck(x,z,w,d){box(x,upperY-.45,z,w,.45,d,'cfbb96',true);}
deck(0,23,28,18);deck(0,-23,28,18);
deck(0,11,28,6);deck(0,-11,28,6);deck(-11,0,6,16);deck(11,0,6,16);
for(const s of [-1,1]){
  deck(s*20,0,12,28);deck(s*59.5,0,11,28);
  deck(s*40,9,28,10);deck(s*40,-9,28,10);
  // Twenty half-block steps, rising outward toward the wing landing.
  for(let i=0;i<20;i++)box(s*(28.6+i*1.2),.35,0,1.2,(i+1)*.5,7.8,i%2?'cfbb96':'e4d3ad',true);
  deck(s*53,0,2,8);
  // Upper stairwell guards, leaving clear entrances at both ends.
  for(const z of [-4.1,4.1]){box(s*40,upperY,z,25,1.1,.22,'8c7253',true);for(let x=28;x<53;x+=3)box(s*x,upperY,z,.2,1.4,.2,'c7ab72');}
  for(const z of [-10,10])for(let x=19;x<63;x+=9){box(s*x,upperY,z,3,.5,1.3,'947351');box(s*x,upperY+.5,z-.5,3,.8,.2,'947351');}
  // Close upper-level exterior exits; lower doors remain open.
  box(s*65,upperY,0,1,6.65,12,pink,true);
}
for(const z of [-32,32])box(0,upperY,z,8,6.65,1,pink,true);
// Continuous railings keep walkers safe around the open rotunda.
for(const s of [-1,1]){box(s*8,upperY,0,.3,1.25,16,'a38659',true);box(0,upperY,s*8,16,1.25,.3,'a38659',true);for(let a=-7;a<=7;a+=2){box(s*8,upperY,a,.18,1.55,.18,'ddc694');box(a,upperY,s*8,.18,1.55,.18,'ddc694');}}
box(0,upperY+.01,-26,7,.04,5,'739b89');
for(const y of [.35,upperY]){for(const x of [-4,4])box(x,y,-27,.35,5,.35,'bfa26d');box(0,y+4.7,-27,8.3,.35,.35,'bfa26d');}
// Front pediment: stepped silhouette above the columned entry.
// Detailed entrance towers, steps and flags are built below.
for(const x of [-65,65]){path(x,0,12,12);for(let z=-8;z<=8;z+=4)box(x+(x<0?-1:1),0,z,1,12,1,trim,true);}
// Northern extension courtyard and its skylights.
path(0,-84,24,57);for(const x of [-20,20])for(const z of [-63,-89,-115]){box(x,.15,z,15,.6,10,'b9b8a1');box(x,.75,z,12,.5,7,'789b95');}box(0,.2,-94,8,1.4,8,'c7b795');box(0,1.6,-94,5,.2,5,'719f9c');
for(const x of [-80,80])for(const z of [60,98,-55,-129])tree(x,z,1.1);
for(const z of [151,177,222]){box(4,.2,z,3,1.1,6,'a67758');box(4,1.3,z,2.8,.9,3,'a4bdb6');for(const a of [-1.6,1.6])for(const b of [-2,2])box(4+a,.1,z+b,.4,.8,.8,'34443f');}
const sites=[{x:0,z:54,name:'The South Promenade',text:'The Capitol anchors Congress Avenue.'},{x:0,z:0,name:'The Rotunda',text:'Four wings meet beneath the voxel dome.'},{x:-22,z:0,name:'The West Wing',text:'Office doors line the first-floor corridor.'},{x:0,z:-109,name:'The Capitol Extension',text:'The northern courtyard follows your site map.'},{x:600,z:0,name:'The Ground Floor',text:'A simplified basement inspired by your floor plan.'}];
for(const s of sites){box(s.x,.3,s.z,2,.12,2,'e7b858');box(s.x,3.8,s.z,.8,.8,.8,'ffe4a0');}
window.buildCapitolExterior({box,tree,lamp,bench});
const baseCount=data.length/6,baseSolids=solids.length;
const ranges={'1':{first:0,count:baseCount},'0':{first:0,count:baseCount}},solidRanges={};
const expanded=window.buildCapitolInteriors({box,begin(id){ranges[id]={first:data.length/6};solidRanges[id]={first:solids.length};},end(id){ranges[id].count=data.length/6-ranges[id].first;solidRanges[id].count=solids.length-solidRanges[id].first;}});
const levels=expanded.levels;sites.push(...expanded.landmarks);
const collisions={'1':solids.slice(0,baseSolids).filter(b=>b.x1<400),'0':solids.slice(0,baseSolids).filter(b=>b.x1>500)};
for(const id of Object.keys(solidRanges)){const r=solidRanges[id];collisions[id]=solids.slice(r.first,r.first+r.count);}
const vertices=new Float32Array(data),buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);for(const [name,offset] of [['p',0],['c',12]]){const a=gl.getAttribLocation(prog,name);gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,3,gl.FLOAT,false,24,offset);}gl.enable(gl.DEPTH_TEST);
const uvp=gl.getUniformLocation(prog,'vp'),ueye=gl.getUniformLocation(prog,'eye'),ufog=gl.getUniformLocation(prog,'fog');
function multiply(a,b){const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)o[c*4+r]+=a[k*4+r]*b[c*4+k];return o;}
function matrix(pos,yaw,pitch){const sy=Math.sin(yaw),cy=Math.cos(yaw),sp=Math.sin(pitch),cp=Math.cos(pitch),right=[cy,0,sy],up=[-sy*sp,cp,cy*sp],back=[-sy*cp,-sp,cy*cp];const v=new Float32Array([right[0],up[0],back[0],0,right[1],up[1],back[1],0,right[2],up[2],back[2],0,-right.reduce((s,n,i)=>s+n*pos[i],0),-up.reduce((s,n,i)=>s+n*pos[i],0),-back.reduce((s,n,i)=>s+n*pos[i],0),1]);const f=1/Math.tan(72*Math.PI/360),aspect=canvas.width/canvas.height,n=.08,far=650;const p=new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+n)/(n-far),-1,0,0,2*far*n/(n-far),0]);return multiply(p,v);}
let level='1',pos=[0,2.15,149],yaw=0,pitch=.08,active=false,flying=false,vy=0,grounded=true,basement=false,last=0,drag=false,liftOpen=false,liftTravel=0,liftTarget='1',stairArrival=false,stairReturn=false;const keys=new Set(),found=new Set();let toastTimer;
const liftPanel=document.createElement('div');liftPanel.id='lift-panel';liftPanel.hidden=true;liftPanel.innerHTML='<section role="dialog" aria-modal="true" aria-label="Elevator floor selector"><small>NORTH WING ELEVATOR</small><h2>Choose your floor</h2>'+['4','3','2','1','0','E1','E2'].map(id=>'<button data-floor="'+id+'">'+(id==='0'?'G':id)+' - '+levels[id].name+'</button>').join('')+'<button id="lift-close">Cancel - Escape</button></section>';document.body.append(liftPanel);
const ride=document.createElement('div');ride.id='lift-ride';ride.hidden=true;ride.setAttribute('role','status');document.body.append(ride);
function closeLift(){liftOpen=false;liftPanel.hidden=true;keys.clear();}
function enterLevel(id,arrival){stairReturn=false;level=id;basement=id==='0';const l=levels[id],p=arrival||l.spawn||l.lift;pos=[l.ox+p[0],l.y+1.8,p[1]];vy=0;flying=false;grounded=true;keys.clear();}
function travelTo(id,stairs=false){liftTarget=id;stairArrival=stairs;closeLift();liftTravel=1.4;flying=false;vy=0;ride.textContent=(stairs?'Stairs - ':'Elevator - ')+levels[id].name;ride.hidden=false;}
function useLift(){const l=levels[level],x=pos[0]-l.ox;if(l.stairDown&&['2','3','4'].includes(level)&&Math.hypot(x-l.stairDown[0],pos[2]-l.stairDown[1])<5){travelTo(l.down,true);return;}if(![l.lift,...(l.extraLifts||[])].some(p=>Math.hypot(x-p[0],pos[2]-p[1])<6)||Math.abs(pos[1]-1.8-l.y)>1){toast('Use the green elevator pad '+(level.startsWith('E')?'at Seal Court, Central Court, or the north tunnels.':'in the north lobby.'));return;}keys.clear();liftOpen=true;liftPanel.hidden=false;if(document.pointerLockElement)document.exitPointerLock();liftPanel.querySelector('[data-floor="'+level+'"]').focus();}
liftPanel.addEventListener('click',e=>{const button=e.target.closest('button');if(!button)return;if(button.id==='lift-close'){closeLift();return;}travelTo(button.dataset.floor);});
function toast(t){$('toast').textContent=t;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),4200);}
function pause(){closeLift();ride.hidden=true;active=false;keys.clear();$('menu').classList.remove('hidden');$('play').innerHTML='Continue exploring <span>↗</span>';if(document.pointerLockElement)document.exitPointerLock();}
$('play').onclick=()=>{active=true;ride.hidden=liftTravel<=0;$('menu').classList.add('hidden');last=performance.now();try{const p=canvas.requestPointerLock();if(p&&p.catch)p.catch(()=>toast('Click and drag to look around.'));}catch{toast('Click and drag to look around.');}};
$('help').onclick=pause;
document.addEventListener('pointerlockchange',()=>{if(!document.pointerLockElement&&active&&!liftOpen&&!liftTravel)pause();});
canvas.addEventListener('mousedown',()=>{if(active)drag=true;});window.addEventListener('mouseup',()=>drag=false);window.addEventListener('mousemove',e=>{if(active&&(document.pointerLockElement===canvas||drag)){yaw+=e.movementX*.0025;pitch=Math.max(-1.5,Math.min(1.5,pitch-e.movementY*.0025));}});
function reset(){stairReturn=false;level='1';pos=[0,2.15,149];yaw=0;pitch=.08;flying=false;basement=false;vy=0;grounded=true;closeLift();liftTravel=0;ride.hidden=true;}
window.addEventListener('keydown',e=>{if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(e.code==='Escape'){if(liftOpen)closeLift();else pause();return;}if(!active||liftOpen||liftTravel)return;keys.add(e.code);if(e.repeat)return;if(e.code==='KeyF'){flying=!flying;vy=0;toast(flying?'Flight enabled - Space up - Q down':'Walking mode');}if(e.code==='KeyR')reset();if(e.code==='Space'&&!flying&&grounded){vy=7;grounded=false;}if(e.code==='KeyE')useLift();});
window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>{keys.clear();if(active)pause();});
function blocked(x,y,z){return collisions[level].some(b=>x+.45>b.x1&&x-.45<b.x2&&z+.45>b.z1&&z-.45<b.z2&&y+.25>b.y1&&y-1.8<b.y2-.001);}
function support(x,z,maxFeet){let top=levels[level].minFloor??.35;for(const b of collisions[level])if(x+.45>b.x1&&x-.45<b.x2&&z+.45>b.z1&&z-.45<b.z2&&b.y2<=maxFeet+.001)top=Math.max(top,b.y2);return top;}
function walkAxis(axis,delta){const candidate=[...pos];candidate[axis]+=delta;const feet=pos[1]-1.8,top=support(candidate[0],candidate[2],feet+(grounded?.55:0));if(grounded&&top>feet)candidate[1]=top+1.8;if(!blocked(...candidate)){pos=candidate;}}
function step(dt){if(liftTravel){liftTravel=Math.max(0,liftTravel-dt);if(!liftTravel){enterLevel(liftTarget,stairArrival&&['2','3','4'].includes(liftTarget)?[-22,-24]:undefined);if(stairArrival&&liftTarget==='1'){pos=[-55,12.15,0];stairReturn=true;}ride.hidden=true;toast('Arrived - '+levels[level].name);}return;}if(liftOpen)return;const forward=(keys.has('KeyW')||keys.has('ArrowUp')?1:0)-(keys.has('KeyS')||keys.has('ArrowDown')?1:0),side=(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0),norm=Math.max(1,Math.hypot(forward,side)),speed=(keys.has('ShiftLeft')||keys.has('ShiftRight')?19:10)*(flying?2:1);const dx=(Math.sin(yaw)*forward+Math.cos(yaw)*side)*speed*dt/norm,dz=(-Math.cos(yaw)*forward+Math.sin(yaw)*side)*speed*dt/norm;
if(flying){pos[0]+=dx;pos[2]+=dz;pos[1]+=((keys.has('Space')?1:0)-(keys.has('KeyQ')?1:0))*speed*dt;pos[1]=Math.max(2.15,Math.min(140,pos[1]));}else{walkAxis(0,dx);walkAxis(2,dz);const previousFeet=pos[1]-1.8;vy-=20*dt;const next=pos[1]+vy*dt;const floor=support(pos[0],pos[2],previousFeet)+1.8;if(vy<=0&&next<=floor){pos[1]=floor;vy=0;grounded=true;}else if(vy>0&&blocked(pos[0],next,pos[2])){vy=0;}else{pos[1]=next;grounded=false;}}
const l=levels[level],x=pos[0]-l.ox;pos[0]=l.ox+Math.max(l.bounds[0],Math.min(l.bounds[1],x));pos[2]=Math.max(l.bounds[2],Math.min(l.bounds[3],pos[2]));
if(level==='1'&&pos[1]<11.7)stairReturn=false;
if(!flying&&!stairReturn&&level==='1'&&pos[1]>11.7&&Math.abs(x)>54.3&&Math.abs(x)<65&&Math.abs(pos[2])<3.8){enterLevel('2',[Math.sign(x)*27,0]);toast('Second floor - House and Senate chambers');}
else if(!flying&&l.stairUp&&Math.hypot(x-l.stairUp[0],pos[2]-l.stairUp[1])<4&&pos[1]-1.8>l.y+4.7){enterLevel(l.up, l.up==='E1'?[0,32]:[-22,-24]);toast('Stairs - '+levels[level].name);}
else if(!flying&&level==='E1'&&Math.hypot(x+14,pos[2]-8)<4&&pos[1]-1.8<l.y-4.6){enterLevel('E2',[0,32]);toast('Extension E2 - lower level');}
for(let i=0;i<sites.length;i++){const site=sites[i],siteLevel=site.level||(site.x===600?'0':'1');if(!found.has(i)&&level===siteLevel&&Math.hypot(pos[0]-site.x,pos[2]-site.z)<7&&Math.abs(pos[1]-1.8-(site.y??.35))<3){found.add(i);$('count').textContent=found.size+' / '+sites.length;$('next').textContent=found.size===sites.length?'Trail complete. Keep exploring!':site.text;toast(found.size===sites.length?'All landmarks discovered!':'Discovered: '+site.name);}}

}
const ctx=$('map').getContext('2d');
function interiorHud(){
  const l=levels[level],x=pos[0]-l.ox,z=pos[2];
  const r=expanded.rooms.filter(r=>r.level===level&&x>=r.x1&&x<=r.x2&&z>=r.z1&&z<=r.z2).sort((a,b)=>(a.x2-a.x1)*(a.z2-a.z1)-(b.x2-b.x1)*(b.z2-b.z1))[0];
  $('place').textContent=r?r.title:l.name;
  let hint=level.startsWith('E')?'Elevators: Seal Court, Central Court, north tunnels - E.':'North lobby elevator - E. Stairs are beside the north wing.';
  if(['2','3','4'].includes(level)&&Math.hypot(x+22,z+22)<6)hint='Press E at this landing to descend to '+levels[l.down].name+'.';
  if(l.stairUp&&Math.hypot(x-l.stairUp[0],z-l.stairUp[1])<20)hint='Walk north up the steps to '+levels[l.up].name+'.';
  if(level==='E1'&&Math.abs(x+14)<4&&z>6&&z<30)hint='Walk down the steps beside Seal Court to Extension E2.';
  if(liftOpen)hint='Choose a floor in the elevator panel.';
  $('hint').textContent=hint;$('mode').textContent=flying?'FLYING':l.name.toUpperCase();
  document.querySelector('.maptitle').innerHTML='CAPITOL '+(level==='0'?'GROUND FLOOR':level)+' <span>N &uarr;</span>';
  ctx.fillStyle='#385a50';ctx.fillRect(0,0,220,220);
  const q=l.bounds,scale=Math.min(190/(q[1]-q[0]),190/(q[3]-q[2]));
  const tx=a=>110+(a-(q[0]+q[1])/2)*scale,tz=a=>110+(a-(q[2]+q[3])/2)*scale;
  ctx.fillStyle='#bba98b';ctx.fillRect(tx(q[0]),tz(q[2]),(q[1]-q[0])*scale,(q[3]-q[2])*scale);
  for(const r of expanded.rooms.filter(r=>r.level===level).sort((a,b)=>(b.x2-b.x1)*(b.z2-b.z1)-(a.x2-a.x1)*(a.z2-a.z1))){ctx.fillStyle=r.title.includes('Court')?'#8ba59a':r.title.includes('Chamber')||r.title.includes('Gallery')?'#6b8b74':'#d4c4a5';ctx.fillRect(tx(r.x1),tz(r.z1),(r.x2-r.x1)*scale,(r.z2-r.z1)*scale);ctx.strokeStyle='#7e816b';ctx.strokeRect(tx(r.x1),tz(r.z1),(r.x2-r.x1)*scale,(r.z2-r.z1)*scale);}
  ctx.fillStyle='#f3deb0';ctx.font='8px Segoe UI';ctx.textAlign='center';
  if(level==='2'||level==='3'){ctx.fillText('HOUSE',tx(-48),tz(0));ctx.fillText('SENATE',tx(48),tz(0));}
  if(level.startsWith('E')){ctx.fillText('CENTRAL COURT',tx(0),tz(-64));ctx.fillText('SEAL COURT',tx(0),tz(38));}
  for(let i=0;i<sites.length;i++)if((sites[i].level||(sites[i].x===600?'0':'1'))===level){ctx.fillStyle=found.has(i)?'#dce5c9':'#ffda70';ctx.beginPath();ctx.arc(tx(sites[i].x-l.ox),tz(sites[i].z),3,0,7);ctx.fill();}
  ctx.fillStyle='#73bba0';for(const p of [l.lift,...(l.extraLifts||[])])ctx.fillRect(tx(p[0])-3,tz(p[1])-3,6,6);
  ctx.save();ctx.translate(tx(x),tz(z));ctx.rotate(yaw);ctx.fillStyle='#fff8dc';ctx.strokeStyle='#214d43';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-7);ctx.lineTo(5,5);ctx.lineTo(0,3);ctx.lineTo(-5,5);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
}
function hud(){if(level!=='1'){interiorHud();return;}document.querySelector('.maptitle').innerHTML='THE CAPITOL DISTRICT <span>N &uarr;</span>';let place='Congress Avenue',hint='Follow the promenade to the south entrance.';const x=pos[0],z=pos[2];if(basement){place='Ground floor';hint='Explore the basement corridors. Lift: north lobby.';}else if(Math.abs(x)<67&&Math.abs(z)<34){place=Math.abs(x)>16?(x<0?'West wing · First floor':'East wing · First floor'):z>15?'South lobby':z<-15?'North lobby':'The rotunda';hint=z<-17&&Math.abs(x)<12?'Press E on the green pad to visit the basement.':'Follow the tiled corridors and explore the rooms.';}else if(z<-40&&Math.abs(x)<100){place='Capitol Extension';hint='Courtyards and skylights north of the Capitol.';}else if(z<120&&z>35&&Math.abs(x)<100){place='The Capitol grounds';hint='Walk through the south entrance to explore inside.';}else if(x>95){place='Brazos Street';hint='The east edge of the Capitol district.';}else if(x<-95){place='Colorado Street';hint='The west edge of the Capitol district.';}if(!basement&&Math.abs(x)<67&&Math.abs(z)<34){if(pos[1]>10){place='Second floor - Rotunda galleries';hint='Look into the rotunda, explore the wings, or take the north elevator.';}else if(Math.abs(x)>25&&Math.abs(x)<55&&Math.abs(z)<5){place='Grand staircase';hint='Walk outward to ascend; inward to return to the first floor.';}else hint='Stairs: east and west wings. Elevator: north lobby - E.';}if(liftOpen)hint='Choose a destination in the elevator panel.';$('place').textContent=place;$('hint').textContent=hint;$('mode').textContent=flying?'FLYING · SPACE ↑ / Q ↓':basement?'GROUND FLOOR':'ON FOOT';
ctx.fillStyle='#72916c';ctx.fillRect(0,0,220,220);const scale=.58,tx=a=>110+a*scale,tz=a=>106+a*scale;
ctx.fillStyle='#bfc1a6';for(const a of [-106,106,184])ctx.fillRect(tx(a)-4,0,8,220);for(const a of [-154,124,204])ctx.fillRect(0,tz(a)-4,220,8);ctx.fillRect(106,tz(124),8,100);ctx.fillStyle='#d4c8a0';ctx.fillRect(107,tz(-130),6,145);ctx.fillStyle='#cc9c83';ctx.fillRect(tx(-65),tz(-14),130*scale,28*scale);ctx.fillRect(tx(-14),tz(-32),28*scale,64*scale);ctx.fillStyle='#e4bf8c';ctx.beginPath();ctx.arc(110,106,7,0,7);ctx.fill();
for(let i=0;i<sites.length;i++){const s=sites[i];if(s.x>500)continue;ctx.fillStyle=found.has(i)?'#dce5c9':'#ffda70';ctx.beginPath();ctx.arc(tx(s.x),tz(s.z),3,0,7);ctx.fill();}ctx.save();ctx.translate(tx(basement?x-600:x),tz(z));ctx.rotate(yaw);ctx.fillStyle='#fff8dc';ctx.strokeStyle='#214d43';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-7);ctx.lineTo(5,5);ctx.lineTo(0,3);ctx.lineTo(-5,5);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}
let frames=0;function frame(t){const dt=Math.min((t-last)/1000,.04);last=t;if(active){for(let i=0;i<3;i++)step(dt/3);}const ratio=Math.min(devicePixelRatio||1,1.6),w=Math.floor(innerWidth*ratio),h=Math.floor(innerHeight*ratio);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}const fog=level!=='1'?[.4,.39,.32]:[.57,.76,.86];gl.clearColor(...fog,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniformMatrix4fv(uvp,false,matrix(pos,yaw,pitch));gl.uniform3fv(ueye,pos);gl.uniform3fv(ufog,fog);gl.drawArrays(gl.TRIANGLES,ranges[level].first,ranges[level].count);if(frames++%6===0)hud();requestAnimationFrame(frame);}
// Read-only diagnostics for smoke tests.
window.capitolGame={get state(){return {position:[...pos],yaw,pitch,active,flying,basement,landmarks:found.size,floor:level==='1'?(pos[1]>10?'2':'1'):level,level,localPosition:[pos[0]-levels[level].ox,pos[1],pos[2]],liftOpen,liftTravel,triangles:vertices.length/18,colliders:solids.length};}};
$('count').textContent='0 / '+sites.length;
requestAnimationFrame(frame);
})();
