import { formatValidationMessage, Validator } from './index'

const RequiredValidator: Validator<string> = (value: string | number | null) => {
  const isValid = value !== null && `${value}`.length > 0
  if (isValid) return null

  return formatValidationMessage('Field cannot be empty', true)
}

export default RequiredValidator
