'use strict';

var Settings = {
	var db = window.localStorage;
	
		
	var from = {
		hour: 1,
		minute: 2
	};
	
	db.setItem('from', JSON.stringify(from));

	var f = JSON.parse(db.getIntem('from'));
	
	console.log('f is' + f);
	
};