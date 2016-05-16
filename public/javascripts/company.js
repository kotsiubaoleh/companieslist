(function(){
    
    //CompanyContainer class
    function CompanyContainer() {
        this._childCompanies = [];
    };
    
    CompanyContainer.prototype.addChildCompany = function(company) {
            this._childCompanies.push(company);
    };
    
    CompanyContainer.prototype.render = function(onClick) {
        if (!this._childCompanies.length) return null;
        
        var ul = document.createElement('ul');
        
        this._childCompanies.forEach(function (child){
            ul.appendChild(child.render(onClick));
        });
        
        return ul;
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
    
    Company.prototype.render = function(onClick) {
        var li = document.createElement('li');
        
        li.onclick = onClick;
        li.innerText = this._name;
        li.company = this;
        
        var ul = CompanyContainer.prototype.render.call(this, onClick);
        
        var span = document.createElement('span');
        span.innerText = "Annual earnings: " + this._earnings.toLocaleString();
        span.classList.add("earnings");
        span.classList.add("money");
        li.appendChild(span);
        
        if (this.hasChildren()) {
            var span = document.createElement('span');
            span.innerText = "Overall earnings: " + this.getOverallEarnings().toLocaleString();
            span.classList.add("overall-earnings");
            span.classList.add("money");
            li.appendChild(span);
        }
        
        var fragment = document.createDocumentFragment();
        fragment.appendChild(li);
        if (ul) fragment.appendChild(ul);
        
        return fragment;
    }
    
    window.CompanyContainer = CompanyContainer;
    window.Company = Company;
})();