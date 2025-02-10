import { createDom } from './dom';

export function setShadow(model, context) {
  const el = model.cfg.el;
  const attrs = model.attr();
  const cfg = {
    dx: attrs.shadowOffsetX,
    dy: attrs.shadowOffsetY,
    blur: attrs.shadowBlur,
    color: attrs.shadowColor,
  };
  if (!cfg.dx && !cfg.dy && !cfg.blur && !cfg.color) {
    el.removeAttribute('filter');
  } else {
    let id = context.find('filter', cfg);
    if (!id) {
      id = context.addShadow(cfg);
    }
    el.setAttribute('filter', `url(#${id})`);
  }
}

export function setTransform(model) {
  const { matrix } = model.attr();
  if (matrix) {
    const el = model.cfg.el;
    let transform: any = [];
    for (let i = 0; i < 9; i += 3) {
      transform.push(`${matrix[i]},${matrix[i + 1]}`);
    }
    transform = transform.join(',');
    if (transform.indexOf('NaN') === -1) {
      el.setAttribute('transform', `matrix(${transform})`);
    } else {
      console.warn('invalid matrix:', matrix);
    }
  }
}

export function setClip(model, context) {
  const clip = model.getClip();
  const el = model.get('el');
  if (!clip) {
    el.removeAttribute('clip-path');
  } else if (clip && !el.hasAttribute('clip-path')) {
    createDom(clip);
    clip.createPath(context);
    const id = context.addClip(clip);
    el.setAttribute('clip-path', `url(#${id})`);
  }
}
