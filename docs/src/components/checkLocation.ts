let prevHref: string = '';
let id = 'codefund';
let index = 0;
const checkLocation = (props: any) => {
  try {
    console.log(props.location.href, prevHref, props.location);
    if (props.location.href === prevHref) return;
    prevHref = props.location.href;
    const el = document.getElementById(id);
    console.log(id, el);
    if (!el) return;
    id = `codefund-${index}`
    el.id = id;
    const srcript = document.getElementById('codefund-src');
    (srcript as any).remove();
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = `https://app.codefund.io/properties/684/funder.js?target=codefund-${index}`;
    s.id = 'codefund-src';
    s.async = true;
    document.body.appendChild(s);
    index++;
  }
  catch (error) {
    console.log(error);
  }
};

export default checkLocation;