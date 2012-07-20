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
	return this.hour < instant.hour || this.minute < instant.minute;
};

Instant.prototype.isAfter = function(instant) {
	return this.hour > instant.hour || this.minute > instant.minute;
};


var Settings = {
	
	db: window.localStorage,
	
	
	init: function se_init() {
		'use strict';
		
		var from = {
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
		
		console.log('f is: ' + f.hour + ' ' + f.minute);
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
