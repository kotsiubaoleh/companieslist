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
      
    //Company class. Extends CompanyContainer
    function Company(id, name, earnings, parentId) {
        CompanyContainer.call(this);
        
        this.id = id;
        this.name = name;
        this.earnings = earnings;
        this.parentId = parentId;
        
    };
    
    Company.prototype = Object.create(CompanyContainer.prototype);
    Company.prototype.constructor = Company;
    
    Company.prototype.getOverallEarnings = function() {
        var overallEarnings = this.earnings;
        for(var i = 0; i < this._childCompanies.length; i++) {
            overallEarnings += this._childCompanies[i].getOverallEarnings();
        }
        return overallEarnings;
    };
    
    Company.prototype.render = function(onClick) {
        var li = document.createElement('li');
        li.onclick = onClick;
        
        var ul = CompanyContainer.prototype.render.call(this, onClick);
        
        li.innerText = this.name;
        li.company = this;
        
        var span = document.createElement('span');
        span.innerText = "Annual earnings: " + this.earnings.toLocaleString();
        span.classList.add("earnings");
        span.classList.add("money");
        li.appendChild(span);
        
        if (this._childCompanies.length > 0) {
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