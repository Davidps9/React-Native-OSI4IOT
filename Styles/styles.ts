import { StyleSheet } from 'react-native'
import { Dimensions } from 'react-native';



const styles = StyleSheet.create({

  img: {
    position: 'absolute',
    top: 36,
    left: '30%',
    width: 150,
    height: 36,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    margin: 0,
    padding: 0,
    backgroundColor: 'rgb(0,0,0)',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 1,
    height: Dimensions.get('window').height - 70,
  },
  inputcontainer: {
    position: 'relative',
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    width: 300,
    borderColor: 'rgb(50,116,217)',
    borderWidth: 2,
    borderRadius: 20,
  },
  textInput: {
    fontSize: 18,
    borderColor: '#fff',
    borderWidth: 2,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    color: '#fff',
    width: 250,
  },
  button: {
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgb(50,116,217)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 10
  },
  textbutton: {
    color: '#fff',
    fontWeight: '500',
    padding: 4,
  },
  label: {
    color: '#fff',
    fontSize: 18,
  },
  userNameText: {
    position: 'relative',
    fontSize: 20,
    color: '#fff',

  },
  textcontainer: {
    marginTop: 20,
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
    width: 300,
    borderColor: 'rgb(50,116,217)',
    borderWidth: 1,
    borderRadius: 20,
  },
  picker: {
    border: 'none',
    color: '#000',
    width: '100%',
    backgroundColor: 'rgb(50,116,217)',
  },
  HomeContainer: {
    position: 'relative',
    left: 30,

  },
  logOutContainer: {
    position: 'relative',
    right: 30,

  },
  mqttConnected: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',

    gap: 10,
    padding: 10,
    margin: 0,
  },
  Header: {
    width: '100%',
    height: 70,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'rgb(32,34,38)',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 0,
  },
  conectionDiv: {
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'whitesmoke',
    width: 25,
    height: 25,
  },
  ErrorModal: {
    position: 'relative',
    display: 'flex',
    top: 200,
    left: 40,
    width: '80%',
    padding: 30,
    gap: 20,
    borderWidth: 2,
    borderRadius: 20,
    borderColor: 'rgb(50,116,217)',
    backgroundColor: 'rgb(0,0,0)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles