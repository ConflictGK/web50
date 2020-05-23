document.addEventListener('DOMContentLoaded', () => {

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', () => {
        document.querySelector('#new-message-button').onclick = () => {
            const message = document.querySelector('#message').value;
            const channel = document.querySelector('#channel').innerHTML;
            const user = localStorage.getItem('user');
            const timestamp = Date.now();
            socket.emit('new message', 
            {
                'channel': channel,
                'message': message,
                'user': user,
                'timestamp': timestamp
            });
            document.querySelector('#message').value = '';
            return false;
        };
    });

    socket.on('new message sent', message_info => {
        var li = document.createElement('li');
        li.innerHTML = message_info['message'] + " (Sent by: " + message_info["user"] + " @ " + new Date(message_info['timestamp']) +")";
        if (message_info['user'] == localStorage.getItem('user')) {
            li.appendChild(createDeleteButton(message_info['message']));
        }
        document.querySelector("#messages").append(li);
        return false;
    });

    var createDeleteButton = function(message) {
        var deleteButton = document.createElement('button');
        deleteButton.innerHTML = "Delete";
        deleteButton.onclick = () => {
            socket.emit('delete message', {'message': message})
        };
        return deleteButton;
    }

    socket.on('message deleted', messages => {
        document.querySelector('#messages').innerHTML = '';
        messages.forEach(m => {
            var li = document.createElement('li');
            li.innerHTML = m[0] + " (Sent by: " + m[1] + " @ " + new Date(m[2]) +")";
            if (m[1] == localStorage.getItem('user')) {
                li.appendChild(createDeleteButton(m[0]));
            }
            document.querySelector("#messages").append(li);
        });
        return false;
    })
});