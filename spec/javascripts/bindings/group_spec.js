describe("group stuff", function() {
	var field;
	beforeEach(function() {
		factoryList();
		field = fields()[1].to_param;
		rows()[0][field]('a')
		loadFixtures("views/lists/_groupedRow.html","views/lists/_grouped.html","views/lists/_analyze.html.erb");
		ko.applyBindings(dataModel);
	});
	it("adding a grouping", function() {
		$('.add_grouping').click();
		expect( dataModel.current.view().groupings().length ).toBeGreaterThan(0);
		
	});
	it("remove a group", function() {
		$('.add_grouping').click();
		expect( dataModel.current.view().groupings().length ).toBeGreaterThan(0);
		$('.group .remove').click();
		expect(dataModel.current.view().groupings().length).toEqual(0);
	});
	it("changes a columns report", function() {
		$('.add_grouping').click();
		expect(dataModel.current.view().groupings()[0].columns()[0].report().report).toEqual('count');
		$('th select:first option:eq(1)').attr('selected','selected').change()
		expect(dataModel.current.view().groupings()[0].columns()[0].report().report).not.toEqual('count');
	});

	describe("adding and setting a group", function() {
		beforeEach(function() {
			$('.add_grouping').click();
		});
		it("groups by a field", function() {
			$('.add_group:first').click();
			expect( dataModel.current.view().groupings()[0].groups().length ).toEqual(1);
		});
		it("groups by two fields", function() {
			$('.add_group:first').click();
			$('.add_group:first').click();
			expect( dataModel.current.view().groupings()[0].groups().length ).toEqual(2);
		});
		it("creates a pivot table from two fields", function() {
			$('.add_group:first').click();
			$('.add_group:first').click();
			$('.group input[type=checkbox]').attr('checked','checked').click().change();
			expect(dataModel.current.view().groupings()[0].pivot()).toBeTruthy();
		});
		it("removing a group resets pivot", function() {
			$('.add_group:first').click();
			$('.add_group:first').click();
			$('.group input[type=checkbox]').attr('checked','checked').click().change();
			$('.remove_group:first').click();
			expect( dataModel.current.view().groupings()[0].groups().length ).toEqual(1);
			expect(dataModel.current.view().groupings()[0].pivot()).toBeFalsy();
		});
		it("changes pivots report", function() {
			$('.add_group:first').click();
			$('.add_group:first').click();
			$('.group input[type=checkbox]').attr('checked','checked').click().change();
			expect(dataModel.current.view().groupings()[0].report().report).toEqual('count');
			$('.group:first select:last option:eq(3)').attr('selected','selected').change();
			expect(dataModel.current.view().groupings()[0].report().report).not.toEqual('count');
		});
	});
});