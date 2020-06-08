import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Home from './pages/Home';
import Points from './pages/Points';
import Detail from './pages/Details';

const Appstack = createStackNavigator();

const Routes = () => {
    return (
        <NavigationContainer>
            <Appstack.Navigator
             headerMode="none" 
             screenOptions={{
                 cardStyle: {
                     backgroundColor: '#f0f0f5'
                 }
             }}>
                <Appstack.Screen name="Home" component={Home}/>
                <Appstack.Screen name="Points" component={Points}/>
                <Appstack.Screen name="Detail" component={Detail}/>
            </Appstack.Navigator>
        </NavigationContainer>
    );
}

export default Routes;