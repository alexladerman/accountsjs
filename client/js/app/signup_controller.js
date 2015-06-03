//signin
var ws_base_url = 'http://localhost:1337/'; //url of node.js web server, relative to user browser

document.getElementById('signup_button').onclick = function(e) {
    e.stopPropagation();

    var params = {
        email: document.getElementById('signup_email').value,
        password: document.getElementById('signup_password').value
    };

    $.post(ws_base_url + "signup", params)
        .done(function(data) {

            if (data["error"]) {
                if (data["error"].errno == 1062)
                    $('#signup_error').text("Error: The user already exists").show();
                else
                    $('#signup_error').text("Database error: " + data["error"].code).show();
            } else {
                $('#signup_form').hide();
                $('#signup_success').show();
            }
        })
        .fail(function() {
            $('#signup_error').text("Connection error").show();
        })
};