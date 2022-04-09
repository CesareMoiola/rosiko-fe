const setPlayerId = function(playerId){
    localStorage.setItem("playerId", playerId);
}

const getPlayerId = function(){
    return localStorage.getItem("playerId");
}

const setMatchId = function(matchId){
    localStorage.setItem("matchId", matchId);
}

const getMatchId = function(){
    return localStorage.getItem("matchId");
}
const setUser = function(user){
    localStorage.setItem("user", user);
}

const getUser = function(){
    return localStorage.getItem("user");
}

const setConnection = function(client){
    localStorage.setItem("client", client);
}

const getConnection = function(){
    return localStorage.getItem("client");
}

export {
    setPlayerId,
    getPlayerId,
    setMatchId,
    getMatchId,
    setUser,
    getUser,
    setConnection,
    getConnection
};