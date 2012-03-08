describe("group stuff", function() {
	beforeEach(function() {
	factoryList();

	loadFixtures("views/lists/_groupedRow.html","views/lists/_grouped.html","views/lists/_graph.html");
	ko.applyBindings(dataModel);
  });
	it("adding a grouping", function() {
	  expect(true).toBeFalsy();
	});
	it("adding a group", function() {
	  expect(true).toBeFalsy();
	});
	it("adding another group", function() {
	  expect(true).toBeFalsy();
	});
	it("changing a column report", function() {
	  expect(true).toBeFalsy();
	});
	it("pivoting", function() {
	  expect(true).toBeFalsy();
	});
	it("adding a total report", function() {
	  expect(true).toBeFalsy();
	});
	it("removing a group", function() {
	  expect(true).toBeFalsy();
	});
	it("removing a group when pivoted (elegant fallback)", function() {
	  expect(true).toBeFalsy();
	});
});