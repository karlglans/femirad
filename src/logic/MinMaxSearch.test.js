import MinMaxSearch from "./MinMaxSearch";
import GameBoard from "./GameBoard";

// put xdescribe to remove these tests
describe('some expensve search tests', function () {
  const row = 8, teamOne = 1, teamTwo = 2, searchDepth = 3;
  const gameBoard = new GameBoard(row);
  const gameBoardExpected = new GameBoard(row);
  test('move 1: block opponent', () => {
    gameBoard.setBoard([
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 1, 2, 0, 0, 0, 0,
      0, 0, 1, 2, 0, 0, 0, 0,
      0, 0, 1, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
    ]);
    gameBoardExpected.setBoard([
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 2, 0, 0, 0, 0, 0,
      0, 0, 1, 2, 0, 0, 0, 0,
      0, 0, 1, 2, 0, 0, 0, 0,
      0, 0, 1, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
    ]);
    const ply = 5; // means player 2 should act
    const minmax = new MinMaxSearch(gameBoard, ply, searchDepth);
    const nextBoard = gameBoard.applyMove(minmax.search(), teamTwo);
    expect(nextBoard.getBoard()).toStrictEqual(gameBoardExpected.getBoard());
  });
  test('move 2: team 1 will compeate 4-cell-line', () => {
    gameBoard.setBoard([
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 1, 2, 0, 0, 0, 0,
      0, 0, 1, 2, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 1, 2, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
    ]);
    gameBoardExpected.setBoard([
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 1, 2, 0, 0, 0, 0,
      0, 0, 1, 2, 0, 0, 0, 0,
      0, 0, 1, 0, 0, 0, 0, 0,
      0, 0, 1, 2, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
    ]);
    const ply = 6; // means player 1 should act
    const minmax = new MinMaxSearch(gameBoard, ply, searchDepth);
    const nextBoard = gameBoard.applyMove(minmax.search(), teamOne);
    expect(nextBoard.getBoard()).toStrictEqual(gameBoardExpected.getBoard());
  });
  test('move 2: team 2 will compeate 4-cell-line', () => {
    gameBoard.setBoard([
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 1, 2, 0, 0, 0, 0,
      0, 0, 1, 2, 0, 0, 0, 0,
      0, 1, 0, 0, 0, 0, 0, 0,
      0, 0, 1, 2, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
    ]);
    gameBoardExpected.setBoard([
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 1, 2, 0, 0, 0, 0,
      0, 0, 1, 2, 0, 0, 0, 0,
      0, 1, 0, 2, 0, 0, 0, 0,
      0, 0, 1, 2, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
    ]);
    const ply = 7; // means player 2 should act
    const minmax = new MinMaxSearch(gameBoard, ply, searchDepth);
    const nextBoard = gameBoard.applyMove(minmax.search(), teamTwo);
    expect(nextBoard.getBoard()).toStrictEqual(gameBoardExpected.getBoard());
  });
});