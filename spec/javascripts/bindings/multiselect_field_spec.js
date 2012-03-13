describe("the bindings on fields with the table editor", function() {
	var field_1;
  beforeEach(function() {
	factoryList();
	field_1 = fields()[0];
	field_1['field_type'] = 'multiselect';
	field_1['field_options'] = ['first','second','third','fourth'];
	loadFixtures("views/lists/_row.html","views/lists/_table.html");
	ko.applyBindings(dataModel);
  });
  
});