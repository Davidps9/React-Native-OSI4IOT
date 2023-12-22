import { SetStateAction, useEffect } from "react";


export const getData = ((setData: React.Dispatch<SetStateAction<any>>, url: string, accessToken: string) => {

    fetch(url, {
        method: 'get',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        }
    }).then((response) => { return response.json(); })
        .then(json => {
            setData(json);

        }, (error) => {
            console.log(error)
        })
})