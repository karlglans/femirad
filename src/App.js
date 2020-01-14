import React from 'react';
import './App.css';

import Grid from './components/Grid';
import ControlPanel from './components/ControlPanel'

import FiveInRow from './logic/FiveInRowGame';
const game = new FiveInRow(16);

class App extends React.Component {
  constructor() {
    super();
    this.handleStep = this.handleStep.bind(this);
    this.handleClickCell = this.handleClickCell.bind(this);
    this.state = {
      gameBoard : game.getGameBoard(),
      isAllowingNextStep: true,
      currentPlayer: game.currentPlayer(),
      lastChangedCellIdx: -1,
      gameOver: false
    }
  }

  handleStep() {
    if (game.isGameOver()) {
      return;
    }
    // TODO: seems be blocking or something
    console.log('- handleStep handleStep - ');
    this.setState({ isAllowingNextStep: false, lastChangedCellIdx: -1 });
    game.doNextMove()
      .then( (cellIdx) => {
        this.setState({
          gameBoard : game.getGameBoard(),
          isAllowingNextStep: true,
          lastChangedCellIdx: cellIdx,
          gameOver: game.isGameOver(),
          currentPlayer: game.currentPlayer() });
      });
  }

  handleClickCell(cellIdx) {
    if (game.isGameOver()) {
      return;
    }
    if (this.state.isAllowingNextStep) {
      game.setCell(cellIdx, 1);
      this.setState({
        currentPlayer: game.currentPlayer(),
        gameBoard : game.getGameBoard(),
        gameOver: game.isGameOver(),
        lastChangedCellIdx: cellIdx
      });
    }
  }
  
  render() {
    return (
      <div className="App" style={{display: 'flex', justifyContent: 'center', height: 'calc(100VH)', alignItems: 'center', backgroundColor: '#ebebeb' }}>
        <div style={{ position: 'relative', height: 600, width: 600 }}>
          <Grid
            row = {16}
            gameBoard = {this.state.gameBoard}
            handleClickCell = {this.handleClickCell}
            lastChangedCellIdx = {this.state.lastChangedCellIdx}
          />
          <ControlPanel
            gameOver={this.state.gameOver}
            handleStep={this.handleStep}
            isAllowingNextStep={this.state.isAllowingNextStep}
            currentPlayer={this.state.currentPlayer}
          />
        </div>
      </div>
    );
  }
}

export default App;
