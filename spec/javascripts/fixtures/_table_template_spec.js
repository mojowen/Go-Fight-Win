describe("Testing the row template", function() {
  beforeEach(function() {
	factoryList();
	loadFixtures("views/lists/_row.html","views/lists/_table.html");
	ko.applyBindings(dataModel);
  });
  it("renders the fields", function() {
	expect( $('th span').length ).toEqual(fields().length);
	for (var i=0; i < $('th span').length; i++) {
		expect($('th span:eq('+i+')').text()).toEqual(fields()[i].name);
	};
  });
  it("renders the rows", function() {
	expect( $('tbody tr').length).toEqual( rows().length );
  });
  it("renders each of the inputs", function() {
    expect( $('tbody textarea').length).toEqual( rows().length * fields().length );
  });
  it("renders all the fields with the correct data", function() {
	rows()[0][fields()[0].to_param]('a vallluse');
	expect( $('tr:last .data:first textarea:').val() ).toEqual('a vallluse');
  });
  it("renders the menus for normal rows", function() {
	expect($('tbody tr:eq(1) td:last').html().trim() ).toEqual("<span class=\"remove clickable\">\n\t\tDelete\n\t</span>");
  });
  it("renders the menus for new rows", function() {
	runs( function() { rows.push( new rowModel({key: 'new', list: _list })  ); },)
	waits(2)
	runs( function() { expect($('tbody tr:first td:last').html()).toEqual("\n\t<span class=\"remove clickable\">Discard</span>\n"); })
  });

  
});