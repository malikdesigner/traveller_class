import React, { Component } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ToastAndroid, Linking } from 'react-native';
import { FontAwesome, FontAwesome5, AntDesign } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import apiUrl from './apiUrl';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
        };

        this.handleLogin = this.handleLogin.bind(this);
        this.handleRegisterNow = this.handleRegisterNow.bind(this);
        this.openLink = this.openLink.bind(this);
    }

    handleLogin = async () => {
        const { email, password } = this.state;
        const { navigation } = this.props;

        try {
            const response = await fetch(`${apiUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (response.ok) {
                // Login successful, navigate to MainPage
                // I have this id of user returned from the response want to send this to MainPage
                console.log(result.user);
                navigation.navigate('MainPage', { userId: result.user });
            } else {
                // Display toast for invalid email or password
                ToastAndroid.show(result.message, ToastAndroid.SHORT);
            }
        } catch (error) {
            console.error('Error during login:', error);
            ToastAndroid.show('Error during login', ToastAndroid.SHORT);
        }
    };

    handleRegisterNow = () => {
        // Navigate to the /userProfile component
        const { navigation } = this.props;
        navigation.navigate('UserProfile');
    };

    openLink = (url) => {
        // Open external link
        Linking.openURL(url);
    };

    render() {
        const { email, password } = this.state;

        return (
            <View style={styles.container}>
                {/* Image */}
                <Image source={require('../assets/traveler.png')} style={styles.logo} />

                {/* Input Fields */}
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => this.setState({ email: text })}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={(text) => this.setState({ password: text })}
                />

                {/* Login Button */}
                <TouchableOpacity style={styles.button} onPress={this.handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                {/* Register Now Text */}
                <TouchableOpacity onPress={this.handleRegisterNow}>
                    <Text style={styles.registerText}>Don't have an account? Register now</Text>
                </TouchableOpacity>

                {/* Social Icons */}
                <View style={styles.iconContainer}>
                    <FontAwesome name="facebook" size={20} color="#000" onPress={() => this.openLink('https://www.facebook.com')} />
                    <FontAwesome5 name="twitter" style={{ marginRight: 50, marginLeft: 50 }} size={20} color="#000" onPress={() => this.openLink('https://twitter.com')} />
                    <AntDesign name="google" size={20} color="#000" onPress={() => this.openLink('https://www.google.com')} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: 'lightgrey'
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 100,
    },
    input: {
        width: '80%',
        height: 40,
        backgroundColor: '#fff',
        marginBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 5,
    },
    button: {
        width: '80%',
        height: 40,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#000',
        color: 'white'
    },
    buttonText: {
        color: 'white',
    },
    registerText: {
        color: '#000',
        marginTop: 10,
    },

    iconContainer: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'space-between',
    },
});

export default Login;
