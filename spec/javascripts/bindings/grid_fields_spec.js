/*
things each field needs to be tested for
 - mousedown doesnt 
 - dblclick does
 - can update a value
 - updates value when value updated on back end

 - copies the correct value
 - anything special
*/
describe("the bindings on fields", function() {
  var select,multiselect,number,block,suggest
  beforeEach(function() {
    factoryList({
		fields:[
			{field_type:'select',field_options:['First','Second','Third','Fourth']},
			{field_type:'multiselect',field_options:['Start','Stop','Left','Right']},
			{field_type:'number'},
			{field_type:'block'},
			{field_type:'suggest'}
		]
	});
	select = fields()[0].to_param,
	multiselect = fields()[1].to_param,
	number = fields()[2].to_param,
	block = fields()[3].to_param,
	suggest = fields()[4].to_param
	loadFixtures("views/lists/_row.html","views/lists/_table.html");
	ko.applyBindings(dataModel);
  });
  describe("the select bindings", function() {
     it("doesn't open on first click", function() {
 		$('td.cell.select:first button:visible').mousedown();
 		expect( $('td.cell.select:first') ).toHaveClass('selected');
 		expect( $('td.cell.select:first .data') ).not.toHaveClass('open');
     });
     it("opens on double click", function() {
 		$('td.cell.select:first button:visible').dblclick();
 		expect( $('td.cell.select:first') ).toHaveClass('selected');
 		expect( $('td.cell.select:first .data') ).toHaveClass('open');
     });
     it("opens and is changed", function() {
 		expect(rows()[0][select]()).not.toEqual('Fourth');
 		$('td.cell.select:first button:visible').dblclick().click();
 		$('.ui-multiselect-checkboxes li:last input').attr('checked','checked').click()
 		expect(rows()[0][select]()).toEqual('Fourth');
     });
     it("updates when changed above", function() {
 		expect( $('td.cell.select:first button:visible span') ).toHaveText('Select')
 		rows()[0][select]('Third');
 		expect( $('td.cell.select:first button:visible span') ).toHaveText('Third')
 		$('td.cell.select:first button:visible').dblclick().click();
 		expect( $('.ui-multiselect-checkboxes input:checked').parent() ).toHaveText('Third');
     });
     it("copies empty field", function() {
 		$('td.cell.select:first button:visible').mousedown().trigger('copy');
 		expect( $('#ideal').text().trim() ).toEqual('--')
     });
     it("copies full field", function() {
 		rows()[0][select]('Third');
 		$('td.cell.select:first button:visible').mousedown().trigger('copy');
 		expect( $('#ideal').text().trim() ).toEqual('Third')
     });
   });
   describe("the multiselect bindings", function() {
     it("doesn't open on first click", function() {
 		$('td.cell.multiselect:first button:visible').mousedown();
 		expect( $('td.cell.multiselect:first') ).toHaveClass('selected');
 		expect( $('td.cell.multiselect:first .data') ).not.toHaveClass('open');
     });
     it("opens on double click", function() {
 		$('td.cell.multiselect:first button:visible').dblclick();
 		expect( $('td.cell.multiselect:first') ).toHaveClass('selected');
 		expect( $('td.cell.multiselect:first .data') ).toHaveClass('open');
     });
     it("opens and is changed - more than one", function() {
 		expect(rows()[0][multiselect]()).not.toEqual('Fourth');
 		$('td.cell.multiselect:first button:visible').dblclick().click();
 		$('.ui-multiselect-checkboxes li:first input').attr('checked','checked').click()
 		$('.ui-multiselect-checkboxes li:last input').attr('checked','checked').click()
 		$('.ui-multiselect-checkboxes li:eq(1) input').attr('checked','checked').click()
 		expect(rows()[0][multiselect]()).toEqual(['Start', 'Stop', 'Right']);
     });
     it("updates when changed above - only one", function() {
 		expect( $('td.cell.multiselect:first button:visible span') ).toHaveText('Select options')
 		rows()[0][multiselect](['Stop']);
 		expect( $('td.cell.multiselect:first button:visible span') ).toHaveText('Stop')
 		$('td.cell.multiselect:first button:visible').dblclick().click();
 		expect( $('.ui-multiselect-checkboxes input:checked').parent() ).toHaveText('Stop');
     });
     it("updates when changed above - more than one", function() {
 		expect( $('td.cell.multiselect:first button:visible span') ).toHaveText('Select options')
 		rows()[0][multiselect](['Stop', 'Left']);
 		expect( $('td.cell.multiselect:first button:visible span') ).toHaveText('2 selected')
 		$('td.cell.multiselect:first button:visible').dblclick().click();
 		expect( $('.ui-multiselect-checkboxes input:checked:first').parent() ).toHaveText('Stop');
 		expect( $('.ui-multiselect-checkboxes input:checked:last').parent() ).toHaveText('Left');
     });
     it("copies empty field", function() {
 		$('td.cell.multiselect:first button:visible').mousedown().trigger('copy');
 		expect( $('#ideal').text().trim() ).toEqual('--')
     });
     it("copies full field", function() {
 		rows()[0][multiselect](['Start', 'Stop', 'Right']);
 		$('td.cell.multiselect:first button:visible').mousedown().trigger('copy');
 		expect( $('#ideal').text().trim() ).toEqual('Start,Stop,Right')
     });
   });
   describe("the number bindings", function() {
     it("doesn't open on first click", function() {
 		$('td.cell.number:first textarea').mousedown();
 		expect( $('td.cell.number:first') ).toHaveClass('selected');
 		expect( $('td.cell.number:first .data') ).not.toHaveClass('open');
     });
     it("opens on double click", function() {
 		$('td.cell.number:first textarea').dblclick();
 		expect( $('td.cell.number:first') ).toHaveClass('selected');
 		expect( $('td.cell.number:first .data') ).toHaveClass('open');
     });
     it("opens and is changed", function() {
 		expect(rows()[0][number]()).not.toEqual(69);
 		$('td.cell.number:first textarea').dblclick().val(69).change();
 		expect(rows()[0][number]()).toEqual(69);
     });
     it("updates when changed above", function() {
 		rows()[0][number](420);
 		$('td.cell.number:first button:visible').dblclick().click();
 		expect( $('td.cell.number:first textarea') ).toHaveValue(420);
     });
     it("copies empty field", function() {
 		$('td.cell.number:first textarea').mousedown().trigger('copy');
 		expect( $('#ideal').text().trim() ).toEqual('--')
     });
     it("copies full field", function() {
 		rows()[0][number](666);
 		$('td.cell.number:first textarea').mousedown().trigger('copy');
 		expect( $('#ideal').text().trim() ).toEqual('666')
     });
   });
   describe("the block bindings", function() {
     it("doesn't open on first click", function() {
 		$('td.cell.block:first textarea').mousedown();
 		expect( $('td.cell.block:first') ).toHaveClass('selected');
 		expect( $('td.cell.block:first .data') ).not.toHaveClass('open');
     });
     it("opens on double click", function() {
 		$('td.cell.block:first textarea').dblclick();
 		expect( $('td.cell.block:first') ).toHaveClass('selected');
 		expect( $('td.cell.block:first .data') ).toHaveClass('open');
     });
     it("opens and is changed", function() {
 		expect(rows()[0][block]()).not.toEqual("Long long long\nlong long\nlong long\nsection");
 		$('td.cell.block:first textarea').dblclick().val("Long long long\nlong long\nlong long\nsection").change();
 		expect(rows()[0][block]()).toEqual("Long long long\nlong long\nlong long\nsection");
		expect( $('td.cell.block:first textarea').dblclick().height() +4 ).toEqual( $('td.cell.block:first textarea')[0].scrollHeight );
     });
     it("updates when changed above", function() {
 		rows()[0][block]("Long long long\nlong long\nlong long\nsection");
 		expect( $('td.cell.block:first textarea') ).toHaveValue("Long long long\nlong long\nlong long\nsection");
     });
     it("copies empty field", function() {
 		$('td.cell.block:first textarea').mousedown().trigger('copy');
 		expect( $('#ideal').text().trim() ).toEqual('--')
     });
     it("copies full field", function() {
 		rows()[0][block]("Long long long\nlong long\nlong long\nsection");
 		$('td.cell.block:first textarea').mousedown().trigger('copy');
 		expect( $('#ideal').text().trim() ).toEqual("Long long long\nlong long\nlong long\nsection")
     });
   });
   describe("the suggest bindings", function() {
     it("doesn't open on first click", function() {
 		$('td.cell.suggest:first textarea').mousedown();
 		expect( $('td.cell.suggest:first') ).toHaveClass('selected');
 		expect( $('td.cell.suggest:first .data') ).not.toHaveClass('open');
     });
     it("opens on double click", function() {
 		$('td.cell.suggest:first textarea').dblclick();
 		expect( $('td.cell.suggest:first') ).toHaveClass('selected');
 		expect( $('td.cell.suggest:first .data') ).toHaveClass('open');
 		expect( $('td.cell.suggest:first .data').attr('aria-haspopup') ).toEqual('true');
     });
     it("opens and is changed", function() {
 		expect(rows()[0][suggest]()).not.toEqual("SuggestMe");
 		$('td.cell.suggest:first textarea').dblclick().val("SuggestMe").change();
 		expect(rows()[0][suggest]()).toEqual("SuggestMe");
     });
     it("updates when changed above", function() {
 		rows()[0][suggest]("SuggestMe");
 		expect( $('td.cell.suggest:first textarea') ).toHaveValue("SuggestMe");
     });
     it("copies empty field", function() {
 		$('td.cell.suggest:first textarea').mousedown().trigger('copy');
 		expect( $('#ideal').text().trim() ).toEqual('--')
     });
     it("copies full field", function() {
 		rows()[0][suggest]("Autosuggest");
 		$('td.cell.suggest:first textarea').mousedown().trigger('copy');
 		expect( $('#ideal').text().trim() ).toEqual("Autosuggest")
     });
   });
});