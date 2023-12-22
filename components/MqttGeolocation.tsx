import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Subscription } from "expo-sensors/build/Pedometer";
import { ParamList, PayloadForLocation } from "../types";
import Paho from "paho-mqtt";
import styles from "../Styles/styles";
import Header from "./Generics/Header";
import CancelButton from "./Generics/CancelButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import *  as Location from 'expo-location';
import SendButton from "./Generics/SendButton";

type HomeProps = NativeStackScreenProps<ParamList, 'MqttMessagerScreenForGeolocation'>

export default function MqttGeolocation({ navigation, route }: HomeProps) {
    const [subscribtion, setSubscribtion] = useState<Subscription | null>(null);
    const [connected, setConnected] = useState<boolean>(false);
    const samplingRate = route.params.sampleRate || 20;
    const [location, setLocation] = useState({ longitude: 0, latitude: 0 });
    const client: Paho.Client = route.params.client;
    const [timestamp, setTimestamp] = useState<string>();

    const payload: PayloadForLocation = ({ timestamp: '', longitude: 0, latitude: 0 });
    const recordingTime = route.params.recordingTime || 10;

    const handleSend = () => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                return;
            }
            const wathclocation = await Location.watchPositionAsync({
                timeInterval: 1000 / samplingRate,
                accuracy: Location.Accuracy.Highest,
                distanceInterval: route.params.distanceInterval || 1,
            }, (location) => {
                const { latitude, longitude } = location.coords;
                setLocation({ latitude: latitude, longitude: longitude });
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
        payload.timestamp = timestamp as string;
        payload.longitude = location.latitude;
        payload.latitude = location.longitude;
        const message = new Paho.Message(JSON.stringify(payload));
        message.destinationName = route.params.topic as string;
        client.send(message);
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
            <Text style={styles.label}>Geolocation Coordinates</Text>
            <View style={styles.textcontainer} >
                <Text style={styles.label}>Latitude: {location.latitude} </Text>
                <Text style={styles.label}>Longitude: {location.longitude} </Text>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                    <CancelButton navigation={navigation} />
                    <SendButton text="Send" width={45} handleSend={handleSend} />
                </View>

            </View>

        </View>
    );
}