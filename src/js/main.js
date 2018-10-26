/**
 * main.js
 * Entrypoint for webpack
 */

import "bootstrap";
require('imports-loader?!./lib/select2.min.js');
require('imports-loader?!./lib/flipclock.min.js');
require('imports-loader?!./lib/countdowntime.js');
require('imports-loader?!./lib/tilt.jquery.min.js');
require('imports-loader?!./lib/moment-timezone.min.js');
require('imports-loader?!./lib/moment-timezone-with-data.min.js');

import ready from './utils/ready';
import registerServiceWorker from './utils/serviceWorker';
import { info } from './utils/debug';

$('.js-tilt').tilt({ scale: 1.1 });

var input = $('.validate-input .fipple-newsletter-input');

$('.validate-form').on('submit', function() {
    var check = true;

    for (var i = 0; i < input.length; i++) {
        if (validate(input[i]) == false) {
            showValidate(input[i]);
            check = false;
        }
    }

    return check;
});


$('.validate-form .fipple-newsletter-input').each(function() {
    $(this).focus(function() {
        hideValidate(this);
    });
});

function validate(input) {
    if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
        if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
            return false;
        }
    } else {
        if ($(input).val().trim() == '') {
            return false;
        }
    }
}

function showValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).addClass('alert-validate');
}

function hideValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).removeClass('alert-validate');
}

function onReady(e) {
    registerServiceWorker();
    info(`Event: ${e.type}`, `Datestamp: ${this.date}`);
};

ready(onReady, {
    date: new Date(),
});


$.fn.serializeFormJSON = function() {

    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

$.postJSON = function(url, data, callback) {
    // shift arguments if data argument was omitted
    if (jQuery.isFunction(data)) {
        callback = data;
        data = undefined;
    }

    return jQuery.ajax({
        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(data),
        success: callback
    });
};

function showSnackbar(value) {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar")
    //Add dynamic value
    x.innerHTML = value;
    // Add the "show" class to DIV
    x.className = "show";
    // After 3 seconds, remove the show class from DIV
    setTimeout(function() { x.className = x.className.replace("show", ""); }, 6000);
}

$("#fipple-subscribe-form").submit(function(e) {
    return false;
});

$("#fipple-subscribe").click(function() {
    var that = this;
    var formData = $("#fipple-subscribe-form").serializeFormJSON();
    if (formData.name && formData.email) {
        that.innerHTML = "Subscribing ...";
        $.postJSON("http://fipple.heliohost.org/", formData, function(data, text, obj) {
            that.innerHTML = "Subscribe";
            if (obj.status === 200) {
                if (data.status === 1) {
                    $("#fipple-subscribe-form").trigger("reset");
                    if (data.result === 400) {
                        showSnackbar('Great ! You are already a Fippler. Please wait for your early bird access');
                    } else {
                        showSnackbar('Hey Fippler, now you are in fipple family. Please wait for your early bird access');
                    }
                } else {
                    showSnackbar('Something went wrong :( Please try again or let us know this issue by following one of our social media account.');
                }
            } else {
                showSnackbar('Something went wrong :( Please try again or let us know this issue by following one of our social media account.');
            }
        });
    }
});

$('.cd100').countdown100({
    /*Set Endtime here*/
    /*Endtime must be > current time*/
    endtimeYear: 0,
    endtimeMonth: 0,
    endtimeDate: 90,
    endtimeHours: 18,
    endtimeMinutes: 0,
    endtimeSeconds: 0,
    timeZone: ""
    // ex:  timeZone: "America/New_York"
    //go to " http://momentjs.com/timezone/ " to get timezone
});

// $('.cd100').FlipClock({
// // ... your options here
// });