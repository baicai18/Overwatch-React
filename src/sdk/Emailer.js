import fetcher from '../fetcher';
var Emailer = {
    sendTestEmail: (emailOptions, toEmail)=> {
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?(window.location.origin+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/emailer/test', {
                    method: 'POST',
                    body:JSON.stringify({
                        emailOptions:emailOptions,
                        toEmail:toEmail
                    })
                })
                if(response.ok){
                    resolve(await response.json())
                }else{
                    reject(await response.text())
                }
            }catch(err){

            }
        });
        
    },
}

export default Emailer;
// module.exports = Emailer;