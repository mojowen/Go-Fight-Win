describe("group stuff", function() {
	beforeEach(function() {
	factoryList();

	loadFixtures("views/lists/_groupedRow.html","views/lists/_grouped.html","views/lists/_graph.html");
	ko.applyBindings(dataModel);
  });
    // 
    // it("renders the group's options that i specify", function() {
    //   expect(true).toBeFalsy();
    // });
    // it("renders the grouping i specify", function() {
    //   expect(false).toBeTruthy();
    // });
  
	/*
//		- viewModel.pivotedRows() used for dataModel.current.view().goal().field
		- dataModel.current.view().pivotValues() used for dataModel.current.view().reportOn (for pivot table)
		- dataModel.current.view().pivotValues() used for dataModel.current.view().reportOn (down in graph)
	loses reportOn going from no-group > group
	view0 (different)
		reportOn = count last
		goal = unique first 1000
	view1 (simple)
		goal = count last 1
	*/
});