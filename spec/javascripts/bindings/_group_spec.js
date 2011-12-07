describe("group stuff", function() {
	beforeEach(function() {
	factoryList();

	loadFixtures("views/lists/_groupedRow.html","views/lists/_grouped.html","views/lists/_graph.html");
	ko.applyBindings(dataModel);
  });
  
  	it("goal's field uses em", function() {
		// currentView().goal().field
	  expect(true).toBeFalsy();
	});
	/*
		- viewModel.pivotedRows() used for currentView().goal().field
		- currentView().pivotValues() used for currentView().reportOn (for pivot table)
		- currentView().pivotValues() used for currentView().reportOn (down in graph)
	
ERROR		Stack exceeded:
						(was a field model)
						value: $data.report,
						options: $data.fieldReports,
						optionsText: 'label',
						optionsVal: 'report'
						
			doesn't seem to be clearing the groups for currentView
			
ERROR		Switching views:
						value: value: name, css:{ 'unsaved' : $data.dirtyFlag.isDirty() }
ERROR		Switching Views( after removing above line )
						value: value: $data.report, options: $data.fieldReports, optionsText: 'label', optionsVal: 'report'
						
						
						<select data-bind="
							value: $data.report,
							options: $data.fieldReports,
							optionsText: 'label',
							optionsVal: 'report'
							"></select>
ERROR		switching views( remove above)
				<span class="save" data-bind="text: dataModel.savingState().text, css: {'save_ready': dataModel.savingState().enabled && dataModel.savingState().text != 'saved' }">saved</span>
				
	*/
});