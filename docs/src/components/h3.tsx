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

  svg {
    top: 5px;
  }
`

const H3: SFC<React.HTMLAttributes<any>> = ({ children, ...props }) => {
  const pathname = typeof window !== 'undefined' ? location.pathname : '/'
  const { linkComponent: Link } = useConfig()
  if (!Link) return null
  return (
    <Heading {...props}>
      <Link aria-hidden to={`${pathname}#${props.id}`}>
        <Icon className="heading--Icon" height={20} />
      </Link>
      {children}
    </Heading>
  )
}
export default H3;