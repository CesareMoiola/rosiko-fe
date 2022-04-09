import React from "react";
import '../styles/ControlPanel.css';
import { Card, CardContent, Divider, Typography, List, ListItem, Avatar} from "@mui/material";
import Place3Armies from "./Place3Armies";
import PlaceArmies from "./PlaceArmies";
import Winner from "./Winner";
import Loser from "./Loser";
import Attack from "./Attack";
import Displacement from "./Displacement";
import { ArmiesTheme } from "../js/armiesPalette";

function ControlPanel(props) {

    const getColor = (playerId) => {
        let color = null;

        if(props.match.turnPlayer.id === playerId ){
            color = ArmiesTheme[props.match.turnPlayer.color].main;
        }

        return color;
    }

    const getTextColor = (playerId) => {
        let color = null;

        if(props.match.turnPlayer.id === playerId ){
            color = ArmiesTheme[props.match.turnPlayer.color].contrastText;
        }

        return color;
    }

    const getGameStage = (playerId) => {
        let stage = null;

        if(props.match.turnPlayer.id === playerId ){
            if(props.match.turnPlayer.id === props.player.id){
                stage = "my turn";
            }
            else{
                switch(props.match.stage){
                    case "INITIAL_PLACEMENT": stage = "placement"; break;
                    case "PLACEMENT": stage = "placement"; break;
                    case "ATTACK": stage = "attack"; break;
                    case "DISPLACEMENT": stage = "displacement"; break;
                    case "GAME_OVER": stage = "win"; break;
                    default: stage = null; break;
                }
            }
            
        }

        return stage;
    }

    const getPlayers = (match) => {
        var playersItem = null;
        if(match.players.length > 0){
            playersItem = match.players.map((player) => 
            <ListItem  className= "list_item2" key={player.id} sx={{backgroundColor: getColor(player.id)}}>
                <Avatar className= "avatar" sx={{bgcolor: ArmiesTheme[player.color].main}}/>
                <div className = "player_lable">
                    <Typography align="left" color={getTextColor(player.id)}> {player.name} </Typography>
                    <Typography variant="caption" align="right" color={getTextColor(player.id)}> {getGameStage(player.id)} </Typography>
                </div>                
            </ListItem>
            );
        }        
        return playersItem;
    }

    const getActionPanel = (match, player, cards) => {
        let actionPanel;

        console.log("PLAYER IS ACTIVE: " + player.active);
        console.dir(player);

        //Mostra il pannello di azione in base alla fase di gioco
        if(player.active || match.stage === "GAME_OVER"){
            switch(match.stage){
                //Caso di piazzamento iniziale delle armate
                case "INITIAL_PLACEMENT" :  actionPanel = <Place3Armies player = {player} match = {match}/>;    break;  
                case "PLACEMENT" :          actionPanel = <PlaceArmies player = {player} match = {match} cards = {cards}/>; break;
                case "ATTACK" :             actionPanel = <Attack player = {player} match = {match}/>;          break;
                case "DISPLACEMENT" :       actionPanel = <Displacement player = {player} match = {match}/>;    break;
                case "GAME_OVER":           actionPanel = <Winner player = {player} match = {match}/>;          break;
                default :                   actionPanel = null;                                                 break;
            }
        }
        else actionPanel = <Loser player = {player} match = {match}/>;
        
        return actionPanel;
    }

    return (
        <Card className="controlPanel" elevation={4}>
        <CardContent className="controlPanelContent">
            <Typography variant="h5" fontWeight="bold">
            Rosiko
            </Typography>
            <Divider className="control_panel_divider"/>
            <List className="player_list">
                {getPlayers(props.match)}
            </List>
            <Divider className="control_panel_divider"/>
            {getActionPanel(props.match, props.player, props.cards)}
        </CardContent>
        </Card>
    );  
}

export default ControlPanel;
