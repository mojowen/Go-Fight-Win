describe("vieModel can be initalized ", function() {
  it("returns a name when created", function() {
    var view = new viewModel({name: 'a name'});
	expect(view.name).toEqual('a name');
  });
  it("creates a name if one isn't passed", function() {
    var view = new viewModel();
	expect(view.name).toBeDefined();
  });

	describe("Interactions with filterModel object", function() {
	  it("creates a new filter if none are defined", function() {
	    var view = new viewModel();
		expect(view.filters().length).toEqual(1);    
	  });
	  it("passes filters if they are passed one value in an array", function() {
	    var view = new viewModel({ filters: ['a is b'] });
	    expect( ko.toJS(view.filters()[0]) ).toEqual( ko.toJS(new filterModel('a is b')) );
	  });
	  it("passes filters if they are passed one value in a string", function() {
	    var view = new viewModel({ filters: 'a is b' });
	    expect( ko.toJS(view.filters()[0]) ).toEqual( ko.toJS(new filterModel('a is b')) );
	  });
	  it("passes filters in correct order if they are passed in an array", function() {
		var filters = ['a is b','c is d','e is f'];
	    var view = new viewModel({ filters: filters});
		for (var i=0; i < view.filters().length; i++) {
			expect( ko.toJS(view.filters()[i]) ).toEqual( ko.toJS( new filterModel(filters[i]) ) );
		}
	  });  
	});

	describe("interactions with groupModel object", function() {
	  it("creates a new group if none are defined", function() {
	    var view = new viewModel();
		expect(view.groups().length).toEqual(1);    
	  });
	  it("creates a group if the values are defined if defined as string", function() {
	    var view = new viewModel({ groups: 'hey' });
		expect(ko.toJS(view.groups()[0])).toEqual( ko.toJS(new groupModel('hey')) );    
	  });
	  it("creates a new group with options if defined", function() {
	    var view = new viewModel({groups: [{field: 'hey', options:'an option'}] } );
		expect( ko.toJS( view.groups()[0] ) ).toEqual( ko.toJS( new groupModel({field: 'hey', options:'an option'})) );    
	  });
	  it("creates a nested grouping if passed an array", function() {
	    var view = new viewModel({groups: [{field: 'hey', options:'an option'},'other hey'] } );
		expect( ko.toJS( view.groups()[0] ) ).toEqual( ko.toJS( new groupModel({field: 'hey', options:'an option'})) );    
		expect( ko.toJS( view.groups()[1] ) ).toEqual( ko.toJS( new groupModel('other hey')) );
	  });  
	});

});