import fetcher from '../fetcher';
var RFQ = {
    getRFQ: (rfq_number) =>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/rfq/' + rfq_number);
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
    updateRFQInfo: (rfqInfo) =>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/rfq/' + rfqInfo.rfq_number, {
                    method: 'PATCH',
                    body:JSON.stringify(rfqInfo),
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
    getRFQOptions: () =>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/rfq/options');
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
    getRFQForm: () =>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/rfq/options/form');
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
    saveRFQOptionsForm: (form) =>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/rfq/options/form', {
                    method: 'POST',
                    body:JSON.stringify(form),
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
    getCustomerRFQs: (searchParams)=>{
        return new Promise(async (resolve, reject)=>{
            try{
                let url = (process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/rfq'
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
    submitDeliverableBOM: (rfq_number, requirement_id, deliverable_id, bomData)=>{
        return new Promise(async (resolve, reject)=> {
            try{

                var sendData = {
                    requirement_id:requirement_id,
                    deliverable_id:deliverable_id,
                    bomData:bomData
                }
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/rfq/' + rfq_number + '/deliverable/bom', {
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
    submitDeliverableForm: (rfq_number, requirement_id, deliverable_id, formData)=>{
        return new Promise(async (resolve, reject)=>{
            try{
                var sendData = {
                    requirement_id:requirement_id,
                    deliverable_id:deliverable_id,
                    formData:formData
                }
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/rfq/' + rfq_number + '/deliverable/form', {
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
    submitDeliverableFile: (rfq_number, requirement_id, deliverable_id, file)=>{
        return new Promise(async (resolve, reject)=>{
            try{
                const formData = new FormData()
                formData.append('file', file)
                formData.append('requirement_id', requirement_id)
                formData.append('deliverable_id', deliverable_id)
                let response = await fetcher.file((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/rfq/' + rfq_number + '/deliverable/file', {
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
    deleteDeliverableFile: (rfq_number, requirement_id, deliverable_id, file)=>{
        return new Promise(async (resolve, reject)=>{
            try{
                
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/rfq/' + rfq_number + '/deliverable/' + deliverable_id + '/file/' + file, {
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
    cancelRFQ: (rfq_number)=>{
        return new Promise(async (resolve, reject)=> {
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/rfq/' + rfq_number + '/cancel', {
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
    archiveRFQ: (rfq_number, reason, notes)=>{
        return new Promise(async (resolve, reject)=> {
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/rfq/' + rfq_number + '/archive', {
                    method: 'POST',
                    body:JSON.stringify({reason:reason, notes:notes})
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
    unarchiveRFQ: (rfq_number)=>{
        return new Promise(async (resolve, reject)=> {
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/rfq/' + rfq_number + '/unarchive', {
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
    pushBackRFQ: (rfq_number, keepData)=>{
        return new Promise(async (resolve, reject)=> {
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/rfq/' + rfq_number + '/pushback' + (keepData != null?'?keepData=' + keepData.toString():''), {
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
}

export default RFQ;
// module.exports = Projects;