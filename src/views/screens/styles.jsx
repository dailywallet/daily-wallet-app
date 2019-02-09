const divider = 1.5;

export default {
    screenContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent:'space-between', //'flex-start',
        backgroundColor: '#fff'
    },
    screenContainerCentered: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    title: {
        paddingTop: 30,
        color: 'black',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold'
    },
    buttonContainer: {
        marginTop: 20,
        width: 206 / divider ,
        height: 72 / divider,
        borderWidth: 2,
        backgroundColor: 'white'
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 28 / divider,
        fontWeight: 'bold',
        paddingTop: 13 / divider,
        color: 'black'
    },
    centeredFlex: {
        flex: 1,
        alignItems: 'center',
    },
    infoText: {
	// paddingTop: 40,
	paddingLeft: 15,
	paddingRight: 15,
        textAlign: 'center',
        textAlign: 'center',
        fontSize: 20,
        color: 'gray'
    },
    pinContainer: { 
        flex: 3,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    balanceContainer: { 
        flex: 2, 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center'  
    },
    balance: { 
        textAlign: 'center',
        fontSize: 20 / divider,
        color: 'black',
        fontWeight: 'bold'
    },
    statusBarContainer: { 
        width: '100%', 
        height: 50 / 1.5, 
        backgroundColor: 'rgba(38,207,54,0.3)', 
        textAlign: 'center', 
        paddingTop: 2, 
        marginTop: 5 
    },
    sendScreenContainer: { 
        flex: 1,
        justifyContent: 'space-between'
    },
    sendInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    sendScreenText: {
        textAlign: 'center',
        fontSize: 30 / divider,
        fontWeight: 'bold',
        color: 'black'
    },
    shareScreenText: {
        textAlign: 'center',
        fontSize: 30 / divider,
        fontWeight: 'bold',
        color: 'black'
    },
    activityIndicator: { 
	flex: 1,
	justifyContent: 'center',
	alignItems: 'center',
	height: 80 / divider
    }
}
