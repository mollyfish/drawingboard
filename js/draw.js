(function() {

  var canvas = $('#canvas')[0];
  var context = $('#canvas')[0].getContext("2d");
  var isDown;
  var startX;
  var startY;
  var mouseX;
  var mouseY;
  var snap = true;
  var lines = [];
  var lineTool = false;
  var selectTool = true;
  
  function drawLine(startX, startY, mouseX, mouseY) {
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(mouseX, mouseY);
    context.closePath();
    context.stroke();
    context.restore();
  }
  function saveLine(startX, startY, mouseX, mouseY) {
    lines.push({startX: startX, startY: startY, mouseX: mouseX, mouseY: mouseY});
  }
  function renderLines() {
    for (var i = lines.length - 1; i >= 0; i--) {
      drawLine(lines[i].startX, lines[i].startY, lines[i].mouseX, lines[i].mouseY);
    };
  }
  function liveRender() {
    renderLines();
    clearCanvas();
  }
  function undoLastLine() {
    lines.pop();
  }
  function clearCanvas() {
    context.clearRect(0, 0, $('#canvas').width(), $('#canvas').height());
  }
  
  canvas.onmousedown = function (e)  {
    if (lineTool) {
      var rawX = e.pageX - this.offsetLeft;
      var rawY = e.pageY - this.offsetTop;
      var remainderX = rawX % 30;
      var remainderY = rawY % 30;
      var prev30X = (Math.floor(rawX / 30)) * 30;
      var prev30Y = (Math.floor(rawY / 30)) * 30;
      var next30X = prev30X + 30;
      var next30Y = prev30Y + 30;
      if (snap) {
        if (remainderX < 15) {
          startX = prev30X;
        } else {
          startX = next30X;
        }
        if (remainderY < 15) {
          startY = prev30Y;
        } else {
          startY = next30Y;
        }
      } else {
        startX = e.pageX - this.offsetLeft;
        startY = e.pageY - this.offsetTop;
      }

      isDown = true;
    }
  }
  canvas.onmousemove = function (e)  {
    if (lineTool) {
      if (!isDown) {
        return;
      }
      var rawX = e.pageX - this.offsetLeft;
      var rawY = e.pageY - this.offsetTop;
      var remainderX = rawX % 30;
      var remainderY = rawY % 30;
      var prev30X = (Math.floor(rawX / 30)) * 30;
      var prev30Y = (Math.floor(rawY / 30)) * 30;
      var next30X = prev30X + 30;
      var next30Y = prev30Y + 30;
      if (snap) {
        if (remainderX < 15) {
          mouseX = prev30X;
        } else {
          mouseX = next30X;
        }
        if (remainderY < 15) {
          mouseY = prev30Y;
        } else {
          mouseY = next30Y;
        }
      } else {
        mouseX = e.pageX - this.offsetLeft;
        mouseY = e.pageY - this.offsetTop;
      }
      drawLine(startX, startY, mouseX, mouseY);
      liveRender()
      drawLine(startX, startY, mouseX, mouseY);
      renderLines();
    }
  }
  canvas.onmouseup = function (e)  {
    if (lineTool) {
      if (!isDown) {
        return;
      }
      isDown = false;
      clearCanvas()
      drawLine(startX, startY, mouseX, mouseY);
      saveLine(startX, startY, mouseX, mouseY);
      renderLines();
      console.log(snap);
    }
  }
  
  $("#undoButton").on("click", function() {
    undoLastLine();
    clearCanvas()
    renderLines();
  });
  
  $("#clearButton").on("click", function() {
    clearCanvas()
    lines = [];
  });


  $("#snaptogrid").on("change", function() {
    if (this.checked) {
      snap = true;
      console.log("snap");
    }
    if (!this.checked) {
      snap = false;
      console.log("no snap");
    }
    
  });

  $('#tools').on("change", function() {
    if($('#selectTool')[0].checked) {
      selectTool = true;
      lineTool = false;
      console.log("select tool");
    }
    if($('#lineTool')[0].checked) {
      selectTool = false;
      lineTool = true;
      console.log("line tool");
    }
  });

})();
