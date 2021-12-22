import { formatValidationMessage, Validator } from './index'

const LengthValidator = (maxLength: number): Validator<string> => (value: string | null) => {
  if (!value || value.length <= maxLength) return null

  return formatValidationMessage(`Input length cannot be greater than ${maxLength}`, false)
}

export default LengthValidator
