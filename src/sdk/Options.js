import fetcher from '../fetcher';
var Options = {
    getSetupStatus: function (){
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/initialSetup/isSetup');
                if(response.ok){
                    resolve(await response.json());
                }else{
                    reject(await response.text());
                }
            }catch(err){
                console.error(err);
                reject(err.message||err)
            }
        });
        
    },
    saveRFQForm: function(form){
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/rfq/options/form', {
                    method: 'POST',
                    body:JSON.stringify(form)
                })
                if(response.ok){
                    resolve(await response.json());
                }else{
                    reject(await response.text());
                }
            }catch(err){
                reject(err);
            }
        })
    }
}
export default Options;
// module.exports = Options;