import GameBoard, {debugCount} from './GameBoard';
import MinmaxSearch from './MinMaxSearch';


// function debugRising() {
//   const gameBoard12x12 = new GameBoard(12);
//   gameBoard12x12.setBoard([
//     0, 0, 0, 0, 5, 0,  0, 0, 0, 0, 0, 0, // 0,  ... ,  7,  8,  9, 10, 11
//     0, 0, 0, 6, 0, 1,  0, 0, 0, 0, 0, 0, // 12, ... , 20, 21, 22, 23
//     0, 0, 7, 0, 1, 0,  0, 0, 0, 0, 0, 0, // 24, ... , 33, 34, 35
//     0, 8, 0, 1, 0, 0,  0, 0, 0, 0, 0, 0, // 36, ... , 46, 47
//     9, 0, 1, 0, 0, 0,  0, 0, 0, 0, 0, 0, // 48, 59
//     0, 1, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, // 60, 71

//     0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, // 72
//     0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 2, // 84
//     0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 2, 0, // 96
//     0, 0, 0, 0, 0, 0,  0, 0, 0, 2, 0, 0, // 108, 119
//     0, 0, 0, 0, 0, 0,  0, 0, 2, 0, 0, 0, // 120, ... 129, 130, 131
//     0, 0, 0, 0, 0, 0,  0, 2, 0, 0, 0, 0, // 132, ... , 139, 140, 141, 142, 143
//   ]);
//   gameBoard12x12.evaluateWin(1);
// }

function debugEval() {
  const gameBoard8x8 = new GameBoard(8);

  gameBoard8x8.setBoard([
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 1,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, // 56
  ]); // 59

  // 2: i 6  j 6 idx 6 // innan
  // 1: i 7  j 7 verOpenBegining: t 7
  // 0: i 0  j 7 verOpenBegining: t 56

  gameBoard8x8.print();
  gameBoard8x8.evaluate(1);
}

// start 2 by 2
// this.gameBoard.setCell(20, 1);
// this.gameBoard.setCell(21, 2);
// this.gameBoard.setCell(36, 1);
// this.gameBoard.setCell(37, 2);

// ply 5
// this.gameBoard.setCell(20, 1);
// this.gameBoard.setCell(21, 2);
// this.gameBoard.setCell(35, 1);
// this.gameBoard.setCell(37, 2);
// this.gameBoard.setCell(50, 1);

// close to win
// this.gameBoard.setCell(20, 1);
// this.gameBoard.setCell(21, 2);
// this.gameBoard.setCell(36, 1);
// this.gameBoard.setCell(37, 2);
// this.gameBoard.setCell(68, 1);
// this.gameBoard.setCell(69, 2);

// one step from win
// this.gameBoard.setCell(20, 1);
// this.gameBoard.setCell(21, 2);
// this.gameBoard.setCell(36, 1);
// this.gameBoard.setCell(37, 2);
// this.gameBoard.setCell(52, 1);
// this.gameBoard.setCell(53, 2);
// this.gameBoard.setCell(68, 1);
// this.gameBoard.setCell(69, 2);

export default class FiveInRowGame {
  constructor(row, maxSearchDepth) {
    this.gameBoard = new GameBoard(row);

    // this.gameBoard.setCell(20, 1);
    // this.gameBoard.setCell(21, 2);
    // this.gameBoard.setCell(36, 1);
    // this.gameBoard.setCell(37, 2);
    // this.gameBoard.setCell(52, 1);

    this.row = row;
    this.ply = 5; // s0: 4
    this.maxSearchDepth = 5; // // s0: 5
    this.move = [];
    this.tempClick = 0;
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
