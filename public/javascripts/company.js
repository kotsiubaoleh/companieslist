(function(){
    
    //CompanyContainer class
    function CompanyContainer() {
        this._childCompanies = [];
    };
    
    CompanyContainer.prototype.addChildCompany = function(company) {
            this._childCompanies.push(company);
    };
    
    CompanyContainer.prototype.render = function() {
        if (!this._childCompanies.length) return null;
        
        var $ul = $('<ul></ul>');
        
        this._childCompanies.forEach(function (child){
            $ul.append(child.render());
        });
        
        return $ul;
    };
    
    CompanyContainer.prototype.hasChildren = function() {
        return !!this._childCompanies.length;
    };
      
    //Company class. Extends CompanyContainer
    function Company(id, name, earnings, parentId) {
        CompanyContainer.call(this);
        
        this._id = id;
        this._name = name;
        this._earnings = earnings;
        this._parentId = parentId;
        
    };
    
    Company.prototype = Object.create(CompanyContainer.prototype);
    Company.prototype.constructor = Company;
    
    Company.prototype.getId = function() {return this._id};
    Company.prototype.getName = function() {return this._name};
    Company.prototype.getEarnings = function() {return this._earnings};
    Company.prototype.getParentId = function() {return this._parentId};
    
    Company.prototype.getOverallEarnings = function() {
        var overallEarnings = this._earnings;
        for(var i = 0; i < this._childCompanies.length; i++) {
            overallEarnings += this._childCompanies[i].getOverallEarnings();
        }
        return overallEarnings;
    };
    
    Company.prototype.render = function() {
        var $li = $('<li></li>');
        
        $li.click();
        $li.text(this._name);
        $li.get(0).company = this;
        
        var $ul = CompanyContainer.prototype.render.call(this);
        
        var $span = $('<span></span');
        $span.text("Annual earnings: " + this._earnings.toLocaleString());
        $span.addClass("earnings money");
        $li.append($span);
        
        if (this.hasChildren()) {
            var $span = $('<span></span>');
            $span.text("Overall earnings: " + this.getOverallEarnings().toLocaleString());
            $span.addClass("overall-earnings money");
            $li.append($span);
        }
        
        var $fragment = $(document.createDocumentFragment());
        $fragment.append($li);
        if ($ul) $fragment.append($ul);
        
        return $fragment;
    }
    
    window.CompanyContainer = CompanyContainer;
    window.Company = Company;
})();