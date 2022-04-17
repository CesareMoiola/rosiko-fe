import React from "react";
import '../styles/GameCard.css';
import { Card, CardContent, Divider, Typography} from "@mui/material";
import TerritoryImage from "./TerritoryImage";
import tractorImage from "../images/tractor.png";
import farmerImage from "../images/farmer.png";
import cowImage from "../images/cow.png";

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

  const getImageSource = () => {
    let image = null;

    switch(props.card.cardType){
      case "TRACTOR": image = <img className="symbol_image" alt="tractor" src={tractorImage}/>; break;
      case "COW": image =  <img className="symbol_image" alt="cow" src={cowImage}/>; break;
      case "FARMER": image = <img className="symbol_image" alt="farmer" src={farmerImage}/>; break;
      default: break;
    }

    return image;
  }

  return (
    <Card className="gameCard" elevation={getElevation(props.card)} onClick={props.onClick} sx={{marginBottom: getMargin(props.card)}}>
      <CardContent className="game_card_content">
        {getImageSource()}
        <Divider className="card_divider"/>
        <TerritoryImage className="image" card = {props.card} territories = {props.territories} player={props.player}/>
        <Typography className="card_territory_name" variant="caption"> {props.card.territoryName} </Typography>
      </CardContent>
    </Card>
  );  
}

export default GameCard;
