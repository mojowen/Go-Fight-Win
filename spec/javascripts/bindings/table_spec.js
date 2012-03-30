describe("Testing the row template", function() {
  beforeEach(function() {
	factoryList();
	loadFixtures("views/lists/_row.html","views/lists/_table.html");
	ko.applyBindings(dataModel);
  });
	// it("binds the delete function", function() {
	//   expect('pending').toEqual('completed');
	// });
	// 
	// it("binds the discard function", function() {
	//   expect('pending').toEqual('completed');
	// });
	// 
	// it("binds the keypress functions", function() {
	//   expect('pending').toEqual('completed');
	// });
});