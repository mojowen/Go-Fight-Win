describe("Mocking Ajax Calls", function() {
	var field_1, field_2
	beforeEach(function() {
			spyOn($, "post")
			factoryList();
			field_1 = fields()[0].to_param
	});
	it("Shouldn't call values if no change", function() {
			saveAll();
			expect($.post).not.wasCalled();
	});
	it("Shouldn call if there's something to post", function() {
			addRow( new rowModel({key: 'new', list: _list}) );
			saveAll();
			expect($.post).wasCalled();
	});
	it("Should set saving ", function() {
		expect(saving()).toBeTruthy();
		addRow( new rowModel({key: 'new', list: _list}) );
		saveAll({once: true});
		expect(saving()).toBeFalsy();
		$.post.mostRecentCall.args[2]('[]');
		expect(saving()).toBeTruthy();
	});
	it("It sucessfully removes destroyed rows", function() {
		var key1 = rows()[1].key(),
			key2 = rows()[2].key(),
			key3 = rows()[3].key();
		rows.destroy( rows()[1] );
		rows.destroy( rows()[2] );
		rows.destroy( rows()[3] );
		expect( rows()[1].key() ).toEqual(key1);
		expect( rows()[2].key() ).toEqual(key2);
		expect( rows()[3].key() ).toEqual(key3);

		saveAll();
		var rdata1 = JSON.stringify( ko.toJS(rows()[1]) ),
			rdata2 = JSON.stringify( ko.toJS(rows()[2]) ),
			rdata3 = JSON.stringify( ko.toJS(rows()[3]) );
		var returned = '{"rows": [ {"key": "'+key1+'","success": true,"list": "'+_list+'","error": [], "data": '+rdata1+', "_destroy":"true" },{"key": "'+key2+'","success": true,"list": "'+_list+'","error": [], "data": '+rdata2+', "_destroy":"true" },{"key": "'+key3+'","success": true,"list": "'+_list+'","error": [], "data": '+rdata3+', "_destroy":"true" } ], "views":[] }';
		$.post.mostRecentCall.args[2](JSON.parse(returned));

		expect( rows()[1].key() ).not.toEqual(key1);
		expect( rows()[1].key() ).not.toEqual(key2);
		expect( rows()[1].key() ).not.toEqual(key3);
		expect(saving()).toBeTruthy();

	});
	
	it("It sucessfully resets changed rows", function() {
		var key = rows()[1].key()
		rows()[1][field_1]('different');
		expect(rows()[1].dirtyFlag.isDirty()).toBeTruthy();
		saveAll();
		var rdata = JSON.stringify( ko.toJS(rows()[1]) );
		var returned = '{"rows": [ {"key": "'+key+'","success": true,"list": "'+_list+'","error": [], "data": '+rdata+' } ], "views":[] }';
		$.post.mostRecentCall.args[2](JSON.parse(returned));
		expect(rows()[1].dirtyFlag.isDirty()).toBeFalsy();
	});
	
	it("It does not resets changed rows if changed values do not match saved values", function() {
		var key = rows()[1].key()
		rows()[1][field_1]('different');
		expect(rows()[1].dirtyFlag.isDirty()).toBeTruthy();
	
		// Does not reset when passed incorrect value
		saveAll();
		var rdata = JSON.stringify( ko.toJS(rows()[1]) );
		var returned = '{"rows": [ {"key": "'+key+'","success": true,"list": "'+_list+'","error": [], "data": '+rdata+' } ], "views":[] }';
		rows()[1][field_1]('different again');
		$.post.mostRecentCall.args[2](JSON.parse(returned));
		expect(rows()[1].dirtyFlag.isDirty()).toBeTruthy();
		
		// When passed correct value, resets
		saveAll();
		var rdata = JSON.stringify( ko.toJS(rows()[1]) );
		var returned = '{"rows": [ {"key": "'+key+'","success": true,"list": "'+_list+'","error": [], "data": '+rdata+' } ], "views":[] }';
		$.post.mostRecentCall.args[2](JSON.parse(returned));
		expect(rows()[1].dirtyFlag.isDirty()).toBeFalsy();
	});
	it("returns a new row and removes a tempkey", function() {
		var new_row = new rowModel({key: 'new', list: _list});
		addRow( new_row );
		saveAll();
		var rdata = JSON.stringify( ko.toJS(rows()[1]) );
		var returned = '{"rows": [ {"key": "6969","success": true,"list": "'+_list+'","error": [], "data": '+rdata+', "_tempkey":"'+new_row._tempkey+'" } ], "views":[] }';
		$.post.mostRecentCall.args[2](JSON.parse(returned));
		expect(rows()[rows().length-1].key()).not.toEqual('new');
		expect(rows()[rows().length-1]._tempkey).toBeNull();
		expect(rows()[rows().length-1].dirtyFlag.isDirty()).toBeFalsy();
		
		
		// expect(false).toBeTruthy();
	});
	
	// it("adding a view calls post", function() {
	// 		var new_view = viewModel({id: 'new', name: 'new name'});
	// 		views.push(new_view);
	// 		saveAll();
	// 		expect($.post).wasCalled();
	// 	});
	// 	it("adding a view saves a post", function() {
	// 		var new_view = new viewModel({id: 'new', name: 'new name'});
	// 		addView(new_view);
	// 		saveAll();
	// 		flat_view = new_view._flatten();
	// 		var returned = '{"rows": [], "views":[{"id":"69","name":"new name","slug":"tstslug", "data":'+ko.toJSON(flat_view)+' }] }';
	// 		$.post.mostRecentCall.args[2](JSON.parse(returned));
	// 		// expect(dataModel.savingViews().length).toEqual(0);
	// 		expect(views()[0].slug).toEqual("tstslug");
	// 	});
	// 	it("deleting views", function() {
	// 		var new_view = new viewModel({id: 'new', name: 'new name'});
	// 		addView(new_view);
	// 		views.destroy( views()[0] );
	// 		saveAll();
	// 		var returned = '{"rows": [], "views":[{"id":"69","name":"new name","slug":"tstslug","_destroy" : "true" }] }';
	// 		$.post.mostRecentCall.args[2](JSON.parse(returned));
	// 		expect(views()[0]).not.toBeDefined();
	// 	});
	// 	it("restarts itself if there's anything else to save", function() {
	// 		var key = rows()[1].key()
	// 		rows()[1][field_1]('different');
	// 		saveAll();
	// 		var rdata = JSON.stringify( ko.toJS(rows()[1]) );
	// 		var returned = '{"rows": [ {"key": "'+key+'","success": true,"list": "'+_list+'","error": [], "data": '+rdata+' } ], "views":[] }';
	// 		rows()[1][field_1]('different again');
	// 		var new_view = new viewModel({id: 'new', name: 'new name'});
	// 		addView(new_view);
	// 		$.post.mostRecentCall.args[2](JSON.parse(returned));
	// 		expect($.post.mostRecentCall.args[1].rows[0][field_1]).toEqual('different again');
	// 		expect($.post.mostRecentCall.args[1].views[0]['name']).toEqual('new name');
	// 	});
	
	
	describe("resetting data that's changed by the templates", function() {
		beforeEach(function() {
			fields()[0]['field_type'] = 'date';
			fields()[1]['field_type'] = 'number';
			field_2 = fields()[1].to_param
			
		  	field_1['field_type'] = 'date';
			loadFixtures("views/lists/_row.html","views/lists/_table.html");
			ko.applyBindings(dataModel);
		
		});
	  	it("It sucessfully resets changed date rows", function() {

			var key = rows()[1].key();

			rows()[1][field_1]( new Date('2011-12-20T08:00:00.000Z').toDateString() );
			expect(rows()[1].dirtyFlag.isDirty()).toBeTruthy();

			saveAll();

			var rdata = JSON.stringify( ko.toJS(rows()[1]) );
			var returned = '{"rows": [ {"key": "'+key+'","success": true,"list": "'+_list+'","error": [], "data": '+rdata+' } ], "views":[] }';

			$.post.mostRecentCall.args[2](JSON.parse(returned));
			expect( rows()[1].dirtyFlag.isDirty() ).toBeFalsy();
		});
		it("It sucessfully resets changed number", function() {

			var key = rows()[1].key();
			rows()[1][field_2]('99');
			expect(rows()[1].dirtyFlag.isDirty()).toBeTruthy();

			saveAll();
			var rdata = JSON.stringify( ko.toJS(rows()[1]) );
			var returned = '{"rows": [ {"key": "'+key+'","success": true,"list": "'+_list+'","error": [], "data": '+rdata+' } ], "views":[] }';

			$.post.mostRecentCall.args[2](JSON.parse(returned));
			expect( rows()[1].dirtyFlag.isDirty() ).toBeFalsy();
		});
	
	});
	
	
	
	
	// returns 100% great
	// ~~~~~~ Still working on thes
	// it("returns an error for row save", function() {
	// 	var key = rows()[1].key()
	// 	rows()[1][field_1]('different');
	// 	saveAll();
	// 	var rdata = JSON.stringify( ko.toJS(rows()[1]) );
	// 	var returned = '{"rows": [ {"key": "'+key+'","success": true,"list": "'+_list+'","error": [], "data": '+rdata+' } ], "views":[] }';
	// 	$.post.mostRecentCall.args[2](JSON.parse(returned)); 
	// 	// Need to do something here
	// });
	// 
	// it("returns a lot of shit", function() {
	// });
	// 
	// it("returns an error for a row save", function() {
	//   // will need to look this one up
	// });
	// 
	// it("times out", function() {
	// 	// expect(false).toBeTruthy();
	// });
	// 
	// it("posts bad JSON", function() {
	// });
	// 
	// it("handles error ", function() {
	// // Need to do something here
	// });
	// 
	
	
});
