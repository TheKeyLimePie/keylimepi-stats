//max. data values on a big chart
amountBig = 50;
amountDSL = 96;	//speedtest recorded every 15 min -> 4*24 = 96
interval = 0;
intervalDSL = 0;

function init()
{
	$("#sync_on_off").on("click", function()
	{
		toggleSync();
	});
	
	$("#load_dsl_data").on("click", function()
	{
		updateDSL();
	});

	clock_update = window.setInterval(clock, 1000);
	
	Chart.defaults.global.responsive = true;
	Chart.defaults.global.maintainAspectRatio = false;
	//Temperature chart
	var data = {labels:[], datasets:[
	{
		label: "Temperature",
		fillColor: "rgba(153,204,0,0.2)",
		strokeColor: "rgba(153,204,0,1)",
		pointColor: "rgba(153,204,0,1)",
		pointStrokeColor: "#fff",
		pointHighlightFill: "#fff",
		pointHighlightStroke: "rgba(220,220,220,1)",
		data: []
	}]};
	var config = {
		bezierCurve : false,
		tooltipTemplate: "<%= label%> | <%= value%>\u00B0 C"
	};
	var ctx = $("#temperature").get(0).getContext("2d");
	chartTemp = new Chart(ctx).Line(data, config);
	
	//CPU chart
	data = {
		labels: ["CPU", "CPU0", "CPU1", "CPU2", "CPU3"],
		datasets: [
			{
				label: "Idle",
				fillColor: "rgba(153,204,0,0.5)",
				strokeColor: "rgba(153,204,0,0.8)",
				highlightFill: "rgba(153,204,0,0.75)",
				highlightStroke: "rgba(153,204,0,1)",
				data: [50, 50, 50, 50, 50]
			},
			{
				label: "Used",
				fillColor: "rgba(175,17,67,0.5)",
				strokeColor: "rgba(175,17,67,0.8)",
				highlightFill: "rgba(175,17,67,0.75)",
				highlightStroke: "rgba(175,17,67,1)",
				data: [50, 50, 50, 50, 50]
			}
		]
	};
	ctx = $("#cpu_cores").get(0).getContext("2d");
	chartCPUCores = new Chart(ctx).Bar(data, {multiTooltipTemplate: "<%= value%>%"});
	chartCPUCores.datasets[0].bars[0].fillColor = "rgba(51,181,229,0.5)";
	chartCPUCores.datasets[0].bars[0].strokeColor = "rgba(51,181,229,0.8)";
	chartCPUCores.datasets[0].bars[0].highlightFill = "rgba(51,181,229,0.75)";
	chartCPUCores.datasets[0].bars[0].highlightStroke = "rgba(51,181,229,0.1)";
	chartCPUCores.datasets[1].bars[0].fillColor = "rgba(0,153,204,0.5)";
	chartCPUCores.datasets[1].bars[0].strokeColor = "rgba(0,153,204,0.8)";
	chartCPUCores.datasets[1].bars[0].highlightFill = "rgba(0,153,204,0.75)";
	chartCPUCores.datasets[1].bars[0].highlightStroke = "rgba(0,153,204,0.1)";
	
	//RAM chart
	data = [
		{
			value: 0,
			color: "rgba(153,204,0,0.75)",
			label: "Free RAM"
		},
		{
			value: 100,
			color: "rgba(175,17,67,0.75)",
			label: "Occupied RAM"
		}
	];
	//, onAnimationProgress: function(){this.showTooltip(this.segments, true)}, tooltipEvents: [], showTooltips: true
	ctx = $("#ram").get(0).getContext("2d");
	chartRam = new Chart(ctx).Doughnut(data, {animationEasing: "easeOutQuart", tooltipTemplate: "<%= label%>: <%= value%>MiB"});
	
	//Root disk space chart
	data[0].label = "Free disk space";
	data[1].label = "Occupied disk space";
	//, onAnimationProgress: function(){this.showTooltip(this.segments, true)}, tooltipEvents: [], showTooltips: true
	ctx = $("#disk").get(0).getContext("2d");
	chartDisk = new Chart(ctx).Doughnut(data, {animationEasing: "easeOutQuart", tooltipTemplate: "<%= label%>: <%= value%>MiB"});
	
	//SDA1 disk space chart
	data[0].label = "Free disk space";
	data[1].label = "Occupied disk space";
	//, onAnimationProgress: function(){this.showTooltip(this.segments, true)}, tooltipEvents: [], showTooltips: true
	ctx = $("#sda").get(0).getContext("2d");
	chartSDA = new Chart(ctx).Doughnut(data, {animationEasing: "easeOutQuart", tooltipTemplate: "<%= label%>: <%= value%>MiB"});
	
	//Network chart
	data = {
		labels: [],
		datasets: [
			{
				label: "Incoming",
				fillColor: "rgba(153,204,0,0.2)",
				strokeColor: "rgba(153,204,0,1)",
				pointColor: "rgba(153,204,0,1)",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(220,220,220,1)",
				data: []
			},
			{
				label: "Outgoing",
				fillColor: "rgba(51,181,229,0.2)",
				strokeColor: "rgba(51,181,229,1)",
				pointColor: "rgba(51,181,229,1)",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(220,220,220,1)",
				data: []
			}
		]
	}
	ctx = $("#network").get(0).getContext("2d");
	chartNetwork = new Chart(ctx).Line(data, {bezierCurve: false, multiTooltipTemplate: "<%= value%> KiB/s"});
	
	//DSL chart
	data = {
		labels: [],
		datasets: [
			{
				label: "Download",
				fillColor: "rgba(153,204,0,0.2)",
				strokeColor: "rgba(153,204,0,1)",
				pointColor: "rgba(153,204,0,1)",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(220,220,220,1)",
				data: []
			},
			{
				label: "Upload",
				fillColor: "rgba(51,181,229,0.2)",
				strokeColor: "rgba(51,181,229,1)",
				pointColor: "rgba(51,181,229,1)",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(220,220,220,1)",
				data: []
			}
		]
	}
	ctx = $("#dsl").get(0).getContext("2d");
	chartDSL = new Chart(ctx).Line(data, {bezierCurve: false, multiTooltipTemplate: "<%= value%> MBit/s", animation: false, showScale: false});

	//start updating
	update();
	updateDSL();
	interval = window.setInterval(update, 3000);
	intervalDSL = window.setInterval(updateDSL, 900000);
}
function pad(number, digits)
{
	var sp = digits - number.toString().length;
	var txt = "";
	for(var x = 0; x < sp; x++)
	{
		txt = txt.concat("0");
	}
	return txt.concat(number);
}
function update()
{
	$.get("stats.php", function(val)
	{
		val = $.parseJSON(val);
		var d = new Date();
		//temperature
		var date = pad(d.getHours(), 2).concat(":", pad(d.getMinutes(), 2), ":", pad(d.getSeconds(), 2));
		var temp = [(parseInt(val.temp / 10)) / 100];
		console.log("Temperature: " + temp + " deg C");
		chartTemp.addData(temp, date);
		if(chartTemp.datasets[0].points.length > amountBig)
			chartTemp.removeData();
		//CPU
		var cpu = val.cpu[0];
		var cpu0 = val.cpu[1];
		var cpu1 = val.cpu[2];
		var cpu2 = val.cpu[3];
		var cpu3 = val.cpu[4];
		
		var cpu_busy = (parseInt(cpu[1]) + parseInt(cpu[2]) + parseInt(cpu[3]));
		var cpu_idle = parseInt(cpu[4]);
		var cpu_busy_perc = parseInt(cpu_busy / (cpu_idle + cpu_busy) * 100);
		var cpu0_busy = (parseInt(cpu0[1]) + parseInt(cpu0[2]) + parseInt(cpu0[3]));
		var cpu0_idle = parseInt(cpu0[4]);
		var cpu0_busy_perc = parseInt(cpu0_busy / (cpu0_idle + cpu0_busy) * 100);
		var cpu1_busy = parseInt(cpu1[1]) + parseInt(cpu1[2]) + parseInt(cpu1[3]);
		var cpu1_idle = parseInt(cpu1[4]);
		var cpu1_busy_perc = parseInt(cpu1_busy / (cpu1_idle + cpu1_busy) * 100);
		var cpu2_busy = parseInt(cpu2[1]) + parseInt(cpu2[2]) + parseInt(cpu2[3]);
		var cpu2_idle = parseInt(cpu2[4]);
		var cpu2_busy_perc = parseInt(cpu2_busy / (cpu2_idle + cpu2_busy) * 100);
		var cpu3_busy = parseInt(cpu3[1]) + parseInt(cpu3[2]) + parseInt(cpu3[3]);
		var cpu3_idle = parseInt(cpu3[4]);
		var cpu3_busy_perc = parseInt(cpu3_busy / (cpu3_idle + cpu3_busy) * 100);
		
		console.log("cpu: " + cpu_busy_perc + "% | " + "cpu0: " + cpu0_busy_perc + "% | " + "cpu1: " + cpu1_busy_perc + "% | " + "cpu2: " + cpu2_busy_perc + "% | " + "cpu3: " + cpu3_busy_perc + "%");
		//idle
		chartCPUCores.datasets[0].bars[0].value = 100 - cpu_busy_perc;
		chartCPUCores.datasets[0].bars[1].value = 100 - cpu0_busy_perc;
		chartCPUCores.datasets[0].bars[2].value = 100 - cpu1_busy_perc;
		chartCPUCores.datasets[0].bars[3].value = 100 - cpu2_busy_perc;
		chartCPUCores.datasets[0].bars[4].value = 100 - cpu3_busy_perc;
		//busy
		chartCPUCores.datasets[1].bars[0].value = cpu_busy_perc;
		chartCPUCores.datasets[1].bars[1].value = cpu0_busy_perc;
		chartCPUCores.datasets[1].bars[2].value = cpu1_busy_perc;
		chartCPUCores.datasets[1].bars[3].value = cpu2_busy_perc;
		chartCPUCores.datasets[1].bars[4].value = cpu3_busy_perc;
		
		chartCPUCores.update();
		//RAM
		var free = parseInt(val.ram[1]);
		var occ = val.ram[0] - val.ram[1];
		console.log("RAM: free: " + free + " MiB, occ.: " + occ + " MiB");
		chartRam.segments[0].value = free;
		chartRam.segments[1].value = occ;
		chartRam.update();
		//Root disk
		var free = parseInt(val.root[1]);
		var occ = parseInt(val.root[2]);
		console.log("Disk: free: " + free + " MiB, disk occ.: " + occ + " MiB");
		chartDisk.segments[0].value = occ;
		chartDisk.segments[1].value = free;
		chartDisk.update();
		//SDA1 disk
		var free = parseInt(val.sda[1]);
		var occ = parseInt(val.sda[2]);
		console.log("Disk: free: " + free + " MiB, disk occ.: " + occ + " MiB");
		chartSDA.segments[0].value = occ;
		chartSDA.segments[1].value = free;
		chartSDA.update();
		//Network
		var date = pad(d.getHours(), 2).concat(":", pad(d.getMinutes(), 2), ":", pad(d.getSeconds(), 2));
		var inData = parseInt(val.network[0] * 100)/ 100;
		var outData = parseInt(val.network[2] * 100) / 100;
		console.log("In: " + inData + " KiB/s, out: " + outData + " KiB/s");
		chartNetwork.addData([inData, outData], date);
		if(chartNetwork.datasets[0].points.length > amountBig)
			chartNetwork.removeData();
		
		var totalIn = (parseInt((val.network[1]/1024/1024) * 1000) / 1000);
		var totalOut = (parseInt((val.network[3]/1024/1024) * 1000) / 1000);
		$("#total_in").html("Total in: ".concat(totalIn, " GiB"));
		$("#total_out").html("Total out: ".concat(totalOut, " GiB"));
	});
}
function updateDSL()
{
	$.post("dsl/index.php", {format: "json"}, function(data)
	{
		var object = $.parseJSON(data);
		var dates = object.dates;
		var ping = object.ping;
		var dl = object.dl;
		var ul = object.ul;
		
		chartDSL.datasets[0].points = new Array();
		chartDSL.datasets[1].points = new Array();
		
		for(var x = dates.length > amountDSL ? dates.length - amountDSL : 0; x < dates.length; x++)
		{
			chartDSL.addData([dl[x], ul[x]], dates[x]);
		}
	});
}

function toggleSync()
{
	if($("#sync_on_off").hasClass("pause"))
	{
		$("#sync_on_off").removeClass("pause").addClass("continue");
		$("#sync_on_off").html("Continue");
		window.clearInterval(interval);
	}
	else
	{
		$("#sync_on_off").removeClass("continue").addClass("pause");
		$("#sync_on_off").html("Pause");
		update();
		interval = window.setInterval(update, 3000);
	}
}
function clock()
{
	var d = new Date();
	var string = pad(d.getHours(),2).concat(":", pad(d.getMinutes(),2), ":", pad(d.getSeconds(),2));
	document.getElementById("clock").innerHTML = string;
}