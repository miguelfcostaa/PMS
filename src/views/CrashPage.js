import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import rocketIcon from "../assets/rocket.png";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // URL do servidor backend



// Função multiplicadora M(t) = 2^(t/10):
function M(t) {
  return Math.pow(2, t / 10);
}

const CrashPage = () => {
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState("");
  const [betAmount, setBetAmount] = useState("");
  const [autoCashout, setAutoCashout] = useState("");
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [history, setHistory] = useState(
    JSON.parse(sessionStorage.getItem("crashHistory")) || []
  );
  const [cashoutPressed, setCashoutPressed] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]); // Estado para a leaderboard


  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const pointsRef = useRef([]);
  const gameRunningRef = useRef(false);
  const startTimeRef = useRef(null);
  const crashMultiplierRef = useRef(null);
  const autoCashoutValRef = useRef(null);

  const rocketImg = useRef(new Image());
  useEffect(() => {
    rocketImg.current.src = rocketIcon;
  }, []);

  const lastIntegerRef = useRef(1);
  const gameEndedRef = useRef(false);
  const endedAt100Ref = useRef(false);

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

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [userId, token]);


  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/leaderboard/crash", 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLeaderboard(response.data || []);
    } catch (error) {
      console.error("Erro ao buscar leaderboard:", error);
    }
  };


  useEffect(() => {
    fetchLeaderboard();
  }, [token]);


  useEffect(() => {
    // Escuta o evento "leaderboardUpdated" do servidor
    socket.on("leaderboardUpdated", () => {
        console.log("Leaderboard updated, fetching latest data...");
        fetchLeaderboard(); // Atualiza a leaderboard
    });

    // Remove o listener ao desmontar o componente
    return () => {
        socket.off("leaderboardUpdated");
    };
}, []);



  const getSelectedCoinAmount = () => {
    const coin = coins.find((c) => c.coinName === selectedCoin);
    return coin ? coin.amount : 0;
  };

  const startGame = async () => {
    if (!selectedCoin || !betAmount) {
      alert("Escolha uma moeda e insira o valor da aposta!");
      return;
    }

    const betVal = parseFloat(betAmount);
    if (isNaN(betVal) || betVal <= 0) {
      alert("Valor de aposta inválido!");
      return;
    }

    if (betVal > getSelectedCoinAmount()) {
      alert("Saldo insuficiente!");
      return;
    }

    // Reiniciar estado
    gameEndedRef.current = false;
    endedAt100Ref.current = false;
    lastIntegerRef.current = 1;

    const updatedCoins = coins.map((coin) => {
      if (coin.coinName === selectedCoin) {
        return { ...coin, amount: coin.amount - betVal };
      }
      return coin;
    });

    setCoins(updatedCoins);

    try {
      await axios.put(
        `http://localhost:5000/api/auth/${userId}/coins`,
        {
          coinName: selectedCoin,
          amount: -betVal,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error("Erro ao atualizar moedas na base de dados:", error);
      return;
    }

    // Determinar ponto de crash aleatório entre 1.00 e 100.00
    crashMultiplierRef.current = parseFloat((1 + Math.random() * 99).toFixed(2));

    // Processar autoCashout
    if (autoCashout.trim() !== "") {
      const acValue = parseFloat(autoCashout);
      if (!isNaN(acValue) && acValue > 0) {
        autoCashoutValRef.current = acValue;
      } else {
        autoCashoutValRef.current = null;
      }
    } else {
      autoCashoutValRef.current = null;
    }

    setIsPlaying(true);
    setCurrentMultiplier(1.0);
    setCashoutPressed(false);

    pointsRef.current = [];
    gameRunningRef.current = true;
    startTimeRef.current = performance.now();

    animate();
  };

  const endRound = (finalMultiplier) => {
    gameRunningRef.current = false;
    setIsPlaying(false);
    gameEndedRef.current = true;

    const win = endedAt100Ref.current || cashoutPressed;

    const updatedHistory = [
      { multiplier: finalMultiplier.toFixed(2), win: win },
      ...history,
    ];
    setHistory(updatedHistory);
    sessionStorage.setItem("crashHistory", JSON.stringify(updatedHistory));
  };

  const handleCashout = async () => {
    if (!isPlaying || cashoutPressed) return;

    // Definimos cashoutPressed = true imediatamente para atualizar a UI
    setCashoutPressed(true);

    const winnings = parseFloat(betAmount) * currentMultiplier;
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

    // Agora o estado já foi alterado, as moedas atualizadas, e a UI deve refletir o cashout
  };

  const animate = () => {
    if (!gameRunningRef.current) return;

    const now = performance.now();
    const elapsedSec = (now - startTimeRef.current) / 1000;
    const m = M(elapsedSec);
    const displayM = parseFloat(m.toFixed(2));
    setCurrentMultiplier(displayM);

    pointsRef.current.push({ t: elapsedSec, m });

    // Auto cashout automático
    if (!cashoutPressed && autoCashoutValRef.current !== null && displayM >= autoCashoutValRef.current) {
      // Chama exatamente o mesmo handleCashout do click manual
      handleCashout();
      // Não retornamos e nem chamamos outro requestFrame aqui, apenas deixamos o jogo continuar
    }

    // Se atingir 100.00
    if (m >= 100) {
      if (!cashoutPressed) {
        handleCashout();
      }
      endedAt100Ref.current = true;
      endRound(displayM);
      return;
    }

    // Se crashar
    if (m >= crashMultiplierRef.current) {
      endRound(displayM);
      return;
    }

    drawCanvas(displayM, elapsedSec);
    requestRef.current = requestAnimationFrame(animate);
  };

  const drawCanvas = (displayM, elapsedSec) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const cw = canvas.width;
    const ch = canvas.height;
    ctx.clearRect(0, 0, cw, ch);

    const pts = pointsRef.current;
    const lastPoint = pts[pts.length - 1];
    const t = lastPoint.t;
    const m = lastPoint.m;

    const scaleX = cw / (t + 10);
    const scaleY = ch / ((m - 1) + 10);
    const scale = Math.min(scaleX, scaleY);

    ctx.save();
    ctx.translate(0, ch);
    ctx.scale(1, -1);
    ctx.scale(scale, scale);

    // Área colorida
    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (let i = 0; i < pts.length; i++) {
      ctx.lineTo(pts[i].t, pts[i].m - 1);
    }
    ctx.lineTo(t, 0);
    ctx.closePath();

    const fillGradient = ctx.createLinearGradient(0, 0, 0, 10);
    fillGradient.addColorStop(0, "#ff8800");
    fillGradient.addColorStop(1, "#ff4400");
    ctx.fillStyle = fillGradient;
    ctx.fill();

    // Linha
    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (let i = 0; i < pts.length; i++) {
      ctx.lineTo(pts[i].t, pts[i].m - 1);
    }
    ctx.lineWidth = 10 / scale;
    ctx.strokeStyle = "#fff";
    ctx.stroke();

    // Foguete rotacionado 90 graus adicionais
    const rocketSize = 100 / scale;
    const rocketX = t;
    const rocketY = m - 1;

    ctx.save();
    ctx.translate(rocketX, rocketY);
    ctx.rotate(Math.PI / 2); 
    if (
      rocketImg.current && 
      rocketImg.current.complete && 
      rocketImg.current.naturalWidth > 0
    ) {
      ctx.drawImage(
        rocketImg.current,
        -rocketSize / 2,
        -rocketSize / 2,
        rocketSize,
        rocketSize
      );
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, rocketSize/2, 0, 2*Math.PI);
      ctx.fillStyle = "#ff0000";
      ctx.fill();
    }
    ctx.restore();

    ctx.restore();

    // Determinar cor final
    const finalM = crashMultiplierRef.current;
    let finalColor = "red";
    if (finalM === 100.0) {
      finalColor = "gold";
    }

    // Tempo final da ronda
    const t_end = 10 * Math.log2(finalM);
    // Se estivermos a menos de 0.01s do fim, mostrar cor final
    let textColor = "#fff";
    if (gameEndedRef.current) {
      textColor = endedAt100Ref.current ? "gold" : "red";
    } else {
      if ((t_end - elapsedSec) <= 0.01) {
        textColor = finalColor;
      }
    }

    // Pulse ao mudar de inteiro
    let fontSize = 60; 
    const currentInt = Math.floor(displayM);
    if (currentInt > lastIntegerRef.current) {
      fontSize = 80; 
      lastIntegerRef.current = currentInt;
    }

    // Multiplicador no centro
    ctx.save();
    ctx.fillStyle = textColor;
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(displayM.toFixed(2) + "x", cw/2, ch/2);
    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    }
  }, []);

  let buttonColor = "#238636";
  let buttonText = "Bet (Next Round)";
  let buttonAction = !isPlaying ? startGame : null;
  
  if (isPlaying) {
    if (cashoutPressed) {
      buttonColor = "#238636";
      buttonText = "Waiting for round to end";
      buttonAction = null;
    } else {
      buttonColor = "#da3633";
      buttonText = "Cash Out";
      buttonAction = handleCashout;
    }
  }

  const styles = {
    container: {
      position: "absolute",
      top: "11vh",
      left: "14%",
      width: "86%",
      height: "89vh",
      display: "flex",
      flexDirection: "row",
      backgroundColor: "#010017",
      color: "#fff",
    },
    controlsContainer: {
      width: "15%",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#161b22",
      padding: "2.5vh",
      boxShadow: "2px 0 5px rgba(0, 0, 0, 0.5)",
      marginLeft: "2.2vh",
      marginBottom: "2vh",
      marginTop: "2vh",
      borderRadius: "1vh",
    },
    leaderboardContainer: {
      marginTop: "2vh",
      padding: "1vh",
      backgroundColor: "#0d1117",
      border: "1px solid #30363d",
      borderRadius: "0.5vh",
    },
    leaderboardItem: {
      display: "flex",
      justifyContent: "space-between",
      padding: "0.5vh 0",
      borderBottom: "1px solid #30363d",
    },
    leaderboardTitle: {
      fontSize: "1.2em",
      fontWeight: "bold",
      marginBottom: "1vh",
    },
    input: {
      margin: "1vh 0",
      padding: "1vh",
      backgroundColor: "#0d1117",
      border: "1px solid #30363d",
      borderRadius: "0.5vh",
      color: "#fff",
    },
    button: {
      padding: "1vh",
      backgroundColor: buttonColor,
      border: "none",
      borderRadius: "0.5vh",
      cursor: buttonAction ? "pointer" : "default",
      color: "#fff",
      fontWeight: "bold",
    },
    rightColumn: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      marginLeft: "2vh",
      marginRight: "2vh",
    },
    historyContainer: {
      flex: 0,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      padding: "2vh",
      overflowX: "auto",
      whiteSpace: "nowrap",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
      marginBottom: "2vh",
      marginTop: "2vh",
    },
    historyItem: {
      display: "inline-block",
      padding: "0.5vh 1.5vh",
      margin: "0 0.7vh",
      borderRadius: "0.3vh",
      color: "#fff",
      fontWeight: "bold",
    },
    chartContainer: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#000",
      borderRadius: "1vh",
      padding: "1vh",
      width: "99%",
      height: "80%",
      marginRight: "2vh",
      marginBottom: "2vh",
      overflow: "hidden",
      position: "relative",
    },
    canvas: {
      width: "100%",
      height: "100%",
    }
  };

  return (
    <div style={styles.container}>
      <NavBar />
      <SideBar />
      <div style={styles.controlsContainer}>
        <select
          value={selectedCoin}
          onChange={(e) => setSelectedCoin(e.target.value)}
          style={styles.input}
        >
          <option value="">Choose a coin</option>
          {coins.map((coin) => (
            <option key={coin.coinName} value={coin.coinName}>
              {coin.coinName} (Saldo: {coin.amount})
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Bet Value"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Auto Cashout (Ex: 2 ou 2.00)"
          value={autoCashout}
          onChange={(e) => setAutoCashout(e.target.value)}
          style={styles.input}
        />
        <button
          onClick={buttonAction}
          style={styles.button}
        >
          {buttonText}
        </button>
        <div style={styles.leaderboardContainer}>
          <div style={styles.leaderboardTitle}>Leaderboard</div>
          {leaderboard.map((user, index) => (
            <div key={index} style={styles.leaderboardItem}>
              <span>{index + 1}</span>
              <span>{user.name}</span>
              <span>{user.coinsWon} coins</span>
            </div>
          ))}
        </div>
      </div>
      <div style={styles.rightColumn}>
        <div style={styles.historyContainer}>
          {history.map((item, index) => (
            <div
              key={index}
              style={{
                ...styles.historyItem,
                backgroundColor:
                  parseFloat(item.multiplier) < 2
                    ? "red"
                    : parseFloat(item.multiplier) < 10
                    ? "orange"
                    : "gold",
              }}
            >
              {item.multiplier}x
            </div>
          ))}
        </div>
        <div style={styles.chartContainer}>
          <canvas ref={canvasRef} style={styles.canvas}></canvas>
        </div>
      </div>
    </div>
  );
};

export default CrashPage;
