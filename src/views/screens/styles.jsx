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
    balance: { 
        textAlign: 'center',
        fontSize: 20 / divider,
        fontWeight: 'bold',
        color: 'black'
    },
    deleteWallet: {
        textAlign: 'center',
        color: 'red',
        fontSize: 20 / divider,
        marginTop: 30
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
