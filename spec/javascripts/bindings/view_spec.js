describe("Testing the row template", function() {
  beforeEach(function() {
	factoryList();
	for (var i=0; i < 5; i++) {
		var view = new viewModel({id: i, name: 'hey '+i });
		views.push(view);
	};
	loadFixtures("views/lists/_row.html","views/lists/_table.html","views/lists/_grouped.html","views/lists/_groupedRow.html","views/lists/_views.html");
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


	it("successfully groups things", function() {
	});
	it("can group two things", function() {
	});
	it("switches goals when switching views", function() {
	});
	it("switches groups when switching views", function() {
	});

	
});