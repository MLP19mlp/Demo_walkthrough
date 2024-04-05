/* JavaScript Document - Girija */

var count = 0;
var userans = new Array();
var crans = new Array();
var resp_time = new Array();
var scoreArr = new Array();
var totalqns = 0;
var totalscore = 0;
var scre = 0;
var wscre = 0;
var assessmentStatus = "";
var feedbackClick = false;
var reviewFBFlag = false;
var user_review = false

var attempt = 0;

function setInitValues(){
	userans = new Array();	
	scoreArr = new Array();
	wscre = 0;
	scre = 0;
	//initquiz();
	for(i=0;i<totalqns;i++){
		userans[i] = 'undefined';
		scoreArr[i] = 0;
	}
	reviewFBFlag = false;
	$('#fb').html("")
	$('#fb').hide();
	
	$("input:checkbox").attr("disabled", false);	
	$("input:radio").attr("disabled", false);	
	
}

/* modified document ready function and added init quiz function */

$(document).ready(function(e) {
	if(qpage == 'null'){
    	initquiz();
	}else{
		user_review = true;
		resultDiv();
		
	}
});

function initquiz(){

	//disablebtn();	
	xmlDoc=loadXMLDoc("xml/quiz.xml");
	
	x=xmlDoc.getElementsByTagName("qnumber");
	totalqns = x.length;
	
	anskey();
	clickevents();
	
	loadquestion(count);
	
	$('input:radio').click(function(e) {
		//alert("Radio "+user_review);
		if(user_review){
			e.preventDefault();
			return;
		}
		if(count < totalqns){		
			userans[count] = $('input[name=un1]:radio:checked').val();
			//resp_time[count] = hdntime.value;
				
		}		
		nextBtn();
		checkSubmitBtnState();		
	});
	$('input:checkbox').click(function(e) {
		if(user_review){
			e.preventDefault();
			return;
		}	
		var slectedOptions = [];
		 $.each($("input[name='ch1']:checked"), function(){            
                slectedOptions.push($(this).val());
            });
		if(count < totalqns){
			if(slectedOptions.length<=0){
				userans[count] = 'undefined'
			}
			else{
				userans[count] = slectedOptions
			}
			//resp_time[count] = hdntime.value;
		}	
		nextBtn();		
		checkSubmitBtnState()		
	});
	$('#ass_sub').click(function(e){
		feedback();
	})	

}

function nxtDisabled(){
	if(!reviewFBFlag)
	{
		$('#ass_nxt').unbind('click');
		$('#ass_nxt').css('opacity','0.5').css('cursor','default');
	}
}

function nextBtn(){
	///// VEEV
	//console.log("nextBtn"+userans[count]);
	if(userans[count]== undefined || userans[count]== 'undefined')
	{
		nxtDisabled();	
	}
	else
	{
		$('#ass_nxt').bind('click');
		$('#ass_nxt').css('opacity','1').css('cursor','pointer');
		$('#ass_nxt').click(function(e) 
		{
				
			if(count < totalqns){	//alert("nxt "+count);				
				if(count != totalqns) {
					//$('input[name=un1]:radio:checked').attr('checked', false);
					count++;
					if(count < totalqns)
					loadquestion(count);
					$('#reviewBlock').hide();
					$('.ques_block').show();
				}
				else
				{
					if(reviewFBFlag)
					{
						$('#resultBlock').show();
						$('.ques_block').hide();
						$('#reviewBlock').hide();
					}
				}
				//alert(userans)
			}
			//alert(count + " :: " +totalqns)
			if(count == totalqns){			
			//	alert('end')
				if(user_review){
						$('#resultBlock').show();
						$('.ques_block, reviewBlock').hide();
						return;
					}
					attempt = 1;
					$('#reviewBlock').show();
					$('.ques_block').hide();				
				
			}
			
			e.stopImmediatePropagation();
		});
	 }
}

