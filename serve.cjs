// Optional localhost preview. The game also works by opening index.html directly.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const files = {'/':'index.html','/index.html':'index.html','/style.css':'style.css','/game.js':'game.js','/exterior.js':'exterior.js'};
const types = {'.html':'text/html','.css':'text/css','.js':'text/javascript'};
http.createServer((req,res)=>{
  const file=files[req.url.split('?')[0]];
  if(!file){res.writeHead(404);res.end('Not found');return;}
  res.writeHead(200,{'Content-Type':types[path.extname(file)],'Cache-Control':'no-store'});
  fs.createReadStream(path.join(__dirname,file)).pipe(res);
}).listen(8877,'127.0.0.1',()=>console.log('Capitol Blocks: http://127.0.0.1:8877'));
