import { Subscription } from "expo-sensors/build/Pedometer";

export const unsubscribe = ({ subscribtion, setSubscribtion }: { subscribtion: Subscription | null, setSubscribtion: React.Dispatch<React.SetStateAction<Subscription | null>> }) => {
    subscribtion && subscribtion.remove();
    setSubscribtion(null);
}