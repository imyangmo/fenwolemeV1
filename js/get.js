<!-- User ID getter -->
function uidgetter(){
WB2.anyWhere(function(W){
		W.parseCMD('/account/get_uid.json', function(oResult, bStatus) {
			if(bStatus) {
				var uidjson = oResult;
				loggeduid = uidjson.uid;
			}
		}, {

		}, {
			method : 'get',
			cache_time : 30
		});
	});
};

<!-- 关注函数 -->

function guanzhu() {
	WB2.anyWhere(function (W) {
	    W.widget.followButton({
			'uid': posteruid,	//用户昵称
			'id': "wb_follow_btn",
			'show_head' : true,	//是否显示头像
			'show_name' : true,	//是否显示名称
			'show_cancel': false,	//是否显示取消关注按钮
			'callback' : function(type, result) {
				relationcheck();
				console.log(type);
				console.log(result)
			}
		});
	});
}

<!-- 关注确认 -->

	function relationcheck(){
		WB2.anyWhere(function(W){
		W.parseCMD('/friendships/show.json', function(oResult, bStatus) {
			if(bStatus) {
				var relationresult = oResult;
				if (relationresult.source.following == true) { 
					distributor(1); 
					classchanger(2)
				}
				else
				{
					alert("还没有关注");
					guanzhu();
				}
			}
		}, {
			source_id: loggeduid,
			target_id: posteruid
		}, {
			method : 'get',
			cache_time : 30
		});
	});
	};


<!-- URL parameters getter -->

function getUrlParameters(parameter, staticURL, decode){
   /*
    Function: getUrlParameters
    Description: Get the value of URL parameters either from 
                 current URL or static URL
    Author: Tirumal
    URL: www.code-tricks.com
   */
   var currLocation = (staticURL.length)? staticURL : window.location.search,
       parArr = currLocation.split("?")[1].split("&"),
       returnBool = true;
   
   for(var i = 0; i < parArr.length; i++){
        parr = parArr[i].split("=");
        if(parr[0] == parameter){
            return (decode) ? decodeURIComponent(parr[1]) : parr[1];
            returnBool = true;
        }else{
            returnBool = false;            
        }
   }
   
   if(!returnBool) return false;  
}

/*数据获取*/

function datagetter(pidvalue){
	$.ajax({
		type: 'POST',
		url: 'http://doams.shiguang.us/init/datagetter.php',
		data:{'pid':pidvalue},
		success: function(data){
			var returndata = jQuery.parseJSON(data);
			posteruid = returndata.uid;
			title = returndata.title;
			dlurl = returndata.dlurl;
			//获取成功后隐藏loading 显示mian content
			$("#loading").hide();
			$("#maincontent").show();
			//分发显示标题内容
			distributor(2);
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
		guanzhu();
		classchanger(1);
	});
});

/*样式管理器*/

	function classchanger(step){
		switch (step) {
			case 1:
				$("#wb_login").hide();
				$("#wb_logindone").show();
				$("#step1").removeClass("borderdone");
				$("#step2").addClass("borderdone");
				$("#relationcheck").show();
				break;
			case 2:
				$("#step2").removeClass("borderdone");
				$("#step3").addClass("borderdone");
				$("relationcheck").addClass("disabled");
				break;
		};
	};
/*文字分发器*/
	function distributor(place){
		switch (place){
			case 1:
				$('#dlurl').val(dlurl);
				break;
			case 2:
				$('#filetitle').text(title);
				break;
		};
	};



$(document).ready(function(){
	//检查页面合法性
	var parachk = window.location.href;
	if (parachk.indexOf("?pid=") < 0) {
		window.location.replace("index.html");
	};
	//获取url的pid
	var pidvalue = getUrlParameters("pid", "", true);
	if (isNaN(pidvalue)) {
		window.location.replace("index.html");
	};
	//alert(pidvalue);
	//通过pid获取相关内容
	datagetter(pidvalue);
	uidgetter();
});
