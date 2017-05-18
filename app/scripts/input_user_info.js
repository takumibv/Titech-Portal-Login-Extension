"use strict";

if (!usr_pswd) {
	$("center").eq(1).append("<div id='option_link'>" + "<p>" + chrome.i18n.getMessage("con_setting_account_msg") + "</p>" + "<p class='note'>" + chrome.i18n.getMessage("con_chrome_extension") + "</p>" + "</div>");
} else if (!is_valid) {
	$("center").eq(1).append("<div id='option_link'>" + "<p>" + chrome.i18n.getMessage("con_invalid_msg") + "</p>" + "<p class='note'>" + chrome.i18n.getMessage("con_chrome_extension") + "</p>" + "</div>");
} else {
	$("input[name=usr_name]").val(usr_pswd.account);
	$("input[name=usr_password]").val(usr_pswd.pswd);
	$("input[type=submit]").click();
	$("center").first().prepend("<p>" + chrome.i18n.getMessage("con_doing_login_msg") + "</p>");
}

$("#option_link").on('click', function () {
	chrome.runtime.sendMessage({ id: "open_options_page" });
});