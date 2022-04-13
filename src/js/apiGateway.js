import endPoint from "./endPoint";

const WebSocket = require("../js/webSocket").default;
const client = WebSocket.getClient();

const newMatch = function(matchName, password, playerName){
    const url = endPoint + "/new_match";
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
    const url = endPoint + "/joinable_matches";
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

const joinMatch = function(matchId, playerName){
    const url = endPoint + "/join_match";
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
    const url = endPoint + "/get_player";
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
    const url = endPoint + "/get_players";
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
    let url = endPoint + "/get_match?matchId=" + matchId;
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

const placeArmy = function(matchId, territoryId){
    client.send("/app/placeArmy", {}, JSON.stringify({matchId : matchId, territoryId : territoryId}));   
}

const setArmies = function(matchId, territoryId, armies){
    client.send("/app/set_armies", {}, JSON.stringify({matchId : matchId, territoryId : territoryId, armies: armies}));   
}

const moveArmy = function(matchId, armies){
    client.send("/app/move_armies", {}, JSON.stringify({matchId : matchId, armies : armies})); 
}

const attack = function(matchId, diceNumber){
    client.send("/app/attack", {}, JSON.stringify({matchId : matchId, numberOfAttackerDice: diceNumber}));
}

const selectAttacker = function(matchId, territoryId){
    client.send("/app/select_attacker", {}, JSON.stringify({matchId : matchId, territoryId : territoryId}));
}

const selectDefender = function(matchId, territoryId){
    client.send("/app/select_defender", {}, JSON.stringify({matchId : matchId, territoryId : territoryId}));
}

const deselectTerritory = function(matchId, territoryId){
    client.send("/app/deselect_territory", {}, JSON.stringify({matchId : matchId, territoryId : territoryId}));
}

const selectTerritoryFrom = function(matchId, territoryId){
    client.send("/app/select_territory_from", {}, JSON.stringify({matchId : matchId, territoryId : territoryId})); 
}

const selectTerritoryTo = function(matchId, territoryId){
    client.send("/app/select_territory_to", {}, JSON.stringify({matchId : matchId, territoryId : territoryId})); 
}

export default {
    newMatch,
    getJoinableMatches,
    joinMatch,
    getPlayer,
    getMatch,
    getPlayers,
    placeArmy,
    moveArmy,
    attack,
    setArmies,
    selectAttacker,
    selectDefender,
    deselectTerritory,
    selectTerritoryFrom,
    selectTerritoryTo
};