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
import SendButton from './generics/SendButton';
import CancelButton from './generics/CancelButton';
import Header from './generics/Header';
import getTimeStamp from '../utils/getTimeStamp';
import getQuaternion from '../utils/getQuaternion';
import Results from './generics/Results';
import InputFooter from './generics/InputFooter';

type HomeProps = NativeStackScreenProps<ParamList, 'MqttMessagerScreenForMotion'>


export default function MqttMotion({ navigation, route }: HomeProps) {
    const [subscribtion, setSubscribtion] = useState<Subscription | null>(null);
    const [euler, setEuler] = useState<Euler>(new Euler(0, 0, 0, 'YXZ'));
    const [quaternion, setQuaternion] = useState<Quaternion>(new Quaternion(0, 0, 0, 0));
    const [accel, setAccel] = useState<Acceleration>([0, 0, 0]);

    const [connected, setConnected] = useState<boolean>(false);
    const samplingRate = route.params.sampleRate || 20;
    const client: Paho.Client = route.params.client;
    const [timestamp, setTimestamp] = useState<string>();

    const payload: PayloadForMotion = ({ timestamp: '', mobile_motion: [0, 0, 0, quaternion._x, quaternion._y, quaternion._z, quaternion._w] });
    const recordingTime = route.params.recordingTime || 10;

    const handleSend = () => {
        DeviceMotion.setUpdateInterval(1000 / samplingRate);
        DeviceMotion.addListener((DeviceMotionData: DeviceMotionMeasurement) => setValues(DeviceMotionData));
        setConnected(true);
        setTimeout(() => {
            unsubscribe();
            DeviceMotion.removeAllListeners();
        }, recordingTime * 1000);
    }

    const setValues = (DeviceMotionData: DeviceMotionMeasurement) => {
        if (DeviceMotionData.acceleration === null || DeviceMotionData.rotation === undefined) return;

        setAccel([DeviceMotionData.acceleration.x as number, DeviceMotionData.acceleration.y as number, DeviceMotionData.acceleration.z as number]);
        setEuler(new Euler(DeviceMotionData.rotation.beta as number, DeviceMotionData.rotation.gamma as number, DeviceMotionData.rotation.alpha as number, 'ZXY'));
    }

    useEffect(() => {
        if (connected && accel) {
            getQuaternion(euler, setQuaternion);
            getTimeStamp(setTimestamp);
            payload.timestamp = timestamp as string;
            payload.mobile_motion = [accel[0] as number, accel[1] as number, accel[2] as number, quaternion._x, quaternion._y, quaternion._z, quaternion._w];
            const message = new Paho.Message(JSON.stringify(payload));
            message.destinationName = route.params.topic as string;
            client.send(message);
        }
    }, [accel, euler])


    const unsubscribe = () => {
        subscribtion && subscribtion.remove();
        setSubscribtion(null);
    }

    return (
        <>
            <Header route={route} navigation={navigation} />

            <View style={styles.container} >
                <Text style={styles.label}>Motion Data</Text>
                <View style={[styles.textcontainer]} >
                    <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 10 }}>
                        <Results labels={["QX", "QY", "QZ", "W"]} data={quaternion.toArray()} fixed />
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 10 }}>
                        <Results labels={["X", "Y", "Z"]} data={accel} fixed />
                    </View>

                    <InputFooter HomeProps={{ route, navigation }} handleSend={handleSend} />
                </View>
            </View>
        </>
    );
}