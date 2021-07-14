var LastSigBoxDim = [275, 35];
function AddSignatureBoxToCanvas() {
  GetBounds();
  var SigItem = new SigBox();
  SigItem.signerid = get('signersel').value;
  var NewSigBox = document.createElement('div');
  var d = new Date();
  NewSigBox.id = d.valueOf().toString();
  var displayname = 'Signature';
  SigItem.required = '1';
  NewSigBox.style.width = LastSigBoxDim[0].toString() + 'px';
  NewSigBox.style.height = LastSigBoxDim[1].toString() + 'px';
  NewSigBox.className = 'SigBox sig-font';
  NewSigBox.style.border = '3px solid black';
  NewSigBox.title = 'Required';
  NewSigBox.innerHTML =
    '<span style="position:absolute;top:0px;left:0px;">Signature</span>';
  NewSigBox.style.background = '#232abc';
  NewSigBox.style.fontSize = getFSFast(
    LastSigBoxDim[0],
    LastSigBoxDim[1],
    displayname.length
  );
  NewSigBox.style.lineHeight = NewSigBox.style.fontSize;
  var top = window.scrollY;
  var left = 10;
  NewSigBox.style.top = BoundsTop + top.toString() + 'px';
  NewSigBox.style.left = BoundsLeft + left.toString() + 'px';
  document.getElementById(RenderToTarget).appendChild(NewSigBox);
  NewSigBox.zIndex = 1;
  SigItem.x = parseInt(NewSigBox.style.top);
  SigItem.y = parseInt(NewSigBox.style.left);
  SigItem.w = parseInt(NewSigBox.style.width);
  SigItem.h = parseInt(NewSigBox.style.height);
  SigItem.fontsize = NewSigBox.style.fontSize;
  SigItem.id = NewSigBox.id;
  SigItem.type = 0;
  SigItem.maxt = BoundsTop;
  SigItem.maxl = BoundsLeft;
  SigItem.maxx = BoundsWidth;
  SigItem.maxy = BoundsHeight;
  UploadedDoc.sigboxes.push(SigItem);
  MakeElDraggable(SigItem);
}
