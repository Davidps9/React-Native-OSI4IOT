
export default function getTimeStamp(setTimestamp: React.Dispatch<React.SetStateAction<string | undefined>>) {
    const date = new Date();
    setTimestamp(date.toJSON());
}