<?php
	/*
	  __,               
	 (    _/_    o  /)  
	  `.  /  _  ,  // _ 
	(___)(__/ (_(_//_(/_
	             /)     
	            (/      
	*/

	include('application/core/core.strife');
	//include('application/core/connect.strife');
	include('application/models/main.model');

	$app = new Main_Model();
	/*routing*/
	$route_request = $app->getRequest();
	$route_floor = count($route_request);
	if(method_exists($app,'init')) $app->init();

	//dev build
	if($route_floor >= 2 && $route_request[$route_floor-1] == "build" && $route_request[$route_floor-2] == "dev") {
		//init
		include_once('application/models/user.model');
		$user = new User();
		$user->init();
		
		array_pop($route_request);
		array_pop($route_request);
	}

	//clear cache
	if(isset($_GET["flush"]) && $_GET["flush"] && extension_loaded('apc')) apc_clear_cache();






	
	//1st routing floor handling
	if($route_floor < 2){
		include('routes/first.request');
	/*
	//2nd routing floor handling
	} else if ($route_floor == 2) {
		if($route_request[0] == "api") {
			include('routes/api.request');
		} else {
			include('routes/second.request');
		}
	*/
	} else {
		$app->not_found_404();
	}