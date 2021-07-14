var BoundsTop = 0;
var BoundsLeft = 0;
var BoundsHeight = 0;
var BoundsWidth = 0;
var DelEl = null;
var IsDragging = false;
var dragObj = new Object();
dragObj.zIndex = 0;

function GetBounds() {
  BoundsTop = 0;
  BoundsLeft = 0;
  BoundsHeight = 0;
  BoundsWidth = 0;
  for (let p = 0; p < UploadedDoc.pages; p++) {
    let eldim = getDim('canvas' + p.toString());
    BoundsHeight = BoundsHeight + eldim.height;
    if (eldim.width > BoundsWidth) {
      BoundsWidth = eldim.width;
    }
  }
}
class SigBox {
  x = 0;
  y = 0;
  w = 0;
  h = 0;
  xp = 0;
  yp = 0;
  wp = 0;
  maxt = 0;
  hp = 0;
  maxl = 0;
  maxx = 0;
  maxy = 0;
  id = '';
  signerid = '';
  type = 0;
  page = 0;
  docnum = 0;
  font = 'Arial';
  fontsize = 10;
  fontcolor = 'black';
  fieldname = '';
  fieldvalue = '';
  fieldlabel = '';
  defaultvalue = '';
  required = '0';
  checkedvalue = '';
  uncheckedvalue = '';
  depfield = '';
  depfieldvalue = '';
  depoperator = '=';
}
var tapedTwice = false;
function MakeElDraggable(theitem) {
  var el = get(theitem.id);
  var Bounds = new Object();
  var resize = false;
  el.onmousedown = function (event) {
    //if(get("UsrEdtInpt")){
    //	SetUsrFieldAndClose();
    //	LastUserFieldBox=[];
    //}
    boxclicked = true;
    DelEl = el;
    IsDragging = true;
    for (var i = 0; i < UploadedDoc.sigboxes.length; i++) {
      if (UploadedDoc.sigboxes[i].id == el.id) {
        Bounds.btop = UploadedDoc.sigboxes[i].maxt;
        Bounds.bleft = UploadedDoc.sigboxes[i].maxl;
        Bounds.maxx = UploadedDoc.sigboxes[i].maxx;
        Bounds.maxy = UploadedDoc.sigboxes[i].maxy;
      }
    }
    dragStart(event, el.id, Bounds);
  };
  el.onmousemove = function (event) {
    if (IsDragging) {
      return false;
    }
    checkcursor(event, el.id);
  };

  var startx,
    starty,
    startt,
    startl = 0;
  var zIndex = 10;

  el.addEventListener(
    'touchstart',
    function (e) {
      boxclicked = true;
      e.preventDefault();
      if (!tapedTwice) {
        tapedTwice = true;
        setTimeout(function () {
          tapedTwice = false;
        }, 300);
        var touchobj = e.changedTouches[0]; // reference first touch point (ie: first finger)
        startx =
          parseInt(touchobj.clientX) + document.documentElement.scrollLeft; // get x position of touch point relative to left edge of browser
        starty =
          parseInt(touchobj.clientY) + document.documentElement.scrollTop; // get y position of touch point relative to left edge of browser
        startl = parseInt(el.style.left);
        startt = parseInt(el.style.top);
        el.style.zIndex = ++zIndex;
        cy = Math.floor(getOffset(el).top) + parseInt(el.style.height);
        cx = Math.floor(getOffset(el).left) + parseInt(el.style.width);
        if (
          cx - 20 < startx &&
          startx < cx + 20 &&
          cy - 20 < starty &&
          starty < cy + 20
        ) {
          resize = true;
        }
      } else {
        for (var i = 0; i < UploadedDoc.sigboxes.length; i++) {
          if (UploadedDoc.sigboxes[i].id == el.id) {
            //DisplayBoxForEdit(UploadedDoc.sigboxes[i].id);
          }
        }
      }
    },
    false
  );

  el.addEventListener(
    'dblclick',
    function (e) {
      boxclicked = true;
      for (var i = 0; i < UploadedDoc.sigboxes.length; i++) {
        if (UploadedDoc.sigboxes[i].id == el.id) {
          //DisplayBoxForEdit(UploadedDoc.sigboxes[i].id);
        }
      }
      e.preventDefault();
    },
    false
  );

  el.addEventListener(
    'touchmove',
    function (e) {
      IsDragging = true;
      var touchobj = e.changedTouches[0]; // reference first touch point for this event
      var elw = parseInt(el.style.width);
      var elh = parseInt(el.style.height);
      var x = parseInt(touchobj.clientX) + document.documentElement.scrollLeft;
      var y = parseInt(touchobj.clientY) + document.documentElement.scrollTop;

      var targetx = startl + (x - startx);
      var targety = startt + (y - starty);
      var targetendx = targetx + elw;
      var targetendy = targety + elh;
      // check that we don't move the object out of bounds
      if (!isNaN(Bounds.btop)) {
        if (targetx < Bounds.bleft) {
          targetx = Bounds.bleft;
        }
        if (targety < Bounds.btop) {
          targety = Bounds.btop;
        }
        if (targetendx > Bounds.maxx) {
          targetx = Bounds.maxx - elw;
        }
        if (targetendy > Bounds.maxy) {
          targety = Bounds.maxy - elh;
        }
      }
      if (resize) {
        var neww = Math.floor(x - getOffset(el).left);
        var newh = Math.floor(y - getOffset(el).top);
        el.style.width = neww + 'px';
        el.style.height = newh + 'px';
      } else {
        el.style.left = targetx;
        el.style.top = targety;
      }
      e.preventDefault();
    },
    false
  );

  for (var i = 0; i < UploadedDoc.sigboxes.length; i++) {
    if (UploadedDoc.sigboxes[i].id == el.id) {
      if (UploadedDoc.sigboxes[i].type == 7) {
        el.addEventListener(
          'click',
          function (e) {
            boxclicked = true;
            if (e.altKey) {
              for (var b = 0; b < UploadedDoc.sigboxes.length; b++) {
                if (UploadedDoc.sigboxes[b].id == e.target.id) {
                  var el = get(e.target.id);
                  var tDN = UploadedDoc.sigboxes[b].fieldlabel;
                  UploadedDoc.sigboxes[b].defaultvalue =
                    UploadedDoc.sigboxes[b].defaultvalue == '0' ? '1' : '0';
                  if (UploadedDoc.sigboxes[b].defaultvalue == '0') {
                    el.innerHTML = '&nbsp;';
                  } else {
                    if (tDN == '0') {
                      el.innerHTML = 'X';
                    } else if (tDN == '1') {
                      el.innerHTML = '✔';
                    } else {
                      el.innerHTML = '•';
                    }
                  }
                  e.preventDefault();
                }
              }
            }
          },
          false
        );
      }
    }
  }

  el.addEventListener(
    'touchend',
    function (e) {
      IsDragging = false;
      resize = false;
      SaveSigItemCord();
      e.preventDefault();
    },
    false
  );
}
function dragStop(event) {
  SaveSigItemCord();
  // Stop capturing mousemove and mouseup events.
  document.removeEventListener('mousemove', dragGo, true);
  document.removeEventListener('mouseup', dragStop, true);

  IsDragging = false;
  dragObj = new Object();
}
function dragGo(event) {
  // Get cursor position with respect to the page.
  var x = event.clientX + window.scrollX;
  var y = event.clientY + window.scrollY;

  x = parseInt(x);
  y = parseInt(y);
  elw = parseInt(dragObj.elNode.style.width);
  elh = parseInt(dragObj.elNode.style.height);

  var targetx = dragObj.elStartLeft + (x - dragObj.cursorStartX);
  var targety = dragObj.elStartTop + (y - dragObj.cursorStartY);
  var targetendx = targetx + elw;
  var targetendy = targety + elh;
  // check that we don't move the object out of bounds
  if (!isNaN(dragObj.btop)) {
    if (targetx < dragObj.bleft) {
      targetx = dragObj.bleft;
    }
    if (targety < dragObj.btop) {
      targety = dragObj.btop;
    }
    if (targetendx > dragObj.maxx) {
      targetx = dragObj.maxx - elw;
    }
    if (targetendy > dragObj.maxy) {
      targety = dragObj.maxy - elh;
    }
  }

  // Move drag element by the same amount the cursor has moved.
  dragObj.elNode.style.left = targetx.toString() + 'px';
  dragObj.elNode.style.top = targety.toString() + 'px';
  event.preventDefault();
}
function dragStart(event, id, Bounds) {
  // If an element id was given, find it. Otherwise use the element being
  // clicked on.

  if (id) {
    dragObj.elNode = document.getElementById(id);
  } else {
    dragObj.elNode = event.target;
  }

  // If this is a text node, use its parent element.

  if (dragObj.elNode.nodeType == 3) dragObj.elNode = dragObj.elNode.parentNode;

  //Checkif Bounds are set
  if (Bounds) {
    dragObj.btop = Bounds.btop;
    dragObj.bleft = Bounds.bleft;
    dragObj.maxx = Bounds.maxx;
    dragObj.maxy = Bounds.maxy;
  }

  // Get cursor position with respect to the page.

  var x = event.clientX + window.scrollX;
  var y = event.clientY + window.scrollY;

  // Save starting positions of cursor and element.

  dragObj.cursorStartX = x;
  dragObj.cursorStartY = y;
  dragObj.elStartLeft = parseInt(dragObj.elNode.style.left, 10);
  dragObj.elStartTop = parseInt(dragObj.elNode.style.top, 10);

  if (isNaN(dragObj.elStartLeft)) dragObj.elStartLeft = x + 5;
  if (isNaN(dragObj.elStartTop)) dragObj.elStartTop = y + 5;

  // Update element's z-index.

  dragObj.elNode.style.zIndex = ++dragObj.zIndex;

  var cy =
    Math.floor(getOffset(dragObj.elNode).top) +
    parseInt(dragObj.elNode.style.height);
  var cx =
    Math.floor(getOffset(dragObj.elNode).left) +
    parseInt(dragObj.elNode.style.width);

  if (IsUserField(id)) {
    if (cx - 10 < x && x < cx + 10) {
      //continue
    } else {
      return true;
    }
  }

  if (cx - 10 < x && x < cx + 10 && cy - 10 < y && y < cy + 10) {
    //Lets Resize it
    document.addEventListener('mousemove', resizeGo, true);
    document.addEventListener('mouseup', resizeStop, true);
    event.preventDefault();
  } else {
    // Capture mousemove and mouseup events on the page.
    document.addEventListener('mousemove', dragGo, true);
    document.addEventListener('mouseup', dragStop, true);
    event.preventDefault();
  }
}
function checkcursor(event, id) {
  var el;
  var x, y, cx, cy;

  // If an element id was given, find it. Otherwise use the element being clicked on

  if (id) {
    dragObj.elNode = document.getElementById(id);
  } else {
    dragObj.elNode = event.target;
  }

  x = event.clientX + window.scrollX;
  y = event.clientY + window.scrollY;

  x = parseInt(x);
  y = parseInt(y);

  cy =
    Math.floor(getOffset(dragObj.elNode).top) +
    parseInt(dragObj.elNode.style.height);
  cx =
    Math.floor(getOffset(dragObj.elNode).left) +
    parseInt(dragObj.elNode.style.width);

  if (cx - 10 < x && x < cx + 10 && cy - 10 < y && y < cy + 10) {
    dragObj.elNode.style.cursor = 'nwse-resize';
  } else {
    dragObj.elNode.style.cursor = 'default';
  }
}
function IsUserField(ID) {
  for (var b = 0; b < UploadedDoc.sigboxes.length; b++) {
    if (UploadedDoc.sigboxes[b].id == ID) {
      return UploadedDoc.sigboxes[b].type == 6;
    }
  }
  return false;
}
function IsRequiredUserField(ID) {
  for (var b = 0; b < UploadedDoc.sigboxes.length; b++) {
    if (UploadedDoc.sigboxes[b].id == ID) {
      return UploadedDoc.sigboxes[b].required == true;
    }
  }
  return false;
}
function InitialTheName(name) {
  var res = name.split(' ');
  var fn = res[0].charAt(0);
  var ln = res[res.length - 1].charAt(0);
  return fn + ln;
}
function SaveSigItemCord() {
  var el = dragObj.elNode;
  var w = Math.max(parseInt(el.style.width), 10);
  var h = Math.max(parseInt(el.style.height), 10);
  var t = Math.max(parseInt(el.style.top), 1);
  var l = Math.max(parseInt(el.style.left), 0);
  if (IsUserField(el.id)) {
    if (IsRequiredUserField(el.id)) {
      get(el.id + 'Txt').style.width = w - 18;
      get(el.id + 'Txt').style.height = h - 6;
    } else {
      get(el.id + 'Txt').style.width = w - 15;
      get(el.id + 'Txt').style.height = h - 1;
    }
  }
  for (var i = UploadedDoc.sigboxes.length - 1; i >= 0; i--) {
    if (UploadedDoc.sigboxes[i].id === el.id) {
      UploadedDoc.sigboxes[i].x = l;
      UploadedDoc.sigboxes[i].y = t;
      UploadedDoc.sigboxes[i].w = w;
      UploadedDoc.sigboxes[i].h = h;
      switch (UploadedDoc.sigboxes[i].type) {
        case 0:
          LastSigBoxDim = [w, h];
          el.style.fontSize = getFSFast(w, h, 9);
          el.style.lineHeight = el.style.fontSize;
          break;
        case 1:
          LastInitBoxDim = [w, h];
          el.style.fontSize = getFSFast(w, h, 4);
          el.style.lineHeight = el.style.fontSize;
          break;
        case 2:
          LastDateBoxDim = [w, h];
          el.style.fontSize = getFSFast(w, h, DateText.length) - 2;
          el.style.lineHeight = el.style.fontSize;
          break;
        case 3:
          LastTextBoxDim = [w, h];
          el.style.fontSize = getFSFast(
            w,
            h,
            UploadedDoc.sigboxes[i].fieldname.length
          );
          el.style.lineHeight = el.style.fontSize;
          break;
        case 4:
          LastCheckBoxDim = [w, h];
          var fs = getFSFast(w, h, 1);
          if (UploadedDoc.sigboxes[i].required == '1') {
            fs = fs - 6;
          }
          el.style.fontSize = fs.toString() + 'px';
          el.style.lineHeight = fs.toString() + 'px';
          break;
        case 5:
          LastRadioBoxDim = [w, h];
          var fs = getFSFast(w, h, 1);
          if (UploadedDoc.sigboxes[i].required == '1') {
            fs = fs - 6;
          }
          el.style.fontSize = fs.toString() + 'px';
          el.style.lineHeight = fs.toString() + 'px';
          break;
        case 6:
          LastUserFieldBox = [w, h, t, l];
          var fs = Math.max(
            getFSFast(w - 10, h - 1, UploadedDoc.sigboxes[i].fieldvalue.length),
            16
          );
          get(el.id + 'Txt').style.fontSize = fs.toString() + 'px';
          break;
        case 7:
          LastUserCheckBoxDim = [w, h, t, l];
          var fs = getFSFast(w, h, 1);
          if (UploadedDoc.sigboxes[i].required == '1') {
            fs = fs - 6;
          }
          el.style.fontSize = fs.toString() + 'px';
          el.style.lineHeight = fs.toString() + 'px';
          break;
      }
    }
  }
}
function resizeGo(event) {
  // Get cursor position with respect to the page.

  var x = event.clientX + window.scrollX;
  var y = event.clientY + window.scrollY;

  var neww = parseInt(x) - Math.floor(getOffset(dragObj.elNode).left);
  var newh = parseInt(y) - Math.floor(getOffset(dragObj.elNode).top);

  // Move drag element by the same amount the cursor has moved.
  dragObj.elNode.style.width = neww + 'px';
  dragObj.elNode.style.height = newh + 'px';
  if (dragObj.elNode.classList.contains('UserField')) {
    if (get(dragObj.elNode.id + 'Txt')) {
      get(dragObj.elNode.id + 'Txt').style.backgroundColor = 'transparent';
      get(dragObj.elNode.id + 'Txt').style.borderColor = 'transparent';
    }
  }

  event.preventDefault();
}
function resizeStop(event) {
  IsDragging = false;
  SaveSigItemCord();

  document.removeEventListener('mousemove', resizeGo, true);
  document.removeEventListener('mouseup', resizeStop, true);

  if (dragObj.elNode.classList.contains('UserField')) {
    if (get(dragObj.elNode.id + 'Txt')) {
      get(dragObj.elNode.id + 'Txt').style.backgroundColor = 'white';
      get(dragObj.elNode.id + 'Txt').style.borderColor = 'black';
    }
  }
  dragObj = new Object();
}
