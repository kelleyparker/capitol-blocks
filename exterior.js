'use strict';

// Photo-inspired exterior details, kept separate from interior layout and physics.
window.buildCapitolExterior = function ({box, tree, lamp, bench}) {
  const stone='c9ad91', light='ead2b3', rose='bda087', dark='536565', copper='6c8b80';

  function ring(y, radius, height, thickness, color, cx=0, cz=0) {
    const step=.9;
    for(let x=-radius;x<=radius;x+=step)for(let z=-radius;z<=radius;z+=step){
      const r=Math.hypot(x,z);
      if(r<=radius&&r>=radius-thickness)box(cx+x,y,cz+z,step,height,step,color);
    }
  }
  function column(x,y,z,h,w=1){
    box(x,y,z,w*1.6,.5,w*1.6,light);
    box(x,y+.5,z,w,h-1,w,stone);
    box(x,y+h-.5,z,w*1.7,.5,w*1.7,light);
  }
  function windowBay(x,z,y,side=false){
    const rect=(a,b,w,h,c)=>side?box(z+a,y+b,x,.18,h,w,c):box(x+a,y+b,z,w,h,.18,c);
    rect(0,0,2.45,3.9,dark);
    rect(-1.45,-.15,.42,4.3,light);rect(1.45,-.15,.42,4.3,light);
    rect(0,4,3.35,.45,light);rect(0,-.4,3.5,.4,light);
    rect(0,.1,.16,3.6,'c4b390');rect(0,1.85,2.4,.13,'c4b390');
  }
  function pediment(cx,z,y,width,height,depth=1){
    for(let i=0;i<Math.ceil(height/.5);i++)box(cx,y+i*.5,z,width*(1-i*.5/height),.5,depth,stone);
    box(cx,y-.4,z,width+1.5,.45,depth+.4,light);
    for(let a=-width/2;a<width/2;a+=.8)box(cx+a,y+height*(1-Math.abs(a)/(width/2)),z+.16,.95,.35,depth+.2,light);
    box(cx,y+height*.38,z+depth/2+.12,1.6,1.6,.25,'9b8972');
  }
  function arch(z,base,width,height){
    // Stepped voussoirs surround a genuinely open doorway.
    const r=width/2;
    for(let i=0;i<=24;i++){
      const a=i*Math.PI/24;
      box(Math.cos(a)*r,base+height+Math.sin(a)*r,z,.9,.8,1.05,light);
    }
    for(const x of [-r,r])box(x,base,z,.9,height,1.05,light);
  }

  // Three facade registers, projecting pilasters, and rusticated foundation.
  for(const sign of [-1,1])for(const z of [-14.85,14.85]){
    box(sign*40,17,z,50,7,1,stone);
    for(const y of [.5,1.5,2.5])for(let x=16;x<66;x+=3)box(sign*x,y,z+.1,2.9,.85,.35,rose);
    for(const y of [3.5,10.7,18.1])for(let x=19;x<65;x+=6)windowBay(sign*x,z+(z>0?.62:-.62),y);
    for(let x=15.5;x<=65;x+=6){column(sign*x,3.2,z+(z>0?.65:-.65),20,.85);}
    for(const y of [3,9.6,17,23.6])box(sign*40,y,z,52,.6,1.7,light);
    for(let x=16;x<=65;x+=2.4)box(sign*x,23,z,.55,.5,1.2,light);
  }
  // End pavilions have their own shallow copper domes and decorative fronts.
  for(const sign of [-1,1]){
    const cx=sign*60;
    for(const z of [-16.3,16.3]){
      box(cx,0,z,14,24,2,stone);
      for(const x of [-5,0,5]){column(cx+x,3,z+Math.sign(z)*1.1,20,.95);for(const y of [3.5,10.7,18.1])windowBay(cx+x+2,z+Math.sign(z)*1.2,y);}
      box(cx,23.8,z,17,.8,3.5,light);
      pediment(cx,z,24.8,16,3.3,2);
    }
    for(let i=0;i<6;i++)box(cx,25+i*.6,0,15-i*1.7,.6,30-i*3,copper);
    box(cx,28.6,0,2.1,2.6,2.1,light);box(cx,31.2,0,1,.7,1,'ae9271');
    // Side ornament stays clear of the ground-floor wing doors.
    for(const z of [-12,-8,8,12])column(sign*67.4,0,z,24,1.1);
    for(const y of [3.5,10.7,18.1])for(const z of [-10,10])windowBay(z,sign*67.5,y,true);
    for(const y of [3,9.6,17,24])box(sign*67,y,0,2,.6,31,light);
    for(let i=0;i<5;i++)box(sign*38,24.5+i*.6,0,44,.6,29-i*4,copper);
    for(let x=17;x<59;x+=3)box(sign*x,27.5,0,.2,.25,10,'aac0ab');
  }

  // South and north entrance towers, layered cornices and triumphal arches.
  for(const sign of [-1,1]){
    const z=sign*33;
    box(0,17,z,29,9,2,stone);
    for(const x of [-12,-8,8,12])column(x,0,z+sign*1.2,25,1.2);
    for(const x of [-11,-6,6,11])windowBay(x,z+sign*2,19);
    for(const y of [9.6,17,25.5])box(0,y,z,32,.7,4,light);
    arch(z+sign*2,.7,12,12);
    for(let x=-5.2;x<=5.2;x+=.8){
      const top=12.7+Math.sqrt(36-x*x);
      box(x,4.3,z+sign*2.15,.78,top-4.3,.16,dark);
      box(x,4.3,z+sign*2.3,.12,top-4.3,.16,'b8ad93');
    }
    for(const y of [9.5,12.7])box(0,y,z+sign*2.3,10.8,.18,.16,'b8ad93');
    box(0,26,z,28,2,3,stone);
    for(let x=-11;x<12;x+=2.4)box(x,26.3,z+sign*1.65,1.1,.8,.15,dark);
    pediment(0,z+sign*.9,28.3,31,6,3);
    // Exterior steps are low enough for the walking controller to climb.
    for(let i=0;i<5;i++)box(0,.35,sign*(39.5-i*.8),19,(i+1)*.18,.8,'dcc6a8',true);
    box(0,.35,sign*34.8,18,.9,5.5,'dcc6a8',true);
    for(const x of [-10.7,10.7]){box(x,0,sign*38,1.2,1.5,8,rose,true);box(x,1.5,sign*38,1.5,.3,8.5,light);}
  }

  // The drum is open between columns; the cap is a stepped hemispherical shell.
  ring(18,12.5,6,1.5,stone);
  ring(24,14,2,2,stone);ring(26,14.8,.8,2.2,light);
  ring(26.8,12.4,3.2,1.2,stone);
  for(let i=0;i<20;i++){
    const a=i*Math.PI/10,x=Math.cos(a)*12.1,z=Math.sin(a)*12.1;
    column(x,30,z,11.4,1.05);
    box(Math.cos(a)*10.4,30.4,Math.sin(a)*10.4,1.7,7,1.7,dark);
    box(Math.cos(a)*10.4,37.4,Math.sin(a)*10.4,1.6,1,1.6,rose);
  }
  ring(40.9,14.2,.9,2.8,light);ring(41.8,12,1.1,1.8,rose);
  for(let i=0;i<24;i++){
    const a=i*Math.PI/12,x=Math.cos(a)*11,z=Math.sin(a)*11;
    column(x,43,z,5.6,.65);
    box(Math.cos(a)*9.6,43.2,Math.sin(a)*9.6,1.1,3.7,1.1,dark);
  }
  ring(48.6,12.4,.9,2.5,light);
  for(let y=49.5;y<63.5;y+=.8){
    const r=10.9*Math.sqrt(Math.max(.02,1-((y-49.5)/14.5)**2));
    ring(y,r,.8,1.5,y<51?'d4b998':stone);
    for(let i=0;i<16;i++){
      const a=i*Math.PI/8;
      box(Math.cos(a)*(r+.12),y,Math.sin(a)*(r+.12),.55,.85,.55,light);
      if(y>53&&y<57)box(Math.cos(a)*(r+.48),y,Math.sin(a)*(r+.48),.7,.8,.7,'9a8772');
    }
  }
  ring(63.8,3.8,.8,1.2,light);
  for(let i=0;i<8;i++){const a=i*Math.PI/4;column(Math.cos(a)*2.5,64.6,Math.sin(a)*2.5,4,.5);}
  box(0,68.6,0,6,.5,6,light);box(0,69.1,0,4.3,1.4,4.3,rose);box(0,70.5,0,2.5,.8,2.5,light);
  // Block silhouette of the Goddess of Liberty, with lifted arm and star.
  box(0,71.3,0,1.4,.5,1.4,'b6bca4');box(0,71.8,0,.75,2,.65,'c6d0b8');box(0,73.8,0,.65,.7,.6,'d4dbc4');
  box(.7,73,0,.3,1.9,.3,'c6d0b8');box(.85,74.9,0,.3,.3,.3,'f2e4b5');

  // Flags on the portico and towers: recognizable block patterns.
  function flag(x,z,texas){
    box(x,26,z,.12,12,.12,'e6d3b4');
    if(texas){box(x+1,34,z,.9,1.8,.12,'365878');box(x+2.35,34.9,z,1.8,.9,.12,'ede9d5');box(x+2.35,34,z,1.8,.9,.12,'b96354');box(x+1,34.75,z,.28,.28,.18,'fff2d6');}
    else{for(let j=0;j<7;j++)box(x+1.65,34+j*.26,z,3.2,.26,.12,j%2?'f0e7d4':'b6665c');box(x+.6,35,z,1.1,.9,.18,'395877');}
  }
  flag(-9,28,true);flag(9,28,false);

  // Pixel-edged circular drives, paver promenade, lawns and flower beds.
  for(const sign of [-1,1])for(let z=44;z<121;z+=2.5){
    const x=sign*(19+15*Math.sin((z-44)/77*Math.PI));
    box(x,.07,z,7,.07,2.6,'d9cfb2');box(x+sign*4.2,.08,z,.45,.3,2.6,'e9ddc2');
  }
  for(let z=44;z<120;z+=2)for(let x=-5;x<=5;x+=2)box(x,.12,z,1.94,.04,1.94,(Math.round(z/2)+x/2)%2?'d8cfb5':'e3d9bd');
  for(const sign of [-1,1]){
    for(const z of [51,73,95,115]){
      tree(sign*19,z,1.5);lamp(sign*8.5,z);
      if(z!==51)bench(sign*11.5,z);
    }
    for(const [x,z] of [[54,54],[68,81],[61,108],[84,26],[86,-35],[80,-105]])tree(sign*x,z,1.6);
    for(const z of [45,119])for(let x=38;x<77;x+=3){
      box(sign*x,.15,z,2.8,.5,3,'677e43');
      for(const a of [-.7,.7])box(sign*x+a,.65,z, .45,.35,.45,(x%2)?'c6888a':'e9c77a');
    }
  }
  // Historic-style monuments sit beside the axis, leaving the approach open.
  for(const sign of [-1,1]){
    const x=sign*43,z=67;
    box(x,.2,z,7,.5,7,'d3c3a3');box(x,.7,z,4,2.5,4,'bbaa8c');box(x,3.2,z,5,.5,5,light);
    box(x,3.7,z,1.1,3.2,.9,'526953');box(x,6.9,z,.9,.7,.9,'526953');box(x-.8,4.5,z,.5,2,.5,'526953');
    box(x,1.2,z+2.1,2.2,.8,.12,'786f5b');
  }
  // Northern extension skylight court, with colonnaded edges and gatehouses.
  for(const x of [-35,35])for(let z=-65;z>-125;z-=12){column(x,0,z,4.2,.8);box(x,4.2,z,3,.4,13,light);}
  ring(.1,12,.65,2,'c7b69a',0,-119);ring(.75,12.5,.3,.8,light,0,-119);
  box(0,.2,-119,15,.2,15,'799b93');
  for(let a=-6;a<=6;a+=3){box(a,.43,-119,.16,.1,15,'c4cbb2');box(0,.43,-119+a,15,.1,.16,'c4cbb2');}
  for(const x of [-57,57]){
    box(x,0,-101,9,5,12,stone,true);box(x,5,-101,10,.6,13,light);
    for(let i=0;i<4;i++)box(x,5.6+i*.45,-101,10-i*2,.45,13-i*2,copper);
  }
};
