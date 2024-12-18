import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';

function Challenges() {
    const [rectangles, setRectangles] = useState([
        {
            id: 1,
            squares: [
                { id: 1, image: require("../assets/plus-icon-simple.png"), description: "Create a Campaign", progress: 0 },
                { id: 2, image: require("../assets/donate.png"), description: "Donate at least 500€ in any campaign", progress: 0 },
                { id: 3, image: require("../assets/goal.png"), description: "Make your campaign reach its goal.", progress: 0 },
                { id: 4, image: require("../assets/medal-bronze.png"), description: "Reward: Creator of Campaign", isMedal: true }
            ],
        },
        {
            id: 2,
            squares: [
                { id: 1, image: require("../assets/deposit.png"), description: "Deposit 100€", progress: 0 },
                { id: 2, image: require("../assets/multiplier.jpg"), description: "Double your money, playing any game", progress: 0 },
                { id: 3, image: require("../assets/donate.png"), description: "Donate to any campaign a value superior to 400€", progress: 0 },
                { id: 4, image: require("../assets/medal-silver.png"), description: "Reward: Helping the aid", isMedal: true }
            ]
        }
    ]);

    const [userData, setUserData] = useState(null); // Dados do usuário
    const [challengesData, setChallengesData] = useState([]); // Dados dos desafios

    // Função para buscar os dados do usuário e seus desafios
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtendo o ID do usuário logado (a API deve retornar os dados do usuário autenticado)
                const userResponse = await fetch('http://localhost:5000/api/user/data', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Passando o token do usuário autenticado
                    },
                });

                if (!userResponse.ok) throw new Error("Failed to fetch user data");

                const user = await userResponse.json();
                setUserData(user);

                // Buscando desafios do usuário
                const challengesResponse = await fetch(`http://localhost:5000/api/user/challenges/${user._id}`);
                if (!challengesResponse.ok) throw new Error("Failed to fetch challenges data");

                const challenges = await challengesResponse.json();
                setChallengesData(challenges);

                // Atualizando progresso nos quadrados
                const updatedRectangles = rectangles.map((rectangle) => {
                    const updatedSquares = rectangle.squares.map((square) => {
                        // Encontrando o desafio correspondente ao square
                        const matchingChallenge = challenges.find(challenge => challenge.description === square.description);

                        // Se encontramos o desafio correspondente, atualizamos o progresso
                        if (matchingChallenge) {
                            square.progress = matchingChallenge.progress || 0; // Atualizando o progresso
                        }
                        return square;
                    });

                    return { ...rectangle, squares: updatedSquares };
                });

                setRectangles(updatedRectangles); // Atualiza o estado com os novos progressos
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        };

        fetchData();
    }, [rectangles]); // Rodar sempre que o estado rectangles for alterado

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
                                                        width: `${square.progress}%`, // Atualizando a largura da barra de progresso
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
