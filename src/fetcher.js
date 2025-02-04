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