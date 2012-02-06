viewModel.graph = ko.dependentObservable(
	{ read: function() {
		var graph = false, goal = dataModel.current.view().goal();
		if( dataModel.current.view().goal.label() && dataModel.current.view().groups().length == 0 ) {
			var value = viewModel.groupedRows()[ dataModel.current.view().goal().field().name ][ dataModel.current.view().goal().field().report ],
				max = goal.value() > value ? goal.value() : value;
			graph = {
				max: max,
				goal: true,
				bars: [
					{
						value: value, 
						label: goal.field().report+' of '+goal.field().name,
						color: 1
					}
				]
			}
		}
		if( dataModel.current.view().groups().length > 0 && dataModel.current.view().groups.on() ) {
			var max = 0, report = dataModel.current.view().reportOn(), bars = [], uniques = [], key = false;
			var goal =  dataModel.current.view().reportOn() != undefined && dataModel.current.view().reportOn().label == 'goal'

			for (var i=0; i < viewModel.groupedRows().rows.length; i++) {
				var parent = viewModel.groupedRows().rows[i];
				var _rows = [];
				if( parent.rows.length == 0 ) { 
					_rows.push(parent);
					var t = 1;
				} else {
					var t = viewModel.groupedRows()._uniques[1].length;
					_rows = parent.rows;
					key = viewModel.groupedRows()._uniques[1];
				}
				for (var ii=0; ii < t; ii++) {
					var row = _rows[ii];
					if( row == undefined ) { 
						row = {};
						if( report != undefined ) {
							row[ report.name ] = {};
							row[ report.name ][report.report] = 0;
							row[ report.name ]._uniques = [];
						}
						row['_value'] = viewModel.groupedRows()._uniques[1][ii].display;
					}
					var value = report != undefined ? row[report.name][report.report] : 0;

					if( report != undefined && report.label == 'goal' && i > 0 ) { 
						if( report.report == 'unique' ) {
							var unique = row[report.name]._uniques;
							for (var iii=0; iii < unique.length; iii++) {
								if( uniques.indexOf(unique[iii]) === -1 ) { uniques.push(unique[iii]); } 
							};
							value = uniques.length;
						} else {
							value += bars[i-1].value; 
						}
					}
					var step = 'norm',
						label = row._value;
					if( t > 1 ) {
						step =  ii > 0 ? 'small' : 'big';
						label = Math.round(t/2) != ii ? '' : parent._value;
					}
					bars.push( {label: label, value:  value, color: ii, step: step });
					max = value > max ? value : max;
				};
			};

			if( report != undefined && report.label == 'goal' ) {
				max = dataModel.current.view().goal().value() > max ? dataModel.current.view().goal().value() : max;
			}

			graph = {
				max: max,
				bars: bars,
				key: key,
				goal: goal
			}
			graph.need_select = true;
		} 

		return graph;
	}, 
	deferEvaluation: true,
},
viewModel);

viewModel.graph.color = ['red','blue','green','orange','purple','yellow','pink'];
viewModel.graph.need_select = function() {
	if( viewModel.graph() ) {
		return viewModel.graph().need_select == undefined ? false : viewModel.graph().need_select;
	} else {
		return false;
	}
}