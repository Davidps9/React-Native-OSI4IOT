import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Subscription } from "expo-sensors/build/Pedometer";
import { GeolocotationType, ParamList, PayloadForLocation } from "../types";
import Paho from "paho-mqtt";
import styles from "../Styles/styles";
import Header from "./Generics/Header";
import CancelButton from "./Generics/CancelButton";
import ProgressBar from "./Generics/ProgressBar";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import *  as Location from 'expo-location';
import SendButton from "./Generics/SendButton";

type HomeProps = NativeStackScreenProps<ParamList, 'MqttMessagerScreenForGeolocation'>

export default function MqttGeolocation({ navigation, route }: HomeProps) {
    const [subscribtion, setSubscribtion] = useState<Subscription | null>(null);
    const [connected, setConnected] = useState<boolean>(false);
    const samplingRate = route.params.sampleRate || 20;
    const [location, setLocation] = useState<GeolocotationType>([0, 0]);
    const client: Paho.Client = route.params.client;
    const [timestamp, setTimestamp] = useState<string>();
    const [counter, setCounter] = useState<number>(0);

    const payload: PayloadForLocation = ({ timestamp: '', mobile_geolocation: [0, 0] });
    const recordingTime = route.params.recordingTime || 10;

    const handleSend = () => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                return;
            }
            const wathclocation = await Location.watchPositionAsync({
                timeInterval: 1000 / samplingRate,
                accuracy: Location.Accuracy.Highest
            }, (location) => {
                console.log('location ', location);
                const { latitude, longitude } = location.coords;
                setLocation([latitude, longitude]);
            });

            setSubscribtion(wathclocation);

        })();
        setConnected(true);
        setTimeout(() => {
            unsubscribe();
        }, recordingTime * 1000);
    }

    useEffect(() => {
        if (connected) {
            getTimestamp();


        }
    }, [location])

    useEffect(() => {
        console.log('timestamp ', timestamp);
        payload.timestamp = timestamp as string;
        payload.mobile_geolocation[0] = location[0];
        payload.mobile_geolocation[1] = location[1];
        const message = new Paho.Message(JSON.stringify(payload));
        message.destinationName = route.params.topic as string;
        client.send(message);
        console.log('payload', payload)
        setCounter(counter + (1 / route.params.sampleRate!));
    }, [timestamp])

    const unsubscribe = () => {
        subscribtion && subscribtion.remove();
        setSubscribtion(null);
    }

    function getTimestamp() {
        const date = new Date();
        setTimestamp(date.toJSON());
    }


    return (
        <View style={[styles.container, { opacity: 1 }]} >
            <Header route={route} navigation={navigation} />
            <Text style={styles.label}>Gyroscope Data</Text>
            <View style={styles.textcontainer} >
                <Text style={styles.label}>Latitude: {location[0]} </Text>
                <Text style={styles.label}>Longitude: {location[1]} </Text>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                    <CancelButton navigation={navigation} />
                    <SendButton text="Send" width={45} handleSend={handleSend} />
                </View>

            </View>
            <ProgressBar progress={(counter / recordingTime) * 100} />

        </View>
    );
}