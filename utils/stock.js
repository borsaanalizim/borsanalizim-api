
function getSingleStockCodeString(str) {
    if (str == 'ISATR, ISBTR, ISCTR, ISKUR, TIB') {
        return 'ISCTR'
    } else if (str == 'KRDMA, KRDMB, KRDMD') {
        return 'KRDMD'
    } else {
        const items = str.split(',').map(item => item.trim());
        return items.find(item => item.length >= 4 && item.length <=6);
    }
}

module.exports = { getSingleStockCodeString }