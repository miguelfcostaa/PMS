import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';

function Challenges() {
  const [challengesData, setChallengesData] = useState([]);
    const [rectangles, setRectangles] = useState([
        {
            id: 1,
            squares: [
                { id: 1, image: require("../assets/plus-icon-simple.png"), description: "Create a Campaign", progress: 0 },
                { id: 2, image: require("../assets/donate.png"), description: "Donate at least 500€ in any campaign", progress: 0 },
                { id: 3, image: require("../assets/goal.png"), description: "Make your campaign reach its goal.", progress: 0 },
                { id: 4, image: require("../assets/medal-bronze.png"), description: "Reward: Helping the aid", isMedal: true }
            ],
        },
    ]);

    useEffect(() => {
      const fetchChallengesData = async () => {
          try {
              const userId = localStorage.getItem('userId'); // Obtém o userId do localStorage
              if (!userId) {
                  console.error("userId is not defined in localStorage");
                  return;
              }
  
              const response = await fetch(`http://localhost:5000/api/user/challenges/${userId}`, {
                  headers: {
                      Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
              });
  
              if (!response.ok) throw new Error("Failed to fetch challenges data");
  
              const challenges = await response.json();
              console.log("Challenges fetched from API:", challenges);
              setChallengesData(challenges);
  
              const updatedRectangles = rectangles.map((rectangle) => {
                  const updatedSquares = rectangle.squares.map((square) => {
                      console.log("Square being checked:", square);
  
                      const matchingChallenge = challenges.find(
                          (challenge) => challenge.name === square.name
                      );
  
                      if (matchingChallenge) {
                          console.log("Matching challenge:", matchingChallenge);
  
                          let progressPercentage = 0;
  
                          if (matchingChallenge.name === "Create a Campaign") {
                              progressPercentage = matchingChallenge.progress;
                          } else if (matchingChallenge.name === "Donate at least 500€ in any campaign") {
                              const totalDonated = matchingChallenge.progress;
                              console.log("Total Donated:", totalDonated);
                              progressPercentage = Math.min(Math.round((totalDonated / 500) * 100), 100);
                          } else if (matchingChallenge.name === "Make your campaign reach its goal.") {
                              const campaignProgress = matchingChallenge.progress;
                              console.log("Campaign Progress:", campaignProgress);
                              progressPercentage = Math.min(Math.round(campaignProgress), 100);
                          }
  
                          console.log(
                              `Challenge: ${matchingChallenge.name}, Progress: ${progressPercentage}%`
                          );
  
                          square.progress = progressPercentage;
                      }
                      return square;
                  });
  
                  return { ...rectangle, squares: updatedSquares };
              });
  
              console.log("Updated Rectangles:", updatedRectangles);
              setRectangles(updatedRectangles);
          } catch (error) {
              console.error("Erro ao buscar dados dos desafios:", error);
          }
      };
  
      fetchChallengesData();
  }, [rectangles]); // Retire o userId do array de dependências
  
    return (
        <>
            <NavBar />
            <SideBar />
            <div style={styles.mainContent}>
                <h1>Challenges</h1>
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
                                        {square.description}
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
        marginTop: "60px",
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
