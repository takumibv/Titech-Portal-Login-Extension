"use strict";

var req_nums = $("th:contains('[')");
var req_reg = /\[(\w),(\w)\]/;

if (!matrix_code) {
	$("center").eq(1).append("<div id='option_link'>" + "<p>" + chrome.i18n.getMessage("con_setting_matrix_msg") + "</p>" + "<p class='note'>" + chrome.i18n.getMessage("con_chrome_extension") + "</p>" + "</div>");
} else if (!is_valid) {
	$("center").eq(1).append("<div id='option_link'>" + "<p>" + chrome.i18n.getMessage("con_invalid_msg") + "</p>" + "<p class='note'>" + chrome.i18n.getMessage("con_chrome_extension") + "</p>" + "</div>");
} else {
	var res1 = req_reg.exec(req_nums.eq(0).html());
	var res2 = req_reg.exec(req_nums.eq(1).html());
	var res3 = req_reg.exec(req_nums.eq(2).html());
	var code1 = matrix_code[parseInt(res1[2]) - 1][res1[1].charCodeAt() - 65];
	var code2 = matrix_code[parseInt(res2[2]) - 1][res2[1].charCodeAt() - 65];
	var code3 = matrix_code[parseInt(res3[2]) - 1][res3[1].charCodeAt() - 65];
	$("input[type=password]").eq(0).val(code1);
	$("input[type=password]").eq(1).val(code2);
	$("input[type=password]").eq(2).val(code3);
	$("input[type=submit]").click();

	$("center").first().prepend("<p>" + chrome.i18n.getMessage("con_doing_login_msg") + "</p>");
}

$("#option_link").on('click', function () {
	chrome.runtime.sendMessage({ id: "open_options_page" });
});