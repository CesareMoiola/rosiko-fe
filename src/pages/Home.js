import { Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import '../styles/Home.css';
import React  from 'react';

function Home() {
  return (
    <div className="home">
        <h1 className='home-title'>Rosiko</h1>
        <div className="home-buttons-container">
          <Button 
            className="home-button" 
            variant="contained" 
            component={RouterLink} 
            to="/join_match">Join match</Button>
          <br/>
          <Button className="home-button" 
            variant="outlined"  
            component={RouterLink} 
            to="/new_match">New match</Button>
        </div>
    </div>
  );
}

export default Home;
