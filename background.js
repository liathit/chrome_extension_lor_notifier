var data = {
    timeAlarm: 1,
    alarmName: "ring",
    notifUrl: "https://www.linux.org.ru/notifications-count",
    checkMsgUrl: "https://www.linux.org.ru/notifications",
    loginUrl: "https://www.linux.org.ru/login.jsp"

}

var f = (function() { alert("Func") })();

var storage = function() {
    localStorage.setItem("minute", data.timeAlarm);
    return parseInt(localStorage.getItem("minute"));
}

var getmsgcounter = function(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", data.notifUrl, true);
    xhr.send(null);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 403) {
                alert('Please authorize on linux.org.ru');
                chrome.tabs.create({
                    url: data.loginUrl
                });
            }
            if (xhr.status == 200) {
                callback(xhr.responseText);
            } else {
                console.error("Error");
            }
        }
    }

}


var updateicon = function() {
    getmsgcounter(function(response) {
        if (response > 0) {
            chrome.browserAction.setIcon({
                path: "images/unread_notification_icon.png"
            });
            chrome.browserAction.setBadgeText({
                text: response
            });
        } else {
            chrome.browserAction.setBadgeText({
                text: ""
            });
            chrome.browserAction.setIcon({
                path: "images/default_icon.png"
            });
        }
    });
}


function opennewtab() {
    chrome.tabs.create({
        url: data.checkMsgUrl
    });
}

chrome.browserAction.onClicked.addListener(opennewtab);

chrome.alarms.create(data.alarmName, {
    'periodInMinutes': storage()
});

function alarmListener(alarm) {
    if (alarm.name == data.alarmName) {
        updateicon();
        //console.log("Service load: " + alert.name);
    } else {
        console.error("Alarm err");
    }
}

chrome.alarms.onAlarm.addListener(function(alarm) {
    switch (alarm.name) {
        case data.alarmName:
            alarmListener(alarm);
            break;
    }
});

window.onload = updateicon();
