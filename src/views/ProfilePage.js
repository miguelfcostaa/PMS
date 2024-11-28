import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import CampaignBox from '../components/CampaignBox'; 
import axios from 'axios';

function ProfilePage() {
    const [userData, setUserData] = useState(null);
    const [editingField, setEditingField] = useState(null);
    const [updatedData, setUpdatedData] = useState({});
    const [coins, setCoins] = useState([]);
    const [isVerified, setIsVerified] = useState(false);
    const [myCampaigns, setMyCampaigns] = useState([]);
    const [donatedCampaigns, setDonatedCampaigns] = useState([]);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/auth/${userId}`);
                if (response.status === 200) {
                    setUserData(response.data);
                    setCoins(response.data.coins || []);
                    setIsVerified(response.data.role === 'criador/doador');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchCampaigns = async () => {
            const userId = localStorage.getItem('userId');
            const campaignsResponse = await axios.get('http://localhost:5000/api/campaign/all-campaigns');
        
            const userCampaigns = campaignsResponse.data.filter(campaign => campaign.creator === userId);
            setMyCampaigns(userCampaigns);
        
            const userDonatedCampaigns = campaignsResponse.data.filter(campaign =>
                campaign.donators.some(donator => donator.userId === userId)
            );
            setDonatedCampaigns(userDonatedCampaigns);
        };
        
        

        fetchUserData();
        fetchCampaigns();
    }, [userId]);

    const handleEdit = (field) => {
        if (userData) {
            setEditingField(field);
            setUpdatedData({ ...updatedData, [field]: userData[field] || '' });
        }
    };

    const handleSave = async () => {
        try {
            const response = await axios.put(`http://localhost:5000/api/auth/${userId}`, updatedData);
            setUserData({ ...userData, ...response.data });
            setEditingField(null);
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    const handleProfilePictureUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('profilePicture', file);

        try {
            const response = await axios.put(`http://localhost:5000/api/auth/${userId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setUserData({ ...userData, profilePicture: response.data.profilePicture });
        } catch (error) {
            console.error('Error uploading profile picture:', error);
        }
    };

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div style={styles.pageContainer}>
            <NavBar />
            <div style={styles.contentContainer}>
                <SideBar />
                <div style={styles.profileContainer}>
                    {/* Cabeçalho */}
                    <div style={styles.header}>
                        <h1 style={styles.title}>Profile</h1>
                        <div
                            style={{
                                ...styles.verificationStatus,
                                backgroundColor: isVerified ? '#4CAF50' : '#FF0000',
                            }}
                        >
                            {isVerified ? 'Verified' : 'Verifying'}
                        </div>
                    </div>
                    <hr style={styles.separator} />

                    {/* Imagem de perfil e coins */}
                    <div style={styles.profileBody}>
                        <div style={styles.profileLeft}>
                            <div style={styles.profilePicture}>
                                <img
                                    src={
                                        userData?.profilePicture
                                            ? `data:image/png;base64,${userData.profilePicture}`
                                            : '/default-avatar.png'
                                    }
                                    alt="Profile"
                                    style={styles.picture}
                                />
                                <label htmlFor="profilePictureUpload" style={styles.uploadButton}>
                                    +
                                    <input
                                        id="profilePictureUpload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfilePictureUpload}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            </div>
                            <h3 style={styles.coinsTitle}>My Coins</h3>
                            <div style={styles.coinsContainer}>
                                {coins.map((coin, index) => (
                                    <div key={index} style={styles.coinRow}>
                                        <span style={styles.coinAmount}>{coin.amount}</span>
                                        <img
                                            src={`/coin-icons/${coin.campaignId}.png`}
                                            alt="Coin"
                                            style={styles.coinIcon}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Fields */}
                        <div style={styles.profileRight}>
                            {['firstName', 'lastName', 'email', 'password', 'TIN', 'passportNumber', 'IBAN'].map(
                                (field) => (
                                    <div key={field} style={styles.fieldRow}>

                                        <h4 style={styles.label}>
                                            {field.replace(/([A-Z])/, ' $1').trim().toLowerCase().replace(/(^\w|\s\w)/g, (match) => match.toUpperCase())}
                                        </h4>
                                        <div style={styles.inputContainer}>
                                            {editingField === field ? (
                                                <input
                                                    type="text"
                                                    value={updatedData[field]}
                                                    onChange={(e) =>
                                                        setUpdatedData({ ...updatedData, [field]: e.target.value })
                                                    }
                                                    onBlur={handleSave}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                                    style={styles.input}
                                                />
                                            ) : (
                                                <span style={styles.fieldValue}>
                                                    {userData[field] !== undefined && userData[field] !== ''
                                                        ? userData[field]
                                                        : 'Not Provided'}
                                                </span>
                                            )}
                                            <button onClick={() => handleEdit(field)} style={styles.editButton}>
                                                <img 
                                                    src={require('../assets/edit-icon.png')}
                                                    style={styles.editIcon}
                                                    alt="Edit" 
                                                />
                                            </button>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    <hr style={styles.separator} />

                    {/* Minhas campanhas */}
                    <div style={styles.campaignsSection}>
                        <h2 style={styles.sectionTitle}>My Campaigns</h2>
                        <div style={styles.campaignsContainer}>
                            {myCampaigns.length > 0 ? (
                                myCampaigns.map(campaign => (
                                    <div style={styles.campaignShadow}>
                                    <CampaignBox
                                        key={campaign._id}
                                        id={campaign._id}
                                        title={campaign.title}
                                        description={campaign.description}
                                        goal={campaign.goal}
                                        timeToCompleteGoal={campaign.timeToCompleteGoal}
                                        currentAmount={campaign.currentAmount}
                                        nameBankAccount={campaign.nameBankAccount}
                                    />
                                    </div>
                                ))
                            ) : (
                                <p style={styles.noCampaignsMessage}>You haven't created any campaigns yet.</p>
                            )}
                        </div>
                    </div>

                    <hr style={styles.separator} />

                    {/* Campanhas doadas */}
                    <div style={styles.campaignsSection}>
                        <h2 style={styles.sectionTitle}>Campaigns that I Donated</h2>
                        <div style={styles.campaignsContainer}>
                            {donatedCampaigns.length > 0 ? (
                                donatedCampaigns.map(campaign => (
                                    <div style={styles.campaignShadow}>
                                    <CampaignBox
                                        key={campaign._id}
                                        id={campaign._id}
                                        title={campaign.title}
                                        description={campaign.description}
                                        goal={campaign.goal}
                                        timeToCompleteGoal={campaign.timeToCompleteGoal}
                                        currentAmount={campaign.currentAmount}
                                        nameBankAccount={campaign.nameBankAccount}
                                    />
                                    </div>
                                ))
                            ) : (
                                <p style={styles.noCampaignsMessage}>You haven't donated to any campaigns yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    pageContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#f8f9fa',
    },
    contentContainer: {
        display: 'flex',
        marginTop: '12.5vh', // Ajuste para a Navbar
        marginRight: '1vw', // Espaçamento à direita alinhado
    },
    profileContainer: {
        marginLeft: '15%', // Espaçamento da Sidebar
        padding: '2vh 5vw',
        flex: 1,
        borderRadius: '10px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        border: '1px solid #ddd',
        overflowY: 'auto', // Scroll interno se necessário
        maxHeight: 'calc(100vh - 17vh)', // Limitar o tamanho do container para caber na tela
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#333',
    },
    verificationStatus: {
        padding: '1.2vh 2.7vw',
        color: '#fff',
        borderRadius: '30px',
        fontSize: "2vh",
        fontWeight: 'bold',
        textAlign: 'center',
    },
    separator: {
        border: '0',
        height: '1px',
        background: '#A8A8A8',
        margin: '2vh 0',
    },
    profileBody: {
        display: 'flex',
        flexDirection: 'row',
        gap: '1%',
    },
    profileLeft: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start', // Alinha no mesmo eixo que "Profile"
        gap: '2vh',
        margin: '4vh 0',
    },
    profilePicture: {
        position: 'relative',
        width: '15vw',
        height: '15vw',
        borderRadius: '10%', // Mantém bordas arredondadas
        overflow: 'hidden',
        border: '2px solid #ddd',
    },
    picture: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    uploadButton: {
        position: 'absolute',
        top: '-10%',
        right: '-10%',
        backgroundColor: '#007bff',
        color: '#fff',
        borderRadius: '50%',
        border: 'none',
        width: '2.5vw',
        height: '2.5vw',
        cursor: 'pointer',
        fontSize: '1.5rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    coinsContainer: {
        backgroundColor: '#f9f9f9',
        padding: '1.5vw',
        borderRadius: '10px',
        width: '12vw', // Alinhado com o tamanho da foto de perfil
        height: '12.5vw',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    coinsTitle: {
        fontSize: '1.5rem',
        color: '#333',
        fontWeight: 'bold',
        marginTop: '10vh',
    },
    profileRight: {
        flex: 3,
        display: 'flex',
        flexDirection: 'column',
        marginBottom: "7vh",
    },
    fieldRow: {
        display: 'flex',
        flexDirection: 'column',

    },
    label: {
        fontSize: 22,
        font: 'Inter',
        width: '100%',
    },
    inputContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#EFEFEF',
        padding: '1.5vh',
        borderRadius: '1vh',
        boxShadow: '0.5vh 0.5vh 1vh rgba(0, 0, 0, 0.2)',
        fontSize: '2vh',
        outline: 'none',
    },
    input: {
        border: 'none',
        background: '#fff',
        fontSize: '2vh',
        padding: '1vh',
        color: '#333',
        outline: 'none',
        width: '100%',
        borderRadius: '1vh',
    },
    fieldValue: {
        color: '#333',
    },
    editButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#007bff',
        fontSize: '1rem',
        marginLeft: '1vw',
    },

    campaignsSection: {
        marginTop: '7vh',
    },
    sectionTitle: {
        fontSize: '2rem',
        fontWeight: 'bold',
        marginBottom: '4vh',
        color: '#333',
    },
    campaignsContainer: {
        display: 'flex',
        overflowX: 'auto', // Rolagem horizontal
        gap: '2vw', // Espaçamento entre as campanhas
        padding: '1vh 0', // Espaçamento interno para a área de campanhas
    },
    campaignShadow: {
        marginLeft: '1vw',
        boxShadow: '0px 1px 8px 1px rgba(0, 0, 0, 0.25)',
        marginBottom: '7vh',
        borderRadius: 10,
    },
    noCampaignsMessage: {
        fontSize: '1rem',
        color: '#666',
    },
    editIcon: {
        width: '1vw',
        height: '1vw',
    },
};


export default ProfilePage;
