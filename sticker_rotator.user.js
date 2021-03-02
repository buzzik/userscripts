// ==UserScript==
// @name         Sticker Rotation
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://URL/*
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';

    function waitForElement(selector) {
        return new Promise(function(resolve, reject) {
            var element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    var nodes = Array.from(mutation.addedNodes);
                    for (var node of nodes) {
                        if (node.matches && node.matches(selector)) {
                            observer.disconnect();
                            resolve(node);
                            return;
                        }
                    };
                });
            });
            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        });
    }
    class StickerRotator {
        constructor() {
            this.cookieName = "";
            this.storageName = "stickerRotation";
            this.storageString = localStorage.getItem(this.storageName);
            this.storageArray = this.storageString ? JSON.parse(localStorage.getItem(this.storageName)) : [];
            this.autostartFlagStorage = "rotateActive";
            this.aotustartFlag = localStorage.getItem(this.autostartFlagStorage);
            this.cookiePrefix = "sticker_showed_";
            this.stickerCrossSelector = "#sticker_place > div.icon.icon_cross";
            this.stickerSelector = "#sticker_place .sticker";
            this.sticker = null;
            this.stickerCross = null;
            this.stickerEvent = null;
            this.stickerId = null;
        }
        init() {
            this.sticker = document.querySelector(this.stickerSelector);
            this.stickerCross = document.querySelector(this.stickerCrossSelector);
            this.stickerEvent = this.sticker.dataset.link;
            this.stickerId = this.sticker.dataset.sticker_id;
            this.startRotation();
        }
        setAutostart(state) {
            if (state) {
                localStorage.setItem(this.autostartFlagStorage, "1");
            } else {
                localStorage.removeItem(this.autostartFlagStorage);
                this.clearCookies();

            }
        }
        printResult() {
            let string = JSON.stringify(this.storageArray);
            window.prompt('Ротация стикеров', string);
            console.log(string);
        }
        clearStorage() {
            localStorage.removeItem(this.storageName);
            console.log("Location Storage cleared");
        }
        updateStorage(array) {
            let string = JSON.stringify(array);
            localStorage.setItem(this.storageName, string);
            console.log("Location Storage updated");
        }
        getCookie() {
            let matches = document.cookie.match(new RegExp(
                "(?:^|; )" + this.cookiePrefix + "\\d{2,}=([^;]*)"
            ));
            return matches ? decodeURIComponent(matches[1]) : undefined;
        }
        startRotation() {
            let stickerObj = {
                "event": this.stickerEvent,
                "stickerId": this.stickerId
            };
            console.log(`Type: ${this.stickerEvent}; Sticker_id: ${this.stickerId}`);
            this.stickerCross.click();
            this.storageArray.push(stickerObj);
            this.updateStorage(this.storageArray);
            this.clearCookies();
            location.reload();
        }
        stopRotation() {
            this.setAutostart(false);
            this.printResult();
            this.clearStorage();
            this.storageArray = [];
            location.reload();
        }
        clearCookies() {
            let reg = new RegExp(this.cookiePrefix + "\\d{1,}", "g");
            while (reg.test(document.cookie)) {
                let options = {
                    path: '/',
                    'max-age': -1,
                };

                if (options.expires instanceof Date) {
                    options.expires = options.expires.toUTCString();
                }
                let matches = document.cookie.match(new RegExp(
                    "(?:^|; )(" + this.cookiePrefix + "\\d{1,})=([^;]*)"
                ));
                let name = matches[1];
                let value = "";
                let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
                for (let optionKey in options) {
                    updatedCookie += "; " + optionKey;
                    let optionValue = options[optionKey];
                    if (optionValue !== true) {
                        updatedCookie += "=" + optionValue;
                    }
                }
                document.cookie = updatedCookie;
            }
            console.log("Cookies cleared");
        }

    }

    let stickerRotator = new StickerRotator();

    if (stickerRotator.aotustartFlag) {
        waitForElement(stickerRotator.stickerCrossSelector).then(function(element) {
            console.log("Element Added", element);
            if (stickerRotator.aotustartFlag) {
                stickerRotator.init();
            }
        });
    }

    GM_registerMenuCommand(
        "Start",
        function() {
            stickerRotator.setAutostart(true);
            stickerRotator.init();
        },
        "r"
    );
    GM_registerMenuCommand(
        "Stop",
        function() {
            stickerRotator.stopRotation();
        },
        "r"
    );
    GM_registerMenuCommand(
        "Clear Local Storage",
        function() {
            stickerRotator.clearStorage();
        },
        "r"
    );
    GM_registerMenuCommand(
        "Clear Cookies",
        function() {
            stickerRotator.clearCookies();

        },
        "r"
    );

})();