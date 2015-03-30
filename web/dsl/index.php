<?php
	/*
	This PHP script requires a speedtest log ("speedlog.txt")
	In my case this is just the output of https://github.com/sivel/speedtest-cli which is called every 15 minutes by cron
	It looks like this:
		...
		Mo 30. Mar 15:45:01 CEST 2015
		Retrieving speedtest.net configuration...
		Retrieving speedtest.net server list...
		Testing from YOUR ISP (YOUR IP)...
		Selecting best server based on latency...
		Hosted by A SPEEDTEST SERVER: 28.626 ms
		Testing download speed........................................
		Download: 45.03 Mbit/s
		Testing upload speed..................................................
		Upload: 9.04 Mbit/s

		Mo 30. Mar 16:00:01 CEST 2015
		Retrieving speedtest.net configuration...
		Retrieving speedtest.net server list...
		Testing from YOUR ISP (YOUR IP)...
		Selecting best server based on latency...
		Hosted by A SPEEDTEST SERVER: 24.604 ms
		Testing download speed........................................
		Download: 44.91 Mbit/s
		Testing upload speed..................................................
		Upload: 8.82 Mbit/s
		...
		
	There are two cases for generating the output:
	- No POST parameter is given or it's just anything: Cool if you want your raw data
	  It will generate a CSV file which can be opened with e.g. Excel
	- The POST parameter equals "json": Cool if you want to use the data in a web app
	  The script will generate a JSON object
	*/
	$doCSV = $_POST["format"] != "json" OR !isset($_POST["format"]);
	if($doCSV)
	{
		header("Content-Type: text/csv; charset=utf-8");
		header("Content-Disposition: attachment; filename=dslmessung.csv");
	}
	
	$handle = fopen("speedlog.txt", "r") or die("Where's the log?");
	$content = fread($handle, filesize("speedlog.txt"));
	fclose($handle);
	
	$datasets = preg_split("/\n\s*\n/Uis", $content);
	
	if($doCSV)
	{
		$handleOut = fopen("php://output", "a");
		fputcsv($handleOut, array("Datum", "Ping (ms)", "Download (MBit/s)", "Upload (MBit/s)"), ";");
	}
	else
	{
		$output = new stdClass();
		$output->dates = array();
		$output->ping = array();
		$output->dl = array();
		$output->ul = array();
	}
	for($x = 0; $x < count($datasets); $x++)
	{
		$check = 0;
		$check += preg_match("/^[a-zA-Z]{2}(.+)2015$/m", $datasets[$x], $date);
		$check += preg_match("/[0-9]+\.[0-9]+(?=\sms)/m", $datasets[$x], $ping);
		$check += preg_match("/(?<=Download:\s)[0-9]+\.[0-9]+(?=\sMbit\/s)/m", $datasets[$x], $dl);
		$check += preg_match("/(?<=Upload:\s)[0-9]+\.[0-9]+(?=\sMbit\/s)/m", $datasets[$x], $ul);
		if($check == 4)
		{
			$array = array();
			$array[] = str_replace(".", ",", $date[0]);
			$array[] = str_replace(".", ",", $ping[0]);
			$array[] = str_replace(".", ",", $dl[0]);
			$array[] = str_replace(".", ",", $ul[0]);
			if($doCSV)
				fputcsv($handleOut, $array, ";");
			else
			{
				$output->dates[] = $date[0];
				$output->ping[] = $ping[0];
				$output->dl[] = $dl[0];
				$output->ul[] = $ul[0];
			}
		}
	}
	if($doCSV)
		fclose($handleOut);
	else
		echo json_encode($output);
?>