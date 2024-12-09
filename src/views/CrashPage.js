import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";

// Register required components and scales
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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
  const [chartData, setChartData] = useState({ labels: ["0s"], data: [1.0] });
  const [backgroundPoints, setBackgroundPoints] = useState([]);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

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

  const startGame = async () => {
    if (!selectedCoin || !betAmount) {
      alert("Escolha uma moeda e insira o valor da aposta!");
      return;
    }
    if (betAmount > getSelectedCoinAmount()) {
      alert("Saldo insuficiente!");
      return;
    }

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
          amount: -parseFloat(betAmount),
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
    setChartData({ labels: ["0s"], data: [1.0] });
    setBackgroundPoints([{ time: 0, multiplier: 1.0 }]);
    simulateGame();
  };

  const simulateGame = () => {
    let time = 0;
    const interval = setInterval(() => {
      time += 0.1;
      setCurrentMultiplier((prevMultiplier) => {
        // Growth pattern: starts slow and accelerates
        const newMultiplier = Math.min(1 + Math.pow(time / 10, 2), 100).toFixed(2);

        setBackgroundPoints((prevPoints) => {
          const newPoints = [...prevPoints, { time, multiplier: parseFloat(newMultiplier) }];
          // Update visible chart with smoothed data
          const visibleLabels = newPoints.map((point) => `${point.time.toFixed(1)}s`);
          const visibleData = newPoints.map((point) => point.multiplier);
          setChartData({ labels: visibleLabels, data: visibleData });
          return newPoints;
        });

        if (Math.random() < 0.01 || newMultiplier >= 100) {
          endGame(newMultiplier);
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

  const endGame = (finalMultiplier) => {
    setIsPlaying(false);
    setHistory((prevHistory) => {
      const updatedHistory = [
        ...prevHistory,
        { multiplier: finalMultiplier, win: false },
      ];
      sessionStorage.setItem("crashHistory", JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  };

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
    setHistory((prevHistory) => {
      const updatedHistory = [
        ...prevHistory,
        { multiplier: currentMultiplier, win: true },
      ];
      sessionStorage.setItem("crashHistory", JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  };

  const getSelectedCoinAmount = () => {
    const coin = coins.find((c) => c.coinName === selectedCoin);
    return coin ? coin.amount : 0;
  };

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
      backgroundColor: "#238636",
      border: "none",
      borderRadius: "0.5vh",
      cursor: "pointer",
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
      backgroundColor: "#1c1c1e",
      borderRadius: "1vh",
      padding: "1vh",
      width: "99%",
      height: "80%",
      marginRight: "2vh",
      marginBottom: "2vh",
    },
    chart: {
      width: "100%",
      height: "100%",
    },
  };

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Multiplier",
        data: chartData.data,
        borderColor: "#ffffff",
        borderWidth: 2,
        pointBackgroundColor: "red",
        pointRadius: 0, // Set point radius to 0 for smooth line
        tension: 0.4, // Add smoothing to the line
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Time (s)",
          color: "#fff",
        },
        ticks: {
          callback: function (value, index) {
            if (index % 30 === 0) {
              return `${value / 10}s`;
            }
            return null;
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Multiplier",
          color: "#fff",
        },
        ticks: {
          stepSize: 0.5, // Adjust y-axis scale step size
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
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
          type="number"
          placeholder="Auto Cashout"
          value={autoCashout}
          onChange={(e) => setAutoCashout(e.target.value)}
          style={styles.input}
        />
        <button
          onClick={startGame}
          style={{
            ...styles.button,
            backgroundColor: isPlaying ? "#da3633" : "#238636",
          }}
        >
          {isPlaying ? "Cash Out" : "Bet (Next Round)"}
        </button>
      </div>
      <div style={styles.rightColumn}>
        <div style={styles.historyContainer}>
          {history.map((item, index) => (
            <div
              key={index}
              style={{
                ...styles.historyItem,
                backgroundColor:
                  item.multiplier < 2
                    ? "red"
                    : item.multiplier < 10
                    ? "orange"
                    : "gold",
              }}
            >
              {item.multiplier}x
            </div>
          ))}
        </div>
        <div style={styles.chartContainer}>
          <Line data={data} options={options} style={styles.chart} />
        </div>
      </div>
    </div>
  );
};

export default CrashPage;
