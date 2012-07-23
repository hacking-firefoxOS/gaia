



	var O2FriendService = (function() {

		var CACHE_TIMEOUT = 0;//7900000000; //3 months in milliseconds
		var salt = 'Xbc1ldh02H';
		var phoneNumberHashCache;

		var init = function() {
			phoneNumberHashCache = getStoredKeyValue('o2numbers', CACHE_TIMEOUT) || {};
		};


		var clearCache = function() {
			phoneNumberHashCache = {};
		};

		var parseResponse = function(data) {
			console.log(data);
			var index = data.query.results.result.id;
			var status = data.query.results.result.status;
			// var hash = data.query/results.result.hash;   -- need hash for implementing caching

			if (status === '200') {
				addO2Indicator(index);
				//phoneNumberHashCache[hash] = true; - enable when we get the hash passed through
			}
		};

		var addO2Indicator = function(index) {
			console.log('apply o2 indicator to: ' +  index);
			$('#groups-list li[id=' + index + '] figure').append('<div style="background-color:white;padding:0.1em;position:absolute;top:0;right:0"><img style="height:0.8em;" src="images/o2logo.png"></div>');
		};

		var checkIfWithO2 = function (index, phoneNumber, isLastContact, withO2, notWithO2 ) {

			// go off to O2 friends end-point and see what it says about the number - success response means with O2
			var formattedPhoneNumber = formatPhoneNumber(phoneNumber);
			var hash = getSHA256(formattedPhoneNumber, salt);
			var selfIsLastContact = isLastContact;

			if (phoneNumberHashCache[hash] === undefined) {

			var head= document.getElementsByTagName('head')[0];
 		    var script= document.createElement('script');
 		   script.type= 'text/javascript';
 			   script.src= "http://query.yahooapis.com/v1/public/yql?q=use%20%22store%3A%2F%2FUngyfD7sKSBzwBeKdvkmV2%22%20as%20O2Friends%3B%20select%20*%20FROM%20O2Friends%20WHERE%20hash%3D'"+hash+"'%20AND%20id%20%3D%20'"+ index + "'&format=json&callback=O2FriendService.parseResponse";

			    head.appendChild(script);

			} else {
				if (phoneNumberHashCache[hash] === true) {
					console.log('found o2 number [by cache]: ' + formattedPhoneNumber);
					addO2Indicator(index);
				} else {
					console.log('not an o2 number [by cache]: ' + formattedPhoneNumber);
				}
			}
		};

		var getSHA256 = function(phoneNumber, salt) {
			SHA256_init();
			SHA256_write(phoneNumber + salt);
			digest = SHA256_finalize();  
			return array_to_hex_string(digest);
		};

		var formatPhoneNumber = function(phoneNumber) {
			phoneNumber = phoneNumber.replace(/ /g,'');
			phoneNumber = phoneNumber.replace(/()/g,'');

			if (phoneNumber.substring(0, 3) === '447') {
				return '0' + phoneNumber.substring(2);
			}

			if (phoneNumber.substring(0, 4) === '+447') {
				return '0' + phoneNumber.substring(3);
			}

			if (phoneNumber.substring(0, 5) === '00447') {
				return '0' + phoneNumber.substring(4);
			}

			return phoneNumber;
		};


		var getStoredKeyValue = function(key, timeout) {

			var keyValueJSON = window.localStorage.getItem(key);

			var keyValueStored;
			if (keyValueJSON) {
				keyValueStored = JSON.parse(keyValueJSON);
			}

			if (keyValueStored) {
				var cacheTimeLeftMs = timeout - (new Date().getTime() - keyValueStored.timestamp);
				console.log('[' + key + '] cache time left (ms): ' + cacheTimeLeftMs);
				if (cacheTimeLeftMs > 0) { 
					console.log('retrieving a cached version of [' + key + ']');
					return keyValueStored.key;
				}
			}

			console.log('cache expired or no stored [' + key + ']');

			return null;
		};

		var storeKeyValue = function(key, value) {
			var keyValueToStore = {"timestamp" : new Date().getTime(), key : value};
			window.localStorage.setItem(key, JSON.stringify(keyValueToStore));
		};

		init();

		return {
			checkIfWithO2 : checkIfWithO2,
			clearCache : clearCache,
			parseResponse : parseResponse
		};
	}());