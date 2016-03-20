function fillData(obj) {
  document.getElementById("page-title").textContent = obj["title"];

  if (obj["og:title"]) {
    document.getElementById("og-title").textContent = obj["og:title"];
  }
  if (obj["og:image"]) {
    var ogImage = document.getElementById("og-image--primary");
    ogImage.src = obj["og:image"];
    ogImage.onload = function(){
      document.getElementById("facebook-share-container").className += " " + imageSizeCheck(ogImage.naturalWidth, ogImage.naturalHeight);
    };

  }
  if (obj["og:description"]) {
    document.getElementById("og-description").textContent = obj["og:description"];
  }
}

function imageSizeCheck(width, height) {
  if (width >= 600 && height >= 315) {
    return "large";
  } else if (width < 200 || height < 200) {
    return "error";
  }
  return "small";
}

document.addEventListener("DOMContentLoaded", function(){
  // Send event to content.js
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  });
});

chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  });
});

// When I get an event from content.js with data, call fillData
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "show_metadata" ) {
      fillData(request["metadata"]);
    }
  }
);
