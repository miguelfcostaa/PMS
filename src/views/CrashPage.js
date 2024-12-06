import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import rocketImage from "../assets/rocket.png";

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
          coinName: selectedCoin,
          amount: -parseFloat(betAmount), // Atualizando apenas uma moeda
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
    setHistory((prevHistory) => [...prevHistory, finalMultiplier]);
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
    setHistory((prevHistory) => [...prevHistory, currentMultiplier]);
    setGameResult("Ganhou! Multiplicador: " + currentMultiplier);
  };

  // Estilos inline
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      backgroundColor: "#010017",
      color: "#c9d1d9",
    },
    mainContent: {
      display: "flex",
      flex: 1,
    },
    leftContainer: {
      width: "25%",
      backgroundColor: "#0d1117",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    buttonToggle: {
      padding: "10px 20px",
      fontSize: "16px",
      marginBottom: "10px",
      cursor: "pointer",
      borderRadius: "5px",
      border: "none",
      backgroundColor: "#238636",
      color: "#fff",
    },
    input: {
      margin: "10px",
      padding: "10px",
      fontSize: "16px",
      borderRadius: "5px",
      border: "1px solid #c9d1d9",
      backgroundColor: "#161b22",
      color: "#c9d1d9",
      width: "100%",
    },
    betButton: {
      padding: "10px 20px",
      fontSize: "16px",
      borderRadius: "5px",
      border: "none",
      cursor: "pointer",
      backgroundColor: isPlaying ? "#da3633" : "#238636",
      color: "#fff",
    },
    historyContainer: {
      display: "flex",
      flexDirection: "row",
      overflowX: "scroll",
      width: "75%",
      backgroundColor: "#0d1117",
      padding: "10px",
      borderBottom: "1px solid #ffffff",
    },
    historyItem: {
      padding: "5px 10px",
      borderRadius: "5px",
      margin: "5px",
      color: "#fff",
    },
    gameContainer: {
      flex: 1,
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    },
    multiplierText: {
      fontSize: "48px",
      color: "#fff",
      marginBottom: "20px",
    },
    rocketImage: {
      position: "absolute",
      bottom: "10%",
      transform: `translateY(-${currentMultiplier * 10}px)`,
    },
  };

  return (
    <div style={styles.container}>
      <NavBar />
      <div style={styles.mainContent}>
        <div style={styles.leftContainer}>
          <button style={styles.buttonToggle}>Manual</button>
          <button style={styles.buttonToggle}>Auto</button>
          <select
            value={selectedCoin}
            onChange={(e) => setSelectedCoin(e.target.value)}
            style={styles.input}
          >
            <option value="">Choose a coin</option>
            {coins.map((coin) => (
              <option key={coin.coinName} value={coin.coinName}>
                {coin.coinName} (Balance: {coin.amount})
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Bet value"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Auto Cashout (optional)"
            value={autoCashout}
            onChange={(e) => setAutoCashout(e.target.value)}
            style={styles.input}
          />
          <button
            onClick={isPlaying ? handleCashout : startGame}
            style={styles.betButton}
          >
            {isPlaying ? "Cash Out" : "Bet (Next Round)"}
          </button>
          <h2>Leaderboard</h2>
          <div>{/* Placeholder for future leaderboard implementation */}</div>
        </div>

        <div style={styles.historyContainer}>
          {history.map((multiplier, index) => {
            const color = multiplier < 2 ? "#ff0000" : multiplier < 50 ? "#ffcc00" : "#ffd700";
            return (
              <div
                key={index}
                style={{ ...styles.historyItem, backgroundColor: color }}
              >
                {multiplier}x
              </div>
            );
          })}
        </div>

        <div style={styles.gameContainer}>
          <p style={styles.multiplierText}>{currentMultiplier}x</p>
          <img src={rocketImage} alt="Rocket" style={styles.rocketImage} />
        </div>
      </div>
    </div>
  );
};

export default CrashPage;
