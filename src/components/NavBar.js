import React, { useState, useEffect } from 'react';
import Input from '@mui/joy/Input';
import Dropdown from '@mui/joy/Dropdown';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../contexts/SearchContext';

// Conexão com o servidor WebSocket
const socket = io('http://localhost:5000');

function NavBar({ onSearch }) {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(localStorage.getItem('userId')); // Para armazenar o userId do localStorage
    const { searchTerm, setSearchTerm } = useSearch(); // Atualizar termo de pesquisa no contexto
    const [localSearchTerm, setLocalSearchTerm] = useState('');
    const [verificationCompleted, setVerificationCompleted] = useState(
        JSON.parse(localStorage.getItem(`verificationCompleted_${userId}`)) || false // Recupera o estado de verificação do localStorage para cada userId
    ); // Para determinar o estado do perfil (verificado ou não)
    const [notifications, setNotifications] = useState([]); // Lista de notificações
    const [showBanner, setShowBanner] = useState(false); // Para exibir o banner de notificação
    const [isNotificationOpen, setIsNotificationOpen] = useState(false); // Estado para mostrar ou esconder notificações
    const [coins, setCoins] = useState([]); // Estado para guardar as moedas do utilizador
    const [profilePicture, setProfilePicture] = useState(
        localStorage.getItem(`profilePicture_${userId}`) || '' // Recupera a imagem de perfil do localStorage para cada userId
    ); // Estado para armazenar a imagem de perfil

    // Lê o userId do localStorage quando o componente é montado
    useEffect(() => {
        if (userId) {
            fetchCoins(userId);
            fetchProfilePicture(userId);
        } else {
            console.error('User ID not found in localStorage');
        }
    }, [userId]);

    // Função para buscar as moedas do utilizador
    const fetchCoins = async (storedUserId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/auth/${storedUserId}`);
            setCoins(response.data.coins || []);
        } catch (error) {
            console.error('Error fetching user coins:', error);
        }
    };

    // Função para buscar a imagem de perfil do utilizador
    const fetchProfilePicture = async (storedUserId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/auth/${storedUserId}`);
            const fetchedProfilePicture = response.data.profilePicture || '';
            setProfilePicture(fetchedProfilePicture);
            localStorage.setItem(`profilePicture_${storedUserId}`, fetchedProfilePicture); // Armazena a imagem de perfil no localStorage para cada userId
        } catch (error) {
            console.error('Error fetching profile picture:', error);
        }
    };

    // Busca informações do backend e configura WebSocket
    useEffect(() => {
        if (!userId) return; // Não executa até o userId estar disponível

        const fetchRoleAndNotifications = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/auth/notifications/${userId}`);
                if (response.data.role === 'criador/doador') {
                    setVerificationCompleted(true); // Atualiza o estado do ícone do perfil
                    localStorage.setItem(`verificationCompleted_${userId}`, 'true'); // Armazena o estado de verificação no localStorage para cada userId
                } else {
                    setVerificationCompleted(false);
                    localStorage.setItem(`verificationCompleted_${userId}`, 'false'); // Garante que o estado está correto para cada userId
                }
                if (response.data.notifications.length > 0) {
                    setNotifications(response.data.notifications); // Define as notificações recebidas
                    setShowBanner(true); // Mostra o banner de notificação
                    setTimeout(() => setShowBanner(false), 5000); // Remove o banner após 5 segundos
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchRoleAndNotifications();

        // Configuração do WebSocket para receber eventos em tempo real
        socket.on('userVerified', (data) => {
            if (data.userId === userId) {
                setVerificationCompleted(true); // Atualiza o estado do perfil
                localStorage.setItem(`verificationCompleted_${userId}`, 'true'); // Armazena o estado de verificação no localStorage para cada userId
                setNotifications([
                    {
                        title: 'Your account was successfully verified',
                        message: 'You are now able to create campaigns',
                    },
                ]);
                setShowBanner(true); // Mostra o banner
                setTimeout(() => setShowBanner(false), 5000); // Remove o banner após 5 segundos
            }
        });

        // Cleanup ao desmontar o componente
        return () => {
            socket.disconnect();
        };
    }, [userId]);

    const handleNotificationClick = () => {
        setIsNotificationOpen(!isNotificationOpen);
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            setSearchTerm(localSearchTerm);
            navigate('/campaign');
        }
    };

    const profileStyles = {
        ...style.profileIcon,
        border: verificationCompleted ? '2px solid #00FF00' : '2px solid #FF0000',
        position: 'relative',
    };

    return (
        <nav style={style.navbar}>
            <a href="/home">
                <img
                    src={require('../assets/logo.png')}
                    style={style.logo}
                    alt="Logo"
                />
            </a>

            <div style={style.navbarSearch}>
                <Input
                    placeholder="Search campaigns..."
                    variant="plain"
                    style={style.searchInput}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleSearch}
                />
                <button style={style.searchButton} onClick={handleSearch}>
                    <img
                        src={require('../assets/search-icon.png')}
                        alt="Search Icon"
                        style={style.searchIcon}
                    />
                </button>
            </div>

            <a href="/create-campaign" style={style.createButton}>
                <span style={style.textCreate}> Create </span>
                <img
                    src={require('../assets/plus-icon.png')}
                    alt="Plus Icon"
                    style={style.plusIcon}
                />
            </a>

            <button style={style.notificationButton} onClick={handleNotificationClick}>
                <img
                    src={require('../assets/notification-icon.png')}
                    alt="Notification Icon"
                    style={style.notificationIcon}
                />
                {notifications.length > 0 && <span style={style.notificationDot} />}
            </button>

            <Dropdown>
                <MenuButton variant="solid" color="#FFFFFF">
                    <div style={style.coinsContainerDropdown}>
                        <span style={style.coinText}> Coins </span>
                        <img
                            src={require('../assets/dropdown-icon.png')}
                            alt="Dropdown Icon"
                            style={style.dropdownIcon}
                        />
                    </div>
                </MenuButton>
                <Menu style={style.dropdownMenuItem}>
                    {coins.length > 0 ? (
                        coins.map((coin, index) => (
                            <MenuItem key={index}>
                                <div style={style.coinRow}>
                                    <button
                                        onClick={() => {
                                            if (!coin.campaignId) {
                                                alert('Campaign ID not found for this coin.');
                                                return;
                                            }
                                            navigate(`/campaign/${coin.campaignId}`);
                                        }}
                                        style={style.addButton}
                                    >
                                        +
                                    </button>
                                    <span style={style.coinAmount}>
                                        {coin.amount}
                                    </span>
                                    <div style={style.coinCircle}>
                                        <img
                                            src={coin.coinImage}
                                            alt={coin.coinName}
                                            style={style.coinImage}
                                            title={coin.coinName} // Nome da moeda aparece no hover
                                        />
                                    </div>
                                </div>
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem>
                            <span>No coins available</span>
                        </MenuItem>
                    )}
                </Menu>
            </Dropdown>

            <a href="/profile" style={style.profileButton}>
                <img
                    src={profilePicture ? `data:image/png;base64,${profilePicture}` : require('../assets/profile-icon.png')}
                    alt="Profile Icon"
                    style={profileStyles}
                />
                {!verificationCompleted && (
                    <span style={style.exclamationPoint}>!</span>
                )}
            </a>

            {showBanner && (
                <div style={style.banner}>
                    <p>Your account was successfully verified</p>
                </div>
            )}

            {isNotificationOpen && (
                <div style={style.notificationPopup}>
                    {notifications.map((notification, index) => (
                        <div key={index} style={style.notificationItem}>
                            <h4>{notification.title}</h4>
                            <p>{notification.message}</p>
                        </div>
                    ))}
                </div>
            )}
        </nav>
    );
}

const style = {
    navbar: {
        position: 'fixed',
        top: '0%',
        left: '0%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#183059',
        zIndex: 10,
    },
    loadingContainer: {
        width: '100%',
        textAlign: 'center',
        color: 'white',
        padding: '2vh',
    },
    logo: {
        width: "22.4vh",
        height: "8.6vh",
        paddingRight: '5.4vh',
        paddingLeft: '11vh',
        marginBottom: "1vh",
    },
    navbarSearch: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#2e4a75',
        paddingLeft: '0.3vh',
        paddingRight: '0.3vh',
        marginLeft: '6vh',
        marginRight: '1vh',
        width: "71.5vh",
        height: "6.1vh",
        borderRadius: "2vh",
    },
    searchInput: {
        padding: '2vh',
        paddingLeft: '2vh',
        fontSize: "2.5vh",
        background: 'none',
        color: 'white',
        fontWeight: 'bold',
        flex: '1',
        border: 'none',
    },
    searchButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
    },
    searchIcon: {
        width: "3vh",
        height: "3vh",
    },
    createButton: {
        display: 'flex',
        height: "6.2vh",
        width: "19.2vh",
        backgroundColor: '#009DFF',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        borderRadius: "2vh",
        cursor: 'pointer',
        textDecoration: 'none',
    },
    textCreate: {
        fontWeight: 'bold',
        fontSize: "2.8vh",
        color: 'white',
    },
    plusIcon: {
        width: "3vh",
        height: "3vh",
        paddingLeft: '3vh',
    },
    notificationButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        marginLeft: '30vh',
        position: 'relative',
    },
    notificationIcon: {
        width: "6vh",
        height: "6vh",
    },
    notificationDot: {
        position: 'absolute',
        top: "0.2vh",
        right: "0.4vh",
        width: "1.5vh",
        height: "1.5vh",
        backgroundColor: 'red',
        borderRadius: '50%',
    },
    coinsContainerDropdown: {
        height: "6vh",
        width: "17.2vh",
        borderRadius: "2vh",
        backgroundColor: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '1.1vh',
    },
    coinText: {
        color: '#1FA8FE',
        fontSize: "2.6vh",
        fontWeight: 'bold',
        flex: '1',
    },
    dropdownIcon: {
        width: "4vh",
        height: "2vh",
        paddingRight: '1.6vh',
    },
    dropdownMenuItem: {
        width: 'auto',
        borderRadius: "2vh",
        backgroundColor: '#EFEFEF',
        marginTop: "2vh",
    },
    profileButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        marginLeft: '1.1vh',
        position: 'relative',
    },
    profileIcon: {
        width: "6vh",
        height: "6vh",
        borderRadius: '50%',
    },
    exclamationPoint: {
        position: 'absolute',
        top: "-0.5vh",
        right: "-0.5vh",
        backgroundColor: '#FF0000',
        color: 'white',
        borderRadius: '50%',
        width: "2vh",
        height: "2vh",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: "1.5vh",
        fontWeight: 'bold',
    },
    banner: {
        position: 'fixed',
        top: 60,
        left: 20,
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '5px',
        animation: 'slideIn 0.5s',
    },
    notificationPopup: {
        position: 'fixed',
        top: "11vh",
        right: "35vh",
        backgroundColor: '#FFFFFF',
        borderRadius: "2vh",
        width: "32vh",
        zIndex: 9999,
        padding: '1.2vh',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    notificationItem: {
        padding: '1.2vh',
        borderBottom: '1px solid #E0E0E0',
    },
    coinRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: '1vh',
        gap: '1vw'
    },
    addButton: {
        width: '2.5vw',
        height: '2.5vw',
        borderRadius: '50%',
        backgroundColor: '#FFFFFF',
        border: '0.5vh solid #007bff',
        color: '#007bff',
        fontSize: '6vh',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    },
    coinAmount: {
        fontSize: '3vh',
        color: '#333',
        fontWeight: 'bold'
    },
    coinCircle: {
        width: '3vw',
        height: '3vw',
        borderRadius: '50%',
        backgroundColor: '#FFAD00',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    coinImage: {
        width: '80%',
        height: '80%',
        borderRadius: '50%',
        objectFit: 'cover',
    },
    
};

export default NavBar;
