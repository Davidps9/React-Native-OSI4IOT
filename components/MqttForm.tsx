import React, { SetStateAction, useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ParamList } from '../types';
import { LogBox, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from '../Styles/styles';
import Header from './Generics/Header';
import HeaderComponent from './Generics/Header';
import CancelButton from './CancelButton';


type MainscreenProps = NativeStackScreenProps<ParamList, 'TimeSelectorScreen'>

export function MqttForm({ navigation, route }: MainscreenProps) {
    const [samplingRate, setSamplingRate] = useState<string>('20');
    const [recordingTime, setRecordingTime] = useState<string>('25');
    const [alert, setAlert] = useState<boolean>(false);

    LogBox.ignoreLogs(['Non-serializable values were found in the navigation state',]);

    const handleClick = () => {
        if (parseFloat(samplingRate.toString()) > 0 && parseFloat(recordingTime.toString()) > 0) {
            switch (route.params.sensor) {
                case 'Accelerometer':

                    navigation.navigate('MqttMessagerScreenForAccelerometer', { ...route.params, sampleRate: parseFloat(samplingRate), recordingTime: parseFloat(recordingTime) })
                    break;
                case 'Quaternion':
                    navigation.navigate('MqttMessagerScreenForGyrosope', { ...route.params, sampleRate: parseFloat(samplingRate), recordingTime: parseFloat(recordingTime) })
                    break;
                case 'Geolocation':
                    navigation.navigate('MqttMessagerScreenForGeolocation', { ...route.params, sampleRate: parseFloat(samplingRate), recordingTime: parseFloat(recordingTime) })
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
        <View style={[styles.container, { opacity: 1 }]}>
            <HeaderComponent route={route} navigation={navigation} />
            <View style={[styles.inputcontainer, { justifyContent: 'space-around' }]}>
                <Text style={styles.label} >Sampling rate (times x sec)</Text>
                <TextInput style={styles.textInput} keyboardType='numeric' onChangeText={(text) => { onCheckTextInput(setSamplingRate, text) }} value={samplingRate} />
                <Text style={styles.label} >Recording Time (sec)</Text>
                <TextInput style={styles.textInput} keyboardType='numeric' onChangeText={(text) => { onCheckTextInput(setRecordingTime, text) }} value={recordingTime} />
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <CancelButton navigation={navigation} />
                    <TouchableOpacity style={[styles.button, { width: '45%' }]} onPress={handleClick}  >
                        <Text style={styles.textbutton} >Next</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={alert ? { color: 'red', fontSize: 14, margin: 5, } : { display: 'none', }}>Recording time and Sampling rate can not be 0, or negative</Text>

        </View>
    )
}