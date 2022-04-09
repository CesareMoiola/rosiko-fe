import React, { useState, useEffect } from "react";
import '../styles/JoinMatch.css';
import { Button, RadioGroup, Radio, FormControlLabel, TextField } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import {useNavigate} from 'react-router-dom';

const ApiGateway = require("../js/apiGateway").default;
const WebSocket = require("../js/webSocket").default;
const client = WebSocket.getClient();

const JoinMatch = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState(ApiGateway.getJoinableMatches());
  const [matchId, setMatchId] = useState(undefined);
  const [playerName, setPlayerName] = useState("");
  
  useEffect(
    () => {
      client.subscribe(
        "/queue/joinableMatches", 
        function (payload) {
          setMatches(JSON.parse(payload.body));
        },
        {id: "joinableMatches"}
      );
    }, []
  )

  const joinMatchSubmit = event => {
    event.preventDefault(); //Evita che viene ricaricata la pagina
    client.send("/app/join_match", {}, JSON.stringify({matchId : matchId, playerName : playerName}));
    navigate("/waiting_room/" + matchId);
    //client.unsubscribe("joinableMatches");
  }

  const handlePlayerName = event => {
    setPlayerName(event.target.value);
  }

  const selectMatch = (event, value) =>{
    setMatchId(value);
  }

  const getMatches = () => {
    return(
      matches.map(match => 
        <FormControlLabel 
          key={match.id} 
          value={match.id ? match.id : ""} 
          control={<Radio/>}
          label={
            <div className='matchLabel'>
                <LockIcon 
                  className='icon publicMatch' 
                  fontSize='small' 
                  sx={{visibility: match.password!==null ? "visible" : "hidden"}}/>
                <label className='matchName'>{match.name}</label>
                <PersonIcon className='icon personIcon-margin' fontSize='small'/>
                <label>{match.players.length}</label>
            </div>
          }>
        </FormControlLabel>
      ));
  }

  return (
    <div className="new-match">
        <form onSubmit={joinMatchSubmit}>
          <h1>Join a match</h1>
          <RadioGroup 
            className="match-list" 
            name="matcheList"
            value={matchId ? matchId : ""}
            onChange={selectMatch}>
            {getMatches()}
          </RadioGroup>
          <br/>
          <TextField 
          className="player-name-input"
          label="Player name" 
          variant="outlined"
          autoComplete="off"
          id = "playerName"
          name="playerName"
          value={playerName ? playerName : ""}
          onChange={handlePlayerName}/>
          <br/>
          <Button 
            type="submit" 
            className="join-match-button" 
            variant="contained"
            disabled = {matchId === undefined || playerName.replaceAll(' ','') === ""}>Join</Button>
        </form>        
    </div>
  );   
}

export default JoinMatch;
