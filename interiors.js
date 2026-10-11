'use strict';

// Explorable layouts derived from the supplied Capitol and extension floor plans.
// Each interior has its own render/collision range to keep the expanded map light.
window.buildCapitolInteriors = function ({box, begin, end}) {
  const levels={
    '1':{name:'First floor & grounds',ox:0,y:.35,lift:[0,-26],bounds:[-310,310,-300,300]},
    '0':{name:'Ground floor',ox:600,y:.35,lift:[0,-26],bounds:[-66,66,-32,32]},
    '2':{name:'Second floor - Chambers',ox:1200,y:.35,lift:[0,-26],bounds:[-78,78,-60,48]},
    '3':{name:'Third floor - Galleries',ox:1800,y:8.35,lift:[0,-26],bounds:[-78,78,-60,48]},
    '4':{name:'Fourth floor - North wing',ox:2400,y:.35,lift:[0,-26],bounds:[-28,28,-60,42]},
    'E1':{name:'Extension E1',ox:3000,y:.35,minFloor:-4.65,lift:[0,52],bounds:[-72,72,-167,60]},
    'E2':{name:'Extension E2',ox:3600,y:.35,lift:[0,52],bounds:[-72,72,-167,60]}
  };
  const rooms=[],landmarks=[
    {level:'2',x:1152,z:0,y:.35,name:'House Chamber',text:'The west wing houses the House Chamber.'},
    {level:'2',x:1248,z:0,y:.35,name:'Senate Chamber',text:'The Senate Chamber occupies the east wing.'},
    {level:'3',x:1752,z:14,y:8.35,name:'Public Gallery',text:'Look over the chamber floor from the third-floor galleries.'},
    {level:'4',x:2400,z:-44,y:.35,name:'Fourth-floor North Wing',text:'A smaller upper level follows the supplied floor plan.'},
    {level:'E1',x:3000,z:-64,y:.35,name:'Extension Central Court',text:'Committee rooms and offices branch from the underground gallery.'},
    {level:'E1',x:2956,z:40,y:.35,name:'Capitol Cafeteria',text:'The public cafeteria sits west of Seal Court.'},
    {level:'E2',x:3644,z:40,y:.35,name:'Legislative Conference Center',text:'Conference rooms and staff suites fill extension level E2.'}
  ];
  const stone='d8c8aa',trim='eedfc2',wood='795941',green='47705b',blue='547d85';
  for(const id of ['2','3','4','E1','E2']){
    const l=levels[id],ox=l.ox,fy=l.y;
    begin(id);
    const b=(x,y,z,w,h,d,c,solid=false)=>box(ox+x,y,z,w,h,d,c,solid);
    const wall=(x,z,w,d,h=9,y=fy,c=stone)=>b(x,y,z,w,h,d,c,true);
    const floor=(x,z,w,d,y=fy,c='d5c5a5')=>b(x,y-.35,z,w,.35,d,c,true);
    const name=(title,x,z,w,d)=>rooms.push({level:id,title,x1:x-w/2,x2:x+w/2,z1:z-d/2,z2:z+d/2});
    function room(title,x,z,w,d){
      floor(x,z,w,d);wall(x,z-d/2,w,.5);wall(x-w/2,z,.5,d);wall(x+w/2,z,.5,d);
      wall(x-w/4-1.2,z+d/2,w/2-2.4,.5);wall(x+w/4+1.2,z+d/2,w/2-2.4,.5);
      b(x,fy+5.5,z+d/2,4.8,3.5,.5,stone,true);b(x,fy+3.6,z+d/2+.3,3.6,.65,.15,'698577');
      name(title,x,z,w,d);
    }
    function chair(x,z,y=fy){b(x,y,z,1,.6,1,green,true);b(x,y+.6,z-.4,1,1,.2,green);}
    function desk(x,z,w=2.6,y=fy){b(x,y,z,w,.95,1.3,wood,true);b(x,y+.95,z,w,.12,1.4,'aa8661');b(x+.6,y+1.1,z,.65,.02,.6,'ece2c7');chair(x,z+1.6,y);}
    function shelves(x,z,w=5){b(x,fy,z,w,4.8,.7,wood,true);for(let y=.5;y<4.5;y+=1){b(x,fy+y,z,w,.1,.9,'b6946d');for(let a=-w/2+.3;a<w/2;a+=.45)b(x+a,fy+y+.12,z,.3,.65,.55,['7c5149','507166','b39860'][Math.round((a+w)*10)%3]);}}
    function disc(x,z,r,y=fy,c='eadbbd'){
      for(let a=-r;a<=r;a+=1.2)for(let q=-r;q<=r;q+=1.2)if(Math.hypot(a,q)<r)b(x+a,y+.012,z+q,1.2,.02,1.2,Math.hypot(a,q)>r-1.3?wood:c);
      for(let a=-4;a<=4;a+=.6)for(let q=-4;q<=4;q+=.6){
        let inside=false;const poly=[];for(let k=0;k<10;k++){const t=-Math.PI/2+k*Math.PI/5,rr=k%2?1.6:4;poly.push([Math.cos(t)*rr,Math.sin(t)*rr]);}
        for(let i=0,j=9;i<10;j=i++)if((poly[i][1]>q)!==(poly[j][1]>q)&&a<(poly[j][0]-poly[i][0])*(q-poly[i][1])/(poly[j][1]-poly[i][1])+poly[i][0])inside=!inside;
        if(inside)b(x+a,y+.04,z+q,.6,.02,.6,'605947');
      }
    }
    function columns(x,z,r,h=8){for(let i=0;i<16;i++){const t=(i+.5)*Math.PI/8;b(x+Math.cos(t)*r,fy,z+Math.sin(t)*r,.65,h,.65,trim,true);b(x+Math.cos(t)*r,fy+h-.4,z+Math.sin(t)*r,1.1,.4,1.1,trim);}}
    function light(x,z,y=fy+8){b(x,y,z,3,.16,2,'f5e6bc');b(x,y+.16,z,3.4,.12,2.4,'bda77c');}
    function hearing(x,z){
      room('Committee hearing room',x,z,18,16);
      for(let i=0;i<9;i++){const t=Math.PI+i*Math.PI/8;desk(x+Math.cos(t)*5,z+Math.sin(t)*4,1.9);}
      for(const a of [-3,0,3])for(const q of [2,4])chair(x+a,z+q);
      light(x,z);
    }
    function stairs(x,z,up=true){
      // Ten ordinary half-block steps connect adjacent interior levels.
      for(let i=0;i<10;i++){
        const top=fy+(up?1:-1)*(i+1)*.5;
        b(x,up?fy:top-.4,z-i*1.8,6,up?top-fy:.4,1.8,i%2?'cbb895':'e4d4b5',true);
      }
      for(const s of [-1,1])for(let i=0;i<10;i++)b(x+s*3.2,fy+(up?1:-1)*(i+1)*.5,z-i*1.8,.2,1.1,.2,wood);
      b(x,fy+.04,z+3,4,.03,3,'829781');
    }

    if(id==='2'||id==='3'||id==='4'){
      // Four-wing circulation, with a north library/office wing and south lobby.
      floor(0,0,32,32);floor(0,-36,32,48);floor(0,31,28,30);
      for(const x of [-16,16]){wall(x,-45,.5,30,12);wall(x,-16.5,.5,9,12);}
      for(const x of [-14,14])wall(x,31,.5,30,12);
      wall(0,-60,32,.5,12);wall(0,46,28,.5,12);
      for(const x of [-16,16])for(const z of [-12,12])wall(x,z,.5,8,12);
      for(const z of [-16,16])for(const x of [-12,12])wall(x,z,8,.5,12);
      disc(0,0,10);columns(0,0,12.5,11);
      for(const a of [-12,12])for(const z of [-36,-12,12,34])light(a,z,fy+11);
      b(0,fy+12,-36,32,.5,48,trim);b(0,fy+12,31,28,.5,30,trim);
      // Open rotunda above, with a coffered upper ceiling.
      for(const a of [-12,12])b(a,fy+12,0,8,.5,32,trim);
      for(const z of [-12,12])b(0,fy+12,z,16,.5,8,trim);
      b(0,fy+18,0,24,.5,24,trim);for(let a=-9;a<=9;a+=6)for(let z=-9;z<=9;z+=6)b(a,fy+17.7,z,4,.3,4,'c1ad86');
      name('Rotunda',0,0,30,30);
      if(id!=='4')for(const s of [-1,1]){
        const cx=s*48;
        floor(s*20,0,8,12);floor(cx,0,48,38,.35,id==='2'?'456955':'557269');
        for(const z of [-19,19])wall(cx,z,48,.5,19,.35);
        wall(s*72,0,.5,38,19,.35);
        for(const z of [-12,12])wall(s*24,z,.5,14,19,.35);
        b(cx,19.35,0,48,.5,38,trim);
        for(let x=29;x<72;x+=6)for(const z of [-18.6,18.6]){
          b(s*x,5,z,3,5,.12,blue);
          for(const a of [-1.65,1.65])b(s*x+a,4.6,z,.3,5.8,.2,trim);
          for(const y of [4.6,10.2])b(s*x,y,z,3.6,.25,.25,trim);
          b(s*x,5,z,.12,5,.18,'b0a78f');
        }
        for(const z of [-18.6,18.6]){b(cx,.35,z,48,2.5,.2,wood);b(cx,2.85,z,48,.3,.3,'b49365');b(cx,12,z,48,.35,.35,trim);}
        // Rostrum and seating, with wide central and side aisles.
        b(s*61,.35,0,9,.35,12,'b9946b',true);
        b(s*62,.7,0,2,1.2,10,wood,true);b(s*62,1.9,0,2.2,.15,10,'b28d66');
        b(s*71.6,.35,0,.3,3.2,38,wood);b(s*71.3,3.55,0,.3,.3,38,'b99b6a');
        b(s*71.2,4,0,.2,10,16,'5d7967');
        for(const z of [-9,9]){b(s*70.9,3.8,z,.8,11,1.1,trim);b(s*70.8,14.8,z,1.1,.5,1.6,trim);}
        b(s*70.9,8,-1.4,.2,2.4,1.3,'3e5f79');b(s*70.9,9.2,.4,.2,1.2,2.3,'eee5c9');b(s*70.9,8,.4,.2,1.2,2.3,'b36456');
        b(s*70.75,9,-1.4,.2,.35,.35,'f4e6bf');
        for(let x=34;x<=55;x+=7)for(const z of [-11,-6,6,11])desk(s*x,z,3.1,.35);
        for(const z of [-16,16])for(let x=28;x<70;x+=7)b(s*x,.35,z,1,13,1,stone);
        for(const z of [-12,0,12])light(cx,z,17.5);
        name(s<0?(id==='2'?'House Chamber - 2W':'House Gallery - 3W'):(id==='2'?'Senate Chamber - 2E':'Senate Gallery - 3E'),cx,0,48,38);
        if(id==='3'){
          // Upper public galleries overlook the chamber floor and desk rows below.
          floor(cx,-15,48,8);floor(cx,15,48,8);floor(cx-20,0,8,22);floor(cx+20,0,8,22);
          floor(s*20,0,8,12);
          for(const z of [-11,11]){b(cx,fy,z,40,1.2,.25,wood,true);for(let x=-18;x<=18;x+=3)chair(cx+x,z+Math.sign(z)*3);}
          for(const x of [-16,16])b(cx+x,fy,0,.25,1.2,22,wood,true);
        }
      }
      if(id==='4'){
        for(const x of [-16,16])wall(x,0,.5,32,12);
        for(const z of [-48,-36]){wall(0,z,7,.5,8);for(const s of [-1,1]){wall(s*11,z,10,.5,8);desk(s*9,z-5,4);}}
        for(const x of [-7,7])wall(x,-44,.4,28,8);
        name('Fourth-floor north offices - 4N',0,-44,31,30);
        name('Fourth-floor south rooms - 4S',0,32,27,27);
      }else{
        for(const x of [-12,12])for(const z of [-54,-48,-42])shelves(x,z,5);
        for(const z of [-47,-38])desk(0,z,5);
        name(id==='2'?'Legislative Reference Library - 2N':'North wing offices - 3N',0,-44,31,30);
        name(id==='2'?"Governor's public reception room - 2S":'Third-floor south rooms - 3S',0,32,27,27);
        for(const x of [-8,8])desk(x,34,4);
      }
      // Separate stair wings are generous enough to walk without corner clipping.
      floor(-22,-32,10,40);floor(22,-32,10,40);
      for(const x of [-17,17])floor(x,-26,6,8);
      for(const x of [-27,27])wall(x,-32,.5,40,12);
      for(const x of [-22,22])b(x,fy+12,-32,10,.5,40,trim);
      if(id!=='4')stairs(22,-20,true);
      b(-22,fy+.02,-22,5,.04,5,'78948a');
      name('Stair hall - E to descend',-22,-25,10,22);
      name(id==='4'?'Upper stair landing':'Stairs to the next floor',22,-28,10,28);
      // Connect the stair halls to the north lobby through side doors.
      // Existing north walls are interrupted by doorway openings below.
      for(const x of [-16,16]){
        // Geometry above the opening is decorative; doorway is cut by caller.
        b(x,fy+6,-24,.6,6,5,stone);
      }
      l.up=id==='2'?'3':id==='3'?'4':null;
      l.down=id==='2'?'1':id==='3'?'2':'3';
      l.stairUp=id==='4'?null:[22,-37];l.stairDown=[-22,-22];
    }else{
      // Extension: a long central gallery, Seal Court, Central Court and office bars.
      if(id==='E1'){
        floor(-44, -52.5,52,225);floor(30,-52.5,80,225);
        floor(-14,-78.5,8,173);floor(-14,44,8,32);
      }else floor(0,-52.5,140,225);
      for(const x of [-70,70])wall(x,-52.5,.7,225);
      for(const z of [-165,60])wall(0,z,140,.7);
      b(0,fy+9,-52.5,140,.5,225,'ddd9c4');
      // Distinct skylights and dark planted light courts between office rows.
      for(const s of [-1,1])for(const z of [-114,-88,-24,2]){
        b(s*44,fy,z,43,.7,4,'425f55',true);
        b(s*44,fy+8.6,z,43,.2,4,'b9d5ce');
        for(let x=26;x<65;x+=5){b(s*x,fy+.7,z,2,.8,2,'799367');b(s*x,fy+8.45,z,.15,.2,4,'8ea8a0');}
      }
      const rows=[-139,-113,-87,-49,-23,3];
      for(const s of [-1,1])for(let i=0;i<rows.length;i++){
        const z=rows[i],band=(s<0?[500,400,400,300,300,200]:[600,700,700,800,800,900])[i];
        for(let k=0;k<6;k++){
          const x=s*(27.5+k*7.5),num=band+2+k*2;
          room(`${id}.${num} - ${s<0?'West':'East'} office`,x,z,7.5,17);
          desk(x,z,3);b(x,fy+4,z-8.25,3,1,.15,'798e84');
        }
        for(const x of [s*21,s*63])light(x,z+11);
      }
      // Committee rooms flank, but never obstruct, the central route.
      for(const x of [-12,12])for(const z of [-135,-107,-17])hearing(x,z);
      disc(0,-64,15,fy,id==='E1'?'7095a5':'ddd1b4');columns(0,-64,17,8.3);
      disc(0,38,10);columns(0,38,11.5,8.3);
      name('Central Court - Open-air Rotunda',0,-64,36,36);
      name('Seal Court',0,38,25,25);
      name('Central Gallery',0,-31,8,32);
      // Skylight directly above the court gives the underground space a clear center.
      b(0,fy+8.5,-64,27,.25,27,'c6e0d7');
      for(let a=-12;a<=12;a+=4){b(a,fy+8.3,-64,.2,.2,27,'94aaa0');b(0,fy+8.3,-64+a,27,.2,.2,'94aaa0');}
      if(id==='E1'){
        room('Public Cafeteria - E1.002',-44,38,44,28);
        for(const x of [-57,-44,-31])for(const z of [32,40]){desk(x,z,4);chair(x,z-2);}
        b(-44,fy,25,38,1.3,2,'7a8870',true);
        room('Auditorium - E1.004',44,38,44,28);
        b(44,fy,27,30,.5,5,wood,true);
        for(let x=29;x<=59;x+=4)for(const z of [34,39,44])chair(x,z);
        stairs(-14,26,false);l.minFloor=-4.65;l.stairUp=null;l.stairDown=[-14,8];l.down='E2';
      }else{
        room('Legislative Conference Center - E2.002',44,38,44,28);
        for(const z of [32,42]){b(44,fy,z,26,1,3,wood,true);for(let x=34;x<=54;x+=4){chair(x,z+3);chair(x,z-3);}}
        for(const x of [-57,-44,-31])for(const z of [31,45]){room('House Committee Staff Suites - E2.100s',x,z,12,12);desk(x,z,4);}
        stairs(14,26,true);l.stairUp=[14,8];l.up='E1';l.stairDown=null;
      }
      // Northern tunnels are short explorable corridors with closed far ends.
      for(const s of [-1,1]){
        floor(s*28,-157,48,8);wall(s*28,-153,48,.5);wall(s*28,-161,48,.5);
        name(s<0?'John H. Reagan Building tunnel':'Workforce Commission / Robert E. Johnson tunnel',s*28,-157,48,8);
      }
      for(const z of [-146,-95,-38,17,54]){light(0,z);for(const x of [-20,20])light(x,z);}
    }
    const [lx,lz]=l.lift;
    b(lx,fy+.02,lz,6,.04,5,'739b89');for(const x of [lx-3.5,lx+3.5])b(x,fy,lz,.25,4.5,.25,'c5ab78');b(lx,fy+4.5,lz,7.2,.25,.25,'c5ab78');
    l.spawn=[lx,lz];
    for(const p of landmarks.filter(p=>p.level===id)){
      b(p.x-ox,fy+.02,p.z,2,.04,2,'e5b665');b(p.x-ox,fy+3.8,p.z,.7,.7,.7,'f1d692');
    }
    end(id);
  }
  return {levels,rooms,landmarks};
};
