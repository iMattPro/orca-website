<?php
/*
 * CUE TRACKER VERSION CHECK
 * Version 4
 *
 * Written by Matt Friedman
 * 11/16/11 5:02 PM
 */

// First lets set up for magic quotes issues
if (get_magic_quotes_gpc()) {
	foreach($_GET as $key => $value) {
		$_GET[$key] = stripslashes($value);
	}
}

// Get user's version from the URL query
$user_version = !empty($_GET['version']) ? htmlentities($_GET['version'], ENT_QUOTES) : false;

// Kill script if page is loaded with no query
if (!$user_version) die ('An error occurred.');

// Set up pre-existing conditions
$update = false;
$change_log = '';

// Read ct_change_log.xml into an array
$XmlToArray = XmlToArray('ct_change_log.xml');

// Get current version
$current_version = $XmlToArray['revision'][0]['version'][0];

// Get current version URL
$current_version_url = $XmlToArray['revision'][0]['link'][0];

// Get current version Date
$current_version_date = $XmlToArray['revision'][0]['date'][0];

// Test if update is needed, generate change log
if ( version_compare( $user_version, $current_version, '<' ) ) {
	$update = true;

	foreach($XmlToArray['revision'] as $rev) {
		if (version_compare($rev['version'][0], $user_version, '<=')) continue;
		$change_log .= build_list_items(@$rev['log'][0]['new']);
		$change_log .= build_list_items(@$rev['log'][0]['change']);
		$change_log .= build_list_items(@$rev['log'][0]['fix']);
	}
}


// http://www.devx.com/webdev/Article/43074/1954
function XmlToArray($xml_file) {
	$object = new SimpleXmlIterator($xml_file, null, true);
	return ObjectToArray($object);
}

function ObjectToArray($object) {
	$xml_array = array();
	for( $object->rewind(); $object->valid(); $object->next() ) {
		if(!array_key_exists($object->key(), $xml_array)){
			$xml_array[$object->key()] = array();
		}
		if($object->hasChildren()){
			$xml_array[$object->key()][] = ObjectToArray(
				$object->current());
		} else {
			$xml_array[$object->key()][] = strval($object->current());
		}
	}
	return $xml_array;
}

function build_list_items($input = array()) {
	$result = '';
	if (isset($input)) {
		foreach($input as $value) {
			$result .= '<li>' . htmlentities($value, ENT_QUOTES, 'UTF-8') . '</li>';
		}
	}
	return $result;
}

?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Cue Tracker Version Check</title>
<link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Droid+Sans:regular,bold" />
<style>

html {
	font:62.5%/1 "Droid Sans", "Lucida Sans Unicode", "Lucida Grande", Verdana, Arial, Helvetica, sans-serif;
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

a { color: #4e72be;
	font-weight: bold;
	text-decoration: none;
}
a:hover { opacity: 0.6; }
a:active {
	position: relative;
	top: 1px;
	opacity: 0.3;
/*	outline: none;*/
}

h1 {
	text-shadow: rgba(255,255,255,0.6) 0 1px 0, rgba(0,0,0,0.2) 0 .15em .25em;
	font-size: 2.9em;
	font-weight: bold;
	margin-bottom: .7em;
	padding-top: 20px;
}

p, ul {
	margin-bottom: 1em;
	line-height: 1.6em;
	font-size: 1.3em;
	color: #333;
	text-shadow: hsla(0,0%,100%,.7) 0 1px 0;
}

</style>
</head>
<body>
	<h1>Cue Tracker</h1>
	<?php if ($update): ?>
	<p>There is a new version available. You are currently using version <strong><?=$user_version;?></strong>.</p>
	<p><a href="<?=$current_version_url;?>">Click here</a> to download version <strong><?=$current_version;?></strong>.</p>
	<hr />
	<p>What's new as of <?=$current_version_date;?>:</p>
	<ul style="text-align:left;"><?=$change_log;?></ul>
	<?php else: ?>
	<p>You are using the most up to date version. There are no new updates.</p>
	<img src="assets/daftpunktocat-thomas.gif" width="300" height="300" alt="" />
	<?php endif; ?>
</body>
</html>
