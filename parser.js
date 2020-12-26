const fs = require('fs');

fs.readFile('results.html', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(JSON.parse(data, null, 2));
})