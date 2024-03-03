export function addParam(url, name, value) {
    if (url && url.indexOf('?') > 0) {
        if (url.endsWith('?')) {
            return url + name + '=' + value
        } else {
            return url + '&' + name + '=' + value
        }
    } else if (url) {
        return url + '?' + name + '=' + value
    } else {
        return '?' + name + '=' + value
    }
}