import { isNumber } from 'util';
import Move from './Movement';
import { open2cells, semiOpen2cells, open3cells, semiOpen3cells, open4row,
  semiOpen4row, fiveInRow } from './ranking';
import makePriortyOrderedListOfOpenIndecis from './makeListOfPrioIndecis';


/*
  3 * * * * 
  2 * * * *
  j * * * *
  1 * * * *
  0 1 i 2 3
*/

const cellTypeUndefined = -1;
const cellTypeOpen = 0; // could still be taken
const cellTypeTaken = 1; // taken by player
const cellTypeObstacle = 2; // taken by opponent or inaccesible due to out of map edge
let debug_countItt = 0;

export function debugCount() {
  return debug_countItt;
}


/**
 * Built around an an array of numbers 0, 1, 2 of size row ^ 2.
 * Thiese numbers represent team numbers and 0 for empty cell.
 */
export default class GameBoard {
  constructor(row) {
    this.row = row;
    this.board = [ ...Array(row*row) ].map((_, i) => 0);
  }

  setCell(idx, value) {
    this.board[idx] = value;
  }

  getBoard() {
    return this.board;
  }

  relese() {
    this.board = null;
  }

  /**
   * Will replace this.board with new board.
   * @param {Move} move 
   * @param {number 1 or 2} team 
   */
  applyMove(move, team) {
    const newBoard = new GameBoard(this.row);
    newBoard.board = this.board.slice();
    if (move == null || move === undefined) {
      
    } else {
      newBoard.board[move.getCellId()] = team;
    }
    return newBoard;
  }

  generateMoves(maxMoves) {
    const { board, row } = this;
    // const indices = getIndicesFromCenter(row); // from center and out instead of from 0
    const indices = makePriortyOrderedListOfOpenIndecis(board, row, maxMoves);
    const result = [];
    let nFoundMoves = 0;
    indices.forEach(boardPosIdx => {
      if (nFoundMoves < maxMoves && board[boardPosIdx] === 0) {
        result.push(new Move(boardPosIdx));
        nFoundMoves++;
      }
    });
    return result;
  }

  /**
   * Will reverse line order to make inserted array more readable.
   * @param {*} arr array of cells: 0: free, 1: player1, 2: player2 
   */
  setBoard(arr) {
    const dest = [];
    let idx = 0, idxRowStart = 0;
    for(let j = 0; j < this.row; j++) {
      idxRowStart = (this.row - j - 1) * this.row;
      for(let i = 0; i < this.row; i++, idx++) {
        console.assert(isNumber(arr[idxRowStart + i]));
        dest.push(arr[idxRowStart + i])
      }
    }
    this.board = dest;
  }

  /**
   * Will produce a sequense that will represent the result of a subsetSelection of the gamemap.
   * This sequense is designed to be compaired with feateures like: two horizontal cells.
   * The informoaton will be simplified and will reduce cells belonging to the opponent to an obsicle,
   * just like cells outside maps.
   * (idea: Will return [] if offset position is found to be outside gameMap.)
   * 
   * gameMap         +    subsetSelection              =  subset
   *  0  0  0  0  0        0  0  0  0  0 
   *  0  0  0  0  0        0  0  0  0  0 
   *  0  0  0  1  0        0  0  0 [1  0  0  0]         [1  0  2  2]
   *  0  0  0  0  1        0  0  0 [0  1  0  0]         [0  1  2  2]
   *  0  0  0  0  0        0  0  0 [0  0  0  0]         [0  0  2  2]
   *                               [0  0  0  0]         [2  2  2  2]
   * 
   * @param {*} i0 gameMap position
   * @param {*} j0 gameMap position
   * @param {*} offsetU center position in mask. 
   * @param {*} offsetV center position in mask
   * @param {*} width dim mask
   * @param {*} height dim mask
   * @param {*} team 1 or 2.
   */
  makeSubset(i0, j0, board, row, subWidth, subHeight, team) {
    let u, v; // postions in subsetSelection
    let subset = [];
    let i1, j1; // positions in gameMap. could also end up outside map
    let idx; // index to gameMap
    let cellType = cellTypeUndefined;
    for (v = 0; v < subHeight; v++) {
      for (u = 0; u < subWidth; u++) {
        cellType = cellTypeUndefined; 
        i1 = i0 + u;
        j1 = j0 + v;
        if (i1 < 0 || j1 < 0 || i1 >= row || j1 >= row) {
          cellType = cellTypeObstacle; // outside gameMap, maybe remove
        } else {
          idx = i1 + j1 * row;
          if (board[idx] === 0) {
            cellType = cellTypeOpen;
          } else if (board[idx] === team) {
            cellType = cellTypeTaken;
          } else {
            cellType = cellTypeObstacle;
          }
        }
        subset.push(cellType);
      }
    }
    return subset;
  }

