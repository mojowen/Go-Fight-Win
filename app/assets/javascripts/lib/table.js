tableModel = function(rows, fields, options) {
	this.__options = options || {
		field: {
			name: 'name',
			data: 'name',
			options: 'options',
			type: 'type'
		},
		widths: {
			ender:  50,
			field: 100
		}
	}
	
	// Templates
	this.__templates = ko.observable({
		gfTable: '<div class="header"><div class="inner" data-bind="style: { width: ( $data.fields.__width()+'+this.__options.widths.ender+')+\'px\' }, template: { name: \'gfT_header\', foreach: fields() }"><div class="ender" style="width: '+this.__options.widths.ender+'px"></div></div></div>'+
			'<div class="body" data-bind="syncScroll: \'.header\'"><div class="inner" data-bind="template: {name: \'gfT_row\', foreach: rows.__trimmed() }, fillTable: true, style: { width: $data.fields.__width()+\'px\' }" ></div></div>',
		gfT_header: '<div class="title entry" data-bind="setTemplateClass: $data.'+this.__options.field.type+'"><span data-bind="text: $data.'+this.__options.field.name+'"></span></div>',
		gfT_row: '<div class="row" data-bind="template: {name: \'gfT_entry\', foreach: $parent.fields() }"></div>',
		gfT_entry: '<div class="entry" data-bind="entryTemplate: {field: $data, row: $parent }, setTemplateClass: $data.'+this.__options.field.type+'"></div>',
		text: '<textarea data-bind="value: $parent[$data.'+this.__options.field.data+'], valueUpdate: \'afterkeydown\'"></textarea>'
	})
	this.__widths = ko.observable({})
	
	// Rows
	this.rows = ko.isObservable(rows) ? rows : ko.observableArray(rows)
	this.rows.__base = ko.observable(20)
	this.rows.__more = ko.computed( function() { return this.rows.__base() <= this.rows().length },this)
	this.rows.__trimmed = ko.computed( function() {
		var __more = this.rows.__more()
		return  __more ? this.rows().slice(0, this.rows.__base() ) : this.rows();
		
	},this)

	// Fields
	this.fields = ko.isObservable(fields) ? fields : ko.observableArray(fields)
	this.fields.__width = ko.computed(function() { 
		var width = 0, fields = this.fields(), widths = this.__widths()
		for (var i=0; i < fields.length; i++) {
			if( typeof widths[ fields[i][ this.__options.field.type] ] == 'undefined' ) width += this.__options.widths.field
			else width += widths[ fields[i][ this.__options.field.type] ]
			width += 4
		};
		return width
	},this)

	this.__addTemplate = function(obj, templateSource ) { 
		if( typeof obj.template != 'undefined' ) {
			if( ko.isObservable(templateSource) ) {
				var templates = ko.toJS(templateSource)
				templates[obj.name] = obj.template.replace(/{data_field}/g,this.__options.field.data).replace(/{option_field}/g,this.__options.field.options)
				templateSource(templates)
			} else {
				templateSource[obj.name] = obj.template.replace(/{data_field}/g,this.__options.field.data).replace(/{option_field}/g,this.__options.field.options)
			}
		}
		if( typeof obj.width != 'undefined' ) {
			var widths = ko.toJS(this.__widths )
			widths[obj.name] = obj.width
			this.__widths( widths)
		}
	}

	this.bind = function(settings) {

		var settings = settings || {},
			options = {
				bind: typeof settings.bind != 'undefined' ? settings.bind : true,
				element: settings.element || document.body,
				templating: typeof settings.template_source == 'undefined',
				templateSource: settings.template_source || this.__templates
			}

		if( typeof this.constructor.__addedTemplates != 'undefined' ) {
			for (var i=0; i < this.constructor.__addedTemplates.length; i++) {
				this.__addTemplate( this.constructor.__addedTemplates[i], options.templateSource )
			};
		}

		if( options.templating ) {
			ko.templateSources.stringTemplate = function(template, templates) {
				this.templateName = template;
				this.templates = templates;
			}

			ko.utils.extend(ko.templateSources.stringTemplate.prototype, {
				data: function(key, value) {
					this.templates._data = this.templates._data || {};
					this.templates._data[this.templateName] = this.templates._data[this.templateName] || {};
					if (arguments.length === 1)  return this.templates._data[this.templateName][key]; 
					this.templates._data[this.templateName][key] = value;
				},
				text: function(value) {
					if (arguments.length === 0) return this.templates[this.templateName]; 
					this.templates[this.templateName] = value;   
				}
			});

			var __templates = this.__templates()

			//modify an existing templateEngine to work with string templates
			function createStringTemplateEngine(templateEngine, templates) {

				templateEngine.makeTemplateSource = function(template) {
					var elem = document.getElementById(template);
					if( elem ) return new ko.templateSources.domElement(elem); // Checks and makes sure it doesn't exist in the Dom
					else if ((template.nodeType == 1) || (template.nodeType == 8)) return new ko.templateSources.anonymousTemplate(template); // Can still render anonymous templates
					else if ( __templates[template] != 'undefined' ) return new ko.templateSources.stringTemplate(template, templates); // If not, renders it out using our templating system
					else throw new Error("Unknown template type: " + template);
				}   
				return templateEngine;
			}

			ko.setTemplateEngine(createStringTemplateEngine(new ko.nativeTemplateEngine(), this.__templates()));

		} else {
			var templates = ko.toJS(this.__templates)
			for (var i in templates ) {
				if( ko.isObservable( options.templateSource ) ) {
					var sources = ko.toJS( options.templateSource )
					options.templateSource(sources)
					sources[i] = templates[i]
				} else {
					options.templateSource[i] = templates[i]
				}
			}
			this.__templates( options.templateSource )
		}

		if( options.bind ) ko.applyBindings( this, options.element );
	}


	// Bindings for the table
	ko.bindingHandlers.gfTable = {  init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) { 
		var all = allBindingsAccessor(),
			value = valueAccessor()
		//all.template = {name: 'gfTable', data: value}
		$(element).addClass('gfTable')
	}}
	ko.bindingHandlers.fillTable = {  init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		var __base = viewModel.rows.__base,
			__more = viewModel.rows.__more(),
			$element = $(element).scrollTop(0),
			$parent = $element.parent()
		setTimeout( function() { if( $element.height() < $parent.height() && __more ) __base( __base() + Math.floor( $parent.height() / $('.entry:first',$element).height() ) ) }, 0 ) // Set a timeout so it renders
		$parent.scroll(function (e) { var $target = $(e.target);  if( e.target.scrollTop + $target.height() > $(element,$target).height() ) { __base(__base() + 10); } });
	}};
	ko.bindingHandlers.syncScroll = { init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		var $element = $(element)
		$element.scroll(function (e) { $element.parents('.table').find('.header').scrollLeft( e.target.scrollLeft ) });
	}};
	ko.bindingHandlers.setTemplateClass = {  init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) { if( typeof bindingContext.$parents.filter( function(el) { return typeof el.__templates != 'undefined' })[0].__templates()[valueAccessor()] != 'undefined' ) $(element).addClass( valueAccessor() ); }}
	ko.bindingHandlers.entryTemplate = {  
		init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) { 
			var options = valueAccessor(),
				row = options.row,
				field = options.field
				other = allBindingsAccessor(),
				ctx = bindingContext,
				template = typeof ctx.$parentContext.$parent.__templates()[ field[ctx.$parentContext.$parent.__options.field.type] ] != 'undefined' ? field[ ctx.$parentContext.$parent.__options.field.type] : 'text'
			other.template = {name: template }
		}
	}

}

tableModel.__addTemplate = function(name,template,width) {
	templateObject = {name: name}
	if( template != undefined ) templateObject.template = template
	if( template != undefined ) templateObject.width = width
	if( typeof this.__addedTemplates == 'undefined' ) {
		this.__addedTemplates = [ templateObject ]
	} else {
		this.__addedTemplates.push( templateObject )
	}
}
