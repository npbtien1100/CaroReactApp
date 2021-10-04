import React, { useState } from "react";
import Board from "./Board";

function jumpTo(step, setstepNumber, setxIsNext) {
  setstepNumber(step);
  setxIsNext(step % 2 === 0);
}

const sortMoves = (sortValue, setsortAscend) => {
  setsortAscend(!sortValue);
};

function handleClick(
  i,
  history,
  stepNumber,
  xIsNext,
  setHistory,
  setstepNumber,
  setxIsNext
) {
  const curhistory = history.slice(0, stepNumber + 1);
  const current = curhistory[curhistory.length - 1];
  const squares = current.squares.slice();
  if (squares[i] || calculateWinnerDummy(squares)) return;
  squares[i] = xIsNext ? "X" : "O";
  const temp = curhistory.concat([{ squares: squares, tickedIndex: i }]);
  setxIsNext(!xIsNext);
  setHistory(temp);
  setstepNumber(curhistory.length);
}

function handleChange(
  setsizeBoard,
  setstepNumber,
  setxIsNext,
  setsortAscend,
  setHistory
) {
  const temp = document.querySelector("#sizeBoardInput").value;
  const size = parseInt(temp);
  if (size >= 0) {
    setsizeBoard(size);
    setstepNumber(0);
    setxIsNext(true);
    setsortAscend(true);
    setHistory([{ squares: Array(size * size).fill(null), tickedIndex: null }]);
  }
}

// ========================================
function Game() {
  const [sizeBoard, setsizeBoard] = useState(0);
  const [stepNumber, setstepNumber] = useState(0);
  const [xIsNext, setxIsNext] = useState(true);
  const [sortAscend, setsortAscend] = useState(true);
  const [history, setHistory] = useState([
    { squares: Array(sizeBoard * sizeBoard).fill(null), tickedIndex: null },
  ]);

  const currhistory = history;
  const current = currhistory[stepNumber];
  const winner = calculateWinnerDummy(current.squares);

  //button toggle
  const toggle = (
    <button
      onClick={() => {
        sortMoves(sortAscend, setsortAscend);
      }}
    >
      {sortAscend ? "Descending" : "Ascending"}
    </button>
  );

  //moves list
  const moves = currhistory.map((step, move) => {
    const des = move ? `Go to move #${move}` : "Go to game start";

    //(col, row) feature
    let destination = des;
    const currentTickedIndex = currhistory[move].tickedIndex;
    const thisSizeBoard = sizeBoard;
    if (currentTickedIndex !== null) {
      const col = (currentTickedIndex % thisSizeBoard) + 1;
      const row = parseInt(currentTickedIndex / thisSizeBoard) + 1;
      destination = des.concat(`: (${col}, ${row})`);
    }
    // bold selected item in move list
    if (move === stepNumber && currhistory.length > 1)
      destination = <b>{destination}</b>;

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move, setstepNumber, setxIsNext)}>
          {destination}
        </button>
      </li>
    );
  });

  if (!sortAscend) moves.reverse();

  //status
  let status;
  if (winner) {
    status = <b>Winner: {xIsNext ? "O" : "X"}</b>;
  } else if (isBoardFull(current.squares)) {
    status = <b>This game is a draw!</b>;
  } else {
    status = "Next Player: " + (xIsNext ? "X" : "O");
  }

  return (
    <div>
      <div className="size-board-title">
        <div>
          <label htmlFor="sizeBoardInput">Enter size board: </label>
        </div>
        <div>
          <input
            id="sizeBoardInput"
            type="number"
            onChange={() =>
              handleChange(
                setsizeBoard,
                setstepNumber,
                setxIsNext,
                setsortAscend,
                setHistory
              )
            }
          ></input>
        </div>
      </div>
      <hr className="horizontalLine"></hr>
      {sizeBoard ? (
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={(i) => {
                handleClick(
                  i,
                  history,
                  stepNumber,
                  xIsNext,
                  setHistory,
                  setstepNumber,
                  setxIsNext
                );
              }}
              sizeBoard={sizeBoard}
              winIndexes={winner}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <div>Sort moves list by {toggle}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function isBoardFull(squares) {
  for (const i of squares) {
    if (!i) return false;
  }
  return true;
}

function calculateWinnerDummy(squares) {
  const squaresLength = squares.length;
  const size = Math.sqrt(squaresLength);
  let sizeCheck = size;
  if (size > 5) sizeCheck = 5;

  //checkwin
  for (let i = 0; i < squaresLength; i++) {
    let stepCol, stepRow, stepDiag, stepAntiDiag;

    if (squares[i]) {
      //check column
      const arrCol = [i];
      for (let j = 1; j < sizeCheck; j++) {
        stepCol = i + size * j;
        if (squares[i] !== squares[stepCol]) {
          break;
        }
        arrCol.push(stepCol);
      }
      if (arrCol.length === sizeCheck) return arrCol;

      if (isNeedChecking(i, size)) {
        //check row
        const arrRow = [i];
        for (let j = 1; j < sizeCheck; j++) {
          stepRow = i + j;
          if (squares[i] !== squares[stepRow]) {
            break;
          }
          arrRow.push(stepRow);
        }
        if (arrRow.length === sizeCheck) return arrRow;

        //check diag
        const arrDiag = [i];
        for (let j = 1; j < sizeCheck; j++) {
          stepDiag = i + (size + 1) * j;
          if (squares[i] !== squares[stepDiag]) {
            break;
          }
          arrDiag.push(stepDiag);
        }
        if (arrDiag.length === sizeCheck) return arrDiag;

        //check anti diag
        const arrAntiDiag = [i];
        for (let j = 1; j < sizeCheck; j++) {
          stepAntiDiag = i - (size - 1) * j;
          if (squares[i] !== squares[stepAntiDiag]) {
            break;
          }
          arrAntiDiag.push(stepAntiDiag);
        }
        if (arrAntiDiag.length === sizeCheck) return arrAntiDiag;
      }
    }
  }
  return null;
}

function isNeedChecking(index, size) {
  const colindex = index % size;
  const distance = size - colindex;
  let sizeCheck = size;
  if (size > 4) sizeCheck = 5;
  if (distance < sizeCheck) return false;
  return true;
}

export default Game;
