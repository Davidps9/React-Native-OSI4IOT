import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Form from './components/Form';
import Example from './components/MainScreen';
import Mqtt from './components/MqttGyroscope';
import { ParamList } from './types';
import { MqttForm } from './components/MqttForm';
import MqttAccelerator from './components/MqttAccelerator';
import MqttGeolocation from './components/MqttGeolocation';
import MqttMotion from './components/MqttMotion';



const Stack = createNativeStackNavigator<ParamList>()
export default function App() {

  return (
    <NavigationContainer >
      <Stack.Navigator initialRouteName='Home' >
        <Stack.Screen name='Home' component={Form} options={{ headerShown: false }} />
        <Stack.Screen name="MainScreen" component={Example} options={{ headerShown: false }} />
        <Stack.Screen name='TimeSelectorScreen' component={MqttForm} options={{ headerShown: false }} />
        <Stack.Screen name="MqttMessagerScreenForGyrosope" component={Mqtt} options={{ headerShown: false }} />
        <Stack.Screen name="MqttMessagerScreenForAccelerometer" component={MqttAccelerator} options={{ headerShown: false }} />
        <Stack.Screen name="MqttMessagerScreenForGeolocation" component={MqttGeolocation} options={{ headerShown: false }} />
        <Stack.Screen name="MqttMessagerScreenForMotion" component={MqttMotion} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


