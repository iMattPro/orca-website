<?php
/*
 * CUE TRACKER VERSION CHECK
 * Version 4
 *
 * Written by Matt Friedman
 * 11/16/11 5:02 PM, Updated 8/5/19
 */

$xml = false;
$changes = '';

// Get user's version from the URL query
$version = !empty($_GET['version']) ? htmlentities($_GET['version'], ENT_QUOTES) : false;

// Read ct_change_log.xml into an array and generate change log
if ($version) {
	$xml = simplexml_load_string(file_get_contents('ct_change_log.xml'));
	if ($xml !== false) {
		foreach ($xml->revision as $revision) {
			if (version_compare($revision->version, $version, '>')) {
				$changes .= '<li class="version"><h2>' . display($revision->version) . ' <span class="date">[ ' . display($revision->date) . ' ]</span></h2></li>';
				$changes .= makeList($revision->log->new, 'New');
				$changes .= makeList($revision->log->change, 'Change');
				$changes .= makeList($revision->log->fix, 'Fix');
			}
		}
	}
}

function makeList($input, $type)
{
	$output = '';
	if (isset($input)) {
		foreach ($input as $value) {
			$output .= '<li> [' . $type . '] ' . display($value) . '</li>';
		}
	}
	return $output;
}

function display($text)
{
	return htmlentities($text, ENT_QUOTES, 'UTF-8');
}

?>
<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8"/>
	<title>Cue Tracker Version Check</title>
	<link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Droid+Sans:regular,bold"/>
	<style>

		html {
			font: 62.5%/1 "Droid Sans", "Lucida Sans Unicode", "Lucida Grande", Verdana, Arial, Helvetica, sans-serif;
			background: url("assets/bg.png");
		}

		body {
			max-width: 500px;
			margin: 0 auto;
			text-align: center;
		}

		strong {
			font-weight: bold;
		}

		a {
			color: #4e72be;
			font-weight: bold;
			text-decoration: none;
		}

		a:hover {
			opacity: 0.6;
		}

		a:active {
			position: relative;
			top: 1px;
			opacity: 0.3;
			/*	outline: none;*/
		}

		h1 {
			text-shadow: rgba(255, 255, 255, 0.6) 0 1px 0, rgba(0, 0, 0, 0.2) 0 .15em .25em;
			font-size: 2.9em;
			font-weight: bold;
			margin-bottom: .7em;
			padding-top: 20px;
		}

		h2 {
			margin-bottom: 0;
		}

		p, ul {
			margin-bottom: 1em;
			line-height: 1.6em;
			font-size: 1.3em;
			color: #333;
			text-shadow: hsla(0, 0%, 100%, .7) 0 1px 0;
		}

		img {
			max-width: 300px;
			max-height: 300px;
		}

		.version {
			list-style: none
		}

		.date {
			font-size: 0.6em;
		}

	</style>
</head>
<body>
<h1>Cue Tracker</h1>
<?php if ($changes): ?>
	<p>There is a new version available. You are currently using version <strong><?= $version ?></strong>.</p>
	<p><a target="_blank" href="<?= $xml->revision[0]->link ?>">Click here</a> to download version
		<strong><?= $xml->revision[0]->version ?></strong>.</p>
	<hr/>
	<ul style="text-align:left;"><?= $changes ?></ul>
<?php else: ?>
	<p>You are using the most up to date version. There are no new updates.</p>
	<img src="assets/daftpunktocat-thomas.gif" width="300" height="300" alt=""/>
<?php endif; ?>
</body>
</html>
