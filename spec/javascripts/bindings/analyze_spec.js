describe("Analyze page bindings", function() {
	beforeEach(function() {
		factoryList();
		loadFixtures("views/lists/_analyze.html","views/lists/_groupedRow.html","views/lists/_grouped.html","views/lists/_graph.html","views/lists/_filter.html");
		ko.applyBindings(dataModel);
	});
	describe("Adding and removing filters", function() {
	  it("Clicks to add a filter to the view", function() {
		expect( dataModel.current.view().filters().length ).toEqual(0);
		$('.add_filter').click();
		expect(  dataModel.current.view().filters().length ).toEqual(1);
	  });
	});
});