import React, { useState } from 'react';
import Input from '@mui/joy/Input';
import Dropdown from '@mui/joy/Dropdown';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem'; 


function NavBar({ onSearch }) {
    
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            onSearch(searchTerm);  
        }
    };
    
    return (
        <nav style={style.navbar}>
            <img 
                src={require('../assets/logo.png')} 
                alt="Logo" 
                style={style.logo} 
            />

            <div style={style.navbarSearch}>
                <Input 
                    placeholder="Search campaigns..."
                    variant="plain"
                    style={style.searchInput}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleSearch}
                />
                <button style={style.searchButton} onClick={handleSearch} >
                    <img 
                        src={require('../assets/search-icon.png')} 
                        alt="Search Icon" 
                        style={style.searchIcon} 
                    />
                </button>
            </div>
            <a href='/create-campaign' style={style.createButton}>
                <span style={style.textCreate} > Create </span> 
                <img 
                    src={require('../assets/plus-icon.png')} 
                    alt="Plus Icon" 
                    style={style.plusIcon} 
                />
            </a>
            <button style={style.notificationButton}>
                <img 
                    src={require('../assets/notification-icon.png')} 
                    alt="Notification Icon" 
                    style={style.notificationIcon} 
                />
            </button>

            <Dropdown>
                <MenuButton variant="solid" color='#FFFFFF' >
                    <div style={style.coinsContainer}>
                        <span style={style.coinText} > Coins </span> 
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
                        <span style={style.numberCoins} > 1293 </span>
                        <img 
                            src={require('../assets/health-coin.png')} 
                            alt="Health Coin" 
                            style={style.coinTypeIcon} 
                        />
                    </MenuItem>
                    <MenuItem>
                        <img 
                            src={require('../assets/plus-icon.png')} 
                            alt="Plus Icon" 
                            style={style.plusIconCoins} 
                        />
                        <span style={style.numberCoins} > 055 </span>
                        <img 
                            src={require('../assets/animal-coin.png')} 
                            alt="Health Coin" 
                            style={style.coinTypeIcon} 
                        />
                    </MenuItem>
                    <MenuItem>
                        <img 
                            src={require('../assets/plus-icon.png')} 
                            alt="Plus Icon" 
                            style={style.plusIconCoins} 
                        />
                        <span style={style.numberCoins} > 245 </span>
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
                    style={style.profileIcon} 
                />
            </a>
        </nav>
    );
};

const style = {
    navbar: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#183059',
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
        colorOpacity: '79%',
        fontWeight: 'bold',
        font: 'Inter',
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
        padding: '5px',
        paddingTop: '5px',
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
        font: 'Inter',
        color: 'white',
    },
    plusIcon: {
        width: 30,
        height: 30,
        paddingLeft: '20px',
    },
    navbarIcons: {
        display: 'flex',
        alignItems: 'center',
    },
    notificationButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        marginLeft: '250px',
    },
    notificationIcon: {
        width: 57,
        height: 57,
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
        marginBottom: 0,
    },
    coinText: {
        color: '#1FA8FE',
        fontSize: 22,   
        fontWeight: 'bold',
        font: 'Inter',
        flex: '1',
    },
    dropdownIcon: {
        width: 39,
        height: 19,
        flex: '0',
        paddingRight: '15px',
    },
    dropdownMenuItem: {
        width: "auto",
        borderRadius: 20,
        backgroundColor: '#EFEFEF',
        marginTop: 10,
        marginLeft: 10,
        direction: 'flex',
    },
    numberCoins: {
        font: 'Inter',
        fontSize: 32,
        width: 100,
        textAlign: 'center',
    },
    plusIconCoins: {
        width: 34,
        height: 34,
    },
    coinTypeIcon: {
        width: 34,
        height: 34,
        paddingRight: '10px',
    },
    profileButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        marginLeft: '10px',
    },
    profileIcon: {
        width: 57,
        height: 57,
    },
    
};

export default NavBar;
