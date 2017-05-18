'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ACCESS_URL = 'https://portal.nap.gsic.titech.ac.jp/GetAccess/Login';

$(function () {
    var Background = function () {
        function Background() {
            _classCallCheck(this, Background);

            this.assignEventHandlers();
            console.log("Auto Portal Login is running.");
        }

        _createClass(Background, [{
            key: 'assignEventHandlers',
            value: function assignEventHandlers() {
                chrome.runtime.onInstalled.addListener(function (details) {
                    console.log('previousVersion', details.previousVersion);
                    window.bg.migrateNewVersion();
                });
                chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
                    if (changeInfo.status == "complete" && tab.url.indexOf(ACCESS_URL) != -1) {
                        window.bg.identifyPage(tab.url);
                    }
                });
                chrome.runtime.onMessage.addListener(function (msg, sender, res) {
                    if (msg.id == "identify_page") {
                        /* page_type
                        * 1: Account、Passwordの入力ページ
                        * 2: マトリックスコード３つの入力ページ
                        * 3: エラーページ
                        * 4: その他,
                        ****/
                        var page_type = msg.page_type;
                        switch (page_type) {
                            case 1:
                                window.bg.inputUserInfo();
                                break;
                            case 2:
                                window.bg.inputMatrixCode();
                                break;
                            case 3:
                                window.bg.errorPage();
                                break;
                            default:
                                break;
                        }
                    } else if (msg.id == "open_options_page") {
                        chrome.runtime.openOptionsPage();
                    }
                });
            }
        }, {
            key: 'getUserConfig',
            value: function getUserConfig() {
                var value = localStorage['User'];
                if (value) {
                    value = JSON.parse(value);
                    value.account = window.atob(value.account);
                    value.pswd = window.atob(value.pswd);
                    return value;
                } else {
                    return null;
                }
            }
        }, {
            key: 'setUserConfig',
            value: function setUserConfig(value) {
                value.account = window.btoa(value.account);
                value.pswd = window.btoa(value.pswd);
                localStorage['User'] = JSON.stringify(value);
            }
        }, {
            key: 'deleteUserConfig',
            value: function deleteUserConfig() {
                localStorage.removeItem('User');
            }
        }, {
            key: 'getMatrixCode',
            value: function getMatrixCode() {
                var value = localStorage['MatrixCode'];
                if (value) {
                    var val_str = window.atob(window.atob(value));
                    return JSON.parse(JSON.parse(val_str));
                } else {
                    return null;
                }
            }
        }, {
            key: 'setMatrixCode',
            value: function setMatrixCode(value) {
                var val_str = JSON.stringify(JSON.stringify(value));
                var val_enc = window.btoa(window.btoa(val_str));
                localStorage['MatrixCode'] = val_enc;
            }
        }, {
            key: 'deleteMatrixCode',
            value: function deleteMatrixCode() {
                localStorage.removeItem('MatrixCode');
            }
        }, {
            key: 'getIsValid',
            value: function getIsValid() {
                var is_valid = localStorage['is_valid'];
                if (is_valid) {
                    return JSON.parse(is_valid);
                } else {
                    return true;
                }
            }
        }, {
            key: 'setIsValid',
            value: function setIsValid(value) {
                localStorage['is_valid'] = value;
            }
        }, {
            key: 'getOptionPageUrl',
            value: function getOptionPageUrl() {
                return chrome.runtime.getURL("options.html");
            }
        }, {
            key: 'migrateNewVersion',
            value: function migrateNewVersion() {
                var old_matrix_str = localStorage['password'];
                if (old_matrix_str) {
                    var old_matrix = JSON.parse(JSON.parse(old_matrix_str));
                    this.setMatrixCode(old_matrix);
                    localStorage.removeItem('password');
                }
                var pass = localStorage['pass'];
                if (pass) {
                    localStorage.removeItem('pass');
                }
            }
        }, {
            key: 'identifyPage',
            value: function identifyPage(url) {
                chrome.tabs.executeScript(null, { file: "scripts/identify_page.js" });
            }
        }, {
            key: 'inputUserInfo',
            value: function inputUserInfo() {
                chrome.tabs.executeScript(null, { code: "var usr_pswd = " + JSON.stringify(this.getUserConfig()) + ";" + "var is_valid = " + JSON.stringify(this.getIsValid()) + ";"
                }, function () {
                    chrome.tabs.insertCSS(null, { file: "style/contents.css" });
                    chrome.tabs.executeScript(null, { file: "scripts/input_user_info.js" });
                });
            }
        }, {
            key: 'inputMatrixCode',
            value: function inputMatrixCode() {
                chrome.tabs.executeScript(null, { code: "var matrix_code = " + JSON.stringify(this.getMatrixCode()) + ";" + "var is_valid = " + JSON.stringify(this.getIsValid()) + ";"
                }, function () {
                    chrome.tabs.insertCSS(null, { file: "style/contents.css" });
                    chrome.tabs.executeScript(null, { file: "scripts/input_matrix_code.js" });
                });
            }
        }, {
            key: 'errorPage',
            value: function errorPage() {}
        }]);

        return Background;
    }();

    window.bg = new Background();
});