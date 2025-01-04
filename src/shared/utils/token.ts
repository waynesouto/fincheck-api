import { env } from '@utils/env'

const suffix = env.NODE_ENV === 'production' ? '' : '-homolog'
const namespace = '@fincheck'

export const accessTokenCookieName = `${namespace}:access-token${suffix}`
export const refreshTokenCookieName = `${namespace}:refresh-token${suffix}`
export const isAuthenticatedCookieName = `${namespace}:is-authenticated${suffix}`