  print() {
    const { board, row } = this;
    let str = "";
    for (let j = 0, idx = 0; j < row; j++) {
      str += (" " + idx + " ");
      for (let i = 0; i < row; i++, idx++) {
        str += board[idx];
        str += ", ";
      }
      console.log(str);
      str = "";
    }
  }

  evaluate(team) {
    const { board, row } = this;
    let accValue = 0; // consider maybe not accumelate points, instead just return after 5 cells in row

    // combines vertical and horizontal search for lines
    let i, j, idxHor = 0, idxVer = 0, horLineCount = 0, verLineCount = 0;
    const rowMax = row - 1;
    let isLastRowI; 
    let horOpenBegining, verOpenBegining = false;
    let countClosedSides;
    for (j = 0; j < row; j++, verLineCount = 0, verOpenBegining = false) {
      horLineCount = 0;
      idxVer = j;
      horOpenBegining = false;
      for (i = 0; i < row; i++) {
      
        // ****************** horizontal block ******************

        isLastRowI = i === rowMax;

        // count horizontal points
        if (horLineCount > 0 && (isLastRowI || board[idxHor] !== team)) {
          if (isLastRowI && board[idxHor] === team) horLineCount += 1;
          if (horLineCount > 1) {
            countClosedSides = board[idxHor] !== cellTypeOpen ? 1: 0;
            if (!horOpenBegining) countClosedSides += 1;
            if (countClosedSides < 2) {
              if (horLineCount === 2) accValue += countClosedSides === 0 ? open2cells : semiOpen2cells;
              else if (horLineCount === 3) accValue += countClosedSides === 0 ? open3cells : semiOpen3cells;
              else if (horLineCount === 4) {
                if (countClosedSides === 0) return open4row; // vitory!
                else accValue += semiOpen4row;
              }
            }
          }
        }
        // prep for next itteration
        if (!isLastRowI && board[idxHor] === team) {
          horLineCount += 1;
        } else {
          horOpenBegining = board[idxHor] === cellTypeOpen;
          horLineCount = 0;
        }

        // ****************** vertical block *******************

        // count vertical points
        if (verLineCount > 0 && (isLastRowI || board[idxVer] !== team)) {
          if (isLastRowI && board[idxVer] === team) verLineCount += 1;
          if (verLineCount > 1) {
            countClosedSides = board[idxVer] !== cellTypeOpen ? 1: 0;
            if (!verOpenBegining) countClosedSides += 1;
            if (countClosedSides < 2) {
              if (verLineCount === 2) accValue += countClosedSides === 0 ? open2cells : semiOpen2cells;
              else if (verLineCount === 3) accValue += countClosedSides === 0 ? open3cells : semiOpen3cells;
              else if (verLineCount === 4) {
                if (countClosedSides === 0) return open4row; // vitory!
                else accValue += semiOpen4row;
              }
            }
          }
        }
        // prep for next itteration
        if (!isLastRowI && board[idxVer] === team) {
          verLineCount += 1;
        } else {
          verOpenBegining = board[idxVer] === cellTypeOpen;
          verLineCount = 0;
        }

        // orthogonal steps
        idxVer += row;
        idxHor += 1;
      }
    }

    // combines search in two directions by diagonal lines.
    // Stepping upwords from sides till hitting indices lower then 0.
    // Also 'extending' nxn board when reaching bottom by changing direction (from i to j),
    // to be able to reach evry diagonal.
    
    //         i -->
    //       0  2  3  *  *  5
    //   j   6  *  /  \  *  *
    //   |   *  /  *  *  \  *
    //   v   /  *  *  *  *  \  

    const firstIndexLastRow = row * (row - 1);
    const lastIndex = row * row - 1;
    const maxJ = row * 2 - 3;
    let offestI = 0;
    let idxFall, idxRise, fallLineCellCount = 0, riseLineCellCount = 0;
    const risingStep = -row -1, fallingStep = -row + 1;
    let fallOpenBegining = false, riseOpenBegining = false;
    const startOffsetDown = 2; // enogh to fit in 3 cells in diagonal, for detecting semi-open 2 line
    for (j = startOffsetDown; j < maxJ; j++) {
      if (j < row) {
        idxFall = j * row; // first in row
        idxRise = (j + 1) * row - 1; // last in row
        i = 0
      } else { // after stepping out of bottom of NxN we are gonna follow last row
        offestI += 1;
        i = offestI;
        idxFall = firstIndexLastRow + offestI;
        idxRise = lastIndex - offestI;
      }
      fallOpenBegining = false;
      riseOpenBegining = false;
      for (; i < row; i++) {

        if (idxFall < 0) {
          i = row;
          continue;
        }
        // reched end of line, that is special horizontal line
        isLastRowI = i === rowMax || idxFall < row;

        if (fallLineCellCount > 0 && (isLastRowI || board[idxFall] !== team)) {
          if (isLastRowI && board[idxFall] === team) fallLineCellCount += 1;
          if (fallLineCellCount > 1) {
            countClosedSides = board[idxFall] !== cellTypeOpen ? 1: 0;
            if (!fallOpenBegining) countClosedSides += 1;
            if (countClosedSides < 2) {
              if (fallLineCellCount === 2) accValue += countClosedSides === 0 ? open2cells : semiOpen2cells;
              else if (fallLineCellCount === 3) accValue += countClosedSides === 0 ? open3cells : semiOpen3cells;
              else if (fallLineCellCount === 4) {
                if (countClosedSides === 0) return open4row; // vitory!
                else accValue += semiOpen4row;
              }
            }
          }
        }

        // prep for next itteration
        if (!isLastRowI && board[idxFall] === team) {
          fallLineCellCount += 1;
        } else {
          fallOpenBegining = board[idxFall] === cellTypeOpen;
          fallLineCellCount = 0;
        }

        if (riseLineCellCount > 0 && (isLastRowI || board[idxRise] !== team)) {
          if (isLastRowI && board[idxRise] === team) riseLineCellCount += 1;
          if (riseLineCellCount > 1) {
            countClosedSides = board[idxRise] !== cellTypeOpen ? 1: 0;
            if (!riseOpenBegining) countClosedSides += 1;
            if (countClosedSides < 2) {
              if (riseLineCellCount === 2) accValue += countClosedSides === 0 ? open2cells : semiOpen2cells;
              else if (riseLineCellCount === 3) accValue += countClosedSides === 0 ? open3cells : semiOpen3cells;
              else if (riseLineCellCount === 4) {
                if (countClosedSides === 0) return open4row; // vitory!
                else accValue += semiOpen4row;
              }
            }
          }
        }

        // prep for next itteration
        if (!isLastRowI && board[idxRise] === team) {
          riseLineCellCount += 1;
        } else {
          riseOpenBegining = board[idxRise] === cellTypeOpen;
          riseLineCellCount = 0;
        }

        // vertical steps upwards towards index 0
        idxFall += fallingStep; 
        idxRise += risingStep;
      }
      fallLineCellCount = 0;
      riseLineCellCount = 0; // tveksam
    }

    return accValue;
  }

