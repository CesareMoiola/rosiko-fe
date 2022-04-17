import { Typography, Card, CardContent, Button, Divider } from "@mui/material";
import React from "react";
import '../styles/Winner.css';
import { useTheme } from '@mui/styles';
import { Link as RouterLink } from 'react-router-dom';
import { ArmiesTheme } from "../js/armiesPalette";

const Winner = (props) => {

  const theme = useTheme();

  const getMessage = () => {

    let message = null;

    if(props.player.id === props.match.winner.id){
      message = <Typography  variant="h4" color = {theme.palette.primary.contrastText} fontWeight="bold" textAlign="center">You Won !!!<br/><span className="win_emoji" role="img" aria-label="cups">🏆🏆🏆</span></Typography>;
    }
    else{
      message = <Typography  variant="h4" color = {theme.palette.primary.contrastText} fontWeight="bold" textAlign="center">{props.match.winner.name} won<br/></Typography>;
    }
    
    return message;
  }

  return(
    <div>
      <Card className="winner" sx={{backgroundColor: ArmiesTheme[props.match.winner.color].main}}>
        <CardContent className="winner_card_content">     
          {getMessage()}
          <br/>
          <Button 
            className = "homeButton" 
            variant = "outlined"
            color="secondary"
            component={RouterLink} 
            to="/">
          Home
          </Button>
        </CardContent>
      </Card>      
      <Divider className="control_panel_divider"/>
    </div>
  );
}

export default Winner;