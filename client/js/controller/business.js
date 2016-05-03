function get_businesses(callback) {
    $.getJSON(ws_base_url + "business", function(data) {
        replace_business_dropdown(data);
        if (!selected_business_id && data.length > 0) { //init
            selected_business_id =  data[0]['id'];
            selected_business_name = data[0]['name'];
            select_business(null);
        }
    });
}

//renders table from JSON array
function replace_business_dropdown(data) {

    var dropdown = document.getElementById('business_dropdown');

    while (dropdown.hasChildNodes()) {
        dropdown.removeChild(dropdown.lastChild);
    }

    if (data.length == 0) {
      viewInContainer(document.getElementById('businesses-container'));
    } else {
        for (i in data) {
            var rowdata = data[i];
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.setAttribute('href', '#');
            a.setAttribute('business_id', rowdata['id']);
            a.setAttribute('business_name', rowdata['name']);
            var text = document.createTextNode(rowdata['name']);
            a.appendChild(text);
            a.onclick = select_business;
            li.appendChild(a);
            dropdown.appendChild(li);
        }
        var li = document.createElement('li');
        li.className = 'divider';
        dropdown.appendChild(li);

        var li = document.createElement('li');
        var a = document.createElement('a');
        a.setAttribute('href', '#');
        a.onclick = function(e) {
            e.stopPropagation();
            viewInContainer(document.getElementById('businesses-container'));
        };
        var text = document.createTextNode('Add business');
        a.appendChild(text);
        li.appendChild(a);
        dropdown.appendChild(li);
    }
}

function select_business(e) {
    if (e) {
        selected_business_id = parseInt(this.attributes.business_id.value);
        selected_business_name = this.attributes.business_name.value;
    }
    var t = document.getElementById('selected_business');
    while (t.hasChildNodes()) {
        t.removeChild(t.lastChild);
    }
    t.appendChild(document.createTextNode(selected_business_name));
    var span = document.createElement('span');
    span.className = 'caret';
    t.appendChild(span);
    $('#selected_business_dropdown').show();
    $('#navbar_links').show();
    $('#button_bar').show();
}

//inserts new business
// document.getElementById('new_business_form').validator();
document.getElementById('save_new_business_btn').onclick = function(e) {
    var url = ws_base_url + 'business';

    var params = { action: "new" };
    $.extend(params, $('#new_business_form').serializeJSON());

    console.log(params);
    console.log(url);
    $.getJSON(url, params, function(data) {
        get_businesses();
        viewInContainer(view_stack.pop);
    });
};
