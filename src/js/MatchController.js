import apiGateway from '../js/apiGateway';
import countDice from "../js/diceUtils";

const WebSocket = require("../js/webSocket").default;

let antilag = false;

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

const placeArmy = (match, territoryId, placedArmies, setPlacedArmies) => {
    let player = getPlayer(match);
    let newPlacedArmies = {};
    
    if(placedArmies !== undefined) newPlacedArmies = JSON.parse(JSON.stringify(placedArmies));

    if( 
        player.availableArmies > 0
        && ((match.stage === "INITIAL_PLACEMENT" && player.armiesPlacedThisTurn < 3) || match.stage === "PLACEMENT")
    ){
        player.availableArmies--;
        player.armiesPlacedThisTurn++;
        if(newPlacedArmies.hasOwnProperty(territoryId)){
            newPlacedArmies[territoryId] = newPlacedArmies[territoryId] + 1;
        }
        else{
            newPlacedArmies[territoryId] = 1;
        }
        
        setPlacedArmies(newPlacedArmies);

        //Chiamata a backend solo quando sono state piazzate tutte le armate
        if(
            player.availableArmies === 0
            || (match.stage === "INITIAL_PLACEMENT" && player.armiesPlacedThisTurn === 3)
        ){
            console.dir(newPlacedArmies);
            apiGateway.placeArmies(match.id, newPlacedArmies);
        }        
    }
}

const moveArmies = (match, armies, setMovedArmies) => {
    let territoryFrom = match.territoryFrom;
    let territoryTo = match.territoryTo;

    if(territoryFrom.armies - armies >= 1 && territoryTo.armies + armies >= 1){
        setMovedArmies(armies);
    }    
}

const attack = (match, attackerDice, setRolling) => {    
    let diceNumber = countDice(attackerDice);

    setRolling(true);

    //Chiamata a backend
    apiGateway.attack(match.id, diceNumber);
}

const selectAttacker = (match, territory, setMatch) => {
    if(antilag){
        let newMatch = JSON.parse(JSON.stringify(match));

        newMatch.attacker = territory;
        newMatch.defender = null;
        newMatch.territoryTo = null;
        newMatch.territoryFrom = null;
        setMatch(newMatch);
    }

    //Chiamata al backend
    apiGateway.selectAttacker(match.id, territory.id);
}

const selectDefender = (match, territory, setMatch) => {
    if(antilag){
        let newMatch = JSON.parse(JSON.stringify(match));
    
        newMatch.defender = territory;
        newMatch.territoryTo = null;
        newMatch.territoryFrom = null;
        setMatch(newMatch);
    }    

    //Chiamata al backend
    apiGateway.selectDefender(match.id, territory.id);
}

const deselectTerritory = (match, territory, setMatch, setMovedArmies) => {
    if(antilag){
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
        setMovedArmies(0);
    }

    //Chiamata al backend
    apiGateway.deselectTerritory(match.id, territory.id);
}

const selectTerritoryFrom = (match, territory, setMatch) => {
    if(antilag){
        let newMatch = JSON.parse(JSON.stringify(match));

        newMatch.territoryFrom = territory;
        newMatch.attacker = null;
        newMatch.defender = null;
        newMatch.territoryTo = null;
        setMatch(newMatch);
    }

    //Chiamata al backend
    apiGateway.selectTerritoryFrom(match.id, territory.id);
}

const selectTerritoryTo = (match, territory, setMatch) => {
    if(antilag){
        let newMatch = JSON.parse(JSON.stringify(match));
    
        newMatch.territoryTo = territory;
        newMatch.attacker = null;
        newMatch.defender = null;
        setMatch(newMatch);
    }

    //Chiamata al backend
    apiGateway.selectTerritoryTo(match.id, territory.id);
}

//Ritorna il numero corretto di armate
const getArmies = (match, territory, placedArmies, movedArmies) => {
    let armies = territory.armies;
    let id = territory.id;
    let territoryFrom = match.territoryFrom;
    let territoryTo = match.territoryTo;
    
    if(placedArmies != null && placedArmies.hasOwnProperty(id)) armies += placedArmies[id];
    if(territoryFrom !== null && territoryTo !== null && territoryFrom.id === id) armies -= movedArmies;
    if(territoryFrom !== null && territoryTo !== null && territoryTo.id === id) armies += movedArmies; 
    
    return armies;
}

const endsTurn = (match) => {
    apiGateway.endsTurn(match);
}

const confirmMove = (match, movedArmies) => {
    apiGateway.confirmMove(match, movedArmies);
}

export default {
    placeArmy,
    getPlayer,
    moveArmies,
    attack,
    selectAttacker,
    selectDefender,
    deselectTerritory,
    selectTerritoryFrom,
    selectTerritoryTo,
    getArmies,
    endsTurn,
    confirmMove
};