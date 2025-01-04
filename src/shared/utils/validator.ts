import v, { BaseType, errors } from '@vinejs/vine'
import { ErrorReporterContract, FieldContext } from '@vinejs/vine/types'
import { BadRequestException } from '@utils/exception'

// configure a default error reporter
v.errorReporter = () => new ErrorReporter()

export const validator = async<T>(
	schema: BaseType<unknown, T, unknown>,
	data: T
): Promise<T> => {
	try {
		const validator = v.compile(schema.bail(false))
		return await validator.validate(data)
	} catch (error) {
		if (error instanceof errors.E_VALIDATION_ERROR) {
			throw new BadRequestException(error.messages)
		}
		throw new BadRequestException('Invalid data')
	}
}

class ErrorReporter implements ErrorReporterContract {
	hasErrors: boolean = false
	errors: string[] = []
	rule: string
	field: FieldContext
	args?: Record<string, unknown>

	report(message: string, rule: string, field: FieldContext, args?: Record<string, unknown>) {
		this.hasErrors = true
		this.errors.push(message)
		this.rule = rule
		this.field = field
		this.args = args
	}

	createError() {
		return new errors.E_VALIDATION_ERROR(this.errors.join(' | '))
	}
}
