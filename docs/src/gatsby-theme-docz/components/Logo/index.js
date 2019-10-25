/** @jsx jsx */
import { jsx, Flex } from 'theme-ui'
import { Link } from 'docz'

const logo = {
  lineHeight: 0,
  img: {
    maxHeight: '2em',
  }
}

export const Logo = () => {
  return (
    <Flex aligmItems="center" sx={logo}>
      <Link to="/">
        <img src={`https://raw.githubusercontent.com/mtxr/vscode-sqltools/master/static/header-hero-dark.svg?sanitize=true`} />
      </Link>
    </Flex>
  )
}
