import React, { useEffect, useRef, useMemo, memo, useState } from 'react';
import * as THREE from 'three';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import axios from 'axios';
import Dropdown from '@mui/joy/Dropdown';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import { useNavigate } from 'react-router-dom';

const colors = ["red", "black", "red", "black", "red", "black", "red", "black", "red", "blue", "black", "red", "black"];
const red = 0x9D0208;
const black = 0x000000;
const blue = 0x009DFF;
const clock = new THREE.Clock()
const time = 5000;
const spacing = 0.45
const speed = 0.1;



let position = -2.94
let scene, canvas, renderer, camera
let circles = []



function Init() {

    canvas = useRef(null)
    useEffect(() => {
        if (!scene) {
            scene = new THREE.Scene()

            camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000)
            renderer = new THREE.WebGLRenderer()

            renderer.setSize(window.innerWidth / 1.5, window.innerHeight / 1.5)
            //renderer.setClearColor(0xC7D5E5);
            renderer.setClearColor(0xE8E8E8)
            canvas.current.appendChild(renderer.domElement)

            const material = new THREE.LineBasicMaterial({ color: 0xFAB12F })

            const points = []
            points.push(new THREE.Vector3(0, -0.2, 0))
            points.push(new THREE.Vector3(0, 0, 0))
            points.push(new THREE.Vector3(0, 0.2, 0))

            const geometry = new THREE.BufferGeometry().setFromPoints(points)

            const line = new THREE.Line(geometry, material)
            line.position.x = -0.1
            line.position.z = 2
            scene.add(line)

            for (let c in colors) {
                let material;
                console.log(colors[c])
                if (colors[c] === "red") {
                    material = new THREE.MeshBasicMaterial({ color: red })
                }
                if (colors[c] === "black") {
                    material = new THREE.MeshBasicMaterial({ color: black })
                }
                if (colors[c] === "blue") {
                    material = new THREE.MeshBasicMaterial({ color: blue })
                }
                const geometry = new THREE.CircleGeometry(1, 128)

                const sphere = new THREE.Mesh(geometry, material)
                sphere.scale.set(0.2, 0.2, 0.2)
                sphere.position.x = position
                position += spacing
                circles.push(sphere)
                scene.add(sphere)
            }

            camera.position.z = 4

            renderer.render(scene, camera)
        }
        return () => {
            renderer.dispose()
        };

    }, [])
}


