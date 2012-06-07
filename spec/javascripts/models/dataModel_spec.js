/** 
	Ways to attack this:

		- Need to test AJAX response for
			- Saving rows
			- Saving views
			- Loading rows

		- Need to test template rendering
			- Pivot table

		- Need to test Bindings
			- New row
			- Number update


**/

describe("dataModel set ups", function() {

	describe("Rows inside of the dataModel", function() {
	  	it("Expects rows to exist that is a KO observableArray", function() {
			expect( typeof rows ).toEqual('function');
		});

		describe("Rows inside of the dataModel", function() {
			var row;

			beforeEach(function() {
				rows.removeAll();
				row = new rowModel( { key: 123, list: 'Test' } );
				rows.push( row );
			});

			it("Can add a row to the rows array", function() {
				expect(rows().length).toEqual(1);
			});

			it("new row returns correctly from rows", function() {
				expect(rows()[0] ).toBe( row );
			});

			it("can add several row objects to row", function() {
				for (var i=0; i < 9; i++) {
					rows.push(new rowModel({key: i, list:'Test'}));
				};
				expect(rows().length).toEqual(10);
			});
		});
	});

	describe("Fields inside of the dataModel", function() {
	  	var row;

		beforeEach(function() {
			fields.removeAll();
			field = new fieldModel( { id: 69, list: 'Test', name: 'name' } );
			fields.push( field );
		});

		it("Can add a field to the rows array", function() {
			expect(fields().length).toEqual(1);
		});

		it("new field returns correctly from fields", function() {
			expect( fields()[0] ).toBe( field );
		});

	});
	
	describe("Row values are assigned from field data", function() {
		beforeEach(function() {
			fields.removeAll();
			rows.removeAll();
			for (var i=0; i < 9; i++) {
				fields.push( new fieldModel({ id: i, list: 'Test', name: 'name_'+i })  )
			};
		});
		it("creates a row and assigns blank values to observable", function() {
		  var row = new rowModel({ key: 1, list: 'Test' });
		  rows.push(row);
		  expect(rows()[0].name_1()).toEqual('');
		});
		it("creates a row and assigns appropriate field values", function() {
		  var row = new rowModel( {key: 1, list: 'Test', name_1: 'thing' });
		  rows.push(row);
		  expect(rows()[0].name_1()).toEqual('thing');
		});
	});
	describe("changing between views and such", function() {
	  it("sets dataModel.current.view to a blank viewModel if nothing is set", function() {
	    expect(ko.toJSON( dataModel.current.view() ) ).toEqual( ko.toJSON( new viewModel() ) );
	  });
	  it("can set views to replace the dataModel.current view", function() {
	    view = new viewModel({name: 'better view'});
		setCurrentView(view);
		expect( dataModel.current.view().name() ).toEqual('better view');
	  });
	  it("cannot set duplicate names for views", function() {
		view = new viewModel({name: 'better view'});
		nother_view = new viewModel({name: 'better view'});
	    addView( view );
	    expect( addView(nother_view) ).toBeFalsy();
	  });
	  describe("dependent variables are shifted when dataModel.current.view shifts", function() {
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
			rows()[1][ field_2 ]('5');
		});
	  });
	});
	describe("adding rows", function() {
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
			rows()[1][ field_2 ]('5');
		});
		it("can add a new row to rows and have it sorted", function() {
			runs( function() {
				view = new viewModel({sorts: [{field: field_2, direction: 'DESC'}] });
				setCurrentView( view );
				var row = new rowModel({ key: 'new', list: 'Test' });
				row[field_2](10);
				addRow(row);
			})
			waits(20)
			runs( function() { expect( viewModel.renderingRows()[0][field_2]() ).toEqual(10); })
		});
	});
	describe("loads a view", function() {
		var current_view;
		beforeEach(function() {
			_currentView = 0;
			current_view = new viewModel({name: 'Current View'});
			views.push( current_view);
			factoryList();
			loadFixtures("views/lists/_row.html","views/lists/_table.html","views/lists/_views.html","views/lists/_groupedRow.html","views/lists/_grouped.html");
			load();
			ko.applyBindings(dataModel);
		});
		it("succesfully loads the view", function() {
			expect( dataModel.current.view()  ).toEqual( current_view );
			expect(dataModel.current.view().dirtyFlag.isDirty()).toBeFalsy();
		});
	});
	
});

