const axios = require('axios');
const sha1 = require('sha1')


const httpRequire = axios.create({
    baseURL: 'https://d.apicloud.com/mcm/api'
})

const className = 'todo'; //apicloud上新建的应用名称

const handleRequire = ({status, data, ...rest}) => {
    if(status === 200) {
        return data;
    }else{
        return requireError(status,rest);
    }
}

const requireError = (code,resp) => {
    const err = new Error(resp.message);
    err.code = code;
    return err;
}

module.exports = (appID, appKey) => {
    const getHeader = () => {
        const now = Date.now();
        return {
            'X-APICloud-AppId': appID,
            'X-APICloud-AppKey': `${sha1(`${appID}UZ${appKey}UZ${now}`)}.${now}`
        }
    }
    return {
        async getAllTodo(){
            return handleRequire(await httpRequire.get(`/${className}`,{
                headers: getHeader()
            }))
        },
        async addTodo(todo){
            return handleRequire(await httpRequire.post(`/${className}`,
            todo,
            {
                headers: getHeader()
            }))
        },
        async updateTodo(id, todo){
            return handleRequire( await httpRequire.put(`/${className}/${id}`,
            todo,
            {
                headers: getHeader()
            }))
        },
        async deleteTodo(id){
            return handleRequire( await httpRequire.delete(`/${className}/${id}`,
            {
                headers: getHeader()
            })) 
        },
        async deleteAll(ids){
            const batchRequests = ids.map(id => {
                return {
                    method: 'DELETE',
                    path: `/mcm/api/${className}/${id}`
                }
            });
            return handleRequire(await httpRequire.post(
                '/batch',
                {requests: batchRequests},
                {headers: getHeader()}
            )) 
        }
    }
}
