window.__carbonEnabled = typeof window.__carbonEnabled === 'undefined' ? true : window.__carbonEnabled;
window.__codefundEnabled = typeof window.__codefundEnabled === 'undefined' ? false : window.__codefundEnabled;

(function(w) {
  var prevHref = '';
  var codefundId = 'codefund';
  var codefundIndex = 0;
  console.log('loaded!');
  function loadScript(src, id, position) {
    var script = document.createElement('script');
    script.setAttribute('async', '');
    script.type = 'text/javascript';
    script.src = src;
    script.id = id;
    position.appendChild(script);
  
    return script;
  }
  
  function adCodeFund(props) {
    if (!window.__codefundEnabled) return;
    try {
      var el = document.getElementById(codefundId);
      if (el) el.remove();
      var script = document.getElementById('codefund-src');
      if (script) script.remove();
  
      codefundId = 'codefund-' + codefundIndex;
      el = document.createElement('div');
      el.id = codefundId;
      document.body.appendChild(el);
      loadScript('https://app.codefund.io/properties/684/funder.js?target=codefund-' + codefundIndex, 'codefund-src', document.body);
      codefundIndex++;
    }
    catch (error) {
      console.log(error);
    }
  };
  
  function adCarbon(props) {
    if (!window.__carbonEnabled) return;
    try {
      var el = document.getElementById('inplace-allowed');
      if (!el) return;
      el.innerHTML = '';
      loadScript('//cdn.carbonads.com/carbon.js?serve=CE7ITK3L&placement=vscode-sqltoolsmteixeiradev', '_carbonads_js', el);
    } catch (error) {
      console.log(error);
    }
  }
  
  function checkLocation(props) {
    if (prevHref && props.location.href === prevHref) return;
    setTimeout(() => {
      prevHref = props.location.href;
      adCarbon(props);
      adCodeFund(props);
    }, 500);
  }
  window.addEventListener('pagechanged', function(
    /** @type {CustomEvent} */
    event
  ) {
    console.log('pagechanged');
    checkLocation(event.detail)
  });
  window.addEventListener('docs-loaded', function(event) {
    var prevOnLoad = window.onload;
    window.onload = function() {
      prevOnLoad && prevOnLoad.apply(window, arguments);
      setTimeout(() => {
        try {
          if (!window.location.hash) return;
          var el = document.getElementById(window.location.hash.substr(1));
          el.scrollIntoView({
            behavior: 'smooth',
          });
        } catch (error) {}
      }, 1000);
      checkLocation(window.location);
    }
  })
})();