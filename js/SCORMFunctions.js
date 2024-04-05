var strStartDate;
var strEndDate;
var pcount = 0;
var completedslide = -1;
var page, cpage;

/* variable added */
var qpage = "null";

var lessoncomplt = false;

var slideStatusArr_LMS;
//var FromLMSVal = false;
// Resize function
var winWidth;
var winHeight;
var pixelRatio;

function currentBoxW() {
    return $('#page-wrap').width();
    or 
    return $('#page-wrap').innerWidth(); //depending on the requirement. 
  }
  
function currentBoxH() {
    return $('#page-wrap').height();
    or 
    return $('#page-wrap').innerHeight(); //depending on the requirement. 
  }
  
function resize() 
{
	if (typeof (window.innerWidth) == 'number') 
	{
		winWidth = window.innerWidth;
		winHeight = window.innerHeight;
	} else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) 
	{
		//IE 6+ in 'standards compliant mode'
		winWidth = document.documentElement.clientWidth;
		winHeight = document.documentElement.clientHeight;
	} else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
		//IE 4 compatible
		winWidth = document.body.clientWidth;
		winHeight = document.body.clientHeight - 10;
	}  	
	
	if(winWidth<=winHeight)
	{
		pixelRatio = 10 * (winWidth/1440) + 'px';
		if(document.getElementById('page-wrap').offsetHeight > winHeight)
			pixelRatio = 10 * (winHeight/1050) + 'px';
	}
	else if(winWidth>winHeight) 
	{
		pixelRatio = 10 * (winHeight/1050) + 'px';
		if(document.getElementById('page-wrap').offsetWidth > winWidth)
			pixelRatio = 10 * (winWidth/1440) + 'px';
	}
	document.getElementById('MainBody').style.fontSize = pixelRatio;
	console.log(winWidth+" "+winHeight+" "+pixelRatio);
	console.log("doc width"+document.getElementById('page-wrap').offsetWidth);
	console.log("doc height"+document.getElementById('page-wrap').offsetHeight);
}   

    
function doEntryTasks() {
	resize();
    try {		
	//alert("IN");
    strStartDate = new Date();
    doLMSInitialize();
	
	checklesson_status();
	
	fnCheckBookMark();
	function fnCheckBookMark() {
		var cnt = 0;
		var intervalVar = setInterval(function(){ 
		cnt++;
		
			if (cnt == 5) {				
				getBookmark();
				getslidedata();				
				//page ='70_8'
				//cpage = "1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0*5:5:0:100%:2I3I1I1,2,3,4I1 "			
				if(page == null || page == 'null' || page == undefined || page == 'undefined' || page == ""){
					pcount = -1;
					mainNavCount = -1
					setslidedata(slideStatusArr.toString());
					navigation('Next');
				}else{
					//alert(cpage+' LMS '+page);
					
					/* below codes are modified */
					tempArr = cpage.split('*')
					qpage = tempArr[1]
					slideStatusArr = tempArr[0].split(',')
					/* ------------------------------------- */
					
					var temp = page.split('_')
					pcount = temp[0];	
					mainNavCount = temp[1];
					
					 /* if lesson completed is true */
					if(lessoncomplt){
						pcount = 1;	
					}
									
					navigation(pcount);
					
					if(pcount>1){
						EnableBackBtn();
					}
					
				}
				//alert(pcount)
				clearInterval(intervalVar);
				
			}
		}, 200);
	}
	
	}
	catch (ex) {
	}
				
}

function checklesson_status(){
	var lessonchk = doLMSGetValue("cmi.core.lesson_status");
	//alert(lessonchk + " : getvalue")
	if(lessonchk == "completed" || lessonchk == "passed"){
		lessoncomplt = true;
	}else{

		Lesson_incomplete();
	}
	
}

function setBookmark(num){
	//alert('lesson_location '+num)
	console.log("lesson location: "+num);
	doLMSSetValue("cmi.core.lesson_location", num);
	doLMSCommit();
}

function getBookmark(){
	
	page = doLMSGetValue("cmi.core.lesson_location");
}

function setslidedata(slidenum){
	console.log("slidenum : "+(slidenum+"*"+qpage));
	
	/* modified set value */
	doLMSSetValue("cmi.suspend_data", (slidenum+"*"+qpage));
	doLMSCommit();
}
function getslidedata(){
	cpage = doLMSGetValue("cmi.suspend_data");
}

function Lesson_Complete() {
    try {
        doLMSSetValue("cmi.core.lesson_status", "completed");
		doLMSCommit();
    }
    catch (ex) {
    }
}
function Lesson_incomplete() {
    try {
        doLMSSetValue("cmi.core.lesson_status", "incomplete");
		doLMSCommit();
    }
    catch (ex) {
    }
}
var IsUnloadCalled = false;
function callOnBeforeUnload() {
	//alert('');
    if (!IsUnloadCalled) {
        //Lesson_Complete();
		doExitTasks();
        IsUnloadCalled = true;
    }
}
/*$(function () {
	doEntryTasks();
    $(window).bind('beforeunload', function () { callOnBeforeUnload() });
});*/

  function doExitTasks() {
	try
	{
	  var formattedTime = "";
	  if (strStartDate) { 
			var currentDate = new Date().getTime();
			var elapsedSeconds = ((currentDate - strStartDate) / 1000);
			formattedTime = convertTotalSeconds(elapsedSeconds);
		}
		else {
			formattedTime = "00:00:00.0";
		}
		doLMSSetValue("cmi.core.session_time", formattedTime);    
		doLMSCommit();	
		doLMSFinish();
	}
	catch(ex)
	{		
	}
 }
 
 
function convertTotalSeconds(ts) {
    var sec = (ts % 60);

    ts -= sec;
    var tmp = (ts % 3600);  //# of seconds in the total # of minutes
    ts -= tmp;              //# of seconds in the total # of hours

    // convert seconds to conform to CMITimespan type (e.g. SS.00)
    sec = Math.round(sec * 100) / 100;

    var strSec = new String(sec);
    var strWholeSec = strSec;
    var strFractionSec = "";

    if (strSec.indexOf(".") != -1) {
        strWholeSec = strSec.substring(0, strSec.indexOf("."));
        strFractionSec = strSec.substring(strSec.indexOf(".") + 1, strSec.length);
    }

    if (strWholeSec.length < 2) {
        strWholeSec = "0" + strWholeSec;
    }
    strSec = strWholeSec;

    if (strFractionSec.length) {
        strSec = strSec + "." + strFractionSec;
    }


    if ((ts % 3600) != 0)
        var hour = 0;
    else var hour = (ts / 3600);
    if ((tmp % 60) != 0)
        var min = 0;
    else var min = (tmp / 60);

    if ((new String(hour)).length < 2)
        hour = "0" + hour;
    if ((new String(min)).length < 2)
        min = "0" + min;

    var rtnVal = hour + ":" + min + ":" + strSec;

    return rtnVal;
}
