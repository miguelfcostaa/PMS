import React, { useState, useEffect } from 'react';
import Input from '@mui/joy/Input';
import Dropdown from '@mui/joy/Dropdown';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import { io } from 'socket.io-client';
import axios from 'axios';

// Conexão com o servidor WebSocket
const socket = io('http://localhost:5000');

function NavBar({ onSearch }) {
    const [userId, setUserId] = useState(null); // Para armazenar o userId do localStorage
    const [searchTerm, setSearchTerm] = useState('');
    const [verificationCompleted, setVerificationCompleted] = useState(false); // Para determinar o estado do perfil (verificado ou não)
    const [notifications, setNotifications] = useState([]); // Lista de notificações
    const [showBanner, setShowBanner] = useState(false); // Para exibir o banner de notificação
    const [isNotificationOpen, setIsNotificationOpen] = useState(false); // Estado para mostrar ou esconder notificações

    // Lê o userId do localStorage quando o componente é montado
    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        } else {
            console.error('User ID not found in localStorage');
        }
    }, []);

    // Busca informações do backend e configura WebSocket
    useEffect(() => {
        if (!userId) return; // Não executa até o userId estar disponível

        const fetchRoleAndNotifications = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/auth/notifications/${userId}`);
                if (response.data.role === 'criador/doador') {
                    setVerificationCompleted(true); // Atualiza o estado do ícone do perfil
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
            onSearch(searchTerm);
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
                    <div style={style.coinsContainer}>
                        <span style={style.coinText}> Coins </span>
                        <img
                            src={require('../assets/dropdown-icon.png')}
                            alt="Dropdown Icon"
                            style={style.dropdownIcon}
                        />
                    </div>
                </MenuButton>
                <Menu style={style.dropdownMenuItem}>
                    <MenuItem>
                        <img
                            src={require('../assets/plus-icon.png')}
                            alt="Plus Icon"
                            style={style.plusIconCoins}
                        />
                        <span style={style.numberCoins}> 1293 </span>
                        <img
                            src={require('../assets/health-coin.png')}
                            alt="Health Coin"
                            style={style.coinTypeIcon}
                        />
                    </MenuItem>
                </Menu>
            </Dropdown>

            <a href="/profile" style={style.profileButton}>
                <img
                    src={require('../assets/profile-icon.png')}
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
        top: 0,
        left: 0,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#183059',
        zIndex: 10,
    },
    logo: {
        width: 206,
        height: 82,
        paddingRight: '50px',
        paddingLeft: '100px',
        marginBottom: 10,
    },
    navbarSearch: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#2e4a75',
        paddingLeft: '5px',
        paddingRight: '5px',
        marginLeft: '50px',
        marginRight: '10px',
        width: 657,
        height: 57,
        borderRadius: 20,
    },
    searchInput: {
        padding: '5px',
        paddingLeft: '20px',
        fontSize: 22,
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
        width: 30,
        height: 30,
    },
    createButton: {
        display: 'flex',
        height: 57,
        width: 177,
        backgroundColor: '#009DFF',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        borderRadius: 20,
        cursor: 'pointer',
        textDecoration: 'none',
    },
    textCreate: {
        fontWeight: 'bold',
        fontSize: 24,
        color: 'white',
    },
    plusIcon: {
        width: 30,
        height: 30,
        paddingLeft: '20px',
    },
    notificationButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        marginLeft: '250px',
        position: 'relative',
    },
    notificationIcon: {
        width: 57,
        height: 57,
    },
    notificationDot: {
        position: 'absolute',
        top: 5,
        right: 5,
        width: 10,
        height: 10,
        backgroundColor: 'red',
        borderRadius: '50%',
    },
    coinsContainer: {
        height: 57,
        width: 158,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '10px',
    },
    coinText: {
        color: '#1FA8FE',
        fontSize: 22,
        fontWeight: 'bold',
        flex: '1',
    },
    dropdownIcon: {
        width: 39,
        height: 19,
        paddingRight: '15px',
    },
    dropdownMenuItem: {
        width: 'auto',
        borderRadius: 20,
        backgroundColor: '#EFEFEF',
        marginTop: 10,
    },
    profileButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        marginLeft: '10px',
        position: 'relative',
    },
    profileIcon: {
        width: 57,
        height: 57,
        borderRadius: '50%',
    },
    exclamationPoint: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#FF0000',
        color: 'white',
        borderRadius: '50%',
        width: 20,
        height: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 12,
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
        top: 70,
        right: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        width: 300,
        zIndex: 9999,
        padding: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    notificationItem: {
        padding: '10px',
        borderBottom: '1px solid #E0E0E0',
    },
};

export default NavBar;
