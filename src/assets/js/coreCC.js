// JavaScript Document
var showWarnings=0, conexion = true, subMenu=null, healthNET, historyhealthNET=[];
var _SESSION=null;
var _REQUEST=null;
var _domain=null;
var _DOM={};
var animatedSideNav=null;

class coreCP {
	constructor() {
		//document.oncontextmenu = function(){return false;}
		//window.healthNET=setTimeout(function(){ core.checkNet(); }, 2000);
	}
	initialized(p){
		_SESSION=JSON.parse(p.sesion);
		_REQUEST=JSON.parse(p.parametros);
		if(typeof p.domain ==='string'){
			_domain=p.domain;
		}
		if(typeof p.titleWeb ==='string'){
			document.title=p.titleWeb;
		}
		if(typeof p.callBack ==='function'){
			p.callBack();
		}
		if(typeof _REQUEST.includes === 'object'){
			Object.keys(_REQUEST.includes).forEach(element => {
				element.forEach(patn => {
					this.include(path);
				});
			});
		}
	}
	/** importFile */
	include(path){
		var head=document.head;
		var body=document.body;
		var tag=null;
		var ext=path.split('.');
		var mime=ext.at(-1);
		var pst='head';
		var res=null;
		if(mime=='css'){
			tag=document.createElement('link');
			tag.rel='stylesheet';
			tag.href=path;
		}
		if(mime=='js'){
			tag=document.createElement('script');
			tag.type='text/javascript';
			tag.src=path;
			pst='foot';
		}
		if(mime=='json'){
			fetch("test.json").then((response) => {
				if (!response.ok) {
				  throw new Error(`HTTP error! Status: ${response.status}`);
				}
			
				return response.json();
			}).then((response) => {
				res = response;
			});
			pst='none';
		}
		if(pst=='head'){
			head.appendChild(tag);
		}
		if(pst=='foot'){
			body.appendChild(tag);
		} 
		return res; 
	}
	/** funciones de DOM */
	createDom(p){
		/**Example:
		 * createDom({
			tag:'table',
			className:'resumeKpiText',
			id:'resume-'+user.id,
			click:function(){
				getProcesosA(user.id);
			},
			innerHTML:[
				{
					tag:'tr',
					innerHTML:[
						{tag:'td',align:'center',innerHTML:[
							{tag:'span',className:'titleUno',innerHTML:user.titulo}
						]}
					]
				},{
					tag:'tr',
					innerHTML:[
						{tag:'td',align:'center',innerHTML:[
							{tag:'span',className:'titleDos',innerHTML:user.procesos.length},
							{tag:'span',innerHTML:'Procesos Asignados'}
						]}
					]
				},{
					tag:'tr',
					innerHTML:[
						{tag:'td',align:'center',innerHTML:[
							{tag:'span',className:'titleUno',innerHTML:'Bitacoras: '+totalBitacoras}
						]}
					]
				}
			]
		})*/
		if(typeof p === "object"){
			/** es solo un elemento */
			var nodeDom=document.createElement(p.tag);
			Object.keys(p).forEach(key => {
				if(key!='tag'){
					if(typeof p[key] === 'string' || typeof p[key] === 'number'){
						nodeDom[key]=p[key];
					}
					if(typeof p[key] === 'function'){
						nodeDom.addEventListener(key,p[key]);
					}
					if(Array.isArray(p[key])){
						/** es un array */
						p[key].forEach(item => {
							nodeDom.appendChild(createDom(item));
						});
					}
				}
			});
			return nodeDom;
		} else {
			return "Error Contenido!";
		}
	}
	/*funcione para imprimir submenus y sideNav*/
	closeSubMenuOptions(){
		if(window.subMenu!=null){
			window.subMenu.style.display='none';
			window.subMenu.remove();
		}
	}
	subMenuOptions(p){
		core.closeSubMenuOptions();
		//create content box
		window.subMenu = document.createElement('div');
		window.subMenu.id='bubbleMenu';
		window.subMenu.className='bubbleMenu ui-corner-all ui-dialog';
		window.subMenu.style.top=(p.top) + "px";//event.clientY
		window.subMenu.style.left=(p.left) + "px" //event.clientX
		//create bar title and button close
		var subMenuBT = document.createElement('div');
		subMenuBT.id='barTitleMenu';
		subMenuBT.className='ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix';
		subMenuBT.innerHTML='<span class="ui-dialog-title">|::|</span><button onClick="core.closeSubMenuOptions();" type="button" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only ui-dialog-titlebar-close" title="Close"><span class="ui-button-icon-primary ui-icon ui-icon-closethick"></span><span class="ui-button-text">Close</span></button>';
		//create menu content
		var subMenuMC = document.createElement('div');
		subMenuMC.id='contentSubMenu';
		//add element to menu
		window.subMenu.appendChild(subMenuBT);
		window.subMenu.appendChild(subMenuMC);
		//add menu to UI
		document.body.appendChild(window.subMenu);
		//Get Menu Actions
		p.method='GET';
		p.metodo='showView';
		p.closeMenu=false;
		p.objetoDom='#contentSubMenu';
		core.callApiRest(p);
	}
	openNav(){
		document.getElementById("sideNav").style.width = "300px";
		animatedSideNav=setTimeout(function(){
			var inputs=document.getElementsByClassName("snInput");
			for (let index = 0; index < inputs.length; index++) {
				inputs[index].style.width="200px";
				inputs[index].style.padding="10px 18px 10px 24px";	
			}
			var btns=document.getElementsByClassName("snBtn");
			for (let index = 0; index < btns.length; index++) {
				btns[index].style.width="200px";	
				btns[index].style.padding="10px 18px 10px 24px";
			}
		}, 50);
	}
	closeNav(){
		document.getElementById("sideNav").style.width = "72px";
		if(animatedSideNav!=null){
			clearTimeout(animatedSideNav);
		}
		var inputs=document.getElementsByClassName("snInput");
		for (let index = 0; index < inputs.length; index++) {
			inputs[index].style.width="0px";	
			inputs[index].style.padding="0px";	
		}
		var btns=document.getElementsByClassName("snBtn");
		for (let index = 0; index < btns.length; index++) {
			btns[index].style.width="0px";
			btns[index].style.padding="0px";		
		}
	}
	
