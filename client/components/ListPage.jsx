import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, ToastAndroid, StyleSheet } from 'react-native';
import axios from 'axios';
import apiUrl from './apiUrl';
import Icon from 'react-native-vector-icons/FontAwesome';

class ListPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            travelData: [],
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/getTravelData`);

            if (response.data.ok) {
                this.setState({ travelData: response.data.travelData });
            } else {
                console.error('Error fetching travel data:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching travel data:', error);
        }
    };

    handleBookTravel = async (itemId) => {
        const { userId } = this.props;

        try {
            const response = await fetch(`${apiUrl}/bookTravel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId, userId }),
            });

            const result = await response.json();

            if (result.ok) {
                ToastAndroid.show('Booking successful', ToastAndroid.SHORT);
                this.fetchData();
            } else {
                ToastAndroid.show(result.message || 'Error booking travel', ToastAndroid.SHORT);
            }
        } catch (error) {
            console.error('Error booking travel:', error);
            ToastAndroid.show('Network error', ToastAndroid.SHORT);
        }
    };

    render() {
        const { travelData } = this.state;

        return (
            <View style={styles.container}>
                <Text style={styles.heading}>Travel Posts</Text>
                {travelData.length > 0 ? (
                    <FlatList
                        data={travelData}
                        keyExtractor={(item) => item.id.toString()}
                        style={{ backgroundColor: 'white' }}
                        renderItem={({ item }) => (
                            <View style={styles.postContainer}>
                                <TouchableOpacity onPress={() => this.handleBookTravel(item.id)} style={styles.bookButton}>
                                    <Icon name="book" size={20} color="white" />
                                </TouchableOpacity>

                                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>{`Driver: ${item.first_name} ${item.last_name}`}</Text>
                                <Text style={{ fontSize: 20, marginBottom: 10 }}>{`Seat Available: ${item.seats} `}</Text>
                                <Text style={{ fontSize: 15, marginBottom: 4 }}>{`Car: ${item.car_type} `}</Text>

                                <Text>{`To: ${item.travelling_to}`}</Text>
                                <Text>{`From: ${item.travelling_from}`}</Text>
                                <Text>{`Email: ${item.email} `}</Text>
                                <Text>{`Mobile: ${item.phone_number} `}</Text>

                                <Text>{`Date: ${item.date_added.toString()}`}</Text>
                            </View>
                        )}
                    />
                ) : (
                    <Text>No Remaining Departure</Text>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    postContainer: {
        marginBottom: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        position: 'relative',
    },
    bookButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'black',
        padding: 8,
        borderRadius: 5,
    },
    bookButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default ListPage;
