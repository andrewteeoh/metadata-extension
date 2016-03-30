function fillData(obj) {
  document.getElementById("page-title").textContent = obj["title"];

  if (obj["og:title"]) {
    document.getElementById("og-title").textContent = obj["og:title"];
  }
  if (obj["og:url"]) {
    document.getElementById("og-url").textContent = obj["og:url"];
  }
  if (obj["canonical"]) {
    document.getElementById("canonical-url").textContent = obj["canonical"]
  }
  if (obj["og:url"] && obj["canonical"] && obj["og:url"] != obj["canonical"]) {
    document.getElementById("canonical-warning").className += " show";
  }
  if (obj["og:image"]) {
    var ogImage = document.getElementById("og-image--primary");
    var ogImageOverlay = document.getElementById("og-image--overlay");
    ogImage.src = obj["og:image"][0];
    ogImage.onload = function(){
      document.getElementById("facebook-share-container").className += " " + imageSizeCheck(ogImage.naturalWidth, ogImage.naturalHeight);
    };
    ogImageOverlay.style.backgroundImage = "url('" + ogImage.src + "')";

    if (obj["og:image"].length > 0) {
      document.querySelector("#backup-images .header").className += " show";
    }
    obj["og:image"].forEach(function(image, index){
      if (index > 0) {
        var backupOgImage = document.createElement('img');
        backupOgImage.src = image;
        document.getElementById("backup-images").appendChild(backupOgImage);
      }
    });
  }
  if (obj["og:description"]) {
    document.getElementById("og-description").textContent = obj["og:description"];
  }
}

function fillRawDataTable(metadata) {
  var metadataTable = document.getElementById("metadata-raw");
  for (var key in metadata) {
    if (metadata.hasOwnProperty(key)) {
      if (Array.isArray(metadata[key])) {
        metadata[key].forEach(function(value, index){
          metadataTable.innerHTML += '<tr class="meta-tag"><td class="tag-name">' + (index == 0 ? key : '') + '</td><td class="tag-value">' +   metadata[key][index] + '</td></tr>';
        });
      } else {
        metadataTable.innerHTML += '<tr class="meta-tag"><td class="tag-name">' + key + '</td><td class="tag-value">' + metadata[key] + '</td></tr>';
      }
    }
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

function addListeners() {
  document.getElementById("social-tab").addEventListener("mousedown", function(){
    document.getElementById("metadata-social").className = "show";
    document.getElementById("metadata-raw").className = "hide";
    this.className = "hide";
    document.getElementById("raw-tab").className = "show";
  });

  document.getElementById("raw-tab").addEventListener("mousedown", function(){
    document.getElementById("metadata-social").className = "hide";
    document.getElementById("metadata-raw").className = "show";
    this.className = "hide";
    document.getElementById("social-tab").className = "show";
  });
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
      fillRawDataTable(request["metadata"]);
      addListeners();
    }
  }
);
