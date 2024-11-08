import React from 'react';

const NavBar = () => {    
    return (
        <nav className="navbar">
            <ul className="navbar-list">
                <p style={style.label}> Home </p>
                <p style={style.label}> About </p>
                <p style={style.label}> Services </p>
                <p style={style.label}> Contact </p>
            </ul>
        </nav>
    );
};

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#183059', // Replace with your desired background color
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333', // Replace with your desired text color
    },
});

export default NavBar;
