document.addEventListener('DOMContentLoaded', () => {

    // Hide elements if the user is not logged in
    document.querySelector("#channels").style.visibility = "hidden";
    document.querySelector("#createchannel").style.visibility = "hidden";
    document.querySelector('#channelname').style.visibility = "hidden";
    if (localStorage.getItem('user')) {
        document.querySelector('#new-user').innerHTML = 
            "<h4>Welcome " + localStorage.getItem('user') + "</h4>"
        document.querySelector("#channels").style.visibility = "visible";
        document.querySelector("#createchannel").style.visibility = "visible";
        document.querySelector('#channelname').style.visibility = "visible";
    }

    // By default, create channel button is disabled
    document.querySelector('#createchannel').disabled = true;

    document.querySelector('#new-user').onsubmit = () => {
        var username = document.querySelector('#username').value;
        localStorage.setItem('user', username);
    };

    // Enbable button only if there is text in the input field
    document.querySelector('#channelname').onkeyup = () => {
        if (document.querySelector('#channelname').value.length > 0)
            document.querySelector('#createchannel').disabled = false;
        else
            document.querySelector('#createchannel').disabled = true;
    };

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', () => {
        document.querySelector('#createchannel').onclick = () => {
            const channel = document.querySelector('#channelname').value;
            socket.emit('create channel', {'channel': channel});
            
            document.querySelector('#channelname').value = '';
            // Prevent form submitting  
            return false;
        };
    });

    socket.on('channels changed', channel => {
        var li = document.createElement('li');
        var link = "/channel/" + channel;
        li.innerHTML = '<a href="' + link + '">' + channel  + '</a>';
        document.querySelector('#channels').append(li);
    });

});
