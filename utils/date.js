const moment = require('moment')
const momentTimeZone = require("moment-timezone")

function nowYear(timeZone = 'Europe/Istanbul') {
    try {
        const now = momentTimeZone.tz(timeZone)
        return now.year()
    } catch (error) {
        return null
    }
}

function formatDate(date, fromPattern = 'DD.MM.YY HH:mm', toPattern = 'YYYY-MM-DDTHH:mm:ssZ', timeZone = 'Europe/Istanbul') {
    try {
        return momentTimeZone.tz(date, fromPattern, timeZone).format(toPattern)
    } catch (error) {
        return null
    }
}

function formatDateFromTimestamp(timestamp, toPattern = 'YYYY-MM-DD') {
    try {
        const date = new Date(timestamp)
        return moment(date).utc(true).format(toPattern)
    } catch (error) {
        return null
    }
}

function formatDateOfSpecial(dateString, format = 'YYYY-MM-DDTHH:mm:ssZ') {
    if (!dateString) {
        return null;
    }

    if (dateString.includes("Bugün")) {
        const timeMatch = dateString.match(/(\d{2}:\d{2})/)
        const time = timeMatch[1]
        const isoDate = moment().set({
            hour: parseInt(time.split(":")[0], 10),
            minute: parseInt(time.split(":")[1], 10),
            second: 0,
            millisecond: 0
        }).format(format)
        return isoDate
    } else if (dateString.includes("Dün")) {
        const timeMatch = dateString.match(/(\d{2}:\d{2})/)
        const time = timeMatch[1]
        const date = moment().subtract(1, 'day')
        const isoDate = date.set({
            hour: parseInt(time.split(":")[0], 10),
            minute: parseInt(time.split(":")[1], 10),
            second: 0,
            millisecond: 0
        }).format(format)
        return isoDate
    } else {
        return formatDate(dateString)
    }
}

module.exports = { formatDate, nowYear, formatDateFromTimestamp, formatDateOfSpecial }