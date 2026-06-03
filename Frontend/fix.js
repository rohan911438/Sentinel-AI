const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/href="\/(dashboard|committee|portfolio|strategy-builder|transactions|governance|settings)"/g, 'href="$1.html"');
  fs.writeFileSync(f, c);
});
console.log('Fixed links in ' + files.length + ' files.');
