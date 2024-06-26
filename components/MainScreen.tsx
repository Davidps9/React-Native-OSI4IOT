import { Text, View, Image, ImageSourcePropType, Pressable, TouchableOpacity, Modal } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ParamList, Sensor, TopicType } from '../types';
import styles from '../Styles/styles';
import { Accelerometer, DeviceMotion, Gyroscope } from 'expo-sensors';
import Paho from 'paho-mqtt';
import { SetStateAction, useEffect, useState } from 'react';
import { getData } from '../utils/getData';
import OptionsPicker, { optionKeys } from './generics/OptionsPicker';
import { Picker } from '@react-native-picker/picker';
import HeaderComponent from './generics/Header';
import * as Location from 'expo-location';
import SendButton from './generics/SendButton';
enum ChangedValue {
    'OrganizationAcronym',
    'GroupAcronym',
    'Device',
    'Sensor'
}



type MainScreenProps = NativeStackScreenProps<ParamList, 'MainScreen'>

export default function MainScreen({ route, navigation }: MainScreenProps) {
    const { accessToken } = route.params;

    const [selectedOrganization, setSelectedOrganization] = useState<string>('');
    const [selectedMobileDevice, setSelectedMobileDevice] = useState<string>('');
    const [selectedSensor, setSelectedSensor] = useState<string>('');
    const [selectedGroup, setSelectedGroup] = useState<string>('');

    const [sensors, setSensors] = useState<Sensor[]>([
        { name: 'Accelerometer', sensor: Accelerometer, sensorType: 'accelerations' },
        { name: 'Orientation', sensor: Gyroscope, sensorType: 'orientation' },
        { name: 'Geolocation', sensor: Location, sensorType: 'geolocation' },
        { name: 'Motion', sensor: DeviceMotion, sensorType: 'motion' }
    ]);


    const [topics, setTopics] = useState<TopicType[]>([]);

    const [mqttError, setMqttError] = useState<string | null>(null);
    const [connected, setConnected] = useState(false);
    const [groupHash, setGroupHash] = useState<string>('');
    const [topicHash, setTopicHash] = useState<string>('');
    const [topicType, setTopicType] = useState<string>('dev2pdb_wt');
    const [topicString, setTopicString] = useState<string>('');
    const [mqttClient, setMqttClient] = useState<Paho.Client | null>(null);
    function handleConnect() {
        const url = route.params.PlatformDomain ? route.params.PlatformDomain : 'dicapuaiot.com';
        const clientId = 'mqttx_9147d94e';
        const client = new Paho.Client(url, Number(9001), clientId);

        client.connect({
            useSSL: true,
            userName: `jwt_${route.params.userName}`,
            password: route.params.accessToken,

            onSuccess: function () {
                setConnected(true);
                setMqttClient(client);
            },
            onFailure: (error: any) => {
                setConnected(false);
                setMqttError(error.errorMessage);
            },

        });
    }

    useEffect(() => {
        getData(setTopics, `https://dicapuaiot.com/admin_api/topics_in_mobile/user_managed`, accessToken as string);

    }, [])

    useEffect(() => {
        if (topics.length > 0) {
            handleConnect();
            setSelectedOrganization(topics[0].orgAcronym);
        }
    }, [topics])

    useEffect(() => {
        if (selectedOrganization) {
            SetValues(ChangedValue.OrganizationAcronym, selectedOrganization, topics, setSelectedGroup)
        }
    }, [selectedOrganization])

    useEffect(() => {
        if (selectedGroup) {
            SetValues(ChangedValue.GroupAcronym, selectedGroup, topics, setSelectedMobileDevice);
        }
    }, [selectedGroup])

    useEffect(() => {
        if (selectedMobileDevice) {
            SetValues(ChangedValue.Device, selectedMobileDevice, topics, setSelectedSensor, sensors);
        }

    }, [selectedMobileDevice])

    useEffect(() => {
        setTopicString(`${topicType}/Group_${groupHash}/Topic_${topicHash}`);
    }, [topicHash, groupHash, topicType])

    useEffect(() => {
        if (selectedSensor) {
            const index = sensors.findIndex((sensor: Sensor) => sensor.name == selectedSensor);
            SetValues(ChangedValue.Sensor, sensors[index].sensorType, topics, null);
        }
    }, [selectedSensor])

    const SetValues = (changedValue: ChangedValue, value: string, localtopics: TopicType[], setNextValue: React.Dispatch<SetStateAction<string>> | null, compareValueArr?: Sensor[]) => {
        switch (changedValue) {
            case ChangedValue.OrganizationAcronym:
                localtopics.forEach((topic: TopicType) => {
                    if (topic.orgAcronym === value && setNextValue != null) {
                        setNextValue(topic.groupAcronym);
                    }
                });
                break;
            case ChangedValue.GroupAcronym:
                localtopics.forEach((topic: TopicType) => {
                    if (topic.groupAcronym == value && setNextValue != null) {
                        setNextValue(topic.assetDescription);
                    }
                });
                break;
            case ChangedValue.Device:
                localtopics.forEach((topic: TopicType) => {
                    compareValueArr?.forEach((sensor: Sensor) => {
                        if (compareValueArr != undefined && setNextValue != null && topic.sensorType.includes(selectedSensor) && selectedGroup == topic.groupAcronym) {
                            setNextValue(sensor.name);
                            setGroupHash(topic.groupUid);
                            setTopicHash(topic.topicUid);

                        }
                    });
                });
                break;
            case ChangedValue.Sensor:
                localtopics.forEach((topic: TopicType) => {
                    if (topic.sensorType.includes(value) && selectedGroup == topic.groupAcronym && selectedMobileDevice == topic.assetDescription) {
                        setGroupHash(topic.groupUid);
                        setTopicHash(topic.topicUid);
                        setTopicType(topic.topicType);

                    }
                })
                break;
        }

    }


    const handleClick = () => {

        if (mqttClient?.isConnected() && selectedSensor != 'Select an option' && topicString.includes(topicHash)) {
            console.log('topic: ', topicString);

            navigation.navigate('TimeSelectorScreen', { ...route.params, topic: topicString, client: mqttClient, sensor: selectedSensor })
        }
    }

    return (
        <>
            <HeaderComponent route={route} navigation={navigation} />

            <View style={styles.container}>
                <View style={mqttError == null ? styles.mqttConnected : { display: 'none', backgroundColor: '#000' }}>
                    {connected ? <Text style={styles.label}>Connected</Text> : <Text style={styles.label}>Not connected</Text>}
                    <View style={[styles.conectionDiv,
                    connected ? { backgroundColor: 'lime' } : { backgroundColor: 'red' }]}>
                    </View>
                </View>
                <View style={mqttError == null ? styles.inputcontainer : { display: 'none', backgroundColor: '#000' }}>
                    {topics != null ?
                        <>
                            <Text style={styles.textbutton} >Select Organization</Text>
                            <OptionsPicker options={topics} setSelectedValue={setSelectedOrganization} _label={selectedOrganization} valueType={optionKeys.orgAcronym} />
                            <Text style={styles.textbutton} >Select Group</Text>
                            <OptionsPicker options={topics} setSelectedValue={setSelectedGroup} _label={selectedGroup} valueType={optionKeys.groupAcronym} compareValue={selectedOrganization} />
                            <Text style={styles.textbutton} >Select Asset</Text>
                            <OptionsPicker options={topics} setSelectedValue={setSelectedMobileDevice} _label={selectedMobileDevice} valueType={optionKeys.assetUid} compareValue={selectedGroup} />
                            <Text style={styles.textbutton} >Select Sensor</Text>
                            <Picker style={styles.picker}
                                selectedValue={selectedSensor}
                                onValueChange={(itemValue, itemIndex) => setSelectedSensor(itemValue)}
                            >
                                <Picker.Item label='Select an option' value={`Select an option`} />
                                {sensors.map((sensor: Sensor, index: number) => {
                                    return (
                                        <Picker.Item key={index} label={sensor.name} value={sensor.name} />
                                    )
                                })}

                            </Picker>
                            <SendButton text='Next' width={100} handleSend={handleClick} />
                        </>
                        :

                        <Text>No mobile devices found</Text>
                    }


                </View>
            </View>
            <Modal visible={mqttError != null} transparent={true} animationType='slide'>
                <View style={styles.ErrorModal}>
                    <Text style={[styles.label, { textAlign: 'center' }]}>There was an error connecting to the server</Text>
                    <SendButton text='Try logging in again' width={80} handleSend={() => navigation.navigate('Home', {})} />

                </View>
            </Modal>
        </>
    )
}
