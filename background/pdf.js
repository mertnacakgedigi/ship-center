const fileInput = document.getElementById('upload-label');
fileInput.onchange = async () => {

    const selectedFile = fileInput.files[0];
    console.log({selectedFile})
    let reader = new FileReader();
    reader.onload = async function(e) {
        let arrayBuffer = new Uint8Array(reader.result);
        const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer)
        const helveticaFont = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica)
        const pages = pdfDoc.getPages()
        let shipment = window.localStorage.getItem("create-shipment");
       const {orders} = JSON.parse(shipment)
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
    }

    reader.readAsArrayBuffer(selectedFile);
}
