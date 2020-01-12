import GameBoard, {debugCount} from './GameBoard';
import MinmaxSearch from './MinMaxSearch';

export default class FiveInRowGame {
  constructor(row, maxSearchDepth) {
    this.gameBoard = new GameBoard(row);
    this.row = row;
    this.ply = 0; // s0: 4
    this.maxSearchDepth = 5; // // s0: 5
    this.move = [];
    this.tempClick = 0;

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
    return new Promise( (resolve, reject) => {
      setTimeout(() => {
        const {gameBoard, ply, maxSearchDepth} = this;
        const teamToAct = (ply % 2) + 1;

        const t1 = performance.now();


        // aaaa();
        // debugRising();
        // debugEval();
        
        
        const search = new MinmaxSearch(gameBoard, ply, maxSearchDepth);
        const move = search.search();
        if (move != null) {
          console.log('found move');
          this.gameBoard = gameBoard.applyMove(move, teamToAct);
          this.ply = ply + 1;
        }
        resolve(move && move.cellIdx);


        // const arr = getIndicesFromCenter(this.row);
        // const idx = arr[this.tempClick];
        // this.tempClick++;
        // this.gameBoard.setCell(idx, 1);

        const t2 = performance.now();
        console.log('move done', (t2 - t1) * 0.001, debugCount() );

        // some messurements
        // depth: 5, 
        // normal evaluate:  382'205'952
        // 24.5  29.0  24.5  24.4  24.1  efcomp  15.0 15.5
        
        // evaluate row-1:  340'918'272
        // 22.3  23.4  23.0  24.0  21.8  efcomp 14.7 14.7 14.0
        // efwin 12.0 11.8 12
        
        // evaluate feature: 264'634'368
        // 35.3 35.7  efcomp 29.7

        // case1: depth: 5, maxChid: 18d
        // 533063
        // 5.07  5.11
        // 23.8 23.8

        // case1: depth: 7, maxChid: 25d
        // 2345070
        // sort:     22.45 23.4
        // pick1st:  21.4  21.8
      }, 0);
    });
  }

  currentPlayer() {
    return (this.ply % 2) + 1;
  }

  getGameState() {
    return this.gameBoard;
  }
  getGameBoard() {
    return this.gameBoard.getBoard();
  }
  setCell(cellIdx, player) {
    this.gameBoard.setCell(cellIdx, this.currentPlayer());
    this.ply += 1;
  }
};
