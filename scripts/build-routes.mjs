import fs from 'node:fs';
const root=fs.readFileSync('dist/index.html','utf8');
const pos=root.replace(/<title>.*?<\/title>/,'<title>Patala-Pay | Point of Sale, Licences &amp; Hardware</title>').replace(/(<meta name="description" content=")[^"]*("\s*\/?>)/,'$1Explore Patala-Pay POS licences, packages and hardware for South African small businesses.$2').replace('https://www.primon.co.za/patala-pay"','https://www.primon.co.za/patala-pay/PointofSale"');
fs.mkdirSync('dist/PointofSale',{recursive:true});fs.writeFileSync('dist/PointofSale/index.html',pos);
console.log('Company overview and PointofSale HTML routes ready.');