function reviewFB(cn)
{	

	//console.log("reviewFB"+crans[cn]+" :: "+userans[cn]);
	$("input:checkbox").attr("disabled", true);	
	$("input:radio").attr("disabled", true);	
	$('#fb').show();
	
	var fbArray = crans[cn].split(",");

	for(var i=0; i<fbArray.length; i++)
	{
		switch(fbArray[i])
		{
			case "1":	fbArray[i] = " a)";
						break;			
			case "2":	fbArray[i] = " b)";
						break;
			case "3":	fbArray[i] = " c)";
						break; 
			case "4":	fbArray[i] = " d)";
						break;
			case "5":	fbArray[i] = " e)";
						break;
			case "6":	fbArray[i] = " f)";
						break;
			case "7":	fbArray[i] = " g)";
						break;
		}
	}
	
	if(crans[cn] == userans[cn])//if (correct answer from xml == user answer)
	{
		$('#fb').html('<strong class="rt_fb">You got it Right.</strong>' + '<br/><br/>');
	}
	else
	{
		$('#fb').html('<strong class="wrng_fb">You got it Wrong.</strong>' + '<strong class="wrng_fb"> Correct Answer: ' + fbArray + '</strong><br/><br/>');
	}
}

function clickevents(){

$('#reviewBtn').click(function(e) {
    $('#reviewBlock').hide();
	$('.ques_block').show();
	count = 0;
	loadquestion(count);
	nextBtn();
});

$('#reviewEndBtn').click(function(e) {

    $('#reviewBlock, #resultBlock').hide();
	$('.ques_block').show();
	user_review = true;
	reviewFBFlag = true;
	count = 0;
	anskey();
	loadquestion(count);
	nextBtn();
});

$('#submitBtn').click(function(e) {
    feedback();
});

$('#RetryBtn').click(function(e) {

	$('#reviewBlock, #resultBlock').hide();
	$('.ques_block').show();
    restartQuz();
});
}
function restartQuz(){
	count = 0;
	attempt = 0;
	userans = new Array();
	user_review = false
	setInitValues();
	loadquestion(count);
}


