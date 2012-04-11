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

	newRows.push( new rowModel({key: 'new', list: _list })  );

	loadFixtures("views/lists/_row.html","views/lists/_newRow.html");
	ko.applyBindings(dataModel);
  });
  describe("the select bindings", function() {
     it("opens and is changed", function() {
		spyOnEvent($('.select button:visible'), 'open');
 		$('.select button:visible').click()
		expect('open').toHaveBeenTriggeredOn($('.select button:visible'));
 		$('.ui-multiselect-checkboxes li:last input').attr('checked','checked').click();
 		expect(newRows()[0][select]()).toEqual('Fourth');
     });
     it("updates when changed above", function() {
 		expect( $('.select button:visible span') ).toHaveText('Select')
 		newRows()[0][select]('Third');
 		expect( $('.select button:visible span') ).toHaveText('Third')
 		$('.select button:visible').click();
 		expect( $('.ui-multiselect-checkboxes input:checked').parent() ).toHaveText('Third');
     });
   });
   describe("the multiselect bindings", function() {
     it("opens and is changed - more than one", function() {
 		expect(newRows()[0][multiselect]()).not.toEqual(['Start', 'Stop', 'Right']);
 		$('.multiselect button:visible').click();
 		$('.ui-multiselect-checkboxes li:first input').attr('checked','checked').click()
 		$('.ui-multiselect-checkboxes li:last input').attr('checked','checked').click()
 		$('.ui-multiselect-checkboxes li:eq(1) input').attr('checked','checked').click()
 		expect(newRows()[0][multiselect]()).toEqual(['Start', 'Stop', 'Right']);
     });
     it("updates when changed above - only one", function() {
 		expect( $('.multiselect button:visible span') ).toHaveText('Select options')
 		newRows()[0][multiselect](['Stop']);
 		expect( $('.multiselect button:visible span') ).toHaveText('Stop')
 		$('.multiselect button:visible').dblclick().click();
 		expect( $('.ui-multiselect-checkboxes input:checked').parent() ).toHaveText('Stop');
     });
     it("updates when changed above - more than one", function() {
 		expect( $('.multiselect button:visible span') ).toHaveText('Select options')
 		newRows()[0][multiselect](['Stop', 'Left']);
 		expect( $('.multiselect button:visible span') ).toHaveText('2 selected')
 		$('.multiselect button:visible').dblclick().click();
 		expect( $('.ui-multiselect-checkboxes input:checked:first').parent() ).toHaveText('Stop');
 		expect( $('.ui-multiselect-checkboxes input:checked:last').parent() ).toHaveText('Left');
     });
   });
		//    describe("the number bindings", function() {
		//      it("doesn't open on first click", function() {
		//  		$('.number textarea').mousedown();
		//  		expect( $('.number') ).toHaveClass('selected');
		//  		expect( $('.number .data') ).not.toHaveClass('open');
		//      });
		//      it("opens on double click", function() {
		//  		$('.number textarea').dblclick();
		//  		expect( $('.number') ).toHaveClass('selected');
		//  		expect( $('.number .data') ).toHaveClass('open');
		//      });
		//      it("opens and is changed", function() {
		//  		expect(rows()[0][number]()).not.toEqual(69);
		//  		$('.number textarea').dblclick().val(69).change();
		//  		expect(rows()[0][number]()).toEqual(69);
		//      });
		//      it("updates when changed above", function() {
		//  		rows()[0][number](420);
		//  		$('.number button:visible').dblclick().click();
		//  		expect( $('.number textarea') ).toHaveValue(420);
		//      });
		//      it("copies empty field", function() {
		//  		$('.number textarea').mousedown().trigger('copy');
		//  		expect( $('#ideal').text().trim() ).toEqual('--')
		//      });
		//      it("copies full field", function() {
		//  		rows()[0][number](666);
		//  		$('.number textarea').mousedown().trigger('copy');
		//  		expect( $('#ideal').text().trim() ).toEqual('666')
		//      });
		//    });
		//    describe("the block bindings", function() {
		//      it("doesn't open on first click", function() {
		//  		$('.block textarea').mousedown();
		//  		expect( $('.block') ).toHaveClass('selected');
		//  		expect( $('.block .data') ).not.toHaveClass('open');
		//      });
		//      it("opens on double click", function() {
		//  		$('.block textarea').dblclick();
		//  		expect( $('.block') ).toHaveClass('selected');
		//  		expect( $('.block .data') ).toHaveClass('open');
		//      });
		//      it("opens and is changed", function() {
		//  		expect(rows()[0][block]()).not.toEqual("Long long long\nlong long\nlong long\nsection");
		//  		$('.block textarea').dblclick().val("Long long long\nlong long\nlong long\nsection").change();
		//  		expect(rows()[0][block]()).toEqual("Long long long\nlong long\nlong long\nsection");
		// expect( $('.block textarea').dblclick().height() +4 ).toEqual( $('.block textarea')[0].scrollHeight );
		//      });
		//      it("updates when changed above", function() {
		//  		rows()[0][block]("Long long long\nlong long\nlong long\nsection");
		//  		expect( $('.block textarea') ).toHaveValue("Long long long\nlong long\nlong long\nsection");
		//      });
		//      it("copies empty field", function() {
		//  		$('.block textarea').mousedown().trigger('copy');
		//  		expect( $('#ideal').text().trim() ).toEqual('--')
		//      });
		//      it("copies full field", function() {
		//  		rows()[0][block]("Long long long\nlong long\nlong long\nsection");
		//  		$('.block textarea').mousedown().trigger('copy');
		//  		expect( $('#ideal').text().trim() ).toEqual("Long long long\nlong long\nlong long\nsection")
		//      });
		//    });
		//    describe("the suggest bindings", function() {
		//      it("doesn't open on first click", function() {
		//  		$('.suggest textarea').mousedown();
		//  		expect( $('.suggest') ).toHaveClass('selected');
		//  		expect( $('.suggest .data') ).not.toHaveClass('open');
		//      });
		//      it("opens on double click", function() {
		//  		$('.suggest textarea').dblclick();
		//  		expect( $('.suggest') ).toHaveClass('selected');
		//  		expect( $('.suggest .data') ).toHaveClass('open');
		//  		expect( $('.suggest .data').attr('aria-haspopup') ).toEqual('true');
		//      });
		//      it("opens and is changed", function() {
		//  		expect(rows()[0][suggest]()).not.toEqual("SuggestMe");
		//  		$('.suggest textarea').dblclick().val("SuggestMe").change();
		//  		expect(rows()[0][suggest]()).toEqual("SuggestMe");
		//      });
		//      it("updates when changed above", function() {
		//  		rows()[0][suggest]("SuggestMe");
		//  		expect( $('.suggest textarea') ).toHaveValue("SuggestMe");
		//      });
		//      it("copies empty field", function() {
		//  		$('.suggest textarea').mousedown().trigger('copy');
		//  		expect( $('#ideal').text().trim() ).toEqual('--')
		//      });
		//      it("copies full field", function() {
		//  		rows()[0][suggest]("Autosuggest");
		//  		$('.suggest textarea').mousedown().trigger('copy');
		//  		expect( $('#ideal').text().trim() ).toEqual("Autosuggest")
		//      });
		//    });

		//  ALSO DATE FIELD

});