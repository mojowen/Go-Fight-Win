function saveAll (args) {
	var args = typeof args == 'undefined' ? {} : args;
	saving = true;
	var _rows = dataModel.savingRows();
	var _views = dataModel.savingViews();

	if( _rows.length + _views.length > 0 && saving ) {
		saving = false;
		$.post(
			document.location+'/update',
			"rows="+ko.toJSON(_rows)+"&views="+ko.toJSON(_views),
			function(data) {
				var response = JSON.parse(data);
				var _rows = response.rows || [];
				var _views = response.views || [];				

				if( typeof _rows.success != 'undefined'  ) {
					// Some sort of notication for failed save					
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
							view.id = _views[i].id;
							view.slug = _views[i].slug;
							var flat = ko.toJS(view);
							view.dirtyFlag.reset( flat );
						}
					};

					// needs to check if currentView = new view and sets the URL if so
					// 
				}
				saving = true;
				if( !args['once'] ) { saveAll(); }
			},
			function(jqXHR, textStatus, errorThrown) {
				// Come back to this
			}
		);
	}

}