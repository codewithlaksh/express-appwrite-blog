const moment = require('moment-timezone')

module.exports = {
    formatDate: function (date) {
        return moment(date).tz('Asia/Kolkata').fromNow();
    }
}
