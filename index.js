console.clear();
//#region require
let Parser = require('rss-parser');
var { DateTime } = require('luxon');
const { Webhook, MessageBuilder } = require('discord-webhook-node');
const { readFileSync, writeFileSync } = require('fs')
//#endregion

//#region variables
const settings = require('./settings.json');
const hook = new Webhook(settings.webhook_link);
//#endregion
async function checkRSS() {
    let parser = new Parser();
    let feed = await parser.parseURL(settings.rss_link);
    let item = feed.items[0];
    //meme jour
    if ('2021-05-08' == DateTime.fromISO(item.isoDate).toISODate()) {
        if (JSON.parse(readFileSync('./item.json', 'utf8')) != {}) {
            //item.json init
            if (DateTime.fromISO(item.isoDate).toISODate() != JSON.parse(readFileSync('./item.json', 'utf8')).date) {
                writeFileSync('./item.json', JSON.stringify({ date: DateTime.fromISO(item.isoDate).toISODate() }, '', '\t'), 'utf8')
                postDiscord(item)
                postFacebook(item)
                postTwitter(item)
            }
        } else {
            //pas init
            writeFileSync('./item.json', JSON.stringify({ date: DateTime.fromISO(item.isoDate).toISODate() }, '', '\t'), 'utf8')
            postDiscord(item)
            postFacebook(item)
            postTwitter(item)
        }
    }
}

setInterval(async function () { checkRSS() }, (settings.time_check) * 60000)

checkRSS()

function postDiscord(item) {
    const embed = new MessageBuilder()
        .setTitle(item.title)
        .setAuthor(item.creator || 'Aucun Créateur')
        .setDescription(item.content.replace('&quot;', '').replace('&quot;', ''));
    hook.send(embed);
}

function postTwitter(item) {

}

function postFacebook(item) {

}