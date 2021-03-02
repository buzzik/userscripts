// ==UserScript==
// @name         Instagramm unsub
// @version      0.98
// @description  try to take over the world!
// @author       You
// @match        https://www.instagram.com/p/*
// @grant      unsafeWindow
// @grant      GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';
    var liked = JSON.parse(localStorage.getItem("liked"));
    var toUnsub = JSON.parse(localStorage.getItem("toUnsub"));
    var unsubbed = JSON.parse(localStorage.getItem("unsubbed"));
    var delay403Time = 400000;
    var delay400Time = 4000000;
    liked = liked != null ? liked : [];
    toUnsub = toUnsub != null ? toUnsub : [];
    unsubbed = unsubbed != null ? unsubbed : [];
    var origOpen = XMLHttpRequest.prototype.open;
    var responseStatus = 0;
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener('load', function() {
            if (this.responseURL.includes('/web/friendships/')) {
                responseStatus = this.status;
                console.log('ответ по подписке -' + responseStatus);
            }
        });
        origOpen.apply(this, arguments);
    };


    GM_registerMenuCommand('Start unsubscribe (' + toUnsub.length + ")", function() {
        localStorage.setItem("unsubFlag", "true");
        setTimeout(init, 200);
    }, 'r');
    GM_registerMenuCommand('Download toUnsub (' + toUnsub.length + ")", function() {
        downloadObjectAsJson(toUnsub, "toUnsub");
    }, 'r');

    GM_registerMenuCommand('Merge with Liked (' + liked.length + ")", function() {
        concatLiked();
    }, 'r');
    GM_registerMenuCommand('Merge with Unsubbed (' + unsubbed.length + ")", function() {
        concatUnsubbed();
    }, 'r');
    GM_registerMenuCommand('Stop unsubscribe', function() {
        localStorage.setItem("unsubFlag", "false");
    }, 'r');

    var nextUrl, unsubFlag, toDelete, brokedLinks, unsubCount;
    unsubFlag = localStorage.getItem("unsubFlag");
    if (unsubFlag == "true") {
        init();
    };

    function init() {
        toUnsub = JSON.parse(localStorage.getItem("toUnsub")); //read liked posts urls from local storage
        unsubbed = JSON.parse(localStorage.getItem("unsubbed"));
        if (unsubbed == null) {
            unsubbed = [];
        };
        brokedLinks = JSON.parse(localStorage.getItem("brokedLinks"));
        if (brokedLinks == null) {
            brokedLinks = [];
        };
        unsubCount = localStorage.getItem("unsubCount");
        if (unsubCount == null) {
            unsubCount = 0;
        };
        if (toUnsub == null || toUnsub.length == 0) {
            console.log("no array");
            localStorage.setItem("unsubFlag", "false");
            return false;
        };
        nextUrl = toUnsub[0];
        console.log("nextUrl - " + nextUrl);
        console.log("location.href - " + location.href);
        setTimeout(unsub, 3000);
    }

    function concatLiked() {
        if (liked == null) {
            liked = []
        };
        if (toUnsub == null) {
            toUnsub = []
        };
        toUnsub = toUnsub.concat(liked);
        localStorage.setItem("toUnsub", JSON.stringify(toUnsub));
        liked = [];
        localStorage.setItem("liked", JSON.stringify(liked));
    }

    function concatUnsubbed() {
        if (toUnsub == null) {
            toUnsub = []
        };
        if (unsubbed == null) {
            unsubbed = []
        };
        toUnsub = toUnsub.concat(unsubbed);
        localStorage.setItem("toUnsub", JSON.stringify(toUnsub));
        unsubbed = [];
        localStorage.setItem("unsubbed", JSON.stringify(unsubbed));
    }

    function unsub() {
        console.log("unsub()");
        var unsubBtns = document.evaluate("//button[contains(., 'Подписки')]", document, null, XPathResult.ANY_TYPE, null);
        var unsubBtn = unsubBtns.iterateNext();
        if (unsubBtn != null) {
            unsubBtn.click();
            console.log("Кнопка отписки есть, кликаем");
            setTimeout(unsubConfirm, 1000);
        } else {
            console.log("Нет кнопки отписки, судя по всему уже отписывались, пропускаем");
            toDelete = toUnsub.shift();
            unsubbed.push(toDelete);
            localStorage.setItem("unsubbed", JSON.stringify(unsubbed));
            localStorage.setItem("toUnsub", JSON.stringify(toUnsub));
            nextUrl = toUnsub[0];
            setTimeout(redirect, 200);
        }
    }

    function unsubConfirm() {
        var unsubBtns = document.evaluate("//button[contains(., 'Отменить подписку')]", document, null, XPathResult.ANY_TYPE, null);
        var unsubBtn = unsubBtns.iterateNext();
        if (unsubBtn != null) {
            unsubBtn.click();
        }
        setTimeout(checkUnsub, 1000);
    }

    function checkUnsub() {
        var followBtns = document.evaluate("//button[contains(., 'Подписаться')]", document, null, XPathResult.ANY_TYPE, null);
        var followBtn = followBtns.iterateNext();
        if (responseStatus == 403 || responseStatus == 429) {
            console.warn("Словили 403 ответ, ждем " + msToTime(delay403Time));
            setTimeout(reloadPage, delay403Time);
            return false;
        }
        if (responseStatus == 400) {
            console.warn("Словили 400/429 ответ, ждем " + msToTime(delay400Time));
            setTimeout(reloadPage, delay400Time);
            return false;
        }
        if (followBtn != null) {
            console.log("Отписались, редирект");
            toDelete = toUnsub.shift();
            unsubbed.push(toDelete);
            localStorage.setItem("unsubbed", JSON.stringify(unsubbed));
            localStorage.setItem("toUnsub", JSON.stringify(toUnsub));
            nextUrl = toUnsub[0];
            unsubCount++;
            localStorage.setItem("unsubCount", unsubCount);
            setTimeout(redirect, 10000);
        } else {
            console.log("Нет кнопки Подписаться. Обновляем страницу");
            isError();
        }
    }

    function reloadPage() {
        location.reload();
    }

    function isError() {
        var headings = document.evaluate("//h2[contains(., 'К сожалению, эта страница недоступна.')]", document, null, XPathResult.ANY_TYPE, null);
        var thisHeading = headings.iterateNext();
        if (thisHeading != null) {
            console.log("Попали на страницу ошибки, удаляем битый адресс");
            var brokedLink = toUnsub.shift();
            brokedLinks.push(brokedLink);
            localStorage.setItem("brokedLinks", JSON.stringify(brokedLinks));
            localStorage.setItem("toUnsub", JSON.stringify(toUnsub));
            nextUrl = toUnsub[0];
            setTimeout(redirect, 100);
        } else {
            console.log("Хз Что случилось, останавливаемся");
            redirect();
        }
    }

    function redirect() {
        console.log("redirect to - " + nextUrl);
        unsubFlag = localStorage.getItem("unsubFlag");
        if (unsubFlag) {
            location.href = nextUrl;
        } else {
            console.log("Отписка остановлена вручную");
        }
    }

    function msToTime(s) {
        var ms = s % 1000;
        s = (s - ms) / 1000;
        var secs = s % 60;
        s = (s - secs) / 60;
        var mins = s % 60;
        var hrs = (s - mins) / 60;
        return hrs + ':' + mins + ':' + secs;
    }

    function downloadObjectAsJson(exportObj, exportName) {
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", exportName + ".json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
})();