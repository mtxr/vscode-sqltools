let prevHref: string = '';
let id = 'codefund';
let index = 0;

function loadScript(src: string, id: string, position: HTMLElement) {
  const script = document.createElement('script');
  script.setAttribute('async', '');
  script.type = 'text/javascript';
  script.src = src;
  script.id = id;
  position.appendChild(script);

  return script;
}

const adCodeFund = (props: any) => {
  try {
    const el = document.getElementById(id);
    if (!el) return;
    id = `codefund-${index}`
    el.id = id;
    const srcript = document.getElementById('codefund-src');
    (srcript as any).remove();
    loadScript(`https://app.codefund.io/properties/684/funder.js?target=codefund-${index}`, 'codefund-src', document.body);
    index++;
  }
  catch (error) {
    console.log(error);
  }
};

const adCarbon = (props: any) => {
  try {
    const el = document.getElementById('carbon-ad');
    if (!el) return;
    loadScript('//cdn.carbonads.com/carbon.js?serve=CE7ITK3L&placement=vscode-sqltoolsmteixeiradev', '_carbonads_js', el);
  } catch (error) {
    console.log(error);
  }
}

const checkLocation = (props: any) => {
  if (prevHref && props.location.href === prevHref) return;
  setTimeout(() => {
    prevHref = props.location.href;
    adCodeFund(props);
    adCarbon(props);
  }, 500);
}

export default checkLocation;