// describe("the bindings on fields with the table editor", function() {
// 	var field_1, t, val;
//   beforeEach(function() {
// 	t = null
// 	val = null
// 	factoryList();
// 	field_1 = fields()[0];
// 	field_1['field_type'] = 'date';
// 	loadFixtures("views/lists/_row.html","views/lists/_table.html");
// 	ko.applyBindings(dataModel);
//   });
//       describe("basic binding is occuring and values are set correctly", function() {
// 		it("marks the textarea with the date class", function() {
// 			waits(2)
// 			runs( function() {expect($('textarea.date').length).toEqual(rows().length);})
// 	    });
// 		it("renders date values in toDateString val", function() {
// 			// waits(20)
// 			// runs( function() { 
// 			// 	val = '11/11/11';
// 			// 	rows()[0][field_1.to_param](val); 
// 			// 	expect( $('tr:last textarea.date:first').val() ).toEqual( new Date(val).toDateString() );
// 			// });
// 		});
// 		it("renders a blank row as -- not a date", function() {
// 			// $('textarea.date').each( function() {
// 			// 	expect( $(this).val() ).toEqual( '--' );
// 			// });
// 		});
// 		it("opens the calendar when clicking on the calendar icon, places cursor in text box", function() {
// 			$('.cal:first').click();
// 			expect( $('.data:first').next('div') ).toContain('div.ui-datepicker-inline');
// 		});
// 		describe("calendar is opened", function() {
// 			beforeEach(function() {
// 				t  = new Date();
// 				$('.date:last').dblclick().focus();
// 			});
// 			// it("opens the calendar", function() {
// 			// 	expect( $('.date:last').next('div') ).toContain('div.ui-datepicker-inline');
// 			// });
// 			it("clicking elsewhere closes the calendar", function() {
// 				// $('.date:last span:first').mousedown();
// 				// expect( $('div.ui-datepicker-inline').length ).toBe(0);
// 				// expect( rows()[0][field_1.to_param]() ).toEqual('');
// 				// expect( $('.date:last') ).toHaveValue('--');
// 			});
// 			it("opens to dataModel.current this month if blank", function() {
// 				// expect( $('.ui-datepicker-month') ).toHaveText( $.datepicker._defaults.monthNames[t.getMonth()] );
// 				// expect($('.ui-datepicker-year') ).toHaveText( t.getFullYear() );
// 			});
// 			it("highlights today", function() {
// 				// var today = $('.ui-datepicker-calendar tbody tr td').filter(function() { return $(this).text() == t.getDate(); });
// 				// expect(today).toHaveClass('ui-datepicker-current-day');
// 			});
// 			it("presses down button date back", function() {
// 				var press = $.Event("keydown");
// 				rows()[0][field_1.to_param](t.toDateString());
// 				press.ctrlKey = false, 
// 					press.keyCode = 40;
// 				$('.date:last').trigger(press);
// 			  expect( new Date( rows()[0][field_1.to_param]()) ).toBeLessThan( t );
// 			});
// 			it("presses down button date forward", function() {
// 				// var press = $.Event("keydown");
// 				// rows()[0][field_1.to_param](t.toDateString());
// 				// press.ctrlKey = false, 
// 				// 	press.keyCode = 38;
// 				// $('.date:last').trigger(press);
// 				// 			  expect( new Date( rows()[0][field_1.to_param]()) ).toBeGreaterThan( t );
// 			});
// 			it("presses down button date forward", function() {
// 				// var day =  parseInt($('tr:last .ui-datepicker-calendar td:eq(4) a').text());
// 				// $('tr:last .ui-datepicker-calendar td:eq(4) a').click();
// 				// expect( $('div.ui-datepicker-inline').length ).toBe(0);
// 				// expect( new Date(rows()[0][field_1.to_param]()).getDate() ).toEqual( day );
// 			});
// 		});
// 		describe("changing the value if already set", function() {
// 			beforeEach(function() {
// 				 t = new Date(), val = t.toDateString()
// 				rows()[0][field_1.to_param](val);
// 			});
// 		  	it("opens to dataModel.current month of a value that's been set", function() {
// 				waits(2)
// 				runs( function() {
// 					$('.date:last').dblclick().focus();
// 					expect($('.ui-datepicker-month') ).toHaveText( $.datepicker._defaults.monthNames[t.getMonth()] );
// 					expect($('.ui-datepicker-year') ).toHaveText( t.getFullYear() );
// 				})
// 			});
// 			it("highlights today", function() {
// 				waits(10)
// 				runs( function() {
// 					$('.date:last').dblclick().focus();
// 					var today = $('.ui-datepicker-calendar tbody tr td').filter(function() { return $(this).text() == t.getDate(); });
// 					expect(today).toHaveClass('ui-datepicker-current-day');
// 				})
// 			});
// 			it("presses down button date back", function() {
// 				waits(20)
// 				runs( function() {
// 					$('.date:last').dblclick().focus();
// 					var press = $.Event("keydown");
// 					press.ctrlKey = false, 
// 						press.keyCode = 40;
// 					$('.data:first').trigger(press);
// 					expect( new Date(rows()[0][field_1.to_param]()) ).toBeLessThan( t );
// 				})
// 			});
// 			it("click to set the date", function() {
// 				waits(20)
// 				runs(function() {
// 					$('.date:last').dblclick().focus();
// 					var press = $.Event("keydown");
// 					press.ctrlKey = false, 
// 					press.keyCode = 38;
// 					$('.data:first').trigger(press);
// 					expect( new Date(rows()[0][field_1.to_param]()) ).toBeGreaterThan( t );
// 				})
// 			});
// 		});
// 	  });
// });
// 
// //  Commented out till the new row can be re-thought through
// 
// // describe("the bindings on fields with the newRow editor", function() {
// // 	var field_1;
// // 	beforeEach(function() {
// // 		factoryList();
// // 		field_1 = fields()[0];
// // 		field_1['field_type'] = 'date';
// // 		newRows.push( new rowModel({key: 'new', list: _list })  );
// // 		loadFixtures("views/lists/_row.html","views/lists/_newRow.html");
// // 		ko.applyBindings(dataModel);
// // 	});
// // 	
// // 	describe("basic binding is occuring and values are set correctly", function() {
// // 		it("marks the textarea with the date class", function() {
// // 			expect($('textarea.date').length).toEqual(1);
// // 		});
// // 		it("renders a blank row as -- not a date", function() {
// // 			$('textarea.date:first').each( function() {
// // 				expect( $(this).val() ).toEqual( '--' );
// // 			});
// // 		});
// // 		describe("calendar is opened", function() {
// // 			var t = new Date();
// // 			beforeEach(function() {
// // 			  $('.data:first').click().focus();
// // 			});
// // 			it("opens the calendar", function() {
// // 				bl( $('.data:first').next('div') );
// // 				expect( $('.data:first').next('div') ).toContain('div.ui-datepicker-inline');
// // 			});
// // 			it("clicking elsewhere closes the calendar", function() {
// // 				$(document).click();
// // 				expect( $('div.ui-datepicker-inline').length ).toBe(0);
// // 				expect( rows()[0][field_1.to_param]() ).toEqual('');
// // 				expect( $('.data:first') ).toHaveValue('--');
// // 			});
// // 			it("opens to dataModel.current this month if blank", function() {
// // 				expect($('.ui-datepicker-month') ).toHaveText( $.datepicker._defaults.monthNames[t.getMonth()] );
// // 				expect($('.ui-datepicker-year') ).toHaveText( t.getFullYear() );
// // 			});
// // 			it("highlights today", function() {
// // 				var today = $('.ui-datepicker-calendar tbody tr td').filter(function() { return $(this).text() == t.getDate(); });
// // 				expect(today).toHaveClass('ui-datepicker-current-day');
// // 			});
// // 			it("presses down button date back", function() {
// // 				var press = $.Event("keyup");
// // 				press.ctrlKey = false, 
// // 					press.keyCode = 40;
// // 				$('.data:first').trigger(press);
// // 			  expect( new Date(newRows()[0][field_1.to_param]()).getDate() ).toEqual( t.getDate() - 1 );
// // 			  expect( $('.data:first').parents('td') ).toHaveClass('selected');
// // 			});
// // 			it("presses down button date forward", function() {
// // 				var press = $.Event("keyup");
// // 				press.ctrlKey = false, 
// // 					press.keyCode = 38;
// // 				$('.data:first').trigger(press);
// // 			  expect( new Date(newRows()[0][field_1.to_param]()).getDate() ).toEqual( t.getDate() + 1 );
// // 			  expect( $('.data:first').parents('td') ).toHaveClass('selected');
// // 			});
// // 			it("click to set the date", function() {
// // 				var day =  parseInt($('.ui-datepicker-calendar td:eq(4) a').text());
// // 				$('.ui-datepicker-calendar td:eq(4) a').click();
// // 				// tests to make sure it's closed
// // 				expect( $('div.ui-datepicker-inline').length ).toBe(0);
// // 				expect( new Date(newRows()[0][field_1.to_param]()).getDate() ).toEqual( day );
// // 			});
// // 			
// // 		});
// // 
// // 	  });
// // });