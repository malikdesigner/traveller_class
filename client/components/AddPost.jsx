import React, { Component } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import apiUrl from './apiUrl';

 import DateTimePickerModal from 'react-native-modal-datetime-picker';

class AddPost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            travellingTo: '',
            travellingFrom: '',
            seat: '',
            date: new Date(),
            car: '',
            isDatePickerVisible: false,
        };
    }

    showToast = (message) => {
        ToastAndroid.showWithGravityAndOffset(
            message,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
            ToastAndroid.CENTER,
            ToastAndroid.WHITE
        );
    };

    handleConfirm = (selectedDate) => {
        this.setState({ date: selectedDate });
        this.hideDatePicker();
    };

    getTomorrow = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
    };

    showDatePicker = () => {
        this.setState({ isDatePickerVisible: true });
    };

    hideDatePicker = () => {
        this.setState({ isDatePickerVisible: false });
    };

    handleSubmit = async () => {
        const { travellingTo, travellingFrom, seat, date, car } = this.state;
        const { userId } = this.props;

        if (travellingTo === '') {
            return this.showToast('Please add your destination');
        } else if (travellingFrom === '') {
            return this.showToast('Please add your starting location');
        } else if (seat === '') {
            return this.showToast('Please add the number of seats available');
        } else if (car === '') {
            return this.showToast('Please add the car for your travel');
        } else if (date === '') {
            return this.showToast('Please add the date of your travel');
        } else {
            const formData = {
                travellingTo,
                travellingFrom,
                seat,
                car,
                date,
                userId,
            };

            try {
                // Make a POST request to your backend API
                const response = await fetch(`${apiUrl}/addTravel`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
                const result = await response.json();
                // Handle success
                if (result.ok) {
                    // Show a success toast
                    ToastAndroid.show('Record saved successfully', ToastAndroid.SHORT);
                } else {
                    // Show an error toast
                    ToastAndroid.show(result.message || 'Error saving record', ToastAndroid.SHORT);
                }
            } catch (error) {
                console.error('Error:', error);
                // Handle network error and show an error toast
                ToastAndroid.show('Network error', ToastAndroid.SHORT);
            }
        }
    };

    render() {
        const { travellingTo, travellingFrom, seat, date, car, isDatePickerVisible } = this.state;

        return (
            <View style={styles.form}>
                <Text style={[styles.stepsHeading, { marginTop: 5, fontSize: 30, alignSelf: 'center', marginBottom: 10 }]}>
                    Add Your Details
                </Text>

                <Text style={[styles.stepsHeading, { marginTop: 10, marginBottom: 10 }]}>Travelling From</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Travelling From"
                    value={travellingTo}
                    onChangeText={(text) => this.setState({ travellingTo: text })}
                />

                <Text style={[styles.stepsHeading, { marginTop: 10, marginBottom: 10 }]}>Travelling To</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Travelling To"
                    value={travellingFrom}
                    onChangeText={(text) => this.setState({ travellingFrom: text })}
                />

                <Text style={[styles.stepsHeading, { marginTop: 10, marginBottom: 10 }]}>Car</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Car"
                    value={car}
                    onChangeText={(text) => this.setState({ car: text })}
                />

                <Text style={[styles.stepsHeading, { marginTop: 10, marginBottom: 10 }]}>Seats Available</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Seats"
                    value={seat}
                    onChangeText={(text) => this.setState({ seat: text })}
                />

                <Text style={[styles.stepsHeading, { marginTop: 10, marginBottom: 10 }]}>Date:</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={{ flex: 1, padding: 10 }}
                        placeholder="Select Date"
                        value={date.toDateString()}
                        editable={false}
                    />
                    <TouchableOpacity onPress={this.showDatePicker}>
                        <Icon name="calendar" size={20} color="#333" style={styles.calendarIcon} />
                    </TouchableOpacity>
                </View>

                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    minimumDate={this.getTomorrow()}
                    onConfirm={this.handleConfirm}
                    onCancel={this.hideDatePicker}
                />

                <TouchableOpacity style={styles.roundButton} onPress={this.handleSubmit}>
                    <Text style={styles.buttonText}>Submit</Text>
                    <Icon name="arrow-right" style={styles.arrowIcon} size={20} color="white" />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    form: {
        paddingTop: 50,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        height: '100%',
        width: '100%',
        marginBottom: 10,
        backgroundColor: 'white',
        marginBottom: '5%',
        color: 'gray',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
        color: 'gray',
    },
    roundButton: {
        width: 100,
        height: 50,
        backgroundColor: 'black',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        right: 20,
        flexDirection: 'row',
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
    },
    arrowIcon: {
        width: 20,
        height: 20,
        tintColor: 'white',
    },
    stepsHeading: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    calendarIcon: {
        padding: 10,
    },
});

export default AddPost;
