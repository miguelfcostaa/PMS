import React, { useEffect } from 'react';

const Warning = () => {
    useEffect(() => {
        const isCountdownStarted = localStorage.getItem('countdownStarted') === 'true';
        if (!isCountdownStarted) {
            localStorage.setItem('countdownStarted', true);
            localStorage.setItem('countdownTime', Date.now() + 60000); // 1 minuto no futuro
        }
    }, []);

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h2 style={styles.title}>Sign Up Almost Completed!</h2>
                <p style={styles.message}>
                    Thank you for registering! Your information is currently being <strong>reviewed</strong> by our <strong>administration team</strong>. Once <strong>validated</strong>, you'll have <strong>full access</strong> to the platform.
                </p>
                <button style={styles.continueButton} onClick={() => window.location.href = '/signin'}>I understand, continue</button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
        backgroundColor: '#183059',
    },
    formContainer: {
        backgroundColor: '#ffffff',
        borderRadius: '2.5vh',
        padding: '4vh',
        width: '80%',
        maxWidth: '600px',
        textAlign: 'center',
    },
    title: {
        fontSize: '3vh',
        marginBottom: '2vh',
    },
    message: {
        fontSize: '2vh',
        lineHeight: '1.5',
    },
    continueButton: {
        width: '80%',
        backgroundColor: '#333333',
        color: '#ffffff',
        padding: '2vh',
        borderRadius: '1vh',
        border: 'none',
        fontSize: '2vh',
        cursor: 'pointer',
    },
};

export default Warning;
