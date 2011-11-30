describe("Mocking Ajax Calls", function() {
	var field_1, field_2
	beforeEach(function() {
			spyOn($, "post")
			factoryList();
			field_1 = fields()[0].name
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
		var key = rows()[1].key();
		rows.destroy( rows()[1] );
		expect( rows()[1].key() ).toEqual(key);
		saveAll();
		var returned = '{"rows": [ {"key": "'+key+'","success": true,"list": "'+_list+'","error": [], "updated":[], "_destroy":"true" } ], "views":[] }';
		$.post.mostRecentCall.args[2](JSON.parse(returned));
		expect( rows()[1].key() ).not.toEqual(key);
	});
	it("It sucessfully resets changed rows", function() {
		var key = rows()[1].key()
		rows()[1][field_1]('different');
		expect(rows()[1].dirtyFlag.isDirty()).toBeTruthy();
		saveAll();
		var returned = '{"rows": [ {"key": "'+key+'","success": true,"list": "'+_list+'","error": [], "updated":[{"field": "'+field_1+'", "value": "different"}] } ], "views":[] }';
		$.post.mostRecentCall.args[2](JSON.parse(returned));
		expect(rows()[1].dirtyFlag.isDirty()).toBeFalsy();
	});
	it("It does not resets changed rows if changed values do not match saved values", function() {
		var key = rows()[1].key()
		rows()[1][field_1]('different');
		expect(rows()[1].dirtyFlag.isDirty()).toBeTruthy();

		// Does not reset when passed incorrect value
		saveAll();
		var returned = '{"rows": [ {"key": "'+key+'","success": true,"list": "'+_list+'","error": [], "updated":[{"field":"'+field_1+'", "value":"different"}] } ], "views":[] }';
		rows()[1][field_1]('different again');
		$.post.mostRecentCall.args[2](JSON.parse(returned));
		expect(rows()[1].dirtyFlag.isDirty()).toBeTruthy();
		
		// When passed correct value, resets
		saveAll();
		var returned = '{"rows": [ {"key": "'+key+'","success": true,"list": "'+_list+'","error": [], "updated":[{"field":"'+field_1+'", "value":"different again"}] } ], "views":[] }';
		$.post.mostRecentCall.args[2](JSON.parse(returned));
		expect(rows()[1].dirtyFlag.isDirty()).toBeFalsy();
	});
	it("returns a new row and removes a tempkey", function() {
		var new_row = new rowModel({key: 'new', list: _list});
		addRow( new_row );
		saveAll();
		var returned = '{"rows": [ {"key": "6969","success": true,"list": "'+_list+'","error": [], "updated":[], "_tempkey":"'+new_row._tempkey+'" } ], "views":[] }';
		$.post.mostRecentCall.args[2](JSON.parse(returned));
		expect(rows()[rows().length-1].key()).not.toEqual('new');
		expect(rows()[rows().length-1]._tempkey).toBeNull();
		expect(rows()[rows().length-1].dirtyFlag.isDirty()).toBeFalsy();
	});
	it("adding a view calls post", function() {
		var new_view = viewModel({id: 'new', name: 'new name'});
		views.push(new_view);
		saveAll();
		expect($.post).wasCalled();
	});
	it("adding a view saves a post", function() {
		var new_view = new viewModel({id: 'new', name: 'new name'});
		addView(new_view);
		saveAll();
		var returned = '{"rows": [], "views":[{"id":"69","name":"new name","slug":"tstslug" }] }';
		$.post.mostRecentCall.args[2](JSON.parse(returned));
		expect(dataModel.savingViews().length).toEqual(0);
		expect(views()[0].slug).toEqual("tstslug");
	});
	it("deleting views", function() {
		var new_view = new viewModel({id: 'new', name: 'new name'});
		addView(new_view);
		views.destroy( views()[0] );
		saveAll();
		var returned = '{"rows": [], "views":[{"id":"69","name":"new name","slug":"tstslug","_destroy" : "true" }] }';
		$.post.mostRecentCall.args[2](JSON.parse(returned));
		expect(views()[0]).not.toBeDefined();
	});
	it("restarts itself if there's anything else to save", function() {
		var key = rows()[1].key()
		rows()[1][field_1]('different');
		saveAll();
		var returned = '{"rows": [ {"key": "'+key+'","success": true,"list": "'+_list+'","error": [], "updated":[{"field":"'+field_1+'", "value":"different"}] } ], "views":[] }';
		rows()[1][field_1]('different again');
		var new_view = new viewModel({id: 'new', name: 'new name'});
		addView(new_view);
		$.post.mostRecentCall.args[2](JSON.parse(returned));
		expect($.post.mostRecentCall.args[1].search('different again')).not.toEqual(-1);
		expect($.post.mostRecentCall.args[1].search('new name')).not.toEqual(-1);
	});


	// need to write tests

	// returns 500
	// returns errors
	// test a timeout?

	// returns 100% great
	
	// ~~~~~~ Still working on thes
	it("returns an error for row save", function() {
		var key = rows()[1].key()
		rows()[1][field_1]('different');
		saveAll();
		var returned = '{"rows": [ {"key": "'+key+'","success": true,"list": "'+_list+'","error": [], "updated":[{"field":"'+field_1+'", "value":"different"}] } ], "views":[] }';
		$.post.mostRecentCall.args[2](JSON.parse(returned)); 
		// Need to do something here
	});


	it("returns a lot of shit", function() {
	});
	it("returns an error for a row save", function() {
	  // will need to look this one up
	});
	it("times out", function() {
	});
	it("posts bad JSON", function() {
	});
	it("handles error ", function() {
	// Need to do something here
	});



});
