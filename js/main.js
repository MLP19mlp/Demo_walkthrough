// main JavaScript Document

/* Menu close function */



var totalSlides = 71;
var pcount = 0;
var completedslide = -1;
var fileStr;
var begining = true;
var timerVar = null;
/* Next button enable function */
function enblbtn(){	
	//slideStatusArr[pcount-1] = 1
	$("#NxtNav").bind('click');
	$("#NxtNav").css("opacity","1").css('cursor','pointer');
	$("#NxtNav").click(function(e) {
        navigation('Next');
		e.stopImmediatePropagation();		
    });
	//alert('save '+slideStatusArr)
	setslidedata(slideStatusArr.toString());
}

/* Next button disable function  */
function disablebtn(){	

		$("#NxtNav").unbind('click');
		$("#NxtNav").css("opacity","0.5").css('cursor','default');
		//alert("next enable "+completedslide +'=='+ pcount)
	/*if(completedslide >= pcount){
		enblbtn();	
	}*/
	/*alert(pcount-1);
	alert(slideStatusArr[pcount-1]);
	if(slideStatusArr[pcount-1] == 1){
		enblbtn();
	}*/
}

/* Back button disable function  */
function EnableBackBtn(){
	$("#BackNav").bind('click');
	$("#BackNav").css("opacity","1").css('cursor','pointer');
	$("#BackNav").click(function(e) {
	//alert(e.target);
		navigation('Prev');
		e.stopImmediatePropagation();
	});
}
var mainNavCount = 0;
/* Navigation function */
function navigation(strVal){

//alert('navi = '+strVal)
	if(strVal == 'Next'){
		//alert("DDD");
		//fromInnerPage = false;
		if (pcount == 3) {
			fromInnerPage = false;
		}
		if(pcount < totalSlides){
			//alert("fromInnerPage = " + fromInnerPage);
			if (fromInnerPage == true) {
				
				// pcount is equivalent to ArticleID
				
				if (pcount == 14 || pcount == 19 || pcount == 21 || pcount == 35 || pcount == 38 || pcount == 42 || pcount == 44 ) {
					pcount = 3;
				} else if(pcount == 9) {
					pcount = 14;
				} else if(pcount == 10 || pcount == 11 || pcount == 12 || pcount == 13) {
					pcount = 9;
				} else if(pcount == 27 || pcount == 28) {
					pcount = 21;
				} else if(pcount == 22) {
					pcount = 27;
				} else if(pcount == 23 || pcount == 24 || pcount == 25 || pcount == 26) {
					pcount = 22;
				} else if(pcount == 31) {
					pcount = 35;
				} else if(pcount == 32 || pcount == 33 ||pcount == 34) {
					pcount = 31;
				} else if(pcount == 47 || pcount == 48) {
					pcount = 46; // Tax Money Laundering and other Cross-Border Money Laundering Regulations Main Menu
				} else if(pcount == 46){
						pcount = 50; // Foreign Account Tax
				} else if(pcount == 54) {
						pcount = 3; // Topic Page
				} else if (pcount == 58) {
					pcount = 69;
				} else if (pcount == 61) {
					pcount = 58;
				} else if (pcount == 66 || pcount == 61) {
					pcount = 58;
				} else if (pcount == 62 || pcount == 63) {
					pcount = 61;
				} else if (pcount == 67 || pcount == 68) {
					pcount = 66;
				}  
				else {	
					pcount++;	
				}
				
			}else{
				
				mainNavCount++;
				//alert("mainNavCount = "+mainNavCount);
				pcount = mainNavArr[mainNavCount];
				//alert(pcount+ "  = " + mainNavCount);
			}
			//prevCountNum = pcount;
			loadPages();
			
		}
		//alert("pcount" +pcount);
		
		if(begining){
			begining = false;
			//alert("begining = "+begining);
			EnableBackBtn();
		}
	} else if (strVal == 'Prev'){
		//fromInnerPage = false;
		if (fromInnerPage == true) {
			//alert("fromInnerPage = " + fromInnerPage);				
				if (pcount == 4 || pcount == 15 || pcount == 20 || pcount == 29 || pcount == 36 || pcount == 39 || pcount == 43 || pcount == 45) {
					pcount = 3;
				} else if (pcount == 10 || pcount == 11 || pcount == 12|| pcount == 13|| pcount == 14) {
					pcount = 9;
				} else if (pcount == 22 || pcount == 28) {
					pcount = 21;
				} else if (pcount == 23 || pcount == 24 || pcount == 25|| pcount == 26|| pcount == 27) {
					pcount = 22;
				} else if (pcount == 32 || pcount == 33 || pcount == 34|| pcount == 35) {
					pcount = 31;
				} else if (pcount == 47 || pcount == 48 || pcount == 50) {
					pcount = 46;
				} else if (pcount == 62 || pcount == 63) {
					pcount = 61;
				} else if (pcount == 67 || pcount == 68) {
					pcount = 66;
				} else if (pcount == 69 || pcount == 64) {
					pcount = 58;
				} else{
					pcount--;	
				}
			
		}else{
			mainNavCount--;
			pcount = mainNavArr[mainNavCount];
			//alert(pcount+ "  = " + mainNavCount);
		}
			
			
		//mainNavCount--;
		//pcount = mainNavArr[mainNavCount];
		//pcount--;
		loadPages();
	}else{
		//alert("Rama");
		pcount = strVal;
		loadPages();
	}
	if(pcount==1){
		begining = true;
			$("#BackNav").unbind('click');
			//document.getElementById("BackNav").disabled = true;
			//$("#BackNav").css("opacity","0.5");
			//alert("Back");
			$("#BackNav").css("opacity","0.5").css('cursor','default');	
	} 
}

