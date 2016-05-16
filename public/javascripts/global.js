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
                if (companyMap[key].getParentId()) {
                    companyMap[companyMap[key].getParentId()].addChildCompany(companyMap[key]);
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
        
        if (!selectedItem.company.hasChildren()) {
            //form.removeButton.disabled = true;
            form.removeButton.classList.remove("btn-disabled");
            form.removeButton.classList.add("btn-remove")
            form.removeButton.disabled = false;
        } else {       
            form.removeButton.classList.add("btn-disabled");
            form.removeButton.classList.remove("btn-remove")
            form.removeButton.disabled = true;
        }
    };
    
    function deselectItem() {
        if (selectedItem) selectedItem.classList.remove("selected");
        selectedItem = null;
        
        var form = document.forms.companyForm;
        form.companyname.value = "";
        form.earnings.value = "";
        form.removeButton.classList.add("btn-disabled");
        form.removeButton.classList.remove("btn-remove")
        form.removeButton.disabled = true;
    }
    
   
    
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
    
     document.getElementById("app").addEventListener("click", function(e) {
        deselectItem();
    }, true);
    
    //Click handler for "Add" button
    document.forms.companyForm.addButton.onclick = function(e) {
        e.preventDefault();
        
        var form = document.forms.companyForm;
        
        if (!validateNotEmpty(form.companyname) 
            | !validateNumber(form.earnings)) return;
        
        var parent = null;
        if (selectedItem) parent = selectedItem.company.getId();
        
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
        deselectItem();
    }
     
    //Click handler for "Remove" button
    document.forms.companyForm.removeButton.onclick = function(e){
        e.preventDefault();
        
        if (!selectedItem) return;
        
        xhr.removeCompany(selectedItem.company.getId(), function() {
            loadCompanies();
        });
        
        deselectItem();
    }
    
    //Click handler for "Edit" button
    document.forms.companyForm.editButton.onclick = function(e){
        e.preventDefault();
        
        if (!selectedItem) return;
        
        var form = document.forms.companyForm;
        
        if (!validateNotEmpty(form.companyname) 
            | !validateNumber(form.earnings)) return;
        
        var data = JSON.stringify({
            name: form.companyname.value,
            earnings: form.earnings.value
            })
        
        xhr.editCompany(selectedItem.company.getId(), data, function() {
            loadCompanies();
        });
        
        deselectItem();
    }
    
    loadCompanies();
})();