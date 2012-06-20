ko.templateSources.stringTemplate = function(template, templates) {
    this.templateName = template;
    this.templates = templates;
}
ko.templates = {};

ko.applyBindingsAndRegister = function(dataModel) {

    function createStringTemplateEngine(templateEngine, templates) {
        templateEngine.makeTemplateSource = function(template) {
			var elem = document.getElementById(template);
			if (elem) return new ko.templateSources.domElement(elem); // Checks and makes sure it doesn't exist in the Dom
			else if ( (template.nodeType == 1) || (template.nodeType == 8) ) return new ko.templateSources.anonymousTemplate(template); // Can still render anonymous templates
			else if ( typeof ko.templates[template] != 'undefined' ) return new ko.templateSources.stringTemplate(template, templates); // If not, renders it out using our templating system
			else throw new Error("Unknown template type: " + template);
        }
        return templateEngine;
    }

    ko.setTemplateEngine(createStringTemplateEngine(new ko.nativeTemplateEngine(), ko.templates));
    ko.applyBindings(dataModel)
}

ko.utils.extend(ko.templateSources.stringTemplate.prototype, {
    data: function(key, value) {
        this.templates._data = this.templates._data || {};
        this.templates._data[this.templateName] = this.templates._data[this.templateName] || {};
        if (arguments.length === 1) return this.templates._data[this.templateName][key];
        this.templates._data[this.templateName][key] = value;
    },
    text: function(value) {
        if (arguments.length === 0) return this.templates[this.templateName];
        this.templates[this.templateName] = value;
    }
});