  /** Will give out points for 5 cells in a line */
  evaluateWin(team) {
    const { board, row } = this;
    let accValue = 0; // consider maybe not accumelate points, instead just return after 5 cells in row

    // combines vertical and horizontal 
    let i, j, idxHor = 0, idxVer = 0, horLineCount = 0, verLineCount = 0;
    for (j = 0; j < row; j++) {
      horLineCount = 0;
      idxVer = j;
      for (i = 0; i < row; i++) {
        if (board[idxHor] === team) {
          horLineCount += 1;
          if (horLineCount === 5) {
            accValue += fiveInRow;
            horLineCount = 0;
          }
        } else {
          horLineCount = 0;
        }
        if (board[idxVer] === team) {
          verLineCount += 1;
          if (verLineCount === 5) {
            accValue += fiveInRow;
            verLineCount = 0;
          }
        } else {
          verLineCount = 0;
        }
        // orthogonal steps
        idxVer += row;
        idxHor += 1;
      }
    }
 
    // combines falling/rising lines
    const firstIndexLastRow = row * (row - 1);
    const lastIndex = row * row - 1;
    const maxJ = row * 2 - 5;
    let offestI = 0;
    let idxFall, idxRise, fallLineCellCount = 0, riseLineCellCount = 0;
    const risingStep = -row -1, fallingStep = -row + 1;
    for (j = 4; j < maxJ; j++) {
      if (j < row) {
        idxFall = j * row; // first in row
        idxRise = (j + 1) * row - 1; // last in row
        i = 0
      } else { // after stepping out of bottom of NxN we are gonna follow last row
        offestI += 1;
        i = offestI;
        idxFall = firstIndexLastRow + offestI;
        idxRise = lastIndex - offestI;
      }
      for (; i < row; i++) {
        if (idxFall < 0) {
          if (idxRise > 0) debugger; // should not happen
          i = row;
          continue;
        } 
        if (board[idxFall] === team) {
          fallLineCellCount++;
          if (fallLineCellCount === 5) {
            accValue += fiveInRow;
            fallLineCellCount = 0;
          }
        } else {
          fallLineCellCount = 0;
        }
        if (board[idxRise] === team) {
          riseLineCellCount++;
          if (riseLineCellCount === 5) {
            accValue += fiveInRow;
            riseLineCellCount = 0;
          }
        } else {
          riseLineCellCount = 0;
        }
        // vertical steps upwards towards index 0
        idxFall += fallingStep; 
        idxRise += risingStep;
      }
    }

    debug_countItt += 1;
    return accValue; // accValue
  }
}