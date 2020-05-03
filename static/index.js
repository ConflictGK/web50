document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('user'))
        document.querySelector('#new-user').innerHTML = 
            "<h4>Welcome " + localStorage.getItem('user') + "</h4>"

    // By default, create channel button is disabled
    document.querySelector('#createchannel').disabled = true;

    document.querySelector('#new-user').onsubmit = () => {
        var username = document.querySelector('#username').value;
        localStorage.setItem('user', username)
    };

    // Enbable button only if there is text in the input field
    document.querySelector('#channelname').onkeyup = () => {
        if (document.querySelector('#channelname').value.length > 0)
            document.querySelector('#createchannel').disabled = false;
        else
            document.querySelector('#createchannel').disabled = true;
    };

    document.querySelector('#new-channel').onsubmit = () => {
        const li = document.createElement('li');
        li.innerHTML = document.querySelector('#channelname').value;

        document.querySelector('#channels').append(li);

        document.querySelector('#channelname').value = '';
        document.querySelector('#createchannel').disabled = true;

        // Stop form from submitting
        return false;
    };
})
