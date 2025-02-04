
import fetcher from '../fetcher';
import  XLSX from 'xlsx';
var Search = {
    searchObject: (value)=> {
        return new Promise(async (resolve, reject)=>{
            try{
                let response = await fetcher(process.env.REACT_APP_APISERVER + '/api/search/' + value);
                if(response.ok){
                    resolve(await response.json())
                }else{
                    reject(await response.text());
                }
            }catch(err){
                reject(err.message||err);
            }
        });
    }

}

export default Search;
// module.exports = BOM;