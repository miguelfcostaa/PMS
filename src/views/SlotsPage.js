import React, { useState, useEffect}  from 'react';
import NavBar from '../components/NavBar';
import axios from "axios";
import SideBar from '../components/SideBar';
import background from "../assets/slotreel.webp";

const icon_width = 79;
const icon_height = 79;
const num_icons= 9;
const num_reels = 3;
const slot = [0,0,0];
const iconMap = [ "cherry", "plum", "orange", "bell", "bar", "lemon", "melon","banana", "seven",]
const time_per_icon = 100
let multiplier = 0;

    const roll = (faixa, offset) => {
        const delta = (offset + 2) * num_icons + Math.round(Math.random() * num_icons);

        return new Promise((resolve,reject) => {
            const backgroundPositionY = styles.faixa.backgroundPositionY,
            targetPosY = backgroundPositionY + delta * icon_height,
            normTargetPosY = targetPosY % (num_icons * icon_height);

            setTimeout(() => {
                faixa.style.transition = 'background-position-y ' + (8 + 1 * delta) * time_per_icon + 'ms cubic-bezier(.41,-0.01,.63,1.09)';
                faixa.style.backgroundPositionY = backgroundPositionY + delta * icon_height + 'px';
            }, offset * 150);
            
            setTimeout(() => {
                faixa.style.transition = 'none';
                faixa.style.backgroundPositionY = normTargetPosY + 'px';
                resolve(delta % num_icons);
            }, (8 + 1 * delta) * time_per_icon + offset * 150); 
        })
    }

function SlotsPage() {
    const [coins, setCoins] = useState([]);
    const [selectedCoin, setSelectedCoin] = useState("");
    const [betAmount, setBetAmount] = useState("");
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const [sendoUsado, setSendoUsado] = useState(false)

    const getSelectedCoinAmount = () => {
        const coin = coins.find((c) => c.coinName === selectedCoin);
        return coin ? coin.amount : 0;
    };
    
    useEffect(() => {
        if (userId) {
            fetchCoins(userId);
        } else {
            console.error('User ID not found in localStorage');
        }
    }, [userId]);

    // Função para buscar as moedas do utilizador
    const fetchCoins = async (storedUserId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/auth/${storedUserId}`);
            setCoins(response.data.coins || []);
        } catch (error) {
            console.error('Error fetching user coins:', error);
        }
    };


    useEffect(() => {
        console.log("sendoUsado atualizado: ", sendoUsado);
    }, [sendoUsado]);

    async function rollAll() {
        if (!selectedCoin || !betAmount) {
            alert("Escolha uma moeda e insira o valor da aposta!");
            return;
          }
          if (betAmount > getSelectedCoinAmount()) {
            alert("Saldo insuficiente!");
            return;
          }
          
          
         setSendoUsado(true);

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

        multiplier = 0;
        const faixaList = document.querySelectorAll('.slot > .faixa');
        
        console.log(sendoUsado)

        Promise.all( [...faixaList].map((faixa, i) => roll(faixa, i)))	
            .then((deltas) => {
                deltas.forEach((delta, i) => slot[i] = (delta + 7) % num_icons);
                console.log(deltas)
                let textContent = slot.map((i) => iconMap[i]).join(' - ');
                console.log(textContent + '\n' + slot);
                if (slot[0] === slot[1]) {
                    multiplier = multiplier + 1 + ((slot[0] + slot[1]) * 0.6)
                    console.log(multiplier);
                    if (slot[1] === slot[2]){
                        multiplier = multiplier + 1 + ((slot[1] + slot[2]) * 0.6)
                        console.log(multiplier);
                    }
                }

                if(multiplier !== 0){
                    const winnings = betAmount * multiplier;
                    const updatedCoins = coins.map((coin) => {
                    if (coin.coinName === selectedCoin) { 
                        alert('Ganhou ' + winnings + ' ' + coin.coinName);
                        return { ...coin, amount: coin.amount + parseFloat(winnings) };
                    }
                    return coin;
                    });
                
                    setCoins(updatedCoins);
                
                    axios.put(
                        `http://localhost:5000/api/auth/${userId}/coins`,
                        {coinName: selectedCoin,amount: parseFloat(winnings),},
                        {headers: { Authorization: `Bearer ${token}` },}
                    );
                }
                setSendoUsado(false);
            })
            .catch(() => {
                setSendoUsado(false);
            });
    }

    return (
        <>                    
        <NavBar  />       
        <div style={styles.mainContent}>
            <div class='slot' style={styles.slot}>
                <div class='faixa' style={styles.faixa}></div>    
                <div class='faixa' style={styles.faixa}></div>       
                <div class='faixa' style={styles.faixa}></div>       
            </div>
            
            <h1 style={styles.header}><b>Slots do Coelho</b></h1>

            <div style={styles.controlsContainer}>

                <select 
                    value={selectedCoin}
                    onChange={(e) => setSelectedCoin(e.target.value)}
                    style={styles.input}>

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
            </div>

            <button 
                style={sendoUsado ? styles.buttonUsado : styles.button} 
                onClick={sendoUsado ? null : rollAll}
                disabled={sendoUsado}> 
                Roll All 
            </button>


        </div>


        <SideBar  />
        </>
    );
}

