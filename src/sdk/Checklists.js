import fetcher from '../fetcher';
var Forms = {
    saveChecklistComments: (checklist) =>{
        return new Promise(async function(resolve, reject){
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?(window.location.origin+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/checklists/' + checklist._id + '/comments',{
                    method:'POST',
                    body:JSON.stringify(checklist)
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
    saveChecklistItem: (checklistItem) =>{
        return new Promise(async function(resolve, reject){
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?(window.location.origin+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/checklists/' + checklistItem.checklistId + '/items',{
                    method:'POST',
                    body:JSON.stringify(checklistItem)
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
    checkFormComplete: function(formData, formDesign){
        return new Promise(async(resolve, reject)=>{
            try{
                if(formData && formDesign){
                    let complete = true;
                    for(let x = 0; x < formDesign.formData.fields.length; x++){
                        if(!Forms.checkFieldComplete(formDesign.formData.fields[x], formData[formDesign.formData.fields[x].name])){
                            complete = false;
                            break;
                        }
                    }
                    resolve(complete);
                }
            }catch(err){
                reject(err);
            }
        })
    },
    checkFieldComplete: function(field,value){
        if(field.required){
            if(value == null){
                return false;
            }else{
                switch(field.type){
                    case 'Object':
                        for(let x = 0; x < field.formData.fields.length; x++){
                            if(!Forms.checkFieldComplete(field.formData.fields[x],value[field.formData.fields[x].name])){
                                return false;
                            }
                        }
                        break;
                    case 'List':
                        if(Array.isArray(value)){
                            for(let y = 0; y < value.length; y++){
                                for(let x = 0; x < field.formData.fields.length; x++){
                                    if(!Forms.checkFieldComplete(field.formData.fields[x],value[y])){
                                        return false;
                                    }
                                }
                            }
                        }else{
                            return false;
                        }
                        break;
                    default:
                        break;
                }
                return true;
            }
        }else{
            return true;
        }
    },
    getChecklistDesign: (_id) =>{
        return new Promise(async function(resolve, reject){
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?(window.location.origin+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/checklists/design/' + _id);
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
    getChecklist: (_id) =>{
        return new Promise(async function(resolve, reject){
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?(window.location.origin+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/checklists/' + _id);
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
    
    undoChecklistItem: (checklistItem) =>{
        return new Promise(async function(resolve, reject){
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?(window.location.origin+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/checklists/' + checklistItem.checklistId + '/items/' + checklistItem._id,{
                    method:'DELETE',
                    // body:JSON.stringify(checklistItem)
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

export default Forms;
// module.exports = Projects;