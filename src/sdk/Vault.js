import fetcher from '../fetcher';
var Vault = {
    getFile: (file)=> {
        return new Promise(async(resolve, reject)=>{
            try{
                let response = await fetcher((process.env.REACT_APP_USE_RELATIVE==="true"?((window.location.protocol + "//" + window.location.hostname)+process.env.REACT_APP_API_SERVER):process.env.REACT_APP_API_SERVER) + '/api/vault/' + file);
                if(response.ok){
                    console.log(response.headers);
                    let blob = await response.blob();
                    var url = window.URL.createObjectURL(blob);
                    var a = document.createElement('a');
                    a.href = url;
                    a.download = response.headers.get('Filename');
                    document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
                    a.click();    
                    a.remove();  //afterwards we remove the element again        
                    // window.location.href = response.url;
                    // resolve(true);                                                                  
                }else{
                    reject(await response.text());
                }
            }catch(err){
                reject(err.message || err);
            }
        });
        
    },
}

export default Vault;
// module.exports = Vault;