import { Image, ImageBackground, ImageSourcePropType, Keyboard, TouchableOpacity } from 'react-native';
import { Pressable, Text, TextInput, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ParamList } from '../types';
import styles from '../Styles/styles';
import SendButton from './generics/SendButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { releaseChannel } from 'expo-updates';

const img_url: ImageSourcePropType = require('../assets/logo_large.png')
const bg_url: ImageSourcePropType = require('../assets/osi4iot_fond.jpg')
type HomeProps = NativeStackScreenProps<ParamList, 'Home'>



// Initialize Firebase

export default function Form({ navigation }: HomeProps) {

	// const auth = appAuth;

	const [name, setName] = useState<string>('')
	const [platform, setPlatform] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const [logInMessage, setLogin] = useState<boolean>(false)
	const [KeyboardIsShown, setKeyboardIsShown] = useState<boolean>(false)

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener(
			'keyboardDidShow',
			() => {
				setKeyboardIsShown(true);
			}
		);
		const keyboardDidHideListener = Keyboard.addListener(
			'keyboardDidHide',
			() => {
				setKeyboardIsShown(false);
			}
		);
		return () => {
			keyboardDidHideListener.remove();
			keyboardDidShowListener.remove();
		};
	}, []);

	const handleClick = () => {
		if (name && password && platform !== '') {

			fetch('https://dicapuaiot.com/admin_api/auth/login', {

				method: 'post',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					'emailOrLogin': name,
					'password': password
				}),

			}).then((response) => {
				const responseJson = response.json();
				const responseStatus = response.status;
				return Promise.all([responseJson, responseStatus]);
			}).then(([responseJson, responseStatus]) => {
				if (!responseJson?.accessToken) { return setLogin(true) }
				setLogin(false);
				AsyncStorage.setItem('loggedIn', JSON.stringify({ userName: responseJson.userName, password: password, userPlatform: platform, lastLog: new Date().getDate() }));
				navigation.navigate('MainScreen', { userName: responseJson.userName, PlatformDomain: platform, accessToken: responseJson.accessToken, password: password })
			}, (error) => {
				console.log(error)
				setLogin(true)
			})

		}

	}

	// Hacer que la imagen se esconda cuando salga el keyboard
	useEffect(() => {
		AsyncStorage.getItem('loggedIn').then((value) => {
			if (value) {
				const { userName, password, userPlatform, lastLog } = JSON.parse(value);
				if (new Date().getDate() - parseInt(lastLog) > 1) {
					AsyncStorage.clear();
				}
				else {
					setName(userName);
					setPassword(password);
					setPlatform(userPlatform);
				}
			}
		})
	}, [])
	return (

		<ImageBackground source={bg_url} resizeMode='cover' style={{ width: '100%', height: '100%', }}>
			<View style={[styles.container, { opacity: 0.7 }, { height: '100%' }]}>
				{!KeyboardIsShown ? <Image source={img_url} style={styles.img} /> : null}
				{!KeyboardIsShown ? <Text style={{ fontSize: 30, color: '#fff', }}>Login </Text> : null}
				<View style={[styles.inputcontainer, { position: KeyboardIsShown ? 'absolute' : 'relative' }, (KeyboardIsShown ? { top: 100 } : null)]}>
					<Text style={styles.label} >Platform Domain</Text>
					<TextInput style={styles.textInput} onChangeText={(text) => { setPlatform(text) }} value={platform} placeholder='CIMNE' placeholderTextColor={'grey'} />
					<Text style={styles.label} >Username</Text>
					<TextInput style={styles.textInput} onChangeText={(text) => { setName(text) }} value={name} placeholder='username' placeholderTextColor={'grey'} />
					<Text style={styles.label} >Password</Text>
					<TextInput style={styles.textInput} onChangeText={(text) => { setPassword(text) }} value={password} placeholder='········' placeholderTextColor={'grey'} secureTextEntry={true} />
					<SendButton text='Sign In' width={100} handleSend={handleClick} />
					<Text style={logInMessage ? { color: 'red', fontSize: 14, margin: 5, position: 'relative', textAlign: 'center' } : { display: 'none', }}>User name, password or platform domain are incorrect</Text>

				</View>
			</View>
		</ImageBackground>


	)
}

