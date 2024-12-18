import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';

function Challenges() {
    const [challengesData, setChallengesData] = useState([]);
    const [rectangles, setRectangles] = useState([
        {
            id: 1,
            squares: [
                { id: 1, image: require("../assets/plus-icon-simple.png"), description: "Create a Campaign", progress: 0, name: "Create a Campaign" },
                { id: 2, image: require("../assets/donate.png"), description: "Donate at least 500€ in any campaign", progress: 0, name: "Donate at least 500€ in any campaign" },
                { id: 3, image: require("../assets/goal.png"), description: "Make your campaign reach its goal.", progress: 0, name: "Make your campaign reach its goal." },
                { id: 4, image: require("../assets/medal-bronze.png"), description: "Reward: Helping the aid", isMedal: true }
            ],
        },
    ]);

    // Função para buscar os desafios do utilizador
    const fetchChallengesData = async () => {
        try {
            const userId = localStorage.getItem('userId'); 
            if (!userId) {
                console.error("userId is not defined in localStorage");
                return;
            }
    
            const response = await fetch(`http://localhost:5000/api/auth/challenges/${userId}`, { 
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
    
            if (!response.ok) throw new Error("Failed to fetch challenges data");
    
            const challenges = await response.json();
            
            console.log('Challenges received from backend:', challenges);
    
            setChallengesData(challenges); 
            updateRectangles(challenges); 
        } catch (error) {
            console.error("Erro ao buscar dados dos desafios:", error);
        }
    };
    
    
    // Atualiza os desafios no front-end, sincronizando com o back-end
    const updateRectangles = (challenges) => {
        setRectangles((prevRectangles) => {
            return prevRectangles.map((rectangle) => {
                const updatedSquares = rectangle.squares.map((square) => {
                    const matchingChallenge = challenges.find((challenge) => {
                        console.log("Comparing:", challenge.name, square.name); // Debug
                        const challengeName = challenge.name?.trim().toLowerCase();
                        const squareName = square.name?.trim().toLowerCase();
    
                        return challengeName && squareName && challengeName === squareName;
                    });
    
                    if (matchingChallenge) {
                        let progressPercentage = 0;
    
                        // Lógica específica para cada desafio
                        if (matchingChallenge.name.toLowerCase().includes("doar €500")) {
                            progressPercentage = Math.min((matchingChallenge.progress / 500) * 100, 100);
                        } else if (matchingChallenge.name.toLowerCase().includes("meta da campanha")) {
                            progressPercentage = Math.min(matchingChallenge.progress, 100);
                        } else {
                            progressPercentage = Math.min(matchingChallenge.progress, 100);
                        }
    
                        return {
                            ...square,
                            progress: Math.round(progressPercentage),
                            completed: progressPercentage === 100
                        };
                    }
    
                    return square;
                });
    
                return { ...rectangle, squares: updatedSquares };
            });
        });
    };
    
    
    

    // Atualização automática a cada 30 segundos (polling)
    useEffect(() => {
        fetchChallengesData();

        const interval = setInterval(() => {
            fetchChallengesData();
        }, 30000); // Atualiza os dados a cada 30 segundos

        return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
    }, []); // O array vazio faz com que isso só ocorra na montagem


    

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
                                            <p style={styles.percentage}>
                                                {square.progress === 100
                                                    ? "Challenge Completed"
                                                    : `${square.progress}%`}
                                            </p>
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
        flexWrap: "wrap", 
        width: "100%", 
        height: "auto", 
        padding: "10px",
        backgroundColor: "#f0f0f0",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
    },
    square: {
        margin: "20px", 
        height: "250px", 
        width: "250px", 
        textAlign: "center",
        backgroundColor: "#ddd",
        borderRadius: "5px",
        padding: "50px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)", 
        transition: "transform 0.2s",
    },
    image: {
        width: "100px",
        height: "100px",
        marginTop: "20px",
        marginBottom: "10px",
        objectFit: "contain",
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
        objectFit: "contain",
    },
};

export default Challenges;
