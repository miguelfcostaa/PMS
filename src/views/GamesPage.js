import React from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';

function GamesPage
() {
    
    return (
        <>
            <NavBar  />
            <SideBar  />
            <div style={styles.container}>
            {[1, 2, 3].map((item) => (
                <div style={styles.box} key={item}>
                    <h3>Conteúdo Aqui</h3>
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
        justifyContent: "center",
        border: "2px solid #ccc",
        borderRadius: "10px",
        width: "350px",
        height: "450px",
        padding: "10px",
        backgroundColor: "#d3d3d3",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
    }
}

export default GamesPage;