// ==UserScript==
// @name         Instagramm autolike
// @version      0.79
// @match        https://www.instagram.com/explore/tags/*
// @grant      unsafeWindow
// @grant      GM_registerMenuCommand
// @grant              GM_getValue
// @grant              GM_setValue
// @require        https://raw.github.com/odyniec/MonkeyConfig/master/monkeyconfig.js
// @require            https://raw.githubusercontent.com/buzzik/GM_config/master/gm_config.js
// ==/UserScript==

(function() {
    'use strict';
    var origOpen = XMLHttpRequest.prototype.open;
    var responseStatus = 0;
    var otherResponseStatus = 0;
    GM_config.init({
        'id': 'MyConfig', // The id used for this instance of GM_config
        'title': 'autoliker settings', // Panel Title
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
                'default': 4000000 // Default value if user doesn't change it
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
                'default': '#myart #ink #creative #cs6 #sketchaday #dibujo #sketch #pencil #graphic #arte #drawing  #watercolor #colorful #drawings #artist #graphicdesign #artistic #beautiful	#markers #watercolour #paintings #colour #color #painting #artists #illustration #photoshop #art #cgart #drawing #fanart  #artist #digitalart #illustration #fashion #instaart #draw #render #artwork #animation #artistsoninstagram #painting #style  #creative #comics #instagram #artoftheday #picoftheday' // Default value if user doesn't change it
            },
        },
        /* 'css': ''// CSS that will hide the section*/
        // 'frame': frame // Element used for the panel
    });
    var tags = GM_config.get('tags');
    tags = tags.replace(/#/g, '');
    tags = tags.replace(/[ ]{2,}/g, ' ');
    tags = tags.split(' ');
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener('load', function() {
            if (this.responseURL.includes('/web/friendships/') || this.responseURL.includes('/web/likes/')) {
                responseStatus = this.status;
                console.log('ответ на запрос ' + this.responseURL + " - " + responseStatus);
            }
            otherResponseStatus = this.status;
        });
        origOpen.apply(this, arguments);
    };
    var posts, rnd; // set variables
    var storageName = "liked";
    var isFollow = GM_config.get('isFollow');
    var isLike = GM_config.get('isLike');
    var likedCounter = 0;
    var delay403Time = GM_config.get('delay403Time');
    var delay400Time = GM_config.get('delay400Time');
    var nextPostDelay = GM_config.get('nextPostDelay');
    var liked = JSON.parse(localStorage.getItem(storageName)); //read liked posts urls from local storage
    liked = liked == null ? [] : liked;
    var autoLikeFlag = localStorage.getItem("autoLikeFlag");
    GM_registerMenuCommand('Settings', function() {
        GM_config.open();
    }, 'r');
    GM_registerMenuCommand('Start autolike', function() {
        setTimeout(iterateTag, 200);
    }, 'r');
    GM_registerMenuCommand('Stop autolike', function() {
        localStorage.setItem("autoLikeFlag", "false");
    }, 'r');
    if (autoLikeFlag == 'true') {
        setTimeout(startLiking, 2000 + randomNumber());
        localStorage.setItem("autoLikeFlag", "false");
    }

    function findElemByText(elemType, elemText) {
        var els = document.evaluate("//" + elemType + "[contains(., '" + elemText + "')]", document, null, XPathResult.ANY_TYPE, null);
        var el = els.iterateNext();
        return el;
    }

    function readPosts() {
        var thisHeading = findElemByText('h2', 'Новейшее');
        posts = thisHeading.nextElementSibling.querySelectorAll('a[href*="/p/"]');
    }

    function startLiking() {
        var followBtn = findElemByText('button', 'Подписаться');
        if (followBtn != null) {
            console.log("Подписываемся на тег != " + null);
            followBtn.click();
        }
        readPosts();
        postOpen();
    }

    function postOpen() { //open first post from "fresh"
        posts[0].click();
        setTimeout(nextAction(), 2000 + randomNumber());

    }

    function postFollow() {
        console.log("try to follow");
        if (!isNewPost()) {
            setTimeout(iterateTag, 500 + randomNumber());
            return false;
        }
        var followBtn = findElemByText('button', 'Подписаться');
        if (followBtn != null) {
            followBtn.click();
            liked.push(location.href);
            localStorage.setItem(storageName, JSON.stringify(liked));
        }
        setTimeout(postLike, 1000 + randomNumber());
    }

    function isNewPost() {
        var postTimeSec = findElemByText('time', 'секунд');
        if (postTimeSec == null) {
            console.warn("Слишком старый пост");
            return false;
        }
        return true;
    }

    function iterateTag() {
        var min = 0;
        var max = tags.length - 1;
        var random = (Math.random() * (+max - +min) + +min).toFixed();
        localStorage.setItem("autoLikeFlag", "true");
        var nextURL = 'https://www.instagram.com/explore/tags/' + tags[random];
        location.href = nextURL;
    }

    function nextAction() {
        return isFollow ? postFollow : postLike;
    }

    function postLike() {
        var likeBtn = document.querySelector('span[aria-label="Нравится"]');
        var errorDelay;
        if (responseStatus == 403 || otherResponseStatus == 209 || otherResponseStatus == 429) {
            errorDelay = delay403Time;
        } else if (responseStatus == 400) {
            errorDelay = delay400Time;
        } else {
            errorDelay = 0;
        }
        if (errorDelay > 0) {
            setTimeout(nextAction(), errorDelay + randomNumber());
            console.warn("Banned " + responseStatus + ", Waiting " + msToTime(errorDelay));
            resetResponses();
            return false;
        }
        if (likeBtn != null && isLike) {
            likeBtn.parentNode.click();
        }
        setTimeout(clickNext, nextPostDelay + randomNumber());
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

    function resetResponses() {
        responseStatus = 0;
        otherResponseStatus = 0;
    }

    function clickNext() {
        var nextBtn = findElemByText('a', 'Далее');
        nextBtn.click();
        if (isFollow) {
            setTimeout(postFollow, 2000 + randomNumber());
        } else {
            setTimeout(postLike, 1000 + randomNumber());
        }
    }

    function randomNumber() {
        var min = 4;
        var max = 250;
        var random = Math.random() * (+max - +min) + +min;
        return Math.round(random);
    }
    //window.scrollBy(0,5000);
})();