import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import apiUrl from './apiUrl';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

class UserPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: {},
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = async () => {
        const { userId } = this.props;

        try {
            const response = await axios.get(`${apiUrl}/getUser/${userId}`);

            if (response.data.ok) {
                this.setState({ userData: response.data.userData });
            } else {
                console.error('Error fetching user data:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    handleSignout = () => {
        const { navigation } = this.props;
        navigation.navigate('Login');
    };

    render() {
        const { userData } = this.state;

        return (
            <View style={styles.container}>
                <View style={styles.userInfoContainer}>
                    <Image
                        source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmS7J5ZsZg-5LFYd15JSagsZB8EJ4gd3ONuQ&usqp=CAU' }}
                        style={styles.userImage}
                    />
                    <View style={styles.userDetails}>
                        <Text style={styles.userName}>{userData.firstname} {userData.lastname}</Text>
                        <Text style={styles.userEmail}>{userData.email}</Text>
                        <Text style={styles.userPhoneNumber}>{userData.phone_number}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 10 }}>
                    <TouchableOpacity style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }} >
                        <Icon name="user" size={20} color="black" />
                        <Text style={{ padding: 10, fontSize: 20 }}>Contact Info</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }} >
                        <Icon name="envelope" size={20} color="black" />
                        <Text style={{ padding: 10, fontSize: 20 }}>Messages</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }} >
                        <Icon name="car" size={20} color="black" />
                        <Text style={{ padding: 10, fontSize: 20 }}>Trips</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }} >
                        <Icon name="credit-card" size={20} color="black" />
                        <Text style={{ padding: 10, fontSize: 20 }}>Payment Methods</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }} >
                        <Icon name="cog" size={20} color="black" />
                        <Text style={{ padding: 10, fontSize: 20 }}>Settings</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }} >
                        <Icon name="question-circle" size={20} color="black" />
                        <Text style={{ padding: 10, fontSize: 20 }}>Help</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }} onPress={this.handleSignout}>
                        <Icon name="sign-out" size={20} color="black" />
                        <Text style={{ padding: 10, fontSize: 20 }}>Log Out</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    signoutButton: {
        backgroundColor: 'black',
        padding: 8,
        borderRadius: 8,
    },
    signoutButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingTop: 20,
        paddingBottom: 20,
    },
    userImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginRight: 16,
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    userEmail: {
        fontSize: 16,
        marginBottom: 8,
    },
    userPhoneNumber: {
        fontSize: 16,
        color: '#555',
    },
});

export default UserPage;
