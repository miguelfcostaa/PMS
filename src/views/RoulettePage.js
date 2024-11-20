import React, { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';

const cameraPositionZ = 4; // camera's Z position
const colors = ["red", "black", "red", "black", "blue", "red", "black", "red", "black", "red", "black"];
const red = 0x9D0208;
const black = 0x000000;
const blue = 0x009DFF;

let position = 0;
let scene, canvas, renderer, camera;
let circles = [];

function Init() {
    canvas = useRef(null)
    position = -1;
    useEffect(() => {
        scene = new THREE.Scene();
        scene.background = (0xFF7F3E);

        camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer();

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0xC7D5E5);
        canvas.current.appendChild(renderer.domElement);

        const material = new THREE.LineBasicMaterial({ color: 0xFAB12F });

        const points = [];
        points.push(new THREE.Vector3(0, 0.2, 0));
        points.push(new THREE.Vector3(0, 0, 0));
        points.push(new THREE.Vector3(0, 0.6, 0));

        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        const line = new THREE.Line(geometry, material);
        line.position.x = 0.2
        scene.add(line);

        for (let c in colors) {
            let material;
            console.log(colors[c]);
            if (colors[c] === "red") {
                material = new THREE.MeshBasicMaterial({ color: red });
            }
            if (colors[c] === "black") {
                material = new THREE.MeshBasicMaterial({ color: black });
            }
            if (colors[c] === "blue") {
                material = new THREE.MeshBasicMaterial({ color: blue });
            }
            const geometry = new THREE.CircleGeometry(1, 128)

            const sphere = new THREE.Mesh(geometry, material);
            sphere.scale.set(0.1, 0.1, 0.1);
            sphere.position.x = position
            sphere.position.set(position, 0.3)
            position += 0.3;
            circles.push(sphere);
            scene.add(sphere);
        }

        camera.position.z = 4;

        renderer.render(scene, camera);

        return () => {
            renderer.dispose();
            //canvas.current.removeChild(renderer.domElement);
          };

    }, []);
}

function RoulettePage() {
    Init()
    return (
        <>
            <NavBar />
            <SideBar />
            <div style={styles.canvas} ref={canvas}>
            </div>

            <div style={styles.container}>
                <div style={styles.buttonGroup}>
                    <button style={{ ...styles.button, backgroundColor: "#9D0208" }}>
                        Place Bet x2
                    </button>
                    <button style={{ ...styles.button, backgroundColor: "#009DFF" }}>
                        Place Bet x10
                    </button>
                    <button style={{ ...styles.button, backgroundColor: "#000000" }}>
                        Place Bet x2
                    </button>
                </div>

                <div style={styles.inputGroup}>
                    <label htmlFor="quantity" style={styles.label}>Quantity:</label>
                    <input type="number" id="quantity" style={styles.input} />
                </div>
            </div>
        </>
    );
}

const styles = {

    canvas: {
        height: "500px"
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
};

export default RoulettePage;
