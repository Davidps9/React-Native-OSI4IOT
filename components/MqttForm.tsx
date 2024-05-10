import React, { SetStateAction, useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ParamList } from '../types';
import { LogBox, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from '../Styles/styles';
import HeaderComponent from './generics/Header';
import CancelButton from './generics/CancelButton';
import SendButton from './generics/SendButton';
import InputFooter from './generics/InputFooter';


type MainscreenProps = NativeStackScreenProps<ParamList, 'TimeSelectorScreen'>

export function MqttForm({ navigation, route }: MainscreenProps) {
    const [samplingRate, setSamplingRate] = useState<string>('20');
    const [recordingTime, setRecordingTime] = useState<string>('25');
    const [distanceInterval, setDistanceInterval] = useState<string>('1');
    const [alert, setAlert] = useState<boolean>(false);

    LogBox.ignoreLogs(['Non-serializable values were found in the navigation state',]);

    const handleClick = () => {
        if (parseFloat(samplingRate.toString()) > 0 && parseFloat(recordingTime.toString()) > 0) {
            switch (route.params.sensor) {
                case 'Accelerometer':

                    navigation.navigate('MqttMessagerScreenForAccelerometer', { ...route.params, sampleRate: parseFloat(samplingRate), recordingTime: parseFloat(recordingTime) })
                    break;
                case 'Orientation':
                    navigation.navigate('MqttMessagerScreenForGyrosope', { ...route.params, sampleRate: parseFloat(samplingRate), recordingTime: parseFloat(recordingTime) })
                    break;
                case 'Geolocation':
                    navigation.navigate('MqttMessagerScreenForGeolocation', { ...route.params, sampleRate: parseFloat(samplingRate), recordingTime: parseFloat(recordingTime), distanceInterval: parseFloat(distanceInterval) })
                    break;
                case 'Motion':
                    navigation.navigate('MqttMessagerScreenForMotion', { ...route.params, sampleRate: parseFloat(samplingRate), recordingTime: parseFloat(recordingTime) })
                    break;
                default:
                    console.log(route.params.sensor)
                    break;
            }
        }
        else {
            setAlert(true);
        }
    }
    const onCheckTextInput = (fn: React.Dispatch<React.SetStateAction<string>>, text: string) => {
        let newText = '';
        let numbers = '0123456789';

        for (var i = 0; i < text.length; i++) {
            if (numbers.indexOf(text[i]) > -1) {
                newText = newText + text[i];
            }

        }
        fn(newText);
    }

    return (
        <>
            <HeaderComponent route={route} navigation={navigation} />

            <View style={styles.container}>
                <View style={[styles.inputcontainer, { justifyContent: 'space-around' }]}>
                    <Text style={styles.label} >Sampling rate (times x sec)</Text>
                    <TextInput style={styles.textInput} keyboardType='numeric' onChangeText={(text) => { onCheckTextInput(setSamplingRate, text) }} value={samplingRate} />
                    <Text style={styles.label} >Recording Time (sec)</Text>
                    <TextInput style={styles.textInput} keyboardType='numeric' onChangeText={(text) => { onCheckTextInput(setRecordingTime, text) }} value={recordingTime} />
                    {route.params.sensor === 'Geolocation' ?
                        <>
                            <Text style={styles.label} >Distance Interval in meters</Text>
                            <TextInput style={styles.textInput} keyboardType='numeric' onChangeText={(text) => { onCheckTextInput(setDistanceInterval, text) }} value={distanceInterval} />
                        </>
                        : null}
                    <InputFooter HomeProps={{ route, navigation }} handleSend={handleClick} buttonText='Next' />

                </View>
                {alert ? <Text style={{ color: 'red', fontSize: 14, margin: 5, }}>Recording time and Sampling rate can not be 0, or negative</Text> : null}

            </View>
        </>
    )
}