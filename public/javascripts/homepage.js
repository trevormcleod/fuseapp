$(function () {

	var check = true;
	$('#submit').click(function () {

		var title = document.title;
		var URL = $('#URL').val();

		$.get('/getResource', {"title": title, "URL": URL}, function(data) {
			// Handle wrong content type error.
			if(data.error == 'Wrong Content Type') {
				var alert = $('<div>').attr('class', 'alert fade in');
				var close = $('<button>').attr({
					type: 'button',
					class: 'close',
					'data-dismiss': 'alert'
				}).html('×');
				var message = $('<strong>').html('Sorry, the content type was '+data.type+'. Please try a URL that requests HTML.');
				var errorMessage = alert.append(close).append(message);
				$('#responseArea').append(errorMessage);
				return;
			}
			// Handle all other errors.
			if(data.error != null && data.error != 'Wrong Content Type') {
				var alert = $('<div>').attr('class', 'alert fade in');
				var close = $('<button>').attr({
					type: 'button',
					class: 'close',
					'data-dismiss': 'alert'
				}).html('×');
				var message = $('<strong>').html('This error happened --> '+data.error+' --> Please try again (Hint: all URLs must start with http://)');
				var errorMessage = alert.append(close).append(message);
				$('#responseArea').append(errorMessage);
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
				$('#responseArea').append(button);
				console.log(check);
				check = false;
				console.log(check);
				}
				// Successful response content.
				console.log(data);
				var linkArray = data.linkArray;
				var description = $('<p>').html('Description: '+data.desc);
				var title = $('<p>').html('Title: '+data.title);
				$('#responseArea').append(description);
				$('#responseArea').append(title);
				linkArray.forEach(function(item, index) {
					var anchor = $('<a>').attr('href', item).html(item);
	                var listItem = $('<li>').append(anchor);
	                $('#responseArea').append(listItem);
				});
				return;
			}
		});
	});
});