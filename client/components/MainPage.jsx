import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
import AddPost from './AddPost';
import ListPage from './ListPage';
import UserPage from './UserPage';

class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.route.params?.userId,
        };
    }
    render() {
        const { userId } = this.state;

        return (
            <Tab.Navigator initialRouteName="ListPage">
                <Tab.Screen
                    name="AddPost"
                    component={() => <AddPost userId={userId} />}
                    options={{
                        headerShown: false,
                        tabBarLabel: 'Add Post',
                        tabBarIcon: ({ color, size }) => (
                            <Icon name="plus" color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="ListPage"
                    component={() => <ListPage userId={userId} />}
                    options={{
                        headerShown: false,
                        tabBarLabel: 'List Post',
                        tabBarIcon: ({ color, size }) => (
                            <Icon name="list" color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="UserPage"
                    component={() => <UserPage userId={userId} />}
                    options={{
                        headerShown: false,
                        tabBarLabel: 'User Page',
                        tabBarIcon: ({ color, size }) => (
                            <Icon name="user" color={color} size={size} />
                        ),
                    }}
                />
            </Tab.Navigator>
        );
    }
}

const styles = StyleSheet.create({
    backButton: {
        width: 100,
        height: 50,
        backgroundColor: 'black',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        left: 20,
    },
    arrowIcon: {
        width: 20,
        height: 20,
        tintColor: 'white',
    },
});

export default MainPage;
