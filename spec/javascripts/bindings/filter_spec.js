describe("group stuff", function() {
	beforeEach(function() {
	factoryList();

	loadFixtures("views/lists/_filter.html","views/lists/_analyze.html.erb");
	ko.applyBindings(dataModel);
  });
	// it("adding a filter", function() {
	//   expect(true).toBeFalsy();
	// });
	// it("setting a filter", function() {
	//   expect(true).toBeFalsy();
	// });
	// it("changing operator on a filter", function() {
	//   expect(true).toBeFalsy();
	// });
	// it("adding a second filter", function() {
	//   expect(true).toBeFalsy();
	// });
	// it("removing a filter", function() {
	//   expect(true).toBeFalsy();
	// });

});