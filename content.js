chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message === "clicked_browser_action") {
      var metatags = document.getElementsByTagName('meta');
      var canonical = document.querySelector("link[rel='canonical']");
      var metaObj = {};
      metaObj.title = document.title;

      if (canonical) {
        metaObj.canonical = document.querySelector("link[rel='canonical']").href;
      }

      for (var i=0; i< metatags.length; i++) {
        var property = metatags[i].getAttribute('property');
        if (property) {
          if (property == "og:image") {
            metaObj[property] = metaObj[property] || []
            metaObj[property].push([metatags[i].getAttribute('content')]);
          }
          else {
            metaObj[property] = metatags[i].getAttribute('content');
          }
        }
      }

      chrome.runtime.sendMessage({"message": "show_metadata", "metadata": metaObj});
    }
  }
);