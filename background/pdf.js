const fileInput = document.getElementById('upload-label');
fileInput.onchange = async () => {

    const selectedFile = fileInput.files[0];
    let reader = new FileReader();
    reader.onload = async function(e) {
        let arrayBuffer = new Uint8Array(reader.result);
        const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer)
        const helveticaFont = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica)
        const pages = pdfDoc.getPages()
       chrome.storage.local.get(['create-shipment'], async function(result) {
            console.log('Value currently is ' + result['create-shipment']);
            const {orders} = JSON.parse(result['create-shipment'])
            for (let i = 0; i < orders.length; i++) {
                orders[i].items.forEach(({sku, quantityOrdered})=> {
                    pages[i].drawText(`${quantityOrdered} X ${sku}`, {
                        x: 40,
                        y: 25,
                        size: 10,
                        font: helveticaFont,
                    })
                })
            }

            console.log("sku and quantity added")
            const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
            document.getElementById('pdf').src = pdfDataUri;
            var link = document.createElement('a');
            link.href = pdfDataUri;
            link.download = "sc-" + selectedFile.name;
            console.log("sc" + selectedFile.name + "is downloaded")
            link.dispatchEvent(new MouseEvent('click'));
        });

    }

    reader.readAsArrayBuffer(selectedFile);
}
function updateHeader() {
    chrome.storage.local.get(['create-shipment'], async function(result) {
        const res = result['create-shipment'];
        if (!res) {
            document.getElementById('header').innerHTML = 'No Shipment Detected. Create your label from Amazon Seller Central and then open Ship Center Extension.';
            return
        }
        const {orders} = JSON.parse(res);
        if (orders && orders.length && orders[0].items?.length) {
            document.getElementById('header').innerHTML = 'Shipment info includes ' + orders[0].items[0].sku  + ' is saved. Upload your label below.'
        } else {
            document.getElementById('header').innerHTML = 'No Shipment Detected. Create your label from Amazon Seller Central and then open Ship Center Extension.'
        }
    })
}
updateHeader()
