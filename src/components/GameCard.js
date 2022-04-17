import React from "react";
import '../styles/GameCard.css';
import { Card, CardContent, Divider, Typography} from "@mui/material";
import TerritoryImage from "./TerritoryImage";

const getElevation = (card) => {
  let elevation = 4;
  if(card.selected === true) elevation = 8;
  return elevation; 
}

const getMargin = (card) => {
  let margin = "0px";
  if(card.selected === true) margin = "32px";
  return margin; 
}

function GameCard(props) {
  return (
    <Card className="gameCard" elevation={getElevation(props.card)} onClick={props.onClick} sx={{marginBottom: getMargin(props.card)}}>
      <CardContent className="game_card_content">
        <Typography className="cardTitle" variant="h6" component="div" fontWeight="bold" align="center">
          {props.card.cardType}
        </Typography>
        <Divider className="card_divider"/>
        <TerritoryImage className="image" card = {props.card} territories = {props.territories} player={props.player}/>
        <Typography className="card_territory_name" variant="caption"> {props.card.territoryName} </Typography>
      </CardContent>
    </Card>
  );  
}

export default GameCard;
