const moment = require("moment-timezone")

function nowYear(timeZone = 'Europe/Istanbul') {
    try {
        const now = moment.tz(timeZone)
        return now.year()
    } catch (error) {
        return null
    }
}

function formatDate(date, fromPattern = 'DD.MM.YY HH:mm', toPattern = 'YYYY-MM-DDTHH:mm:ssZ', timeZone = 'Europe/Istanbul') {
    try {
        return moment.tz(date, fromPattern, timeZone).format(toPattern)
    } catch (error) {
        return null
    }
}

module.exports = { formatDate, nowYear }