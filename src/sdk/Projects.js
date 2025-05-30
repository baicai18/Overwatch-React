import fetcher from '../fetcher';
var Projects = {
    findProjects: (searchParams) =>{
        return new Promise(async (resolve, reject)=>{
            try{

                let url = (process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/projects'
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
    getProjects: () =>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/projects');
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
    getProject: (_id) =>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/projects/' + _id);
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
    checkDeleteProject: (_id) =>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/projects/' + _id + '/delete');
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
    deleteProject: (_id) =>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/projects/' + _id,{
                    method:'DELETE'
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
    newRevision: (project_id, revisionData)=>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/projects/' + project_id + '/revision', {
                    method: 'POST',
                    body:JSON.stringify(revisionData),
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
    saveNewProject: (newProject, organization)=>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/projects', {
                    method: 'POST',
                    body:JSON.stringify(newProject),
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
    submitDeliverableBOM: (project_id, revision_id, requirement_id, deliverable_id, bomData)=>{
        return new Promise(async (resolve, reject)=> {
            try{

                var sendData = {
                    requirement_id:requirement_id,
                    deliverable_id:deliverable_id,
                    bomData:bomData
                }
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/projects/' + project_id + '/' + revision_id + '/deliverable/bom', {
                    method: 'POST',
                    body:JSON.stringify(sendData, function (key, value) {
                        if (key === "parentNode") {
                            return undefined;
                        }
                        return value;
                    }),
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
    submitDeliverableForm: (project_id, revision_id, requirement_id, deliverable_id, formData)=>{
        return new Promise(async (resolve, reject)=>{
            try{
                var sendData = {
                    requirement_id:requirement_id,
                    deliverable_id:deliverable_id,
                    formData:formData
                }
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/projects/' + project_id + '/' + revision_id + '/deliverable/form', {
                    method: 'POST',
                    body:JSON.stringify(sendData),
                })
                if(response.ok){
                    resolve(await response.json());
                }else{
                    reject(await response.text());
                }
            }catch(err){
                console.log(err);
                reject(err);
            }
            
        });
    },
    submitDeliverableFile: (project_id, revision_id, requirement_id, deliverable_id, file)=>{
        return new Promise(async (resolve, reject)=>{
            try{
                const formData = new FormData()
                formData.append('file', file)
                formData.append('requirement_id', requirement_id)
                formData.append('deliverable_id', deliverable_id)
                let response = await fetcher.file((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/projects/' + project_id + '/' + revision_id + '/deliverable/file', {
                    method: 'POST',
                    body: formData
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
    deleteDeliverableFile: (project_id, revision_id, requirement_id, deliverable_id, file)=>{
        return new Promise(async (resolve, reject)=>{
            try{
                
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/projects/' + project_id + '/revision/' + revision_id + '/deliverable/' + deliverable_id + '/file/' + file, {
                    method: 'delete',
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
    requestQuotation:(project_id, revision_id, product_type, order_type, data, formData)=>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/projects/' + project_id + '/' + revision_id + '/quotation', {
                    method: 'post',
                    body:JSON.stringify({
                        product_type:product_type,
                        order_type:order_type,
                        data:data,
                        formData:formData
                    })
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
    getProjectQuotations: (project_id, revision_id) =>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/projects/' + project_id  + '/' + revision_id + '/quotation')
                
                if(response.ok){
                    resolve(await response.json());
                }else{
                    reject(await response.text());
                }
            }catch(err){
                reject(err.message||err);
            }
        });
    },updateItemnumber:(project_id, data)=>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/projects/' + project_id + '/itemnumber', {
                    method: 'PATCH',
                    body:JSON.stringify(data)
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
    updateRevisionNumber:(project_id, revision_id, data)=>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/projects/' + project_id + '/' + revision_id + '/number', {
                    method: 'PATCH',
                    body:JSON.stringify(data)
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
    updateRevisionInfo:(project_id, revision_id, data)=>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/projects/' + project_id + '/' + revision_id, {
                    method: 'PATCH',
                    body:JSON.stringify(data)
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
    deactivateProject:(project_id)=>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/projects/' + project_id + '/deactivate', {
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
    reactivateProject:(project_id)=>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/projects/' + project_id + '/reactivate', {
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
    updateOrganization:(project_id, organization_name, overwriteRFQ)=>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/projects/' + project_id + '/organization/' + organization_name + (overwriteRFQ === true? '/recursive':''), {
                    method: 'PATCH',
                    // body:JSON.stringify(data)
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
    updateProductType:(project_id, product_id)=>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/projects/' + project_id + '/productType/' + product_id, {
                    method: 'PATCH',
                    // body:JSON.stringify(data)
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
    }
}

export default Projects;
// module.exports = Projects;