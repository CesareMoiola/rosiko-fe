import Home from './Home.js';
import NewMatch from './NewMatch.js';
import '../styles/App.css';
import {Route, Routes} from 'react-router-dom';
import WaitingRoom from './WaitingRoom.js';
import Match from './Match.js';
import React from 'react';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import JoinMatch from './JoinMatch.js';
import { ArmiesTheme } from "../js/armiesPalette";

const theme = createTheme(
  {
    palette: {
      secondary: {
        main:"#fafafa", 
        light:"#ffffff", 
        dark: "#eeeeee", 
        contrastText: ArmiesTheme.GRAY.dark
      }
    },
    shape: {
      borderRadius: 16
    }
  }
);

function App() {
  return (
    <div className="App">
      <ThemeProvider theme = {theme}>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/new_match" element={<NewMatch/>}/>
          <Route path="/join_match" element={<JoinMatch/>}/>
          <Route path="/waiting_room/:id" element={<WaitingRoom/>}/>
          <Route path="/Match/:id" element={<Match/>}/>
        </Routes>   
      </ThemeProvider>            
    </div>
  );
}

export default App;
