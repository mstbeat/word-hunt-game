var myArry = ["CAT", "COW", "PANDA", "PEACOCK", "DOG", "GOAT", "LION", "TIGER", "DUCK"];
var tempArry = [];
var selectedWord = [];

$(document).ready(function(){
  $("#btnReset").click(function() {
    $("#words").empty();
    $("#grid").empty();
    arrangeGame();
  });
  $("#message").dialog({
    title:"ルール",
    position:{at:"center top"},
    buttons:[{
      text:"OK",
      click:function() {
        $(this).dialog("close");
        arrangeGame();
      }
    }]
  });
  $("#message").html("<p>1. 英単語が横方向か縦方向に隠れています。<br>2. マウスをドラッグして英単語を選択してください。</p>");
});

function arrangeGame() {
  $("#btnReset").show();
  $("#words").show();
  $("#grid").show();
  $.each(myArry, function (key, item) {
    $("#words").append("<p>" + item +"</p>");
  });
  for(var i = 1; i <= 12; i++) {
    for(var j = 1; j <= 12; j++) {
      $("#grid").append("<div class='letter' data-row=" + i + " data-column=" + j + "></div>");
    }
  }
  $("#grid").selectable({
    selected:function(event, ui) {
      selectedWord += $(ui.selected).html();
    },
    stop:function() {
      if(myArry.indexOf(selectedWord) >= 0) {
        var myIndex = myArry.indexOf(selectedWord);
        $("#words p:eq(" + myIndex + ")").css({'color':'green','font-weight':'bold'});
        $("#words p:eq(" + myIndex + ")").addClass("correct");
        $(".ui-selected").css("background", "green");
        if($(".correct").length == myArry.length) {
          $("#words").empty();
          $("#grid").empty();
          $("#words").hide();
          $("#grid").hide();
          $("#btnReset").hide();
          $("#message").dialog("open");
          $("#message").dialog({
            title:"ゲームクリア",
            buttons:{
              "はい":function() {
                arrangeGame();
                $(this).dialog("close")
              },
              "いいえ":function() {
                $(this).dialog("close")
                $("#container").append("<p id='end'>Thank you!</p>");
              }
            }
          });
          $("#message").html("<p>全ての英単語を見つけました！<br>もう一度プレーしますか？</p>");

        }
      }
      selectedWord = "";
    }
  });
  placeWords(myArry);
  placeWords(tempArry);
  tempArry = [];
  $.each($(".letter"), function(key, item) {
    if($(item).data("word") == undefined) {
      $(item).html(randomLetter());
    }
  })
};

function checkEmpty(count, start, orientation) {
  var incrementBy = 0;
  if(orientation == "horizontal") {
    incrementBy = 1;
  } else if(orientation == "vertical") {
    incrementBy = 12;
  }
  for(var m = 0, n = start; m < count; m++) {
    if($(".letter:eq(" + n + ")").data("word") == undefined) {
      status ="empty";
    } else {
      status = "occupied";
      break;
    }
    n += incrementBy;
  }
  return status;
};

function randomLetter() {
  var alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return alphabets.charAt(Math.floor(Math.random()*26));
};

function placeWords(myWords) {
  var orientations = ["horizontal", "vertical"];
  for(var i = 0; i < myWords.length; i++) {
    var myOrientation = orientations[Math.floor(Math.random()*orientations.length)];
    var start = Math.floor(Math.random()*$(".letter").length);

    var currentRow = $(".letter:eq(" + start + ")").data("row");
    var currentColumn = $(".letter:eq(" + start + ")").data("column");
    var letterCount = myWords[i].length;
    var characters = myWords[i].split("");

    var nextLetter = 0;
    var nextPosition = 0;
    var newStart = 0;
    if(myOrientation == "horizontal") {
      nextLetter = 1;
      if((currentColumn + letterCount) <= 12) {
        newStart = start;
      } else {
        var newColumn = 12 - letterCount;
        newStart = $(".letter[data-row=" + currentRow + "][data-column=" + newColumn + "]").index();
      }
    } else if(myOrientation == "vertical") {
      nextLetter = 12;
      if((currentRow + letterCount) <= 12) {
        newStart = start;
      } else {
        var newRow = 12 - letterCount;
        newStart = $(".letter[data-row=" + newRow + "][data-column=" + currentColumn + "]").index();
      }
    }
    console.log(myWords[i] + " : " + myOrientation + " : " + start + " : " + newStart);
    console.log(tempArry);
    var status = checkEmpty(letterCount, newStart, myOrientation);
    if(status == "empty") {
      $.each(characters, function(key, item) {
        $(".letter:eq(" + (newStart + nextPosition) + ")").html(item);
        $(".letter:eq(" + (newStart + nextPosition) + ")").attr("data-word", myWords[i]);
        nextPosition += nextLetter;
      });
    } else {
      tempArry.push(myWords[i]);
    }
  }
};