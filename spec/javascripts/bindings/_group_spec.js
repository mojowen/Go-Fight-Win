describe("group stuff", function() {
	beforeEach(function() {
	factoryList();

	loadFixtures("views/lists/_groupedRow.html","views/lists/_grouped.html","views/lists/_graph.html");
	ko.applyBindings(dataModel);
  });
  
  	it("goal's field uses em", function() {
		// currentView().goal().field
	  expect(true).toBeFalsy();
	});
	/*
//		- viewModel.pivotedRows() used for currentView().goal().field
		- currentView().pivotValues() used for currentView().reportOn (for pivot table)
		- currentView().pivotValues() used for currentView().reportOn (down in graph)
	loses reportOn going from no-group > group
	view0 (different)
		reportOn = count last
		goal = unique first 1000
	view1 (simple)
		goal = count last 1
	*/
});