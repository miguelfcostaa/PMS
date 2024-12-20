import React from 'react';

function CampaignBox({ 
    id, 
    title, 
    description, 
    goal, 
    timeToCompleteGoal, 
    currentAmount, 
    nameBankAccount, 
    image, 
    creatorPicture, 
    creatorFirstName, 
    creatorLastName,
    onClick 
}) {
    const progressPercentage = (currentAmount / goal) * 100;

    const creatorImageSrc = creatorPicture 
        ? `data:image/jpeg;base64,${creatorPicture}` 
        : require('../assets/image.png');

    const campaignImageSrc = image && image.startsWith('data:image/') 
        ? image 
        : (image ? `data:image/jpeg;base64,${image}` : require('../assets/image.png'));

    const creatorName = (creatorFirstName && creatorLastName) 
        ? `${creatorFirstName} ${creatorLastName}` 
        : nameBankAccount;


    function formatAmount(amount) {
        let formattedAmount = amount.toFixed(1);
        if (formattedAmount.endsWith('.0')) {
            formattedAmount = formattedAmount.slice(0, -2);
        }
        return formattedAmount;
    }
        
    function formatLargeAmount(amount) {
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
            return amount.toString();
        }
    }

    return (
        <div style={style.container} onClick={onClick}>
            <img 
                src={campaignImageSrc} 
                alt="Campaign Image" 
                style={style.campaignImage} 
            />
            <div style={style.campaignInfo}>
                <img 
                    src={creatorImageSrc} 
                    alt="Creator Image" 
                    style={style.campaignPersonImage} 
                />
                <div style={style.campaignPersonInfo}>
                    <span style={style.campaignTitle}>{title}</span>
                    <span style={style.campaignPerson}>{creatorName}</span>
                </div>
            </div>
            <div>
                <p style={style.campaignDescription}> 
                    {description}
                </p>
            </div>
            <div style={style.campaignDonationInfo}>
                <span style={style.currentAmount}>€ {formatLargeAmount(currentAmount)} </span>
                <span style={style.donated}>of € {formatLargeAmount(goal)} </span>
            
                <div style={style.progressBar}>
                    <div style={{ ...style.progress, width: `${Math.min(progressPercentage, 100)}%` }}>
                    </div>
                </div>
                <div style={style.progressInfo}>
                    <span style={style.percentage}>{formatLargeAmount(Math.round(progressPercentage))}%</span>
                    <span style={style.daysLeft}>{formatLargeAmount(timeToCompleteGoal)} days left</span>
                </div>
            </div>
        </div>
    );
}

const style = {
    container: {
        width: '41vh',
        height: '52vh',
        backgroundColor: "#FFFFFF",
        borderRadius: '1vh',
        display: 'flex',
        flexDirection: 'column',
        marginTop: '2vh', 
        cursor: 'pointer',
    },
    campaignImage: {
        width: "37vh",
        height: '22vh',
        borderRadius: '1vh',
        paddingTop: '2vh',
        justifyContent: 'center',
        alignSelf: 'center',
        objectFit: 'cover',
    },
    campaignInfo: {
        display: 'flex',
        justifyContent: 'flex-start', 
        marginTop: '1vh',
        marginLeft: '3vh',
    },
    campaignPersonImage: {
        width: '4.7vh',
        height: '4.7vh',
        borderRadius: '5vh',
        marginTop: '1vh',
        marginRight: '2vh',
    },
    campaignPersonInfo: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    campaignTitle: {
        fontWeight: 'regular',
        fontSize: '2.2vh',
        font: 'Inter',
        color: '#000000',
        maxWidth: '29vh',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    campaignPerson: {
        fontSize: '1.6vh',
        font: 'Inter',
        color: '#6B6B6B',
    },
    campaignDescription: {
        fontSize: '1.5vh',
        font: 'Inter',
        color: '#000000',
        marginTop: '3vh',
        marginLeft: '3vh',
        marginRight: '3vh',
        maxHeight: '2vh',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    campaignDonationInfo: {
        marginTop: '2vh',
        marginLeft: '3vh',
        marginRight: '3vh',
    },
    currentAmount: {
        fontSize: '2.4vh',
        font: 'Inter',
        color: '#000000',
        fontWeight: 'bold',
    },
    donated: {
        fontSize: '2.2vh',
        fontWeight: 'light',
        font: 'Inter',
        color: '#000000',
    },
    progressBar: {
        width: '100%',
        height: '0.8vh',
        backgroundColor: '#AAD89B',
        marginTop: '1vh',
    },
    progress: {
        height: '100%',
        backgroundColor: '#26A300', 
        borderRadius: '1vh',
    },
    progressInfo: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    percentage: {
        fontSize: '1.6vh',
        font: 'Inter',
        fontWeight: 'light',
        color: '#000000',
        marginTop: '1vh',
        justifyContent: 'flex-start',
    },
    daysLeft: {
        fontSize: '1.6vh',
        font: 'Inter',
        fontWeight: 'light',
        color: '#000000',
        marginTop: '1vh',
        justifyContent: 'flex-end',
    },
};

export default CampaignBox;
