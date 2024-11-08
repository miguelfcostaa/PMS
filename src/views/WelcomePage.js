import React from 'react';
import NavBarSimple from '../components/NavBarSimple';

const WelcomePage = () => {
    return (
        <>
            <NavBarSimple />
            <div style={styles.container}>
                {/* <img 
                    src={require('../assets/seta.png')} 
                    style={styles.seta}
                /> */} 
                <div style={styles.welcomeContainer}>
                    <span style={styles.welcome}>WELCOME</span>
                    <p style={styles.text}>
                        <span>Help bring inspiring projects to life or <br></br> create your own crowdfunding campaign. <br></br><b> Together, we make a difference! </b></span>
                    </p>
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
    seta: {
        position: 'absolute',
        width: '60%',
        height: '80%',
        marginRight: '100px',
    },
    
};

export default WelcomePage;