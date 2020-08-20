export const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const inRange = (x, a, b) => {
  return (b >= a && b <= a + x) || (b <= a && b >= a - x)
}

export const setCookie = (name, value, daysToLive) => {
  // Encode value in order to escape semicolons, commas, and whitespace
  let cookie = name + '=' + encodeURIComponent(value)

  if (typeof daysToLive === 'number') {
    /* Sets the max-age attribute so that the cookie expires
      after the specified number of days */
    cookie += '; max-age=' + daysToLive * 24 * 60 * 60

    document.cookie = cookie
  }
}

export const getCookie = (name) => {
  // Split cookie string and get all individual name=value pairs in an array
  var cookieArr = document.cookie.split(';')

  // Loop through the array elements
  for (var i = 0; i < cookieArr.length; i++) {
    var cookiePair = cookieArr[i].split('=')

    /* Removing whitespace at the beginning of the cookie name
      and compare it with the given string */
    if (name == cookiePair[0].trim()) {
      // Decode the cookie value and return
      return decodeURIComponent(cookiePair[1])
    }
  }

  // Return null if not found
  return null
}
