var data = {
    timeAlarm: 1,
    alarmName: "ring",
    notifUrl: "https://www.linux.org.ru/notifications-count",
    checkMsgUrl: "https://www.linux.org.ru/notifications",
    loginUrl: "https://www.linux.org.ru/login.jsp"

}

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
		nologin();
	    }

            if (xhr.status == 200) {
                callback(xhr.responseText);
            } else {
                console.error("Error");
            }
        }
    }

}

var nologin = function() {
	chrome.browserAction.setIcon({path: "images/default_icon.png"});
	chrome.browserAction.setBadgeBackgroundColor({color:[190, 190, 190, 230]});  
    	chrome.browserAction.setBadgeText({text: "X"});
	chrome.browserAction.setTitle({title: "Not signed in"});
	if (chrome.browserAction.onClicked.hasListener(listenerNotify) === true) {
	    chrome.browserAction.onClicked.removeListener(listenerNotify)
	    chrome.browserAction.onClicked.addListener(listenerLogin);
	}

	alert("Listener removed");
}

var updateicon = function() {
    getmsgcounter(function(response) {
        if (response > 0) {
	    if (chrome.browserAction.onClicked.hasListener(listenerLogin) === true) {
		chrome.browserAction.onClicked.removeListener(listenerLogin);
		chrome.browserAction.onClicked.addListener(listenerNotify);
	    }
	    chrome.browserAction.setTitle({title: "Unread notifications:" + response });
            chrome.browserAction.setIcon({
                path: "images/unread_notification_icon.png"
            });
	    chrome.browserAction.setBadgeBackgroundColor({color: "#ff6729"}); 
    
            chrome.browserAction.setBadgeText({
                text: response
            });
        } else {
	    if (chrome.browserAction.onClicked.hasListener(listenerLogin) === true) {
		chrome.browserAction.onClicked.removeListener(listenerLogin);
		chrome.browserAction.onClicked.addListener(listenerNotify);
	    }
	    chrome.browserAction.setTitle({title:"No unred notifications"});
            chrome.browserAction.setBadgeText({
                text: ""
            });
            chrome.browserAction.setIcon({
                path: "images/default_icon.png"
            });
        }
    });
}

var listenerLogin = function() {chrome.tabs.create({url: data.loginUrl})};
var listenerNotify = function() {chrome.tabs.create({url: data.checkMsgUrl})};

/*
function opennewtab() {
    chrome.tabs.create({
        url: data.checkMsgUrl
    });
}
*/

chrome.browserAction.onClicked.addListener(listenerNotify);

chrome.alarms.create(data.alarmName, {
    'periodInMinutes': storage()
});

function alarmListener(alarm) {
    if (alarm.name == data.alarmName) {
        updateicon();
        console.log("Service load: " + alert.name);
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
