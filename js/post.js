
    function uidgetter(){   
        WB2.anyWhere(function(W){
        W.parseCMD('/account/get_uid.json', function(oResult, bStatus) {
            if(bStatus) {
                var uidjson = oResult;
                uid = uidjson.uid;
                //alert(uid);
                classchanger(1);
            }
        }, {

        }, {
            method : 'get',
            cache_time : 30
        });
    });
    };

function posts(){
    titleval = $('#title').val();
    dlurl = $('#dlurl').val();
    $.ajax({
        type: 'POST',
        url: 'http://doams.shiguang.us/init/dataposter.php',
        data:{'uid':uid, 'title':titleval, 'dlurl':dlurl},
        success: function(data){
            //alert(data);
            var returndata = jQuery.parseJSON(data);
            status = returndata.status;
            ffurl = returndata.ffurl;
            $("#finalurl").val(ffurl);
            classchanger(2);
        },
        error: function(xhr, desc, err) {
            console.log(xhr);
            console.log("Details: " + desc + "\nError:" + err);
      }
    });
};

<!-- 新浪微博js组件加载 -->

$('#wb_login').click(function() {
    WB2.login(function() {
        uidgetter();
    });
});


<!--登陆成功之后改变按钮样式 -->

function classchanger(step){
	switch (step) {
		case 1:
			$("#wb_login").hide();
			$("#wb_logindone").show();
			$("#step1").removeClass("borderdone");
			$("#step2").addClass("borderdone");
			break;
		case 2:
			$("#postbtn").hide();
			$("#postbtndone").show();
			$("#step2").removeClass("borderdone");
			$("#step3").addClass("borderdone");
			break;
	};

	};
