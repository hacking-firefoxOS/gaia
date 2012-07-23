var Instant = function (h, m) {
	if(arguments.length == 1 && typeof h == 'string') {
		var time = JSON.parse(h);
		this.hour = time.hour;
		this.minute = time.minute;
	}
	else {
		this.hour = h;
		this.minute = m;
	}	
};

Instant.prototype.isBefore = function(instant) {
	console.log(JSON.stringify(instant) + " " + JSON.stringify(this));
	return this.hour < instant.hour || this.minute < instant.minute;
};

Instant.prototype.isAfter = function(instant) {
	console.log(JSON.stringify(instant) + " " + JSON.stringify(this));
	return this.hour > instant.hour || this.minute > instant.minute;
};


var Settings = {
	
	db: window.localStorage,
	
	
	init: function se_init() {
		'use strict';
		
		/*var from = {
			hour: 19,
			minute: 0
		};
		
		var to = {
			hour: 23,
			minute: 0
		};
		
		Settings.db.setItem('from', JSON.stringify(from));
		Settings.db.setItem('to', JSON.stringify(to));
		
		var f = JSON.parse(Settings.db.getItem('from'));
		
		console.log('f is: ' + f.hour + ' ' + f.minute);*/ 
	},
	
	click: function se_click() {
		var fromVals = document.getElementById('go-away-from').value.split(':');
		var toVals = document.getElementById('go-away-to').value.split(':');
		
		// save the values in the db
		var jsFrom = {
			hour: fromVals[0],
			minute: fromVals[1]
		};
		var jsTo = {
			hour: toVals[0],
			minute: toVals[1]
		};
		Settings.db.setItem('from', JSON.stringify(jsFrom));
		Settings.db.setItem('to', JSON.stringify(jsTo));	
		
		console.log("Saved from: " + fromVals + " and to: " + toVals);	
		alert("Go away from " + fromVals[0] + ":" + fromVals[1] + " to " + toVals[0] + ":" + toVals[1]);
	},
	
	from: function se_from() {
		return new Instant(Settings.db.getItem('from'));
	},
	
	to: function se_to() {
		return new Instant(Settings.db.getItem('to'));
	},
	
	settings: function se_settings() {
		return  {
			from: Settings.from(),
			to: Settings.to()
		};		
	}
};

Settings.init();
console.log('Settings initialized');
