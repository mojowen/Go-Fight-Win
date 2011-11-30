describe("Testing the row template", function() {
  beforeEach(function() {
	for (var i=0; i < 5; i++) {
		var view = new viewModel({id: i, name: 'hey '+i });
		views.push(view);
	};
    loadFixtures("views/lists/_views.html");
	ko.applyBindings(dataModel);
	factoryList();
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
	// it("successfully groups things", function() {
	//   currentView().addGroup();
	//   var group = $('.group:first option:last');
	//   group.attr('selected','selected').change();
	//   expect( currentView().groups()[0].field() ).toEqual( group.val() );
	// });
	// it("can group two things", function() {
	//   currentView().addGroup();
	//   var group = $('.group:first option:last');
	//   group.attr('selected','selected').change();
	//   currentView().addGroup();
	//   var group = $('.group:last option:eq(1)');
	//   group.attr('selected','selected').change();
	//   expect( currentView().groups()[1].field() ).toEqual( group.val() );
	// });
	
});