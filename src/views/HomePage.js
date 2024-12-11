import React, { useState, useEffect }  from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import CampaignBox from '../components/CampaignBox';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
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
    }, []);

    const navigate = useNavigate();

    const handleCampaignClick = (id) => {
        navigate(`/campaign/${id}`); // Redireciona para a página da campanha com o ID
    };
    
    return (
        <>                    
        <NavBar  />       
        
            <div style={styles.mainContent}>
                <div style={styles.container}>
                    <div style={styles.quadrado2}> </div>                    
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

                <div style={styles.botcontainer}>
                    <p style={{fontSize: '64px', textAlign: 'center',}}><b>POPULAR CAMPAIGNS</b></p>
                    <div style={styles.campaignDisplay} >
                            <div onClick={() => handleCampaignClick(campaigns._id)} style={{display:'flex', gap:'3%'}}>
                                <CampaignBox style={styles.campanha}
                                    key="123"
                                    title="123"
                                    description="123"
                                    goal="123"
                                    timeToCompleteGoal="123"
                                    currentAmount="123"
                                    nameBankAccount="123"
                                />      
                                <CampaignBox style={styles.campanha}
                                    key= '123'
                                    title="123"
                                    description="123"
                                    goal="123"
                                    timeToCompleteGoal="123"
                                    currentAmount="123"
                                    nameBankAccount="123"
                                />   
                                <CampaignBox style={styles.campanha}
                                    key="123"
                                    title="123"
                                    description="123"
                                    goal="123"
                                    timeToCompleteGoal="123"
                                    currentAmount="123"
                                    nameBankAccount="123"
                                />   
                            </div>
                    </div>
                </div>     
                </div>

                
            </div>
            
        <SideBar  />
        </>
    );
}

const styles = {
    
    campanha:{
        flex:'auto',
        marginLeft: '5%',
        height: '100%',
        background: '#FFFFFF',
        borderRadius: '10px',
    },

    campaignDisplay: {
        marginLeft:'3vw',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        background: "#D9D9D9",
        width:'93%',
        overflowX: 'auto',
    },

    mainContent: {
        marginTop: '5vh',
        marginLeft: '14.75vw',
        paddingLeft: '0px',
        font: 'Inter',
        overflowX:'hidden'
    },
    
    botcontainer: {
        marginTop:"100vh",
        marginLeft:"-1.7vw",
        width: "86vw",
        height: "150vh",
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 40,        
        position:'absolute',
        background: "#D9D9D9",
    },

    container: {
        paddingLeft: '20px',
        width: "80vw",
        height: "100%",
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 40,        
        position:'absolute'
    },

    circulo1: {
        height: "70vh",
        width: "30vw",
        borderRadius: "100%",
        background: "#C7D5E5",
        marginLeft:"15vw",
        marginTop:"-2%vh",
        position:'absolute',
        zindex:30
    },

    circulo2: {
        height: "80vh",
        width: "50vw",
        borderRadius: "100%",
        background: "#425576",
        marginLeft:"23.1vw",
        marginTop:"62.1vh",
        position:'absolute',
        zindex:30
    },

    quadrado1: {
        marginLeft: "-1.7vw",
        marginTop: 14,
        height: "99vh",
        width: "36.3vw",
        borderRadius: "0%",
        background: "#C7D5E5",
        position:'absolute',
    },

    quadrado2: {
        marginTop: 14,
        height: "99vh",
        width: "50.8vw", //1009
        borderRadius: "0%",
        background: "#425576",
        marginLeft:"33.5vw",
        position:'absolute',
    },

    leftsection:{
        width: '48%',
        textalign: 'left',
        fontStyle: 'normal',
        fontSize: "7vh",
        fontWeight: "200",
        position:"absolute",
        color:"#425576"
    },
    
    rightsection:{
        textAlign: 'right',
        fontStyle: 'normal',
        fontSize: "7vh",
        fontWeight: "200",
        position:"absolute",
        color: '#C7D5E5',
        marginLeft: '57vw',
        marginTop:'2.5%',
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
        marginLeft: '-50%'
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