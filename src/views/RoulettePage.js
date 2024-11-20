import React, { useEffect, useRef, useMemo, memo } from 'react';
import * as THREE from 'three';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';


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

function roulette() {
    const index = Math.floor(Math.random() * 10)
    const result = circles[index]
    let today = new Date()
    let s = today.getSeconds()
    let actualS = s
    let sp = speed
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
                    <input type="number" id="quantity" value={inputValue} onChange={handleInputChange} style={styles.input} />
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
        marginLeft: "20%",
    },
    buttonGroup: {
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginLeft: "20%",
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
        width: "920px",
        flexDirection: 'column',
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '10px',
    },

    label: {
        margin: '5px',
        fontSize: '18px',
        color: "#A5A5A5",
        fontFamily: "Helvetica",
    },

    input: {
        height: '30px',
        width: "100%",
        padding: '8px',
        fontSize: '14px',
        borderRadius: 20,
        border: "none",
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    },
}

export default memo(RoulettePage)
