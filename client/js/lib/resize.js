var resizeConfig = {
  div : document.getElementById('leader-main-container'),
  header : document.getElementById('header'),
  footer: document.getElementById('footer'),
  delay : 250, // delay between calls
  throttled : false, // are we currently throttled?
  calls : 0
}

// window.resize callback function
function setDimensions() {
  resizeConfig.div.style.height = (window.innerHeight - header.scrollHeight - footer.scrollHeight) + 'px';
  resizeConfig.calls += 1;
}

// window.resize event listener
window.addEventListener('resize', function() {
    // only run if we're not throttled
  if (!resizeConfig.throttled) {
    // actual callback action
    setDimensions();
    // we're throttled!
    resizeConfig.throttled = true;
    // set a timeout to un-throttle
    setTimeout(function() {
      resizeConfig.throttled = false;
    }, resizeConfig.delay);
  }
});
