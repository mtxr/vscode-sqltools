window.__codefundDisabled = true;
window.__carbonDisabled = false;
var prevHref = '';
var id = 'codefund';
var index = 0;

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
  if (window.__codefundDisabled) return;
  try {
    var el = document.getElementById(id);
    if (!el) return;
    id = 'codefund-' + index;
    el.id = id;
    var srcript = document.getElementById('codefund-src');
    srcript.remove();
    loadScript('https://app.codefund.io/properties/684/funder.js?target=codefund-' + index, 'codefund-src', document.body);
    index++;
  }
  catch (error) {
    console.log(error);
  }
};

function adCarbon(props) {
  if (window.__carbonDisabled) return;
  try {
    var el = document.getElementById('carbon-ad');
    if (!el) return;
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

(function(w) {
  w.addEventListener('pagechanged', function(
    /** @type {CustomEvent} */
    event
  ) {
    checkLocation(event.detail)
  });
  w.addEventListener('docs-loaded', function(event) {
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
    }
  })
})(window);