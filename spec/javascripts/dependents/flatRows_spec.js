describe("Flatrows, a dependent observable", function() {
  beforeEach(function() {
	fields.removeAll();
	rows.removeAll();
    for (var i=0; i < 3; i++) {
    	fields.push(factoryField());
    };
	for (var i=0; i < 10; i++) {
		rows.push(factoryRow());
	};
  });

  it("returns the correct number of rows", function() {
    expect(dataModel.flatRows().length).toEqual(10);
  });

  it("totally flattens the observables", function() {
    expect( typeof dataModel.flatRows()[0][ fields()[0].name ] ).toEqual('string');
  });


  it("everything is where you'd expect it", function() {
	for (var i=0; i < rows().length; i++) {
		var js_row = ko.toJS(rows()[i]);
		js_row.isDirty = rows()[i].dirtyFlag.isDirty() ? true : false;
		
    	expect( dataModel.flatRows()[i] ).toEqual( js_row );
	};

  });

});