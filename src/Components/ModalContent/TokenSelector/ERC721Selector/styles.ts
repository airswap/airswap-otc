import styled from 'styled-components'

import { Flex } from '../../../../elements/Flex'

interface ColorProps {
  color?: string
}

export const ERC721SelectorContainer = styled(Flex)`
  padding: 80px 20px 30px 20px;
  width: 400px;
  height: 500px;
  position: relative;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.sm[1]}px`}) {
    width: 100%;
    height: auto;
  }
`

export const NavigationContainer = styled(Flex).attrs({
  expand: true,
  justify: 'space-between',
  direction: 'row',
})`
  position: absolute;
  padding: 20px;
  top: 0;
  left: 0;
`

export const BackButton = styled(Flex).attrs({
  direction: 'row',
})`
  cursor: pointer;
  color: black;
  opacity: 0.25;

  svg {
    path {
      stroke: black;
    }
  }
`

export const SearchContainer = styled(Flex).attrs({
  expand: true,
  direction: 'row',
  justify: 'space-between',
})<ColorProps>`
  height: 45px;
  padding: 0 20px;
  background-color: #f7f7f7;
  border-radius: 30px;

  input {
    flex-grow: 1;
  }

  svg {
    cursor: pointer;

    path {
      stroke: ${({ color, theme }) => color || theme.palette.primaryColor};
    }
  }
`

export const SearchForm = styled.form`
  width: 100%;
`

interface StatusContainerProps {
  justify?: 'center' | 'space-between'
}

export const StatusContainer = styled(Flex).attrs({
  expand: true,
})<StatusContainerProps>`
  justify-content: ${({ justify }) => justify};
  flex-grow: 1;
`

interface ClickableProps {
  clickable?: boolean
}

export const IconContainer = styled(Flex).attrs({
  align: 'center',
  justify: 'center',
})<ClickableProps>`
  border-radius: 50%;
  position: absolute;
  background-color: ${({ theme }) => `${theme.palette.primaryColor}1A`};
  width: 60px;
  height: 60px;
  cursor: ${({ clickable }) => (clickable ? 'pointer' : 'default')};
`

export const ERC721Image = styled.img`
  height: 150px;
  max-width: 200px;
`

export const SelectButtonContainer = styled(Flex).attrs({
  expand: true,
  direction: 'row',
})`
  padding: 0 20px;

  button {
    width: 50%;
  }
`

export const ERC721Description = styled(Flex)`
  width: 100%;
  padding: 0 40px;
`
