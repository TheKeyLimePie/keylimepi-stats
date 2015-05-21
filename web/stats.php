<?php
	//CPU stats
	$cpu_data = shell_exec("head -5 /proc/stat");
	$cpu_array_prev = explode("\n", trim($cpu_data));
	for($x = 0; $x < count($cpu_array_prev); $x++)
	{
		$a = explode(" ", preg_replace('/\s+/', ' ', $cpu_array_prev[$x]));
		$cpu_array_prev[$x] = array_slice($a, 0, 5);
	}
	//Network stats
	$net_data_prev = trim(shell_exec("cat /proc/net/dev | grep -P '^\s*eth0'"));
	$net_data_prev = explode(" ", preg_replace('/\s+/', " ", $net_data_prev));

	sleep(1);

	//CPU DELTA stats
	$cpu_data = shell_exec("head -5 /proc/stat");
	$cpu_array = explode("\n", trim($cpu_data));
	for($x = 0; $x < count($cpu_array); $x++)
	{
		$a = explode(" ", preg_replace('/\s+/', ' ', $cpu_array[$x]));
		$cpu_array[$x] = array_slice($a, 0, 5);
	}
	for($x = 0; $x < count($cpu_array); $x++)
	{
		for($y = 1; $y < count($cpu_array[$x]); $y++)
		{
			$cpu_array[$x][$y] = $cpu_array[$x][$y] - $cpu_array_prev[$x][$y];
		}
	}
	//Network DELTA stats
	$net_data = trim(shell_exec("cat /proc/net/dev | grep -P '^\s*eth0'"));
	$net_data = explode(" ", preg_replace('/\s+/', " ", $net_data));
	$net_array = [($net_data[1] - $net_data_prev[1])/1024, $net_data[1]/1024, ($net_data[9] - $net_data_prev[9])/1024, $net_data[9]/1024];
	//Root disk stats
	$root_array = explode("\n",trim(shell_exec("df -lm | grep -P '^/dev/root(.)*' | grep -Po '(?<=\s)[0-9]+'")));
	//SDA1/HDD stats
	$sda_array = explode("\n", trim(shell_exec("df -lm | grep -P '^/dev/sda1(.)*' | grep -Po '(?<=\s)[0-9]+'")));
	//RAM stats
	$ram_array = array();
	$ram_array[] = trim(shell_exec("free -m | grep -P -o '(?<=^Mem:\s{11})[0-9]{1,4}'"));
	preg_match('/[0-9]{1,4}$/', trim(shell_exec("free -m | grep -Po '(?<=^\-/\+ buffers/cache:).*[0-9]{1,4}(?=$)'")), $val);
	$ram_array[] = $val[0];
	//Temp stats
	$temp = trim(shell_exec("cat /sys/class/thermal/thermal_zone*/temp"));

	//Output
	$obj = new stdClass();
	$obj->cpu = $cpu_array;
	$obj->network = $net_array;
	$obj->root = $root_array;
	$obj->sda = $sda_array;
	$obj->ram = $ram_array;
	$obj->temp = $temp;

	echo json_encode($obj);
?>
