import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

function SideBar() {
    const location = useLocation();

    return (
        <div style={styles.sideBar}>
            <NavLink to="/home" style={location.pathname === '/home' ? {...styles.link, ...styles.activeLink} : styles.link}>Home</NavLink>
            
            <NavLink to="/categories" style={location.pathname === '/categories' ? {...styles.categoryTitle, ...styles.activeLink} : styles.categoryTitle}>
                Categories
            </NavLink>
            
            <div style={styles.categories}>
                {['Health', 'Animals', 'Environment', 'Education', 'Children', 'Elderly', 'Human Rights', 'Food Security', 'Social Justice', 'Natural Disasters'].map((category) => (
                    <div key={category} style={styles.categoryItem}>
                        <label htmlFor={category} style={styles.categoryLabel}>{category}</label>
                        <input type="checkbox" id={category} style={styles.checkBox} />
                    </div>
                ))}
            </div>

            <NavLink to="/games" style={location.pathname === '/games' ? {...styles.link, ...styles.activeLink} : styles.link}>Games</NavLink>
            <NavLink to="/#" style={location.pathname === '/promotions' ? {...styles.link, ...styles.activeLink} : styles.link}>Promotions</NavLink>
            <NavLink to="/#" style={location.pathname === '/challenges' ? {...styles.link, ...styles.activeLink} : styles.link}>Challenges</NavLink>
            <NavLink to="/#" style={location.pathname === '/contact' ? {...styles.link, ...styles.activeLink} : styles.link}>Contact</NavLink>
            <NavLink to="/#" style={location.pathname === '/about' ? {...styles.link, ...styles.activeLink} : styles.link}>About</NavLink>
        </div>
    );
}

const styles = {
    sideBar: {
        width: '15%',
        height: '100%',
        backgroundColor: '#425576',
        padding: '20px',
        paddingLeft: '60px',
        paddingRight: 30,
        color: 'white',
        font: 'Inter',
        fontSize: 26,
        fontWeight: 'regular',
    },
    link: {
        color: 'white',
        textDecoration: 'none',
        display: 'block',
        padding: '10px 0',
        fontWeight: 'normal',
    },
    activeLink: {
        fontWeight: 'bold', // Define o link ativo em negrito
    },
    categoryTitle: {
        padding: '10px 0',
        textDecoration: 'none',
        color: 'white',
    },
    categories: {
        padding: '10px 0',
    },
    categoryItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '5px 0',
    },
    categoryLabel: {
        color: 'white',
        fontSize: 20,
        marginLeft: '10px',
        flex: 1,
    },
    checkBox: {
        transform: 'scale(1.5)', // Increase the size of the checkbox
    },
};

export default SideBar;

