import { Text } from "react-native"
import styles from "../../styles/styles"

export default function Results({ data, labels, fixed }: { data: number[], labels: string[], fixed?: boolean }) {
    return (
        <>
            {data.map((value, index) => {
                return (
                    <Text style={styles.label} key={index}>{labels[index]}: {fixed ? value.toFixed(6) : value}</Text>
                )
            })}
        </>
    )
}