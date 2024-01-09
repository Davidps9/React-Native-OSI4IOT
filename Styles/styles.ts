import { StyleSheet } from 'react-native'
import { Dimensions } from 'react-native/Libraries/Utilities/Dimensions';



const styles = StyleSheet.create({


  img: {
    position: 'absolute',
    top: 40,
    left: '30%',
    width: 150,
    height: 36,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgb(0,0,0)',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,

  },
  inputcontainer: {
    position: 'relative',
    marginTop: 40,
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
  textInputPressed: {
    color: '#000',
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
  table: {
    display: 'flex',
    flex: 0,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',

  },
  tableRow: {
    color: '#fff',
    width: 350,
    fontSize: 14,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderColor: 'rgb(50,116,217)',
    borderWidth: 1,
    padding: 10,
  },
  NavContainer: {

    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 20,
  },
  NavBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    padding: 10,
    borderTopColor: 'rgb(50,116,217)',
    borderTopWidth: 3,

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
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20
  },
  Header: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 70,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'rgb(32,34,38)',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  RadialMenu: {

    position: 'relative',
    top: 0,
    right: 0,
    width: 60,
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: 'transparent',
    borderColor: 'rgb(50,116,217)',
    borderWidth: 2,

  },
  DigitalTwinIcon: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: 'transparent',
    borderColor: 'rgb(50,116,217)',
    borderWidth: 2,
    width: 60,
    height: 60,


  },
  RadialMenuContainer: {
    position: 'relative',
    top: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 500,
    backgroundColor: 'transparent',
    borderColor: 'rgb(50,116,217)',
    borderWidth: 3,
    width: 350,
    height: 350,

  },


  conectionDiv: {
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'whitesmoke',
    width: 25,
    height: 25,
  },
});

export default styles