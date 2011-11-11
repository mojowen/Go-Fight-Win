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

	describe("paged and visible observables", function() {
	  it("autopopulates to visible 50, paged 0 if not set", function() {
	    var view = new viewModel();
		expect(view.paged()).toEqual(0);
		expect(view.visible()).toEqual(50);
	  });
	  it("can set visible", function() {
	    var view = new viewModel({visible: 15 });
	    expect(view.visible()).toEqual(15);
	  });
	  it("can set visible", function() {
	    var view = new viewModel({paged: 100 });
	    expect(view.paged()).toEqual(100);
	  });
	  it("can't set visible to over 500", function() {
	    var view = new viewModel({visible: 500 });
	    expect(view.visible()).toEqual(50);
	  });
	  it("passing non-numbers to either vibisble nor page sets to defaults", function() {
	    var view = new viewModel({visible: 'f', paged: 'd' });
	    expect(view.visible()).toEqual(50);
	    expect(view.paged()).toEqual(0);
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
				field_1 = fields()[0].name;
				field_2 = fields()[1].name;
				rows()[0][ field_1 ]('a');
				rows()[1][ field_1 ]('b');
				rows()[2][ field_1 ]('z');
				rows()[3][ field_1 ]('z');
				rows()[2][ field_2 ]('2');
				rows()[3][ field_2 ]('1');
		    });
			it("sorts some fucking rows by one field", function() {
				currentView.sorts()[0].field(field_1);
				currentView.sorts()[0].direction('DESC');
				currentView.sortRows();
				expect( viewModel.renderingRows()[0][field_1]() ).toEqual('z');
			});
			it("sorts some fucking rows by two fields", function() {
				currentView.sorts()[0].field(field_1);
				currentView.sorts()[0].direction('DESC');
				currentView.addSort(field_2)
				currentView.sortRows();
				expect( viewModel.renderingRows()[0][field_2]() ).toEqual('1');
			});
		});
	});	
});