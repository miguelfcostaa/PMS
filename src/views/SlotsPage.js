import React, { useState, useEffect, useRef}  from 'react';
import NavBar from '../components/NavBar';
import axios from "axios";
import SideBar from '../components/SideBar';
import { useNavigate } from 'react-router-dom';
import background from "../assets/slotreel.webp";

const icon_width = 79;
const icon_height = 79;
const num_icons= 9;
const num_reels = 5;
const slot = [0,0,0,0,0];
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

    useEffect(() => {
        console.log("sendoUsado atualizado: ", sendoUsado);
    }, [sendoUsado]);

    function rollAll() {
        setSendoUsado(true);
        multiplier = 0;
        const faixaList = document.querySelectorAll('.slot > .faixa');
        
        console.log(sendoUsado)

        Promise.all( [...faixaList].map((faixa, i) => roll(faixa, i)))	
            .then((deltas) => {
                deltas.forEach((delta, i) => slot[i] = (delta + 7) % num_icons);
                console.log(deltas)
                let textContent = slot.map((i) => iconMap[i]).join(' - ');
                console.log(textContent + '\n' + slot);
                if (slot[0] == slot[1]) {
                    multiplier = multiplier + 1 + ((slot[0] + slot[1]) * 0.6)
                    console.log(multiplier);
                    if (slot[1] == slot[2]){
                        multiplier = multiplier + 1 + ((slot[1] + slot[2]) * 0.6)
                        console.log(multiplier);
                    }
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
                <div class='faixa' style={styles.faixa}></div> 
                <div class='faixa' style={styles.faixa}></div>           
            </div>
            
            <button 
                style={sendoUsado ? styles.buttonUsado : styles.button} 
                onClick={sendoUsado ? null : rollAll}
                disabled={sendoUsado}
            > 
                Roll All 
            </button>
        </div>


        <SideBar  />
        </>
    );
}

const styles = {
    button:{
        top: '85vh',
        position:'absolute',
        padding: '10px 20px',
        width: "25vw",
        height: "10vh",
        border: 'none',
        background: '#425576',
        boxshadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        borderradius: '5px',
        cursor: 'pointer',
        fontSize: '4vh',
        borderRadius: "20px",
        color:"#C7D5E5",
        boxShadow: '0.5vh 0.5vh 1vh rgba(0, 0, 0, 0.2)',
    },

    buttonUsado:{
        top: '85vh',
        position:'absolute',
        padding: '10px 20px',
        width: "25vw",
        height: "10vh",
        border: 'none',
        background: ' rgba(0, 0, 0, 0.25)',
        boxshadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        borderradius: '5px',
        cursor: 'pointer',
        fontSize: '4vh',
        borderRadius: "20px",
        color:"#C7D5E5",
        boxShadow: '0.5vh 0.5vh 1vh rgba(0, 0, 0, 0.2)',
    },

    slot:{
        position: 'relative',
        width: (num_reels + 0.5) * icon_width + 'px',
        height: 3 * icon_height + 'px',
        display: 'flex',
        top:106,
        justifyContent: 'space-between',
        padding: 0.6 * icon_width + 'px',
        paddingLeft: 3 * icon_width + 'px',
        
        paddingRight: 3 * icon_width + 'px',
        border: '10px solid black',
        borderRadius: '5px',
        backgroundImage: 'linear-gradient(to right, #999797, gray, #999797)',
        borderRadius: '3px',
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

    canvas: {
        marginTop: '20vh',
        height: "0px",
        width: '0px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginLeft: "15%",
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