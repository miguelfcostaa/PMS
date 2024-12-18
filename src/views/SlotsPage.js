import React, { useState, useEffect}  from 'react';
import NavBar from '../components/NavBar';
import axios from "axios";
import SideBar from '../components/SideBar';
import background from "../assets/slotreel.jpg";
import Dropdown from '@mui/joy/Dropdown';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';

const icon_width = 132;
const icon_height = 131;
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
    const [selectedCoin, setSelectedCoin] = useState(null);
    const [betAmount, setBetAmount] = useState("");
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const [sendoUsado, setSendoUsado] = useState(false)

    const getSelectedCoinAmount = () => {
        const coin = coins.find((c) => c.coinName === selectedCoin.coinName);
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
            if (coin.coinName === selectedCoin.coinName) {
            const updatedCoin = { ...coin, amount: coin.amount - parseFloat(betAmount) };
            setSelectedCoin(updatedCoin);
            return updatedCoin;
            }
            return coin;
        });
        setCoins(updatedCoins);
      
        try {
            await axios.put(
              `http://localhost:5000/api/auth/${userId}/coins`,
              {
                coinName: selectedCoin.coinName,
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
                    if (coin.coinName === selectedCoin.coinName) { 
                        alert('You won ' + winnings + ' coins! Congratulations!');
                        return { ...coin, amount: coin.amount + parseFloat(winnings) };
                    }
                    return coin;
                    });
                
                    setCoins(updatedCoins);
                
                    try {
                        axios.put(
                            `http://localhost:5000/api/auth/${userId}/coins`,
                            {coinName: selectedCoin.coinName,amount: parseFloat(winnings),},
                            {headers: { Authorization: `Bearer ${token}` },}
                        );
                    } catch (error) {
                        console.error("Erro ao atualizar moedas na base de dados:", error);
                    }
                }
                else {
                    alert('You lost! Try again!');
                }
    
                setSendoUsado(false);
            })
            .catch(() => {
                setSendoUsado(false);
            });
    }

    const handleDisplayedAmount = (amount) => {
        if (amount >= 1000000) {
            return `${(amount / 1000000).toFixed(1)}M`;
        } else if (amount >= 1000) {
            return `${(amount / 1000).toFixed(1)}K`;
        } else {
            return amount.toFixed(1);
        }
    };


    return (
        <>                    
        <NavBar  />       
        <div style={styles.mainContent}>

            <div style={styles.container}>
                <h1 style={styles.header}><b> SLOTS </b></h1>
                <div class='slot' style={styles.slot}>
                    <div class='faixa' style={styles.faixa}></div>    
                    <div class='faixa' style={styles.faixa}></div>       
                    <div class='faixa' style={styles.faixa}></div>       
                </div>
            </div>

            <div style={styles.controlsContainer}>
                <Dropdown>
                    <MenuButton variant="solid" color="#FFFFFF" style={{ padding: 0 }}>
                        <div style={styles.coinsContainerDropdown}>
                            {selectedCoin ? (
                                <>
                                    <span style={{...styles.coinAmount, width: '10vh', textAlign: 'start'}}>
                                        {handleDisplayedAmount(selectedCoin.amount)}
                                    </span>
                                    <div style={{ ...styles.coinCircle, width: '4vh', height: '4vh' }}>
                                        <img
                                            src={selectedCoin.coinImage}
                                            alt={selectedCoin.coinName}
                                            style={styles.coinImage}
                                        />
                                    </div>

                                </>
                            ) : (
                                <>
                                    <span style={styles.coinText}> Coins </span>
                                    <img
                                        src={require('../assets/dropdown-icon.png')}
                                        alt="Dropdown Icon"
                                        style={styles.dropdownIcon}
                                    />
                                </>
                            )}
                        </div>
                    </MenuButton>
                    <Menu style={styles.dropdownMenuItem}>
                        {coins.length > 0 ? (
                            coins.map((coin, index) => (
                                <div style={styles.coinRow} key={index}>
                                    <MenuItem onClick={() => setSelectedCoin(coin)}>
                                        <img
                                            src={require('../assets/plus-icon.png')}
                                            alt="Add Icon"
                                            style={styles.addCoinsIcon}
                                            onClick={() => {
                                                if (!coin.campaignId) {
                                                    alert('Campaign ID não encontrado para esta moeda.');
                                                    return;
                                                }
                                                window.location.href = `/campaign/${coin.campaignId}`;
                                            }}
                                        />
                                        <span style={styles.coinAmount}>
                                            {handleDisplayedAmount(coin.amount)}
                                        </span>
                                        <div style={styles.coinCircle}>
                                            <img
                                                src={coin.coinImage}
                                                alt={coin.coinName}
                                                style={styles.coinImage}
                                                title={coin.coinName} 
                                            />
                                        </div>
                                    </MenuItem>
                                </div>
                            ))
                        ) : (
                            <MenuItem>
                                <span>No coins available</span>
                            </MenuItem>
                        )}
                    </Menu>
                </Dropdown>



                <input
                    type="number"
                    placeholder="Bet Value"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    style={styles.input}
                />

                { sendoUsado ? (
                    <button 
                        style={styles.button} 
                        disabled
                    > 
                        Roll All
                    </button>
                ) : (
                    <button 
                        style={styles.button} 
                        onClick={rollAll}
                    > 
                        Roll All
                    </button>
                )}
            </div>

        </div>


        <SideBar  />
        </>
    );
}

