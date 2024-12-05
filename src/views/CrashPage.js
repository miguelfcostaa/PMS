import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";

const CrashPage = () => {
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState("");
  const [betAmount, setBetAmount] = useState("");
  const [autoCashout, setAutoCashout] = useState("");
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [cashoutPressed, setCashoutPressed] = useState(false);
  const userId = localStorage.getItem("userId"); // Obtendo o ID do usuário do localStorage
  const token = localStorage.getItem("token"); // Obtendo o token de autenticação

  // Buscar moedas do usuário
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/auth/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCoins(response.data.coins || []);
      } catch (error) {
        console.error("Erro ao buscar moedas do usuário:", error);
      }
    };

    fetchCoins();
  }, [userId, token]);

  // Início do jogo
  const startGame = async () => {
    if (!selectedCoin || !betAmount) {
      alert("Escolha uma moeda e insira o valor da aposta!");
      return;
    }
    if (betAmount > getSelectedCoinAmount()) {
      alert("Saldo insuficiente!");
      return;
    }

    // Deduz a aposta das moedas do usuário
    const updatedCoins = coins.map((coin) => {
      if (coin.coinName === selectedCoin) {
        return { ...coin, amount: coin.amount - parseFloat(betAmount) };
      }
      return coin;
    });

    setCoins(updatedCoins);

    try {
      await axios.put(
        `http://localhost:5000/api/auth/${userId}/coins`,
        {
          coins: [{ coinName: selectedCoin, amount: -parseFloat(betAmount) }],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error("Erro ao atualizar moedas na base de dados:", error);
      return;
    }

    setIsPlaying(true);
    setCurrentMultiplier(1.0);
    setCashoutPressed(false);
    simulateGame();
  };

  // Simula o multiplicador em tempo real
  const simulateGame = () => {
    const interval = setInterval(() => {
      setCurrentMultiplier((prevMultiplier) => {
        const newMultiplier = (prevMultiplier + Math.random() * 0.1).toFixed(2);
        if (Math.random() < 0.01) {
          endGame(newMultiplier); // Simula um crash com 1% de chance
          clearInterval(interval);
        }
        return parseFloat(newMultiplier);
      });
    }, 100);

    if (autoCashout) {
      const autoCashoutTimeout = setTimeout(() => {
        if (!cashoutPressed) {
          handleCashout();
        }
      }, parseFloat(autoCashout) * 1000);
      return () => clearTimeout(autoCashoutTimeout);
    }
  };

  // Obtém o saldo da moeda selecionada
  const getSelectedCoinAmount = () => {
    const coin = coins.find((c) => c.coinName === selectedCoin);
    return coin ? coin.amount : 0;
  };

  // Finaliza o jogo após crash
  const endGame = (finalMultiplier) => {
    setIsPlaying(false);
    setHistory((prevHistory) => [
      ...prevHistory,
      { multiplier: finalMultiplier, win: false },
    ]);
    setGameResult("Perdeu! O multiplicador foi " + finalMultiplier);
  };

  // Lógica do botão de cashout
  const handleCashout = async () => {
    if (!isPlaying || cashoutPressed) return;

    const winnings = betAmount * currentMultiplier;
    const updatedCoins = coins.map((coin) => {
      if (coin.coinName === selectedCoin) {
        return { ...coin, amount: coin.amount + parseFloat(winnings) };
      }
      return coin;
    });

    setCoins(updatedCoins);

    try {
      await axios.put(
        `http://localhost:5000/api/auth/${userId}/coins`,
        {
          coinName: selectedCoin,
          amount: parseFloat(winnings),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error("Erro ao atualizar moedas na base de dados:", error);
      return;
    }

    setIsPlaying(false);
    setCashoutPressed(true);
    setHistory((prevHistory) => [
      ...prevHistory,
      { multiplier: currentMultiplier, win: true },
    ]);
    setGameResult("Ganhou! Multiplicador: " + currentMultiplier);
  };

  // Estilos inline
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      backgroundColor: "#0d1117",
      color: "#c9d1d9",
    },
    mainContent: {
      display: "flex",
      flex: 1,
    },
    gameContent: {
      flex: 1,
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    controls: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginBottom: "20px",
    },
    input: {
      margin: "10px",
      padding: "10px",
      fontSize: "16px",
      borderRadius: "5px",
      border: "1px solid #c9d1d9",
      backgroundColor: "#161b22",
      color: "#c9d1d9",
    },
    button: {
      margin: "10px",
      padding: "10px 20px",
      fontSize: "16px",
      borderRadius: "5px",
      border: "none",
      cursor: "pointer",
      backgroundColor: "#238636",
      color: "#fff",
    },
    gameInfo: {
      marginTop: "20px",
    },
    history: {
      marginTop: "20px",
      textAlign: "left",
      backgroundColor: "#161b22",
      padding: "10px",
      borderRadius: "5px",
      width: "80%",
    },
    historyItem: {
      marginBottom: "5px",
    },
  };

  return (
    <div style={styles.container}>
      <NavBar />
      <div style={styles.mainContent}>
        <SideBar />
        <div style={{ ...styles.gameContent, marginLeft: '15%' }}>
          <h1>Jogo Crash</h1>
          <div style={styles.controls}>
            <select
              value={selectedCoin}
              onChange={(e) => setSelectedCoin(e.target.value)}
              style={styles.input}
            >
              <option value="">Escolha uma moeda</option>
              {coins.map((coin) => (
                <option key={coin.coinName} value={coin.coinName}>
                  {coin.coinName} (Saldo: {coin.amount})
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Valor da aposta"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              style={styles.input}
            />
            <input
              type="number"
              placeholder="Auto Cashout (opcional)"
              value={autoCashout}
              onChange={(e) => setAutoCashout(e.target.value)}
              style={styles.input}
            />
            <button
              onClick={startGame}
              disabled={isPlaying}
              style={styles.button}
            >
              Apostar
            </button>
            <button
              onClick={handleCashout}
              disabled={!isPlaying || cashoutPressed}
              style={{ ...styles.button, backgroundColor: "#da3633" }}
            >
              Cashout
            </button>
          </div>
          <div style={styles.gameInfo}>
            <p>Multiplicador Atual: {currentMultiplier}x</p>
            <p>{gameResult}</p>
          </div>
          <div style={styles.history}>
            <h2>Histórico</h2>
            <ul>
              {history.map((item, index) => (
                <li key={index} style={styles.historyItem}>
                  Multiplicador: {item.multiplier},{" "}
                  {item.win ? "Ganhou!" : "Perdeu!"}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrashPage;
