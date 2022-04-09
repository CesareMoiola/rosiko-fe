import React, {useState, useEffect} from "react";
import { Button, Typography, Divider } from "@mui/material";
import Territory from "./Territory";
import '../styles/Attack.css';
import Arrow from "./Arrow";
import {ArmiesTheme} from "../js/armiesPalette";

const WebSocket = require("../js/webSocket").default;
const client = WebSocket.getClient();

function Attack(props) {
    const [attackerTerritory, setAttackerTerritory] = useState(props.match.attacker);
    const [defenderTerritory, setDefenderTerritory] = useState(props.match.defender);
    let turnPlayer = props.match.turnPlayer.id === props.player.id;
    let showArrow = props.match.attacker !== null && props.match.defender !== null;
    let showTitle = (props.match.attacker !== null || props.match.defender !== null) || turnPlayer;

    useEffect(()=>{
        setAttackerTerritory(props.match.attacker);
        setDefenderTerritory(props.match.defender);
    },[props]);

    const getAttacker = () => {

        let attacker = null;

        if(turnPlayer === true){
            attacker = (
                <Typography className="MediumEmphasis paragraph_margin" variant="body2">
                    Select your territory to attack from or move on to the next phase of the game.
                </Typography>
            );
        }        

        if(attackerTerritory != null){
            attacker = <Territory className = "territory_margin" territory = {attackerTerritory} match={props.match} turnPlayer={turnPlayer} variant="attacker"/>
        }

        return attacker;
    }

    const getDefender = () => {
        let defender = null;

        if(defenderTerritory != null){
            defender = <Territory className = "territory_margin" territory={defenderTerritory} match={props.match} turnPlayer={turnPlayer} variant="defender"/>
        }

        return defender;
    }    

    const getEndsAttackButton = () => {
        let button = null;

        const endAttacks = () => {
            client.send("/app/displacement_stage", {}, JSON.stringify({
                matchId : props.match.id, 
            }));  
        }

        if(turnPlayer === true){
            button = <Button className = "ends_attack_button" onClick={endAttacks} variant="outlined">Ends Attacks</Button>
        }

        return button;
    }
    
    return (
        <div className="attack">
            {showTitle ? <Typography className="action_panel_title" variant="h6"> Attack phase </Typography> : null}
            {getAttacker()}
            {showArrow ? <Arrow className="arrow" color={ArmiesTheme["GRAY"].main}/> : null}
            {getDefender()}
            {getEndsAttackButton()}              
            {showTitle ? <Divider className="control_panel_divider"/> : null}              
        </div>
    );  
}

export default Attack;
