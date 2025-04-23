import React, { useEffect } from "react";
import { useState } from "react";

const GameMemory = () => {
  const [size, setSIze] = useState(2);
  const [cards, setCards] = useState([]);
  const [volteadas, setVolteadas] = useState([]);
  const [resueltas, setResueltas] = useState([]);
  const [disable, setDisable] = useState(false);
  const [win, setWin] = useState(false);
  const [score, setScore] = useState(0);
  const [iniciadoJuego, setIniciadoJuego] = useState(true);
  const [intentos, setIntentos] = useState(0);
  const [perder, setPerder] = useState(false);
  const [tipoCards, setTipoCards] = useState("numeros");

  const comenzarJuego = () => {
    let newArray;
    const tamaño = size * size;
    const mitad = size;

    if (tipoCards === "frutas") {
      setTipoCards("frutas");

      let porcion = [];
      for (let i = 0; i < mitad; i++) {
        porcion.push(frutasConEmojis[i]);
      }

      newArray = [...porcion, ...porcion]
        .slice(0, tamaño)
        .sort(() => Math.random() - 0.5)
        .map((f, index) => {
          return { id: index, fruta: f };
        });
    }
    if (tipoCards === "numeros") {
      setTipoCards("numeros");
      const porcion = [...Array(mitad).keys()];
      newArray = [...porcion, ...porcion]
        .slice(0, tamaño)
        .sort(() => Math.random() - 0.5)
        .map((number, index) => {
          return { id: index, number };
        });
    }

    setIntentos(0);
    setIniciadoJuego(true);
    setVolteadas([]);
    setDisable(false);
    setResueltas([]);
    setWin(false);
    setPerder(false);
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

  function siResuelta(segundoId) {
    const primerId = volteadas[0];
    setResueltas((previos) => [...previos, primerId, segundoId]);
    setScore((previos) => previos + 10);
    setVolteadas([]);
    setDisable(false);
  }
  function noResuelta() {
    setTimeout(() => {
      setVolteadas([]);
      setDisable(false);
    }, 1000);
  }

  function ChecarPar(segundoId) {
    setIntentos((previos) => previos + 1);
    const primerId = volteadas[0];

    if (
      (tipoCards === "numeros") &
      (cards[primerId].number === cards[segundoId].number) &
      (cards[primerId].id !== cards[segundoId].id)
    ) {
      siResuelta(segundoId);
    } else {
      noResuelta();
    }

    if (
      (tipoCards === "frutas") &
      (cards[primerId].fruta === cards[segundoId].fruta) &
      (cards[primerId].id !== cards[segundoId].id)
    ) {
      siResuelta(segundoId);
    } else {
      noResuelta();
    }
  }

  function handleReset() {
    comenzarJuego();
  }

  function cardsSetTimeOut(id, simbolo) {
    if (iniciadoJuego) {
      return simbolo;
    }

    return isvolteada(id) ? simbolo : "?";
  }

  useEffect(() => {
    console.log("si entro en e l useeffect");
    const limite = size * 2;
    if (intentos === limite) {
      setTimeout(() => {
        setPerder(true);
        setDisable(true);
      }, 1010);
    }
  }, [intentos]);

  useEffect(() => {
    if ((tipoCards === "numeros") | (tipoCards === "frutas")) {
      comenzarJuego();
    }
  }, [size, tipoCards]);

  useEffect(() => {
    if (iniciadoJuego) {
      setTimeout(() => {
        setIniciadoJuego(false);
      }, 3000);
    }
  }, [iniciadoJuego]);

  useEffect(() => {
    console.log("esta resolviendo correcto");
    if (
      (cards.length > 0) &
      (resueltas.length > 0) &
      (cards.length === resueltas.length)
    ) {
      console.log("se esta dando win true correcto");
      setWin(true);
    }
  }, [resueltas]);

  const isvolteada = (id) => volteadas.includes(id) | resueltas.includes(id);

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
        <h3>
          INTENTOS {intentos}/{size * 2}
        </h3>
        <label htmlFor="tipoCartas"> TIPO DE CARTAS : </label>
        <input
          type="text"
          name=""
          id="tipoCartas"
          value={tipoCards}
          onChange={(e) => setTipoCards(e.target.value.toLocaleLowerCase())}
        />
        <h2>TIPOS DE CARTAS DISPONIBLES: FRUTAS, NUMEROS</h2>
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
            {tipoCards === "numeros"
              ? cardsSetTimeOut(card.id, card.number)
              : tipoCards === "frutas"
              ? cardsSetTimeOut(card.id, card.fruta)
              : ""}
          </div>
        ))}
      </div>
      <div
        className={` animate-bounce font-bold text-5xl  ${
          win ? "text-green-600 " : perder ? "text-red-600" : ""
        } `}
      >
        {win ? "Ganaste !" : perder ? "Perdiste!" : ""}
      </div>
      <div className="mt-5">
        <button
          className={` p-2 rounded-xl text-white font-semibold   ${
            win ? "bg-green-800" : "bg-red-700"
          }`}
          onClick={() => handleReset()}
        >
          {win ? "JUGAR DE NUEVO" : perder ? "JUGAR DE NUEVO" : "RESETEAR"}
        </button>
      </div>
    </div>
  );
};

export default GameMemory;

const frutasConEmojis = [
  "🍎",
  "🍏",
  "🍌",
  "🍐",
  "🍊",
  "🍋",
  "🍉",
  "🍇",
  "🍓",
  "🍈",
  "🍒",
  "🥭",
  "🍍",
  "🥝",
  "🥥",
  "🫐",
  "🍅",
  "🍆",
  "🌰",
  "🫒",
  "🥒",
  "🥬",
  "🥭",
  "🌺",
  "🌼",
  "🌸",
  "🌳",
  "🌿",
  "🌾",
  "💮",
  "🌙",
  "🌝",
  "🌞",
  "🌈",
  "💐",
  "🌼",
  "⭐",
  "🍑",
  "🍑",
  "🍑",
  "🍊",
  "🍊",
  "🍋",
  "👹",
  "🫐",
  "🫐",
  "🔮",
  "😝",
  "🥠",
  "👑",
  "🍼",
  "🧡",
  "💗",
  "🍈",
  "🍈",
  "🍈",
  "🧊",
  "🍎",
  "🍎",
  "🍏",
  "🍌",
  "🍌",
  "🟠",
  "💚",
  "🧟‍♂️",
  "🖤",
  "🤍",
  "💓",
  "💛",
  "💚",
  "🍇",
  "🌼",
  "👾",
  "🥝",
  "🟢",
  "🟣",
  "🕷️",
  "🔵",
  "💜",
  "🧡",
  "❤️",
  "🍈",
  "🤢",
  "🐍",
  "⚠️",
  "🥒",
  "🎃",
  "🌵",
  "🍂",
  "🟤",
  "⚫",
  "🪵",
  "🔴",
  "🫐",
  "✨",
  "🟠",
  "🧊",
  "🌀",
  "🍈",
  "🍒",
];