function RoulettePage() {

    const [coins, setCoins] = useState([]);
    const [selectedCoin, setSelectedCoin] = useState(null);
    const [userData, setUserData] = useState({});
    const userId = localStorage.getItem('userId');


    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/auth/${userId}`);
                if (response.status === 200) {
                    const data = response.data;
                    setUserData(data);
                    setCoins(data.coins || []);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [userId]);



    function roulette() {
        const index = Math.floor(Math.random() * 10)
        const result = circles[index]
        let today = new Date()
        let s = today.getSeconds()
        let actualS = s
        let sp = speed
    
        if (selectedCoin === null) {
            alert('Please select a coin to bet.');
            return;
        }
    
        const rouletteAnimation = () => {
            circles.forEach((c, index) => {
                if (actualS < s + 5) {
                    today = new Date()
                    actualS = today.getSeconds()
                    console.log(sp)
                    c.position.x -= sp
                    sp = sp - sp / 3000
                    if (c.position.x <= -2.5) {
                        if (index !== 0) {
                            c.position.x = circles[index - 1].position.x + spacing
                        }
                        else {
                            c.position.x = circles[circles.length - 1].position.x + spacing
                        }
                    }
                }
                else {
                    if (result.position.x >= -0.1 && result.position.x <= -0.3) {
                        today = new Date()
                        actualS = today.getSeconds()
                        console.log(s)
                        c.position.x -= sp
                        sp = sp - sp / 3000
                        if (c.position.x <= -2.5) {
                            console.log(c.position.x)
                            if (index !== 0) {
                                c.position.x = circles[index - 1].position.x + spacing
                            }
                            else {
                                c.position.x = circles[circles.length - 1].position.x + spacing
                            }
                        }
                    }
                }
            });
        }
    
        const animate = () => {
            requestAnimationFrame(animate)
            rouletteAnimation()
            renderer.render(scene, camera)
    
        };
        animate()
    }


    const [inputValue, setInputValue] = React.useState('');

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    Init()

    return (
        <>
            <NavBar />
            <SideBar />
            <div style={styles.canvas} ref={canvas}>
            </div>

            <div style={styles.container}>
                <div style={styles.buttonGroup}>
                    <button onClick={roulette} 
                    disabled={!inputValue.trim()} 
                    style={{ ...styles.button, backgroundColor: "#9D0208" }}>
                        Place Bet x2
                    </button>
                    <button onClick={roulette} 
                    disabled={!inputValue.trim()} 
                    style={{ ...styles.button, backgroundColor: "#009DFF" }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover)}>
                        Place Bet x10
                    </button>
                    <button onClick={roulette} 
                    disabled={!inputValue.trim()} 
                    style={{ ...styles.button, backgroundColor: "#000000" }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover)}>
                        Place Bet x2
                    </button>
                </div>

                <div style={styles.inputGroup}>
                    <label htmlFor="quantity" style={styles.label}>Quantity:</label>
                    <div style={styles.coinFlex}>
                        <input type="number" id="quantity" value={inputValue} onChange={handleInputChange} style={styles.input} />
                        
                        <Dropdown>
                            <MenuButton variant="solid" color="#FFFFFF">
                                <div style={styles.coinsContainerDropdown}>
                                    {selectedCoin ? (
                                        <>
                                            <span style={{...styles.coinAmount, marginRight: 10}}>
                                                {selectedCoin.amount}
                                            </span>
                                            <div style={{...styles.coinCircle, width: '4vh', height: '4vh'}}>
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
                                                    {coin.amount}
                                                </span>
                                                <div style={styles.coinCircle}>
                                                    <img
                                                        src={coin.coinImage}
                                                        alt={coin.coinName}
                                                        style={styles.coinImage}
                                                        title={coin.coinName} // Nome da moeda aparece no hover
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
                    </div>
                </div>
            </div>
        </>
    );
}

const styles = {
    canvas: {
        height: "350px",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginLeft: "15%",
    },
    buttonGroup: {
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginLeft: "15%",
        marginTop: "100px",
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '10px',
    },
    button: {
        height: '80px',
        width: '300px',
        border: 'none',
        margin: "10px",
        boxShadow: "0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        borderRadius: '20px',
        fontSize: '18px',
        fontFamily: "Helvetica",
        color: "white",
        cursor: 'pointer',
    },
    inputGroup: {
        flexDirection: 'column',
        display: 'flex',
        justifyContent: 'center',
    },
    label: {
        fontSize: 22,
        font: 'Inter',
        width: '100%',
        marginBottom: '1vh',
    },
    input: {
        height: "6vh",
        width: '100%',
        fontSize: '2vh',
        borderRadius: '2vh',
        border: 'none',
        paddingLeft: '1.5vh',
        backgroundColor: '#fff',
        outline: 'none',
        boxShadow: '0.5vh 0.5vh 1vh rgba(0, 0, 0, 0.2)',
    },
    coinFlex: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    coinsContainerDropdown: {
        height: "6vh",
        width: "17.2vh",
        borderRadius: "2vh",
        backgroundColor: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0.5vh 0.5vh 1vh rgba(0, 0, 0, 0.2)',
        marginLeft: '1.1vh',
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
        fontWeight: 'bold',
        width: '2vw',
        maxWidth: '5vw',
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
    buttonHover: {
        backgroundColor: "#007bff",
    },
}

export default memo(RoulettePage)
