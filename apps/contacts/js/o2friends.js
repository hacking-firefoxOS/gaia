
		function parseResponse(data) {
			console.log(data);
			var index = data.query.results.result.id;
			var status = data.query.results.result.status;

			if (status === '200') {
				$('#groups-list li[id=' + index + '] figure').append('<img style="width:25px;height:25px;position:absolute;top:0px;left:-25px" src="images/o2logo.png">');
			}
		}


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

		var checkIfWithO2 = function (index, phoneNumber, isLastContact, withO2, notWithO2 ) {

			// go off to O2 friends end-point and see what it says about the number - success response means with O2
			var formattedPhoneNumber = formatPhoneNumber(phoneNumber);
			var hash = getSHA256(formattedPhoneNumber, salt);
			var selfIsLastContact = isLastContact;

			if (phoneNumberHashCache[hash] === undefined) {

			var head= document.getElementsByTagName('head')[0];
 		    var script= document.createElement('script');
 		   script.type= 'text/javascript';
    script.src= "http://query.yahooapis.com/v1/public/yql?q=use%20%22store%3A%2F%2FUngyfD7sKSBzwBeKdvkmV2%22%20as%20O2Friends%3B%20select%20*%20FROM%20O2Friends%20WHERE%20hash%3D'"+hash+"'%20AND%20id%20%3D%20'"+ index + "'&format=json&callback=parseResponse";

    head.appendChild(script);



/*
		if (formattedPhoneNumber === '07764359823' || formattedPhoneNumber === '07714231527') {
			phoneNumberHashCache[hash] = true;
			storeKeyValue('o2numbers', phoneNumberHashCache);
			withO2(index, phoneNumber, selfIsLastContact);
		} else {
			phoneNumberHashCache[hash] = false;
			storeKeyValue('o2numbers', phoneNumberHashCache);			
		}

			var xhr = new XMLHttpRequest({mozSystem: true});
    		xhr.addEventListener('load', function(e) {
    			console.log('load');
    			console.log(e.target.status);
    		});
    		xhr.addEventListener('error', function(e) {
    			console.log('error');
    		});
    		xhr.open('GET','http://friends.o2labs.co.uk/check/' + hash, true);
    		xhr.send();



				$.get('http://friends.o2labs.co.uk/check/' + hash, function(){
					phoneNumberHashCache[hash] = true;
					storeKeyValue('o2numbers', phoneNumberHashCache);
					withO2(index, phoneNumber, selfIsLastContact);
				}).error(function(error) {
					if (error.status > 0) {
						console.log('not an o2 number: [' + error.status + '] : ' + formattedPhoneNumber);
						phoneNumberHashCache[hash] = false; 
						storeKeyValue('o2numbers', phoneNumberHashCache);
					} else {
						console.log('network error checking o2 number: [' + error.status + '] : ' + formattedPhoneNumber);
					}

					if (notWithO2) {
						notWithO2(index, phoneNumber, selfIsLastContact);
					}
				});

*/

			} else {
				if (phoneNumberHashCache[hash] === true) {
					console.log('found o2 number [by cache]: ' + formattedPhoneNumber);
					withO2(index, phoneNumber, selfIsLastContact);
				} else {
					console.log('not an o2 number [by cache]: ' + formattedPhoneNumber);
					notWithO2(index, phoneNumber, selfIsLastContact);
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
			clearCache : clearCache
		};
	}());