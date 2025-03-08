import fetcher from '../fetcher';
var RFQTypes = {
    
    getRFQType: (_id)=> {
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?(window.location.origin+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/rfqTypes/' + _id);
                if(response.ok){
                    try{
                        resolve(await response.json());
                    }catch(err){
                        resolve(null);
                    }
                    
                }else{
                    reject(await response.text());
                }
            }catch(err){
                reject(err.message||err);
            }
            
        });
        
    },
    getRFQTypes: ()=> {
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?(window.location.origin+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/rfqTypes');
                if(response.ok){
                    try{
                        resolve(await response.json());
                    }catch(err){
                        resolve(null);
                    }
                    
                }else{
                    reject(await response.text());
                }
            }catch(err){
                reject(err.message||err);
            }
            
        });
        
    },
    saveRFQType: (rfqType)=>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?(window.location.origin+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/rfqTypes', {
                    method: 'POST',
                    body: JSON.stringify(rfqType),
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
    deleteRFQType: (_id)=> {
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?(window.location.origin+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/rfqTypes/' + _id,
                {method:'DELETE'}
                );
                if(response.ok){
                    try{
                        resolve(await response.json());
                    }catch(err){
                        resolve(null);
                    }
                    
                }else{
                    reject(await response.text());
                }
            }catch(err){
                reject(err.message||err);
            }
            
        });
        
    },
}

export default RFQTypes;
// module.exports = RFQTypes;