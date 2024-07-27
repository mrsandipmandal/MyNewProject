// _styles.js
const styles = {
    container: {
        flex: 1,
    },
    background: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 120,
    },
    logo: {
        width: 120,
        height: 120,
        borderRadius: 60,
        resizeMode: 'contain',
    },
    formContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 20,
        marginTop: 20,
    },
    card: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        padding: 20,
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#333',
    },
    input: {
        height: 40,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#ddd',
        color: '#333',
        paddingLeft: 10,
    },
    button: {
        width: '100%',
        height: 40,
        backgroundColor: '#00BFFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    linkText: {
        color: '#041e33',
        fontSize: 16,
        marginTop: 20,
        textAlign: 'center',
    },
    header: {
        backgroundColor: '#4A90E2',
    },
    headerTitle: {
        color: '#fff',
        fontWeight: 'bold',
    },
};

export default styles;
