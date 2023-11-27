import React, { Component } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CheckBox } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import apiUrl from './apiUrl';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            phoneCode: '',
            password: '',
            isChecked: false,
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

    handleSubmit = async () => {
        const { isChecked, firstName, lastName, email, phoneCode, phoneNumber, password } = this.state;

        if (!isChecked) {
            return this.showToast('Please accept terms & policy');
        } else {
            const formData = {
                firstName,
                lastName,
                email,
                phoneCode,
                phoneNumber,
                password,
            };

            try {
                const response = await fetch(`${apiUrl}/addUser`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
                const result = await response.json();

                if (result.ok) {
                    ToastAndroid.show('Record saved successfully', ToastAndroid.SHORT);
                    this.props.navigation.navigate('Login');
                } else {
                    ToastAndroid.show(result.message || 'Error saving record', ToastAndroid.SHORT);
                }
            } catch (error) {
                console.error('Error:', error);
                ToastAndroid.show('Network error', ToastAndroid.SHORT);
            }
        }
    };
    handleIsCheckedToggle = () => {
        const { isChecked } = this.state;
        this.setState({ isChecked: !isChecked });
    };
    handleBack = () => {
        this.setState({ step: this.state.step - 1 });
    };

    handleNext = () => {
        const { step, firstName, lastName, phoneCode, phoneNumber, email, password } = this.state;

        if (step === 2 && (!firstName || !lastName)) {
            this.showToast('Please enter both first and last name');
        } else if (step === 3 && (!phoneCode || !phoneNumber)) {
            this.showToast('Please enter both phone code and number');
        } else if (step === 4 && !email) {
            this.showToast('Please enter your email address');
        } else if (step === 5 && !password) {
            this.showToast('Please enter your password');
        } else {
            this.setState({ step: step + 1 });
        }
    };

    render() {
        const { step, firstName, lastName, email, phoneNumber, phoneCode, password, isChecked } = this.state;

        return (
            <View style={styles.container}>
                {step === 1 && (
                    <View style={[styles.container, { backgroundColor: '#077eed' }]}>
                        <View style={styles.startingScreen}>
                            <Text style={styles.appName}>Travellers</Text>
                            <Image source={require('../assets/traveler.png')} style={styles.logo} />
                            <Text style={styles.tagline}>Travel with partner</Text>

                            <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 10 }}>
                                <TouchableOpacity style={styles.getStartedButton} onPress={this.handleNext}>
                                    <Text style={styles.buttonTextLarge}>Get Started</Text>
                                    <Icon name="arrow-right" style={styles.arrowIcon} size={20} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View >
                )}
                {step === 2 && (
                    <View style={styles.form} >
                        <Text style={[styles.stepsHeading, { marginTop: 30, marginBottom: 10 }]}>First Name</Text>
                        <TextInput
                            style={styles.input}

                            placeholder="First Name"
                            value={firstName}
                            onChangeText={(text) => this.setState({ firstName: text })}
                        />
                        <Text style={[styles.stepsHeading, { marginTop: 10, marginBottom: 10 }]}>Last Name</Text>

                        <TextInput
                            style={styles.input}

                            placeholder="Last Name"
                            value={lastName}
                            onChangeText={(text) => this.setState({ lastName: text })}
                        />

                        <TouchableOpacity style={styles.backButton} onPress={this.handleBack}>
                            <Icon name="arrow-left" style={styles.arrowIcon} size={20} color="white" />
                            <Text style={styles.buttonText}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.roundButton} onPress={this.handleNext}>
                            <Text style={styles.buttonText}>Next</Text>
                            <Icon name="arrow-right" style={styles.arrowIcon} size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                )}
                {step === 3 && (
                    <View style={styles.form} >
                        <Text style={[styles.stepsHeading, { marginTop: 30, marginBottom: 10 }]}>Enter Your mobile number</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <TextInput
                                style={{
                                    flex: 2,
                                    height: 40,
                                    borderColor: 'gray',
                                    borderWidth: 1,
                                    marginBottom: 10,
                                    padding: 10,
                                    color: 'gray',
                                }}
                                placeholder="Code"
                                value={phoneCode}
                                onChangeText={(text) => this.setState({ phoneCode: text })}
                            />

                            {/* Phone Number Input */}
                            <TextInput
                                style={{
                                    flex: 8,
                                    height: 40,
                                    borderColor: 'gray',
                                    borderWidth: 1,
                                    marginBottom: 10,
                                    padding: 10,
                                    color: 'gray',
                                }}
                                placeholder="Phone Number"
                                value={phoneNumber}
                                onChangeText={(text) => this.setState({ phoneNumber: text })}
                            />
                        </View>
                        {/* Next Button */}
                        <TouchableOpacity style={styles.backButton} onPress={this.handleBack}>
                            <Icon name="arrow-left" style={styles.arrowIcon} size={20} color="white" />
                            <Text style={styles.buttonText}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.roundButton} onPress={this.handleNext}>
                            <Text style={styles.buttonText}>Next</Text>
                            <Icon name="arrow-right" style={styles.arrowIcon} size={20} color="white" />
                        </TouchableOpacity>

                    </View>
                )}
                {step === 4 && (
                    <View style={styles.form}>
                        <Text style={[styles.stepsHeading, { marginTop: 30, marginBottom: 10 }]}>Enter Your Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Email Address"
                            value={email}
                            onChangeText={(text) => this.setState({ email: text })}
                        />
                        <Text style={{ marginTop: 20, color: 'grey', alignContent: 'center', alignSelf: 'center' }}>
                            Your Ride, Your Way - Enter Your Email to Get Started.</Text>

                        <TouchableOpacity style={styles.backButton} onPress={this.handleBack}>
                            <Icon name="arrow-left" style={styles.arrowIcon} size={20} color="white" />
                            <Text style={styles.buttonText}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.roundButton} onPress={this.handleNext}>
                            <Text style={styles.buttonText}>Next</Text>
                            <Icon name="arrow-right" style={styles.arrowIcon} size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                )}
                {step === 5 && (
                    <View style={styles.form}>
                        <Text style={[styles.stepsHeading, { marginTop: 30, marginBottom: 10 }]}>Enter Your Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={password}
                            secureTextEntry={true}
                            onChangeText={(text) => this.setState({ password: text })}
                        />
                        {/* Add more fields for Step 2 */}

                        <Text style={{ marginTop: 20, color: 'grey', alignContent: 'center', alignSelf: 'center' }}>
                            Secure your gateway with a strong key</Text>
                        <TouchableOpacity style={styles.backButton} onPress={this.handleBack}>
                            <Icon name="arrow-left" style={styles.arrowIcon} size={20} color="white" />
                            <Text style={styles.buttonText}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.roundButton} onPress={this.handleNext}>
                            <Text style={styles.buttonText}>Next</Text>
                            <Icon name="arrow-right" style={styles.arrowIcon} size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                )}
                {step === 6 && (
                    <View style={styles.form}>
                        <Text style={[styles.stepsHeading, { marginTop: 30, marginBottom: 10 }]}>Review Travellers Terms & Privacy Notice</Text>

                        {/* Add more fields for Step 2 */}
                        <CheckBox
                            title={
                                <Text style={{ marginTop: 20, color: 'grey', alignContent: 'center', alignSelf: 'center' }}>
                                    By using Travellers, you agree to fair conduct, secure payments, and adherence to our terms. Navigate with confidence, knowing your safety and satisfaction are our top priorities.
                                </Text>
                            }
                            checked={isChecked} // Replace isChecked with your state variable for the checkbox
                            onPress={this.handleIsCheckedToggle}
                            containerStyle={{ backgroundColor: 'transparent', borderWidth: 0, marginTop: 20 }}
                        />

                        <TouchableOpacity style={styles.backButton} onPress={this.handleBack}>
                            <Icon name="arrow-left" style={styles.arrowIcon} size={20} color="white" />
                            <Text style={styles.buttonText}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.roundButton} onPress={this.handleSubmit}>
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Add more steps as needed */}
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

    },
    form: {
        paddingTop: 50,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        height: '100%',
        width: '100%',
        marginTop: 20,
        marginBottom: 10,

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
        color: 'gray'
    },
    roundButton: {
        width: 100,
        height: 50,
        backgroundColor: 'black', // You can change the color
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        right: 20,
        flexDirection: 'row'
    },
    backButton: {
        width: 100,
        height: 50,
        backgroundColor: 'black', // You can change the color
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        left: 20,
        flexDirection: 'row'
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
    },
    datetimePickerButton: {
        flexDirection: 'row',
        //alignItems: 'center',
        justifyContent: 'space-between',
        //backgroundColor: 'blue', // You can change the color
        padding: 2,
        borderRadius: 5,
        marginTop: 2,
        marginBottom: 2,
        alignItems: 'center',
    },
    selectedDateText: {
        marginVertical: 10,
    },


    startingScreen: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#077eed',
        marginTop: 100
    },
    appName: {
        fontSize: 50,
        fontWeight: 'bold',
        color: 'white',
        padding: 50
    },
    logo: {
        width: 100,
        height: 100,
        padding: 50,

    },
    tagline: {
        fontSize: 40,
        padding: 50,
        color: '#e3eafa',


    },
    getStartedButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'black',
        padding: 15,
        paddingRight: 100,
        paddingLeft: 100,

        borderRadius: 10,
        marginBottom: 10
    },
    buttonTextLarge: {
        color: 'white',
        fontSize: 18,
        marginRight: 10,
    },
    arrowIcon: {
        width: 20,
        height: 20,
        tintColor: 'white',
    },
    stepsHeading: {
        fontSize: 30,
        color: 'black',
        fontWeight: 'bold'
    },
    dropdown: {
        minWidth: 100, // Adjust the minimum width as needed
        marginBottom: 10,
    },
    countryLabel: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default UserProfile;
