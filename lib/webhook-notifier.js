const https = require('https');
const URI = require('@fiverr/futile/lib/uri');

module.exports = function webhookNotifier(data) {
    return new Promise((resolve, reject) => {
        const webhook = process.env.NOTIFY_WEBHOOK || process.env.SLACK_WEBHOOK;

        if (!webhook) {
            resolve();
            return;
        }

        const json = JSON.stringify(data);
        const uri = new URI(webhook)
        const options = {
            hostname: uri.host,
            port: 443,
            path: uri.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('end', () => {
                resolve();
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(json);
        req.end();
    });
};
