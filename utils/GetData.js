

export function GetData(setData, url, accessToken) {
    let _json = null;
    fetch(url, {
        method: 'get',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        }
    }).then((response) => { return response.json(); })
        .then(json => {
            _json = json;
            setData(_json);

        }, (error) => {
            console.log(error)
        })

}