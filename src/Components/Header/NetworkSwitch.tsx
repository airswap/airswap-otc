// @flow
import { MAIN_ID, NETWORK_MAPPING, RINKEBY_ID } from 'airswap.js/src/constants'
import queryString from 'query-string'
import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'

import { REACT_APP_ENVIRONMENT } from '../../constants'
import { Flex } from '../../elements/Flex'
import MediaQuery from '../../elements/MediaQueryWrapper'
import { BaseText, H8 } from '../../elements/Typography'

const NetworkSwitchContainer = styled(Flex).attrs({ justify: 'center' })`
  position: relative;
  padding: 11px 20px;
  border-radius: 20px;
  transition: 0.4s;
  cursor: pointer;
  background-color: ${({ theme }) => theme.palette.primaryColor}1A;
  color: ${({ theme }) => theme.palette.primaryColor};

  &:hover {
    background-color: ${({ theme }) => theme.palette.primaryColor};
    color: white;
  }
`

const HeaderText = styled(H8)`
  cursor: pointer;

  @media (max-width: 767px) {
    margin-top: 10px;
  }
`

const DropdownContainer = styled(Flex)`
  width: 120px;
  position: absolute;
  z-index: 2;
  background-color: white;
  border-color: ${({ theme }) => theme.palette.borderColor};
  border-width: ${({ theme }) => theme.line.weight.light};
  box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 10px 0;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
`

const DropdownItem = styled(Flex).attrs({ expand: true })`
  padding: 10px;
  background-color: white;
  transition: 0.4s;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`

const DropdownItemText = styled(BaseText)`
  font-size: 14px;
  color: black;
`

export default function NetworkSwitch() {
  const toggleRef = useRef<HTMLDivElement>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [network, setNetwork] = useState(REACT_APP_ENVIRONMENT === 'production' ? MAIN_ID : RINKEBY_ID)
  const location = useLocation()
  const query = queryString.parse(location.hash, { arrayFormat: 'comma' })

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const selectNetwork = value => {
    setDropdownOpen(false)
    query.network = value
    window.location.href = `${location.pathname}#${queryString.stringify(query)}`
    window.location.reload()
  }

  const handleClickOutside = e => {
    if (toggleRef.current && !toggleRef.current.contains(e.target)) {
      setDropdownOpen(false)
    }
  }

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside, false)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside, false)
  }, [dropdownOpen])

  useEffect(() => {
    if (query.network) {
      setNetwork(query.network)
    }
  }, [query.network])

  return (
    <NetworkSwitchContainer ref={toggleRef} onClick={toggleDropdown}>
      <MediaQuery size="md-up">
        <Flex direction="row">
          <HeaderText>{NETWORK_MAPPING[network]}</HeaderText>
        </Flex>
      </MediaQuery>
      {dropdownOpen && (
        <DropdownContainer>
          {Object.keys(NETWORK_MAPPING).map(value => (
            <DropdownItem key={value} onClick={() => selectNetwork(value)}>
              <DropdownItemText>{NETWORK_MAPPING[value]}</DropdownItemText>
            </DropdownItem>
          ))}
        </DropdownContainer>
      )}
    </NetworkSwitchContainer>
  )
}
