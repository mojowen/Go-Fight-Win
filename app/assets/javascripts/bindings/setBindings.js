function setBindings (argument) {
	appDataModel.custom_events();
	appDataModel.table_template();
	appDataModel.newRow_template();
	appDataModel.views_template();
	appDataModel.scrolling();
	appDataModel.copying();
	appDataModel.keyboard_shortcuts();
	appDataModel.groups_template();
	appDataModel.graph_template();
	appDataModel.fields_template();
	appDataModel.navigation();
	appDataModel.analyze_template();
}

function clearSelection() {
    if(document.selection && document.selection.empty) {
        document.selection.empty();
    } else if(window.getSelection) {
        var sel = window.getSelection();
        sel.removeAllRanges();
    }
}
// 
// function writeConsole(content) {
//  top.consoleRef=window.open('','myconsole',
//   'width=350,height=250'
//    +',menubar=0'
//    +',toolbar=1'
//    +',status=0'
//    +',scrollbars=1'
//    +',resizable=1')
//  top.consoleRef.document.writeln(
//   '<html><head><title>Console</title></head>'
//    +'<body bgcolor=white onLoad="self.focus()">'
//    +content
//    +'</body></html>'
//  )
//  top.consoleRef.document.close()
// }

// function doublepress(event, callback ) {
// 	if( doublepress.tracked == event.keyCode ) {
// 		doublepress.tracked = false;
// 		console.log('double');
// 		event.preventDefault();
// 	} else {
// 		doublepress.tracked = event.keyCode;
// 		window.setTimeout(function() { doublepress.tracked = false; console.log('off'); }, 200);
// 	}
// }
// doublepress.tracked = false;