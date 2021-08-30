// Configure 'interpolate' color theme from --> https://github.com/d3/d3-scale-chromatic
var colorTheme = 'interpolateReds';

// Configure range of color intensity (0.0 - 1.0)
var leftColorIntensity = 0.0;
var rightColorIntensity = 0.4;

widget.on("ready", function (w, args) {
    $.getScript('https://d3js.org/d3.v5.min.js', function (data, textStatus) {
		//debugger;
        var tags = $('.table-grid__cell--col-parent-sibling-last', element);
		// Get min and max values in pivot table
        var minValue = 0.0;
		var maxValue = 0.0;
        for (var i = 0; i < tags.length; i++) {
			// Remove commas and check for abbreviations 
            let tagText = tags[i].textContent.replace(/,/g,'');
            let parseVal = parseFloat(tagText);
			if (tagText.includes('T')) {
				parseVal = parseVal * 1000000000000;
			}
			else if (tagText.includes('B')) {
				parseVal = parseVal * 1000000000;
			}
			else if (tagText.includes('M')) {
				parseVal = parseVal * 1000000;
			}
			else if (tagText.includes('K')) {
				parseVal = parseVal * 1000;
			}
			if (parseVal && parseVal < minValue) {
                minValue = parseVal;
            }
            if (parseVal && parseVal > maxValue) {
                maxValue = parseVal;
            }
        }
		
		// Set color intensity scale
        myScale = d3.scaleLinear()
            .domain([minValue, maxValue])
            .range([leftColorIntensity, rightColorIntensity]);
		
		// Assign scaled color values
        for (var i = 0; i < tags.length; i++) {
			//debugger;
			let colorValue = 0.0;
			// Remove commas and check for abbreviations
            let tagText = tags[i].textContent.replace(/,/g,'');
            let parseVal = parseFloat(tagText);
			if (tagText.includes('T')) {
				parseVal = parseVal * 1000000000000;
			}
			else if (tagText.includes('B')) {
				parseVal = parseVal * 1000000000;
			}
			else if (tagText.includes('M')) {
				parseVal = parseVal * 1000000;
			}
			else if (tagText.includes('K')) {
				parseVal = parseVal * 1000;
			}
			// Configure % of max value as threshold to color
			let thresholdVal = maxValue * .05;
            if (parseVal && parseVal > thresholdVal) {
                colorValue = parseVal;
                let scaled = myScale(colorValue);
                tags[i].style.backgroundColor = d3[colorTheme](scaled);
            }
        }
    });
});