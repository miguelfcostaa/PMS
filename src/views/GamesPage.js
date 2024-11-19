import React from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';

function GamesPage
() {
    const items = [
        {id: 1, image: require("../assets/crash.png"), text: "Online players: 12874", buttontext: "Try it"},
        {id: 2, image: require("../assets/roleta.jfif"), text: "Online players: 4321", buttontext: "Try it"},
        {id: 3, image: require("../assets/slots.jfif"), text: "Online players: 8567", buttontext: "Try it"}
    ];
    return (
        <>
        <NavBar  />
        <SideBar  />
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
              if (item.id === 2) {
                window.location.href = "/roulette";
              }
            }}
            >
              {item.buttontext}
            </button>
          </div>
        ))}
      </div>
        </>
    );
}
const styles = {
    container: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "100px",
        padding: "5px",
    },
    box: {
        display: "flex",
        position: "relative",
        top: "200px",
        left: "475px",
        flexDirection: "column",
        justifyContent: "space-between",
        border: "2px solid #ccc",
        borderRadius: "10px",
        width: "350px",
        height: "450px",
        padding: "10px",
        backgroundColor: "#d3d3d3",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
    },
    image: {
        width: "350px",
        height: "350px",
        objectFit: "center", 
        borderRadius: "10px",
    },
    text: {
        fontSize: "16px",
        color: "#333",
        margin: "10px 0",
    },
    button: {
        padding: "10px 5px",
        backgroundColor: "#28a745",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "16px",
    },
    buttonHover: {
        backgroundColor: "#218838",
    },
}

export default GamesPage;