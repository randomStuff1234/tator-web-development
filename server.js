// TYPE THIS INTO YOUR TERMINAL: (without the //)
// npm install express nodemon

// Run your server using 'npm start' (this will restart your server every time you save)

// If you run into issues, copy and paste an error into google and look for 'stackoverflow'! That will probably explain better than I will! (It's how I learned how to code)

const express = require('express'); // server functions
const path = require('path'); // getting a directory
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware!
app.use('/*', (req, res, next) => {
    console.log(`${req.method} - ${req.originalUrl}`);
    next();
});

app.post('/*', (req, res, next) => {
    console.log(req.body);
    next();
});

app.use('/static', express.static(path.resolve(__dirname, './static')));

app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './templates/your-dashboard.html'));
});

app.listen(8080, () => console.log('----------------------------------------------------------\nServer Started on port 8080...'));