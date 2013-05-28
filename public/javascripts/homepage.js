$(function () {

	var check = true;
	var count = 0;

	// Function used to draw error messages to DOM.
	function drawAnError(text) {
		var alert = $('<div>').attr('class', 'alert fade in');
		var close = $('<button>').attr({
			type: 'button',
			class: 'close',
			'data-dismiss': 'alert'
		}).html('×');
		var message = $('<strong>').html(text);
		var errorMessage = alert.append(close).append(message);
		$('#responseArea').append(errorMessage);
	}

	// Function used to draw a link or message about a link to DOM.
	function drawToList(obj) {
		var listItem = $('<li>').append(obj);
		$('#responseArea').append(listItem);
	}

	// Communication with Node.js server starts here
	$('#submit').click(function () {
		var title = document.title;
		var URL = $('#URL').val();
		$.get('/getResource', {"title": title, "URL": URL}, function(data) {
			// Handle wrong content type error.
			if(data.error == 'Wrong Content Type') {
				drawAnError('Sorry, the content type was '+data.type+'. Please try a URL that requests HTML.');
				return;
			}
			// Handle all other errors.
			if(data.error != null && data.error != 'Wrong Content Type') {
				drawAnError('This error happened --> '+data.error+' --> Please try again (Hint: all URLs must start with http://)');
				return;
			}
			// Handle successful request with response links and description.
			else {
				// Add 'Clear' button for user's convenience.
				if(check) {
					var button = $('<a>').attr({
						class: 'btn',
						id: 'clearButtonSpacing',
						href: '/'
					});
					button.html('Clear')
					$('#clearButton').append(button);
					check = false;
				}
				// Successful response content.
				var linkArray = data.linkArray;
				console.log(data);
				var description = $('<p>').html('Description: '+data.desc);
				var title = $('<p>').html('Title: '+data.title);
				$('#responseArea').append(title);
				$('#responseArea').append(description);
				linkArray.forEach(function(item, index) {
					
					if(item == null || item == '') {
						count = count + 1;
					}
					else {
						if(item[0] == '/') {
							console.log('its a /');
							var anchor = $('<a>').attr('href', URL+item).html(URL+item);
							drawToList(anchor);
							return;
						}
						if(item[0] == '?') {
							var anchor = $('<a>').attr('href', URL+'/'+item).html(URL+item);
							drawToList(anchor);
							return;
						}

						// NEED TO HANDLE INCOMPLETE hrefs FROM RESPONSE OBJECT
						// COULD DO THIS WITH MORE LOGIC HERE OR USING A REGULAR EXPESION ON SERVER
						
						else {
							var anchor = $('<a>').attr('href', item).html(item);
	                		drawToList(anchor);
	                		return;
						}
					}
				});
				var note = $('<p>').html('Note: There were '+count+' invalid link tags with href values of either "null" or "".')
				$('#responseArea').prepend(note);
				return;
			}
		});
	});
});