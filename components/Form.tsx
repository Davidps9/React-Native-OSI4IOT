import { Image, ImageBackground, ImageSourcePropType, TouchableOpacity } from 'react-native';
import { Pressable, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ParamList } from '../types';
import styles from '../Styles/styles';

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
				console.log('json: ', responseJson)
				console.log('status code: ', responseStatus)
				responseStatus == 200 ?

					navigation.navigate('MainScreen', { userName: responseJson.userName, PlatformDomain: platform, accessToken: responseJson.accessToken, password: password })
					:
					setLogin(true)

			}, (error) => {
				console.log(error)
				setLogin(true)
			})

		}
		console.log('name: ', name);
		console.log('password: ', password);

	}

	// Hacer que la imagen se esconda cuando salga el keyboard

	return (

		<ImageBackground source={bg_url} resizeMode='cover' style={{ width: '100%', height: '100%', }}>
			<View style={styles.container}>
				<Image source={img_url} style={styles.img} />
				<Text style={{ fontSize: 30, color: '#fff', }}>Login </Text>
				<View style={styles.inputcontainer}>
					<Text style={styles.label} >Platform Domain</Text>
					<TextInput style={styles.textInput} onChangeText={(text) => { setPlatform(text) }} value={platform} placeholder='CIMNE' placeholderTextColor={'grey'} />
					<Text style={styles.label} >Username</Text>
					<TextInput style={styles.textInput} onChangeText={(text) => { setName(text) }} value={name} placeholder='John Whick' placeholderTextColor={'grey'} />
					<Text style={styles.label} >Password</Text>
					<TextInput style={styles.textInput} onChangeText={(text) => { setPassword(text) }} value={password} placeholder='safe-password' placeholderTextColor={'grey'} secureTextEntry={true} />
					<TouchableOpacity style={styles.button} onPressIn={handleClick} >
						<Text style={styles.textbutton}>SIGN IN</Text>
					</TouchableOpacity>
				</View>
				<Text style={logInMessage ? { color: 'red', fontSize: 14, margin: 5, } : { display: 'none', }}>User name, password or platform domain are incorrect</Text>
			</View>
		</ImageBackground>


	)
}

