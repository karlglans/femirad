import GameBoard, {debugCount} from './GameBoard';
import MinmaxSearch from './MinMaxSearch';
import { fiveInRow } from './ranking';

export default class FiveInRowGame {
  constructor(row, maxSearchDepth) {
    this.gameBoard = new GameBoard(row);
    this.row = row;
    this.ply = 0;
    this.maxSearchDepth = 5;
    this.move = [];
    this.tempClick = 0;
    this.gameIsOver = false;

    this.initDebugGameSituation(0);
  }

  initDebugGameSituation(situation) {
    if (situation === 1) {
      this.gameBoard.setCell(7 * 16 + 6, 2);
      this.gameBoard.setCell(7 * 16 + 7, 1);
      this.gameBoard.setCell(8 * 16 + 6, 1);
      this.gameBoard.setCell(8 * 16 + 7, 2);
      this.gameBoard.setCell(8 * 16 + 8, 2);
      this.gameBoard.setCell(9 * 16 + 8, 2);
      this.gameBoard.setCell(6 * 16 + 8, 1);
      this.gameBoard.setCell(6 * 16 + 5, 1);
      this.gameBoard.setCell(7 * 16 + 9, 1);
      this.ply = 7; 
    }
  }

  /**
   * Will make the a move for the active team.
   */
  doNextMove() {
    const {gameBoard, ply, maxSearchDepth, gameIsOver} = this;
    return new Promise( (resolve, reject) => {
      setTimeout(() => {
        const teamToAct = (ply % 2) + 1;

        if (gameIsOver) reject();
        const t1 = performance.now();
        
        const search = new MinmaxSearch(gameBoard, ply, maxSearchDepth);
        const move = search.search();
        if (move != null && !gameIsOver) {
          this.gameBoard = gameBoard.applyMove(move, teamToAct);
          this.evaluateWinningMove(move);
          this.ply = ply + 1;
        }
        resolve(move && move.cellIdx);

        const t2 = performance.now();
        console.log('move done', (t2 - t1) * 0.001, debugCount() );
      }, 0);
    });
  }

  reset() {
    this.gameBoard = new GameBoard(this.row);
    this.ply = 0;
    this.move = [];
    this.gameIsOver = false;
  }

  evaluateWinningMove(move) {
    const {ply} = this;
    // note: a win is given value: fiveInRow - ply by search algo 
    if (move.value >= (fiveInRow - ply - 1)) {
      this.gameIsOver = true;
    }
  }

  currentPlayer() {
    return (this.ply % 2) + 1;
  }
  isGameOver() {
    return this.gameIsOver;
  }
  getGameState() {
    return this.gameBoard;
  }
  getGameBoard() {
    return this.gameBoard.getBoard();
  }
  setCell(cellIdx) {
    const {gameBoard} = this;
    gameBoard.setCell(cellIdx, this.currentPlayer());
    if (gameBoard.evaluateWin(this.currentPlayer()) >= fiveInRow) {
      this.gameIsOver = true;
    }
    this.ply += 1;
  }
};
