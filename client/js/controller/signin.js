//signin
document.getElementById('signin_button').onclick = function(e) {
    e.stopPropagation();

    var url = ws_base_url + 'signin';

    var params = {
        email: document.getElementById('signin_email').value,
        password: document.getElementById('signin_password').value
    };

    $.post(ws_base_url + "signin", params)
        .done(function(data) {
            if (data["access_token"]) {
                ACCESS_TOKEN = data["access_token"];
                var access_token_decoded = jwt_decode(ACCESS_TOKEN);

                $.ajaxSetup( {
                    crossDomain: true,
                    dataType: 'jsonp',
                    headers:
                    {
                        accept: '*',
                        authorization: 'Bearer ' + ACCESS_TOKEN
                    }
                });

                user_id = access_token_decoded["user_id"];
                user_email = access_token_decoded["email"];

                $('#navbar_user_link').text(user_email);
                $('#signin_container').hide();
                setDimensions();

                current_view = document.getElementById('home-container');
                viewInContainer(current_view);

                get_businesses();
            }
            else if (data["error"]) {
                if (data["error"] == 'unauthorized') {
                    $('#signin_error').text('The email and password you entered don\'t match.').show();
                    $('#signin_recover_password').show();
                } else {
                    $('#signin_error').text(data['error']).show();
                    $('#signin_recover_password').show();
                }
            } else
                $('#signin_error').text("Unknown error").show();
        })
        .fail(function() {
            $('#signin_error').text("Connection error").show();
        })
};

document.getElementById('signin_recover_password').onclick = function(e) {
    e.stopPropagation();

    var params = {
        email: document.getElementById('signin_email').value,
    };

    $.post(ws_base_url + 'recover_password', params)
        .done(function(data) {
            if (data['error']) {
                    $('#signin_error').text(data['error']).show();
            } else {
                $('#signin_recover_password').text('Password sent');
            }
        })
        .fail(function() {
            $('#signin_error').text("Connection error").show();
        })
};
