import fetcher from '../fetcher';
var ProductTypes = {
    
    getProductType: (_id)=> {
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?(window.location.origin+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/productTypes/' + _id);
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
    getProductTypes: ()=> {
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?(window.location.origin+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/productTypes');
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
    saveProductType: (productType)=>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?(window.location.origin+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/productTypes', {
                    method: 'POST',
                    body: JSON.stringify(productType),
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
    deleteProductType: (_id)=> {
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?(window.location.origin+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/productTypes/' + _id,
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

export default ProductTypes;
// module.exports = ProductTypes;