	/*Notificaciones y alertas*/
	alertMod(msj,time,error){
		var dom='#alerts',cr='ui-state-error ui-corner-all',ca='ui-state-highlight ui-corner-all';
		$(dom).html('');
		msj = msj || 'Warning::Error: Alert Mod no esta recibiendo ningun mensaje de alerta!';
		time = time || 15000;
		error = error || false;
		if(error){
			cr='ui-state-highlight ui-corner-all';
			ca='ui-state-error ui-corner-all';
		} 
		clearTimeout(window.showWarnings);
		$(dom).removeClass(cr);
		$(dom).addClass(ca);
		$(dom).append(msj+'<br/>');
		$(dom).show('slow');
		window.showWarnings=setTimeout(function(){
			$(dom).hide('slow');
		},time);
	}
	closeMess(elemento){
		$(elemento).hide('slow');
		$(elemento).html('');	
	}
	// llamar al api rest
	callApiRest(params){
		"use strict";
		//set default var
		var script='default';
		var n = params.module.indexOf(".php");
		if(n>-1){
			script=params.module;
		} else {
			script='index.php';
		}
		params.requestMethod = params.requestMethod || 'POST';
		params.contentType = params.contentType || 'application/json';
		params.crossDomain = params.crossDomain || false;
		params.loadDialog = params.loadDialog || true;
		params.closeMenu = params.closeMenu || false;
		//delete submenu if exist
		if(params.closeMenu){
			core.closeSubMenuOptions();
		}
		if(params.loadDialog){
			$('.modalLayout').show();
		}
		if(params.requestMethod=='GET'){
			var datos = jQuery.param(params);
		} 
		if(params.requestMethod=='POST'){
			var datos = JSON.stringify(params);
		}
		$.ajax({
			contentType: params.contentType,
			method:params.requestMethod,
			processData: false,
			crossDomain:params.crossDomain,
			url: script,
			async: true,
			data: datos, 
			timeout: 60000
		}).fail(function() { 
			core.alertMod('Ocurrio un problema con la solicitud.',5000,true);
			$('.modalLayout').hide();
		}).done(function(data, status, xhr) { 
			$('.modalLayout').hide();
			//verificamos que el resultado no sea json
			var ct = xhr.getResponseHeader("content-type") || "";
			if (ct.indexOf('html') > -1) {
				$(params.objetoDom).html(data);
				if(params.hasOwnProperty('methodCB')){
					if(params.methodCB!=null){
						window[params.methodCB]();
					}
				}
			}
			if (ct.indexOf('json') > -1) {
				if(params.hasOwnProperty('methodCB')){
					if(params.methodCB!=null){
						window[params.methodCB](data);
					}
				} else {
					core.alertMod('La respuesta es un objeto json no se puede mostrar en esta vista.',5000,true);
				}
				
			}
		});
	}
	go2href(url){
		window.location.href=url;
	}
	// Funciones de guardar registros
	sendForm(params){
		//search complete path for script
		var script='default';
		var n = params.module.indexOf("/");
		if(n>-1){
			script=params.module;
		} else {
			script='index.php';
		}
		$('.modalLayout').show();
		params.textb = params.textb || 'Guardar';
		$(params.btn).attr('value','Cargando espere...');
		$(params.btn).html('Cargando espere...');
		$(params.btn).attr('disabled','disabled');
		$.ajax({
			contentType: 'application/json',
			url: script,
			method: "POST",
			async: true,
			data: JSON.stringify(params),
			timeout: 10000
		})
		.fail(function(data) { 
			core.alertMod('Error code: '+data.status+', msj: '+data.statusText,2500,true);
			$('.modalLayout').hide();
			$(params.btn).removeAttr('disabled');
			$(params.btn).attr('value','Intentalo Nuevamente...');
			$(params.btn).html('Intentalo Nuevamente...');
		})
		.done(function(json) {
			$('.modalLayout').hide();
			$(params.btn).removeAttr('disabled');
			$(params.btn).attr('value','Intentalo Nuevamente...');
			$(params.btn).html('Intentalo Nuevamente...');
			switch(json.code){
				case 0:
					core.alertMod(json.msj,5000,true);
					$(params.btn).removeAttr('disable');
					$(params.btn).attr('value',params.textb);
					$(params.btn).html(params.textb);
					if(params.hasOwnProperty('methodCB')){
						window[params.methodCB](json);
					}
					break;
				case 1:
					core.alertMod(json.msj,1500,false);
					$(params.btn).removeAttr('disable');
					$(params.btn).attr('value',params.textb);
					$(params.btn).html(params.textb);
					if(params.hasOwnProperty('methodCB')){
						window[params.methodCB](json);
					}	
					break;
				case 2:
					console.warn('Error: '+json.msj);
					break;	
				default:
					console.warn('Warning: nada que hacer');
			}
		});
	}
	setDataForm(data){
		Object.keys(data).forEach(function(key){
			var domEle =  document.getElementById(key);
			if (typeof(domEle) != 'undefined' && domEle != null){
				domEle.value=data[key];
			}
		});
	}
	setDataHtml(data){
		Object.keys(data).forEach(function(key){
			var domEle =  document.getElementById(key);
			if (typeof(domEle) != 'undefined' && domEle != null){
				domEle.innerHTML=data[key];
			}
		});
	}
	setOptionSelect(params){
		/**{
		 * data:array (data json),
		 * presset:string (value set default select)
		 * dom: objeto node dom js
		 * }
		 */
		//set defaul values
		params.presset = params.presset || 0;
		params.data.forEach(element => {
			var option = document.createElement('option');
			option.value=element.id;
			option.innerHTML=element.titulo;
			if(element.id==params.presset){
				option.selected='selected';
			}
			params.dom.appendChild(option);
		});
	}
	setOptionSelectAC(params){
		/**{
		 * nodeDomS:String, id del dom node termino de busqueda
		 * nodeDomV:String, id del dom node para setear el valor
		 * method:String, metodo a ejecutar en el apirest
		 * module:String, modulo de donde se llamara el apirest
		 * methodCB:String nombre de metodo de retorno Call Back
		 * dataSend:Object{}, los datos que se van enviar para la consulta 
		 * }
		 */
		//set click event input
		$(params.nodeDomS).click(function(){
			$(params.nodeDomS).val('');
        	$(params.nodeDomV).val('');
		});
		//set defaul values
		params.dataSend = params.dataSend || {};
		$( params.nodeDomS ).autocomplete({
			source: function( request, response ) {
				params.dataSend.term=request.term;
				params.dataSend.method=params.method;
				$.ajax({
					url: 'modulos/'+params.module+'/main.php',
					data: params.dataSend,
					success:function(data){
						response(data);
					}
				});
			},
			delay:500,
			minLength: 2,
			response: function( event, ui ) {
				if(params.hasOwnProperty('methodRE')){
					window[params.methodRE](ui.content);
				}
			},
			select: function( event, ui ) {
				$( params.nodeDomS ).val(ui.item.value);
				if(params.hasOwnProperty('methodCB')){
					window[params.methodCB](ui.item);
				} else {
					$( params.nodeDomV ).val(ui.item.id);
				}
			}
		});
	}
	uritojson(params){
		return params.split("&").map(function(item) {
			return item.split("=");
		}).reduce(function(obj, pair) {
			obj[pair[0]]=decodeURIComponent(pair[1].replace(/\+/g,' '));
			return obj;
		}, {});
	}
	objtouri(obj){
		var str = [];
		for (var p in obj)
			if (obj.hasOwnProperty(p)) {
				if(typeof obj[p] === "object"){
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(JSON.stringify(obj[p])));
				} else {
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				}
			}
		return str.join("&");
	}
	uploadFile(params){
		//search complete path for script
		var script='default';
		var n = params.module.indexOf("/");
		if(n>-1){
			script=params.module;
		} else {
			script='modulos/'+params.module+'/main.php';
		}
		$(params.objetoDom).val('Subiendo, Espere...');	
		$('.modalLayout').show();
		$.ajax({
			contentType: 'application/json',
			url: script,
			method: "POST",
			async: true,
			data: JSON.stringify(params),
			timeout: 60000
		})
		.fail(function(data) { 
			$('.modalLayout').hide();
			core.showLog({msj:'Error code: '+data.status+', msj: '+data.statusText,time:5000,tipo:'error'});
			$(params.objetoDom).val('Intentalo Nuevamente, imagen demasido grande...');
		})
		.done(function(json) {
			$('.modalLayout').hide();
			switch(json.code){
				case 0:
					showLog({msj:json.msj,time:5000,tipo:'error'});
					$(params.objetoDom).val('Intentalo Nuevamente, ocurrio un error!');
					break;
				case 1:
					showLog({msj:json.msj,time:3000,tipo:'warn'});
					$(params.objetoDom).val(json.path);	
					if(params.hasOwnProperty('methodCB')){
						window[params.methodCB](json);
					}
					break;
				case 2:
					console.warn('Error: '+json.msj);
					break;	
				default:
					console.warn('Warning: nada que hacer');
			}
		});
	}
	//dibujando ventanas flotantes
	openBox(params){
		if(params.module.length>0){
			core.callApiRest(params);
		} else if(params.textHtml.length>0){
			$("#popupBox").html(params.textHtml);
		}
		$("#popupBox").dialog({
			autoOpen: false,
			show: 'blind',
			hide: 'explode',
			modal: params.modal,
			resizable: params.resizanle,
			draggable: params.draggable,
			width: params.width,
			height: params.height,
			title: params.title,
			beforeClose: function( event, ui ) {
				$( "#popupBox" ).html('');
				$( "#popupBox" ).dialog('destroy');
				
			} 
		});
		$("#popupBox").dialog("open");		
	}
	openBoxMulti(params){
		/**
		 * set value default to params
		 */
		params.width = params.width || "350px";
		params.height = params.height || "350px";
		params.module = params.module || '';
		params.draggable = params.draggable || true;
		params.resizable = params.resizable || true;
		params.modal = params.modal || true;
		params.title = params.title || 'Default Value';
		params.textHtml = params.textHtml || 'Defaul Value';
		var idelement=(new Date).getTime();
		$("body").append('<div id="'+idelement+'"></div>');
		$("#"+idelement).dialog({ 
			width: params.width, 
			height:params.height, 
			draggable:params.draggable, 
			resizable:params.resizable, 
			modal:params.modal, 
			title:params.title,
			close: function() {
				$("#"+idelement).dialog("destroy");
				$("#"+idelement).empty();
				$("#"+idelement).remove();				 				
			}
		});
		$("#"+idelement).html('<span class="loadigAction"></span>');
		if(params.module.length>0){
			params.objetoDom="#"+idelement;
			core.callApiRest(params);
		} else {
			$("#"+idelement).html(params.textHtml);
		} 
	}
	confirmBox(params){
		jQuery(document).ready(function($){
			$("#popupBox").html(params.msj);
			$("#popupBox").dialog({
				autoOpen: false,
				resizable: false,
				height: "auto",
				width: 400,
				modal: true,
				title: params.title,
				buttons: {
					"Aceptar": function() {
						params.callMethod();
						$( this ).dialog( "close" );
					},
					Cancel: function() {
						$( this ).dialog( "close" );
					}
				}
			});
			$("#popupBox").dialog("open");
		});
	}
	openWindow(params){
		params.w = params.w || 400;
		params.h = params.h || 400;
		params.params=core.objtouri(params.params);
		if(params.params.length>0){
			params.url=params.url+'?'+params.params;
		}
		window.open(params.url,'',"directories=no, location=no, menubar=no, scrollbars=yes, statusbar=no, tittlebar=yes, width="+params.w+", height="+params.h);	
	}
	//grid data
	exportToCVS(fileName,objetoDom){
		var i=0,datos=[];
		$("#"+objetoDom).jsGrid('option','data').forEach(row => {
			datos[i]={};
			Object.keys(row).forEach(function(cell) { 
				if(typeof row[cell] === 'object'){
					datos[i][cell]=row[cell].value;
				} else {
					if(cell=='ts'){
						var date = new Date(row[cell]*1000);
						datos[i][cell]=date.customFormat( "#DD#-#MM#-#YYYY# #hh#:#mm#:#ss#" ).toString();
					} else {
						datos[i][cell]=row[cell];
					}
				}
			}); 
			i++;
		});
		core.JSONToCSVConverter(fileName, true, datos);
	}
	getTableController(params){
		var controller = {
			loadData: function(filter) {
				filter.method=params.method;
				return $.ajax({
					type: "GET",
					url: 'modulos/'+params.module+'/main.php',
					data: filter
				});
			}
		};
		return controller;
	}
	getTableFields(params){
		/**
		 * {
		 * data:json[0] primer elemento del array de datos devuelto,
		 * }
		 */
		var fields=new Array();
		params.data.forEach(function(element) {
			fields.push({ name: element, type: "text", width: element.length*5 });				
		});
		return fields;
	}
	drawTableData(params){
		/** {data:array,
		 * fields:array,
		 * objetoDom:StringIdDom,
		 * controller,
		 * filtering:bolean,
		 * ocEvent:StringNameFunction,
		 * titulo:string or null,
		 * width:String,
		 * height:String,
		 * cvs:btnBolean,
		 * barBtnDom:String,
		 * pageSize:int,
		 * module: string,
		 * method: string} */
		//set var values
		var fileName='Exporta_Datos';
		var optionsTable={};
		params.barBtnDom = params.barBtnDom || '#barButton';
		params.controller = params.controller || core.getTableController({module:params.module,method:params.method});
		params.data = params.data || [];
		if(params.data.length>0){
			params.controller.datos=params.data;
		}
		params.pageSize = params.pageSize || 10;
		params.width = params.width || '100%';
		params.height = params.height || 85+(38*(params.pageSize))+"px";
		params.titulo = params.titulo || null;
		params.cvs = params.cvs || false;
		params.filtering = params.filtering || false;
		params.ocEvent = params.ocEvent || null;
		var idTableDom='tableData'+(new Date).getTime();
		if(params.titulo  !== null){
			$(params.objetoDom).append('<h2>'+params.titulo+'</h2>');
			fileName=params.titulo;
		}
		if(params.cvs){
			if($( "#content" ).find($("#btnExportCVS")).length>0){
				$("#btnExportCVS").remove();	
			}
			$(params.barBtnDom).append('<label class="camp4" id="btnExportCVS"><input type="button" class="btnGreen" value="Exportar CVS" onClick="core.exportToCVS(\''+fileName+'\',\''+idTableDom+'\');" /></label>');
		}
		$(params.objetoDom).append('<div id="'+idTableDom+'"></div>');
		optionsTable={
			height: params.height,
			width: params.width,
			filtering: params.filtering,
			sorting: true,
			paging: true,
			autoload: true,
			pageSize: params.pageSize,
			pageButtonCount: 5,
			controller: params.controller,
			fields: params.fields
		};
		if(params.ocEvent!=null){
			optionsTable.rowClick=function(args) {
				window[params.ocEvent](args);
			}
		}
		$("#"+idTableDom).jsGrid(optionsTable);
	}
	//exportar
	JSONToCSVConverter(ReportTitle, ShowLabel, JSONData) {
		//If JSONData is not an object then JSON.parse will parse the JSON string in an Object
		var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
		
		var CSV = '';    
		//Set Report title in first row or line
		
		CSV += ReportTitle + '\r\n\n';

		//This condition will generate the Label/Header
		if (ShowLabel) {
			var row = "";
			
			//This loop will extract the label from 1st index of on array
			for (var index in arrData[0]) {
				
				//Now convert each value to string and comma-seprated
				row += index + ',';
			}

			row = row.slice(0, -1);
			
			//append Label row with line break
			CSV += row + '\r\n';
		}
		
		//1st loop is to extract each row
		for (var i = 0; i < arrData.length; i++) {
			var row = "";
			
			//2nd loop will extract each column and convert it in string comma-seprated
			for (var index in arrData[i]) {
				row += '"' + arrData[i][index] + '",';
			}

			row.slice(0, row.length - 1);
			
			//add a line break after each row
			CSV += row + '\r\n';
		}

		if (CSV == '') {        
			alert("Invalid data");
			return;
		}   
		
		//Generate a file name
		var fileName = ReportTitle.replace(/ /g,"_");
		
		//Initialize file format you want csv or xls
		var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
		
		// Now the little tricky part.
		// you can use either>> window.open(uri);
		// but this will not work in some browsers
		// or you will not get the correct file extension    
		
		//this trick will generate a temp <a /> tag
		var link = document.createElement("a");    
		link.href = uri;
		
		//set the visibility hidden so it will not effect on your web-layout
		link.style = "visibility:hidden";
		link.download = fileName + ".csv";
		
		//this part will append the anchor tag and remove it after automatic click
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
	TableToXls(DOMNode){
		var tables = DOMNode.getElementsByTagName("table");
		var firstTableBefore = tables[0];
		window.open('data:application/vnd.ms-excel,' + encodeURIComponent('<table>'+firstTableBefore.innerHTML+'</table>'));
	}
	tableToJson(table){
		var data = [];
	
		// first row needs to be headers
		var headers = [];
		for (var i=0; i<table.rows[0].cells.length; i++) {
			headers[i] = table.rows[0].cells[i].innerHTML.toLowerCase().replace(/ /gi,'');
		}
	
		// go through cells
		for (var i=1; i<table.rows.length; i++) {
	
			var tableRow = table.rows[i];
			var rowData = {};
	
			for (var j=0; j<tableRow.cells.length; j++) {
	
				rowData[ headers[j] ] = tableRow.cells[j].innerHTML;
	
			}
	
			data.push(rowData);
		}       
	
		return data;
	}
	xml2json(xml, tab) {
		var X = {
			toObj: function(xml) {
				var o = {};
				if (xml.nodeType==1) {   // element node ..
					if (xml.attributes.length)   // element with attributes  ..
					for (var i=0; i<xml.attributes.length; i++)
						o[xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue||"").toString();
					if (xml.firstChild) { // element has child nodes ..
					var textChild=0, cdataChild=0, hasElementChild=false;
					for (var n=xml.firstChild; n; n=n.nextSibling) {
						if (n.nodeType==1) hasElementChild = true;
						else if (n.nodeType==3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) textChild++; // non-whitespace text
						else if (n.nodeType==4) cdataChild++; // cdata section node
					}
					if (hasElementChild) {
						if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
							X.removeWhite(xml);
							for (var n=xml.firstChild; n; n=n.nextSibling) {
								if (n.nodeType == 3)  // text node
								o["Value"] = X.escape(n.nodeValue);
								else if (n.nodeType == 4)  // cdata node
								o["CData"] = X.escape(n.nodeValue);
								else if (o[n.nodeName]) {  // multiple occurence of element ..
								if (o[n.nodeName] instanceof Array)
									o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
								else
									o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
								}
								else  // first occurence of element..
								o[n.nodeName] = X.toObj(n);
							}
						}
						else { // mixed content
							if (!xml.attributes.length)
								o = X.escape(X.innerXml(xml));
							else
								o["Value"] = X.escape(X.innerXml(xml));
						}
					}
					else if (textChild) { // pure text
						if (!xml.attributes.length)
							o = X.escape(X.innerXml(xml));
						else
							o["Value"] = X.escape(X.innerXml(xml));
					}
					else if (cdataChild) { // cdata
						if (cdataChild > 1)
							o = X.escape(X.innerXml(xml));
						else
							for (var n=xml.firstChild; n; n=n.nextSibling)
								o["CData"] = X.escape(n.nodeValue);
					}
					}
					if (!xml.attributes.length && !xml.firstChild) o = null;
				}
				else if (xml.nodeType==9) { // document.node
					o = X.toObj(xml.documentElement);
				}
				else
					alert("unhandled node type: " + xml.nodeType);
				return o;
			},
			toJson: function(o, name, ind) {
				var json = name ? ("\""+name+"\"") : "";
				if (o instanceof Array) {
					for (var i=0,n=o.length; i<n; i++)
					o[i] = X.toJson(o[i], "", ind+"\t");
					json += (name?":[":"[") + (o.length > 1 ? ("\n"+ind+"\t"+o.join(",\n"+ind+"\t")+"\n"+ind) : o.join("")) + "]";
				}
				else if (o == null)
					json += (name&&":") + "null";
				else if (typeof(o) == "object") {
					var arr = [];
					for (var m in o)
					arr[arr.length] = X.toJson(o[m], m, ind+"\t");
					json += (name?":{":"{") + (arr.length > 1 ? ("\n"+ind+"\t"+arr.join(",\n"+ind+"\t")+"\n"+ind) : arr.join("")) + "}";
				}
				else if (typeof(o) == "string")
					json += (name&&":") + "\"" + o.toString() + "\"";
				else
					json += (name&&":") + o.toString();
				return json;
			},
			innerXml: function(node) {
				var s = ""
				if ("innerHTML" in node)
					s = node.innerHTML;
				else {
					var asXml = function(n) {
					var s = "";
					if (n.nodeType == 1) {
						s += "<" + n.nodeName;
						for (var i=0; i<n.attributes.length;i++)
							s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue||"").toString() + "\"";
						if (n.firstChild) {
							s += ">";
							for (var c=n.firstChild; c; c=c.nextSibling)
								s += asXml(c);
							s += "</"+n.nodeName+">";
						}
						else
							s += "/>";
					}
					else if (n.nodeType == 3)
						s += n.nodeValue;
					else if (n.nodeType == 4)
						s += "<![CDATA[" + n.nodeValue + "]]>";
					return s;
					};
					for (var c=node.firstChild; c; c=c.nextSibling)
					s += asXml(c);
				}
				return s;
			},
			escape: function(txt) {
				return txt.replace(/[\\]/g, "\\\\")
						.replace(/[\"]/g, '\\"')
						.replace(/[\n]/g, '\\n')
						.replace(/[\r]/g, '\\r');
			},
			removeWhite: function(e) {
				e.normalize();
				for (var n = e.firstChild; n; ) {
					if (n.nodeType == 3) {  // text node
					if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
						var nxt = n.nextSibling;
						e.removeChild(n);
						n = nxt;
					}
					else
						n = n.nextSibling;
					}
					else if (n.nodeType == 1) {  // element node
					X.removeWhite(n);
					n = n.nextSibling;
					}
					else                      // any other node
					n = n.nextSibling;
				}
				return e;
			}
		};
		if (xml.nodeType == 9) // document node
			xml = xml.documentElement;
		var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t");
		return "{\n" + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + "\n}";
	}
	htmlToNodeDom(html) {
		var template = document.createElement('template');
		html = html.trim(); // Never return a text node of whitespace as the result
		template.innerHTML = html;
		return template.content.firstChild;
	}
	/** forms */
	

	//setUIStyle
	setUIStyle(){
		if(__SESSION!=null){
			//set BackGround
			var header=document.getElementById('header');
			var content=document.getElementById('content');
			content.style.background='url('+__SESSION.optVisual.BackGround+') no-repeat center center #f0f2f1';
			var container=document.getElementById('container');
			container.style.height=((content.offsetHeight-header.offsetHeight)-2)+"px";
			container.style.overflow='auto';
		}
	}
	//extrass
	checkNet() {
		clearTimeout(window.healthNET);
		var startTime, endTime; 
		var downloadSize = 67922;//bytes
		var download = new Image(); 
		download.onload = function () { 
			endTime = (new Date()).getTime(); showResults(); 
		} 
		download.onerror = function (err, msg) { 
			$('#healthNET').html('ERROR!');
			$('#healthNET').css('background','#F78181');
		} 
		startTime = (new Date()).getTime(); 
		var cacheBuster = "?ts=" + startTime; 
		download.src = "https://www.nirvaria.com/wp-content/uploads/2021/01/logoNirvaria500.png" + cacheBuster; 
		function showResults() { 
			var duration = (endTime - startTime) / 1000; 
			var speedMBs = ((downloadSize*0.0004) / duration).toFixed(2); 
			$('#healthNET').html(speedMBs+' Mbps');
			window.historyhealthNET.push(parseFloat(speedMBs));
			//console.warn(window.historyhealthNET);
			if(speedMBs<0.01){
				$('#healthNET').css('background','#F78181');
			}
			if(speedMBs>=0.01 && speedMBs<0.5){
				$('#healthNET').css('background','#F3F781');
			}
			if(speedMBs>=0.5 && speedMBs<0.99){
				$('#healthNET').css('background','#2EFE64');
			}
			if(speedMBs>=0.99){
				$('#healthNET').css('background','#2E9AFE');
			}

		}
		window.healthNET=setTimeout(function(){ core.checkNet(); }, 10000);
	}
	historyNet(){
		$("#popupBox").dialog({
			autoOpen: false,
			show: 'blind',
			hide: 'explode',
			modal: true,
			resizable: false,
			draggable: false,
			width: 750,
			height: 500,
			title: 'Historial de Red',
			beforeClose: function( event, ui ) {
				$( "#popupBox" ).html('');
				$( "#popupBox" ).dialog('destroy');
				
			} 
		});
		$("#popupBox").append('<div id="graphRed"></div>');
		$("#popupBox").dialog("open");
		core.doGraph('graphRed','Estado de Conexion');
	}
	openLicense(){
		$("#popupBox").dialog({
			autoOpen: false,
			show: 'blind',
			hide: 'explode',
			modal: true,
			resizable: false,
			draggable: false,
			width: 600,
			height: 500,
			title: 'Detalles de Licencia',
			beforeClose: function( event, ui ) {
				$( "#popupBox" ).html('');
				$( "#popupBox" ).dialog('destroy');
				
			} 
		});
		$("#popupBox").append('<div id="licenseCliente"></div>');
		$("#popupBox").dialog("open");
		core.callApiRest({module:'',method:'showView',view:'License',objetoDom:'#licenseCliente',loadDialog:0});
	}
	openSupport(){
		$("#popupBox").dialog({
			autoOpen: false,
			show: 'blind',
			hide: 'explode',
			modal: true,
			resizable: false,
			draggable: false,
			width: 600,
			height: 500,
			title: 'Contacto/Soporte',
			beforeClose: function( event, ui ) {
				$( "#popupBox" ).html('');
				$( "#popupBox" ).dialog('destroy');
				
			} 
		});
		$("#popupBox").append('<div id="SupportView"></div>');
		$("#popupBox").dialog("open");
		core.callApiRest({module:'',method:'showView',view:'support',objetoDom:'#SupportView',loadDialog:0});
	}
	openSetup(){
		$("#popupBox").dialog({
			autoOpen: false,
			show: 'blind',
			hide: 'explode',
			modal: true,
			resizable: false,
			draggable: false,
			width: 600,
			height: 500,
			title: 'Configuracion de Perfil',
			beforeClose: function( event, ui ) {
				$( "#popupBox" ).html('');
				$( "#popupBox" ).dialog('destroy');
				
			} 
		});
		$("#popupBox").append('<div id="SetUpProfile"></div>');
		$("#popupBox").dialog("open");
		core.callApiRest({module:'',method:'showView',view:'setup',objetoDom:'#SetUpProfile',loadDialog:0});
	}
	number2Words(num) {
		var a = ['','uno ','dos ','tres ','cuatro ', 'cinco ','seis ','siete ','ocho ','nueve ','diez ','once ','doce ','trece ','catorce ','quince ','dieciseis ','diecisiete ','dieciocho ','diecinueve '];
		var b = ['', '', 'veinte','treinta','cuarenta','cincuenta', 'sesenta','setenta','ochenta','noventa'];
		var c = ['', 'ciento', 'dos cientos','tres cientos','cuatro cientos','quinientos', 'seis cientos','setecientos','ocho cientos','novecientos'];
		var d = ['','un '];
		var e = ['','cien '];
		num=String(num.toFixed(2)).split('.');
		if ((num[0] = num[0].toString()).length > 9) return 'overflow';
		var n = ('000000000' + num[0]).substr(-9).match(/^(\d{1})(\d{2})(\d{1})(\d{2})(\d{1})(\d{2})$/);
		if (!n) return; 
		var str = '';
		str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'millones ' : '';
		str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'millon ' : '';
		str += (n[3] != 0) ? (c[Number(n[3])] || c[Number(n[3])])+' ' : '';
		str += (n[4] != 0) ? (d[Number(n[4])] || a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'mil ' : (n[3] != 0) ? 'mil ':'';
		str += (n[5] != 0) ? (e[Number(n[5])] || c[Number(n[5])] || c[Number(n[5])]) + ' ' : '';
		str += (n[6] != 0) ? (a[Number(n[6])] || b[n[6][0]] + ' ' + a[n[6][1]]) : '';
		str += (num[1] != 0) ? 'con '+(a[Number(num[1])] || b[num[1][0]] + ' ' + a[num[1][1]]) + 'centavos' : 'exactos';
		return str;
	}
}


