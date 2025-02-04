import fetcher from '../fetcher';
var Quotations = {
    getQuotation: (quotationNumber) =>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher(process.env.REACT_APP_APISERVER + '/api/quotations/' + quotationNumber);
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
    updateQuotationInfo: (quotationNumber, quationInfo) =>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher(process.env.REACT_APP_APISERVER + '/api/quotations/' + quotationNumber, {
                    method: 'PATCH',
                    body:JSON.stringify(quationInfo),
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
    getQuotationOptions: () =>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher(process.env.REACT_APP_APISERVER + '/api/quotations/options');
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
    getQuotationForm: () =>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher(process.env.REACT_APP_APISERVER + '/api/quotations/options/form');
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
    
    saveQuotationOptions: (form) =>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher(process.env.REACT_APP_APISERVER + '/api/quotations/options', {
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
    saveQuotationOptionsForm: (form) =>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher(process.env.REACT_APP_APISERVER + '/api/quotations/options/form', {
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
    submitQuotation:(rfq_number, quotationNumber, data, formData)=>{
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher(process.env.REACT_APP_APISERVER + '/api/rfq/' + rfq_number + '/quotation', {
                    method: 'post',
                    body:JSON.stringify({
                        quotationNumber:quotationNumber,
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
    pushBackQuotation: (quotation_number, keepData)=>{
        return new Promise(async (resolve, reject)=> {
            try{
                let response = await fetcher(process.env.REACT_APP_APISERVER + '/api/quotations/' + quotation_number + '/pushback' + (keepData != null?'?keepData=' + keepData.toString():''), {
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

export default Quotations;
// module.exports = Projects;