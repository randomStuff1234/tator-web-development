const express = require('express'); // server functions
const path = require('path'); // getting a directory
const { createScanner } = require('typescript');
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
app.post("/userMoney/:steamId", (req, res) => {
    //TODO: Don't publish my api key on public github b/c thats really stupid
    const apiKey = "6C13C7F548AD28C60BECEDF430021DDB"
    // Getting Axios a library to help with requesting APIs. It's docs can be found here: https://axios-http.com/docs
    const axios = require('axios')

    //Requesting user account info so I can test whether the user's profile is visible to me (because it is my api key)
    axios.get("http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + apiKey + "&steamids=" + req.params.steamId + "&format=json")
        .then((userData) => {
            //Testing if the account is visible
            if (userData.data.response.players[0].communityvisibilitystate == 3) {
                //Showing Owned Games
                axios.get("http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=" + apiKey + "&steamid=" + req.params.steamId + "&format=json&include_appinfo=1%include_played_free_games=0")
                    .then ((gamesInfo) => {
                        let total = 0
                        let i = 0
                        let { games } = gamesInfo.data.response;
                        for (let game of games) {
                            let  { name } = game;
                            axios.get("https://api.isthereanydeal.com/v02/game/plain/?key=2a2fc17c80b93372f570423e56c4eadc04d36934&shop=steam&title=" + name)
                                .then((gameData) => {
                                    let plainGameName = gameData.data.data.plain
                                    
                                    axios.get("https://api.isthereanydeal.com/v01/game/prices/?key=2a2fc17c80b93372f570423e56c4eadc04d36934&shops=steam&plains=" + plainGameName)
                                    .then(cost => {
                                        let costObject = cost.data.data[plainGameName].list[0];
                                        if (costObject) {
                                            //console.log(plainGameName + ": $" + costObject.price_old);
                                            total += +costObject.price_old;
                                        } else {
                                            //console.log("No prices found for " + name);
                                        }
                                        i++
                                        if (i == games.length) {
                                            //let gamesString = ""; 
                        
                                            //for (let game of games) gamesString += game.name + ", ";
                                            res.send("Total: $" + Math.round(total)/* + " Games: " + gamesString.slice(0, gamesString.length - 2)*/);
                                            return;
                                        }
                                    })
                                    .catch(e => {
                                        //console.error("error with user money spent for: " + req.params.steamId + " at the second money detection request. Game: " + name);
                                        //console.log(plainGameName)
                                        i ++
                                    })
                                })
                                .catch(e => {
                                    //console.error("error with user money spent for: " + req.params.steamId + " at the first money detection request. Game: " + name);
                                    i++
                                })
                        }
                    })
                    .catch(() =>{
                        res.send("error")
                        //console.log(games)
                    })
            } else {
                res.send("private_profile")
            }

        })
        //"Error Handling"
        .catch (e => {
            console.error("error with user money spent for: " + req.params.steamId)
        })
    //axios.get("http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=" + apiKey + "&steamid=" + req.params["steamId"] + "&format=json&include_appinfo=true&include_played_free_games=true")
})
app.post("/userFriends/:steamId", (req, res) => {
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
                axios.get("http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=" + apiKey + "&steamid=" + req.params["steamId"] + "&relationship=all&format=json")
                    .then((friendsList) => {
                        res.json(friendsList.data.friendslist.friends)
                    })
                    //More "Error Handling"
                    .catch(e => {
                        console.error("error with user friends for: " + req.params.steamId + " (2nd error messagge)")
                        res.send("error")
                    })
            } else {
                res.send("private_profile")
            }
        })
        //"Error Handling"
        .catch (e => {
            console.error("error with user friends for: " + req.params.steamId)
            res.send("error")
        })
})

app.post("/userInfo/:steamId", (req, res) => {
    //TODO: Don't publish my api key on public github b/c thats really stupid
    const apiKey = "6C13C7F548AD28C60BECEDF430021DDB"
    // Getting Axios a library to help with requesting APIs. It's docs can be found here: https://axios-http.com/docs
    const axios = require('axios')

    //Requesting user account info so I can test whether the user's profile is visible to me (because it is my api key)
    axios.get("http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + apiKey + "&steamids=" + req.params.steamId + "&format=json")
        .then((userData) => {
            //Testing if the account is visible
            if (userData.data.response.players[0].communityvisibilitystate == 3) {
                res.json(userData.data)
            } else {
                res.json(userData.data)
                //res.send("private_profile")
                console.log(userData.data.response)
            }
        })
        //"Error Handling"
        .catch (e => {
            console.error("error with user data for: " + req.params.steamId)
            res.send("error")
        })
    //axios.get("http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=" + apiKey + "&steamid=" + req.params["steamId"] + "&format=json&include_appinfo=true&include_played_free_games=true")
})

app.listen(8080, () => console.log('----------------------------------------------------------\nServer Started on port 8080...'));
