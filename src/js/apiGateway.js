
let endPoint = "https://rosiko-be.herokuapp.com";
//let endPoint = "http://localhost:8080";

const newMatch = function(matchName, password, playerName){
    const url = endPoint + "/match/new_match";
    var match = null;

    var data = {
        matchName: matchName,
        matcgPassword: password,
        playerName: playerName   
    }

    var request = new XMLHttpRequest();
    request.open('GET', url, false);  // `false` makes the request synchronous
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(data));

    if (request.status === 200) {
        match = JSON.parse(request.responseText);
    }

    console.log("New match created");
    
    return match;
}

const getJoinableMatches = function(){
    const url = endPoint + "/match/joinable_matches";
    var request = new XMLHttpRequest();
    var matches = null;
    
    request.open("GET", url, false);
    request.setRequestHeader("Content-Type", "application/json");
    request.send();

    if (request.status === 200) {
        matches = JSON.parse(request.responseText);
    }
    
    return matches;
}

const updateMatch = function(match){
    const url = endPoint + "/match/update";
    var request = new XMLHttpRequest();
    
    request.open("GET", url, false);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(match)); 

    if (request.status !== 200) {
        console.log("ERROR on " + url + " status: " + request.status);
    }
}

const updatePlayer = function(player){
    const url = endPoint + "/match/update_player";
    var request = new XMLHttpRequest();
    
    request.open("GET", url, false);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(player)); 

    if (request.status !== 200) {
        console.log("ERROR on " + url + " status: " + request.status);
    }
}

const joinMatch = function(matchId, playerName){
    const url = endPoint + "/match/join_match";
    var request = new XMLHttpRequest();
    var playerId = null;
    
    request.open("GET", url, false);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify({ matchId: matchId, playerName: playerName}));     

    if (request.status === 200) {
        playerId = parseInt(request.responseText);
    }
    else{
        console.log("ERROR on " + url + " status: " + request.status);
    }

    return playerId;
}

const getPlayer = function(matchId, playerId){
    const url = endPoint + "/match/get_player";
    var request = new XMLHttpRequest();
    var player = null;
    
    request.open("GET", url, false);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify({matchId: matchId, playerId: playerId}));

    if (request.status === 200) {
        player = JSON.parse(request.responseText);
    }
    else{
        console.log("ERROR on " + url + " status: " + request.status);
    }
    
    return player;
}

const getPlayers = function(matchId){
    const url = endPoint + "/match/get_players";
    var request = new XMLHttpRequest();
    var players = null;
    
    request.open("GET", url, false);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify({matchId: matchId}));

    if (request.status === 200) {
        players = JSON.parse(request.responseText);
    }
    else{
        console.log("ERROR on " + url + " status: " + request.status);
    }
    
    return players;
}

const getMatch = function(matchId){
    let url = endPoint + "/match/get_match?matchId=" + matchId;
    let request = new XMLHttpRequest();
    let match = null;
    
    request.open("GET", url, false);
    request.send(null);

    if (request.status === 200) {
        match = JSON.parse(request.responseText);
    }
    else{
        console.log("ERROR on " + url + " status: " + request.status);
    }

    return match;
}

export default {
    newMatch,
    getJoinableMatches,
    updateMatch,
    updatePlayer,
    joinMatch,
    getPlayer,
    getMatch,
    getPlayers
};