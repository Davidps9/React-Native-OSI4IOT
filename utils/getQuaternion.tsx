import { Euler } from "./Threejs/Euler";
import { Quaternion } from "./Threejs/Quaternion";

export default function getQuaternion(euler: Euler, setQuaternion: React.Dispatch<React.SetStateAction<Quaternion>>) {
    if (euler.isEuler) {
        const newQuaternion: Quaternion = new Quaternion(0, 0, 0, 0);
        newQuaternion.setFromEuler(euler);
        setQuaternion(newQuaternion);
    }
}