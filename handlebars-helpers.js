const handlebars = require('handlebars');

handlebars.registerHelper('isFutureDate', function (timestamp) {
    const now = new Date().getTime();
    return new handlebars.SafeString(new Date(timestamp).getTime() > now);
});

handlebars.registerHelper('eq', function (a, b) {
    return a === b;
});

handlebars.registerHelper('formatTimer', function (timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
});

handlebars.registerHelper('formatDuration', function (start, end) {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const duration = endTime - startTime;
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
});

module.exports = handlebars.helpers;
