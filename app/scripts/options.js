'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var option;

$(function () {
    var Options = function () {
        function Options() {
            _classCallCheck(this, Options);

            this.init();
            this.start();
        }

        _createClass(Options, [{
            key: "init",
            value: function init() {
                this.makeTable();
            }
        }, {
            key: "start",
            value: function start() {
                this.assignMessages();
                this.assignEventHandlers();
                this.restoreConfigurations();
            }
        }, {
            key: "makeTable",
            value: function makeTable() {
                var table = $("<tbody>").appendTo($("#matrix_code_form .matrix_code"));
                var row, col;
                for (row = 0; row <= 7; row++) {
                    var t_tr = $("<tr>").appendTo(table);
                    t_tr.append("<th>" + row + "</th>");
                    for (col = "A".charCodeAt(); col <= "J".charCodeAt(); col++) {
                        if (row == 0) {
                            t_tr.append("<th>" + String.fromCharCode(col) + "</th>");
                        } else {
                            t_tr.append("<td><input class='serialn' type='text' name=" + String.fromCharCode(col) + row + " size='1' maxlength='1'></td>");
                        }
                    }
                }
            }
        }, {
            key: "setMatrix",
            value: function setMatrix(data) {
                var i,
                    j = 0;

                for (i = 0; i < 7; i++) {
                    for (j = 0; j < 10; j++) {
                        $("#matrix_code_form .serialn")[i * 10 + j].value = data[i][j];
                    }
                }
            }
        }, {
            key: "saveUser",
            value: function saveUser(callback) {
                chrome.runtime.getBackgroundPage(function (backgroundPage) {
                    var bg = backgroundPage.bg;
                    var user = {};
                    user.account = $("#account_pswd_form [name='account']").val();
                    user.pswd = $("#account_pswd_form [name='pswd']").val();
                    var is_valid = user.account != "" && user.account != "";

                    if (is_valid) bg.setUserConfig(user);
                    callback(is_valid);
                });
            }
        }, {
            key: "saveMatrix",
            value: function saveMatrix(callback) {
                chrome.runtime.getBackgroundPage(function (backgroundPage) {
                    var bg = backgroundPage.bg;
                    var i,
                        j,
                        k = 0;
                    var pass = [];
                    var is_valid = true;

                    for (i = 0; i < 7; i++) {
                        pass[i] = [];
                        for (j = 0; j < 10; j++) {
                            var inp = /\w/.exec($("#matrix_code_form .serialn")[i * 10 + j].value);
                            if (inp) {
                                pass[i][j] = inp.input;
                            } else {
                                is_valid = false;
                                break;
                            }
                        }
                        if (!is_valid) break;
                    }
                    if (is_valid) bg.setMatrixCode(pass);
                    callback(is_valid);
                });
            }
        }, {
            key: "switchValid",
            value: function switchValid() {}
        }, {
            key: "assignMessages",
            value: function assignMessages() {
                var hash = {
                    "setting_page_title": "opt_setting_page_title",
                    "setting_msg": "opt_setting_msg",
                    "validation_check_msg": "opt_validation_check_msg",
                    "account_pswd_title": "opt_account_pswd_title",
                    "show_pswd": "opt_show_pswd",
                    "clear_account_msg": "opt_clear_account_msg",
                    "matrix_code_title": "opt_matrix_code_title",
                    "clear_matrix_msg": "opt_clear_matrix_msg"
                };
                for (var key in hash) {
                    $("#" + key).html(chrome.i18n.getMessage(hash[key]));
                }
                var hash_for_val = {
                    "account_pswd_save_btn": "opt_account_pswd_save_btn",
                    "clear_account_pswd": "opt_clear_account_pswd",
                    "passsave": "opt_passsave",
                    "clear_matrix": "opt_clear_matrix"
                };
                for (var key in hash_for_val) {
                    $("#" + key).val(chrome.i18n.getMessage(hash_for_val[key]));
                }
            }
        }, {
            key: "assignEventHandlers",
            value: function assignEventHandlers() {
                $("#show_pswd").on("click", function () {
                    var inp_pswd = $("#account_pswd_form [name='pswd']");
                    if (inp_pswd.attr("type") == "password") {
                        inp_pswd.attr({ type: "text" });
                        $(this).html(chrome.i18n.getMessage("opt_hide_pswd"));
                    } else {
                        inp_pswd.attr({ type: "password" });
                        $(this).html(chrome.i18n.getMessage("opt_show_pswd"));
                    }
                    return false;
                });

                $("#account_pswd_form").on("submit", function () {
                    option.saveUser(function (res) {
                        if (res) {
                            alert(chrome.i18n.getMessage("opt_save_account_success"));
                        } else {
                            alert(chrome.i18n.getMessage("opt_save_account_failed"));
                        }
                    });
                    return false;
                });

                $("#clear_account_pswd").on("click", function () {
                    chrome.runtime.getBackgroundPage(function (backgroundPage) {
                        var bg = backgroundPage.bg;
                        if (confirm(chrome.i18n.getMessage("opt_confirm_clear_account_pswd"))) {
                            bg.deleteUserConfig();
                            $("#account_pswd_form [name='account']").val("");
                            $("#account_pswd_form [name='pswd']").val("");
                            alert(chrome.i18n.getMessage("opt_clear_account_pswd_success"));
                        }
                    });
                });

                $("#matrix_code_form").on("submit", function () {
                    option.saveMatrix(function (res) {
                        if (res) {
                            alert(chrome.i18n.getMessage("opt_save_matrix_success"));
                        } else {
                            alert(chrome.i18n.getMessage("opt_save_matrix_failed"));
                        }
                    });
                    return false;
                });

                $("#clear_matrix").on("click", function () {
                    chrome.runtime.getBackgroundPage(function (backgroundPage) {
                        var bg = backgroundPage.bg;
                        if (confirm(chrome.i18n.getMessage("opt_confirm_clear_matrix"))) {
                            bg.deleteMatrixCode();
                            $("#matrix_code_form .serialn").val("");
                            alert(chrome.i18n.getMessage("opt_clear_matrix_success"));
                        }
                    });
                });

                $(".serialn").focus(function () {
                    $(this).select();
                });

                $(".serialn").keyup(function () {
                    var index = $(".serialn").index(this);
                    var next_input = $(".serialn").eq(index + 1);
                    next_input.focus();
                });

                $("#is_valid_checkbox").on("click", function () {
                    chrome.runtime.getBackgroundPage(function (backgroundPage) {
                        var bg = backgroundPage.bg;
                        var is_valid = !bg.getIsValid();
                        var msg = is_valid ? chrome.i18n.getMessage("opt_valid_msg") : chrome.i18n.getMessage("opt_invalid_msg");
                        bg.setIsValid(is_valid);
                        $("#is_valid_checkbox [name='is_valid']").prop("checked", is_valid);
                        alert(msg);
                    });
                });
            }
        }, {
            key: "restoreConfigurations",
            value: function restoreConfigurations() {
                chrome.runtime.getBackgroundPage(function (backgroundPage) {
                    var bg = backgroundPage.bg;
                    var matrix_data = bg.getMatrixCode();
                    var usr = bg.getUserConfig();
                    var is_valid = bg.getIsValid();
                    if (matrix_data) option.setMatrix(matrix_data);
                    if (usr) {
                        $("#account_pswd_form [name='account']").val(usr.account);
                        $("#account_pswd_form [name='pswd']").val(usr.pswd);
                    }
                    $("#is_valid_checkbox [name='is_valid']").prop("checked", is_valid);
                });
            }
        }]);

        return Options;
    }();

    option = new Options();
});