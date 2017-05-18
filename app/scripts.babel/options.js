'use strict';

var option;

$(function() {
    class Options {
        constructor() {
            this.init();
            this.start();
        }
        init() {
            this.makeTable();
        }
        start() {
            this.assignMessages();
            this.assignEventHandlers();
            this.restoreConfigurations();
        }
        makeTable() {
            var table = $("<tbody>").appendTo($("#matrix_code_form .matrix_code"));
            var row, col;
            for(row = 0; row <= 7; row++){
                var t_tr = $("<tr>").appendTo(table);
                t_tr.append("<th>"+ row +"</th>");
                for(col = "A".charCodeAt(); col <= "J".charCodeAt(); col++){
                    if(row == 0){
                        t_tr.append("<th>"+ String.fromCharCode(col) +"</th>");
                    }else{
                        t_tr.append("<td><input class='serialn' type='text' name="+ String.fromCharCode(col) + row +" size='1' maxlength='1'></td>")
                    }
                }
            }
        }
        setMatrix(data) {
            var i,j = 0;

            for(i=0;i<7;i++){
                for(j=0;j<10;j++){
                    $("#matrix_code_form .serialn")[i*10+j].value = data[i][j];
                }
            }
        }
        saveUser(callback) {
            chrome.runtime.getBackgroundPage((backgroundPage) => {
                let bg       = backgroundPage.bg;
                var user     = {};
                user.account = $("#account_pswd_form [name='account']").val();
                user.pswd    = $("#account_pswd_form [name='pswd']").val();
                var is_valid = (user.account!="" && user.account!="");

                if(is_valid) bg.setUserConfig(user);
                callback(is_valid);
            });
        }
        saveMatrix(callback) {
            chrome.runtime.getBackgroundPage((backgroundPage) => {
                let bg       = backgroundPage.bg;
                var i,j,k    = 0;
                var pass     = [];
                var is_valid = true;

                for(i=0; i<7; i++){
                    pass[i] = [];
                    for(j=0; j<10; j++){
                        var inp = /\w/.exec($("#matrix_code_form .serialn")[i*10+j].value);
                        if(inp){
                            pass[i][j] = inp.input;
                        }else{
                            is_valid = false;
                            break;
                        }
                    }
                    if(!is_valid) break;
                }
                if(is_valid) bg.setMatrixCode(pass);
                callback(is_valid);
            });
        }
        switchValid() {

        }
        assignMessages() {
            let hash = {
                "setting_page_title": "opt_setting_page_title",
                "setting_msg": "opt_setting_msg",
                "validation_check_msg": "opt_validation_check_msg",
                "account_pswd_title": "opt_account_pswd_title",
                "show_pswd": "opt_show_pswd",
                "clear_account_msg": "opt_clear_account_msg",
                "matrix_code_title": "opt_matrix_code_title",
                "clear_matrix_msg": "opt_clear_matrix_msg",
            };
            for (var key in hash) {
                $("#" + key).html(chrome.i18n.getMessage(hash[key]));
            }
            let hash_for_val = {
                "account_pswd_save_btn" : "opt_account_pswd_save_btn",
                "clear_account_pswd" : "opt_clear_account_pswd",
                "passsave" : "opt_passsave",
                "clear_matrix" : "opt_clear_matrix",
            }
            for (var key in hash_for_val) {
                $("#" + key).val(chrome.i18n.getMessage(hash_for_val[key]));
            }
        }
        assignEventHandlers() {
            $("#show_pswd").on("click", function() {
                var inp_pswd = $("#account_pswd_form [name='pswd']");
                if(inp_pswd.attr("type") == "password"){
                    inp_pswd.attr({type: "text"});
                    $(this).html(chrome.i18n.getMessage("opt_hide_pswd"));
                }else{
                    inp_pswd.attr({type: "password"});
                    $(this).html(chrome.i18n.getMessage("opt_show_pswd"));
                }
                return false;
            });

            $("#account_pswd_form").on("submit", function() {
                option.saveUser(function (res) {
                    if(res){
                        alert(chrome.i18n.getMessage("opt_save_account_success"));
                    }else{
                        alert(chrome.i18n.getMessage("opt_save_account_failed"));
                    }
                });
                return false;
            });

            $("#clear_account_pswd").on("click", function() {
                chrome.runtime.getBackgroundPage((backgroundPage) => {
                    let bg = backgroundPage.bg;
                    if(confirm(chrome.i18n.getMessage("opt_confirm_clear_account_pswd"))){
                        bg.deleteUserConfig();
                        $("#account_pswd_form [name='account']").val("");
                        $("#account_pswd_form [name='pswd']").val("");
                        alert(chrome.i18n.getMessage("opt_clear_account_pswd_success"));
                    }
                });
            });

            $("#matrix_code_form").on("submit", function() {
                option.saveMatrix(function (res) {
                    if(res){
                        alert(chrome.i18n.getMessage("opt_save_matrix_success"));
                    }else{
                        alert(chrome.i18n.getMessage("opt_save_matrix_failed"));
                    }
                });
                return false;
            });

            $("#clear_matrix").on("click", function() {
                chrome.runtime.getBackgroundPage((backgroundPage) => {
                    let bg = backgroundPage.bg;
                    if(confirm(chrome.i18n.getMessage("opt_confirm_clear_matrix"))) {
                        bg.deleteMatrixCode();
                        $("#matrix_code_form .serialn").val("");
                        alert(chrome.i18n.getMessage("opt_clear_matrix_success"));
                    }
                });
            });

            $(".serialn").focus(function() {
                $(this).select();
            });

            $(".serialn").keyup(function() {
                var index       = $(".serialn").index(this);
                var next_input  = $(".serialn").eq(index+1);
                next_input.focus();
            });

            $("#is_valid_checkbox").on("click", function() {
                chrome.runtime.getBackgroundPage((backgroundPage) => {
                    let bg          = backgroundPage.bg;
                    var is_valid    = !bg.getIsValid();
                    var msg         = is_valid ? chrome.i18n.getMessage("opt_valid_msg") : chrome.i18n.getMessage("opt_invalid_msg");
                    bg.setIsValid(is_valid);
                    $("#is_valid_checkbox [name='is_valid']").prop("checked", is_valid);
                    alert(msg);
                });
            });
        }
        restoreConfigurations() {
            chrome.runtime.getBackgroundPage((backgroundPage) => {
                let bg          = backgroundPage.bg;
                var matrix_data = bg.getMatrixCode();
                var usr         = bg.getUserConfig();
                var is_valid    = bg.getIsValid();
                if(matrix_data) option.setMatrix(matrix_data);
                if(usr){
                    $("#account_pswd_form [name='account']").val(usr.account);
                    $("#account_pswd_form [name='pswd']").val(usr.pswd);
                }
                $("#is_valid_checkbox [name='is_valid']").prop("checked", is_valid);
            });
        }
    }

    option = new Options();
});