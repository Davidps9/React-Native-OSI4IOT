import { Text, View, Image, ImageSourcePropType, Pressable, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ParamList, Sensor, TopicType } from '../types';
import styles from '../Styles/styles';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import Paho from 'paho-mqtt';
import { SetStateAction, useEffect, useState } from 'react';
import { GetData } from '../utils/GetData';
import OptionsPicker, { optionKeys } from './OptionsPicker';
import { Picker } from '@react-native-picker/picker';
import HeaderComponent from './Generics/Header';

enum ChangedValue {
    'OrganizationAcronym',
    'GroupAcronym',
    'Device',
    'Sensor'
}



type MainScreenProps = NativeStackScreenProps<ParamList, 'MainScreen'>

export default function Example({ route, navigation }: MainScreenProps) {




    const { accessToken } = route.params;

    const [selectedOrganization, setSelectedOrganization] = useState<string>('');
    const [selectedMobileDevice, setSelectedMobileDevice] = useState<string>('');
    const [selectedSensor, setSelectedSensor] = useState<string>('');
    const [selectedGroup, setSelectedGroup] = useState<string>('');

    const [sensors, setSensors] = useState<Sensor[]>([
        { name: 'Accelerometer', sensor: Accelerometer },
        { name: 'Quaternion', sensor: Gyroscope }
    ]);


    const [topics, setTopics] = useState<TopicType[]>([]);

    //mqtt states
    const [connected, setConnected] = useState(false); // estado para saber si esta conectado o no
    const [groupHash, setGroupHash] = useState<string>('');
    const [topicHash, setTopicHash] = useState<string>('');
    const [topicType, setTopicType] = useState<string>('dev2pdb_wt');
    const [topicString, setTopicString] = useState<string>('');
    const [mqttClient, setMqttClient] = useState<Paho.Client | null>(null);
    function handleConnect() {
        const url = 'dicapuaiot.com';
        const clientId = 'mqttx_9147d94e';
        const client = new Paho.Client(url, Number(9001), clientId);

        //Cambiar el tópico
        client.connect({
            useSSL: true,
            userName: route.params.userName,
            password: route.params.password,

            onSuccess: function () {
                setConnected(true);
                setMqttClient(client);
            },
            onFailure: (error: any) => {
                setConnected(false);
                console.log(error)
            },

        });
    }

    useEffect(() => {
        GetData(setTopics, `https://dicapuaiot.com/admin_api/topics_in_mobile/user_managed`, accessToken);
    }, [])

    useEffect(() => {
        if (topics.length > 0) {
            handleConnect();
            setSelectedOrganization(topics[0].orgAcronym);
            console.log('topics: ', topics);
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
            SetValues(ChangedValue.Sensor, selectedSensor, topics, setSelectedMobileDevice);
        }
    }, [selectedSensor])

    const SetValues = (changedValue: ChangedValue, value: string, localtopics: TopicType[], setNextValue: React.Dispatch<SetStateAction<string>>, compareValueArr?: Sensor[]) => {

        switch (changedValue) {
            case ChangedValue.OrganizationAcronym:
                localtopics.forEach((topic: TopicType) => {
                    if (topic.orgAcronym === value) {
                        setNextValue(topic.groupAcronym);
                    }
                });
                break;
            case ChangedValue.GroupAcronym:
                localtopics.forEach((topic: TopicType) => {
                    if (topic.groupAcronym == value) {
                        setNextValue('Asset_' + topic.assetUid);
                    }
                });
                break;
            case ChangedValue.Device:
                localtopics.forEach((topic: TopicType) => {
                    compareValueArr?.forEach((sensor: Sensor) => {
                        if (compareValueArr != undefined && value.includes(topic.assetUid) && sensor.name.toLocaleLowerCase() == topic.sensorType && selectedGroup == topic.groupAcronym) {
                            setNextValue(sensor.name);
                            setGroupHash(topic.groupUid);
                            setTopicHash(topic.topicUid);
                        }
                    });
                });
                break;
            case ChangedValue.Sensor:
                localtopics.forEach((topic: TopicType) => {
                    if (topic.sensorType == value.toLocaleLowerCase() && selectedGroup == topic.groupAcronym) {
                        console.log('topicId: ', topic.id);
                        setNextValue('Asset_' + topic.assetUid);
                        setGroupHash(topic.groupUid);
                        setTopicHash(topic.topicUid);
                    }
                })
        }

    }


    const handleClick = () => {

        if (mqttClient?.isConnected() && selectedSensor) {
            console.log('topic: ', topicString);
            navigation.navigate('TimeSelectorScreen', { ...route.params, topic: topicString, client: mqttClient, sensor: selectedSensor })
        }

    }

    return (
        <View style={[styles.container, { opacity: 1, }]}>
            <HeaderComponent route={route} navigation={navigation} />
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 20 }}>
                {connected ? <Text style={styles.label}>Connected</Text> : <Text style={styles.label}>Not connected</Text>}
                <View style={[styles.conectionDiv,
                connected ? { backgroundColor: 'lime' } : { backgroundColor: 'red' }]}>
                </View>
            </View>
            <View style={styles.inputcontainer}>
                {topics != null ?
                    <>
                        <Text style={styles.textbutton} >Select Organization</Text>
                        <OptionsPicker options={topics} setSelectedValue={setSelectedOrganization} _label={selectedOrganization} valueType={optionKeys.orgAcronym} />
                        <Text style={styles.textbutton} >Select group</Text>
                        <OptionsPicker options={topics} setSelectedValue={setSelectedGroup} _label={selectedGroup} valueType={optionKeys.groupAcronym} compareValue={selectedOrganization} />
                        <Text style={styles.textbutton} >Select Asset</Text>
                        <OptionsPicker options={topics} setSelectedValue={setSelectedMobileDevice} _label={selectedMobileDevice} valueType={optionKeys.assetUid} compareValue={selectedGroup} />
                        <Text style={styles.textbutton} >Select Sensor</Text>
                        <Picker style={styles.picker}
                            selectedValue={selectedSensor}
                            onValueChange={(itemValue, itemIndex) => setSelectedSensor(itemValue)}
                        >
                            <Picker.Item label='Select an option' value={`Select an option`} />
                            <Picker.Item label='Accelerometer' value={`Accelerometer`} />
                            <Picker.Item label='Gyroscope' value={`Quaternion`} />
                        </Picker>
                        <TouchableOpacity style={[styles.button]} onPress={handleClick}  >
                            <Text style={styles.textbutton} >Next</Text>
                        </TouchableOpacity>
                    </>
                    :

                    <Text>No mobile devices found</Text>
                }


            </View>
        </View>
    )
}
