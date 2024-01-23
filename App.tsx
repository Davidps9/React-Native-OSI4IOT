import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Form from './components/Form';
import MainScreen from './components/MainScreen';
import Mqtt from './components/MqttGyroscope';
import { ParamList } from './types';
import { MqttForm } from './components/MqttForm';
import MqttAccelerator from './components/MqttAccelerator';
import MqttGeolocation from './components/MqttGeolocation';
import MqttMotion from './components/MqttMotion';
import { StatusBar, StatusBarStyle } from 'react-native';
import { useState } from 'react';


const Stack = createNativeStackNavigator<ParamList>()
export default function App() {

  const STYLES = ['default', 'dark-content', 'light-content'] as const;
  const [styleStatusBar, setStyleStatusBar] = useState<StatusBarStyle>(STYLES[0]);

  return (
    <NavigationContainer >
      <StatusBar barStyle={styleStatusBar} backgroundColor="#000" />
      <Stack.Navigator initialRouteName='Home' >
        <Stack.Screen name='Home' component={Form} options={{ headerShown: false }} />
        <Stack.Screen name="MainScreen" component={MainScreen} options={{ headerShown: false }} />
        <Stack.Screen name='TimeSelectorScreen' component={MqttForm} options={{ headerShown: false }} />
        <Stack.Screen name="MqttMessagerScreenForGyrosope" component={Mqtt} options={{ headerShown: false }} />
        <Stack.Screen name="MqttMessagerScreenForAccelerometer" component={MqttAccelerator} options={{ headerShown: false }} />
        <Stack.Screen name="MqttMessagerScreenForGeolocation" component={MqttGeolocation} options={{ headerShown: false }} />
        <Stack.Screen name="MqttMessagerScreenForMotion" component={MqttMotion} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


