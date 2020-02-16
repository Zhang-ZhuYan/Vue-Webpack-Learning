import Axios from 'axios'
import showMessage from '../component/message/function'

const axios = Axios.create({
    baseURL: '/'
})

export default function ajax(url, data={}, type="GET"){
    return new Promise((resolve,reject)=>{
        let promise = null;
        if(type === 'GET'){
            promise = axios.get(url,{
                params: data
            });
        }else if(type === 'POST'){
            promise = axios.post(url, data);
        }else if(type === 'PUT'){
            promise = axios.put(url,data);
        }else if(type === 'DELETE'){
            promise = axios.delete(url);
        }

        promise.then(response => {
            resolve(response.data);
        }).catch(err => {
            const resp = err.response
            if (resp.status === 401) {
                resolve({
                    code: 401,
                    success: false,
                    data: {
                        message: '请登录'
                    }
                });
            }else{
                resolve({
                    code: 500,
                    success: false,
                    data: {
                        message: resp
                    }
                })
            }
        })
    })
}