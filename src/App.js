import React, {useState} from 'react';
import './App.css';

import Grid from './components/Grid';
import ControlPanel from './components/ControlPanel'

import FiveInRow from './logic/FiveInRowGame';
const row = 16;
const game = new FiveInRow(row);

function App() {
  const [gameBoard, setGameBoard] = useState(game.getGameBoard());
  const [isAllowingNextStep, setIsAllowingNextStep] = useState(true);
  const [currentPlayer, setCurrentPlayer] = useState(game.currentPlayer());
  const [lastChangedCellIdx, setLastChangedCellIdx] = useState(-1);
  const [gameOver, setGameOver] = useState(false);

  function handleStep() {
    if (!game.isGameOver()) {
      setIsAllowingNextStep(false);
      setLastChangedCellIdx(-1);
      game.doNextMove()
        .then( (cellIdx) => {
          setGameBoard(game.getGameBoard());
          setIsAllowingNextStep(true);
          setLastChangedCellIdx(cellIdx);
          setGameOver(game.isGameOver());
          setCurrentPlayer(game.currentPlayer());
        });
    }
  }

  function handleClickCell(cellIdx) {
    if (isAllowingNextStep && !game.isGameOver()) {
      game.setCell(cellIdx, 1);
      setLastChangedCellIdx(cellIdx);
      setGameOver(game.isGameOver());
      setCurrentPlayer(game.currentPlayer());
      setGameBoard(game.getGameBoard());
    }
  }

  function handleRestart() {
    if (isAllowingNextStep) {
      game.reset();
      setLastChangedCellIdx(-1);
      setGameOver(game.isGameOver());
      setCurrentPlayer(game.currentPlayer());
      setGameBoard(game.getGameBoard());
    }
  }
  
  return (
    <div className="App" style={{display: 'flex', justifyContent: 'center', height: 'calc(100VH)', alignItems: 'center', backgroundColor: '#ebebeb' }}>
      <div style={{ position: 'relative', height: 600, width: 600 }}>
        <Grid
          row = {row}
          gameBoard = {gameBoard}
          handleClickCell = {handleClickCell}
          lastChangedCellIdx = {lastChangedCellIdx}
        />
        <ControlPanel
          gameOver={gameOver}
          handleStep={handleStep}
          handleRestart={handleRestart}
          isAllowingNextStep={isAllowingNextStep}
          currentPlayer={currentPlayer}
        />
      </div>
    </div>
  );
}

export default App;
