import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ControlPanel from "../components/ControlPanel";
import Map from "../components/Map";
//import Map from "../components/Map2";
import Mission from "../components/Mission";
import GameCard from "../components/GameCard";
import '../styles/Match.css';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getTheme } from "../js/armiesPalette";

const WebSocket = require("../js/webSocket").default;
const client = WebSocket.getClient();
const ApiGateway = require("../js/apiGateway").default;

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

function Match() { 
    let { id } = useParams();
    const [match, setMatch] = useState(ApiGateway.getMatch(id));
    const [player, setPlayer] = useState(getPlayer(match));
    const [cards, setCards] = useState(player.cards);
    
    useEffect(()=>{
        //Iscrizione al websocket
        client.subscribe( "/user/queue/match", function (payload) { setMatch(JSON.parse(payload.body));});
    },[]);

    useEffect( ()=>{setPlayer(getPlayer(match));}, [match] );

    useEffect( ()=>{ setCards(player.cards);}, [player] );

    let theme = createTheme(getTheme(player.color));

    const onClickHandler = (e) => {
        if(e.target.className.animVal.includes("territory")) {
            let territories = match.map.territories;
            let territoryId = e.target.parentElement.id;

            console.log("Stato: " + territoryId)

            //Piazzamento armate durante il proprio turno
            if((match.stage === "INITIAL_PLACEMENT" || match.stage === "PLACEMENT") && match.turnPlayer.id === player.id){
                for(let i=0; i<territories.length; i++){
                    if(territories[i].id === territoryId && territories[i].owner.id === player.id){                        
                        client.send("/app/placeArmy", {}, JSON.stringify({matchId : match.id, territoryId : territories[i].id})); 
                        break;
                    }
                }
            }

            //Fase di attacco durante il proprio turno
            if(match.stage === "ATTACK" && match.turnPlayer.id === player.id){
                
                for(let i=0; i<territories.length; i++){
                    //Selezione del territorio attaccante
                    if(territories[i].id === territoryId && territories[i].owner.id === player.id && territories[i].clickable === true){ 
                        console.log("ATTACKER SELECTED");                      
                        client.send("/app/select_attacker", {}, JSON.stringify({matchId : match.id, territoryId : territories[i].id})); 
                        break;
                    }

                    //Selezione del territorio difensore
                    if(territories[i].id === territoryId && !territories[i].owner.id !== player.id && territories[i].clickable === true && match.attacker !== null){ 
                        console.log("DEFENDER SELECTED");                       
                        client.send("/app/select_defender", {}, JSON.stringify({matchId : match.id, territoryId : territories[i].id})); 
                        break;
                    }
                }
            }

            //Fase di spostamento delle armate
            if(match.stage === "DISPLACEMENT" && match.turnPlayer.id === player.id){
                
                for(let i=0; i<territories.length; i++){
                    //Selezione del territorio da cui spostare le armate
                    if(territories[i].id === territoryId && territories[i].owner.id === player.id && territories[i].clickable === true && match.territoryFrom === null){                        
                        client.send("/app/select_territory_from", {}, JSON.stringify({matchId : match.id, territoryId : territories[i].id})); 
                        break;
                    }

                    //Selezione del territorio su cui spostare le armate
                    if(territories[i].id === territoryId && territories[i].owner.id === player.id && territories[i].clickable === true && match.territoryFrom !== null){                        
                        client.send("/app/select_territory_to", {}, JSON.stringify({matchId : match.id, territoryId : territories[i].id})); 
                        break;
                    }
                }
            }
        }       
    }
    
    const onMouseOverHandler = (e) => {
        if(player.id === match.turnPlayer.id){
            let territories = match.map.territories;
            let territoryId = e.target.parentElement.id;        
            for(let i=0; i < territories.length; i++){
                if(territories[i].id === territoryId && territories[i].clickable === true){
                    e.target.parentElement.children[0].style.opacity = "0.6";
                    e.target.parentElement.style.cursor = "pointer";
                    break;
                }
            }
        }        
    }

    const onMouseOutHandler = (e) => {        
        if(e.target.className.animVal.includes("territory")) {   
            e.target.parentElement.children[0].style.opacity = '1';   
            e.target.parentElement.style.cursor = "default";
        };
    }    

    const deselectCards = (newCards) => {
        for(let i=0; i<newCards.length; i++){ newCards[i].selected = false; }
    } 

    const selectCard = (id) => {
        let newCards = JSON.parse(JSON.stringify(cards));
        let selectedCards = 0;

        //Conta quante carte sono selezionate esclusa l'ultima
        for(let i=0; i<newCards.length; i++){
            if(newCards[i].selected === true) selectedCards++;
        }

        for(let i=0; i<newCards.length; i++){
            if(newCards[i].id === id){
                //Se la carta è già selezionata allora deselezionale tutte
                if(newCards[i].selected === true) deselectCards(newCards);
                else {
                    //se la carta non è selezionata selezionala, se c'erano già tre carte selezionate quelle vengono deselezionate
                    if(selectedCards === 3) deselectCards(newCards);
                    newCards[i].selected = true;                    
                }             
            }            
        }   
        
        setCards(newCards);
    } 

    const getGameCards = (cards) => {
        let cardList = [];
        let component = null;
        
        for(let i=0; i<cards.length; i++){
            cardList[i] = (
                <GameCard 
                    key={cards[i].id}
                    className="gameCard" 
                    onClick = {() => selectCard(cards[i].id)}
                    card={cards[i]}>
                </GameCard>
            )
        }
    
        if(cardList.length>0){
            component = <div className="cardList"> {cardList} </div>
        }

        return component;
    }

    return (
        <ThemeProvider theme = {theme}>
            <div className="match">                      
                <Mission 
                    className="mission"
                    description = {player.mission.description}
                /> 
                {getGameCards(cards)}
                <Map               
                    className="map"  
                    match = {match}
                    player = {player}
                    onClick = {onClickHandler}
                    onMouseOver = {onMouseOverHandler}
                    onMouseOut = {onMouseOutHandler}
                />
                <ControlPanel match = {match} player = {player} cards = {cards} />
            </div>   
        </ThemeProvider>             
    );    
}

export default Match;
