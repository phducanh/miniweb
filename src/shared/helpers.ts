export const removeEmpty = (obj: { [key: string]: string }) => {
  Object.entries(obj).forEach(([key, val]) => {
    if (val && typeof val === 'object') removeEmpty(val)
    else if (val == null) delete obj[key]
  })
}

export const getLocationFromUrl = (url: string) => {
  if (typeof window !== 'undefined' && !!window?.document) {
    const location = document.createElement('a')
    location.href = url
    return location
  }
  return null
}
