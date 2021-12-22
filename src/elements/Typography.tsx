import styled from 'styled-components'

interface TypographyProps {
  weight?: number | string
  opacity?: number
  textAlign?: 'left' | 'center' | 'right'
  display?: 'block' | 'inline' | 'inline-block' | 'inline-flex'
  fit?: boolean
  decoration?: string
}

const BaseText = styled.p<TypographyProps>`
  font-weight: ${({ weight }) => weight || 'normal'};
  font-family: ${({ theme }) => theme.text.fontFamily};
  text-decoration: ${({ decoration }) => decoration || 'none'};
  opacity: ${({ opacity }) => opacity || 1};
  width: ${({ fit }) => (fit ? 'auto' : '100%')};
  text-align: ${({ textAlign }) => textAlign || 'center'};
  color: ${({ color }) => color || 'inherit'};
  display: ${({ display }) => display || 'auto'};
  cursor: inherit;
`

const H1 = styled(BaseText)`
  font-size: ${({ theme }) => theme.text.fontSize.h1};
`

const H2 = styled(BaseText)`
  font-size: ${({ theme }) => theme.text.fontSize.h2};
`

const H3 = styled(BaseText)`
  font-size: ${({ theme }) => theme.text.fontSize.h3};
`

const H4 = styled(BaseText)`
  font-size: ${({ theme }) => theme.text.fontSize.h4};
  line-height: 24px;
`

const H5 = styled(BaseText)`
  font-size: ${({ theme }) => theme.text.fontSize.h5};
`

const H6 = styled(BaseText)`
  font-size: ${({ theme }) => theme.text.fontSize.h6};
  line-height: 20px;
`

const H7 = styled(BaseText)`
  font-size: ${({ theme }) => theme.text.fontSize.h7};
`

const H8 = styled(BaseText)`
  font-size: ${({ theme }) => theme.text.fontSize.h8};
  line-height: 16px;
`

const H9 = styled(BaseText)`
  font-size: ${({ theme }) => theme.text.fontSize.h9};
  line-height: 14px;
`

const H10 = styled(BaseText)`
  font-size: ${({ theme }) => theme.text.fontSize.h10};
  line-height: 10px;
`

const Callout = styled(H7)`
  color: ${({ theme }) => theme.palette.primaryColor};
  text-transform: uppercase;
  font-weight: ${({ theme }) => theme.text.fontWeight.medium};
`

export { BaseText, H1, H2, H3, H4, H5, H6, H7, H8, H9, H10, Callout }
