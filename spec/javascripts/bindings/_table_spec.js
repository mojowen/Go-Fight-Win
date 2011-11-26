describe("Testing the row template", function() {
  beforeEach(function() {
	factoryList();
	loadFixtures("views/lists/_row.html","views/lists/_table.html");
	ko.applyBindings(dataModel);
	  var values = ['a','d','','','sdf','','d','ff','asdf','sd','s3a@','','33','asd']
	  for (var i=0; i < rows().length; i++) {
	  	rows()[i][fields()[0].name](  values[Math.round(Math.random()*10)] );
	  	rows()[i][fields()[2].name](  values[Math.round(Math.random()*10)] );
	  };
  });
  it("renders the fields", function() {
    expect( $('thead th').length ).toEqual( fields().length + 1 );
  });
  it("renders the rows", function() {
	expect( $('tbody tr').length).toEqual( rows().length );
  });
  it("renders each of the inputs", function() {
    expect( $('tbody textarea').length).toEqual( rows().length * fields().length );
  });

	it("groups rows correctly", function() {
		currentView.groups()[0].field( fields()[0].name);
		expect( $('#edit_rows tr').length ).toEqual( rows().length + viewModel.renderingRows().length );
	});

	it("can double group", function() {
		currentView.groups()[0].field( fields()[2].name );
		currentView.addGroup( fields()[0].name );
		var count = 0;
		for ( var i=0; i < viewModel.renderingRows().length; i++ ) {
			// Need to count all the doubly grouped rows - but exclude undefined values
			count += viewModel.renderingRows()[i].rows.filter( function(elem) { return typeof elem != 'undefined' }).length;
			// Also there's a title row for the 1st level grouping
			count += 1;
		};
		expect( $('#edit_rows tr').length ).toEqual( rows().length + count );
	});

});

/// Need ot write some tests with grouped rows