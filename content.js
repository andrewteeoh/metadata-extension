chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      var metatags = document.getElementsByTagName('meta');
      var metaObj = {};
      metaObj.title = document.title;

      for(var i=0; i< metatags.length; i++) {
        var property = metatags[i].getAttribute('property');
        if (property) {
          if (!metaObj[property]) {
            metaObj[property] = metatags[i].getAttribute('content');
            console.log(property + ": " + metatags[i].getAttribute('content'));
          }
        }
      }

      chrome.runtime.sendMessage({"message": "show_metadata", "metadata": metaObj});
    }
  }
);