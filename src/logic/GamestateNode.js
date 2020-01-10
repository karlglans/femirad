import { fiveInRow } from './ranking';

const sortNodesByMaxValue = (a, b) => a.value < b.value ? -1 : a.value > b.value ? 1 : 0;
const sortNodesByMinValue = (a, b) => a.value > b.value ? -1 : a.value < b.value ? 1 : 0;

// kankse döpa om till BoardSearchNode
export default class GamestateNode {
  constructor(gameBoard, move, ply) {
    // console.assert(gameBoard instanceof GameBoard);
    this.gameBoard = gameBoard;
    this.move = move;
    this.value = -1; // for compair min max 
    this.children = [];
    this.ply = ply;
    this.actingTeam = (ply % 2) + 1; // for debugging
  }

  /**
   * will make new board with the move included
   */
  applyMoveToGameboard(plyTeam) {
    const { gameBoard, move } = this;
    // if (move && move.cellIdx === 52) {
    //   debugger;
    // }
    this.gameBoard = gameBoard.applyMove(move, plyTeam);
  }

  checkWin(team) {
    const { gameBoard } = this;
    const winValue = gameBoard.evaluateWin(team);
    // if (winValue >= fiveInRow){
    //   console.log(winValue, fiveInRow);
    //   debugger;
    // }
    return winValue >= fiveInRow;
  }

  /**
   * Sorting childNodes based on ply and team.
   * @param {number, 1 or 2} team search is perforemed for this team
   * @param {number, 1 or 2} teamPly the theam to act at this ply
   */
  // sortChildren(shouldMax) {
  //   if (this.children.length > 0) {
  //     this.children.sort(shouldMax ? sortNodesByMaxValue : sortNodesByMinValue);
  //     return this.children[0].value;
  //   }
  // }
  sortChildren(shouldMax) {
    if (this.children.length > 0) {
      const { children } = this;
      let best, bestIdx = -1;
      if (!shouldMax) {
        best = -1000;
        children.forEach( (c, idx) => {
          if(c.value > best) {
            best = c.value;
            bestIdx = idx;
          }
        });
      } else {
        best = 1000;
        children.forEach( (c, idx)  => {
          if(c.value < best) {
            best = c.value;
            bestIdx = idx;
          }
        });
      }
      if (bestIdx !== -1) {
        this.children[0].move = children[bestIdx].move;
        this.children[0].value = best;
      }
      return best;
    }
  }

  getBestMove() {
    const { children } = this;
    if (children.length > 0) {
      console.log('best node: ', children[0].value);
      return children[0].move;
    }
    return null;
  }

  getValueFromFirstChild() {
    const { children } = this;
    if (children.length > 0) {
      return children[0].value;
    }
    return 0;
  }

  /**
   * @param {number} nChildren maximum number of children
   */
  generateChildren(nChildren) {
    const { gameBoard, ply } = this;
    const moves = gameBoard.generateMoves(nChildren);
    const children = [];
    moves.forEach(move => {
      children.push(new GamestateNode(gameBoard, move, ply + 1));
    });
    this.children = children;
    return children;
  }

  staticEvaluation(team) {
    const { gameBoard } = this;
    const opponentTeam = team === 1 ? 2 : 1;
    const value = gameBoard.evaluate(team) - gameBoard.evaluate(opponentTeam);
    gameBoard.relese(); // to save memory
    this.value = value;
    // console.log('static eval', team, value);
    return value;
  }
};