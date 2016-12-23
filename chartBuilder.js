function addCommas(nStr) {
	// From: http://www.mredkj.com/javascript/numberFormat.html
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}
google.load("visualization", "1", { packages:["corechart", "controls"] });
google.setOnLoadCallback(function() {
	$(function() {
		var fields = [
			'Date',
			'Qs/day',
			'%Ans',
			'Visits/day',
			'A. ratio',
			'Total users',
			'Avid users'
		];
		var fieldTitles = [
			'Questions per Day',
			'Percent Answered',
			'Visits per Day',
			'Answer Ratio',
			'Total Users',
			'Avid Users'
		];
		var decimals = [
			1,
			3,
			0,
			3,
			0,
			0
		];
		var valueFormatters = [
			new google.visualization.NumberFormat({ fractionDigits: decimals[0] }),
			new google.visualization.NumberFormat({ fractionDigits: decimals[1] }),
			new google.visualization.NumberFormat({ fractionDigits: decimals[2] }),
			new google.visualization.NumberFormat({ fractionDigits: decimals[3] }),
			new google.visualization.NumberFormat({ fractionDigits: decimals[4] }),
			new google.visualization.NumberFormat({ fractionDigits: decimals[5] })
		];
		var fieldFormats = [
			function (num) { return valueFormatters[0].formatValue(num); },
			function (num) { return valueFormatters[1].formatValue(num) + '%'; },
			function (num) { return valueFormatters[2].formatValue(num); },
			function (num) { return valueFormatters[3].formatValue(num); },
			function (num) { return valueFormatters[4].formatValue(num); },
			function (num) { return valueFormatters[5].formatValue(num); }
		];
		var months = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec"
		];
		var dataFromDb = $("#data").text();
		var url = location.protocol + '//' + location.host + location.pathname;
		var val = $.trim(dataFromDb).replace(/[ \t]+/g, " ").replace(/[ \t]*\n[ \t]*/g, "\n");

		var rows = val.split("\n");
		var firstRow = rows[0].split(" ");
		var arrs = [];
		var okays = [5, 80, 500, 1.0, null, 75];
		var excels = [10, 90, 1500, 2.5, null, 150];

		for (var i = 1; i < firstRow.length; i++) {
			var arr = [[fields[0], fields[i]]];

			var hasFocus = (okays[i - 1] != null && excels[i - 1] != null);
			if (hasFocus) {
				arr[0].splice(1, 0, "Okay");
				arr[0].splice(1, 0, "Excellent");
			}

			for (var j = 0; j < rows.length; j++) {
				var cols = $.trim(rows[j]).split(/[ \t]+/);
				var $this = $(this);

				var time = new Date(new Date(cols[0]).getTime() + 12*60*60*1000);
				var data = parseFloat(cols[i]);

				var newdata = [time, data];
				if (hasFocus) {
					newdata.splice(1, 0, okays[i - 1]);
					newdata.splice(1, 0, excels[i - 1]);
				}
				arr[arr.length] = newdata;
			}
			arrs[arrs.length] = arr;
		}

		var dateFormatter = new google.visualization.DateFormat({
			pattern: 'MMM d, yyyy'
		});

		var graphColors = ['red', 'blue', 'darkgreen', '#777', '#f60', 'cyan', '#fa0', '#08f'];
		var ratingColors = ['#900', '#f80', '#070'];
		var range = {'start': new Date(new Date().getTime() - 14*24*60*60*1000), 'end': new Date()};
		for (var i = 0; i < arrs.length; i++) {
			for (var j = arrs[i].length - 1; j >= 0; j--) {
				if (arrs[i][j][3] == 0) {
					arrs[i].splice(j, 1);
				}
			}

			var dataTable = google.visualization.arrayToDataTable(arrs[i]);

			var titleIndex = 1;
			while (arrs[i][0][titleIndex] == "Excellent" || arrs[i][0][titleIndex] == "Okay") {
				titleIndex++;
			}

			var chartOptions = {
				'title': '',
				'focusTarget': 'category',
				'colors': arrs[i][0].length < 4 ? [graphColors.pop(Math.floor(Math.random() * graphColors.length))] : [ratingColors[2], ratingColors[1], graphColors.pop(Math.floor(Math.random() * graphColors.length))],
				'chartArea': {'width': '80%', 'height': '80%'},
				'legend': {'position': 'none'},
				'hAxis': {'format': 'MMM d'}
			};
			var controlOptions = {
				'filterColumnIndex': 0,
				'ui': {
					'chartType': 'LineChart',
					'chartOptions': {
						'chartArea': {'width': '80%', 'height': '20%'},
						'hAxis': {'baselineColor': 'none'}
					},
					'chartView': {
						'columns': [0, arrs[i][0].length < 4 ? 1 : 3]
					},
					'minRangeSize': 86400000
				}
			};

			var valueColor = '#444';
			var todayValue = parseFloat(arrs[i][arrs[i].length - 1][arrs[i][0].length < 4 ? 1 : 3]);

			if (okays[i] != null && excels[i] != null) {
				if (todayValue < okays[i]) {
					valueColor = ratingColors[0];
				} else if (todayValue < excels[i]) {
					valueColor = ratingColors[1];
				} else {
					valueColor = ratingColors[2];
				}
			}

			var htmlContents = "<div class='dashbox infobox'><span class='title'>" + fieldTitles[i] + "</span><span class='value' style='color:" + valueColor + "'>" + fieldFormats[i].call(this, todayValue) + "</span></div><div id='chart" + i + "' class='dashbox chartbox'></div><div id='control" + i + "' class='dashbox controlbox'></div>";

			var control = new google.visualization.ControlWrapper({
				'controlType': 'ChartRangeFilter',
				'containerId': 'control' + i,
				'options': controlOptions,
				'state': {'range': range}
			});

			var chart = new google.visualization.ChartWrapper({
				'chartType': 'LineChart',
				'containerId': 'chart' + i,
				'options': chartOptions
			});

			dateFormatter.format(dataTable, 0);
			var max = arrs[i][0].length < 4 ? 1 : 3;
			for (var j = 1; j <= max; j++) {
				valueFormatters[i].format(dataTable, j);
			}
			new google.visualization.Dashboard($("#dataoutput td:eq(" + i + ")").html(htmlContents)[0])
				.bind(control, chart)
				.draw(dataTable);

			$("#dataoutput td").height($("#dataoutput td").height()); // Hack for disappearing titles in Chrome.
		}
	});
});
