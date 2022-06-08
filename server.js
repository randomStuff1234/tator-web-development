// TYPE THIS INTO YOUR TERMINAL: (without the //)
// npm install express nodemon

// Run your server using 'npm start' (this will restart your server every time you save)

const express = require('express');
const path = require('path');

const app = express();

// sends all static files
app.use(express.static(path.resolve(__dirname, './static')));

// req = request object
// res = response object

// Get request
app.get('/*', (req, res) => {

});

// Post reqest
app.post('/*', (req, res) => {

});

app.listen(8080, () => console.log('Sever listening on port 8080...'));