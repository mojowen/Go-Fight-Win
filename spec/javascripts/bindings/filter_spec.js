describe("group stuff", function() {
	var field;
	beforeEach(function() {
		factoryList();
		field = fields()[1].to_param;
		rows()[0][field]('a')
		loadFixtures("views/lists/_filter.html","views/lists/_analyze.html.erb");
		ko.applyBindings(dataModel);
		setBindings();
	});
	it("adding a filter", function() {
		$('.add_filter').click();
		expect( dataModel.current.view().filters().length ).toEqual(1);
	});
	it("removing a filter", function() {
		$('.add_filter').click();
		expect( dataModel.current.view().filters().length ).toEqual(1);

		$('div.filter .remove').click();
		expect( dataModel.current.view().filters().length ).toEqual(0);
	});
	describe("setting and changing a filter", function() {
		beforeEach(function() {
			$('.add_filter').click();
			$('.filter select:first option[value='+field+']').attr('selected','selected').change();
		});
		it("setting a field", function() {
			$('.filter select:first option[value='+field+']').attr('selected','selected').change();
			expect( dataModel.current.view().filters()[0].field() ).toEqual( field );
		});
		it("changing operator on a filter", function() {
			$('.filter select:eq(1) option[value=is]').attr('selected','selected').change()
			expect( dataModel.current.view().filters()[0].operator() ).toEqual( 'is' );
		});
		it("adding a real filter", function() {
			$('.filter select:eq(1) option[value=is]').attr('selected','selected').change()
			$('.filter input').val('a').change()
			expect( dataModel.current.view().filters()[0].filter() ).toEqual( 'a' );
			expect( viewModel.filteredRows().length ).toEqual(1);
		});
	});
	it("adding a second filter", function() {
		$('.add_filter').click();
		$('.add_filter').click();
		expect( dataModel.current.view().filters().length ).toEqual(2);
	});

});