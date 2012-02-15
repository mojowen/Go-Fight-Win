describe("Analyze page bindings", function() {
	beforeEach(function() {
		factoryList();
		loadFixtures("views/lists/_analyze.html","views/lists/_groupedRow.html","views/lists/_grouped.html","views/lists/_graph.html","views/lists/_filter.html");
		ko.applyBindings(dataModel);
		setBindings();
	});
	describe("Adding and removing filters", function() {
	  it("Clicks to add a filter to the view", function() {
		expect( dataModel.current.view().filters().length ).toEqual(0);
		$('.add_filter').trigger('click');
		expect(  dataModel.current.view().filters().length ).toEqual(1);
	  });
	  it("adding a filter flips the filtered thing to true", function() {
		$('.add_filter').click();
		expect(dataModel.current.filtered()).toBeTruthy();
	  });
	  it("remove a filter", function() {
		$('.add_filter').click();
		expect(  dataModel.current.view().filters().length ).toEqual(1);
		$('.filter .remove').click();
		expect(  dataModel.current.view().filters().length ).toEqual(0);
	  });

	});
});