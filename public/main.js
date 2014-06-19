var myRootRef = new Firebase('https://fresk.firebaseio.com/');

var messages = myRootRef.child("messages");


messages.on('value', function(snapshot) {
    $('.message-list').empty();
    _.each( snapshot.val(), function(msg) {
        var line = $('<div class="messages">'+msg.text+'</div>');
        $('.message-list').append(line);
    });
});


$("button").on('click', function(){


    messages.push({user_id: 'thomas', text: $("input").val() });
    $("input").val("")


})
