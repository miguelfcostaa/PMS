import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBarSimple from '../components/NavBarSimple';

const WelcomePage = () => {
    const navigate = useNavigate();

    const handleJoinUsClick = () => {
        navigate('/signin');  // Redireciona para a página de SignIn
    }

    return (
        <>
            <NavBarSimple />
            <div style={styles.container}>
                <div style={styles.welcomeContainer}>
                    <span style={styles.welcome}>WELCOME</span>
                    <p style={styles.text}>
                        <span>Help bring inspiring projects to life or <br /> create your own crowdfunding campaign. <br /><b> Together, we make a difference! </b></span>
                    </p>
                    {/* Botão Join Us */}
                    <button onClick={handleJoinUsClick} style={styles.joinButton}>
                        Join us
                    </button>
                </div>
            </div>
        </>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
    },
    welcomeContainer: {
        marginTop: '200px',
        textAlign: 'center', // Alinha o conteúdo ao centro
    },
    welcome: {
        fontSize: 118,
        font: 'Inter',
        fontWeight: 'semibold',
        color: '#28D885', 
        marginTop: '200px',
    },
    text: {
        fontSize: 30,
        font: 'Inter',
        fontWeight: 'regular',
        color: '#fff', 
        marginTop: '10px',
        textAlign: 'center',
    },
    joinButton: {
        marginTop: '20px',
        padding: '15px 30px',
        backgroundColor: '#009DFF', // Cor do fundo do botão
        color: '#ffffff',
        fontSize: 24,
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    seta: {
        position: 'absolute',
        width: '60%',
        height: '80%',
        marginRight: '100px',
    },
};

export default WelcomePage;
