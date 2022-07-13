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

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, './templates/your-dashboard.html'));
});
app.get("/userGames/:steamId", (req, res) => {
    //TODO: Don't publish my api key on public github b/c thats really stupid
    const apiKey = "6C13C7F548AD28C60BECEDF430021DDB"
    // Getting Axios a library to help with requesting APIs. It's docs can be found here: https://axios-http.com/docs
    const axios = require('axios')

    //Requesting user account info so I can test whether the user's profile is visible to me (because it is my api key)
    axios.get("http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + apiKey + "&steamids=" + req.params.steamId + "&format=json")
        .then((userData) => {
            //Testing if the account is visible
            if (userData.data.response.players[0].communityvisibilitystate == 3) {
                //Showing friends list
                /*axios.get("http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=" + apiKey + "&steamid=" + req.params["steamId"] + "&relationship=all&format=json")
                    .then((friendsList) => {
                        res.send(friendsList.data)
                    })
                    //More "Error Handling"
                    .catch( e => {
                        console.error(e)
                    })*/

                //Showing Owned Games
                axios.get("http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=" + apiKey + "&steamid=" + req.params.steamId + "&format=json&include_appinfo=1&include_played_free_games=1").then ((games) => {
                    let total = 0
                    for (let game of games.data.response.games) {
                        axios.get("https://api.isthereanydeal.com/v02/game/plain/?key=2a2fc17c80b93372f570423e56c4eadc04d36934&shop=steam&title=" + game.name)
                            .then((gameData) => {
                                axios.get("https://api.isthereanydeal.com/v01/game/prices/?key=2a2fc17c80b93372f570423e56c4eadc04d36934&plains=" + gameData.data.data.plain)
                                .then(cost => {
                                    let costObject = cost.data.data[gameData.data.data.plain].list[0]
                                    if (costObject) {
                                        console.log(costObject.price_old)
                                        total += costObject.price_old
                                    } else {
                                        console.log("No prices found for " + game.name)
                                    }
                                })
                                .catch(e => {
                                    console.error(e)
                                })
                            })
                            .catch(e => {
                                console.error(e)
                            })
                    }
                    let gamesString = "" 
                    for (let game of games.data.response.games) {
                        gamesString = gamesString.concat(game.name)
                    }
                    setTimeout(() => { 
                        res.send(/*JSON.stringify(games.data) +*/ "Total: " +total + " Games: " + gamesString) 
                    }, 3000)
                    
                })

            } else {
                res.send("No Access")
            }

        })
        //"Error Handling"
        .catch (e => {
            console.error(e)
        })
    //axios.get("http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=" + apiKey + "&steamid=" + req.params["steamId"] + "&format=json&include_appinfo=true&include_played_free_games=true")
})

app.listen(8080, () => console.log('----------------------------------------------------------\nServer Started on port 8080...'));
