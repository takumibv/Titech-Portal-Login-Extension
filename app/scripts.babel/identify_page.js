/* page_type
* 1: Account、Passwordの入力ページ
* 2: マトリックスコード３つの入力ページ
* 3: エラーページ
* 4: その他,
****/
var page_type = 4;

var account = $("th:contains('Account')");
var pass = $("th:contains('Password')");
if(account.length == 1 && pass.length == 1){
	page_type = 1;
}

var num = $("th:contains('[')");
if(num.length == 3){
	page_type = 2;
}

var err_msg = $("th:contains('Message')");
if(err_msg.length == 1){
	page_type = 3;
}

chrome.runtime.sendMessage({id: "identify_page", page_type: page_type});