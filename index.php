<?php
	require('defaultConfig.php');
	@include('config.php');

	function url() {
		return (isset($_SERVER['HTTPS']) ? 'https://' : 'http://') . $_SERVER['SERVER_NAME'] . strtok($_SERVER['REQUEST_URI'], '?');
	}
?><!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
	<head>
		<title>Stacker | Site Statistic Graphing</title>
		<link rel="shortcut icon" href="favicon.ico" />
		<link rel="icon" href="favicon.ico" />
		<script type="text/javascript" src="https://www.google.com/jsapi"></script>
		<script type='text/javascript' src='jQuery.js'></script>
		<script type='text/javascript' src='chartBuilder.js'></script>
		<script type='text/javascript'>
			$(document).ready(function() {
				var url = location.protocol + '//' + location.host + location.pathname;

				$("#sitepicker").change(function() {
					window.location = url + '?siteId=' + $(this).val();
				});
			});
		</script>
		<link href='WfRoboto/stylesheet.css' type='text/css' rel='stylesheet' /> <!-- Roboto from FontSquirrel -->
		<link href='style.css' type='text/css' rel='stylesheet' />
	</head>
	<body>
		<div id='data'><?php
			$siteid = ctype_digit(@$_GET['siteId']) ? intval($_GET['siteId']) : 1;
			$mysqli = new mysqli($_CONFIG['db_host'], $_CONFIG['db_user'], $_CONFIG['db_password'], $_CONFIG['db_name']);
			$query = "SELECT * FROM stack_data LEFT JOIN stack_sites ON SiteID=StackSiteID WHERE SiteID={$siteid} ORDER BY DateRecorded ASC";
			$site = array();

			if ($result = $mysqli->query($query)) {
				while ($row = $result->fetch_assoc()) {
					echo date('Y-m-d', intval($row['DateRecorded']));
					echo " ";
					echo $row['QuestionsPerDay'];
					echo " ";
					echo $row['PercentAnswered'];
					echo " ";
					echo $row['VisitsPerDay'];
					echo " ";
					echo $row['AnswerRatio'];
					echo " ";
					echo $row['UserCount'];
					echo " ";
					echo $row['AvidUserCount'];
					echo "\n";

					if (count($site) == 0) {
						$site['url'] = "http://{$row['Domain']}";
					}
				}

				$result->free();
			}
		?></div>
		<div id='header'>
			<div style='margin:0 30px;font-size:150%;text-align:center'>
				<a href='<?php echo url(); ?>'><img src='banner.png' style='border:0'/></a>
				<br/>
				<select id='sitepicker'><?php
					$query = "SELECT Name, SiteID FROM stack_data GROUP BY SiteID ORDER BY DateCreated ASC";

					if ($result = $mysqli->query($query)) {
						while ($row = $result->fetch_assoc()) {
							echo "<option value='{$row['SiteID']}'";
							if (intval($row['SiteID']) == $siteid) {
								echo " selected";
							}
							echo ">{$row['Name']}</option>";
						}

						$result->free();
					}
				?></select>
				<br />
				<a href='<?php echo $site['url']; ?>' class='visitheader'>Visit the site!</a>
			</div>
		</div>
		<table id='dataoutput' cellspacing=1 cellpadding=0>
			<tr height=300>
				<td width=33%></td>
				<td width=34%></td>
				<td width=33%></td>
			</tr>
			<tr height=300>
				<td width=33%></td>
				<td width=34%></td>
				<td width=33%></td>
			</tr>
		</table>
	</body>
	<div id='footer'><i>Stacker</i> created by <a href='http://stackoverflow.com/users/1438733/eric'>Eric</a>. The project is open-source and available <a href='https://github.com/ekumlin/Stacker'>on GitHub</a>!</div>
</html>
