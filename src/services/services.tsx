export const Formater = (data: any) => {
    const formdata = new FormData()
    Object.keys(data).forEach(_data => formdata.append(_data, data[_data]) )
    return formdata
}

var token = localStorage.getItem("Authorization");

export const request = async (url: string, method: string, data: any) => {
    const host = 'http://localhost:8000/'
    return fetch(host + url, { method: method, body: data, headers: {Authorization: String(token)}})
}
