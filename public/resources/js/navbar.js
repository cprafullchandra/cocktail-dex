/**
 * Name: navRespond
 * Params: none
 * Return: undefined
 * Details: Adds collapsable behavior to the global navbar upon clicking the hamburger menu icon
 */
function navRespond() {
  var nav = $('#globalnav');
  if(nav.hasClass('responsive')) {
    nav.removeClass('responsive');
  } else {
    nav.addClass('responsive');
  }
}
