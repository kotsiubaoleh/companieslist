(function() {
   
    //Requests companies list, converts it to hierarchical node structure and adds to DOM;
    function loadCompanies() {
            xhr.requestCompanies(function(response) { 
            var companyMap = {};
            
            response.forEach(function(item){
                var company = new Company(item.id, item.name, item.earnings, item.parent);
                companyMap[item.id] = company;    
            });  
            
            companies = new CompanyContainer();
                 
            for(key in companyMap) {      
                if (companyMap[key].parentId) {
                    companyMap[companyMap[key].parentId].addChildCompany(companyMap[key]);
                } else {
                    companies.addChildCompany(companyMap[key])
                }
            }
            
            var companyList = document.getElementById("company-list");
            companyList.innerHTML = "";
            var ul = companies.render(selectItem);
            if (ul) companyList.appendChild(ul);
            
        });
    }
    
    var selectedItem;

    function selectItem() {
        if (selectedItem) deselectItem();
        selectedItem = this;
        this.classList.add("selected");
        
        var form = document.forms.companyForm;
        form.companyname.value = selectedItem.company.name;
        form.earnings.value = selectedItem.company.earnings;
    };
    
    function deselectItem() {
        if (selectedItem) selectedItem.classList.remove("selected");
        selectedItem = null;
        
        var form = document.forms.companyForm;
        form.companyname.value = "";
        form.earnings.value = "";
    }
    
    document.getElementById("app").addEventListener("click", function(e) {
        deselectItem();
    }, true);
    
    function validateNotEmpty(input) {
        if(input.value !== "") {
            input.classList.remove("invalid");
            return true;
        } 
        else {
            input.classList.add("invalid");
            return false;
        } 
    };
    
    function validateNumber(input) {
        if (!isNaN(parseFloat(input.value)) && isFinite(input.value)) {
            input.classList.remove("invalid");
            return true;
        }
        else {
            input.classList.add("invalid");
            return false;
        }
    };
    
    //Click handler for "Add" button
    document.getElementById("btn-add").onclick = function(e) {
        e.preventDefault();
        
        var form = document.forms.companyForm;
        
        if (!validateNotEmpty(form.companyname) 
            | !validateNumber(form.earnings)) return;
        
        var parent = null;
        if (selectedItem) parent = selectedItem.company.id;
        
        var data = JSON.stringify({
            name: form.companyname.value,
            earnings: form.earnings.value,
            parent: parent
            })
        
        xhr.addCompany(data, function() {
            form.companyname.value = "";
            form.earnings.value = "";
            loadCompanies();
        }); 
    }
     
    //Click handler for "Remove" button
    document.getElementById("btn-remove").onclick = function(e){
        e.preventDefault();
        
        if (!selectedItem) return;
        
        xhr.removeCompany(selectedItem.company.id, function() {
            loadCompanies();
        });
    }
    
    //Click handler for "Edit" button
    document.getElementById("btn-edit").onclick = function(e){
        e.preventDefault();
        
        if (!selectedItem) return;
        
        var form = document.forms.companyForm;
        
        if (!validateNotEmpty(form.companyname) 
            | !validateNumber(form.earnings)) return;
        
        var data = JSON.stringify({
            name: form.companyname.value,
            earnings: form.earnings.value
            })
        
        xhr.editCompany(selectedItem.company.id, data, function() {
            loadCompanies();
        });
    }
    
    loadCompanies();
})();