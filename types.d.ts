import * as Location from 'expo-location';
import { Quaternion } from './utils/Threejs/Quaternion';
export type Acceleration = [number, number, number];


export type ParamList = {
    Home: ScreenProps,
    MainScreen: ScreenProps,
    TimeSelectorScreen: ScreenProps,
    MqttMessagerScreenForGyrosope: ScreenProps,
    MqttMessagerScreenForAccelerometer: ScreenProps,
    MqttMessagerScreenForGeolocation: ScreenProps,
    MqttMessagerScreenForMotion: ScreenProps,
};

export type PayloadForQuaternion = {
    timestamp: string,
    mobile_quaternion: Quaternion

}

export type PayloadForAcceleration = {
    timestamp: string,
    mobile_accelerations: AccelerometerMeasurement
}

export type PayloadForLocation = {
    longitude: number,
    latitude: number,
    timestamp: string,
}

export type PayloadForMotion = {
    timestamp: string,
    mobile_motion: Motion
}

export type Motion = [number, number, number, number, number, number, number];

export type ScreenProps = {

    userName?: string,
    PlatformDomain?: string,
    accessToken?: string,
    topic?: string,
    message?: string,
    sensor?: string,
    device?: object,
    group?: GroupType,
    topic?: object,
    sampleRate?: number,
    recordingTime?: number,
    client?: any,
    distanceInterval?: number,
}
// type DigitalTwinProps = {
//     index: number,
//     digitalTwin: object,
//     angle: number,
//     navigation: NativeStackScreenProps<ParamList, ScreenNames>,
//     route: NativeStackScreenProps<ParamList, ScreenNames>
// }

type DefaultScreenProps = NativeStackScreenProps<ParamList, ScreenNames>


export type ScreenKeys = ScreenNames;

export type ScreenNames = "Home" | "MainScreen" | "MqttMessagerScreen" | "MovileDevicesScreen" | "OrganizationsScreen" | "ProfileScreen"


export type TopicType = {
    sensorDescription: string;
    id: number,
    orgId: number,
    groupId: number,
    topicType: string,
    topicName: string,
    description: string,
    topicUid: string,
    mqttAccessControl: string,
    created: string,
    updated: string,
    sensorType: string,
    assetUid: string,
    orgAcronym: string,
    groupAcronym: string,
    assetDescription: string,
    groupUid: string,

}
export type Sensor = {
    name: string,
    sensor: typeof Accelerometer | typeof Gyroscope | typeof Location,
    sensorType: string,
}


