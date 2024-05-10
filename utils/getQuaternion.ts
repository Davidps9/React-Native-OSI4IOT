import { Euler } from "./Threejs/Euler";
import { Quaternion } from "./Threejs/Quaternion";

export default function getQuaternion(euler: Euler) {
    if (euler.isEuler) {
        const newQuaternion: Quaternion = new Quaternion(0, 0, 0, 0);
        newQuaternion.setFromEuler(euler);
        return newQuaternion;
    }
}