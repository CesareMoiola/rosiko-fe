import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Avatar, Button, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { List } from "@mui/material";
import { ArmiesTheme } from "../js/armiesPalette";
import '../styles/WaitingRoom.css';

const WebSocket = require("../js/webSocket").default;
const client = WebSocket.getClient();
const ApiGateway = require("../js/apiGateway").default;

function WaitingRoom() {   

    let { id } = useParams();

    const [match, setMatch] = useState(ApiGateway.getMatch(id));    

    const navigate = useNavigate();

    //Iscrizione all'endpoint per ricevere aggiornamenti sul match
    useEffect(
        () => {
            client.subscribe("/user/queue/match", payload => {
                let updatedMatch = JSON.parse(payload.body);

                if(updatedMatch.state === 'STARTED'){
                    //client.unsubscribe("match");
                    navigate("/match/" + updatedMatch.id);
                }
                else{
                    setMatch(updatedMatch);
                }
            }); 
        }, [navigate]
    );              

    const getPlayers = matchId => {
        var players = match.players;
        var playersItem = null;
        if(players.length > 0){
            playersItem = players.map((player) => 
                <ListItem key={player.id}>
                    <ListItemAvatar className="avatar">
                    <Avatar sx={{ width: 24, height: 24, bgcolor: ArmiesTheme[player.color].main}}/>
                    </ListItemAvatar>
                    <ListItemText primary={player.name}/>
                </ListItem>
            );
        }        
        return playersItem;
    };  

    const submitPlay = () => {
        client.send("/app/start_match", {}, JSON.stringify({matchId : match.id}));
    };
  
    return (
        <div className="waiting-room">
            <h1>{match.name}</h1>
            <List className="player-list">
                {getPlayers(match.id)}
            </List>
            <br/>
            <Button  
                onClick={ () => {submitPlay()}}
                variant="contained" 
                disabled = {!(match.state === 'READY')}
            >Play</Button>
        </div>        
    );    
}

export default WaitingRoom;