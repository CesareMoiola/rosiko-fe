import React from "react";
import '../styles/GameCard.css';
import { Card, CardContent, Divider, Typography} from "@mui/material";

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
      <CardContent>
        <Typography className="cardTitle" variant="h6" component="div" fontWeight="bold" align="center">
          {props.card.cardType}
        </Typography>
        <Divider className="card_divider"/>
        <Typography variant="body2">
          {props.card.territoryName}
        </Typography>
      </CardContent>
    </Card>
  );  
}

export default GameCard;
