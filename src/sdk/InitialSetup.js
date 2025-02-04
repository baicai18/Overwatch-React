import fetcher from '../fetcher';
var InitialSetup = {
    resetServer: ()=> {
        return new Promise(async (resolve, reject) =>{
            try{
                let response = await fetcher(process.env.REACT_APP_APISERVER + '/api/initialSetup/resetAllSettings', {
                    method: 'POST'
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
    submitSetup: (data)=> {
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher(process.env.REACT_APP_APISERVER + '/api/initialSetup/', {
                    method: 'POST',
                    body: JSON.stringify(data)
                });
                if(response.ok){
                    resolve(await response.json());
                }else{
                    reject(await response.text());
                }
            }catch(err){
                reject(err.message || err)
            }
        });
        
    },
}

export default InitialSetup;
// module.exports = InitialSetup;