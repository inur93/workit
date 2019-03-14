import React, {Component} from 'react';
import {Button, Text, View} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default class TimeRegistration extends Component {


    static navigationOptions = {

        drawerLabel: "Time registrations",
        drawerIcon: ({color}) => <Icon name={'home'}
                                       size={26}
                                       style={{color: color}}/>

    };

    render() {
        const {navigate} = this.props.navigation;
        return (
            <View>
                <Text>Time registration</Text>
                <Button onPress={() => navigate("Home")}
                        title={"Home"}/>
            </View>
        )
    }
}