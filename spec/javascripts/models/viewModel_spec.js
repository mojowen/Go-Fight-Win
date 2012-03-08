describe("vieModel can be initalized ", function() {

  it("returns a name when created", function() {
    var view = new viewModel({name: 'a name'});
	expect(view.name()).toEqual('a name');
  });
  it("creates a name if one isn't passed", function() {
    var view = new viewModel();
	expect(view.name()).toBeDefined();
  });
  it("vew is created with to_param if it isn't new", function() {
    var view = new viewModel({id: 1, name:'Hey You Guys'});
	expect(view.to_param()).toEqual('hey_you_guys');
  });
  it("vew is created with an empty to_param if no id is passed", function() {
    var view = new viewModel();
	expect(view.to_param()).toEqual('');
  });
	// Now only marked as dirty if included in 'views'
	//   it("new views have a dirtyFlag set to true whe", function() {
	//     var view = new viewModel();
	// expect(view.dirtyFlag.isDirty() ).toBeTruthy();
	//   });
  it("initializing a new view with an id doesn't have true dirty flag", function() {
    var view = new viewModel({id: 1, name:'thing'});
	expect(view.dirtyFlag.isDirty()).toBeFalsy();
  });
  it("expects a non-dirty flag to become dirty upon changing", function() {
    var view = new viewModel({id: 1, name:'thing'});
	expect(view.dirtyFlag.isDirty()).toBeFalsy();
	view.name('hey changing');
	expect(view.dirtyFlag.isDirty()).toBeTruthy();
  });
  it("it resets the view if passed the dataModel.current object", function() {
	var view = new viewModel();
	var old_flat = ko.toJS(view);
	view.name('different');
	var new_flat = ko.toJS(view);
	view.dirtyFlag.reset( new viewModel(old_flat));
	expect(view.dirtyFlag.isDirty()).toBeTruthy();
	view.dirtyFlag.reset( new viewModel(new_flat));
	expect(view.dirtyFlag.isDirty()).toBeFalsy();
  });

	describe("Interactions with filterModel object", function() {
	  it("passes filters if they are passed one value in an array", function() {
	    var view = new viewModel({ filters: ['a is b'] }),
			filter = new filterModel('a is b');
	    expect( ko.toJS(view.filters()[0].field) ).toEqual( ko.toJS(filter.field) );
	    expect( ko.toJS(view.filters()[0].operator) ).toEqual( ko.toJS(filter.operator) );
	    expect( ko.toJS(view.filters()[0].filter) ).toEqual( ko.toJS(filter.filter) );
	  });
	  it("passes filters if they are passed one value in a string", function() {
	    var view = new viewModel({ filters: 'a is b' }),
			filter = new filterModel('a is b');

	    expect( ko.toJS(view.filters()[0].field) ).toEqual( ko.toJS(filter.field) );
	    expect( ko.toJS(view.filters()[0].operator) ).toEqual( ko.toJS(filter.operator) );
	    expect( ko.toJS(view.filters()[0].filter) ).toEqual( ko.toJS(filter.filter) );
	  });
	  it("passes filters in correct order if they are passed in an array", function() {
		var filters = ['a is b','c is d','e is f'];
	    var view = new viewModel({ filters: filters});
		for (var i=0; i < view.filters().length; i++) {
			var filter = new filterModel(filters[i]);
			expect( ko.toJS(view.filters()[i].field) ).toEqual( ko.toJS(filter.field) );
			expect( ko.toJS(view.filters()[i].operator) ).toEqual( ko.toJS(filter.operator) );
			expect( ko.toJS(view.filters()[i].filter) ).toEqual( ko.toJS(filter.filter) );
		}
	  });  
	});


	describe("sorting", function() {
		it("creates sorts when passed sort array and assumes direction", function() {
			var view = viewModel({sorts: [ 'field' ] });
			expect(view.sorts()[0].field() ).toEqual('field');
			expect(view.sorts()[0].direction() ).toEqual('ASC');
		});
		it("creates sorts when passed sort array and direction ", function() {
			var view = viewModel({sorts: [ {field: 'field', direction: 'DESC'} ] });
			expect(view.sorts()[0].field() ).toEqual('field');
			expect(view.sorts()[0].direction() ).toEqual('DESC');
		});
		it("creates sorts when passed sort string", function() {
			var view = viewModel({sorts: 'field' });
			expect(view.sorts()[0].field() ).toEqual('field');
		});
	
		describe("actualy sorting", function() {
			var field_1, field_2
		    beforeEach(function() {
		      	factoryList();
				field_1 = fields()[0].to_param;
				field_2 = fields()[1].to_param;
				rows()[0][ field_1 ]('a');
				rows()[1][ field_1 ]('b');
				rows()[2][ field_1 ]('z');
				rows()[3][ field_1 ]('z');
				rows()[2][ field_2 ]('2');
				rows()[3][ field_2 ]('1');
		    });
			it("sorts some fucking rows by one field", function() {
				dataModel.current.view().addSort({field: field_1, direction: 'DESC'});
				dataModel.current.view().sortRows();
				expect( viewModel.renderingRows()[0][field_1]() ).toEqual('z');
			});
			it("sorts some fucking rows by two fields", function() {
				dataModel.current.view().addSort({field: field_1, direction: 'DESC'});
				dataModel.current.view().addSort(field_2)
				dataModel.current.view().sortRows();
				expect( viewModel.renderingRows()[0][field_2]() ).toEqual('1');
			});
		});
	});
});