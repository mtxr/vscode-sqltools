import * as React from 'react'
import { SFC } from 'react'
import { useConfig } from 'docz'
import styled from 'styled-components'
import { Hash } from 'react-feather';

const Icon = styled<any>(Hash)`
  position: absolute;
  display: inline-block;
  top: 11px;
  left: -28px;
  opacity: 0;
  transition: opacity 0.2s;
  color: ${(props: any) => props.theme.docz.colors.primary};
`

const Heading: any = styled.h3`
  position: relative;

  &:hover .heading--Icon {
    opacity: 1;
  }

  ${(props: any) => props.theme.docz.styles.h3};

  > a {
    text-decoration: none;
    color: inherit;
    &:hover {
      text-decoration: underline;
    }
  }
  svg {
    top: 5px;
  }
`
const versionRegEx = /^\s*(v(\d+\.\d+\.\d+|[^\s]+)).*/gi;

const H3: SFC<React.HTMLAttributes<any>> = ({ children, id: calculatedId, ...props }) => {
  const pathname = typeof window !== 'undefined' ? location.pathname : '/'
  const { linkComponent: Link } = useConfig()
  let id = calculatedId;
  if (typeof children === 'string' && versionRegEx.test(children)) {
    id = children.replace(versionRegEx, '$1').replace(/[^\w]/g, '-');
  }
  if (!Link) return null;
  return (
    <Heading {...props} id={id}>
      <Link aria-hidden to={`${pathname}#${id}`}>
        <Icon className="heading--Icon" height={20} />
        {children}
      </Link>
    </Heading>
  )
}
export default H3;