import { Typography, Card, CardContent, Button, Divider } from "@mui/material";
import React from "react";
import '../styles/Loser.css';
import { useTheme } from '@mui/styles';
import { Link as RouterLink } from 'react-router-dom';

const Loser = (props) => {

  const theme = useTheme();

  return(
    <div>
      <Card className="loser" sx={{backgroundColor: theme.palette.primary.main}}>
        <CardContent className="loser_card_content">     
          <Typography  variant="h4" color = {theme.palette.primary.contrastText} textAlign="center">
            You lose<br/><span className="lose_emoji" role="img" aria-label="sad">😫😫😫</span>
          </Typography>
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

export default Loser;