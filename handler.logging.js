const LOG_TYPE = {
    ERROR: '#ff0066',
    WARNING: '#e65c00',
    REGULAR: '#c7c7c7',
    TRIVIAL: '#999999',
    INFORMATION: '#809fff',
    SUCCESS: '#93ff80ff',
    ALERT: '#ffff00'
}

// Writes a message to the console
/** 
 * @param {string} message 
 * @param {LOG_TYPE} logType
**/
function writeLog(message, logType = LOG_TYPE.REGULAR) {
    console.log('<font color="' + logType + '">' + message + "</font>");
}

module.exports = {
    LOG_TYPE,
    writeLog
}