import React, { useState, useEffect } from "react";
import { Button, TextField } from '@mui/material';
import '../styles/NewMatch.css';
import {useNavigate} from 'react-router-dom';

const WebSocket = require("../js/webSocket").default;
const client = WebSocket.getClient();

function NewMatch(){
  const [matchName, setMatchName] = useState('');
  const [password, setPassword] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [matchId, setMatchId] = useState(undefined);
  const navigate = useNavigate();

  //Reindirizza alla waiting room appena si ottienne l'id del match
  useEffect(()=>{ if(matchId !== undefined){ 
    client.unsubscribe("new_match");
    navigate("/waiting_room/" + matchId); 
  }
  },[matchId, navigate]);

  //Iscrizione al websocket
  useEffect(()=>{
    client.subscribe(
      "/user/queue/new_match", 
      function (payload) { setMatchId(JSON.parse(payload.body).id); },
      {id: "new_match"}
    );
  },[])

  const handleMatchName = event => {
    setMatchName(event.target.value);
  }
  const handlePassword = event => {
    setPassword(event.target.value);
  }
  const handlePlayerName = event => {
    setPlayerName(event.target.value);
  }  
  const newMatchSubmit = event =>{     
    event.preventDefault(); //Evita che viene ricaricata la pagina
    client.send("/app/new_match", {}, JSON.stringify({matchName: matchName, password: password, playerName: playerName}));
  }  

  return (
    <div className="new-match">
      <h1>New match</h1>
      <form onSubmit={newMatchSubmit}>
        <TextField 
          className="new-match-input"
          label="Match name" 
          variant="outlined" 
          autoComplete="off"
          id = "matchName"
          name="matchName"
          value={matchName}
          onChange={handleMatchName}/><br/>
        <TextField 
          className="new-match-input"
          label="Password" 
          variant="outlined" 
          autoComplete="off"
          type="password"
          id = "password"
          name="password"
          value={password}
          onChange={handlePassword}/><br/>
        <TextField 
          className="new-match-input"
          label="Player name" 
          variant="outlined"
          autoComplete="off"
          id = "playerName"
          name="playerName"
          value={playerName}
          onChange={handlePlayerName}/><br/>
        <Button 
          className="home-button" 
          type="submit"
          variant="contained" 
          disabled = {!(
            matchName.replaceAll(' ','') !== '' 
            && playerName.replaceAll(' ','') !== '' 
          )}
          >Done</Button>
      </form>
    </div>
  );
};

export default NewMatch;
