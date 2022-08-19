function interceptData() {
    var xhrOverrideScript = document.createElement('script');
    xhrOverrideScript.type = 'text/javascript';
    xhrOverrideScript.innerHTML = `
  (function() {
    var XHR = XMLHttpRequest.prototype;
    var send = XHR.send;
    var open = XHR.open;
    XHR.open = function(method, url) {
        this.url = url; // the request url
        return open.apply(this, arguments);
    }
    XHR.send = function() {
        this.addEventListener('load', function() {
            if (this.url.includes('https://randomuser.me/api/?nat=us&randomapi')) {
                var dataDOMElement = document.createElement('div');
                dataDOMElement.id = '__interceptedData';
                console.log(this.response)
                dataDOMElement.innerText = this.response;
                dataDOMElement.style.height = 0;
                dataDOMElement.style.overflow = 'hidden';
                document.body.appendChild(dataDOMElement);
            }               
        });
        return send.apply(this, arguments);
    };
  })();
  `
    document.head.prepend(xhrOverrideScript);
}
function checkForDOM() {
    if (document.body && document.head) {
        interceptData();
    } else {
        requestIdleCallback(checkForDOM);
    }
}
requestIdleCallback(checkForDOM);

function scrapeData() {
    var responseContainingEle = document.getElementById('__interceptedData');
    if (responseContainingEle) {
        var response = JSON.parse(responseContainingEle.innerHTML);
    } else {
        requestIdleCallback(scrapeData);
    }
}
requestIdleCallback(scrapeData);
