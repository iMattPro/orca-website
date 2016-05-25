<?php
/**
 * Post Web Hook
 *
 * Purge the myCloud Cache after Beanstalk deployments
 *
 * (c) 2016 Matt Friedman
 */

// Get the web hook data from Beanstalk
$hook = file_get_contents('php://input');
$hook = json_decode($hook, true);

// Proceed if hook data is from Beanstalk
if (isset($hook['source']) && $hook['source'] == 'beanstalkapp') {
	require __DIR__ . '/../mycloud/vendor/autoload.php';
	$cache = new \MyCloud\Model\Cache();
	$cache->purge();
	exit;
}

// Send a 500 server error if we get here.
// This will tell Beanstalk the deployment failed.
header("HTTP/1.1 500 Internal Server Error");
exit('Internal Server Error');