const styles = {
    mainContent: {
        marginTop: '5vh',
        marginLeft: '14.75vw',
        font: 'Inter',
        display: 'flex',
        flexDirection: 'column',
	    justifyContent: 'center',
	    alignItems: 'center',
    },

    header:{
        color:'white',
        fontSize:'6vh',
        textAlign:'center',
        margin: 0,
        marginBottom: '2vh',
        padding: 0,
    },

    controlsContainer:{
        marginTop:'2vh',
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '2vh',
    },

    button:{
        height: "6vh",
        width: "22.2vh",
        borderRadius: "2vh",
        backgroundColor: '#1FA8FE',
        border: 'none',
        boxShadow: '0.5vh 0.5vh 1vh rgba(0, 0, 0, 0.2)',
        color: '#fff',
        fontSize: "2.6vh",
        fontWeight: 'bold',
        cursor: 'pointer',
    },

    input:{
        height: "6vh",
        width: "13.5vh",
        borderRadius: "2vh",
        backgroundColor: '#fff',
        border: 'none',
        boxShadow: '0.5vh 0.5vh 1vh rgba(0, 0, 0, 0.2)',
        color: '#1FA8FE',
        fontSize: "2.6vh",
        padding: '0 2vh',
        fontWeight: 'bold',
    },

    slot:{
        display: 'flex',
        justifyContent: 'center',
        gap: '1vh',
    },

    container:{
        width: '120vh',
        height: '60vh',
        marginTop: '10vh',
        marginBottom: '3vh',
        border: '2vh solid black',
        borderRadius: '5vh',
        backgroundImage: 'linear-gradient(to right, #e05e1d, #9e1919, #e05e1d)',
    },

    faixa: {
        width: icon_width + 'px', 
		height: (num_reels * icon_height) + 'px', 
		border: '1px solid rgba(black, 0.3)',
		borderRadius: '10px',
		overflow: 'hidden',
		backgroundImage: 'url(' + background + ')',
		backgroundPositionY: '0',
		backgroundRepeat: 'repeat-y'
    },
    
    coinsContainerDropdown: {
        height: "6vh",
        width: "22.2vh",
        borderRadius: "2vh",
        backgroundColor: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0.5vh 0.5vh 1vh rgba(0, 0, 0, 0.2)',
    },
    coinText: {
        color: '#1FA8FE',
        fontSize: "2.6vh",
        fontWeight: 'bold',
        flex: '1',
    },
    dropdownMenuItem: {
        width: 'auto',
        borderRadius: '2vh',
        backgroundColor: '#EFEFEF',
        padding: '0.5vw 0.5vw 0.5vw 0.5vw',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        overflowY: 'auto',
        overflowX: 'hidden',
    },
    dropdownIcon: {
        width: "4vh",
        height: "2vh",
        paddingRight: '1.6vh',
    },
    coinRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        padding: '0.5vh 0vh'
    },
    addCoinsIcon: {
        width: '2.5vw',
        height: '2.5vw',
        cursor: 'pointer',
    },
    coinAmount: {
        fontSize: '3.5vh',
        color: '#333',
        width: '7vw',
        maxWidth: '7vw',
        fontWeight: 'bold',
        textAlign: 'center',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    coinCircle: {
        width: '2.5vw',
        height: '2.5vw',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#FFAD00',
    },
    coinImage: {
        width: '80%',
        height: '80%',
        borderRadius: '50%',
        objectFit: 'cover',
    },   


};

export default SlotsPage;