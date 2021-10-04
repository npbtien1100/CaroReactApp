function Square({ value, onClick, highlight }) {
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

export default Square;
