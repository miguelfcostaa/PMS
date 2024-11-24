import React, { useState } from 'react';
import NavBar from '../components/NavBar';

function CreateCampaignPage() {
    const userId = localStorage.getItem('userId');

    const [parte1, setParte1] = useState(true);
    const [parte2, setParte2] = useState(false);
    const [parte3, setParte3] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        description: '',
        goal: '',
        timeToCompleteGoal: '',
        contact: '',
        nameBankAccount: '',
        bankAccount: '',
        category: '',
        currentAmount: 0,
        image: '',
        donators: [],
        shopItems: [],
        coin: ['', ''],
    });
    const [newShopItem, setNewShopItem] = useState({
        itemName: "",
        itemPrice: "",
        itemImage: "",
    });


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const numericFields = ['goal', 'timeToCompleteGoal', 'bankAccount'];
        setFormData({
            ...formData,
            [name]: numericFields.includes(name) ? Number(value) : value,
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Validação de campos obrigatórios
        if (parte1) {
            if (!formData.title || !formData.description || !formData.goal || !formData.timeToCompleteGoal || !formData.contact || !formData.nameBankAccount || !formData.bankAccount || !formData.category) {
                alert('Please fill in all required fields.');
                return;
            }
    
            if (formData.goal <= 0) {
                alert('Goal must be a positive number.');
                return;
            }
    
            if (formData.timeToCompleteGoal <= 0) {
                alert('Time to complete goal must be a positive number.');
                return;
            }

            if (!formData.coin[0] || !formData.coin[1]) {
                alert('Please provide both a name and an image for the campaign coin.');
                return;
            }

    
            // Passa para a próxima parte do formulário
            setParte1(false);
            setParte2(true);
            setParte3(false);
        } 
        else if (parte2) {
            try {
    
                // Prepara os dados finais para envio
                const finalData = { 
                    ...formData, 
                    shopItems: formData.shopItems, // Inclui os itens da loja
                    creator: localStorage.getItem('userId'), // Adiciona o criador automaticamente
                    coin: formData.coin, // Inclui a moeda
                };
    
                console.log("Data being sent to the server:", finalData); // Verifica os dados
    
                // Envia os dados para o backend
                const response = await fetch('http://localhost:5000/api/campaign/create-campaign', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Certifique-se de que o token está armazenado
                    },
                    body: JSON.stringify(finalData),
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Error creating campaign:", errorData);
                    alert(errorData.error || "Failed to create campaign");
                    return;
                }
    
                alert('Campaign created successfully!');
                setParte1(false);
                setParte2(false);
                setParte3(true); // Avança para a terceira parte
            } catch (err) {
                console.error("Unexpected error creating campaign:", err.message);
                alert('Unexpected error creating campaign.');
            }
        }
    };
    

    const handleInputChangeStore = (e) => {
        const { name, value } = e.target;

        const numericFields = ['itemPrice'];
        setNewShopItem({
            ...newShopItem,
            [name]: numericFields.includes(name) ? Number(value) : value,
        });

    };

    const handleAddShopItems = () => {
        if (newShopItem.itemName && newShopItem.itemPrice) {
            setFormData({
                ...formData,
                shopItems: [
                    ...formData.shopItems, 
                    [newShopItem.itemName, newShopItem.itemPrice, newShopItem.itemImage || ''],
                ],
            });
        }
    };


    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            convertFileToBase64(file).then((base64) => {
                if (type === 'campaign') {
                    setFormData({ ...formData, image: base64 });
                } else if (type === 'coin') {
                    const newCoin = [...formData.coin];
                    newCoin[1] = base64;
                    setFormData({ ...formData, coin: newCoin });
                }
            }).catch((err) => console.error("Error converting file to Base64:", err));
        }
    };


    // Converter ficheiro para Base64
    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };
    

    return (
        <>
            <NavBar />
            <div style={styles.sidePage}>
                <span style={styles.startJourney}> Start Your <br /> Journey To <br /></span>
                <span style={styles.changeLifes}> CHANGE LIVES <br /></span>
                <span style={styles.creatingHope}> Creating <b>Hope,</b> <br /></span>
                <span style={styles.inspiringAction}> Inspiring <b>Action!</b></span>
            </div>
            <div style={styles.mainContent}>
                <>
                    <div style={styles.form}>
                        <form onSubmit={handleSubmit}>
                            { parte1 && (
                            <>
                            <h1>About the Cause</h1>
                            {/* Title and Category */}
                            <div style={styles.rowContainer}>
                                <div style={styles.inputHalf}>
                                    <label style={styles.label}>Title:</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                        required
                                    />
                                </div>
                                
                                <div style={styles.inputHalf}>
                                    <label style={styles.label}>Category:</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        style={styles.inputDropdown}
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        <option value="Health"> Health </option>
                                        <option value="Animals"> Animals </option>
                                        <option value="Environment"> Environment </option>
                                        <option value="Education"> Education </option>
                                        <option value="Children"> Children </option>
                                        <option value="Human Rights"> Human Rights </option>
                                        <option value="Food Security"> Food Security </option>
                                        <option value="Social Justice"> Social Justice </option>
                                        <option value="Natural Disasters"> Natural Disasters </option>
                                    </select>
                                </div>
                            </div>

                            {/* Description */}
                            <div style={styles.inputContainer}>
                                <label style={styles.label}>Talk about your cause:</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    style={styles.textArea}
                                    required
                                />
                            </div>
                            
                            {/* Category and Goal */}
                            <div style={styles.rowContainer}>
                                <div style={styles.inputHalf}>
                                    <label style={styles.label}>Goal (€):</label>
                                    <input
                                        type="number"
                                        name="goal"
                                        value={formData.goal}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                        required
                                    />
                                </div>
                                <div style={styles.inputHalf}>
                                    <label style={styles.label}>Time to Complete (days):</label>
                                    <input
                                        type="number"
                                        name="timeToCompleteGoal"
                                        value={formData.timeToCompleteGoal}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                        required
                                    />
                                </div>
                            </div>


                            {/* Contact */}
                            <div style={styles.inputContainer}>
                                <label style={styles.label}>Contact:</label>
                                <input
                                    type="text"
                                    name="contact"
                                    value={formData.contact}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    required
                                />
                            </div>

                            <h1>Bank Details</h1>
                            {/* Bank Account */}
                            <div style={styles.rowContainer}>
                                <div style={styles.inputHalf}>
                                    <label style={styles.label}>Name:</label>
                                    <input
                                        type="text"
                                        name="nameBankAccount"
                                        value={formData.nameBankAccount}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                        required
                                    />
                                </div>
                                <div style={styles.inputHalf}>
                                    <label style={styles.label}>IBAN:</label>
                                    <input
                                        type="number"
                                        name="bankAccount"
                                        value={formData.bankAccount}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                        required

                                    />
                                </div>
                            </div>


                            <h1>Media</h1>
                            {/* Campaign Image */}
                            <div style={styles.rowContainer}>
                                <div style={styles.inputHalf}>
                                    <label style={styles.label}>Campaign Image:</label>
                                    <div style={styles.inputImage} onClick={() => document.getElementById('campaignFileInput').click()}>
                                        {formData.image ? (
                                            <img
                                                src={formData.image}
                                                alt="Campaign"
                                                style={{ maxWidth: '50%', maxHeight: '140px' }}
                                            />
                                        ) : (
                                            <>
                                                <img 
                                                    src={require('../assets/upload-icon.png')} 
                                                    alt="Upload Icon" 
                                                    style={styles.uploadIcon} 
                                                />
                                                <span style={styles.uploadTextPrimary}>Upload File</span>
                                            </>
                                        )}
                                        {formData.image && (
                                            <button onClick={() => setFormData({ ...formData, image: null })} style={styles.removeButton}>
                                                x
                                            </button>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        id="campaignFileInput"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'campaign')}
                                        style={styles.inputfile}
                                    />
                                </div>

                                {/* Imagem da Moeda */}
                                <div style={styles.inputHalf}>
                                    <label style={styles.label}>Coin Name:</label>
                                    <input
                                        type="text"
                                        name="coinName"
                                        value={formData.coin[0]}
                                        onChange={(e) => {
                                            const newCoin = [...formData.coin];
                                            newCoin[0] = e.target.value;
                                            setFormData({ ...formData, coin: newCoin });
                                        }}
                                        style={styles.input}
                                        required
                                    />
                                    <label style={styles.label}>Coin Image:</label>
                                    <div style={styles.inputCoinImage} onClick={() => document.getElementById('coinFileInput').click()}>
                                        {formData.coin[1] ? (
                                            <img
                                                src={formData.coin[1]}
                                                alt="Coin"
                                                style={{ maxWidth: '50%', maxHeight: '140px' }}
                                            />
                                        ) : (
                                            <>
                                                <img 
                                                    src={require('../assets/upload-icon.png')} 
                                                    alt="Upload Icon" 
                                                    style={styles.uploadIcon} 
                                                />
                                                <span style={styles.uploadTextPrimary}>Upload Coin Image</span>
                                            </>
                                        )}
                                        {formData.coin[1] && (
                                            <button onClick={() => {
                                                const newCoin = [...formData.coin];
                                                newCoin[1] = null;
                                                setFormData({ ...formData, coin: newCoin });
                                                }} 
                                                style={styles.removeButton}
                                            >
                                                    x
                                            </button>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        id="coinFileInput"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'coin')}
                                        style={styles.inputfile}
                                    />
                                </div>
                            </div>

                            <button type="submit" style={styles.submitButton}>
                                Next
                            </button>
                            

                            </>   
                            )}
                            { parte2 && (
                            <>
                            <h1>Campaign Store</h1>

                            <span style={{ fontSize: 20, font: 'Inter', width: '100%', opacity: 0.7 }}>Here, you can choose which items you want donators to purchase.</span>
                            <br></ br>
                            <br></ br>
                            <div style={styles.rowContainer}>
                                <div style={styles.inputHalfItem}>
                                    <label style={styles.label}>Item name:</label>
                                    <input
                                        type="text"
                                        name="itemName"
                                        value={newShopItem.itemName}
                                        onChange={handleInputChangeStore}
                                        style={styles.input}
                                    />
                                </div>
                                <div style={styles.inputHalfPrice}>
                                    <label style={styles.label}>Price:</label>
                                    <input
                                        type="number"
                                        name="itemPrice"
                                        value={newShopItem.itemPrice}
                                        onChange={handleInputChangeStore}
                                        style={styles.input}
                                    />
                                </div>
                                <div style={styles.inputHalfSend}>
                                    <div style={styles.addButton} onClick={handleAddShopItems}>
                                        <img 
                                            src={require('../assets/plus-icon-simple.png')} 
                                            alt="Plus Icon" 
                                            style={styles.plusIcon} 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={styles.inputContainer}>
                                    <label style={styles.label}>
                                        Item Image:
                                    </label>
                                    <div style={styles.inputImage}>
                                    {/*<div style={styles.inputImage} onClick={handleClick}>
                                        {selectedFiles.length > 0 ? (
                                            <img
                                                src={URL.createObjectURL(selectedFiles[0])}
                                                alt="Selected"
                                                style={{ maxWidth: '50%', maxHeight: '140' }}
                                            />
                                        ) : (*/}
                                            <>
                                                <img 
                                                    src={require('../assets/upload-icon.png')} 
                                                    alt="Upload Icon" 
                                                    style={styles.uploadIcon} 
                                                />
                                                <span style={styles.uploadTextPrimary}>Upload File</span><br />

                                            </>
                                        {/*)}
                                    {selectedFiles.length > 0 && (
                                        <button onClick={() => setSelectedFiles([])} style={styles.removeButton}>
                                            x
                                        </button>
                                    )}
                                    </div>
                                    <input
                                        type="file"
                                        id="fileInput"
                                        value={newShopItem.itemImage}
                                        onChange={handleFileChange}
                                        style={styles.inputfile}
                                        accept="image/*" // Aceitar apenas imagens
                                        multiple={false} // Apenas um ficheiro permitido
                                    />*/}
                                    </div>
                            </div>

                            <h1>List of Items</h1>
                            <div style={styles.listOfItems}>
                                {formData.shopItems.length === 0 ? (
                                    <p>Nenhum item adicionado à loja ainda.</p>
                                ) : (
                                    <ul>
                                        {formData.shopItems.map(([name, price, image], index) => (
                                            <li key={index} style={{ display: "flex", alignItems: "center", justifyContent: 'flex-start', marginBottom: "10px",  fontSize: "2vh" }}>
                                                <span style={{ marginLeft: "1vh", fontSize: "3vh", textAlign: 'center'}}> {name} </span>
                                                <span style={{ marginLeft: "1vh", fontSize: "3vh" }}> {price}€ </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div style={styles.buttonsFlex}>
                                <button type="button" onClick={() => { setParte1(true); setParte2(false); }} style={styles.backButton} >
                                    Back
                                </button>
                                
                            
                                <button type="submit" style={styles.submitButton} >
                                    Finish
                                </button>
                            </div>
                            </>
                            )}
                        </form>  

                        
                        { parte3 && (
                            <>
                                <h1> Campaign Created Successfully! </h1>
                                <p style={{ fontSize: 24, font: 'Inter', width: '60%', paddingTop: 20}}> Your campaign has been successfully created! To make any edits, click on your profile, select your campaign, and choose the "Edit" option. </p>
                                <p style={{ fontSize: 24, font: 'Inter', width: '60%' }}> If you have any questions, feel free to contact us. </p>
                                <p style={{ fontSize: 24, font: 'Inter', width: '60%' }}> Best regards, </p>
                                <p style={{ fontSize: 24, font: 'Inter', width: '60%' }}>The Worth+ Team </p>

                                <a href="/campaign" style={{ fontSize: 24, font: 'Inter', color: '#26A300', marginTop: 20 }}> Go back to campaigns </a>
                            </>
                        )}
                    </div>
                </>
            </div>
        </>
    )
}


const styles = {
    mainContent: {
        marginTop: 122,
        marginLeft: '32%',
        paddingLeft: '20px',
        font: 'Inter',
    },
    sidePage: {
        position: 'fixed',
        top: 97,
        left: 0,
        width: '30%',
        height: '100%',
        backgroundColor: '#C7D5E5',
        display: 'flex',
        flexDirection: 'column',
    },
    startJourney: {
        fontSize: 40,
        fontWeight: 'light',
        font: 'Inter',
        paddingLeft: '40px',
        paddingTop: '100px',
    },
    changeLifes: {
        fontSize: 40,
        fontWeight: 'bold',
        font: 'Inter',
        paddingTop: '20px',
        paddingRight: '60px',
        textAlign: 'end',
    },
    creatingHope: {
        fontSize: 40,
        fontWeight: 'light',
        font: 'Inter',
        paddingLeft: '40px',
        paddingTop: '200px',
    },
    inspiringAction: {
        fontSize: 40,
        fontWeight: 'light',
        font: 'Inter',
        paddingLeft: '40px',
        paddingTop: '10px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '70%',
    },
    label: {
        fontSize: 22,
        font: 'Inter',
        width: '100%',
    },
    input: {
        width: '100%',
        marginTop: 10,
        padding: '1.5vh',
        fontSize: '2vh',
        borderRadius: '1vh',
        border: 'none',
        backgroundColor: '#EFEFEF',
        outline: 'none',
        boxShadow: '0.5vh 0.5vh 1vh rgba(0, 0, 0, 0.2)',
        marginBottom: 20,
    },
    rowContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
    },
    inputHalf: {
        width: '47%',
    },
    inputContainer: {
        marginBottom: 10,
    },
    textArea: {
        width: '100%',
        height: '180px',
        resize: 'none',
        marginTop: 10,
        padding: '1.5vh',
        fontSize: '2vh',
        borderRadius: '1vh',
        border: 'none',
        backgroundColor: '#EFEFEF',
        outline: 'none',
        boxShadow: '0.5vh 0.5vh 1vh rgba(0, 0, 0, 0.2)',
    },
    inputImage: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 250,
        marginTop: 10,
        paddingTop: '50px',
        paddingBottom: '50px',
        fontSize: '2vh',
        borderRadius: '1vh',
        border: 'none',
        backgroundColor: '#EFEFEF',
        outline: 'none',
        boxShadow: '0.5vh 0.5vh 1vh rgba(0, 0, 0, 0.2)',
        marginBottom: 20,
    },
    inputCoinImage: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '107%',
        height: "15.5vh",
        marginTop: 10,
        paddingTop: '50px',
        paddingBottom: '50px',
        fontSize: '2vh',
        borderRadius: '1vh',
        border: 'none',
        backgroundColor: '#EFEFEF',
        outline: 'none',
        boxShadow: '0.5vh 0.5vh 1vh rgba(0, 0, 0, 0.2)',
        marginBottom: 20,
    },
    inputfile: {
        display: 'none',
    },
    uploadTextPrimary: {
        fontSize: '22px',
        fontWeight: 'bold',
        font: 'Inter',
        cursor: 'pointer',
    },
    uploadIcon: {
        width: 57,
        height: 57,
        cursor: 'pointer',
    },
    removeButton: {
        width: 30,
        height: 30,
        backgroundColor: '#D20000',
        color: '#fff',
        border: 'none',
        borderRadius: 50,
        fontSize: 18,
        font: 'Inter',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: 10,
    },
    buttonsFlex: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    submitButton: {
        justifyContent: 'flex-end',
        width: '40%',
        height: '55px',
        backgroundColor: '#393939',
        padding: '10px 20px',
        color: '#fff',
        border: 'none',
        borderRadius: 15,
        fontSize: 22,
        font: 'Inter',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginBottom: '60px',
        marginTop: '20px',
        boxShadow: '0.5vh 0.5vh 1vh rgba(0, 0, 0, 0.2)',
    },
    backButton: {
        width: '40%',
        height: '55px',
        backgroundColor: '#393939',
        padding: '10px 20px',
        color: '#fff',
        border: 'none',
        borderRadius: 15,
        fontSize: 22,
        font: 'Inter',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginBottom: '60px',
        marginTop: '20px',
        boxShadow: '0.5vh 0.5vh 1vh rgba(0, 0, 0, 0.2)',
    },
    inputDropdown: {
        width: '107%',
        marginTop: 10,
        padding: '1.5vh',
        fontSize: '2vh',
        borderRadius: '1vh',
        border: 'none',
        backgroundColor: '#EFEFEF',
        outline: 'none',
        boxShadow: '0.5vh 0.5vh 1vh rgba(0, 0, 0, 0.2)',
        marginBottom: 20,
        appearance: 'none',
    },

    inputHalfItem: {
        width: '68%',
    },
    inputHalfPrice: {
        width: '12%',
    },
    listOfItems: {
        display: 'flex',
        flexDirection: 'column',
        width: '97.7%',
        height: 250,
        marginTop: 10,
        paddingLeft: 20,
        paddingTop: 20,
        paddingBottom: 20,
        fontSize: '2vh',
        borderRadius: '1vh',
        backgroundColor: '#EFEFEF',
        boxShadow: '0.5vh 0.5vh 1vh rgba(0, 0, 0, 0.2)',
        marginBottom: 20,
    },
    inputHalfSend: {
        width: '7%',
    },
    addButton: {
        width: 52,
        height: 52,
        backgroundColor: '#EFEFEF',
        color: 'none',
        border: 'none',
        borderRadius: 50,
        cursor: 'pointer',
        marginTop: 38,
        boxShadow: '0.5vh 0.5vh 1vh rgba(0, 0, 0, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    plusIcon: { 
        width: 28,
        height: 28,
        
    },
}

export default CreateCampaignPage;