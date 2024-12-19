import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import { useParams } from 'react-router-dom';
import ModalClose from '@mui/joy/ModalClose';
import Drawer from '@mui/joy/Drawer';
import axios from 'axios';
import Modal from 'react-modal';

function CampaignSelectedPage() {
    const { id } = useParams();
    const [campaign, setCampaign] = useState({
        shopItems: [], 
        donators: [],
        coin: { name: '', image: '' }
    });
    
    const [userData, setUserData] = useState({});
    const userId = localStorage.getItem('userId');
    const [coins, setCoins] = useState([]);
    const [open, setOpen] = useState(false);
    const [donationCompleted, setDonationCompleted] = useState(false);
    const [donation, setDonation] = useState({
        name: "",
        amount: "",
        comment: "",
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToBuy, setItemToBuy] = useState(null);
    const [confirmBuy, setConfirmBuy] = useState(false);
    const [isLoading, setIsLoading] = useState(false); 

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/auth/${userId}`);
                if (response.status === 200) {
                    const data = response.data;
                    setUserData(data);
                    setCoins(data.coins || []);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchCampaign = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/campaign/get-campaign/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setCampaign(data ?? { shopItems: [], donators: [], coin: { name: '', image: '' } });
                }
            } catch (err) {
                console.log('Erro de conexão ao servidor:', err);
            }
        };

        fetchUserData();
        fetchCampaign();
    }, [id, isModalOpen, userId]);

    const progressPercentage = Math.round((campaign.currentAmount / campaign.goal) * 100);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDonation({ ...donation, [name]: value });
    };

    

    const handleDonation = async () => {
        if (!donation.amount || isNaN(donation.amount)) {
            alert("Please, enter a valid amount.");
            return;
        }

        if (donation.amount < 1) {
            alert("The minimum donation amount is €1.");
            return;
        }

        if (!userData.paymentMethod || userData.paymentMethod.trim() === "") {
            alert("Please, add a payment method on your profile to donate.");
            return;
        }

        setIsLoading(true); // Desativa o botão enquanto processa a doação

        const newDonation = [
            donation.name || "Anonymous",
            parseFloat(donation.amount),
            donation.comment || ""
        ];

        try {
            const response = await fetch(`http://localhost:5000/api/campaign/donate/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: localStorage.getItem('userId'),
                    donationDetails: newDonation,
                }),
            });

            if (response.ok) {
                const updatedCampaign = await response.json();

                setCampaign((prevCampaign) => ({
                    ...prevCampaign,
                    currentAmount: updatedCampaign?.currentAmount ?? (prevCampaign.currentAmount + parseFloat(donation.amount)),
                    donators: updatedCampaign?.donators || prevCampaign.donators,
                }));

                const userResponse = await axios.get(`http://localhost:5000/api/auth/${userId}`);
                if (userResponse.status === 200) {
                    const data = userResponse.data;
                    setUserData(data);
                    setCoins(data.coins || []);
                }

                setDonationCompleted(true);
                setTimeout(() => setDonationCompleted(false), 500);
                setOpen(false);
                setDonation({ name: "", amount: "", comment: "" });
            } else {
                console.error("Erro ao processar doação:", response.status);
            }
        } catch (error) {
            console.error("Erro de conexão ao servidor:", error);
        } finally {
            setIsLoading(false); // Certifica que o botão é reativado
        }
    };

    
    
    const handleBuyItem = async (item) => {
        // Agora item é um objeto { itemName, itemPrice, itemImage }
        const itemPrice = item?.itemPrice ?? 0; 
        const itemName = item?.itemName ?? ''; 
        const coinName = campaign?.coin?.name || '';
    
        if (!Array.isArray(coins)) {
            alert("Coin list is not loaded yet.");
            return;
        }
    
        const matchingCoin = coins.find((coin) => coin.coinName === coinName);
        if (!matchingCoin || matchingCoin.amount < itemPrice) {
            alert("You don't have enough coins to buy this item.");
            return;
        }
    
        setItemToBuy({ itemName, itemPrice, coinName });
        setIsModalOpen(true);
    };
    
    const confirmPurchase = async () => {
        const { itemPrice, coinName } = itemToBuy;
    
        const response = await axios.put(`http://localhost:5000/api/auth/${userId}/coins`, {
            coinName: coinName,
            amount: -itemPrice, 
        });
    
        if (response.status === 200) {
            try {
                const userResponse = await axios.get(`http://localhost:5000/api/auth/${userId}`);
                if (userResponse.status === 200) {
                    setCoins(userResponse.data.coins || []);
                }
            } catch (error) {
                console.error('Error fetching updated user data:', error);
            }
            setConfirmBuy(true);  
        } else {
            alert("Failed to update your coins. Please try again.");
        }
    };
    
    const cancelPurchase = () => {
        setConfirmBuy(false);
        setIsModalOpen(false);
    }

    function formatAmount(amount) {
        if (amount == null || isNaN(amount)) return '0';
        let formattedAmount = amount.toFixed(1);
        if (formattedAmount.endsWith('.0')) {
            formattedAmount = formattedAmount.slice(0, -2);
        }
        return formattedAmount;
    }
    
        
    function formatLargeAmount(amount) {
        if (amount == null || isNaN(amount)) return '0';
        if (amount >= 1e15) {
            return `${formatAmount(amount / 1e15)}Q`;
        } else if (amount >= 1e12) {
            return `${formatAmount(amount / 1e12)}T`;
        } else if (amount >= 1e9) {
            return `${formatAmount(amount / 1e9)}B`;
        } else if (amount >= 1e6) {
            return `${formatAmount(amount / 1e6)}M`;
        } else if (amount >= 1e3) {
            return `${formatAmount(amount / 1e3)}K`;
        } else {
            return formatAmount(amount);
        }
    }
    

    function handleDisplayContact(contact) {  
        // Verifica se o contato é uma string e se já está formatado como "123 456 789"
        if (typeof contact === 'string' && !/^\d{3} \d{3} \d{3}$/.test(contact)) {
            // Formata o contato se não estiver no formato desejado
            contact = contact.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
        }
        return contact;
    }

    return (
        <>
            <NavBar />
            <SideBar />
            <Modal
                isOpen={isModalOpen}
                onRequestClose={cancelPurchase}
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    },
                    content: {
                        backgroundColor: '#FFF',
                        margin: '10% 30% 20% 30%',
                        padding: '20px',
                        borderRadius: '10px',
                        textAlign: 'center',
                    },
                }}
            >
                { !confirmBuy ? (
                    <>
                        <h2>Are you sure you want to buy this item?</h2>
                        <p style={{fontSize: 24, margin: 20}}> {itemToBuy?.itemName} - Price: {itemToBuy?.itemPrice} </p>
                        <div>
                            <button onClick={confirmPurchase} style={styles.confirmButton}>Confirm</button>
                            <button onClick={cancelPurchase} style={styles.cancelButton}>Cancel</button>
                        </div>
                    </>
                ) : ( 
                    <> 
                        <h2>Item purchased successfully!</h2>
                        <p style={{fontSize: 20, marginTop: '4vh'}}> Your purchase will make a difference in the lives of the campaign beneficiaries, bringing hope and support directly to those in need. </p>
                        <p style={{fontSize: 20}}> Thank You!</p>
                    </>
                )}
            </Modal>
            <div style={styles.mainContent}>
                <div style={styles.container}>
                    <span style={styles.title}>{campaign.title}</span>
                    <div style={styles.imageAndDonate}>
                        <img
                            src={campaign.image ? campaign.image : require('../assets/image.png')}
                            alt="Imagem da campanha"
                            style={styles.image}
                        />
                        <div style={styles.donateBox}>
                            <span style={styles.currentAmount}> € {formatLargeAmount(campaign.currentAmount)} </span>
                            <span style={styles.donated}>of € {formatLargeAmount(campaign.goal)} </span>

                            <div style={styles.progressBar}>
                                <div
                                    style={{
                                        ...styles.progress,
                                        width: `${(Math.min(progressPercentage, 100))}%`,
                                    }}
                                >
                                    {progressPercentage >= 20 && (
                                        <span style={styles.progressNumber}> {formatLargeAmount(Math.round(progressPercentage))}% </span>
                                    )}
                                </div>
                            </div>

                            <div style={styles.timeToGoal}>
                                <span> {formatLargeAmount(campaign.timeToCompleteGoal)} days left </span>
                            </div>
                            <div>
                                <div
                                    style={styles.donateButton}
                                    onClick={() => setOpen(true)}
                                >
                                    <span> Donate Now </span>
                                </div>
                                <Drawer
                                    anchor="right"
                                    size="600px"
                                    open={open}
                                    onClose={() => setOpen(false)}
                                    backdropProps={{ onClick: () => setOpen(false) }}
                                    color="#E8E8E8"
                                >
                                    <ModalClose onClick={() => setOpen(false)} /> 
                                    <div style={styles.drawerContainer}>
                                        <span style={styles.drawerTitle}> Donation </span>

                                        <label style={styles.label}>Name (optional): </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={donation.name}
                                            onChange={(e) => setDonation({ ...donation, name: e.target.value })}
                                            style={styles.input}
                                        />

                                        <label style={styles.label}>Amount: </label>
                                        <input
                                            type="number"
                                            name="amount"
                                            value={donation.amount}
                                            onChange={(e) => setDonation({ ...donation, amount: e.target.value })}
                                            style={styles.input}
                                            required
                                        />

                                        <label style={styles.label}>Message (optional): </label>
                                        <textarea
                                            name="comment"
                                            value={donation.comment}
                                            onChange={(e) => setDonation({ ...donation, comment: e.target.value })}
                                            style={styles.textArea}
                                            required
                                        />

                                        <label style={styles.label}>Payment Method: </label>
                                        <input
                                            type="text"
                                            name="paymentMethod"
                                            value={userData.paymentMethod || ''}
                                            style={styles.input}
                                            disabled
                                        />

                                        <button
                                            type="button"
                                            onClick={handleDonation}
                                            style={{
                                                ...styles.donationButton,
                                                backgroundColor: isLoading ? '#A9A9A9' : styles.donationButton.backgroundColor,
                                                cursor: isLoading ? 'not-allowed' : 'pointer'
                                            }}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'A processar...' : 'Doar'}
                                        </button>


                                        {donationCompleted && (
                                            <span style={styles.donationCompleted}>
                                                Donation completed!
                                            </span>
                                        )}
                                    </div>
                                </Drawer>
                            </div>
                            <div style={styles.shareCampaign}>
                                <span> Share Campaign </span>
                            </div>
                        </div>
                    </div>
                    <div style={styles.contactAndDonationsFlex}>
                        <div style={styles.contactAndOther}>
                            <div style={styles.contactAndCategory}>
                                <div style={styles.contact}>
                                    <span> Contact Details: {handleDisplayContact(campaign.contact)} </span>
                                </div>
                                <div style={styles.category}>
                                    <span> {campaign.category} </span>
                                </div>
                            </div>

                            <div style={styles.line}></div>

                            <div style={styles.personInfo}>
                            <img
                                src={campaign.creator && campaign.creator.profilePicture 
                                    ? `data:image/jpeg;base64,${campaign.creator.profilePicture}`
                                    : require('../assets/image.png')}
                                alt="Creator Image"
                                style={styles.personImage}
                            />

                            <div style={styles.namePerson}>
                                <span> Created by: </span>
                                <span>
                                {campaign.creator 
                                    ? `${campaign.creator.firstName} ${campaign.creator.lastName}` 
                                    : campaign.nameBankAccount}
                                </span>
                            </div>

                            </div>

                            <div style={styles.description}>
                                <span> Description </span>
                            </div>

                            <div style={styles.lines}>
                                <div style={styles.line1}></div>
                                <div style={styles.line2}></div>
                            </div>

                            <div style={styles.descriptionText}>
                                <span> {campaign.description} </span>
                            </div>
                        </div>

                        <div style={styles.donationsBox}>
                            <span style={styles.donationsTitle}> Donations </span>
                            <div style={styles.donatorsFlex}>
                            {campaign.donators && campaign.donators.length > 0 ? (
                                campaign.donators.map((donater, index) => (
                                    <div key={index} style={styles.donators}>
                                        <div style={styles.nameAndComment}>
                                            <span style={styles.donaterName}>
                                                {donater?.donationDetails?.[0] || 'Anonymous'}
                                            </span>
                                            <span style={styles.donaterComment}>
                                                {donater?.donationDetails?.[2] || ''}
                                            </span>
                                        </div>
                                        <div style={styles.ammountDonated}>
                                            <span> € {formatLargeAmount(donater?.donationDetails?.[1]) || '0'} </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={styles.donatorsFlex}>
                                    <span style={{ fontSize: 18, opacity: 0.6 }}>
                                        No donations made yet.
                                    </span>
                                </div>
                            )}
                            </div>
                        </div>
                    </div>
                </div>

                <div style={styles.shopTitle}>
                    <span> Campaign Store </span>
                </div>                
                <div style={styles.shopContainerFlex}>
                    <div style={styles.currentCoins}>
                        <span style={styles.coinsText}>
                            <b>You have: </b> 
                            {Array.isArray(coins) && coins.length > 0 
                                ? coins.find((coin) => coin.coinName === campaign?.coin?.name)?.amount || 0 
                                : 0}
                        </span>
                        {coins.length > 0 && campaign.coin && campaign.coin.name && (
                            <div style={styles.coinCircle}>
                                <img 
                                    src={campaign.coin.image} 
                                    alt={`${campaign.coin.name} coin`} 
                                    style={styles.coinImage} 
                                />
                            </div>
                        )}
                    </div>

                    <div style={styles.shopContainer}>
                        {Array.isArray(campaign?.shopItems) && campaign.shopItems.length > 0 ? (
                            campaign.shopItems.map((item, index) => {
                                return (
                                    <div key={index} style={styles.shopItemBox}>
                                        <img 
                                            src={item?.itemImage ? item.itemImage : require('../assets/image.png')} 
                                            alt="Imagem do item" 
                                            style={styles.shopItemImage} 
                                        />
                                        
                                        <div style={styles.shopItemName}>
                                            <span> {item.itemName || 'Unknown Item'} </span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '2vh'}}>
                                            <span style={styles.shopItemPrice}> {item.itemPrice ?? 0} </span>
                                            {coins.length > 0 && campaign.coin && campaign.coin.name && (
                                                <div style={styles.coinCircle}>
                                                    <img 
                                                        src={campaign.coin.image} 
                                                        alt={`${campaign.coin.name} coin`} 
                                                        style={styles.coinImage} 
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            style={styles.buyButton}
                                            onClick={() => handleBuyItem(item)}
                                        >
                                            Buy
                                        </button>
                                    </div>
                                );
                            })
                        ) : (
                            <div style={styles.shopItemBox}>
                                <span> No items available in the store. </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
           
        </>
    );
}

const styles = {
    mainContent: {
        marginTop: '13.5vh',
        marginLeft: '15%',
        marginRight: '5vh',
        paddingLeft: '2vh',
        font: 'Inter',
    },
    container: {
        backgroundColor: "#FFFFFF",
        borderRadius: '2vh',
        paddingLeft: '2.5vh',
        width: "100%",
        height: "100%",
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '2vh',
    },
    title: {
        fontSize: "5.4vh",
        fontWeight: 'regular',
        font: 'Inter',
        color: '#000000',
        paddingTop: '2.3vh',
        paddingLeft: '2.3vh',
        paddingRight: '2.3vh',
        textAlign: 'justify',
    },
    imageAndDonate: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: '2vh',
        marginLeft: '2.3vh',
    },
    image: {
        width: "55%",
        height: '55vh',
        maxWidth: "55%",
        maxHeight: '52.2vh',
        borderRadius: '1vh',
    },
    donateBox: {
        width: "35%",
        height: '49vh',
        backgroundColor: '#FFFFFF',
        borderRadius: '2vh',
        boxShadow: "4px 4px 36.5px 3px rgba(0, 0, 0, 0.25)",
        justifyContent: 'flex-end',
        marginLeft: '5.5vh',
        paddingLeft: '3.5vh',
        paddingRight: '3vh',
        paddingTop: '3.2vh',
    },
    currentAmount: {
        fontSize: '5.3vh',
        font: 'Inter',
        color: '#000000',
    },
    donated: {
        fontSize: '5.3vh',
        fontWeight: 'light',
        font: 'Inter',
        color: '#000000',
        opacity: 0.6,
    },
    progressBar: {
        width: '100%',
        height: '6vh',
        backgroundColor: '#D9D9D9',
        marginTop: '1vh',
    },
    progress: {
        height: '100%',
        backgroundColor: '#22C643',
    },
    progressNumber: {
        fontSize: "2.7vh",
        font: 'Inter',
        color: '#fff',
        fontWeight: 'bold',
        paddingRight: '1.2vh',
        paddingTop: '1vh',
        display: 'flex',
        textAlign: 'end',
        alignContent: 'center',
        justifyContent: 'flex-end',
    },
    timeToGoal: {
        fontSize: '2.3vh',
        font: 'Inter',
        color: '#000000',
        paddingTop: '1.2vh',
    },
    donateButton: {
        backgroundColor: '#F8B422',
        width: '100%',
        height: '9vh',
        borderRadius: '2vh',
        marginTop: '6.5vh',
        fontSize: '3.5vh',
        font: 'Inter',
        textAlign: 'center',
        alignContent: 'center',
        cursor: 'pointer',
    },
    shareCampaign: {
        backgroundColor: '#F8B422',
        width: '100%',
        height: '9vh',
        borderRadius: '2vh',
        marginTop: '2vh',
        fontSize: '3.5vh',
        font: 'Inter',
        textAlign: 'center',
        cursor: 'pointer',
        alignContent: 'center',
    },
    contactAndCategory: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    contact: {
        font: 'Inter',
        fontSize: '2.6vh',
        color: '#000000',
        marginLeft: '2.1vh',
        alignContent: 'center',
        justifyContent: 'flex-start',
    },
    category: {
        width: 'fit-content',
        height: '2.5vh',
        backgroundColor: '#057CEC',
        color: 'white',
        fontSize: '1.9vh',
        font: 'Inter',
        fontWeight: 'bold',
        paddingLeft: '3.1vh',
        paddingRight: '3.1vh',
        paddingTop: '1vh',
        paddingBottom: '1vh',
        borderRadius: '2.2vh',
        justifyContent: 'flex-end',
        marginRight: '2vh',
    },
    line: {
        borderBottom: '1px solid #000',
        marginBottom: '1vh',
        marginLeft: '2vh',
        marginTop: '2.2vh',
        width: '97%',
        opacity: 0.2,
    },
    line2: {
        borderBottom: '1px solid #000',
        marginBottom: '1.1vh',
        marginTop: "1vh",
        width: '97%',
        opacity: 0.2,
    },
    line1: {
        borderBottom: '2px solid #159A1A',
        marginBottom: '1vh',
        marginLeft: '2vh',
        marginTop: '1vh',
        width: '30%',
    },
    lines: {
        display: 'flex',
        flexDirection: 'row',
    },
    contactAndDonationsFlex: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: '2vh',
        marginLeft: '2.2vh',
    },
    contactAndOther: {
        width: "55%",
    },
    personInfo: {
        display: 'flex',
        flexDirection: 'row',
        marginLeft: '2.2vh',
        marginTop: '2.2vh',
    },
    personImage: {
        width: '6.5vh',
        height: '6.5vh',
        borderRadius: '5vh',
    },
    namePerson: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: '2.2vh',
        justifyContent: 'center',
        alignContent: 'center',
    },
    description: {
        fontSize: '3vh',
        font: 'Inter',
        color: '#000000',
        marginTop: '4vh',
        marginLeft: '5vh',
    },
    descriptionText: {
        fontSize: '1.8vh',
        font: 'Inter',
        color: '#000000',
        marginTop: '2vh',
        marginLeft: '2vh',
        maxHeight: '30vh',
        overflow: 'auto',
        textOverflow: 'ellipsis',
        textAlign: 'justify',
        paddingRight: '2vh',
        paddingBottom: '2vh',
    },
    donationsBox: {
        width: "35%",	
        height: '48vh',
        backgroundColor: '#FFFFFF',
        borderRadius: '2vh',
        boxShadow: "4px 4px 36.5px 3px rgba(0, 0, 0, 0.25)",
        justifyContent: 'flex-end',
        marginLeft: '5.5vh',
        paddingLeft: '3vh',
        paddingRight: '3.3vh',
        paddingTop: '3.2vh',
        paddingBottom: '2vh',
        marginBottom: '3.5vh',
        overflow: 'auto',
    },
    donationsTitle: {
        fontSize: '3.3vh',
        font: 'Inter',
    },
    donatorsFlex: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: '2.2vh',
    },
    donators: {
        display: 'flex',
        flexDirection: 'row',
        margin: '2.2vh',
    },
    nameAndComment: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        width: '80%',
    },
    donaterName: {
        fontSize: '2.2vh',
        font: 'Inter',
        color: '#000000',
    },
    donaterComment: {
        fontSize: '1.75vh',
        font: 'Inter',
        color: '#000000',
        opacity: 0.6,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
    },
    ammountDonated: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        textAlign: 'end',
        width: '20%',
        fontSize: '2.5vh',
        font: 'Inter',
        color: '#666666',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
    },
    drawerContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '75vh',
        marginTop: "8vh",
        marginRight: "10vh",
        marginLeft: "5vh",
    },
    drawerTitle: {
        fontSize: '4.4vh',
        font: 'Inter',
        fontWeight: 'bold',
        marginBottom: '2vh',
    },
    label: {
        marginTop: '1vh',
        fontSize: '2.6vh',
        font: 'Inter',
        width: '90%',
    },
    input: {
        width: '100%',
        marginTop: '1vh',
        padding: '1.5vh',
        fontSize: '2vh',
        borderRadius: '1vh',
        border: 'none',
        backgroundColor: '#EFEFEF',
        outline: 'none',
        boxShadow: '0.5vh 0.5vh 1vh rgba(0, 0, 0, 0.2)',
        marginBottom: '2.2vh',
    },
    textArea: {
        width: '100%',
        height: '15vh',
        resize: 'none',
        marginTop: '1vh',
        padding: '1.5vh',
        fontSize: '2vh',
        borderRadius: '1vh',
        border: 'none',
        backgroundColor: '#EFEFEF',
        outline: 'none',
        boxShadow: '0.5vh 0.5vh 1vh rgba(0, 0, 0, 0.2)',
        marginBottom: '2.2vh',
    },
    donationButton: {
        width: '50%',
        height: '6vh',
        backgroundColor:'#009DFF', 
        padding: '1vh 2vh',
        color: '#fff',
        border: 'none',
        borderRadius: '1.6vh',
        fontSize: '2.5vh',
        font: 'Inter',
        fontWeight: 'bold',
        marginTop: '4.3vh',
    },
    donationCompleted: {
        fontSize: '2.2vh',
        font: 'Inter',
        color: '#39AE39',
        marginTop: '1vh',
        marginLeft: 80,
    },
    shopTitle: {
        fontSize: '4.5vh',
        font: 'Inter',
        fontWeight: 'bold',
        color: '#000000',
        paddingTop: '4vh',
        paddingBottom: '2vh',
    },
    shopContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignContent: 'center',
        alignItems: 'center',
        gap: '4.3vh',	
        padding: '2vh',
    },
    shopContainerFlex: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        width: "101%",
        height: "100%",
        marginBottom: '4vh',
    },
    currentCoins: {
        fontSize: '3vh',
        font: 'Inter',  
        color: '#000000',
        paddingTop: '2vh',
        paddingLeft: '2vh',
        display: 'flex', 
        alignItems: 'center', 
    },
    coinsText: {
        marginLeft: '1vh',
        marginRight: '1vh',  
    },
    shopItemBox: {
        width: "30vh",	
        height: "40vh",
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        boxShadow: "4px 4px 36.5px 3px rgba(0, 0, 0, 0.25)",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    shopItemImage: {
        width: "12vh",
        height: "12vh",
        borderRadius: 100,
    },
    shopItemName: {
        fontSize: '3vh',
        font: 'Inter',
        color: '#000000',
        marginTop: '1vh',
        textAlign: 'center',
        maxHeight: '5vh',
        maxWidth: '25vh',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
    },
    shopItemPrice: {
        fontSize: '3vh',
        font: 'Inter',
        color: '#000000',
        marginRight: '1vh',
    },
    coinCircle: {
        width: '2.2vw',
        height: '2.2vw',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#FFAD00',
    },
    coinImage: {
        width: '80%',
        height: '80%',
        borderRadius: '50%',
        objectFit: 'cover',
    },
    buyButton: {
        width: '50%',
        height: '6vh',
        backgroundColor: '#009DFF',
        padding: '1vh 2vh',
        color: '#fff',
        border: 'none',
        borderRadius: '1.5vh',
        fontSize: '2.4vh',
        font: 'Inter',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '2vh',
    },
    confirmButton: {
        width: '20%',
        backgroundColor: '#009DFF',
        padding: '1vh 1vh',
        color: '#fff',
        border: 'none',
        borderRadius: '1vh',
        fontSize: '2.3vh',
        font: 'Inter',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginRight: '2vh',
    },
    cancelButton: {
        width: '20%',
        backgroundColor: '#FF0000',
        padding: '1vh 1vh',
        color: '#fff',
        border: 'none',
        borderRadius: '1vh',
        justifyContent: 'center',
        alignContent: 'center',
        fontSize: '2.3vh',
        font: 'Inter',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
};

export default CampaignSelectedPage;
