export type ApiError = {
  status: number
  message: string
}

export function isApiError(err: unknown): err is ApiError {
  if (typeof err !== 'object' || err === null) return false
  if (!('status' in err) || !('message' in err)) return false

  const status = (err as { status: unknown }).status
  const message = (err as { message: unknown }).message

  return typeof status === 'number' && typeof message === 'string'
}

export function getErrorMessage(err: unknown): string {
  if (isApiError(err)) {
    if (err.status >= 500) return 'Server Error. Please try again later.'

    switch (err.status) {
      case 401:
        return 'Unauthorized. Please log in again.'
      case 403:
        return 'Forbidden. You do not have permission to access this resource.'
      case 404:
        return 'Not Found. The requested resource could not be found.'
      default:
        return `Error ${err.status}: ${err.message}`
    }
  }

  if (err instanceof Error) return err.message

  return 'Something went wrong.'
}
