tableModel.__addTemplate('user','<div class="user-value" data-bind="currentUser: $parent[$data.{data_field}] "></div>',130);
ko.bindingHandlers.currentUser = {  
	init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) { 
		var user = valueAccessor(),
			other = allBindingsAccessor(),
			ctx = bindingContext,
			row = ctx.$parent
		
		if( row.key() == 'new' ) {
			user( current_user.email )
		} 
		other.text = user
	}
}