import fetcher from '../fetcher';
var Emailer = {
    sendTestEmail: (emailOptions, toEmail)=> {
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher(process.env.REACT_APP_APISERVER + '/api/emailer/test', {
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