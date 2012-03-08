describe("Testing the row template", function() {
  beforeEach(function() {
	factoryList();
	for (var i=0; i < 5; i++) {
		var view = new viewModel({id: i, name: 'hey '+i });
		views.push(view);
	};
	views()[0].addGrouping();
	views()[0].groupings()[0].groups.push( new groupModel(fields()[0].to_param ) );
	views()[0].addFilter( {field: fields()[1].to_pam, operator: 'has', filter: '' } );

	views()[1].addGrouping();
	views()[1].groupings()[0].groups.push( new groupModel(fields()[0].to_param ) );
	views()[1].groupings()[0].groups.push( new groupModel(fields()[1].to_param ) );
	views()[1].addFilter( {field: fields()[2].to_pam, operator: 'has', filter: '' } );

	loadFixtures("views/lists/_row.html","views/lists/_table.html","views/lists/_views.html","views/lists/_menu.html","views/lists/_analyze.html.erb","views/lists/_grouped.html","views/lists/_groupedRow.html","views/lists/_filter.html");
	ko.applyBindings(dataModel);
  });
  it("renders the views", function() {
    expect( $('span.view').length ).toEqual( views().length );
  });
  it("displays the view names", function() {
	var i = 0;
	$('span.view').each( function() {
		expect( $(this) ).toHaveText('hey '+i);
		i++;
	});
  });
 it('switching views to a view', function() {
	$('.view:first').click();
	expect( views()[0].dirtyFlag.isDirty() ).toBeFalsy();
	expect( dataModel.current.view() ).toEqual( views()[0] );
  });
	it("discarding a view", function() {
	  expect(true).toBeFalsy();
	});
	it("saving current unsaved view", function() {
	  expect(true).toBeFalsy();
	});


});