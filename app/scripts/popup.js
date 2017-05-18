"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var popup;
$(function () {
    var Popup = function () {
        function Popup() {
            _classCallCheck(this, Popup);

            this.start();
        }

        _createClass(Popup, [{
            key: "start",
            value: function start() {
                this.assignMessages();
                this.assignEventHandlers();
                this.setDefaultSize();
                this.restoreConfigurations();
            }
        }, {
            key: "assignMessages",
            value: function assignMessages() {
                var hash = {
                    "validation_check_msg": "pop_validation_check_msg",
                    "usage_link": "pop_usage_link",
                    "option_page_link": "pop_option_page_link",
                    "usageModalLabel": "pop_usageModalLabel",
                    "usage_msg_1": "pop_usage_msg_1",
                    "usage_msg_2": "pop_usage_msg_2",
                    "usage_msg_3": "pop_usage_msg_3",
                    "usage_msg_4": "pop_usage_msg_4",
                    "usage_msg_5": "pop_usage_msg_5"
                };
                for (var key in hash) {
                    $("#" + key).html(chrome.i18n.getMessage(hash[key]));
                }
            }
        }, {
            key: "assignEventHandlers",
            value: function assignEventHandlers() {
                $('#usageModal').on('show.bs.modal', function (event) {
                    var button = $(event.relatedTarget); // Button that triggered the modal
                    var recipient = button.data('whatever'); // Extract info from data-* attributes
                    var modal = $(this);
                    modal.data('bs.modal').handleUpdate();
                    $("body").css({ height: "400px", width: "700px" });
                });

                $('#usageModal').on('hidden.bs.modal', function (event) {
                    $("body").css({ width: popup.w + "px", height: popup.h + "px" });
                });

                $(".option_link").on("click", function () {
                    chrome.runtime.sendMessage({ id: "open_options_page" });
                });

                $("#is_valid_checkbox").on("click", function () {
                    chrome.runtime.getBackgroundPage(function (backgroundPage) {
                        var bg = backgroundPage.bg;
                        var is_valid = !bg.getIsValid();
                        bg.setIsValid(is_valid);
                        $("#is_valid_checkbox [name='is_valid']").prop("checked", is_valid);
                    });
                });
            }
        }, {
            key: "setDefaultSize",
            value: function setDefaultSize() {
                this.w = $(document).width();
                this.h = $(document).height();
            }
        }, {
            key: "restoreConfigurations",
            value: function restoreConfigurations() {
                chrome.runtime.getBackgroundPage(function (backgroundPage) {
                    var bg = backgroundPage.bg;
                    var is_valid = bg.getIsValid();
                    $("#is_valid_checkbox [name='is_valid']").prop("checked", is_valid);
                });
            }
        }]);

        return Popup;
    }();

    popup = new Popup();
});