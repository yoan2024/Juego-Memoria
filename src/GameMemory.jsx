import React, { useEffect } from "react";
import { useState } from "react";

const GameMemory = () => {
  const [size, setSIze] = useState(5);
  const [cards, setCards] = useState([]);
  const [volteadas, setVolteadas] = useState([]);
  const [resueltas, setResueltas] = useState([]);
  const [disable, setDisable] = useState(false);
  const [win, setWin] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (cards.length === resueltas.length) {
      setWin(true);
    }
  }, [resueltas]);

  const comenzarJuego = () => {
    setVolteadas([]);
    setDisable(false);
    setResueltas([]);
    setWin(false);

    const tamaño = size * size;
    const mitad = size;
    const porcion = [...Array(mitad).keys()];
    const newArray = [...porcion, ...porcion]
      .slice(0, tamaño)
      .sort(() => Math.random() - 0.5)
      .map((number, index) => {
        return { id: index, number };
      });
    setScore(0);
    setCards(newArray);
  };

  const handleInput = (e) => {
    const number = parseInt(e.target.value);
    setSIze(number);
  };

  const handleClik = (id) => {
    console.log("entro el click");
    if (win | disable) return;
    console.log("sigue checando...");

    if (volteadas.length === 0) {
      setVolteadas([id]);
    }

    if (volteadas.length === 1) {
      setVolteadas((previos) => [...previos, id]);
      setDisable(true);

      ///checar si hay par////
      ChecarPar(id);
    }
  };

  function ChecarPar(segundoId) {
    const primerId = volteadas[0];
    if (
      (cards[primerId].number === cards[segundoId].number) &
      (cards[primerId].id !== cards[segundoId].id)
    ) {
      setResueltas((previos) => [...previos, primerId, segundoId]);
      setScore((previos) => previos + 10);
      setVolteadas([]);
      setDisable(false);
    } else {
      setTimeout(() => {
        setVolteadas([]);
        setDisable(false);
      }, 1000);
    }
  }

  function handleReset() {
    comenzarJuego();
  }

  useEffect(() => {
    comenzarJuego();
  }, [size]);

  const isvolteada = (id) => volteadas.includes(id) | resueltas.includes(id);

  console.log("todas las cartas", cards);
  console.log("todas las resueltas", resueltas);
  return (
    <div className="min-h-screen bg-teal-100  flex flex-col justify-center items-center">
      <h1 className="mb-6 font-bold text-5xl">Memory Game</h1>
      <h2 className="font-bold text-2xl">SCORE : {score} </h2>
      <div>
        <label htmlFor="tamaño" className="text-2xl font-sans mr-2">
          TAMAÑO:{" "}
        </label>
        <input
          type="number"
          value={size}
          min={2}
          max={10}
          id="tamaño"
          onChange={(e) => handleInput(e)}
          className="w-40 rounded-lg p-1"
        />
      </div>

      <div
        className="grid gap-2 mt-10  mb-6  p-4"
        style={{
          gridTemplateColumns: `repeat(${size}, minmax(0,1fr))`,
          width: `min(100%, ${size * 7.5}rem)`,
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className={` text-yellow-500 rounded-lg shadow-md  cursor-pointer  items-center justify-center flex text-2xl font-bold aspect-square  ${
              resueltas.includes(card.id)
                ? "bg-green-400"
                : volteadas.includes(card.id)
                ? "bg-slate-600"
                : "bg-white"
            } `}
            onClick={() => handleClik(card.id)}
          >
            {isvolteada(card.id) ? card.number : "?"}
          </div>
        ))}
      </div>
      <div className=" animate-bounce font-bold text-green-600 text-5xl">
        {win ? "WIN !" : ""}
      </div>
      <div className="mt-5">
        <button
          className={` p-2 rounded-xl text-white font-semibold   ${
            win ? "bg-green-800" : "bg-red-700"
          }`}
          onClick={() => handleReset()}
        >
          {win ? "JUGAR DE NUEVO" : "RESET"}
        </button>
      </div>
    </div>
  );
};

export default GameMemory;
