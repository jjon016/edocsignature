var RenderToTarget = null;
var PDFDocInfo = null;
var PDFCurrentPage = 0;
var RenderViewPort = 3;
var PDFJS = window['pdfjs-dist/build/pdf'];
PDFJS.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.js';
const loadPDFtoDiv = (targetel, pdffile) => {
  RenderToTarget = targetel;
  PDFCurrentPage = 0;
  pdfjsLib.getDocument(pdffile).promise.then(function (pdfDoc) {
    LoadDataFromPDF(pdfDoc);
  });
};

function LoadDataFromPDF(pdfDoc) {
  UploadedDoc.pages = pdfDoc.numPages;
  PDFDocInfo = pdfDoc;
  for (let i = 0; i < UploadedDoc.pages; i++) {
    var theCanvas = document.createElement('canvas');
    theCanvas.id = 'canvas' + i.toString();
    theCanvas.style = 'direction: ltr;';
    get(RenderToTarget).appendChild(theCanvas);
  }
  loadPDFPage(PDFCurrentPage);
}

function loadPDFPage(num) {
  PDFDocInfo.getPage(num + 1).then(function (page) {
    var viewport = page.getViewport({ scale: RenderViewPort });
    var canvas = get('canvas' + num.toString());
    var ctx = canvas.getContext('2d');
    canvas.style.width = viewport.width;
    canvas.style.height = viewport.height;
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render PDF page into theCanvas context
    var renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };
    var renderTask = page.render(renderContext);

    // Wait for rendering to finish
    renderTask.promise.then(function () {
      if (num + 1 != UploadedDoc.pages) {
        PDFCurrentPage++;
        loadPDFPage(PDFCurrentPage);
      } else {
      }
    });
  });
}
