import React, {Component} from 'react';
import {Text, View, Button, StyleSheet} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {getTheme} from 'react-native-material-kit';

const theme = getTheme();

export default class Home extends Component {

    static navigationOptions = {
        drawerLabel: "Home",
        drawerIcon: ({color}) => <Icon name={"home"}
                                       size={26}
                                       style={{color: color}}/>

    };

    render() {
        const {navigate} = this.props.navigation;
        return (
            <View>
                <Text style={styles.welcome}>Home</Text>
                <Button onPress={() => navigate("TimeRegistration")}
                        title={"Time registrations"}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    },
    icon: {
        width: 26,
        height: 26
    }
});
