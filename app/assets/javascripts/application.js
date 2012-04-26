// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.

//= require jquery
//= require jquery-ui
//= require jquery_ujs
//= require knockout-latest.debug
//= require jquery.multiselect.js
//= require scrollsync.js
//= require_tree ./lib
//= require_tree ./models
//= require_tree ./dependents
//= require_tree ./bindings

// console.log('--------------------------------');
window.onload=function() {
	if( typeof _list != 'undefined' ) {
// var t = new Date();
		load();
		ko.applyBindings(dataModel);
		setBindings();
// var d = new Date();
// console.log('load: '+(d-t));
	} else {
		other_bindings();
	}
	good_other_bindings();
}