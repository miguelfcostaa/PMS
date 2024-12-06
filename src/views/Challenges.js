import React from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';

function Challenges() {
    const rectangles = [
        {
          id: 1,
          squares: [
            { id: 1, image: require("../assets/plus-icon-simple.png"), description: "Create a Campaign", progress: 100},
            { id: 2, image: require("../assets/share.webp"), description: "Share your campaign to atleast 10 people", progress: 40},
            { id: 3, image: require("../assets/goal.png"), description: "Make your campaign reach its goal.", progress: 68},
            { id: 4, image: require("../assets/medal-bronze.png"), description: "Reward: Creator of Campaign", isMedal: true }
          ],
        },
        {
          id: 2,
          squares: [
            { id: 1, image: require("../assets/deposit.png"), description: "Deposit 100€", progress: 100},
            { id: 2, image: require("../assets/multiplier.jpg"), description: "Double your money, playing any game", progress: 100},
            { id: 3, image: require("../assets/donate.png"), description: "Donate to any campaign a value superior to 400€", progress: 89},
            { id: 4, image: require("../assets/medal-silver.png"), description: "Reward: Helping the aid", isMedal: true }
          ]
        }
      ];
      return (
        <>
          <NavBar />
          <SideBar />
          <div style={styles.mainContent}>
            <h1 sty></h1>
            <div style={styles.container}>
              {rectangles.map((rectangle) => (
                <div style={styles.rectangle} key={rectangle.id}>
                  {rectangle.squares.map((square) => (
                    <div
                    style={{
                        ...styles.square,
                        ...(square.isMedal && styles.medalSquare), 
                    }}
                    key={square.id}
                    >
                      <img
                        src={square.image}
                        alt={square.isMedal ? "Medal" : "Challenge"} 
                        style={square.isMedal ? styles.medalImage : styles.image}
                      />
                      <p style={styles.description}>
                        {square.isMedal ? square.description : square.description}
                      </p>
                      {!square.isMedal && (
                      <>
                          <div style={styles.progressBar}>
                              <div
                                  style={{
                                      ...styles.progress,
                                      width: `${square.progress}%`,
                                  }}
                              ></div>
                          </div>
                          <p style={styles.percentage}>{square.progress}%</p>
                      </>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      );
}

const styles = {
    mainContent: {
        marginTop: 102,
        marginLeft: '15%',
        paddingLeft: '20px',
        font: 'Inter',
    },
    container: {
        display: "flex",
        justifyContent: "space-around",
        flexDirection: "column",
        padding: "20px",
        marginTop: "10px",
        gap: "20px"
      },
      rectangle: {
        display: "flex",
        flexDirection: "row", 
        justifyContent: "flex-start",
        alignItems: "center",
        width: "1400px", 
        height: "375px",
        padding: "10px",
        backgroundColor: "#f0f0f0",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
      },
      square: {
        marginLeft: "20px",
        height: "250px",
        width: "250px",
        textAlign: "center",
        backgroundColor: "#ddd",
        borderRadius: "5px",
        padding: "50px",
      },
      squareContent: {
        fontSize: "14px",
        color: "#333",
      },
      image: {
        width: "100px",
        height: "100px",
        marginTop: "20px",
        marginBottom: "10px",
      },
      description: {
        fontSize: "18px",
        color: "#333",
        textAlign: "center",
        marginBottom: "10px",
      },
      progressBar: {
        width: "100%",
        height: "10px",
        backgroundColor: "#ddd",
        borderRadius: "5px",
        overflow: "hidden",
        border: "1px solid #ccc",
        marginBottom: "5px",
      },
      progress: {
        height: "100%",
        backgroundColor: "#4caf50",
      },
      percentage: {
        fontSize: "16px",
        color: "#666",
      },
      medalSquare: {
        display: "flex",
        backgroundColor: "",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        height: "200px",
        width: "200px",
        borderRadius: "10px",
        fontWeight: "bold",
        padding: "20px",
      },
      medalImage: {
        width: "150px",
        height: "150px",
        marginBottom: "10px",
      },
};

export default Challenges;