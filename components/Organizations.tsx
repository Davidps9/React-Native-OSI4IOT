import { View, Text } from "react-native"
import { OrganizationType, ParamList } from "../types"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import styles from "../Styles/styles"
import { useEffect, useState } from "react"
import LogOutButton from "./Generics/LogOutButton"
import HomeButton from "./Generics/HomeButton"
import NavigationBar from "./Generics/NavigationBar"
import Header from "./Generics/Header"
type HomeProps = NativeStackScreenProps<ParamList, 'OrganizationsScreen'>

export default function Organizations({ navigation, route }: HomeProps) {

    const { accessToken } = route.params;
    const [organizationData, setOrganizations] = useState<OrganizationType | null>(null)

    useEffect(() => {

        fetch('https://dicapuaiot.com/admin_api/organizations/user_managed', {
            method: 'get',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            }
        }).then((response) => { return response.json(); })
            .then(json => {

                console.log('json: ', json)
                setOrganizations(json[0]);

            }, (error) => {
                console.log(error)
            })
    }, [])



    return (
        <View style={[styles.container, { opacity: 1, }]} >
            <Header route={route} navigation={navigation} />
            {organizationData != null ?
                <>
                    <Text style={styles.label} >You belong to:</Text>
                    <View style={styles.table}>
                        {Object.keys(organizationData).map((keyName: string, keyIndex: number) => (
                            <View key={keyIndex} style={styles.tableRow} ><Text style={styles.textbutton} >{keyName} :</Text><Text style={styles.textbutton} > {organizationData[keyName]} </Text></View>

                        ))}
                    </View>
                </>
                :
                <Text style={styles.label} >You don't belong to any organization</Text>
            }

            <NavigationBar navigation={navigation} route={route} />
        </View >
    )
}