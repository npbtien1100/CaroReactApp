import Square from "./Square";

function RenderSquare({ squares, index, onClick, winIndexes }) {
  return (
    <Square
      value={squares[index]}
      onClick={() => onClick(index)}
      highlight={winIndexes ? winIndexes.includes(index) : null}
    />
  );
}
function Board({ squares, onClick, sizeBoard, winIndexes }) {
  const board = [...Array(sizeBoard)].map((e, i) => {
    const step = sizeBoard * i;
    return (
      <div className="board-row" key={i}>
        {[...Array(sizeBoard)].map((ele, j) => {
          return (
            <RenderSquare
              squares={squares}
              index={step + j}
              onClick={onClick}
              winIndexes={winIndexes}
              key={step + j}
            />
          );
        })}
      </div>
    );
  });
  return <div>{board}</div>;
}

export default Board;
