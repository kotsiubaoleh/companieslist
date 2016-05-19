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
            
            var $companyList = $("#company-list");
            $companyList.html("");
            var ul = companies.render();
            if (ul) $companyList.append(ul);
            
        });
    }
    
    var $selectedItem;

    $("#company-list").on("click","li",function(event) {
        if ($selectedItem) deselectItem();
        $selectedItem = $(event.target).closest("li");
        this.classList.add("selected");
          
        if (!$selectedItem.get(0).company.hasChildren()) {
            $("#add-form input.btn-remove").prop("disabled", false);
        } else {       
            $("#add-form input.btn-remove").prop("disabled", true);
        }
    });
    
    function deselectItem() {
        if ($selectedItem) $selectedItem.removeClass("selected");
        $selectedItem = null;
        $("#add-form input.btn-remove").prop("disabled", true);
    }
    
   
    
    function validateNotEmpty($input) {
        if($input.val() !== "") {
            $input.removeClass("invalid");
            return true;
        } 
        else {
            $input.addClass("invalid");
            return false;
        } 
    };
    
    function validateNumber($input) {
        if ($.isNumeric($input.val())) {
            $input.removeClass("invalid");
            return true;
        }
        else {
            $input.addClass("invalid");
            return false;
        }
    };
    
     $("#app").on("click", function(e) {
         if (!$(e.target).closest("li").length) {
            deselectItem();
         }
    });
    
    //Click handler for "Add" button
    $("#add-form input.btn-add").click(function(e) {
        e.preventDefault();
        
        var $companyNameInput = $("#add-form input[name=companyname]");
        var $earningsInput = $("#add-form  input[name=earnings]");
               
        if (!validateNotEmpty($companyNameInput) 
            | !validateNumber($earningsInput)) return;
        
        var parentId = null;
        if ($selectedItem) parentId = $selectedItem.get(0).company.getId();
        
        var data = JSON.stringify({
            name: $companyNameInput.val(),
            earnings: $earningsInput.val(),
            parent: parentId
            })
        
        xhr.addCompany(data, function() {
            $("#form-add input[type=text]").val("");
            loadCompanies();
        }); 
        deselectItem();
    });
     
    //Click handler for "Remove" button
    $("#add-form input.btn-remove").on("click", function(e){
        e.preventDefault();
        
        if (!$selectedItem) return;
        
        xhr.removeCompany($selectedItem.get(0).company.getId(), function() {
            loadCompanies();
        });
        
        deselectItem();
    });
    
    //Click handler for "Edit" button
    $("#add-form input.btn-edit").click(function(e){
        e.preventDefault();
        
        if (!$selectedItem) return;
        
        var $companyNameInput = $("#add-form input[name=companyname]");
        var $earningsInput = $("#add-form  input[name=earnings]");
        
        if (!validateNotEmpty($companyNameInput) 
            | !validateNumber($earningsInput)) return;
        
        var data = JSON.stringify({
            name: $companyNameInput.val(),
            earnings: $earningsInput.val()
            })
        
        xhr.editCompany($selectedItem.get(0).company.getId(), data, function() {
            loadCompanies();
        });
        
        deselectItem();
    });
    
    loadCompanies();
})();