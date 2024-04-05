function menu(){

// main properties
var url=null,
	parameters=null,
	container=null;	

// events handlers
var onParentClick = null,
	onItemClick = null,
	onParentDblClick = null,
	onItemDblClick = null;	

// style properties
var parentStyle = "",
	itemStyle = "",
	parentIconStyle = "",
	parentOpenedIconStyle = "",
	itemIconStyle = "",
	parentSelectedTextStyle = "",
	itemSelectedTextStyle = "",
	parentTextStyle = "",
	itemTextStyle = "",
	previousChildren = null,
	previousPnode = null,
	previousNodeOpened = null,
	allNodesArr;	

// reference to the last selected node
var selectedNode = null;

// reference to the loaded xml document
var xml = null;

// to access the current scope from within event function
var me = this;


// send a request to load the xml document and call buildTree() when loaded
this.build=function(){
	
	var xmlhttp;
	// check if Ajax is supported
	try{xmlhttp=new ActiveXObject("Msxml2.XMLHTTP")}
	catch(e){
		try{xmlhttp=new ActiveXObject("Microsoft.XMLHTTP")}
		catch(e){
			try{xmlhttp=new XMLHttpRequest()}
			catch(e){
				alert("Your Browser Does Not Support XMLHTTP");
				return false;
			}
		}
	}

	// check if url property is initiated.
	if (me.url==null){alert("url property must be set");return false;}

	// check for successful load
	xmlhttp.onreadystatechange=function(){
			// document is ready
			if (xmlhttp.readyState == 4){
				// xml cannot be loaded
			 	if(xmlhttp.status!=200){
					//alert(xmlhttp.status+", "+xmlhttp.statusText);
					return false;
				}
			
				// xml is loaded, call builTree() function
				// some browsers don't recognize the xml if read as plain text, so we need to override the mimeType
				//if(xmlhttp.overrideMimeType)xmlhttp.overrideMimeType('text/xml');
				me.xml=xmlhttp.responseXML;
				me.refreshPageOnce();
				return false;
		}
	}

	// add the parameters if exist, and send the request using GET method
	var furl=me.url+"?"+((me.parameters==null?"":me.parameters+"&")+"rnd="+Math.random())
	xmlhttp.open("GET",furl,true)
	xmlhttp.send(null);

}

this.refreshPageOnce=function(){
	//nodeCount = 0;
	slidesCompArr = [];
// set the default container if not specified
if(me.container==null)me.container=document.body;

// clear any existing contents
me.container.innerHTML="";

// disallow text selection
me.container.onselectstart=function(){return false};
me.container.onmousedown=function(){return false};

// reset the last selected node referrer
me.selectedNode=null;
// start building process
me.buildTree(me.xml,me.container);
//alert(slideStatusArr);	  
}


// refresh
this.refreshPage=function(){
	
// start building process
//alert(slideStatusArr);
	for (var i=0 ;i<slidesCompArr.length;i++){
		var elNode = slidesCompArr[i];
		//console.log(slideStatusArr[i]+" === "+i);
		if (slideStatusArr[i] != 0 && slideStatusArr[i] != "0" && slideStatusArr[i] != "" && slideStatusArr[i] != null && slideStatusArr[i] != undefined && slideStatusArr[i] != "undefined" ) {
		  	elNode.getElementsByTagName('span')[0].className = "tick";
		}
	}
		  
}

// Build the tree recursively
//var nodeCount = 0;
var dElem;
allNodesArr = [];
this.buildTree=function(xmlObj,htmlNode){
//nodeCount++;
//alert(nodeCount);
	if (xmlObj.nodeName=="#document"){
		xmlObj=xmlObj.documentElement;
		dElem=xmlObj;
	}
	
	if(xmlObj==null)return false;

	var xmlNodes=xmlObj.childNodes;

	if (xmlNodes.length==0)return false;
	

	for (var i=0 ;i<xmlNodes.length;i++){
		var xn=xmlNodes[i];
		if (xn.nodeName=="#text")continue;
		var isParent=xn.hasChildNodes();

		var pn=document.createElement("p");
		var txt=document.createElement("span");
		//if (nodeCount > 2 && nodeCount != 14 && nodeCount != 9) {
			pn.className=isParent?me.parentStyle:me.itemStyle
			txt.className=isParent?me.parentTextStyle:me.itemTextStyle
		//}
		pn.style.marginTop = 1+"em";
		txt.innerHTML=xn.getAttribute("text");
		//console.log(xn.getAttribute("text"));
		if (xn.getAttribute("noActions") != 0) {
			
			var icon=document.createElement("span");
			icon.className=isParent?me.parentIconStyle:me.itemIconStyle
			allNodesArr.push(icon);
			pn.appendChild(icon);
		}

	
		pn.appendChild(txt);
		
		
		
		if (xn.getAttribute("text") == "Learn" || xn.getAttribute("text") == "Apply" || xn.getAttribute("text") == "Review" || xn.getAttribute("text") == "Close") {
			txt.className=isParent?me.parentTextStyle:me.itemTextStyle
			txt.className="titleText";
		}else{
			slidesCompArr.push(pn);	
		}
		
		//pn.style.display=(xn.parentNode==dElem)?"block":"none";
				
		var hn=htmlNode.appendChild(pn);
		pn.xAttributes=xn.attributes; //use getNamedItem("attribute name").value to access an attribute

		if (isParent){
			pn.setAttribute("isOpened",1);
			
			// Parent double click event
			/*pn.ondblclick=function(e){
				if (!e)e=window.event;
				e.cancelBubble =true;
				me.selectItem(this,1)
				
				var isOpened=this.getAttribute("isOpened");
				me.expandCollapse(this,isOpened==1?0:1)
				
				if (me.onParentDblClick!=null)me.onParentDblClick(this)
			}*/
			
			// Parent click event
			if (xn.getAttribute("text") != "Learn" && xn.getAttribute("text") != "Apply" && xn.getAttribute("text") != "Review") {
				//console.log(xn.getAttribute("text"));
			pn.onclick=function(e){
				if (!e)e=window.event;
				e.cancelBubble =true;
				me.selectItem(this,1)
				if (me.onParentClick!=null)me.onParentClick(this)
			}
			}
			
			// call buildTree() function for the current parent
			me.buildTree(xn,hn);
			
		}else{
			// Item double click event
			/*pn.ondblclick=function(e){
				if (!e)e=window.event;
				e.cancelBubble =true;
				me.selectItem(this,0)
				if (me.onItemDblClick!=null)me.onItemDblClick(this)
			}*/
			
			// Item click event
			pn.onclick=function(e){
				if (!e)e=window.event;
				e.cancelBubble =true;
				me.selectItem(this,0)
				if (me.onItemClick!=null)me.onItemClick(this)
			}

		}

	}
}

// Select / Unselect node
this.selectItem=function(hnode,isParent){
	if (me.selectedNode!=null){
		if(me.selectedNode.hnode!=hnode){
			me.selectedNode.hnode.getElementsByTagName("span")[1].className=me.selectedNode.isParent?me.parentTextStyle:me.itemTextStyle
		}
	}
	hnode.getElementsByTagName("span")[1].className=isParent?me.parentSelectedTextStyle:me.itemSelectedTextStyle
	me.selectedNode={"hnode":hnode,"isParent":isParent}
}

// Expand / Collapse a parent node
this.expandCollapse=function(pnode,isOpened){
	// exit if the passed html node is not a parent node (all parent nodes has the isOpend attribute)
	if(!pnode.hasAttribute("isOpened"))return false;
	pnode.setAttribute("isOpened",isOpened);
	var children=pnode.childNodes;

	// set the parent corresponding icon class name
	pnode.getElementsByTagName("span")[0].className=isOpened==1?me.parentOpenedIconStyle:me.parentIconStyle;

	// Ignore first 2 elements (the icon and text spans)
	for(var i=2;i<children.length;i++){
		if (children[i].nodeName=="#text")continue;
		children[i].style.display=(isOpened==1?"block":"none");
	}
}
}

