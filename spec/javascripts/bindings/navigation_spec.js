describe("the bindings on fields", function() {
  beforeEach(function() {
    factoryList();
	loadFixtures("views/lists/_row.html","views/lists/_table.html");
	ko.applyBindings(dataModel);
  });

  describe("basic click functionality", function() {
    it("clicking a textarea adds select class but does not focus", function() {
		$('.data:first').click();
		expect( $('textarea:first').parent('td').hasClass('selected') ).toBeTruthy();
		expect( $('textarea:first').hasClass('open') ).not.toBeTruthy();
    });
	it("double clicking adds select and open's on the textarea", function() {
		$('.data:first').dblclick();
		expect( $('.data:first').hasClass('open') ).toBeTruthy();
	});
	// - enter to open
	// - exit to close
	// - tab / shift+tab manuverings
  });

});