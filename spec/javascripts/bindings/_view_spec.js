describe("Testing the row template", function() {
  beforeEach(function() {
	for (var i=0; i < 5; i++) {
		var view = new viewModel({id: i, name: 'hey '+i });
		views.push(view);
	};
    loadFixtures("views/lists/_views.html");
	ko.applyBindings(dataModel);
  });
  it("renders the views", function() {
    expect( $('span').length ).toEqual( views().length );
  });
  it("displays the view names", function() {
	var i = 0;
	$('span').each( function() {
		expect( $(this) ).toHaveText('hey '+i);
		i++;
	});
  });

});