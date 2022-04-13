dashboard.on('refreshstart', function (se, ev) {
	widgetid1 = '620522e353fc430039be31ab'
	widgetid2 = '6205230353fc430039be31ad'
	// Set widgetWidth variables to a proportion of total dashboard width
    // Sum of all widgetWidths should = 100
	widgetWidth1 = 33
	widgetWidth2 = 67

	$.each(ev.dashboard.layout.columns, function(columnIndex, column){
		$.each(column.cells, function(cellIndex, cell){
			$.each(cell.subcells, function(subcellIndex, subcell){
				if(subcell.elements[0].widgetid == widgetid1)
				{	
					subcell.width = widgetWidth1
				}else if(subcell.elements[0].widgetid == widgetid2)
				{	
					subcell.width = widgetWidth2
				}
			})
		})
	})
});