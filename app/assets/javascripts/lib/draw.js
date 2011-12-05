function draw(w,h) { 
	// setting up
    canvas = document.getElementById("canvas");
	if( canvas != null ){
	    ctx = canvas.getContext("2d"), 
			goal = currentView().goal(),
			graph = viewModel.graph();
		ctx.clearRect ( 0 , 0 , canvas.width , canvas.height );



		// setting up the graph parameters
		var max = graph.max, count = (graph.bars.length) > 0 ? graph.bars.length : 1;

		var top_buffer = 0,
			bottom_buffer = 20, 
		
			graph_inside_top_buffer = 20,
			graph_inside_side_buffer = 40, 
		
			label_side_buffer = 50,
			label_bottom_buffer = 18;
			notch_offset = 6,
		
			right_buffer = 0,
			left_buffer = 60
		
			goal_text_buffer = 50,
			key_spacing = 18;

		if( graph.key ) { right_buffer = 100; }
		if( graph.title ) { right_buffer = 80; }
		var graph_height = canvas.height-top_buffer-bottom_buffer,
			graph_width = canvas.width-right_buffer-left_buffer;

		var width = (graph_width-graph_inside_side_buffer)/(3*count);
		var step = new Object;
		step.norm = (graph_width - graph_inside_side_buffer - count*width) / (count+1);
		var groups = viewModel.groupedRows()._uniques != undefined ? viewModel.groupedRows()._uniques[0].length : 0;
		step.small = step.norm/2;
		step.big = (graph_width - graph_inside_side_buffer - count*width - (count-groups)*step.small ) / (groups+1);

		ctx.strokeStyle ='#999';
		ctx.lineWidth = 0.5;
		ctx.beginPath();
	
		ctx.font = 'bold 12px sans-serif';
		ctx.textAlign = 'right';
		ctx.textBaseline = 'middle';
	
		ctx.fillStyle = 'black';

		ctx.fillText('0', 50, canvas.height-8);

		// top val
		ctx.fillText(max, label_side_buffer, top_buffer+graph_inside_top_buffer);
		ctx.moveTo(left_buffer-notch_offset, top_buffer+graph_inside_top_buffer);
		ctx.lineTo(left_buffer+notch_offset, top_buffer+graph_inside_top_buffer);
	
		// 3/4 val
		ctx.fillText(Math.round(max/4*3), label_side_buffer, top_buffer+graph_inside_top_buffer+graph_height/4);
		ctx.moveTo(left_buffer-notch_offset, top_buffer+graph_inside_top_buffer+graph_height/4);
		ctx.lineTo(left_buffer+notch_offset, top_buffer+graph_inside_top_buffer+graph_height/4);

		// middle val
		ctx.fillText(Math.round(max/2), label_side_buffer, top_buffer+graph_inside_top_buffer+graph_height/2);
		ctx.moveTo(left_buffer-notch_offset, top_buffer+graph_inside_top_buffer+graph_height/2);
		ctx.lineTo(left_buffer+notch_offset, top_buffer+graph_inside_top_buffer+graph_height/2);

		// 1/4 val
		ctx.fillText(Math.round(max/4), label_side_buffer, top_buffer+graph_inside_top_buffer+graph_height/4*3);
		ctx.moveTo(left_buffer-notch_offset, top_buffer+graph_inside_top_buffer+graph_height/4*3);
		ctx.lineTo(left_buffer+notch_offset, top_buffer+graph_inside_top_buffer+graph_height/4*3);

		// the axises
		ctx.moveTo(left_buffer, top_buffer);
		ctx.lineTo(left_buffer, canvas.height);
		ctx.moveTo(0, canvas.height-bottom_buffer);
		ctx.lineTo(canvas.width-right_buffer, canvas.height-bottom_buffer);
		ctx.stroke();
	
		// drawing the graph
		ctx.lineWidth   = 2;
		ctx.strokeStyle = 'black';
		var xpos = left_buffer+graph_inside_side_buffer/2;
		for (var i=0; i < graph.bars.length; i++) {
			var stepper = graph.bars[i].step == undefined ? 'norm' : graph.bars[i].step;

			var value = graph.bars[i].value,
				xpos = xpos +step[stepper],
				yheight = (graph_height-graph_inside_top_buffer)*value/max;

			ctx.fillStyle = viewModel.graph.color[graph.bars[i].color ];
			ctx.lineWidth   = 1;
			ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';


			ctx.fillRect (xpos, canvas.height-bottom_buffer, width, -yheight);
			ctx.strokeRect (xpos, canvas.height-bottom_buffer, width, -yheight);

			// Shadows?
			// ctx.shadowOffsetX = 5;
			// ctx.shadowOffsetY = 5;
			// ctx.shadowBlur    = 4;
			// ctx.shadowColor   = 'rgba(0, 0, 0, 0.5)';

			// drawing the label
			ctx.font = '14px sans-serif';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'top';
			ctx.fillStyle = '#333';
			ctx.fillText(graph.bars[i].label, xpos+width/2, canvas.height - label_bottom_buffer);

			// Need to add the width of the graph
			xpos += width;
		};

		if( currentView().goal.label() && graph.goal ) {

			// Drawing the Goal
			ctx.beginPath();
			ctx.font = 'bold 18px sans-serif';
			ctx.strokeStyle = 'rgba(60, 60, 60, 0.6)';
			ctx.fillStyle = 'rgba(60, 60, 60, 0.6)';
			ctx.textAlign = 'right';
			ctx.textBaseline = 'top';


			ctx.lineWidth   = 3;

			ctx.moveTo(left_buffer, top_buffer+graph_inside_top_buffer+graph_height * (1 - goal.value() / max ));
			ctx.lineTo(canvas.width-right_buffer, top_buffer+graph_inside_top_buffer+graph_height * (1 - goal.value() / max ));
			ctx.stroke();
			ctx.fillText("goal: "+value+'/'+goal.value()+' ('+ (Math.round(  value / goal.value() * 1000 ) / 10) + '%)', canvas.width-right_buffer-goal_text_buffer, top_buffer+graph_inside_top_buffer+graph_height * (1 - goal.value() / max ));
			// Could be smarter, know if the goal is met or something
		}
		if( graph.need_select && currentView().reportOn() == undefined ) {
			ctx.font = 'bold 18px sans-serif';
			ctx.fillStyle = 'rgba(60, 60, 60, 0.6)';
			ctx.textAlign = 'center';
			ctx.fillText('select something to graph', canvas.width/2, canvas.height/2);
		}
		if( graph.key ) {
			ctx.font = 'bold 18px sans-serif';
			ctx.fillStyle = '#333';
			ctx.textAlign = 'left';
			ctx.fillText('key:', canvas.width-right_buffer, top_buffer+graph_inside_top_buffer);
			ctx.font = '14px sans-serif';
			for (var i=0; i < graph.key.length; i++) {
				ctx.fillStyle = viewModel.graph.color[i];
				ctx.fillText(graph.key[i].display, canvas.width-right_buffer, top_buffer+graph_inside_top_buffer+20+i*key_spacing);
			};

		}
	}
}