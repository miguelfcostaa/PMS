import React from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';

function GamesPage() {
    const items = [
        {id: 1, image: require("../assets/crash.png"), text: "Online players: 12874", buttontext: "Try it"},
        {id: 2, image: require("../assets/roleta.jfif"), text: "Online players: 4321", buttontext: "Try it"},
        {id: 3, image: require("../assets/slots.jfif"), text: "Online players: 8567", buttontext: "Try it"}
    ];
    return (
        <>
        <NavBar  />
        <SideBar  />
        <div style={styles.mainContent}>
            <div style={styles.container}>
                {items.map((item) => (
                <div style={styles.box} key={item.id}>
                    <img src={item.image} style={styles.image} />
                    <h3 style={styles.text}>{item.text}</h3>
                    <button
                    style={styles.button}
                    onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                    onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                    onClick={() => {
                        switch (item.id) {
                            case 1:
                                window.location.href = "/crash";
                                break;
                            case 2:
                                window.location.href = "/roulette";
                                break;
                            case 3:
                                window.location.href = "/slots";
                                break;
                            default:
                                break;
                        }
                    }}
                    >
                    {item.buttontext}
                    </button>
                </div>
                ))}
            </div>
        </div>
        </>
    );
}

const styles = {
    mainContent: {
        marginTop: 142,
        marginLeft: '20%',
        marginRight: '5%',
        paddingLeft: '20px',
        font: 'Inter',
    },
    container: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
        flexWrap: "wrap",
        width: "100%",
    },
    box: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        border: "2px solid #ccc",
        borderRadius: "10px",
        width: "48vh",
        height: "70vh",
        padding: "10px",
        backgroundColor: "#d3d3d3",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
    },
    image: {
        width: "400px",
        height: "400px",
        borderRadius: "10px",
        alignSelf: "center",
    },
    text: {
        fontSize: "3vh",
        color: "#333",
        margin: "10px 0",
    },
    button: {
        margin: "2vh",
        padding: "10px 5px",
        backgroundColor: "#28a745",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "2.5vh",
    },
    buttonHover: {
        backgroundColor: "#218838",
    },
}

export default GamesPage;
