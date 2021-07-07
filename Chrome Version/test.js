var single = function(e){console.log('single')},
    double = function(e){console.log('double')};

var makeDoubleClick = function(e) {

  var clicks = 0,
      timeout;

  return function (e) {

    clicks++;

    if (clicks == 1) {
      timeout = setTimeout(function () {
        single(e);
        clicks = 0;
      }, 250);
    } else {
      clearTimeout(timeout);
      double(e);
      clicks = 0;
    }
  };
}
document.getElementById('btnVanilla').addEventListener('click', makeDoubleClick(), false);