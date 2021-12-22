import React from 'react'
import styled from 'styled-components'

import { Flex } from '../../../elements/Flex'
import Input, { InputSize, InputVariant } from '../../../elements/Input'
import { ReactComponent as SearchIcon } from '../../../static/search-icon.svg'

interface ColorProps {
  color?: string
}

const SearchIconContainer = styled(Flex)<ColorProps>`
  margin-right: 10px;

  svg {
    width: 20px;

    path {
      stroke: ${({ color, theme }) => color || theme.palette.primaryColor};
    }
  }
`

const TokenSearchContainer = styled(Flex).attrs({
  direction: 'row',
})`
  width: calc(100% - 60px);
  padding: 0 20px;
  margin: 0 30px;
  margin-bottom: 10px;
  border-radius: 30px;
  background-color: ${({ theme }) => theme.colors.gray[3]};

  input {
    height: 45px;
  }
`

interface TokenSearchProps {
  iconColor?: string
  value: string
  onChange(value: string): void
}

export default function TokenSearch(props: TokenSearchProps) {
  return (
    <TokenSearchContainer>
      <SearchIconContainer color={props.iconColor}>
        <SearchIcon />
      </SearchIconContainer>
      <Input
        dataTest="token-selector-search-input"
        placeholder="Search token by name, symbol or address"
        autoFocus
        expand
        value={props.value}
        size={InputSize.SMALL}
        onChange={props.onChange}
        variant={InputVariant.BLANK}
      />
    </TokenSearchContainer>
  )
}
