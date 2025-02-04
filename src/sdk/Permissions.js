import fetcher from '../fetcher';
var Permissions = {
    getAssignablePermissions: ()=> {
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher(process.env.REACT_APP_APISERVER + '/api/permissions/assignable');
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

export default Permissions;
// module.exports = Permissions;