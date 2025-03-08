function updateOptions(options) {
    const update = { 
        method: 'GET',
        mode:'cors',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        ...options 
    };
    if(process.env.REACT_APP_IGNORE_CERTIFICATE === 'true'){
        update.rejectUnauthorized = false;
    }
    if (localStorage.jwt) {
        update.headers = {
        ...update.headers,
        Authorization: `Bearer ${localStorage.jwt}`
        };
    }else{
        update.headers = {
            ...update.headers,
            };
    }

    console.log(JSON.stringify(update, null, 2));

    return update;
}
var fetcher = function fetcher(url, options) {
    return fetch(url, updateOptions(options));
}
fetcher.file = function(url, options){
    let newOptions = updateOptions(options);
    delete newOptions.headers['Content-Type'];
    return fetch(url, newOptions);
}
export default fetcher