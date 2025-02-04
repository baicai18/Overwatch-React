
import {Users} from './sdk/SDK';
import fetcher from './fetcher';

function Auth(){
        this.isAuthenticated=false;
        this.checkedAuthentication = false;
        this.isSetup=null;
        this.userInfo=null;

        this.checkLogin()
        .then(data=>{
            if(data){
                this.isAuthenticated = true;
                this.checkedAuthentication = true;
            }
        })
        .catch(err=>{
            this.isAuthenticated = false;
            this.checkedAuthentication = true;
        })

}
Auth.prototype.login = async function(username, password){
    return new Promise(async (resolve, reject)=>{
        var body = {
            username:username,
            password:password,
        }
        let url = process.env.REACT_APP_APISERVER + '/api/users/login'
        try{
            var response = await fetcher(url, {
                method:'POST',
                // mode: 'cors', // no-cors, *cors, same-origin
                // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                  'Content-Type': 'application/json'
                  // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                // redirect: 'follow', // manual, *follow, error
                // referrerPolicy: 'no-referrer', // no-referrer, *client
                body: JSON.stringify(body) // body data type must match "Content-Type" header
            })
            console.log(response);
            if(response.ok){
                let json = await response.json();
                
                console.log(json);
                if(json.TOKEN){
                    localStorage.jwt = json.TOKEN;
                    this.getAccountInfo()
                    .then(data=>{
                        resolve(data);
                    })
                }
            }else{
                resolve(false);
            }
        }catch(err){
            throw(err);
        }
    })
    
}
Auth.prototype.authenticate = function(userData, cb, errcb) {
    this.isAuthenticated = true;
    var me = this;
    localStorage.setItem('isAuthenticated', this.isAuthenticated);
    fetch(process.env.REACT_APP_APISERVER + '/api/users/login', {
        method: 'POST',
        body: JSON.stringify(userData),
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
    })
    .then(response=>{
        if(response.ok){
            return response.json()
        }else{
            throw(response);
        }
        
    })
    .then(function(data){
        Users.getMyInfo()
        .then(data=>{
            me.userInfo=data;
            if(cb){
                cb();
    
            }
        })
        
    })
    .catch(async function(err){
        let message = await err.text();
        if(errcb){
            errcb(message);
        }
        
        //console.log(err);
    })

}

Auth.prototype.signout = function(cb) {
    this.isAuthenticated = false;
    localStorage.removeItem('jwt');
    localStorage.removeItem('isAuthenticated');
    fetch(process.env.REACT_APP_APISERVER + '/api/users/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
    })
    .then(response=>response.json(),error=>console.log(error))
    .then(function(data){
        if(cb){
            cb();

        }
    })
    .catch(function(err){
        console.log(err);
    })
    
}
Auth.prototype.getAccountInfo = async function(){
    return new Promise(async (resolve, reject)=>{
        if(localStorage.jwt){
            let url = process.env.REACT_APP_APISERVER + '/api/users/accountInfo'
            try{
                var response = await fetcher(url, {
                    method:'GET',
                    mode: 'cors', // no-cors, *cors, same-origin
                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                    credentials: 'same-origin', // include, *same-origin, omit
                    headers: {
                      'Content-Type': 'application/json'
                      // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    redirect: 'follow', // manual, *follow, error
                    referrerPolicy: 'no-referrer', // no-referrer, *client
                })
                // console.log(response);
                if(response.ok){
                    let json = await response.json();
                    if(json){
                        this.userInfo = json;
                        this.loggedIn = true;
                    }
                }else{
                    //nothing
                }
                this.checkedLogin = true;
                resolve(true);
            }catch(err){
                this.checkedLogin = true;
                console.error(err);
                reject(err);
                //throw(err);
            }
    
        }else{
            this.checkedLogin = true;
            resolve(true);
        }
    })
    
}

Auth.prototype.checkLogin = function(cb){
    var me = this;
    return new Promise((resolve,reject)=>{
        Users.getMyInfo()
        .then(data=>{
            me.userInfo=data;
            resolve(data);
            if(cb){
                cb(data);
            }
        })
        .catch(err=>{
            reject(err);
        })
    })
    
}



const auth =new Auth();


export default auth