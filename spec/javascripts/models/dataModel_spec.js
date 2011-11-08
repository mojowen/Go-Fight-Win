/** 
	Ways to attack this:
		- Need to test rows object

		- Need to test dependent variables
		- Need to test jquery plugins
		- Need to test custom functions (make part of dataModel?)
			- grouping
			- sorting
			- filtering
		- Need to test flagging for saving

		- Need to test AJAX response for
			- Saving rows
			- Saving views
			- Loading rows


		- Need to test template rendering (can jasmine do this? - maybe need to use selenium)
			- Edit template
			- Grouped template
			- Pivot table

		- Need to test Bindings
			- Regular row update
			- Date update
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

});

