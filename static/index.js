document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('user'))
        document.querySelector('#new-user').innerHTML = 
            "<h4>Welcome " + localStorage.getItem('user') + "</h4>"

    document.querySelector('#new-user').onsubmit = () => {
        var username = document.querySelector('#username').value;
        localStorage.setItem('user', username)
    }
})
