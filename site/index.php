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
	include_once('application/core/migration.strife');
	include_once('application/helpers/auth.helper');

	/*routing*/
	$route_request = App::getRequest();
	$route_floor = count($route_request);
	session_start();
	ob_start();
	
	//clear cache
	if(isset($_GET["flush"]) && $_GET["flush"] && extension_loaded('apc')) apc_clear_cache();

	//dev build
	if($route_floor >= 2 && $route_request[$route_floor-1] == "build" && $route_request[$route_floor-2] == "dev") {
		array_pop($route_request);
		array_pop($route_request);
		$route_floor-=2;
		Migration::build();	
	}

	//dev re-build
	if($route_floor >= 2 && $route_request[$route_floor-1] == "rebuild" && $route_request[$route_floor-2] == "dev" && Auth::isAuthed()) {
		array_pop($route_request);
		array_pop($route_request);
		$route_floor-=2;
		Migration::rebuild();
	}

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
		App::not_found_404();
	}