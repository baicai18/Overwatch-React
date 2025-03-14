import fetcher from '../fetcher';
var Organizations = {
    
    findOrganizations: (searchParams) =>{
        return new Promise(async (resolve, reject)=>{
            try{

                let url = (process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/organizations'
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
    getOrganizationInfo: (organization_name)=>{
        return new Promise(async(resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/organizations/' + organization_name);
                if(response.ok){
                    resolve(await response.json());
                }else{
                    reject(await response.text());
                }
            }catch(err){
                reject(err);
            }
        });
    },
    getUser: email=>{
        return new Promise(async(resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/organizations/users/' + email);
                if(response.ok){
                    resolve(await response.json());
                }else{
                    reject(await response.text());
                }
            }catch(err){
                reject(err);
            }
        });

    },
    getOrganizationUsers: organization_name=>{
        return new Promise(async(resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/organizations/organization/' + organization_name + '/users');
                if(response.ok){
                    resolve(await response.json());
                }else{
                    reject(await response.text());
                }
            }catch(err){
                reject(err);
            }
        });
    },
    saveNewOrganization: (organization_name)=>{
        return new Promise(async (resolve, reject)=>{
            let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/organizations/' + organization_name, {
                method: 'POST'
            })
            if(response.ok){
                resolve(true);
            }else{
                reject(await response.text());
            }
        });
    },
    updateOrganization: (organization_name, orgInfo)=>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/organizations/' + organization_name, {
                    method: 'PATCH',
                    body: JSON.stringify(orgInfo),
                });
                if(response.ok){
                    resolve(await response.json());
                }else{
                    reject(await response.text());
                }
            }catch(err){
                reject(err.message||err)
            }
        });
        
    },
    saveUser: (organization_name, userInfo)=>{
        return new Promise(async (resolve, reject)=>{
            let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/organizations/' + organization_name + '/users', {
                method: 'POST',
                body: JSON.stringify(userInfo),
            })
            if(response.ok){
                resolve(await response.json());
            }else{
                reject(await response.text());
            }
        });
    },
    saveRole: (organization_name, roleInfo)=>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/organizations/' + organization_name + '/userRoles', {
                    method: 'POST',
                    body: JSON.stringify(roleInfo),
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
    
    resendVerification: (organization_name, email)=> {
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/organizations/' + organization_name + '/users/' + email + '/resendVerification', {
                    method: 'POST',
                });
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
    deleteUser: (organization_name, email)=> {
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/organizations/' + organization_name + '/users/' + email, {
                    method: 'DELETE',
                });
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
    
    inactivateUser: (organization_name, email)=> {
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/organizations/' + organization_name + '/users/' + email + '/inactivate', {
                    method: 'POST',
                });
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
    reactivateUser: (organization_name, email)=> {
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/organizations/' + organization_name + '/users/' + email + '/reactivate', {
                    method: 'POST',
                });
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

    
    lockUser: (organization_name, email)=> {
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/organizations/' + organization_name + '/users/' + email + '/lock', {
                    method: 'POST',
                });
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
    unlockUser: (organization_name, email)=> {
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/organizations/' + organization_name + '/users/' + email + '/unlock', {
                    method: 'POST',
                });
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
    updateUser: (organization_name, email, userInfo)=>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/organizations/' + organization_name + '/users/' + email, {
                    method: 'POST',
                    body: JSON.stringify(userInfo),
                });
                if(response.ok){
                    resolve(await response.json());
                }else{
                    reject(await response.text());
                }
            }catch(err){
                reject(err.message||err)
            }
        });
        
    },
    getOrganizationProjects:(organization_name)=>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/organizations/organization/' + organization_name + '/projects');
                if(response.ok){
                    resolve(await response.json());
                }else{
                    resolve(await response.text());
                }
            }catch(err){
                reject(err.message||err);
            }
        })
    },
    getAddresses: organization_name =>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/organizations/organization/' + organization_name + '/addresses')
                if(response.ok){
                    resolve(await(response.json()));
                }else{
                    reject(await(response.text()));
                }
            }catch(err){
                reject(err.message||err);
            }
            
        });
    },
    getAddress: (organization_name, label) =>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/organizations/organization/' + organization_name + '/addresses/' + label);
                if(response.ok){
                    resolve(await(response.json()));
                }else{
                    reject(await(response.text()));
                }
            }catch(err){
                reject(err.message||err);
            }
        });
    },
    saveAddress: (organization_name, addressInfo)=>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/organizations/' + organization_name + '/addresses', {
                    method: 'POST',
                    body: JSON.stringify(addressInfo),
                })
                if(response.ok){
                    resolve(await(response.json()));
                }else{
                    reject(await(response.text()));
                }
            }catch(err){
                reject(err.message||err);
            }
            
        })
        
    },
    updateAddress: (organization_name, label, addressInfo)=>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/organizations/' + organization_name + '/addresses/' + label, {
                    method: 'POST',
                    body: JSON.stringify(addressInfo),
                });
                if(response.ok){
                    resolve(await(response.json()));
                }else{
                    reject(await(response.text()));
                }
            }catch(err){
                reject(err.message||err);
            }
            
        })
        
    },
    getCustomers: () =>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/organizations/customers');
                if(response.ok){
                    resolve(await(response.json()));
                }else{
                    reject(await(response.text()));
                }
            }catch(err){
                reject(err.message||err);
            }
        });
    },
    deactivateOrganization:(organization_id)=>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/organizations/' + organization_id + '/deactivate', {
                    method: 'PATCH',
                })
                
                if(response.ok){
                    resolve(await response.json());
                }else{
                    reject(await response.text());
                }
            }catch(err){
                reject(err.message||err);
            }
        })
    },
    reactivateOrganization:(organization_id)=>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/organizations/' + organization_id + '/reactivate', {
                    method: 'PATCH',
                })
                
                if(response.ok){
                    resolve(await response.json());
                }else{
                    reject(await response.text());
                }
            }catch(err){
                reject(err.message||err);
            }
        })
    },
    
    checkDeleteOrganization: (organization_id) =>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/organizations/' + organization_id + '/delete');
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
    deleteOrganization: (organization_id)=>{
        return new Promise(async(resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/organizations/' + organization_id, {
                    method: 'DELETE',
                });
                if(response.ok){
                    resolve(await response.json());
                }else{
                    reject(await response.text());
                }
            }catch(err){
                reject(err);
            }
        });
    },
}

export default Organizations;
// module.exports = Organizations;