function loadXMLDoc(dname){	
	if (window.XMLHttpRequest){
	  xhttp=new XMLHttpRequest();
	} else{
	  xhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xhttp.open("GET",dname,false);
	xhttp.send();
	return xhttp.responseXML;
}

function anskey(){
	
	for(var k = 0; k<totalqns; k++){
		x=xmlDoc.getElementsByTagName("correctanswer");
		crans[k] = (x[k].childNodes[0].nodeValue);
		
	}	
}

function loadquestion(n){

	if(attempt == 0){
		nxtDisabled();
	}

	if(n == 0){
		$('#ass_nxt').css('opacity','0.5').css('cursor','default');
		//$('#ass_nxt').css('opacity','1');
	} 
	
//showAnsQuestion();
	disableButton = false;
	tempBol = false;
	count = n;
	x=xmlDoc.getElementsByTagName("questiontype");	
	var ansString=x[n].childNodes[0].nodeValue;
	
	if(ansString=='MCQ'){
		document.getElementById('SingleSelectQus').style.display = "none";
		document.getElementById('MultipleSelectQus').style.display = "block";
		//return;
	}
	else{
		document.getElementById('SingleSelectQus').style.display = "block";
		document.getElementById('MultipleSelectQus').style.display = "none";
	}
	
	//checkBtnState();
	$('input[name=un1]:radio:checked').attr('checked', false);
	$('input[name=ch1]:checkbox:checked').attr('checked', false);
	$('#audio_icon'+(n+1)).css('background-position','right').css('color','#000');

	if(!user_review){
		
	if(userans[count] != 'undefined' && userans[count] != undefined){		
		if(userans[count]){
			
			if(ansString=='MCQ'){
				
				for(i=0;i<userans[count].length;i++){
					
					var sel = 'checkboxG'+userans[count][i];
									
					document.getElementById(sel).checked =  true;
										
				}
				
			}
			else{
				
				var sel = 'answer'+userans[count];
				document.getElementById(sel).checked = true;
				
			}			

		}
	}
	} else {
		$('input[name=un1]:radio:checked').attr('checked', false);
		$('input[name=ch1]:checkbox:checked').attr('checked', false);		
	}
	
	x=xmlDoc.getElementsByTagName("qnumber");
	var qno = ("Q" + (x[n].childNodes[0].nodeValue) + ".");
	$('.qst_no').html(qno);		

	x=xmlDoc.getElementsByTagName("qtxt");
	$('#qtxt').html((x[n].childNodes[0].nodeValue));

	
	if(ansString=='MCQ'){
		x=xmlDoc.getElementsByTagName("option1");
		$('#Mopt1').html((x[n].childNodes[0].nodeValue));
		x=xmlDoc.getElementsByTagName("option2");
		$('#Mopt2').html((x[n].childNodes[0].nodeValue));
	}
	else{
		x=xmlDoc.getElementsByTagName("option1");
		$('#opt1').html((x[n].childNodes[0].nodeValue));
		x=xmlDoc.getElementsByTagName("option2");
		$('#opt2').html((x[n].childNodes[0].nodeValue));
	}

	if(ansString=='MCQ'){	
		///// VEEV
		x=xmlDoc.getElementsByTagName("option3");
				
		if(x[n].childNodes[0]){
			$('#Mopt3').html((x[n].childNodes[0].nodeValue));
			$('#mlab3').css('display','block')
		}
		else{
			$('#mlab3').css('display','none')
		}
		x=xmlDoc.getElementsByTagName("option4");
		if(x[n].childNodes[0]){				
			$('#Mopt4').html((x[n].childNodes[0].nodeValue));
			$('#mlab4').css('display','block')
		}
		else{
			$('#mlab4').css('display','none')
		}
		x=xmlDoc.getElementsByTagName("option5");
		if(x[n].childNodes[0]){				
			$('#Mopt5').html((x[n].childNodes[0].nodeValue));
			$('#mlab5').css('display','block')
		}
		else{
			$('#mlab5').css('display','none')
		}
		x=xmlDoc.getElementsByTagName("option6");
		if(x[n].childNodes[0]){				
			$('#Mopt6').html((x[n].childNodes[0].nodeValue));
			$('#mlab6').css('display','block')
		}
		else{
			$('#mlab6').css('display','none')
		}
		x=xmlDoc.getElementsByTagName("option7");
		if(x[n].childNodes[0]){				
			$('#Mopt7').html((x[n].childNodes[0].nodeValue));
			$('#mlab7').css('display','block')
		}
		else{
			$('#mlab7').css('display','none')
		}		
	}
	else{
		x=xmlDoc.getElementsByTagName("option3");
		
		if(x[n].childNodes[0]){
			$('#opt3').html((x[n].childNodes[0].nodeValue));
			$('#lab3').css('display','block')
		}
		else{
			$('#lab3').css('display','none')
		}
		x=xmlDoc.getElementsByTagName("option4");
		if(x[n].childNodes[0]){				
			$('#opt4').html((x[n].childNodes[0].nodeValue));
			$('#lab4').css('display','block')
		}
		else{
			$('#lab4').css('display','none')
		}	
		x=xmlDoc.getElementsByTagName("option5");
		
		if(x[n].childNodes[0]){				
			$('#opt5').html((x[n].childNodes[0].nodeValue));
			$('#lab5').css('display','block')
		}
		else{
			$('#lab5').css('display','none')
		}
		x=xmlDoc.getElementsByTagName("option6");
		
		if(x[n].childNodes[0]){				
			$('#opt6').html((x[n].childNodes[0].nodeValue));
			$('#lab6').css('display','block')
		}
		else{
			$('#lab6').css('display','none')
		}
		x=xmlDoc.getElementsByTagName("option7");
		
		if(x[n].childNodes[0]){				
			$('#opt7').html((x[n].childNodes[0].nodeValue));
			$('#lab7').css('display','block')
		}
		else{
			$('#lab7').css('display','none')
		}			
	}

	if(user_review){

	nextBtn();
			if(ansString=='MCQ'){

				var ansArr = crans[count].split(',')		
				var tempArr = userans[count].split(',');	
				
				for(i=0;i<tempArr.length;i++){					
					var sel = 'checkboxG'+tempArr[i];					
					document.getElementById(sel).checked =  true;
								
				}
				
			}
			else{
				
				var sel = 'answer'+userans[count];
				
				document.getElementById(sel).checked = true;
				var CorrectAns = crans[count];
					
			}
			if(reviewFBFlag)
			reviewFB(count);
	}
}
function checkSubmitBtnState(){
	var cnt = 0
	for(var x = 0; x<totalqns; x++){
		if(userans[x] != 'undefined' && userans[x] != undefined){		
			cnt++
		} 
	}
	if(cnt == totalqns)	{
		$('#ass_sub').css('opacity','1').css("cursor","pointer");
		feedbackClick = true;
	}
	else{
		$('#ass_sub').css('opacity','0.5').css("cursor","default");
		feedbackClick = false;
	}		
}


function feedback(){
	$('#resultBlock').show();
	$('.ques_block, #reviewBlock').hide();
	if (feedbackClick == true){
	
	if(!user_review){
	
	//var DQuestionId = "";
	//var Qresult = "";
	doLMSSetValue("cmi.interactions._count", totalqns);	
	doLMSCommit();
	
	for(var x = 0; x<totalqns; x++){
		/* calculate score */		
		if(crans[x] == userans[x]){
			Qresult = "correct";
			scre++;
		} else {
			Qresult = "wrong";			
			wscre++;
		}
		/* send each Question answer details to LMS */
		DQuestionId = "Question"+ "_" + (x+1);		
		doLMSSetValue("cmi.interactions."+(x)+".id", DQuestionId);
		doLMSSetValue("cmi.interactions."+(x)+".type", "choice");
		doLMSSetValue("cmi.interactions."+(x)+".result", Qresult);
		//doLMSSetValue("cmi.interactions."+(x)+".latency", resp_time[x]);
		//doLMSSetValue("cmi.interactions."+(x)+".weighting","1");
		doLMSSetValue("cmi.interactions."+(x)+".correct_responses.0.pattern",crans[x]);
		doLMSSetValue("cmi.interactions."+(x)+".student_response", userans[x]);
		//console.log('correct answer  = '+crans[x]+":: my = "+userans[x]);
		console.log (scre);
	}
	doLMSCommit();
	}
	totalscore =  Math.round((scre / totalqns) * 100);
	$('#ttlscre').html(scre + ' answered correctly / ' + totalqns + ' questions');
	
	$('#tq').html(totalqns);
	$('#qa').html(scre);
	$('#qw').html(wscre);
	$('#mper').html(totalscore + '&#37;');
	
	/* variable qpage */
	var temp_user_val = userans[0]
	for(var i=1;i<userans.length;i++){
		temp_user_val = temp_user_val+"I"+userans[i]
	}
	qpage = $('#tq').html() + ":" + $('#qa').html() + ":" + $('#qw').html() + ":" + $('#mper').html()+":"+temp_user_val;

	setslidedata(slideStatusArr.toString());
	
	doLMSSetValue("cmi.core.score.raw", totalscore);	
	if(totalscore < 50){
		$('#RetryBtn').show();
		slideStatusArr[78] = 0;
		//doLMSSetValue("cmi.core.lesson_status", "failed");
	}else{
		$('#RetryBtn').show();
		slideStatusArr[78] = 1;
		doLMSSetValue("cmi.core.lesson_status", "completed");
		enblbtn();
	}	
	/* resultDiv function added */
	resultDiv();
	
	doLMSCommit();
}
}

/* result div function */

function resultDiv(){
		$('#resultBlock').show();
		$('.ques_block').hide();
		$('#reviewBlock').hide();	
		$('#RetryBtn').show();
		
		updateval = qpage.split(':')
		
		$('#tq').html(updateval[0]);
		$('#qa').html(updateval[1]);
		$('#qw').html(updateval[2]);
		$('#mper').html(updateval[3]);
		var userscore = updateval[3].substr(0,updateval[3].length-1);
		var tempUserVal = updateval[4]
		userans = tempUserVal.split('I');
		
		initquiz();
		
		clickevents();
}

/* result div function ends */

var msec = 00;
var sec = 00;
var min = 00;
var points = 1000;
function startwatch()
{
	var hdntime = document.getElementById("hdntime");
	if(sec <10){
		hdntime.value = min + ":0" + sec;
	}
	else{
		hdntime.value = min + ":" + sec;
	}
	if(min <10){
	if(sec <10){
	hdntime.value = "0" + min + ":0" + sec;
	}
	else{
		hdntime.value = "0" + min + ":" + sec;
	}
	}
	
	go = setTimeout("startwatch()", 10);
	msec++;
	if (msec == 100)
	{
		msec = 0;
		sec++;
	}
	if (sec == 60)
	{
		sec = 0;
		min++;
	}	
}

function stopwatch()
{	
	msec = 00;
	sec = 00;
	min = 00;
	points = 1000;
	clearTimeout(go);
}