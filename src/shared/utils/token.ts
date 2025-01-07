import { env } from '@utils/env'

const suffix = env.NODE_ENV === 'production' ? '' : '-homolog'
const namespace = '@fincheck'

export const cookiesKeys = {
	ACCESS_TOKEN: `${namespace}:access-token${suffix}`,
	REFRESH_TOKEN: `${namespace}:refresh-token${suffix}`,
	IS_AUTHENTICATED: `${namespace}:is-authenticated${suffix}`
}