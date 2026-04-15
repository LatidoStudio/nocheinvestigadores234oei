/*pwabuilder-sw.js*/
/*var sPWAss="[PWA Builder] ";*/
var CACHE = 'pwabuilder-offline';

/*var sPWAss="[PWA Builder] ";*/
try {
	/*self.addEventListener('install', function(event) {*/
	self.addEventListener('install', event => {
		var indexPage = new Request('/');
		event.waitUntil(
			fetch(indexPage).then(function(response) {
				return caches.open(CACHE).then(function(cache) {
					/*console.log(sPWAss + 'Cached index page during Install'+ response.url);*/
					return cache.put(indexPage, response);
				});
			}
		));
	}, {passive: true});
}catch(err) {
	/*console.log(err)*/
}

/* fetch */
try {
	/*self.addEventListener('fetch', function(event) {*/
	self.addEventListener('fetch', event => {
		var req = event.request.clone();
		if (req.clone().method == "GET") {
			var updateCache = function(request){
				return caches.open(CACHE).then(function (cache) {
					return fetch(request).then(function (response) {
						/*console.log(sPWAss + 'add page to offline'+response.url)*/
						return cache.put(request, response);
					});
				});
			};
			event.waitUntil(updateCache(event.request));

			event.respondWith(
				fetch(event.request).catch(function(error) {
					/*console.log( sPWAss + 'Network request Failed. Serving content from cache: ' + error );*/

					return caches.open(CACHE).then(function (cache) {
						return cache.match(event.request).then(function (matching) {
							var report	= !matching || matching.status == 404?Promise.reject('no-match'): matching;
							return report
						});
					});
				})
			);
	
		}
	}, {passive: true});
}catch(err) {
	/*console.log(err)*/
}

/*This is a event that can be fired from your page to tell the SW to update the offline page*/
try {
	/*self.addEventListener('refreshOffline', function(response) {*/
	self.addEventListener('refreshOffline', event => {
		return caches.open(CACHE).then(function(cache) {
			/*console.log(sPWAss + 'Offline page updated from refreshOffline event: '+ response.url);*/
			return cache.put(offlinePage, response);
		});
	});
}catch(err) {
	/*console.log(err)*/
}

// Sends a message to the clients.
function refresh(response) {
  return self.clients.matchAll().then(function (clients) {
    clients.forEach(function (client) {
      // Encode which resource has been updated. By including the
      // [ETag](https://en.wikipedia.org/wiki/HTTP_ETag) the client can
      // check if the content has changed.
      var message = {
        type: 'refresh',
        url: response.url,
        // Notice not all servers return the ETag header. If this is not
        // provided you should use other cache headers or rely on your own
        // means to check if the content has changed.
        eTag: response.headers.get('ETag')
      };
      // Tell the client about the update.
      client.postMessage(JSON.stringify(message));
    });
  });
}