import fetcher from '../fetcher';
var Statuses = {
    findStatuses: (searchParams) =>{
        return new Promise(async (resolve, reject)=>{
            try{

                let url = process.env.REACT_APP_APISERVER + '/api/statuses'
                let query = searchParams?Object.keys(searchParams)
                                .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(searchParams[k]))
                                .join('&'):''

                let response = await fetcher(url+'?'+query);
                if(response.ok){
                    resolve(await response.json());
                }else{
                    reject(await response.text());
                }
            }catch(err){
                reject(err.message||err);
            }
            
        });
    },
    getStatusTypes: (searchParams) =>{
        return new Promise(async (resolve, reject)=>{
            try{

                let url = process.env.REACT_APP_APISERVER + '/api/statuses/statusTypes'
                let query = searchParams?Object.keys(searchParams)
                                .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(searchParams[k]))
                                .join('&'):''

                let response = await fetcher(url+'?'+query);
                if(response.ok){
                    resolve(await response.json());
                }else{
                    reject(await response.text());
                }
            }catch(err){
                reject(err.message||err);
            }
            
        });
    },
    saveStatus: (status)=>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher(process.env.REACT_APP_APISERVER + '/api/statuses', {
                    method: 'POST',
                    body: JSON.stringify(status),
                })
                if(response.ok){
                    resolve(await response.json());
                }else{
                    reject(await response.text());
                }
            }catch(err){
                reject(err.message||err);
            }
        });
    },
    updateStatus: (status)=>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher(process.env.REACT_APP_APISERVER + '/api/statuses', {
                    method: 'PATCH',
                    body: JSON.stringify(status),
                })
                if(response.ok){
                    resolve(await response.json());
                }else{
                    reject(await response.text());
                }
            }catch(err){
                reject(err.message||err);
            }
        });
    },
    getStatus: (process_type, status_code)=>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher(process.env.REACT_APP_APISERVER + '/api/statuses/' + process_type + '/' + status_code)
                if(response.ok){
                    resolve(await response.json());
                }else{
                    reject(await response.text());
                }
            }catch(err){
                reject(err.message||err);
            }
        });
    },
    deleteStatus: (process_type, status_code)=>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher(process.env.REACT_APP_APISERVER + '/api/statuses/' + process_type + '/' + status_code,{
                    method: 'DELETE'
                })
                if(response.ok){
                    resolve(await response.json());
                }else{
                    reject(await response.text());
                }
            }catch(err){
                reject(err.message||err);
            }
        });
    },
    inactivateStatus: (process_type, status_code)=>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher(process.env.REACT_APP_APISERVER + '/api/statuses/' + process_type + '/' + status_code + '/inactivate',{
                    method: 'PATCH'
                })
                if(response.ok){
                    resolve(await response.json());
                }else{
                    reject(await response.text());
                }
            }catch(err){
                reject(err.message||err);
            }
        });
    },
    reactivateStatus: (process_type, status_code)=>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher(process.env.REACT_APP_APISERVER + '/api/statuses/' + process_type + '/' + status_code + '/reactivate',{
                    method: 'PATCH'
                })
                if(response.ok){
                    resolve(await response.json());
                }else{
                    reject(await response.text());
                }
            }catch(err){
                reject(err.message||err);
            }
        });
    },
}

export default Statuses;
// module.exports = Processes;