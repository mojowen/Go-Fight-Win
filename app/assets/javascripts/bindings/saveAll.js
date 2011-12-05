function saveAll (args) {
	var args = typeof args == 'undefined' ? {} : args;
	var _rows = dataModel.savingRows();
	var _views = dataModel.savingViews();

	if( _rows.length + _views.length > 0 && saving() ) {
		saving(false);
		$.post(
			_url+'/update',
			"rows="+ko.toJSON(_rows)+"&views="+ko.toJSON(_views),
			function(data) {
				var t = new Date();
				dataModel.flatRows = rows().map( function(elem) { return {key: elem.key(), _tempkey: elem._tempkey }; });
				var response = data;
				var _rows = response.rows || [];
				var _views = response.views || [];
				if( typeof _rows.success != 'undefined'  ) {
					// Some sort of notication for failed save is needed
				} else {
					for (var i=0; i < _rows.length; i++) {
						if( typeof _rows[i]['_destroy'] != 'undefined' ) {
							rows.remove( rows.find( parseInt(_rows[i].key) ) );
						} else {
							if( typeof _rows[i]._tempkey != 'undefined' ) {
								var row = rows.find_temp( parseInt(_rows[i]._tempkey) );
								var flat = ko.toJS(row);
								row.key( _rows[i].key );
								row._tempkey = null;
							} else {
								var row = rows.find( parseInt(_rows[i].key) );
								var flat = ko.toJS(row);
							}
							for (var ii=0; ii < _rows[i].updated.length; ii++) {
								flat[_rows[i].updated[ii].field] = _rows[i].updated[ii].value
							};
							row.dirtyFlag.reset( flat );
						}
					};
					for (var i=0; i < _views.length; i++) {
						var view = views.find( _views[i].name );
						if( typeof _views[i]['_destroy'] != 'undefined' ) {
							views.remove( view );
						} else {
							var flat = new viewModel(_views[i].data);
							view.dirtyFlag.reset( flat );
							view.id = _views[i].id;
							view.slug = _views[i].slug;
						}
						if( view == currentView() ) {
							window.history.pushState('', "Title", _url+'/'+view.to_param());
						}
					};
					// needs to check if currentView = new view
					// + sets the URL if saving a new view
					// + change the url if the name has changed
				}
				saving(true);
				if( !args['once'] ) { saveAll(); }
var d = new Date();
console.log('saving: '+(d-t));
			}
		);
	}

}