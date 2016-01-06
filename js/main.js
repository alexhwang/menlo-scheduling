$(document).ready(function () {
    populate_doctors(); 
});

function populate_doctors() {
    /*
    Populate the "main page" (div #doctors) with links of doctors.
    */
    
    $("#doctors").html("");
    
    $.ajax({
        url: "php/find-doctors.php",
        success: function (data) {
            var doctor_seq = data.split(",");
            for (var i=0; i<doctor_seq.length-1; i++) {
                var doctor = doctor_seq[i];
                
                var htmltext = "<div class='doctor_div'>"
                + "<a class='doctor_link' href='javascript:toggle_doctor(&#34" + doctor + "&#34)'>" + doctor + "</a>"
                + "<span class='" + doctor + " hours_info'></span>"
                + "<span class='hidden day_data' id='" + doctor + "_data'></span>" 
                + "</div>";
                
                $("#doctors").append(htmltext);
                
            }
        }
    });
}

function toggle_doctor(doc) {
    /*
    Called when a main doctor link is clicked on; hides/unhides more specific information for each doctor, given a doctor 'doc'.
    */
    
    // console.log(doc);
    
    var selector = "#" + doc + "_data";
    var data_obj = $(selector);
    
    if (data_obj.hasClass("hidden")) {
        print_data(doc);
    }
    else {
        data_obj.html("");
    }
    data_obj.toggleClass("hidden");
}
    
    
function print_data(doctor) {
    /*
    Given a doctor, print their vacation days and flex days and the means to add/remove the days.
    */
    
    var url = "php/retrieve-data.php?doctor=" + doctor;
    var response = "";
    $.get(url, function(data) {
        var selector = "#" + doctor + "_data";
        var data_obj = $(selector);
        
        var dataseq = data.split("#");
       
        
        data_obj.html("Vacation Days: " + process_data(dataseq[0], doctor, "vday") + "<br>Flex Days: " + process_data(dataseq[1], doctor, "fday"));
        
        data_obj.append("<br><br>Date: <input type='text' id='datepicker' />" +
                        "<input type='text' id='hours' value='hours'/>" +
                        "<select id='daytype'><option value='vday'>Vacation Day</option><option value='fday'>Flex Day</option></select>" +
                        "<button onclick='add_data(&#34" + doctor + "&#34);'>Add Day</button>");
        
        $( "#datepicker" ).datepicker();
        
        $(".date_blob").hover(function () {
            var ele = $(this);
            ele.append("<a class='remove_link' onclick='javascript:remove_data(this);' href='#'><br>Remove Date</a>");
        }, function() {
            var ele = $(this);
            ele.find(".remove_link").remove();
        });
        
        
    });
    
}

function process_data(tuple_str, doctor, daytype) {
    /*
    Given a string of tuples separated by semicolons and a doctor, return the HTML (.dateblob) for each "dateblob".
    */
    
    var tuple_seq = tuple_str.split(";");
    var final_str = "";
    for (var i=0; i<tuple_seq.length; i++) {
        var current = tuple_seq[i];
        
        if (current != "") {
            var no_paren = current.slice(1,-1);
            var split_comma = no_paren.split(",");
            var date = split_comma[0];
            var hours = split_comma[1];

            final_str = final_str + "<span class='date_blob " + daytype + "' id='" + doctor + i + "'>" + date + "<br>" + "<i>" + hours + " hours</i>" + "</span>";
        }
        
        else {
            final_str = final_str;
        }
    }
    
    return final_str
}
    
function add_data(doctor) {
    /*
    Given a doctor, add data to their days then call print_data with that doctor.
    */
    
    var data = document.getElementById("datepicker").value; 
    var hours = document.getElementById("hours").value;
    
    var daytypeselect = document.getElementById("daytype");
    var daytype = daytypeselect.options[daytypeselect.selectedIndex].value;
    
    var url = "php/update.php?action=add&daytype=" + daytype + "&doctor=" + doctor + "&newdata=(" + data + "," + hours + ")";
    
    $.ajax({url: url,
           success: function () {
               print_data(doctor);
           }
    });
}
    
function remove_data(node) {
    /*
    Given a doctor, (and a certain dateblob), remove that data from the doctor's days then call print_data with that doctor.
    */
    
    daytype = node.parentNode.classList[1];
    doctor = node.parentNode.id.slice(0,-1);
    date = node.parentNode.childNodes[0].textContent
    hours = node.parentNode.childNodes[2].textContent.slice(0,-6);
    tuple = "(" + date + "," + hours + ")";
    
    
    var url = "php/update.php?action=remove&daytype=" + daytype + "&doctor=" + doctor + "&newdata=" + tuple;
    
    $.ajax({url: url,
           success: function () {
               print_data(doctor);
           }
    });
    
}