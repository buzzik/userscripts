// ==UserScript==
// @name         Instagramm autolike v2
// @version      1.13
// @description  try to take over the world!
// @author       You
// @match        https://www.instagram.com/explore/tags/*
// @grant        GM_addStyle
// @grant      unsafeWindow
// @grant      GM_registerMenuCommand
// @grant              GM_getValue
// @grant              GM_setValue
// @require        https://raw.github.com/odyniec/MonkeyConfig/master/monkeyconfig.js
// @require            https://raw.githubusercontent.com/buzzik/GM_config/master/gm_config.js
// ==/UserScript==

(function() {
    'use strict';
    GM_config.init({
        'id': 'MyConfig', // The id used for this instance of GM_config
        'title': 'Autoliker settings', // Panel Title
        'fields': // Fields object
        {
            'isFollow': // This is the id of the field
            {
                'label': 'Follow', // Appears next to field
                'type': 'checkbox', // Makes this setting a text field
                'default': true // Default value if user doesn't change it
            },
            'isLike': // This is the id of the field
            {
                'label': 'Like', // Appears next to field
                'type': 'checkbox', // Makes this setting a text field
                'default': true // Default value if user doesn't change it
            },
            'delay403Time': // This is the id of the field
            {
                'label': 'Delay due 403 error', // Appears next to field
                'type': 'unsigned float', // Makes this setting a text field
                'default': 400000 // Default value if user doesn't change it
            },
            'delay400Time': // This is the id of the field
            {
                'label': 'Delay due 400 error', // Appears next to field
                'type': 'unsigned float', // Makes this setting a text field
                'default': 800000 // Default value if user doesn't change it
            },
            'nextPostDelay': // This is the id of the field
            {
                'label': 'Delay before next post', // Appears next to field
                'type': 'unsigned float', // Makes this setting a text field
                'default': 10000 // Default value if user doesn't change it
            },
            'tags': // This is the id of the field
            {
                'label': 'Tags list(separated by space)', // Appears next to field
                'type': 'textarea', // Makes this setting a text field
                'default': '#art #cgart #drawing #fanart  #artist #digitalart #illustration #digitaldraw #instaart #draw #render #artwork #animation #artistsoninstagram #painting #style  #creative #comics  #instagram #artoftheday #picoftheday #art #artwork #artoftheday #arts #artstagram #artshow #artlife #artgallery #artpop #instagramanet #instatag #illustration #illustrator #illustrations #illustrate #drawing #drawings #drawingoftheday #picture #pictureoftheday #pictures #pictureperfect #sketch #sketchbook #paper #pen #pencil #artsy #instaart #gallery' // Default value if user doesn't change it
            },
        },
        /* 'css': ''// CSS that will hide the section*/
        // 'frame': frame // Element used for the panel
    });
    var origOpen = XMLHttpRequest.prototype.open;
    var likeResponseStatus = 0;
    var followResponseStatus = 0;
    var otherResponseStatus = 0;
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener('load', function() {
            if (this.responseURL.includes('/web/friendships/')) {
                followResponseStatus = this.status;
                console.log('ответ на запрос ' + this.responseURL + " - " + followResponseStatus);
            } else if (this.responseURL.includes('/web/likes/')) {
                likeResponseStatus = this.status;
                console.log('ответ на запрос ' + this.responseURL + " - " + likeResponseStatus);
            } else {
                otherResponseStatus = this.status;
            }

        });
        origOpen.apply(this, arguments);
    };

    function Parser() {
        var posts, rnd; // set variables
        var tagsStr = GM_config.get('tags');;
        this.likedStorageName = "liked";
        this.tags = [];
        this.isFollow = GM_config.get('isFollow');
        this.isLike = GM_config.get('isLike');
        this.likedCounter = 0;
        this.delay403Time = GM_config.get('delay403Time');
        this.delay400Time = GM_config.get('delay400Time');
        this.nextPostDelay = GM_config.get('nextPostDelay');
        this.likeDelay = 0;
        this.followDelay = 0;
        this.liked = [];
        this.autoLikeFlag = localStorage.getItem("autoLikeFlag");
        var self = this;
        this.init = function() {
            self.tagsToArray();
            self.liked = self.arrFromStorage(self.likedStorageName);
            self.getPosts();
            self.likeDelay = Math.round(self.nextPostDelay / 4);
            self.followDelay = Math.round(self.nextPostDelay / 3);

        }
        this.findElemByText = function(elemType, elemText) {
            var els = document.evaluate("//" + elemType + "[contains(., '" + elemText + "')]", document, null, XPathResult.ANY_TYPE, null);
            var el = els.iterateNext();
            return el;
        }
        this.getPosts = function() {
            var thisHeading = self.findElemByText('h2', 'Новейшее');
            self.posts = thisHeading.nextElementSibling.querySelectorAll('a[href*="/p/"]');
        }
        this.getNextTag = function() {
            var min = 0;
            var max = self.tags.length - 1;
            var random = Math.round(Math.random() * (+max - +min) + +min);
            var nextURL = 'https://www.instagram.com/explore/tags/' + self.tags[random];
            return nextURL;
        }
        this.randomNumber = function() {
            var min = 4;
            var max = 250;
            var random = Math.random() * (+max - +min) + +min;
            return Math.round(random);
        }
        this.setAutolikeFlag = function(state) {
            this.autoLikeFlag = state;
            localStorage.setItem("autoLikeFlag", this.autoLikeFlag);
        }
        this.tagsToArray = function() {
            tagsStr = tagsStr.replace(/#/g, '');
            tagsStr = tagsStr.replace(/[ ]{2,}/g, ' ');
            self.tags = tagsStr.split(' ');
        }
        this.clickFollow = function() {
            var followBtn = self.findElemByText('button', 'Подписаться');
            if (followBtn != null) {
                followBtn.click();
                return true;
            }
            return false;
        }
        this.clickLike = function() {
            var likeBtn = document.querySelector('span[aria-label="Нравится"]');
            if (likeBtn != null) {
                likeBtn.parentNode.click();
                return true;
            }
            return false;
        }
        this.isNewPost = function() {
            var postTimeSec = self.findElemByText('time', 'секунд');
            if (postTimeSec == null) {
                return false;
            }
            return true;
        }
        this.clickNext = function() {
            var nextBtn = self.findElemByText('a', 'Далее');
            nextBtn.click();
        }
        this.openPost = function() {
            self.posts[0].click();
        }
        this.arrFromStorage = function(storageName) {
            var arr = JSON.parse(localStorage.getItem(storageName)); //read liked posts urls from local storage
            return arr == null ? [] : arr;
        }
        this.arrToStorage = function(arr, storageName) {
            localStorage.setItem(storageName, JSON.stringify(arr));

        }

    }
    var parser = new Parser();
    setTimeout(parser.init, 1000 + parser.randomNumber());
    if (parser.autoLikeFlag == 'true') {
        parser.setAutolikeFlag('false');
        setTimeout(parser.openPost, 2000 + parser.randomNumber());

        setTimeout(processPost, 4000 + parser.randomNumber());
    }

    function processPost() {
        if (!parser.isNewPost()) {
            console.warn("старый пост, редиректим");
            goToNextUrl();
            return false;
        }
        if (parser.isLike) {
            setTimeout(parser.clickLike, parser.likeDelay + parser.randomNumber());
        }
        if (parser.isFollow) {
            setTimeout(parser.clickFollow, parser.followDelay + parser.randomNumber());
            parser.liked.push(location.href);
            parser.arrToStorage(parser.liked, parser.likedStorageName);
        }
        setTimeout(checkResponses, parser.nextPostDelay - 1000 + parser.randomNumber());
    }

    function checkResponses() {
        var redirectDelay = parser.nextPostDelay - parser.likeDelay - parser.followDelay;
        var errorDelay = 200;
        if (likeResponseStatus == 403 || followResponseStatus == 403 || otherResponseStatus == 209 || otherResponseStatus == 429) {
            errorDelay = parser.delay403Time;
        } else if (followResponseStatus == 400 || likeResponseStatus == 400) {
            errorDelay = parser.delay400Time;
        }
        if (errorDelay != 200) {
            // setTimeout(processPost, errorDelay+parser.randomNumber());
            setTimeout(goToNextUrl, errorDelay + parser.randomNumber());
            console.warn("Banned.\n likeResponseStatus - " + likeResponseStatus + "\n followResponseStatus - " + followResponseStatus + ", Waiting " + msToTime(errorDelay));
            resetResponses();
            return false;
        } else {
            setTimeout(parser.clickNext, redirectDelay + parser.randomNumber());
            setTimeout(processPost, redirectDelay + 1000 + parser.randomNumber());
        }

    }

    function goToNextUrl() {
        localStorage.setItem("autoLikeFlag", "true");
        var newUrl = parser.getNextTag();
        location.href = newUrl;
    }

    function resetResponses() {
        followResponseStatus = 0;
        likeResponseStatus = 0;
        otherResponseStatus = 0;
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
    GM_registerMenuCommand('Settings', function() {
        GM_config.open();
    }, 'r');
    GM_registerMenuCommand('Start autolike', function() {
        localStorage.setItem("autoLikeFlag", "true");
        var nextUrl = parser.getNextTag();
        location.href = nextUrl;
    }, 'r');
    GM_registerMenuCommand('Stop autolike', function() {
        localStorage.setItem("autoLikeFlag", "false");
    }, 'r');
    //window.scrollBy(0,5000);
})();