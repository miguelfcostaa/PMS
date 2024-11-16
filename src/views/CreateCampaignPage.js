// CreateCampaignPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';

function CreateCampaignPage() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        goal: '',
        timeToCompleteGoal: '',
        currentAmount: 0,
        donaters: [],
        image: [],
        contact: '',
        bankAccount: '',
        donationComment: '',
        category: '',
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
                navigate('/campaigns');
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

    const handleUploadClick = () => {
        document.getElementById('fileInput').click();
    };

    // Converter ficheiro para Base64
    const convertFileToBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    return (
        <>
            <NavBar />
            <SideBar />
            <div style={styles.mainContent}>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Nome:</label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                    </div>
                    <div>
                        <label>Descrição:</label>
                        <textarea name="description" value={formData.description} onChange={handleInputChange} required />
                    </div>
                    <div>
                        <label>Meta (€):</label>
                        <input type="number" name="goal" value={formData.goal} onChange={handleInputChange} required />
                    </div>
                    <div>
                        <label>Tempo para Concluir (dias):</label>
                        <input type="number" name="timeToCompleteGoal" value={formData.timeToCompleteGoal} onChange={handleInputChange} required />
                    </div>
                    <div>
                        <label>Contacto:</label>
                        <input type="text" name="contact" value={formData.contact} onChange={handleInputChange} required />
                    </div>
                    <div>
                        <label>Conta Bancária:</label>
                        <input type="number" name="bankAccount" value={formData.bankAccount} onChange={handleInputChange} required />
                    </div>
                    <div>
                        <label>Comentário de Doação:</label>
                        <input type="text" name="donationComment" value={formData.donationComment} onChange={handleInputChange} required />
                    </div>
                    <div>
                        <label>Categoria:</label>
                        <input type="text" name="category" value={formData.category} onChange={handleInputChange} required />
                    </div>
                    <div style={styles.inputContainer}>
                        <label style={styles.label}>Upload de Imagens</label>
                        <div style={styles.uploadBox} onClick={handleUploadClick}>
                            {selectedFiles.length > 0 ? (
                                selectedFiles.map((file, index) => (
                                    <div key={index} style={styles.filePreview}>
                                        <img
                                            src="https://img.icons8.com/color/48/000000/file--v1.png"
                                            alt="File Icon"
                                            style={styles.fileIcon}
                                        />
                                        <span>{file.name}</span>
                                    </div>
                                ))
                            ) : (
                                <>
                                    <span style={styles.uploadTextPrimary}>Upload de Ficheiros</span>
                                    <span style={styles.uploadTextSecondary}>Arraste ficheiros aqui</span>
                                </>
                            )}
                            <input type="file" id="fileInput" onChange={handleFileChange} style={styles.fileInput} />
                        </div>
                    </div>
                    <button type="submit" style={styles.submitButton}>
                        Criar Campanha
                    </button>
                </form>
            </div>
        </>
    );
}

const styles = {
    mainContent: {
        marginTop: 102,
        marginLeft: '20%',
        paddingLeft: '20px',
        font: 'Inter',
    },
    inputContainer: {
        marginBottom: '20px',
    },
    uploadBox: {
        width: '400px',
        height: '200px',
        border: '2px dashed #ccc',
        borderRadius: '10px',
        textAlign: 'center',
        paddingTop: '30px',
    },
    fileInput: {
        display: 'none',
    },
    label: {
        fontSize: '16px',
        fontWeight: '600',
    },
    uploadTextPrimary: {
        fontSize: '18px',
        fontWeight: 'bold',
    },
    uploadTextSecondary: {
        fontSize: '14px',
        color: '#888',
    },
    filePreview: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '10px',
    },
    fileIcon: {
        marginRight: '10px',
    },
    submitButton: {
        backgroundColor: '#5cb85c',
        padding: '10px 20px',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
    },
};

export default CreateCampaignPage;
