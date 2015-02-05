$(document).ready(function() {

  $.get('taboo.txt', function(data) {
    var rows = data.split(/\r\n?|\n/);

    for(i=0;i<rows.length;i++) {
      word = cleanText(rows[i]);
	  if( ! word.match(/\w/) ) continue;

	  $('<div/>').append(word).appendTo('body');
    }

    makeItBig();
  });

  function cleanText(str) {

    str = str.trim();
    if( str[0] == '"' && str[str.length-1] == '"' ) str = str.substring(1, str.length-1);
    return str;
  }

});

function updateTheme(e) {

  var t = $(e).attr('theme') || "";
  $('p.theme').text(t);
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

  // 't' to start timer
  if( key == 84 )
    beginTimer();
  // 'k' to clear the timer
  if( key == 75 )
    endTimer();
}

var iv = false;

function beginTimer() {

  endTimer();
  secs = 120;
  $('#timer').text("");
  iv = setInterval(function() {
    secs--;
    if( true || secs <= 30 ) {
      var t = "", s = secs;
      if( s > 10 ) {
        t = parseInt((s/60));
	s %= 60;
      }

      t += ":";
      if( s < 10 ) t += "0";
      t += s;
      $('#timer').text(t);
      if( s == 0 ) {
        endTimer();
	document.getElementById('horn').play();
      }
    }
  }, 1000);
}

function endTimer() {

  if( iv !== false ) {
    $('#timer').text("");
    clearInterval(iv);
    iv = false;
  }
}
