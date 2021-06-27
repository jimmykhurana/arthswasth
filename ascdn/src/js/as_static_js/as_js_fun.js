function gb_notify(y) {
  // Get the snackbar DIV
  var x = document.getElementById("snackbar");
  var msg = y;
  // Add the "show" class to DIV
  x.className = "show";
  //Add HTML
  x.innerHTML = msg;
  // After 3 seconds, remove the show class from DIV
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 3000);
  //Hide Loder
  $("#process_screen").hide();
}
function onlyAlphabets(e, t) {
  try {
    if (window.event) {
      var charCode = window.event.keyCode;
    } else if (e) {
      var charCode = e.which;
    } else {
      return true;
    }
    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123))
      return true;
    else return false;
  } catch (err) {
    alert(err.Description);
  }
}
function onlyNumeric(e, t) {
  try {
    if (window.event) {
      var charCode = window.event.keyCode;
    } else if (e) {
      var charCode = e.which;
    } else {
      return true;
    }
    if (charCode > 47 && charCode < 58) return true;
    else return false;
  } catch (err) {
    alert(err.Description);
  }
}
function charcount() {
  var customer_msg = $("#as_contact_msg").val();
  count = customer_msg.length;
  document.getElementById("as_contact_msg_count").innerHTML = count;
}
$(document).ready(function (e) {
  $("#as_contact_form").on("submit", function (e) {
    $("#process_screen").show();
    e.preventDefault();
    var first_name = $("#as_contact_fn").val();
    var last_name = $("#as_contact_ln").val();
    var contact_email = $("#as_contact_em").val();
    var contact_number = $("#as_contact_mn").val();
    var customer_msg = $("#as_contact_msg").val();
    var channel = $("#as_channel").html();

    var form_data = {
      first_name: first_name,
      last_name: last_name,
      contact_email: contact_email,
      contact_number: contact_number,
      customer_msg: customer_msg,
      channel: channel,
    };

    var aplha_check = /^[a-zA-Z]+$/;
    var num_check = /^[0-9]{10}$/;
    var email_check =
      /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (
      first_name.length < 3 ||
      last_name.length < 3 ||
      !aplha_check.test(first_name) ||
      !aplha_check.test(last_name) ||
      first_name.length > 50 ||
      last_name.length > 50
    ) {
      $("#as_contact_fn").focus();
      return gb_notify("Enter Your Full Name. Max 50 letters");
    } else {
      if (!email_check.test(contact_email)) {
        $("#as_contact_em").focus();
        return gb_notify("Enter Valid Email Address");
      } else {
        if (!num_check.test(contact_number)) {
          $("#as_contact_mn").focus();
          return gb_notify("Enter 10 Digit Mobile Number without any prefix");
        } else {
          if (customer_msg.length < 1 || customer_msg.length > 3000) {
            $("#as_contact_msg").focus();
            return gb_notify("Your Message please. Max 3000 letters");
          } else {
            $.ajax({
              url: "/as_worker/contact_email_worker.php",
              data: form_data,
              timeout: 3000, //3000ms//3s
              dataType: "json",
              type: "POST",
              success: function (data) {
                if (data.status == "error") {
                  return gb_notify(data.msg);
                } else {
                  if (data.status == "success") {
                    $("#as_contact_form_inpt").find("input:text").val("");
                    $("#as_contact_msg").val("");
                    $("#as_contact_msg_count").html("0");
                    return gb_notify(data.msg);
                  }
                }
              },
              error: function (jqXhr, textStatus, errorMessage) {
                return gb_notify(
                  "Connectivity Issue. Please try after sometime"
                );
              },
            });
          }
        }
      }
    }
  });
});
$(document).ready(function (e) {
  $("#as_subscribe_form").on("submit", function (e) {
    $("#process_screen").show();
    e.preventDefault();
    var contact_email = $("#as_subscribe_em").val();
    var channel = $("#as_channel_subscribe").html();

    var form_data = {
      contact_email: contact_email,
      channel: channel,
    };

    var email_check =
      /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (!email_check.test(contact_email) && contact_email.length > 225) {
      $("#as_subscribe_em").focus();
      return gb_notify("Enter Valid Email Address");
    } else {
      $.ajax({
        url: "/as_worker/subscribe_email_worker.php",
        data: form_data,
        timeout: 3000, //3000ms//3s
        dataType: "json",
        type: "POST",
        success: function (data) {
          if (data.status == "error") {
            return gb_notify(data.msg);
          } else {
            if (data.status == "success") {
              $("#as_subscribe_form").find("input:text").val("");
              return gb_notify(data.msg);
            }
          }
        },
        error: function (jqXhr, textStatus, errorMessage) {
          return gb_notify("Connectivity Issue. Please try after sometime");
        },
      });
    }
  });
});
