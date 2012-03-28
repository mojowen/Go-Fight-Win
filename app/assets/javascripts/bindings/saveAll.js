function saveAll (args) {
	var args = typeof args == 'undefined' ? {} : args;
	var _rows = dataModel.savingRows();
	var _views = dataModel.savingViews();
	if( _rows.length + _views.length > 0 && saving() ) {
		saving(false);
		$.post(
			_url+'/update',
			{rows: JSON.parse(ko.toJSON(_rows)), views: JSON.parse(ko.toJSON(_views)) },
			function(data) {
// var t = new Date();
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
								// Creating a comparison to reset the dirty flag
								row.key( _rows[i].key );
								row._tempkey = null;
								_rows[i].data.key = _rows[i].key;
							} else {
								var row = rows.find( parseInt(_rows[i].key) );
							}
							var flat = new rowModel(_rows[i].data);
							if( !row.dirtyFlag.reset( flat ) && false ) {
								console.log('flat row')
								console.log(flat._flatten('json'))
								console.log('row row')
								console.log(row._flatten('json'))
							};
						}
					};
					for (var i=0; i < _views.length; i++) {
						var view = views.find( _views[i].name );
						if( typeof _views[i]['_destroy'] != 'undefined' ) {
							views.remove( view );
						} else {
							var flat = new viewModel(_views[i].data);
							view.id = _views[i].id;
							view.slug = _views[i].slug;
							view.dirtyFlag.__force();
							// if( !view.dirtyFlag.reset( flat ) ) {
								// console.log('flat view')
								// console.log(flat._flatten('json'))
								// console.log('view view')
								// console.log(view._flatten('json'))
							// }
						}
						if( view == dataModel.current.view() ) {
							window.history.pushState('', "Title", _url+'/'+view.to_param());
						}
					};
					// needs to check if dataModel.current.view = new view
					// + sets the URL if saving a new view
					// + change the url if the name has changed
				}
				saving(true);
				if( !args['once'] ) { saveAll(); }
// var d = new Date();
// console.log('saving: '+(d-t));
			}
		);
	}

}