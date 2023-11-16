import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ParamList } from "../types";
import { useEffect, useState } from "react";
import { Accelerometer, AccelerometerMeasurement } from "expo-sensors";
import { Subscription } from "expo-sensors/build/Pedometer";
import Paho from "paho-mqtt";
import { View, Text, Pressable, TouchableOpacity } from "react-native";
import styles from "../Styles/styles";
import Header from "./Generics/Header";
import CancelButton from "./CancelButton";


type HomeProps = NativeStackScreenProps<ParamList, 'MqttMessagerScreenForAccelerometer'>

type Acceleration = {
    x: number,
    y: number,
    z: number
}

type Payload = {
    timestamp: string,
    mobile_accelerations: Acceleration

}

export default function Mqtt({ navigation, route }: HomeProps) {

    const [accel, setAccel] = useState<Acceleration>({ x: 0, y: 0, z: 0 });

    const client: Paho.Client = route.params.client;

    var message = new Paho.Message(accel.toString());
    const [timestamp, setTimestamp] = useState<string>();

    const [subscribtion, setSubscribtion] = useState<Subscription | null>(null);
    var payload: Payload = ({ timestamp: '', mobile_accelerations: accel });

    const handleSend = () => {

        console.log('topic: ', route.params.topic)
        console.log('user: ', route.params.userName)
        console.log('password: ', route.params.password)
        //cada 1/25 segundos envia el mensaje si esta conectado
        const samplingRate = route.params.sampleRate || 20;
        Accelerometer.setUpdateInterval(1000 / samplingRate);
        setSubscribtion(Accelerometer.addListener((data: AccelerometerMeasurement) => setAccel({ x: data.x, y: data.y, z: data.z })));

    }

    useEffect(() => {
        if (client.isConnected()) {
            getTimestamp();
            payload = ({ timestamp: timestamp!, mobile_accelerations: accel });
            message = new Paho.Message(JSON.stringify(payload));
            message.destinationName = route.params.topic as string;
            client.send(message);
            console.log("onMessageArrived:" + message.payloadString);

        }
    }, [accel])

    const unsubscribe = () => {
        subscribtion && subscribtion.remove();
        setSubscribtion(null);
    }



    function getTimestamp() {
        let date = new Date();
        let _timestamp = date.getFullYear().toString() + '-' + date.getMonth().toString() + '-' + date.getDay().toString() + 'T ' + date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString() + date.getMilliseconds() / 1000 + 'Z';
        setTimestamp(_timestamp);
    }


    return (
        <View style={[styles.container, { opacity: 1 }]}>
            <Header route={route} navigation={navigation} />
            <Text style={styles.label}>Accelerometer Data</Text>

            <View>
                <View style={styles.textcontainer} >
                    <Text style={styles.label}>x: {(accel.x)} </Text>
                    <Text style={styles.label}>y: {(accel.y)} </Text>
                    <Text style={styles.label}>z: {(accel.z)} </Text>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                        <CancelButton navigation={navigation} />
                        <TouchableOpacity onPress={handleSend} style={[styles.button, { width: '45%' }]}  >
                            <Text style={styles.textbutton} >Send</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}