const styles = {
    header:{
        position:'absolute',
        top: '14vh',
        color:'lightgray',
        fontSize:'6vh',
        textShadow: '0.5vh 0.5vh 1vh rgba(0, 0, 0, 1)',
    },
    input:{
        border: '0.5vh solid black',
        borderRadius: '1vh',
        width: '10vw',
        alignItems:'left',
        color:'lightgray',
        backgroundImage: 'linear-gradient(to right, #262626, #474747, #262626)',
        fontWeight:'10vh',
        height: '5vh',
        fontSize:'2vh'
    },

    controlsContainer:{
        top:'80vh',
        position:'absolute',
        display: "flex",
        gap:'30vw',
        position:'absolute'
    },

    button:{
        top: '78vh',
        position:'absolute',
        padding: '10px 20px',
        width: "25vw",
        height: "10vh",
        border: 'none',
        background: '#425576',
        cursor: 'pointer',
        fontSize: '4vh',
        borderRadius: "20vh",
        color:"#C7D5E5",
        boxShadow: '0.5vh 0.5vh 1vh rgba(0, 0, 0, 0.2)',
    },

    buttonUsado:{
        top: '78vh',
        position:'absolute',
        padding: '1vh 2vw',
        width: "25vw",
        height: "10vh",
        border: 'none',
        background: ' rgba(0, 0, 0, 0.25)',
        cursor: 'pointer',
        fontSize: '4vh',
        borderRadius: "20vh",
        color:"#C7D5E5",
        boxShadow: '0.5vh 0.5vh 1vh rgba(0, 0, 0, 0.2)',
    },

    slot:{
        position: 'relative',
        width: (num_reels) * 0.2 * icon_width + 'vh',
        height: 0.4 * icon_height + 'vh',
        display: 'flex',
        top:'10vh',
        justifyContent: 'space-between',
        padding: 0.15 * icon_width + 'vh',
        border: '2vh solid black',
        borderRadius: '5vh',
        backgroundImage: 'linear-gradient(to right, #474747, gray, #474747)',
        borderRadius: '1vh',
    },

    faixa: {
		position: 'relative',
		width: icon_width,
		height: 3 * icon_height,
		border: '1px solid rgba(black, 0.3)',
		borderRadius: '10px',
		overflow: 'hidden',
		backgroundImage: 'url(' + background + ')',
		backgroundPositionY: '0',
		backgroundRepeat: 'repeat-y'
    },
    
    mainContent: {
        marginTop: '5vh',
        marginLeft: '14.75vw',
        paddingLeft: '0px',
        font: 'Inter',
        display: 'flex',
	    justifyContent: 'center',
	    alignItems: 'center',
    }


};

export default SlotsPage;