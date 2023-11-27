import { View } from "react-native";


export default function ProgressBar({ progress }: { progress: number }) {
    return (
        <View style={{ width: '80%', height: '3%', borderWidth: 1, borderColor: 'red', marginTop: 10, borderRadius: 20 }}>
            <View style={{ width: `${progress}%`, height: '100%', backgroundColor: 'red', borderRadius: 20 }}></View>
        </View>
    )
}