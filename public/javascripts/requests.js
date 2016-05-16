(function(){
    function makeXHRequest(method, url, data, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open(method,url);
        xhr.onload = function() {
            callback(JSON.parse(xhr.response));
        }
        if (data) {
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        }
        xhr.send(data);
    }
    
    function requestCompanies(callback) {
        makeXHRequest('get', '/companies', null, callback);
    };
    
    function addCompany(data, callback) {
        makeXHRequest('post', '/companies', data, callback);
    };
    
    function removeCompany(id, callback) {
        makeXHRequest('delete', '/companies/' + id, null, callback);
    };
    
    function editCompany(id, data, callback) {
        makeXHRequest('put', '/companies/' + id, data, callback);
    }
    
    window.xhr = {};
    window.xhr.requestCompanies = requestCompanies;
    window.xhr.addCompany = addCompany;
    window.xhr.removeCompany = removeCompany;
    window.xhr.editCompany = editCompany;
    
})();
    