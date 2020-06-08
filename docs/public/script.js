(function(w, adTagId, dl) {
  var CODEFUND = 1
  var CARBON = 2
  function setProvider(provider) {
    w['__adprovider'] = typeof provider === 'number' && [CODEFUND, CARBON].indexOf(provider) !== -1 ? provider : CODEFUND;
    log('set provider', w['__adprovider'])
  }
  function log() {
    if (!window.localStorage || !localStorage.getItem('ad_debug')) return
    console.log.apply(console.log, [].concat.apply([''], arguments))
  }
  function reg() {
    dl.push({
      event: 'ad-render',
      adProvider: w['__adprovider']
    })
  }
  setProvider(typeof w['__adprovider'] !== 'undefined' ? w['__adprovider'] : CODEFUND)
  var prevHref = ''
  var cfAttempt = 0
  function loadScript(src, id, position) {
    var script = document.createElement('script')
    script.setAttribute('async', '')
    script.type = 'text/javascript'
    script.src = src
    script.id = id
    position.appendChild(script)
    return script
  }
  function getTagEl(tag, appendTo) {
    var el = document.getElementById(adTagId)
    if (el) return el;
    el = (document.getElementById(adTagId) || document.createElement(tag || 'div'))
    el.id = adTagId;
    (appendTo || document.body).appendChild(el);
    return el
  }

  function clearTag(selector) {
    var nodes = document.querySelectorAll(selector)
    for(var i = 0; i < nodes.length; i++) {
      nodes[i].innerHTML = ''
    }
  }

  function renderCodefund() {
    try {
      log('render Codefund')
      var script = document.getElementById('codefund-src')
      if (script) script.remove()
      getTagEl().style.opacity = '0';
      loadScript('https://app.codefund.io/properties/684/funder.js?target=' + adTagId, 'codefund-src', document.body)
    }
    catch (error) {log(error);}
  }

  function renderCarbon() {
    try {
      log('render Carbon')
      var el = getTagEl()
      el.removeAttribute('style')
      loadScript('//cdn.carbonads.com/carbon.js?serve=CE7ITK3L&placement=vscode-sqltoolsmteixeiradev', '_carbonads_js', el)
      reg()
    } catch (error) {log(error);}
  }

  var timerRender = 0;
  function renderAd() {
    clearTag('#' + adTagId)
    prevHref = location.href
    if (w['__adprovider'] === CARBON) return renderCarbon()
    renderCodefund()
    timerRender = 0;
  }

  var locationTimeout
  function pageChanged(event) {
    var l = (event.detail || w).location
    if (prevHref && l.href === prevHref) return
    log('location changed')
    clearTimeout(locationTimeout)
    setTimeout(renderAd, 250)
  }

  var prevOnLoad = w.onload
  w.addEventListener('codefund', function(evt) {
    log('codefund', evt['detail'])
    var status = evt['detail'].status;
    var inHouse = evt['detail'].house;
    if (status === 'ok' && (
      !inHouse
      || (inHouse && Math.random() > 0.7)
    )) {
      getTagEl().removeAttribute('style')
      reg()
      return cfAttempt = 0;
    }

    cfAttempt++;
    if (cfAttempt >= 3) setProvider(CARBON)
    setTimeout(renderAd, 250)
  });
  w.onload = function() {
    log('window loaded')
    setProvider(Math.random() <= 0.7 ? CODEFUND : CARBON)
    w.addEventListener('pagechanged', pageChanged)
    pageChanged(w)
    setInterval(function() {
      if (timerRender < 36) return ++timerRender;
      renderAd();
    }, 10000);
    prevOnLoad && prevOnLoad.apply(w, arguments)
    setTimeout(function() {
      if (!location.hash) return
      var el = document.getElementById(location.hash.substr(1))
      if (!el) return
      try {
        el.scrollIntoView({ behavior: 'smooth' })
      } catch (error) {
        document.querySelector('[class^=Page__Wrapper]').scrollTop = el.offsetTop
      }
    }, 300)
  }
})(window, 'btfixedad', window['dataLayer']);