import fetcher from '../fetcher';
var PurchaseOrders = {
    getPurchaseOrder: (purchaseOrderNumber) =>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher(process.env.REACT_APP_APISERVER + '/api/purchaseOrders/' + purchaseOrderNumber);
                if(response.ok){
                    try{
                        resolve(await response.json());
                    }catch{
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
    updatePurchaseOrderInfo: (purchaseOrderInfo) =>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher(process.env.REACT_APP_APISERVER + '/api/purchaseOrders/' + purchaseOrderInfo.purchaseOrderNumber, {
                    method: 'PATCH',
                    body:JSON.stringify(purchaseOrderInfo),
                });
                if(response.ok){
                    try{
                        resolve(await response.json());
                    }catch{
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
    getPurchaseOrderOptions: () =>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher(process.env.REACT_APP_APISERVER + '/api/purchaseOrders/options');
                if(response.ok){
                    try{
                        resolve(await response.json());
                    }catch{
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
    getPurchaseOrderForm: () =>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher(process.env.REACT_APP_APISERVER + '/api/purchaseOrders/options/form');
                if(response.ok){
                    try{
                        resolve(await response.json());
                    }catch{
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
    savePurchaseOrderOptionsForm: (form) =>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher(process.env.REACT_APP_APISERVER + '/api/purchaseOrders/options/form', {
                    method: 'POST',
                    body:JSON.stringify(form),
                });
                if(response.ok){
                    try{
                        resolve(await response.json());
                    }catch{
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
    getPurchaseOrderChecklist: () =>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher(process.env.REACT_APP_APISERVER + '/api/purchaseOrders/options/checklist');
                if(response.ok){
                    try{
                        let data = await response.json();
                        resolve(data);
                    }catch{
                        resolve(null);
                    }
                    // resolve(await response.json());
                }else{
                    reject(await response.text());
                }
            }catch(err){
                reject(err.message||err);
            }
        });
    },
    savePurchaseOrderOptionsChecklist: (checklist) =>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher(process.env.REACT_APP_APISERVER + '/api/purchaseOrders/options/checklist', {
                    method: 'POST',
                    body:JSON.stringify(checklist),
                });
                if(response.ok){
                    try{
                        resolve(await response.json());
                    }catch{
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
    getPurchaseOrderNotifications: () =>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher(process.env.REACT_APP_APISERVER + '/api/purchaseOrders/options/notifications');
                if(response.ok){
                    try{
                        resolve(await response.json());
                    }catch{
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
    savePurchaseOrderOptionsNotifications: (notifications) =>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher(process.env.REACT_APP_APISERVER + '/api/purchaseOrders/options/notifications', {
                    method: 'POST',
                    body:JSON.stringify(notifications),
                });
                if(response.ok){
                    try{
                        resolve(await response.json());
                    }catch{
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
    submitPurchaseOrder:(quotationNumber, data, formData, files)=>{
        return new Promise(async(resolve, reject)=>{
            try{
                let fileForm = new FormData()
                fileForm.append('data', JSON.stringify(data))
                fileForm.append('formData', JSON.stringify(formData))
                // if(files.length > 0){
                //     for(let x = 0; x < files.length; x++){
                //         fileForm.append('file', files[x])
                //     }
                // }
                
                let response = await fetcher.file(process.env.REACT_APP_APISERVER + '/api/quotations/' + quotationNumber + '/purchaseOrder', {
                    method: 'post',
                    body:fileForm
                });
                if(response.ok){
                    try{
                        resolve(await response.json());
                    }catch{
                        resolve(null);
                    }
                }else{
                    reject(await response.text());
                }
            }catch(err){
                reject(err.message||err);
            }
        })
    },

    submitPurchaseOrderFile: (purchaseOrderNumber, file)=>{
        return new Promise(async (resolve, reject)=>{
            try{
                const formData = new FormData()
                formData.append('file', file)
                let response = await fetcher.file(process.env.REACT_APP_APISERVER + '/api/purchaseOrders/' + purchaseOrderNumber + '/file', {
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
    approvePurchaseOrder: (purchaseOrderNumber) =>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher(process.env.REACT_APP_APISERVER + '/api/purchaseOrders/' + purchaseOrderNumber + '/approve', {
                    method: 'POST',
                });
                if(response.ok){
                    try{
                        resolve(await response.json());
                    }catch{
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
    generateChecklistID: (purchaseOrderNumber) =>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher(process.env.REACT_APP_APISERVER + '/api/purchaseOrders/' + purchaseOrderNumber + '/checklistID', {
                    method: 'POST',
                });
                if(response.ok){
                    try{
                        resolve(await response.json());
                    }catch{
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
    pushBackPurchaseOrder: (purchaseOrderNumber, keepData)=>{
        return new Promise(async (resolve, reject)=> {
            try{
                let response = await fetcher(process.env.REACT_APP_APISERVER + '/api/purchaseOrders/' + purchaseOrderNumber + '/pushback' + (keepData != null?'?keepData=' + keepData.toString():''), {
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
    deleteFile: (purchaseOrderNumber, file)=>{
        return new Promise(async (resolve, reject)=>{
            try{
                
                let response = await fetcher(process.env.REACT_APP_APISERVER + '/api/purchaseOrders/' + purchaseOrderNumber + '/file/' + file, {
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

}

export default PurchaseOrders;
// module.exports = Projects;