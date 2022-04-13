import React, {useState, useEffect} from "react";
import '../styles/Displacement.css';
import { Button, Typography, Divider } from "@mui/material";
import Territory from "./Territory";
import Arrow from "./Arrow";
import {ArmiesTheme} from "../js/armiesPalette";

const WebSocket = require("../js/webSocket").default;
const client = WebSocket.getClient();

function Displacement(props) {
    const [territoryFrom, setTerritoryFrom] = useState(props.match.territoryFrom);
    const [territoryTo, setTerritoryTo] = useState(props.match.territoryTo);
    let turnPlayer = props.match.turnPlayer.id === props.player.id;
    let showArrow = props.match.territoryFrom !== null && props.match.territoryTo !== null;
    let showTitle = (props.match.territoryFrom !== null || props.match.territoryTo !== null) || turnPlayer;

    useEffect(()=>{
        setTerritoryFrom(props.match.territoryFrom);
        setTerritoryTo(props.match.territoryTo);
    },[props]);

    const getTerritoryFrom = () => {
        let territory = <Typography className="MediumEmphasis" variant="body2">
            Select territory to move armies from and territory to move them to or move on to the next stage of the game.
        </Typography>;

        if(!turnPlayer) territory = null;

        if(territoryFrom !== null){
            territory = <Territory 
                className = "territory_margin" 
                territory = {territoryFrom} 
                match={props.match} 
                turnPlayer={turnPlayer} 
                variant="territoryFrom"
                setMatch={props.setMatch}
                />
        }

        return territory;
    }

    const getTerritoryTo = () => {
        let territory = null;

        if(territoryTo != null){
            territory = <Territory  
                className = "territory_margin" 
                territory = {territoryTo} 
                match={props.match} 
                turnPlayer={turnPlayer} 
                variant="territoryTo"
                setMatch={props.setMatch}/>
        }

        return territory;
    }    

    const getEndsTurnButton = () => {
        let button = null;

        const endsTurn = () => {
            client.send("/app/ends_turn", {}, JSON.stringify({  matchId : props.match.id }));  
        }

        if(turnPlayer === true){
            button = <Button className="ends_turn_button" onClick={endsTurn} variant="outlined" >Ends Turn</Button>
        }

        return button;
    }
    
    return (
        <div>
            {showTitle ? <Typography className="action_panel_title" variant="h6"> Displacement phase </Typography> : null}
            {getTerritoryFrom()}
            {showArrow ? <Arrow className="arrow" color={ArmiesTheme["GRAY"].main}/> : null}
            {getTerritoryTo()}  
            {getEndsTurnButton()}            
            {showTitle ? <Divider className="control_panel_divider"/> : null}
        </div>
    );  
}

export default Displacement;
