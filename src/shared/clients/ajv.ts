import Ajv from 'ajv'
import AjvKeywords from 'ajv-keywords'

export const ajv = new Ajv({
	removeAdditional: 'all',
	coerceTypes: 'array',
	useDefaults: true
})

AjvKeywords(ajv, 'transform')