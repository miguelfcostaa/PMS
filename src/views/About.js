import React from 'react';
import SideBar from '../components/SideBar';
import NavBar from '../components/NavBar';

const About = () => {
    return (
        <>                    
            <NavBar  />
            <SideBar />

            <div style={styles.mainContent}>

                <div style={styles.title}> Our Mission </div>
                <div style={styles.text}> At Worth+, we believe that every contribution holds value and has the power to create meaningful change. Our mission is to bridge generosity and innovation by providing a platform where giving becomes interactive, rewarding, and impactful. We are driven by the vision of transforming small actions into extraordinary outcomes, empowering individuals and communities to make a difference together. </div>
                
                <div style={styles.title}> Our Team </div>
                <div style={styles.text}> João Gomes, Miguel Costa, Luis Barradas, Diogo Martins, Bernardo Coelho. </div>
                
            </div>
        </>
    );
};

const styles = {
    mainContent: {
        marginTop: 140,
        marginLeft: '16%',
        paddingLeft: '2vh',
        font: 'Inter',
    },
    title: {    
        marginBottom: '2vh',
        fontSize: 26,
        fontWeight: 'bold',
    },
    text: {
        marginBottom: '4vh',
        fontSize: 22,
        marginRight: '6vh',
        textAlign: 'justify',
    },
};

export default About;