import apiGateway from '../js/apiGateway';
import countDice from "../js/diceUtils";

const WebSocket = require("../js/webSocket").default;

const getPlayer = (match) => {
    let id = WebSocket.getUserId();
    let returnPlayer = null;

    match.players.forEach(p => {
        if(p.id === id){ 
            returnPlayer = p; 
        }
    });  
    return returnPlayer;
}

const placeArmy = (match, territoryId, setMatch) => {
    let newMatch = JSON.parse(JSON.stringify(match));
    let territories = newMatch.map.territories;
    let player = getPlayer(newMatch);

    for(let i=0; i < territories.length; i++){
        if(territories[i].id === territoryId
            && player.availableArmies > 0
            && ((newMatch.stage === "INITIAL_PLACEMENT" && player.armiesPlacedThisTurn < 3) || newMatch.stage === "PLACEMENT")
        ){
            player.availableArmies--;
            player.armiesPlacedThisTurn++;
            territories[i].armies++;
            setMatch(newMatch);

            //Chiamata a backend
            apiGateway.placeArmy(match.id, territoryId);
            break;
        }
    }    
}

const moveArmy = (match, armies, setMatch) => {

    let newMatch = JSON.parse(JSON.stringify(match));
    let territoryFrom = newMatch.territoryFrom;
    let territoryTo = newMatch.territoryTo;

    if(territoryFrom.armies - armies >= 1 && territoryTo.armies + armies >= 1){
        newMatch.moveArmies = armies;
        setMatch(newMatch);
    
        //Chiamata a backend
        apiGateway.moveArmy(match.id, armies);
    }    
}

const attack = (match, attackerDice, setRolling) => {    
    let diceNumber = countDice(attackerDice);

    setRolling(true);

    //Chiamata a backend
    apiGateway.attack(match.id, diceNumber);
}

const selectAttacker = (match, territory, setMatch) => {
    let newMatch = JSON.parse(JSON.stringify(match));

    newMatch.attacker = territory;
    newMatch.defender = null;
    newMatch.territoryTo = null;
    newMatch.territoryFrom = null;
    setMatch(newMatch);

    //Chiamata al backend
    apiGateway.selectAttacker(match.id, territory.id);
}

const selectDefender = (match, territory, setMatch) => {
    let newMatch = JSON.parse(JSON.stringify(match));
    
    newMatch.defender = territory;
    newMatch.territoryTo = null;
    newMatch.territoryFrom = null;
    setMatch(newMatch);

    //Chiamata al backend
    apiGateway.selectDefender(match.id, territory.id);
}

const deselectTerritory = (match, territory, setMatch) => {
    let newMatch = JSON.parse(JSON.stringify(match));
    
    if(newMatch.attacker && newMatch.attacker.id === territory.id){
        newMatch.attacker = null;
        newMatch.defender = null;
    } 

    if(newMatch.defender && newMatch.defender.id === territory.id){
        newMatch.defender = null;
    } 

    if(newMatch.territoryFrom && newMatch.territoryFrom.id === territory.id){
        newMatch.territoryFrom = null;
        newMatch.territoryTo = null;
    } 

    if(newMatch.territoryTo && newMatch.territoryTo.id === territory.id){
        newMatch.territoryTo = null;
    } 

    setMatch(newMatch);

    //Chiamata al backend
    apiGateway.deselectTerritory(match.id, territory.id);
}

const selectTerritoryFrom = (match, territory, setMatch) => {
    let newMatch = JSON.parse(JSON.stringify(match));

    newMatch.territoryFrom = territory;
    newMatch.attacker = null;
    newMatch.defender = null;
    newMatch.territoryTo = null;
    setMatch(newMatch);

    //Chiamata al backend
    apiGateway.selectTerritoryFrom(match.id, territory.id);
}

const selectTerritoryTo = (match, territory, setMatch) => {
    let newMatch = JSON.parse(JSON.stringify(match));
    
    newMatch.territoryTo = territory;
    newMatch.attacker = null;
    newMatch.defender = null;
    setMatch(newMatch);

    //Chiamata al backend
    apiGateway.selectTerritoryTo(match.id, territory.id);
}

export default {
    placeArmy,
    getPlayer,
    moveArmy,
    attack,
    selectAttacker,
    selectDefender,
    deselectTerritory,
    selectTerritoryFrom,
    selectTerritoryTo
};