/* Page Load function */
var fromInnerPage = false;
function loadPages(){
	
	if (timerVar != null) {
		clearInterval(timerVar)
	}
	disablebtn();
	
	setBookmark(pcount+"_"+mainNavCount)
	
	/*if(completedslide<pcount){
		completedslide = pcount -1
		//setslidedata(completedslide);
	}*/
	$('.popups1, .popups, #blockscreen').hide();		
	
		if(pcount<10){
			fileStr = 'pages/p0'+pcount+'.html';
		}
		else{
			fileStr = 'pages/p'+pcount+'.html'
		}

		$('#pages').load(fileStr);
		//alert("Load : "+pcount);
		//fnupdateTitle((pcount-1))
		
		// Activate timer if the page is "Reflection")
		 if (pcount == 60 || pcount == 65)
		 {
			fnTimer(); // Run timer and capture the "ArticleID" and "val" value. Refer to line 267.
			document.getElementById("fullTimer").style.display = "inline-block";	
		}else{
			document.getElementById("fullTimer").style.display = "none";	
		}
		
		if (pcount == 79){
			document.getElementById("BackNav").style.display = "none";
			document.getElementById("NxtNav").style.display = "none";
		}else{
			document.getElementById("BackNav").style.display = "inline-block";
			document.getElementById("NxtNav").style.display = "inline-block";
		}
		
		//var mainNavArr = [1, 2, 3, 35, 36, 37, 38, 39, 40, 41, 42];
		for (var kk=0 ;kk<mainNavArr.length;kk++){
			if (pcount == mainNavArr[kk]) {
				fromInnerPage = false;
				break;
			}else{
				fromInnerPage = true;
			}
		}
		//enblbtn();
}

/* ------------------------------------------ */

$(document).ready(function(e) {
	
	 //navigation('Next');
	
	$("#NxtNav").unbind('click');
	$("#NxtNav").css("opacity","0.5").css('cursor','default');
	window.oncontextmenu = function () {
   		return false;
	}

});

function fnTimer() {
	timerVar = setInterval(countTimer, 1000);
	var totalSeconds = 0;
	function countTimer() {
	   ++totalSeconds;
	   var hour = Math.floor(totalSeconds /3600);
	   var minute = Math.floor((totalSeconds - hour*3600)/60);
	   var seconds = totalSeconds - (hour*3600 + minute*60);
	   
	   if (minute >= 3) {
		   enblbtn();
		   
		   if(pcount == 60){
			   slideStatusArr[68] = 1;  // VAL value of Reflection 1
		   }
		   
		   if(pcount == 65){
			   slideStatusArr[73] = 1; // VAL value of Reflection 2
		   }
			
		   clearInterval(timerVar);
	   }
	  if (seconds < 10 && minute < 10) {
		 document.getElementById("timer").innerHTML = "0"+minute + ":0" + seconds;s
	  } else if(seconds < 10 &&  minute >= 10) {
		   document.getElementById("timer").innerHTML = minute + ":0" + seconds;
	  } else if(seconds >= 10 &&  minute < 10) {
		  document.getElementById("timer").innerHTML = "0"+minute + ":" + seconds;
	  }
	}	
}
