import React, { useState, useEffect }  from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import '../App.css';

function HomePage() {
    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchCampaigns = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/campaign/all-campaigns');
                if (response.ok) {
                    const data = await response.json();
                    setCampaigns(data);  
                } else {
                    throw new Error('Erro ao buscar campanhas');
                }
            } catch (err) {
                console.error('Erro na conexão', err);
            }
        };
        fetchCampaigns();

        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = '';
        };

    }, []);

    return (
        <>                    
            <NavBar  />       
            
            <div style={styles.mainContent}>
                <div style={styles.quadrado2}></div>                    
                <div style={styles.circulo1}></div>
                <div style={styles.quadrado1}></div>
                <div style={styles.circulo2}></div>

                <div style={styles.leftsection}>
                    <p style={styles.leftsection}>Your place to do <br/><span style={{fontSize: '15vh', fontWeight: '350'}}><b>GOOD!</b></span></p>
                    <a href='/create-campaign'> <button style={styles.button1}>Start Creating Campaign </button></a>
                    <p style={{fontSize: '5vh', marginTop:'10vh'}}>Start creating and <br/> organizing a campaign <br/><span style={{fontWeight: '350'}}><b>free of charge!</b></span></p>
                </div>     

                <div style={styles.rightsection}>
                    <p style={{fontSize: '5vh', marginTop:'4vh'}}>Play games and <span style={{fontWeight: '350'}}><b>help</b></span> a <br/> campaign of <span style={{fontWeight: '350'}}><b>your choice!</b></span></p>
                    <a href='/games'><button style={styles.button2}>Start Playing</button></a>
                    <p style={styles.rightsection1}>Your chance to <br/><span style={{fontSize: '15vh', fontWeight: '350'}}><b>HELP!</b></span></p>
                </div> 

            </div>
                
            <SideBar  />
        </>
    );
}

const styles = {
    mainContent: {
        marginTop: '5vh',
        marginLeft: '15.8vw',
        font: 'Inter',
        height: '100vh',
        width: "80vw",
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        
    },

    circulo1: {
        height: "70vh",
        width: "30vw",
        borderRadius: "100%",
        background: "#C7D5E5",
        position:'absolute',
        marginLeft:"15vw",
        marginTop:"-2%vh",
        zIndex: 0,

    },

    circulo2: {
        height: "80vh",
        width: "50vw",
        borderRadius: "100%",
        background: "#425576",
        marginLeft:"23.1vw",
        marginTop:"62.1vh",
        position:'absolute',
        zIndex: 1,
        clipPath: "inset(0 0 52% 0)",
    },

    quadrado1: {
        marginLeft: "-1.7vw",
        marginTop: 14,
        height: "99vh",
        width: "36.3vw",
        borderRadius: "0%",
        background: "#C7D5E5",
        position:'absolute',
        overflow: "hidden",
    },

    quadrado2: {
        marginTop: 14,
        height: "99vh",
        width: "50.8vw", 
        borderRadius: "0%",
        background: "#425576",
        marginLeft:"33.5vw",
        position:'absolute',
        overflow: "hidden",
    },

    leftsection:{
        width: '48%',
        textalign: 'left',
        fontStyle: 'normal',
        fontSize: "7vh",
        fontWeight: "200",
        position:"absolute",
        color:"#425576",
        zIndex: 3,
    },
    
    rightsection:{
        textAlign: 'right',
        fontStyle: 'normal',
        fontSize: "7vh",
        fontWeight: "200",
        position:"absolute",
        color: '#C7D5E5',
        marginLeft: '54vw',
        marginTop:'2.5%',
        zIndex: 3,
        
    },

    rightsection1:{
        width:"150%",
        textAlign: 'right',
        fontStyle: 'normal',
        fontSize: "7vh",
        fontWeight: "200",
        position:"absolute",
        color: '#C7D5E5',
        marginTop:'10vh',
        marginLeft: '-50%',
        zIndex: 3,
    },

    button1:{
        padding: '10px 20px',
        width: "25vw",
        height: "10vh",
        border: 'none',
        background: '#425576',
        boxshadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        borderradius: '5px',
        cursor: 'pointer',
        fontSize: '4vh',
        borderRadius: "20px",
        color:"#C7D5E5",
        marginTop:"50vh",
        boxShadow: '0.5vh 0.5vh 1vh rgba(0, 0, 0, 0.2)',
    },

    button2:{
        padding: '10px 20px',
        width: "25vw",
        height: "10vh",
        border: 'none',
        background: '#C7D5E5',
        boxshadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        borderradius: '5px',
        cursor: 'pointer',
        fontSize: '4vh',
        borderRadius: "20px",
        color:"#425576",
        marginLeft:"-100%",
        marginTop:"4vh",
        boxShadow: '0.5vh 0.5vh 1vh rgba(0, 0, 0, 0.2)',
    },

};

export default HomePage;