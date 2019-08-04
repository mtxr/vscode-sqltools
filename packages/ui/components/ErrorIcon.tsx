import React from 'react';

export default () => (
  <div
    style={{ width: '50px', height: '50px'}}
    dangerouslySetInnerHTML={{
      __html: `
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 426.667 426.667" style="enable-background:new 0 0 426.667 426.667; width: 100%; height: 100%;" xml:space="preserve">
  <path style="fill:#F05228;" d="M213.333,0C95.514,0,0,95.514,0,213.333s95.514,213.333,213.333,213.333
    s213.333-95.514,213.333-213.333S331.153,0,213.333,0z M330.995,276.689l-54.302,54.306l-63.36-63.356l-63.36,63.36l-54.302-54.31
    l63.356-63.356l-63.356-63.36l54.302-54.302l63.36,63.356l63.36-63.356l54.302,54.302l-63.356,63.36L330.995,276.689z"/>
</svg>
`,
    }}
  />
);
