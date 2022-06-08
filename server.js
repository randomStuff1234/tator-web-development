// TYPE THIS INTO YOUR TERMINAL: (without the //)
// npm install express nodemon

// Run your server using 'npm start' (this will restart your server every time you save)

// If you run into issues, copy and paste an error into google and look for 'stackoverflow'! That will probably explain better than I will! (It's how I learned how to code)

const express = require('express');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.method + ' - ' + req.url);
    next();
});

app.post('/*', (req, res, next) => {
    console.log(req.body);
    next();
});

// sends all static files
app.use('/static', express.static(path.resolve(__dirname, './static')));

app.listen(8080, () => console.log('Sever listening on port 8080...'));