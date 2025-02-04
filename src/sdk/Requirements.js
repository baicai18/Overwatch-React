import fetcher from '../fetcher';
var Requirements = {
    getRequirementTypes: ()=>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher(process.env.REACT_APP_APISERVER + '/api/requirements/types');
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
    getRequirements: ()=> {
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher(process.env.REACT_APP_APISERVER + '/api/requirements')
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
    getRequirement: (_id)=> {
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher(process.env.REACT_APP_APISERVER + '/api/requirements/' + _id)
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
    saveRequirement: (requirement)=> {
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher(process.env.REACT_APP_APISERVER + '/api/requirements', {
                    method: 'POST',
                    body:JSON.stringify(requirement),
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
    deleteRequirement: (_id)=> {
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher(process.env.REACT_APP_APISERVER + '/api/requirements/' + _id,{
                    method:'DELETE'
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

export default Requirements;
// module.exports = Requirements;