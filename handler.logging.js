const LOG_TYPE = {
    ERROR: '#ff0066',
    WARNING: '#e65c00',
    REGULAR: '#c7c7c7',
    TRIVIAL: '#999999',
    INFORMATION: '#7b9bfdff',
    SUCCESS: '#33ff0041',
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