import fetcher from '../fetcher';
var Processes = {
    getProcesses: ()=> {
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/processes');
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

export default Processes;
// module.exports = Processes;