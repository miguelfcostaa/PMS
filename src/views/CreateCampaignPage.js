import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';

function CreateCampaignPage() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [formData, setFormData] = useState({
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
        donaters: [],
        shopItems: [],
    });

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Converter valores numéricos, se necessário
        const numericFields = ['goal', 'timeToCompleteGoal', 'bankAccount'];
        setFormData({
            ...formData,
            [name]: numericFields.includes(name) ? Number(value) : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Validação extra antes de enviar os dados
        if (formData.goal <= 0) {
            alert('Goal must be a positive number.');
            return;
        }
    
        try {
            // Adicionar ficheiros como Base64 (se necessário)
            const images = await Promise.all(
                selectedFiles.map((file) => convertFileToBase64(file))
            );

            // Atualizar o formData com as imagens
            const finalData = { ...formData, image: images };
    
            const response = await fetch('http://localhost:5000/api/campaign/create-campaign', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalData),
            });
    
            if (response.status === 201) {
                alert('Campanha criada com sucesso!');
                navigate('/campaign');
            } else {
                const data = await response.json();
                alert(data.message || 'Erro ao criar a campanha.');
            }
        } catch (err) {
            console.error(err.message);
            alert('Erro ao criar a campanha.');
        }
    };
    
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    };

    const handleClick = () => {
        document.getElementById('fileInput').click();
    };

    // Converter ficheiro para Base64
    const convertFileToBase64 = (file) => {
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                console.log('Base64 string:', reader.result);
                resolve(reader.result);
            };
            reader.onerror = (error) => reject(error);
        })
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
                <h1>About the Cause</h1>
                <div style={styles.form}>
                    <form onSubmit={handleSubmit}>
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
                        <div style={styles.inputContainer}>
                                <label style={styles.label}>
                                    Campaign Image:
                                </label>
                                <div style={styles.inputImage} onClick={handleClick}>
                                    {selectedFiles.length > 0 ? (
                                        <img
                                            src={URL.createObjectURL(selectedFiles[0])}
                                            alt="Selected"
                                            style={{ maxWidth: '50%', maxHeight: '140' }}
                                        />
                                    ) : (
                                        <>
                                            <img 
                                                src={require('../assets/upload-icon.png')} 
                                                alt="Upload Icon" 
                                                style={styles.uploadIcon} 
                                            />
                                            <span style={styles.uploadTextPrimary}>Upload File</span><br />

                                        </>
                                    )}
                                {selectedFiles.length > 0 && (
                                    <button onClick={() => setSelectedFiles([])} style={styles.removeButton}>
                                        x
                                    </button>
                                )}
                                </div>
                                <input
                                    type="file"
                                    id="fileInput"
                                    value={formData.image}
                                    onChange={handleFileChange}
                                    style={styles.inputfile}
                                    accept="image/*" // Aceitar apenas imagens
                                    multiple={false} // Apenas um ficheiro permitido
                                />
                        </div>

                        <button type="submit" style={styles.submitButton}>
                            Create Campaign
                        </button>

                        
                        
                    </form>
                </div>
            </div>
        </>
    );
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
        width: '50%',
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
    submitButton: {
        width: '50%',
        height: '55px',
        backgroundColor: '#009DFF',
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
};

export default CreateCampaignPage;
