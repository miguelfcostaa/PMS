import React from 'react';

function CampaignBox({ id, name, description, goal, timeToCompleteGoal, currentAmount }) {
    const progressPercentage = (currentAmount / goal) * 100;

    return (
        <div style={style.container}>
            <img 
                src={require('../assets/image.png')} 
                alt="Logo" 
                style={style.campaignImage} 
            />
            <div style={style.campaignInfo}>
                <img 
                    src={require('../assets/image.png')} 
                    alt="Logo" 
                    style={style.campaignPersonImage} 
                />
                <div style={style.campaignPersonInfo}>
                    <span style={style.campaignTitle}>{name}</span>
                    <span style={style.campaignPerson}>Campaign Person</span>
                </div>
            </div>
            <div>
                <p style={style.campaignDescription}> 
                    {description}
                </p>
            </div>
            <div style={style.campaignDonationInfo}>
                <span style={style.currentAmount}>€ {currentAmount} </span>
                <span style={style.donated}>of € {goal} </span>
            
                <div style={style.progressBar}>
                    <div style={{ ...style.progress, width: `${progressPercentage}%` }}></div>
                </div>
                <div style={style.progressInfo}>
                    <span style={style.percentage}>{Math.round(progressPercentage)}%</span>
                    <span style={style.daysLeft}>{timeToCompleteGoal} days left</span>
                </div>
            </div>
        </div>
    );
}

const style = {
    container: {
        width: 476,
        height: 555,
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'column',
        marginTop: '20px', 
    },
    campaignImage: {
        width: 451,
        height: 239,
        borderRadius: 10,
        marginTop: 10,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    campaignInfo: {
        display: 'flex',
        justifyContent: 'flex-start', 
        marginTop: 10,
        marginLeft: 30,
    },
    campaignPersonImage: {
        width: 47,
        height: 47,
        borderRadius: 50,
        marginTop: 10,
        marginRight: 20,
    },
    campaignPersonInfo: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    campaignTitle: {
        fontWeight: 'regular',
        fontSize: 22,
        font: 'Inter',
        color: '#000000',
    },
    campaignPerson: {
        fontSize: 16,
        font: 'Inter',
        color: '#6B6B6B',
    },
    campaignDescription: {
        fontSize: 15,
        font: 'Inter',
        color: '#000000',
        marginTop: 30,
        marginLeft: 30,
        marginRight: 30,
    },
    campaignDonationInfo: {
        marginTop: 20,
        marginLeft: 30,
        marginRight: 30,
    },
    currentAmount: {
        fontSize: 24,
        font: 'Inter',
        color: '#000000',
        fontWeight: 'bold',
    },
    donated: {
        fontSize: 22,
        fontWeight: 'light',
        font: 'Inter',
        color: '#000000',
    },
    progressBar: {
        width: '100%',
        height: 8,
        backgroundColor: '#AAD89B',
        marginTop: 10,
    },
    progress: {
        height: '100%',
        backgroundColor: '#26A300', 
        borderRadius: 10,
    },
    progressInfo: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    percentage: {
        fontSize: 16,
        font: 'Inter',
        fontWeight: 'light',
        color: '#000000',
        marginTop: 10,
        justifyContent: 'flex-start',
    },
    daysLeft: {
        fontSize: 16,
        font: 'Inter',
        fontWeight: 'light',
        color: '#000000',
        marginTop: 10,
        justifyContent: 'flex-end',
    },
};

export default CampaignBox;
