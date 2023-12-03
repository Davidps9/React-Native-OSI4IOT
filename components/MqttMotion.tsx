import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Subscription } from 'expo-sensors/build/Pedometer';
import { useEffect, useState } from 'react';
import { Euler } from '../utils/Threejs/Euler';
import { Quaternion } from '../utils/Threejs/Quaternion';
import Paho from 'paho-mqtt';
import { Acceleration, ParamList, PayloadForMotion, PayloadForQuaternion } from '../types';
import { DeviceMotion, DeviceMotionMeasurement } from 'expo-sensors';
import { View, Text } from 'react-native';
import styles from '../Styles/styles';
import SendButton from './Generics/SendButton';
import CancelButton from './Generics/CancelButton';
import ProgressBar from './Generics/ProgressBar';
import Header from './Generics/Header';


type HomeProps = NativeStackScreenProps<ParamList, 'MqttMessagerScreenForMotion'>


export default function MqttMotion({ navigation, route }: HomeProps) {
    const [subscribtion, setSubscribtion] = useState<Subscription | null>(null);
    const [euler, setEuler] = useState<Euler>(new Euler(0, 0, 0, 'YXZ'));
    const [quaternion, setQuaternion] = useState<Quaternion>(new Quaternion(0, 0, 0, 0));
    const [motion, setMotion] = useState<DeviceMotionMeasurement | null>(null);

    const [connected, setConnected] = useState<boolean>(false);
    const samplingRate = route.params.sampleRate || 20;
    const client: Paho.Client = route.params.client;
    const [timestamp, setTimestamp] = useState<string>();
    const [counter, setCounter] = useState<number>(0);

    const payload: PayloadForMotion = ({ timestamp: '', mobile_motion: [0, 0, 0, quaternion._x, quaternion._y, quaternion._z, quaternion._w] });
    const recordingTime = route.params.recordingTime || 10;

    const handleSend = () => {
        DeviceMotion.setUpdateInterval(1000 / samplingRate);
        DeviceMotion.addListener((DeviceMotionData: DeviceMotionMeasurement) => SetValues(DeviceMotionData));
        setConnected(true);
        setTimeout(() => {
            unsubscribe();
            DeviceMotion.removeAllListeners();
        }, recordingTime * 1000);
    }

    function SetValues(DeviceMotion: DeviceMotionMeasurement) {
        setMotion(DeviceMotion);
    }

    useEffect(() => {
        if (connected) {
            getQuaternion();
            getTimestamp();
            payload.timestamp = timestamp as string;
            payload.mobile_motion = [motion?.accelerationIncludingGravity.x as number, motion?.accelerationIncludingGravity.y as number, motion?.accelerationIncludingGravity.z as number, quaternion._x, quaternion._y, quaternion._z, quaternion._w];
            const message = new Paho.Message(JSON.stringify(payload));
            message.destinationName = route.params.topic as string;
            client.send(message);
            setCounter(counter + (1 / route.params.sampleRate!));
        }
    }, [motion])


    const unsubscribe = () => {
        subscribtion && subscribtion.remove();
        setSubscribtion(null);
    }


    function getQuaternion() {
        const newQuaternion: Quaternion = quaternion;
        newQuaternion.setFromEuler(euler);
        setQuaternion(newQuaternion);
    }

    function getTimestamp() {
        const date = new Date();
        setTimestamp(date.toJSON());
    }




    return (
        <View style={[styles.container, { opacity: 1 }]} >
            <Header route={route} navigation={navigation} />
            <Text style={styles.label}>Gyroscope Data</Text>
            <View style={[styles.textcontainer]} >
                <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 10 }}>
                    <Text style={styles.label}>Qx: {quaternion._x} </Text>
                    <Text style={styles.label}>Qy: {quaternion._y} </Text>
                    <Text style={styles.label}>Qz: {quaternion._z} </Text>
                    <Text style={styles.label}>Qw: {quaternion._w} </Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 10 }}>
                    <Text style={styles.label}>Ax: {motion?.accelerationIncludingGravity.x as number} </Text>
                    <Text style={styles.label}>Ay: {motion?.accelerationIncludingGravity.y as number} </Text>
                    <Text style={styles.label}>Az: {motion?.accelerationIncludingGravity.z as number} </Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                    <CancelButton navigation={navigation} />

                    <SendButton width={45} text="Send" handleSend={handleSend} />

                </View>

            </View>
            <ProgressBar progress={(counter / recordingTime) * 100} />

        </View>
    );
}