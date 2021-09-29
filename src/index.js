import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square({ value, onClick, highlight }) {
  //highlight ? "#e0ffff" : "none"
  return (
    <button
      className="square"
      onClick={onClick}
      style={{ backgroundColor: highlight ? "#e0ffff" : "" }}
    >
      {value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={i}
        highlight={
          this.props.winIndexes ? this.props.winIndexes.includes(i) : null
        }
      />
    );
  }
  render() {
    const board = [...Array(this.props.sizeBoard)].map((e, i) => {
      const step = this.props.sizeBoard * i;
      return (
        <div className="board-row" key={i}>
          {[...Array(this.props.sizeBoard)].map((ele, j) => {
            return this.renderSquare(step + j);
          })}
        </div>
      );
    });
    return <div>{board}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    const state = {
      sizeBoard: 0,
      stepNumber: 0,
      xIsNext: true,
      sortAscend: true,
    };
    this.state = {
      ...state,
      history: [
        {
          squares: Array(state.sizeBoard * state.sizeBoard).fill(null),
          tickedIndex: null,
        },
      ],
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (squares[i] || calculateWinnerDummy(squares)) return;
    squares[i] = this.state.xIsNext ? "X" : "O";
    const temp = history.concat([{ squares: squares, tickedIndex: i }]);
    this.setState({
      xIsNext: !this.state.xIsNext,
      history: temp,
      stepNumber: history.length,
    });
  }
  handleChange() {
    const temp = document.querySelector("#sizeBoardInput").value;
    const size = parseInt(temp);
    console.log(size);
    console.log(typeof size);
    if (size >= 0) {
      this.setState({
        sizeBoard: size,
        stepNumber: 0,
        xIsNext: true,
        sortAscend: true,
        history: [
          { squares: Array(size * size).fill(null), tickedIndex: null },
        ],
      });
    }
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }
  sortMoves() {
    this.setState({
      sortAscend: !this.state.sortAscend,
    });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinnerDummy(current.squares);

    //button toggle
    const toggle = (
      <button onClick={() => this.sortMoves()}>
        {this.state.sortAscend ? "Descending" : "Ascending"}
      </button>
    );

    //moves list
    const moves = history.map((step, move) => {
      const des = move ? `Go to move #${move}` : "Go to game start";

      //(col, row) feature
      let destination = des;
      const currentTickedIndex = history[move].tickedIndex;
      const sizeBoard = this.state.sizeBoard;
      if (currentTickedIndex !== null) {
        const col = (currentTickedIndex % sizeBoard) + 1;
        const row = parseInt(currentTickedIndex / sizeBoard) + 1;
        destination = des.concat(`: (${col}, ${row})`);
      }
      // bold selected item in move list
      if (move === this.state.stepNumber && history.length > 1)
        destination = <b>{destination}</b>;

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{destination}</button>
        </li>
      );
    });

    if (!this.state.sortAscend) moves.reverse();

    //status
    let status;
    console.log(winner);
    if (winner) {
      status = <b>Winner: {this.state.xIsNext ? "O" : "X"}</b>;
    } else if (isBoardFull(current.squares)) {
      status = <b>This game is a draw!</b>;
    } else {
      status = "Next Player: " + (this.state.xIsNext ? "X" : "O");
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
              onChange={() => this.handleChange()}
            ></input>
          </div>
        </div>
        <hr className="horizontalLine"></hr>
        {this.state.sizeBoard ? (
          <div className="game">
            <div className="game-board">
              <Board
                squares={current.squares}
                onClick={(i) => {
                  this.handleClick(i);
                }}
                sizeBoard={this.state.sizeBoard}
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
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}

function isBoardFull(squares) {
  for (const i of squares) {
    if (!i) return false;
  }
  return true;
}

function calculateWinnerDummy(squares) {
  const squaresLength = squares.length;
  console.log("squares: ", squares);
  console.log("squares length: ", squaresLength);
  const size = Math.sqrt(squaresLength);
  let sizeCheck = size;
  if (size > 5) sizeCheck = 5;
  console.log({ size: size, sizeCheck: sizeCheck });

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
// } else {
//   for (let i = 0; i < squaresLength; i++) {
//     //check column
//     if (
//       squares[i] &&
//       squares[i] === squares[i + size] &&
//       squares[i] === squares[i + size * 2] &&
//       squares[i] === squares[i + size * 3] &&
//       squares[i] === squares[i + size * 4]
//     ) {
//       return [i, i + size, i + size * 2, i + size * 3, i + size * 4];
//     }
//     //check row
//     if (
//       squares[i] &&
//       squares[i] === squares[i + 1] &&
//       squares[i] === squares[i + 2] &&
//       squares[i] === squares[i + 3] &&
//       squares[i] === squares[i + 4]
//     ) {
//       return [i, i + 1, i + 2, i + 3, i + 4];
//     }
//     //check diag
//     if (
//       squares[i] &&
//       squares[i] === squares[i + (size + 1)] &&
//       squares[i] === squares[i + (size + 1) * 2] &&
//       squares[i] === squares[i + (size + 1) * 3] &&
//       squares[i] === squares[i + (size + 1) * 4]
//     ) {
//       return [
//         i,
//         i + (size + 1),
//         i + (size + 1) * 2,
//         i + (size + 1) * 3,
//         i + (size + 1) * 4,
//       ];
//     }
//     //check antidiag
//     if (
//       squares[i] &&
//       squares[i] === squares[i - (size - 1)] &&
//       squares[i] === squares[i - (size - 1) * 2] &&
//       squares[i] === squares[i - (size - 1) * 3] &&
//       squares[i] === squares[i - (size - 1) * 4]
//     ) {
//       return [
//         i,
//         i - (size - 1),
//         i - (size - 1) * 2,
//         i - (size - 1) * 3,
//         i - (size - 1) * 4,
//       ];
//     }
//   }
// }
//   return null;
// }

function isNeedChecking(index, size) {
  const colindex = index % size;
  const distance = size - colindex;
  let sizeCheck = size;
  if (size > 4) sizeCheck = 5;
  if (distance < sizeCheck) return false;
  return true;
}
