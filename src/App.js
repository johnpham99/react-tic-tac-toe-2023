import React from "react";
import { useState } from "react";

function Square({ isWinning, value, onSquareClick }) {
  return (
    <button
      className={isWinning ? "winning-square" : "square"}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, lastMove }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    nextSquares[10] = i;
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (lastMove) {
    status = "Draw!";
  }
  if (winner) {
    status = "Winner: " + winner[0];
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  //CREATE BOARD WITH TWO FOR LOOPS
  let board = [];
  for (let i = 0; i < 3; i++) {
    let row = [];
    for (let j = 0; j < 3; j++) {
      row.push(
        <Square
          key={i * 3 + j}
          value={squares[i * 3 + j]}
          onSquareClick={() => handleClick(i * 3 + j)}
          isWinning={winner ? winner.slice(1).includes(i * 3 + j) : null}
        />
      );
    }
    board.push(
      <div key={i} className="board-row">
        {row}
      </div>
    );
  }

  return (
    <div>
      <div className="status">{status}</div>
      {board}
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(10).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [listOrder, setListOrder] = useState(true); //defaults to ascending order

  function onToggleClick() {
    setListOrder(!listOrder);
  }

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  //changed to Let because of potential reverse later
  let moves = history.map((squares, move) => {
    let description;

    //DISPLAY FOR CURRENT MOVE ONLY
    if (currentMove === move) {
      return <li key={move}>You are at move #{move}</li>;
    }

    let row = Math.floor(squares[10] / 3) + 1;
    let col = (squares[10] % 3) + 1;

    if (move > 0) {
      description = "Go to move #" + move + " (" + row + "," + col + ")";
    } else {
      description = "Go to game start";
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  let moveList;
  listOrder
    ? (moveList = <ol>{moves}</ol>)
    : (moveList = <ol reversed>{moves.reverse()}</ol>);

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          lastMove={currentMove === 9}
        />
      </div>
      <div className="game-info">
        <button onClick={onToggleClick}>Toggle List</button>
        {moveList}
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], a, b, c];
    }
  }

  return null;
}
