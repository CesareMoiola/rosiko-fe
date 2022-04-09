import React from "react";
import '../styles/PlaceArmies.css';
import { Typography, Card, Divider, Button } from "@mui/material";
import Logo from "./Logo";
import { useTheme } from '@mui/styles';

const WebSocket = require("../js/webSocket").default;
const client = WebSocket.getClient();

function PlaceArmies(props) {

    const theme = useTheme();
    let primaryColor = theme.palette.primary.main;
    let textColor = theme.palette.primary.contrastText;
    let cards = props.cards;

    //Nel caso in cui il giocatore non è di turno non viene mostrato niente
    if( props.match.turnPlayer.id !== props.player.id ) return null;

    const playCards = () => {        
        let cardSet = [];
    
        for(let i=0; i<cards.length; i++){
            if(cards[i].selected === true) cardSet.push(cards[i]);        
        }

        if(cardSet.length === 3){
            client.send("/app/play_cards", {}, JSON.stringify({matchId : props.match.id, playerId : props.player.id, card_1 : cardSet[0].id, card_2 : cardSet[1].id, card_3 : cardSet[2].id}));
        }
    }

    const getSelectedCards = () => {
        let selectedCards = [];

        for(let i=0; i < cards.length; i++){
            if(cards[i].selected) selectedCards.push(cards[i]);
        }

        return selectedCards;
    }
    
    return (
        <div className="place_armies">
            <Typography className="action_panel_title" variant="h6"> Place armies </Typography>
            <Card className="avaiableArmiesCard" sx={{backgroundColor: primaryColor}}>
                <Typography className="avaiableArmiesDescription" variant="caption" color={textColor}>
                    Avaiable armies 
                </Typography> 
                <br/>           
                <Typography className="avaiableArmies" variant="h3" fontWeight="bold" align="center" color={textColor}>
                    {props.player.availableArmies} {" "} <Logo className="logo" color={textColor}/>
                </Typography>  
                <br/>
            </Card>         
            <Button className = "playCards" onClick={playCards} variant="outlined" disabled={!(getSelectedCards().length === 3)}>Play cards</Button>     
            <Divider className="control_panel_divider"/>
        </div>
    );  
}

export default PlaceArmies;
