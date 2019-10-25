/** @jsx jsx */
import { jsx } from 'theme-ui'

const heading = Tag => {
  const Component = props => {
    return !!props.id ? (
      <Tag {...props}>
        <a
          href={`#${props.id}`}
          sx={{
            color: 'inherit',
            textDecoration: 'none',
            position: 'relative',
            ':hover': {
              textDecoration: 'underline',
              '> svg': {
                opacity: 1
              }
            },
            '> svg': {
              opacity: 0,
              transition: 'all 0.15s ease',
              fill: 'primary',
              marginLeft: -2,
              position: 'absolute',
              top: '50%',
              right: '100%',
              marginRight: '8px',
              transform: 'translateY(-50%)',
              height: '0.8em',
              width: '0.8em',
            }
          }}
        >
          <svg aria-hidden="true" height="20" version="1.1" viewBox="0 0 16 16" width="20"><path fillRule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>
          {props.children}
        </a>
      </Tag>
    ) : (
      <Tag {...props} />
    )
  }

  Component.displayName = Tag
  return Component
}

export const h1 = heading('h1');
export const h2 = heading('h2');
export const h3 = heading('h3');
export const h4 = heading('h4');
export const h5 = heading('h5');
export const h6 = heading('h6');
