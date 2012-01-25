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
  // it("switches goals when switching views", function() {
  //    expect(false).toBeTruthy();
  //  });
  //  it("switches groups when switching views", function() {
  //    expect(false).toBeTruthy();
  //  });
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