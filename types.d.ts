import * as Location from 'expo-location';

export type ParamList = {
    Home: ScreenProps,
    MainScreen: ScreenProps,
    TimeSelectorScreen: ScreenProps,
    MqttMessagerScreenForGyrosope: ScreenProps,
    MqttMessagerScreenForAccelerometer: ScreenProps,
    MqttMessagerScreenForGeolocation: ScreenProps,
};

export type PayloadForQuaternion = {
    timestamp: string,
    mobile_quaternion: Quaternion

}
export type PayloadForLocation = {
    timestamp: string,
    mobile_geolocation: GeolocotationType


}

type GeolocotationType = [
    longitude: number,
    latitude: number,
]

export type ScreenProps = {

    userName?: string,
    password?: string,
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
}
type DigitalTwinProps = {
    index: number,
    digitalTwin: object,
    angle: number,
    navigation: NativeStackScreenProps<ParamList, ScreenNames>,
    route: NativeStackScreenProps<ParamList, ScreenNames>
}

type DefaultScreenProps = NativeStackScreenProps<ParamList, ScreenNames>


export type ScreenKeys = ScreenNames;

export type ScreenNames = "Home" | "MainScreen" | "MqttMessagerScreen" | "MovileDevicesScreen" | "OrganizationsScreen" | "ProfileScreen"


export type TopicType = {
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


