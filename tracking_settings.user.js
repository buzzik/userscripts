// ==UserScript==
// @name         bugtracking_settings
// @namespace    http://tampermonkey.net/
// @version      0.4.7
// @description  Bugtracking settings
// @author       You
// @match        https://bugtrack.lan/*
// @require      https://raw.githubusercontent.com/buzzik/GM_config/master/gm_config.js
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue

// ==/UserScript==
//todo - подсвечивать пост на который ведет ссылка
//todo - реализовать приоритет тем с подсветкой
//todo - допилить FireBase
(() => {
    "use strict";
    GM_config.init({
        id: "bug_config", // The id used for this instance of GM_config
        title: "Bugtracking settings", // Panel Title
        // Fields object
        fields: {
            // This is the id of the field
            showBBCodes: {
                label: "Показать bb коды", // Appears next to field
                type: "checkbox", // Makes this setting a text field
                default: true // Default value if user doesn't change it
            },
            // This is the id of the field
            showTopicsButton: {
                label: 'Кнопка в "Слежке"', // Appears next to field
                type: "checkbox", // Makes this setting a text field
                default: true // Default value if user doesn't change it
            },
            showSearchTopicsButton: {
                label: 'Кнопка в "Поиске"', // Appears next to field
                type: "checkbox", // Makes this setting a text field
                default: true // Default value if user doesn't change it
            },
            // This is the id of the field
            changeLogo: {
                label: "Сменить логотип", // Appears next to field
                type: "checkbox", // Makes this setting a text field
                default: true // Default value if user doesn't change it
            },
            // This is the id of the field
            hideBreadcumb: {
                label: 'Убрать "темы" в крошках', // Appears next to field
                type: "checkbox", // Makes this setting a text field
                default: true // Default value if user doesn't change it
            },
            // This is the id of the field
            fixedBread: {
                label: "Зафиксировать крошки", // Appears next to field
                type: "checkbox", // Makes this setting a text field
                default: true // Default value if user doesn't change it
            },
            // This is the id of the field
            hideNotification: {
                label: "Спрятать уведомление шедуля", // Appears next to field
                type: "checkbox", // Makes this setting a text field
                default: true // Default value if user doesn't change it
            },
            // This is the id of the field
            hideNewNotification: {
                label: "Спрятать уведомление о новых темах/сообщениях", // Appears next to field
                type: "checkbox", // Makes this setting a text field
                default: true // Default value if user doesn't change it
            },
            // This is the id of the field
            replaceAnchors: {
                label: "Изменить анкоры в темах", // Appears next to field
                type: "checkbox", // Makes this setting a text field
                default: true // Default value if user doesn't change it
            },
            // This is the id of the field
            moveThemeButton: {
                label: "Перенос кнопки создать вверх", // Appears next to field
                type: "checkbox", // Makes this setting a text field
                default: true // Default value if user doesn't change it
            },
            addUploadsFrame: {
                label: "Добавить темы в Upload в сайдбар", // Appears next to field
                type: "checkbox", // Makes this setting a text field
                default: true // Default value if user doesn't change it
            },
            spyImprove: {
                label: "Улучшение отслеживания", // Appears next to field
                type: "checkbox", // Makes this setting a text field
                default: true // Default value if user doesn't change it
            },
            // This is the id of the field
            testFeatures: {
                label: "Тестовый функционал", // Appears next to field
                type: "checkbox", // Makes this setting a text field
                default: false // Default value if user doesn't change it
            },
            theme: {
                label: "Тема", // Appears next to field
                type: "select", // Makes this setting a dropdown
                options: ["default", "Light", "Dark"], // Possible choices
                default: "Dark" // Default value if user doesn't change it
            }
        }
    });
    GM_registerMenuCommand(
        "Settings",
        function() {
            GM_config.open();
        },
        "r"
    );


    class Utils {
        static newElement(elementType, elementAttributes, elementParent) {
            if (elementAttributes === undefined) elementAttributes = false;
            if (elementParent === undefined) elementParent = document.body;
            let elem = document.createElement(elementType);
            for (let param in elementAttributes) {
                elem.setAttribute(param, elementAttributes[param]);
            }
            elementParent.appendChild(elem);
        }
        static hashCode(s) { // generate numeric hash from string
            var h = 0,
                i = s.length - 1;
            while (i >= 0) h = ((h << 5) - h + s.charCodeAt(--i)) | 0;
            return h;
        }
        static linksToText() {
            let links = document.querySelectorAll(
                'blockquote a[href*="?messageId="]'
            );
            console.log(links);
            for (let link of links) {
                link.innerText = link.href.replace(
                    /^.*?view\/(\d*?)\?messageId=(\d*?)$/,
                    "{{$1:$2}}"
                );
            }
        }
    }
    GM_registerMenuCommand(
        "Links To Anchors",
        function() {
            Utils.linksToText();
        },
        "r"
    );
    const LIGHT_THEME_CSS = `
    @import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');
    .message-caption {background: none!important;padding: 4px 4px 0px 10px!important;border-radius: 2px;background-color: #346bad26!important;}
    .message-caption a {color: #337ab7!important;font-size:14px;}
    .message-caption span {color: #a0a0a0!important;font-size: 11px;}
    #table-entities-list blockquote {border: none!important;background-color: none!important;background: none!important;}
    blockquote {border-left: 4px solid #458ab6 !important;}
    .text-warning {color: #585858!important;background: #ffad6457!important    }
    .text-warning:hover {background: #ffad6436!important;}
    .text-warning a {color: #585858;}
    .alert-new-theme, .alert-new-theme a, .alert-new-theme a i {color: inherit;background: inherit;font-weight: bold;}
    lockquote .small:before, blockquote footer:before, blockquote small:before {content: '';}
    .navbar-header {background: #303340;}
    .bg-title {background: #303340;margin-bottom: 0!important;}
    #page-wrapper {background: #ffffff;}
    body {font-family: 'Roboto', sans-serif!important;}
    tr[id*='row-theme-'] a {color: #585858!important;}
    .new-msg a:after {color: white;content: 'NEW';font-size: 10px;vertical-align: middle;background: #ef5958;border-radius: 10px;padding: 2px 5px;}
    .form-control {background-color: #f5f9fd;border: 1px solid #485267!important;border-radius: 2px;}
    textarea.form-control, input.form-control {padding: 5px 10px;}
    textarea.form-control {background-color: #f5f9fd!important;}
    select.form-control {background-color: #f5f9fd!important;}
    .dropzone {background: #f5f9fd;}
    #page-wrapper {background: #f5f9fd;}
    .white-box {background: #f5f9fd;}
    panel-darkblue .panel-heading, .panel-primary .panel-heading {border-color: none!important;color: inherit;background-color: none!important;background: none!important;font-weight:bold;}
    .panel {background-color: #f5f9fd!important;background: #f5f9fd!important;padding: 15px;}
    .panel-darkblue a, .panel-primary a {color: inherit;}
    .alert7 {background: #337ab8 none repeat scroll 0 0;}
    .theme-is-work {background-color: #d2ffba !important;font-weight: 500;}
    .theme-is-work, .theme-is-work * {color: inherit;background: #aedeae!important;}
    .text-warning, .text-warning * {background: none;color: #ff743d !important;}
    tr.text-warning:hover, tr.text-warning:hover * {background-color: #ffeee0 !important;}
    tr[id*='row-theme-'].text-warning a {color: #ff743d!important;}
    .sidebar {z-index: 1;position: fixed;width: 240px;padding-top: 50px;height: 100%;transform: none!important;transition: none!important;}
    #page-wrapper {position: relative;margin: 0px 0 0 240px;transition: none!important;padding-top: 50px;}
    .col-lg-1, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-md-1, .col-md-10, .col-md-11, .col-md-12, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-sm-1, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-xs-1, .col-xs-10, .col-xs-11, .col-xs-12, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9
    {padding-right: 0px!important;padding-left: 0px!important;}
    .bg-title .breadcrumb {padding-left: 20px;}
    .btn {padding: 10px 12px!important;}
    #theme_message_edit_type{display:none!important;}
    .theme-comment {margin-left:4px}
    .theme-comment i {font-size:14px;font-weight:normal!important}
    .clearfix.row{margin-right: 0!important;        margin-left: -0!important;}
    tr.closed-theme {opacity:0.3}
    :root {        --h5-color: #2a64ad;      }
    :root {        --web-color: #9ca523;      }
    :root {        --cj-color: #a56023;      }
    :root {        --help-color: #2e3594;      }
    :root {        --pr-color: #38942e;      }
    :root {        --risk-color: #2e947d;      }
    :root {        --sa-color: #7b1945;      }
    `;
    const DARK_THEME_CSS = `
    ///////////////////////Dark Style ////////////////////
    #page-wrapper {background: #303340!important;}
    .theme-is-work, .theme-is-work * {color: inherit;background: #3e633e!important;}
    #page-wrapper {background: #303340;}
    .white-box {background: #303340!important;}
    blockquote .small, blockquote footer, blockquote small {color: #e4e4e4!important;}
    .message-caption {background-color: #485267!important;}
    .message-caption a {color: #8dcaff!important;font-size: 14px;}
    a {color: #8dcaff;text-decoration: none;}
    a:focus, a:hover {color: #c1e2ff;text-decoration: underline;}
    body {color: #e4e4e4!important;}
    tbody {color: #e4e4e4;}
    th {color: #e4e4e4;}
    tr[id*='row-theme-'] a {color: #e4e4e4!important;}
    textarea.form-control {background-color: #303340!important;}
    .dropzone {background: #494d5f;border-radius: 2px;border:1px dashed rgba(149, 150, 189, 0.65)!important;}
    select.form-control {background-color: #303340!important;}
    .form-control {color: #e4e4e4!important;border: 1px solid #485267!important;border-radius: 2px;background-color: #303340!important;background: #303340!important;}
    .table > thead > tr > th, .table > tbody > tr > th, .table > tfoot > tr > th, .table > thead > tr > td, .table > tbody > tr > td, .table > tfoot > tr > td, .table > thead > tr > th, .table-bordered {border-top: none;}
    .panel {background-color: #303340!important;background: #303340!important;padding: 15px;}
    .text-warning, .text-warning * {background: none;color: #ff8d60!important;}
    tr[id*='row-theme-'].text-warning a {color: #ff8d60!important;}
    .text-warning {color: #ff8d60 !important;background: #634a3a!important;}
    .footer {background: #303340;}
    .sidebar {background: #232631;}
    .top-left-part {background: #232631;}
    .navbar-header {background: #232631;}
    .table-striped > tbody > tr:nth-of-type(odd), .table-hover > tbody > tr:hover, .table > thead > tr > td.active, .table > tbody > tr > td.active, .table > tfoot > tr > td.active, .table > thead > tr > th.active, .table > tbody > tr > th.active, .table > tfoot > tr > th.active, .table > thead > tr.active > td, .table > tbody > tr.active > td, .table > tfoot > tr.active > td, .table > thead > tr.active > th, .table > tbody > tr.active > th, .table > tfoot > tr.active > th {background-color: #393d4c !important;}
    #btn-block>button {border-radius: 2px!important;border: none!important;}
    #btn-block>button:hover {background: #ffffff0f!important;}
    .bg-title {background: #232631;}
    #table-entities-list .active-message {   background-color: #485267!important;}
    .white-box.steamline1>blockquote {background-color: #f7fff500!important}
    `;
    const BB_CODES_STYLES = `
    #btn-block>button{padding: 3px;margin: 1px;width: 30px;cursor: pointer;border-radius: 4px;border: 1px solid #edeff0;background: none;}
    #btn-block{float:left}
    #bb_b{font-weight:bold}#bb_u{text-decoration:underline}#bb_i{font-style:italic}
    `;
    const BUTTON_CSS = `
    .filter-btn-group{min-width:350px!important;}
    #table-entities-list.notext blockquote{display:none;}
    #table-entities-list.notext .duplicate{display:none;}
    .white-box.steamline1.notext blockquote{display:none;}
    .white-box.steamline1.notext .duplicate{display:none;}
    .holder-cell.h5-department {border-left:20px solid var(--h5-color) }
    .btn-h5-department  {background:var(--h5-color) }
    .holder-cell.web-department {border-left:20px solid var(--web-color) }
    .btn-web-department  {background:var(--web-color) }
    .holder-cell.cj-department {border-left:20px solid var(--cj-color) }
    .btn-cj-department  {background:var(--cj-color) }
    .holder-cell.help-department {border-left:20px solid var(--help-color) }
    .btn-help-department  {background:var(--help-color) }
    .holder-cell.pr-department {border-left:20px solid var(--pr-color) }
    .btn-pr-department  {background:var(--pr-color) }
    .holder-cell.risk-department {border-left:20px solid var(--risk-color) }
    .btn-risk-department  {background:var(--risk-color) }
    .holder-cell.sa-department {border-left:20px solid var(--sa-color) }
    .btn-sa-department  {background:var(--sa-color) }
    #side-toolbar .btn {display: block;        margin: 10px;        width: 70%;}
    `;
    const FIX_BREAD_CSS = `
    .white-box {padding-top: 25px;}
    .bg-title {position: fixed;width: 100%;z-index: 999;margin-top:0!important;}
    .alert {margin-top: 30px;}
    `;
    const NEW_LOGO_SRC =
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDQ1Ni44MjggNDU2LjgyOCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDU2LjgyOCA0NTYuODI4OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgY2xhc3M9IiI+PGc+PGc+Cgk8Zz4KCQk8cGF0aCBkPSJNNDUxLjM4MywyNDcuNTRjLTMuNjA2LTMuNjE3LTcuODk4LTUuNDI3LTEyLjg0Ny01LjQyN2gtNjMuOTUzdi04My45MzlsNDkuMzk2LTQ5LjM5NCAgICBjMy42MTQtMy42MTUsNS40MjgtNy44OTgsNS40MjgtMTIuODVjMC00Ljk0Ny0xLjgxMy05LjIyOS01LjQyOC0xMi44NDdjLTMuNjE0LTMuNjE2LTcuODk4LTUuNDI0LTEyLjg0Ny01LjQyNCAgICBzLTkuMjMzLDEuODA5LTEyLjg0Nyw1LjQyNGwtNDkuMzk2LDQ5LjM5NEgxMDcuOTIzTDU4LjUyOSw4My4wODNjLTMuNjE3LTMuNjE2LTcuODk4LTUuNDI0LTEyLjg0Ny01LjQyNCAgICBjLTQuOTUyLDAtOS4yMzMsMS44MDktMTIuODUsNS40MjRjLTMuNjE3LDMuNjE3LTUuNDI0LDcuOS01LjQyNCwxMi44NDdjMCw0Ljk1MiwxLjgwNyw5LjIzNSw1LjQyNCwxMi44NWw0OS4zOTQsNDkuMzk0djgzLjkzOSAgICBIMTguMjczYy00Ljk0OSwwLTkuMjMxLDEuODEtMTIuODQ3LDUuNDI3QzEuODA5LDI1MS4xNTQsMCwyNTUuNDQyLDAsMjYwLjM4N2MwLDQuOTQ5LDEuODA5LDkuMjM3LDUuNDI2LDEyLjg0OCAgICBjMy42MTYsMy42MTcsNy44OTgsNS40MzEsMTIuODQ3LDUuNDMxaDYzLjk1M2MwLDMwLjQ0Nyw1LjUyMiw1Ni41MywxNi41Niw3OC4yMjRsLTU3LjY3LDY0LjgwOSAgICBjLTMuMjM3LDMuODEtNC43MTIsOC4yMzQtNC40MjUsMTMuMjc1YzAuMjg0LDUuMDM3LDIuMjM1LDkuMjczLDUuODUyLDEyLjcwM2MzLjYxNywzLjA0NSw3LjcwNyw0LjU3MSwxMi4yNzUsNC41NzEgICAgYzUuMzMsMCw5Ljg5Ny0xLjk5MSwxMy43MDYtNS45OTVsNTIuMjQ2LTU5LjEwMmw0LjI4NSw0LjAwNGMyLjY2NCwyLjQ3OSw2LjgwMSw1LjU2NCwxMi40MTksOS4yNzQgICAgYzUuNjE3LDMuNzEsMTEuODk3LDcuNDIzLDE4Ljg0MiwxMS4xNDNjNi45NSwzLjcxLDE1LjIzLDYuODUyLDI0Ljg0LDkuNDE4YzkuNjE0LDIuNTczLDE5LjI3MywzLjg2LDI4Ljk4LDMuODZWMTY5LjAzNGgzNi41NDcgICAgVjQyNC44NWM5LjEzNCwwLDE4LjM2My0xLjIzOSwyNy42ODgtMy43MTdjOS4zMjgtMi40NzEsMTcuMTM1LTUuMjMyLDIzLjQxOC04LjI3OGM2LjI3NS0zLjA0OSwxMi40Ny02LjUxOSwxOC41NTUtMTAuNDIgICAgYzYuMDkyLTMuOTAxLDEwLjA4OS02LjYxMiwxMS45OTEtOC4xMzhjMS45MDktMS41MjYsMy4zMzMtMi43NjIsNC4yODQtMy43MWw1Ni41MzQsNTYuMjQzYzMuNDMzLDMuNjE3LDcuNzA3LDUuNDI0LDEyLjg0Nyw1LjQyNCAgICBjNS4xNDEsMCw5LjQyMi0xLjgwNywxMi44NTQtNS40MjRjMy42MDctMy42MTcsNS40MjEtNy45MDIsNS40MjEtMTIuODUxcy0xLjgxMy05LjIzMi01LjQyMS0xMi44NDdsLTU5LjM4OC01OS42NjkgICAgYzEyLjc1NS0yMi42NTEsMTkuMTMtNTAuMjUxLDE5LjEzLTgyLjc5Nmg2My45NTNjNC45NDksMCw5LjIzNi0xLjgxLDEyLjg0Ny01LjQyN2MzLjYxNC0zLjYxNCw1LjQzMi03Ljg5OCw1LjQzMi0xMi44NDcgICAgQzQ1Ni44MjgsMjU1LjQ0NSw0NTUuMDExLDI1MS4xNTgsNDUxLjM4MywyNDcuNTR6IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBjbGFzcz0iYWN0aXZlLXBhdGgiIHN0eWxlPSJmaWxsOiM3RUM4NTgiIGRhdGEtb2xkX2NvbG9yPSIjMDAwMDAwIj48L3BhdGg+CgkJPHBhdGggZD0iTTI5My4wODEsMzEuMjdjLTE3Ljc5NS0xNy43OTUtMzkuMzUyLTI2LjY5Ni02NC42NjctMjYuNjk2Yy0yNS4zMTksMC00Ni44Nyw4LjkwMS02NC42NjgsMjYuNjk2ICAgIGMtMTcuNzk1LDE3Ljc5Ny0yNi42OTEsMzkuMzUzLTI2LjY5MSw2NC42NjdoMTgyLjcxNkMzMTkuNzcxLDcwLjYyNywzMTAuODc2LDQ5LjA2NywyOTMuMDgxLDMxLjI3eiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgY2xhc3M9ImFjdGl2ZS1wYXRoIiBzdHlsZT0iZmlsbDojN0VDODU4IiBkYXRhLW9sZF9jb2xvcj0iIzAwMDAwMCI+PC9wYXRoPgoJPC9nPgo8L2c+PC9nPiA8L3N2Zz4=";

    const FAVICON_HREF = "https://i.imgur.com/49sop7A.png";

    class BugtrackSettings {
        constructor() {
            this.config_theme = GM_config.get("theme");
            this.config_showBBCodes = GM_config.get("showBBCodes");
            this.config_showTopicsButton = GM_config.get("showTopicsButton");
            this.config_moveThemeButton = GM_config.get("moveThemeButton");
            this.config_hideBreadcumb = GM_config.get("hideBreadcumb");
            this.config_hideNotification = GM_config.get("hideNotification");
            this.config_replaceAnchors = GM_config.get("replaceAnchors");
            this.config_hideNewNotification = GM_config.get("hideNewNotification");
            this.config_showSearchTopicsButton = GM_config.get("showSearchTopicsButton");
            this.config_addUploadsFrame = GM_config.get("addUploadsFrame");
            this.config_fixBread = GM_config.get("fixedBread");
            this.config_changeLogo = GM_config.get("changeLogo");
            this.config_spyImprove = GM_config.get("spyImprove");
            this.messageTextarea = "#theme_message_edit_msg";
            this.urlParams = null;
            this.myLogin = document.querySelector(
                "#wrapper > nav > div > ul.nav.navbar-top-links.navbar-right.pull-right > li.dropdown > a"
            ).innerText;
            this.themeId = null;
            this.themeTitle = null;
            this.themeOwner = null;
            this.themeDepartment = null;
            this.messageId = null;
            this.pageType = null; // theme/myThemes/userThemes


            this.bbCodeButtons = [{
                    name: "b",
                    key: 66,
                    title: "Ctrl + b"
                },
                {
                    name: "u",
                    key: 85,
                    title: "Ctrl + u"
                },
                {
                    name: "i",
                    key: 73,
                    title: "Ctrl + i"
                }
            ];
            this.init();
        }
        init() {
            // for (let scriptUrl of this.firebaseScripts) {
            //   Utils.newElement('script',{src:scriptUrl});
            // }
            // firebase.initializeApp(this.firebaseConfig);
            // setTimeout(this.initFirebase, 3000);
            GM_addStyle(
                this.config_theme == "Light" ?
                LIGHT_THEME_CSS :
                this.config_theme == "Dark" ?
                LIGHT_THEME_CSS + DARK_THEME_CSS :
                ""
            );
            GM_addStyle(BUTTON_CSS);
            let paramsString = location.search;
            this.urlParams = new URLSearchParams(paramsString);
            this.identificatePage();
            //adding sidebar panel
            this.createToolbar();
            this.fixPadding();
            if (this.pageType == "themeView") {
                this.findThemeAnchors();
            }
            if (this.config_addUploadsFrame) {
                this.addUploadsFrame();
            }
            //BB codes Part
            if (this.config_showBBCodes) {
                this.insertBBCodes();
                console.log("showBBCodes");
            }
            //BB codes part end
            //Button part
            if (this.config_showTopicsButton && this.pageType == "logList") {
                console.log("showTopicsButton");
                this.incertHideBtn();
            }
            //Button part end
            if (this.config_showSearchTopicsButton && this.pageType == "search") {
                console.log("showSearchTopicsButton");
                this.incertSearchHideBtn();

            }
            //Button part end
            if (this.pageType == "upload") {
                this.initUploadPage();
            }
            if (this.pageType == "spyList" && this.config_spyImprove) {
                this.initSpyPage();
                this.newTool("Обновить", "btn-info", this.initSpyPage);
                this.newTool("H5 отдел", "btn-h5-department", () => {
                    this.filterSpy('h5-department');
                });
                this.newTool("WEB отдел", "btn-web-department", () => {
                    this.filterSpy('web-department');
                });
                this.newTool("CJ отдел", "btn-cj-department", () => {
                    this.filterSpy('cj-department');
                });
                this.newTool("PR отдел", "btn-pr-department", () => {
                    this.filterSpy('pr-department');
                });
                this.newTool("Help", "btn-help-department", () => {
                    this.filterSpy('help-department');
                });
                this.newTool("SA отдел", "btn-sa-department", () => {
                    this.filterSpy('sa-department');
                });
                this.newTool("RISK отдел", "btn-risk-department", () => {
                    this.filterSpy('risk-department');
                });
                this.newTool("Сброс", "btn-danger", () => {
                    this.filterSpy('column-clickable');
                });
            }
            //BreadcumbPArt  hideBreadcumb
            if (this.config_hideBreadcumb && this.pageType != "messages") {
                console.log("hideBreadcumb");
                try {
                    document
                        .querySelector('.breadcrumb a[href="/theme"]')
                        .parentNode.classList.add("hidden");
                } catch (e) {
                    // return;
                    console.info(e);
                }
            }
            //BreadcumbPArt END

            //Кнопка тем
            if (this.config_moveThemeButton) {
                console.log("moveThemeButton");
                let newLi = document.createElement("li");
                newLi.classList.add("dropdown", "autocomplete-block");
                newLi.innerHTML =
                    '<a href="/theme/view/0" title="Создать тему"><i class="text-success fa fa-plus"></i> Создать</a>';
                document.querySelector(".navbar-top-links").appendChild(newLi);
                GM_addStyle(`.white-box>.table-responsive>a{display:none!important;}`);
            }
            //Кнопка тем END
            //Спрятать неработающее окно шедуля
            if (this.config_hideNotification) {
                console.log("hideNotification");
                GM_addStyle(`#block-info-warning{display:none!important;}`);
            }
            //Спрятать неработающее окно шедуля END
            //Спрятать уведомления

            if (this.config_hideNewNotification) {
                console.log("hideNewNotification");
                GM_addStyle(`#alert-top-right-info{display:none!important;}`);
            }
            //Спрятать уведомления END
            //Change Icon
            if (this.config_changeLogo) {
                var logo = document.querySelector("a.logo");
                logo.innerHTML = `<img src="${NEW_LOGO_SRC}" />BugTracking`;
                var icon = document.querySelector('link[rel="icon"]');
                icon.href = FAVICON_HREF;
                GM_addStyle(
                    `a.logo img{height: 20px;margin: 3px 10px;transform: rotate(35deg);vertical-align: text-bottom!important;}`
                );
            }
            //Change Icon END
            //fixBread
            if (this.config_fixBread) GM_addStyle(FIX_BREAD_CSS);
            //fixBread END
        }
        fixPadding() {
            let breadHeight = document.querySelector(".row.bg-title").offsetHeight;
            let fixPadding = breadHeight + 6;
            let contentWrapper = document.querySelector(".white-box");
            contentWrapper.setAttribute("style", `padding-top:${fixPadding}px`);

        }
        initUploadPage() {
            let table = document.querySelector('#table-entities-list');
            table.innerHTML = "";
        }
        addUploadsFrame() {
            let sidebar = document.querySelector("div.sidebar-nav.navbar-collapse");
            let frame = document.createElement("iframe");
            frame.setAttribute("src", "https://bugtrack.lan/release_info.php");
            frame.setAttribute("width", "330");
            frame.setAttribute("height", "600");
            frame.setAttribute("frameborder", "0");
            frame.setAttribute("style", "-ms-zoom: 0.75;-moz-transform: scale(0.75);-moz-transform-origin: 0 0;-o-transform: scale(0.75);-o-transform-origin: 0 0;-webkit-transform: scale(0.75);-webkit-transform-origin: 0 0;margin-left: -5px;");
            sidebar.append(frame);

        }
        filterSpy(filter) {
            let table = document.querySelector('#table-entities-list');
            let rows = table.querySelectorAll('tr');

            for (let row of rows) {
                let holderCell = row.children[2];
                if (holderCell.classList.contains(filter)) {
                    row.classList.remove('hidden');
                } else {
                    row.classList.add('hidden');
                }
            }
        }
        initSpyPage() {
            console.log("initSpyPage");
            let table = document.querySelector('#table-entities-list');
            let rows = table.querySelectorAll('tr');
            let self = this;
            for (let row of rows) {
                if (row.id == "table-load-more") {
                    break;
                }
                let idCell = row.children[0];
                let titleCell = row.children[1];
                let holderCell = row.children[2];
                let stateCell = row.children[3];
                let lastmsgCell = row.children[4];
                let priorityCell = row.children[5];
                let participateCell = row.children[6];
                idCell.classList.add('id-cell');
                idCell.setAttribute('data-id', idCell.textContent);
                titleCell.classList.add('title-cell');
                holderCell.classList.add('holder-cell');
                stateCell.classList.add('state-cell');
                lastmsgCell.classList.add('last-msg-cell');
                priorityCell.classList.add('priority-cell');
                participateCell.classList.add('participate-cell');
                if (stateCell.textContent == "Закрыт") {
                    row.classList.add('closed-theme');
                }
                if (/^H5(.*?)$/.test(holderCell.textContent)) {
                    holderCell.classList.add("h5-department");
                }
                if (/^(WH|WEB)(.*?)$/.test(holderCell.textContent)) {
                    holderCell.classList.add("web-department");
                }
                if (/^(DD|PR|Pr)(.*?)$/.test(holderCell.textContent)) {
                    holderCell.classList.add("pr-department");
                }
                if (/^CJ(.*?)$/.test(holderCell.textContent)) {
                    holderCell.classList.add("cj-department");
                }
                if (/^Help(.*?)$/.test(holderCell.textContent)) {
                    holderCell.classList.add("help-department");
                }
                if (/^(Risk|RISK|cg|sup|RS|SUP)(.*?)$/.test(holderCell.textContent)) {
                    holderCell.classList.add("risk-department");
                }
                if (/^SA(.*?)$/.test(holderCell.textContent)) {
                    holderCell.classList.add("sa-department");
                }
            }
        }
        createToolbar() {
            let li = document.createElement('li');
            let toolbar = document.createElement('ul');
            toolbar.id = "side-toolbar"
            li.append(toolbar)
            document.querySelector("#side-menu").append(li);
        }
        findThemeAnchors() {
            let links = document.querySelectorAll(
                'blockquote a[href*="?messageId="]'
            );
            for (let link of links) {
                let themeId = null;
                let raw = null;
                link.setAttribute("data-type", "theme-anchor");
                raw = link.href.match(
                    /^.*?\/theme\/view\/(\d{4,5})\?messageId=(\d*?)$/i
                );

                themeId = raw[1];
                if (themeId == this.themeId && this.config_replaceAnchors) {
                    link.innerText = `#${link.title}`;
                }
            }
        }
        identificatePage() {
            let pathname = location.pathname;
            let raw = null;
            //myList - /theme/my
            //logList - /theme/log
            //spyList - /theme/spy
            //icreatedList - /theme/icreated
            //remindList - /theme/remind
            //messages - /bugs/messages
            //themeNew - /theme/new
            //profile - /user/profile
            //userThemesList - /view/GROUP/USERNAME
            ///bugs/search/message/0?text=query
            //themeView - /view/GROUP/USERNAME/12345?messageId=123456
            if ((raw = pathname.match(/^\/view\/(\w*?)\/(\w*?)\/(\d{4,5})/i))) {
                this.pageType = "themeView";
                this.themeId = raw[3];
                this.themeOwner = raw[2];
                this.themeDepartment = raw[1];
                this.themeTitle = document
                    .querySelector(
                        "#page-wrapper > div > div.row.bg-title > div > ol > li.active.copy-text-to-buffer"
                    )
                    .innerText.match(/^\d{4,5}\s\|\s(.*?)$/)[1];
                console.log(`themeId: ${this.themeId}`);
                console.log(`themeOwner: ${this.themeOwner}`);
                console.log(`themeDepartment: ${this.themeDepartment}`);
                console.log(`themeTitle: ${this.themeTitle}`);
            } else if ((raw = pathname.match(/^\/view\/(\w*?)\/(\w*?)$/i))) {
                this.pageType = "userThemesList";
            } else if (this.urlParams.has("page")) {
                this.pageType = this.urlParams.get("page");
            } else {
                switch (pathname) {
                    case "/theme/my":
                        this.pageType = "myList";
                        break;
                    case "/theme/log":
                        this.pageType = "logList";
                        break;
                    case "/theme/spy":
                        this.pageType = "spyList";
                        break;
                    case "/theme/icreated":
                        this.pageType = "icreatedList";
                        break;
                    case "/theme/remind":
                        this.pageType = "remindList";
                        break;
                    case "/bugs/messages":
                        this.pageType = "messages";
                        break;
                    case "/theme/new":
                        this.pageType = "themeNew";
                        break;
                    case "/bugs/search/message/0":
                        this.pageType = "search";
                        break;
                    case "/user/profile":
                        this.pageType = "profile";
                        break;
                    default:
                        break;
                }
            }
            console.log(`this.pageType: ${this.pageType}`);
        }
        newTool(name, style, callback) {
            let newBtn = document.createElement("button");
            newBtn.type = "button";
            newBtn.innerHTML = name;
            newBtn.classList.add("btn", "btn-sm1", style);
            newBtn.onclick = callback;
            let toolbar = document.querySelector("#side-toolbar");
            let li = document.createElement('li');
            li.append(newBtn);
            toolbar.append(newBtn)
        }
        incertHideBtn() {
            let callback = () => {
                console.log(this);
                var themesIds = [];
                var captions = document.querySelectorAll(
                    "#table-entities-list .message-caption"
                );
                for (let elem of captions) {
                    var themeId = elem
                        .querySelector("a")
                        .href.match(/.*view\/(\d*?)\?/)[1];
                    elem.classList.add("caption-" + themeId);
                    if (themesIds.indexOf(themeId) == -1) {
                        themesIds.push(themeId);
                    } else {
                        elem.classList.add("duplicate");
                    }
                }
                document.querySelector("#table-entities-list").classList.toggle("notext");
                return false;
            };
            this.newTool("Только темы", "btn-danger", callback);
        }
        incertSearchHideBtn() {
            let callback = () => {
                var themesIds = [];
                var captions = document.querySelectorAll(
                    "#table-entities-list .message-caption"
                );
                for (let elem of captions) {
                    var themeId = elem
                        .querySelector("a")
                        .href.match(/.*?view\/(\d*?)(\?.*?)?$/)[1];
                    elem.classList.add("caption-" + themeId);
                    if (themesIds.indexOf(themeId) == -1) {
                        themesIds.push(themeId);
                    } else {
                        elem.classList.toggle("duplicate");
                    }
                }
                document.querySelector("#table-entities-list").classList.toggle("notext");
                return false;
            };
            this.newTool("Только темы", "btn-danger", callback);
        }
        insertBBCodes() {
            let self = this;
            GM_addStyle(BB_CODES_STYLES);

            function wrapText(elementID, tag) {
                let openTag = `{{${tag}}}`;
                let closeTag = `{{/${tag}}}`;
                let textArea = $(elementID);
                let len = textArea.val().length;
                let start = textArea[0].selectionStart;
                let end = textArea[0].selectionEnd;
                let selectedText = textArea.val().substring(start, end);
                let replacement = openTag + selectedText + closeTag;
                textArea.val(
                    textArea.val().substring(0, start) +
                    replacement +
                    textArea.val().substring(end, len)
                );
            }
            let btnBlock = $("<div/>", {
                id: "btn-block"
            });
            $("body").on("click", ".bb_btn", function(e) {
                wrapText(self.messageTextarea, e.target.value);
            });
            let ctrlKey = 17;
            let ctrlDown = false;
            $(self.messageTextarea)
                .keydown(function(e) {
                    if (e.keyCode == ctrlKey) ctrlDown = true;
                    if (ctrlDown) {
                        switch (e.keyCode) {
                            case 66:
                                e.preventDefault();
                                $("#bb_b").click();
                                break;
                            case 85:
                                e.preventDefault();
                                $("#bb_u").click();
                                break;
                            case 73:
                                e.preventDefault();
                                $("#bb_i").click();
                                break;
                        }
                    }
                })
                .keyup(function(e) {
                    if (e.keyCode == ctrlKey) ctrlDown = false;
                });
            $.each(self.bbCodeButtons, function(i) {
                var btnVal, btnTxt, btnTitle;
                btnVal = btnTxt = this.name;
                if (this.hasOwnProperty("value")) {
                    btnVal = this.value;
                }
                btnTxt = this.name;
                btnTitle = this.title;
                $("<button/>", {
                    value: btnVal,
                    text: btnTxt,
                    class: "bb_btn",
                    "data-key": this.key,
                    id: "bb_" + btnVal,
                    title: btnTitle,
                    type: "button"
                }).appendTo(btnBlock);
            });
            btnBlock.insertBefore(self.messageTextarea);
        }
    }
    new BugtrackSettings();
})();