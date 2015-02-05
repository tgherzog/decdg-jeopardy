
/* number of seconds for each question. At 5 seconds or less, screen will start counting seconds,
   then end with a sound effect. Set to 0 to disable
*/
var roundTimer = 10;

$(document).ready(function() {

  /* use 1st existing of these sources files in order of preference:
     jeopardy.txt
     jeopardy.example.txt
  */
  $.ajax({
    url: 'jeopardy.txt',
    success: loadJeopardy,
    error: function() {
      $.ajax({
        url: 'jeopardy.example.txt',
	success: loadJeopardy
      })
    }
  });

  function loadJeopardy(data) {
    var rows = data.split(/\r\n?|\n/), cols, div, i;
    rows.shift(); // pop the first row as a header

    for(i=0;i<rows.length;i++) {
      // allow for comments
      if( rows[i].substr(0,1) == '#' ) continue;

      cols = rows[i].split(/\t/);

      // A '0' in column 7 will cause the row to be ignored
      var name     = cols[0] || "";
      var theme    = cols[1] || "";
      var answer   = cols[2] || "";
      var question = cols[3] || "";
      var file     = cols[4] || "";
      var status   = cols[6];

      // clean rows that may be wrapped in quotes (curse you, Excel!)
      name     = cleanText(name);
      answer   = cleanText(answer);
      question = cleanText(question);
      theme    = cleanText(theme);
      file     = cleanText(file);

      // crude support for emphasis, ala markdown
      var question_ = question;
      question = question.replace(/\*(.+)\*/, "<em>$1</em>");

      // name, theme and valid status are required: else skip this row
      if( ! name || ! theme || status == '0' ) continue;

      if( ! answer ) answer = "???";
      if( ! question ) question = "Who is <em>" + name + "?</em>";

/*
      answer   = $('<p/>').html(answer);
      question = $('<p/>').html(question);
*/

      if( $('#report').length ) {
	// Instead, report questions in a table.
	$tr = $('<tr/>');
	$('<td/>').append(i+1).appendTo($tr);
	$('<td/>').append(theme).appendTo($tr);
	$('<td/>').append((file ? "[picture] " : "") + answer).appendTo($tr);
	$('<td/>').append(question_ ? question : name).appendTo($tr);
	$('#report').append($tr);

        continue;
      }

      if( file ) {
        var img = $('<img/>').attr('src', 'images/' + file);
	$('<div/>').attr('theme', theme).addClass('image').attr('data-nobig', '1').attr('timer', 1).append(img.clone()).append(answer).appendTo('body');
	$('<div/>').attr('theme', theme).addClass('image').attr('data-nobig', '1').attr('data-bodyclass', 'question').append(img).append(question).appendTo('body');
      }
      else {
	$('<div/>').attr('theme', theme).attr('timer', 1).append(answer).appendTo('body');
	$('<div/>').attr('theme', theme).attr('data-bodyclass', 'question').append(question).appendTo('body');
      }
    }

    makeItBig();
  }

  function cleanText(str) {

    str = str.trim();
    if( str[0] == '"' && str[str.length-1] == '"' ) str = str.substring(1, str.length-1);
    return str.trim();
  }
});

var iv = false;

function updateTheme(e) {

  var t = $(e).attr('theme') || "";
  $('#theme').text(t);
  $('#timer').text("");
  
  if( iv !== false ) {
    clearInterval(iv);
    iv = false;
  }

  if( $(e).attr('timer') == 1 ) {
    var secs = roundTimer;
    iv = setInterval(function() {
      secs--;
      if( secs <= 5 ) {
        $("#timer").text(":0" + secs);
	if( secs == 0 ) {
	  clearInterval(iv);
	  iv = false;
	  document.getElementById('horn').play();
	}
      }

    }, 1000);
    console.log("Timer set: " + iv);
  }
}

function keyHandler(key) {

  // 'z' to buzz
  if( key === 90 ) {
    document.getElementById('buzzer').play();
	setTimeout(function() {
     var h = document.getElementById('buzzer');
	 h.pause();
	 h.load();
	}, 1500);
  }

  // 'b' to ring bell
  if( key === 66 )
    document.getElementById('dinger').play();
}

