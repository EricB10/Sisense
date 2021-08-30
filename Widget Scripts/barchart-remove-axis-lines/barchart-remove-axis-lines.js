widget.on('processresult', function(w, args) {
//	debugger;
	var xAxis = args.result.xAxis;
	xAxis.gridLineWidth = 0;
	xAxis.lineWidth = "0";
	var yAxis = args.result.yAxis[0];
	yAxis.gridLineWidth = 0;
	yAxis.lineWidth = "0";
});