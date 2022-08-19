var s = document.createElement('script');
s.src = chrome.extension.getURL('injected.js');
console.log("yeay")
let callback = function(details) {
    console.log("common")
    console.log(details)
}
let filter = {};
var opt_extraInfoSpec = [];
chrome.webRequest.onBeforeRequest.addListener(
    callback, filter, opt_extraInfoSpec);
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);
