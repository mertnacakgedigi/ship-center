console.log("running")
let callback = function(details) {
    if (details.requestBody) {
        console.log("---")

        console.log("url", details.url)

        var string = ab2str(details.requestBody.raw[0].bytes);
        const data = JSON.parse(string)
        console.log({data : string})
        if (details.url.includes("create-shipment")){
            localStorage.setItem('create-shipment',JSON.stringify(data))
        }
        console.log("---")
    }
}
var decoder = new TextDecoder("utf-8");

function ab2str(buf) {
    return decoder.decode(new Uint8Array(buf));
}

chrome.webRequest.onBeforeRequest.addListener(
    callback, {urls: ["https://sellercentral.amazon.com/*"]},['requestBody']);
