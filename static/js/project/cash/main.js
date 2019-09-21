	//////////////////////////main模块////////////////////////////////////////////////
	function Main(){}
	//模块初始化
	Main.init= function(subModule){
		Main.loadHome();//默认加载主页面
		//1秒钟后检查是否有紧急公告。
		setTimeout("Bulletin.check();",1000*1);
		//2秒后检查套餐过期天数
		setTimeout("UserPlan.remainDays();",1000*2);
	}
	
	//加载主页
	Main.loadHome = function(){
		Help.showTip(101);
	    	 if($("#month_chart").attr("class")!=undefined){
	    		 var symbol=$("#symbol").val();
	    		Main.dayInOut(symbol);
	    	 }
	    	 if($("#ExpensePie").attr("class")!=undefined){
	    		Main.ExpensePie();
	    	 }
	    	 if($("#chartBar").attr("class")!=undefined){
	    		 Main.flowBar();
	    	 }
	    	 //}
	}
	//主页2d图
	Main.dayInOut = function(symbol){
		var myChart = echarts.init(document.getElementById("month_chart"));
		$.ajax({url:'../main/home!dayPole.do',
	           type:"post",
	           dataType:"json",	           
	           //error:reportError,
	           success:function(data){
				for(var i=0;i<=data.data.series[0].data.length;i++){
					if(data.data.series[0].data[i]==0){
						   data.data.series[0].data[i]='';
						 }
				}
				for(var i=0;i<=data.data.series[1].data.length;i++){
					if(data.data.series[1].data[i]==0){
						   data.data.series[1].data[i]='';
						 }
				}
   		          optionline = {
   		        		title : {
   		        			subtext: '单位：元（'+symbol+'）',
   		        			x:115,
   		        			y:-6,
   		        			subTextStyle:{
   		        				color:'#888'
   		        			}
   		        	    },
					    tooltip : {
					        trigger: 'axis'
					    },
					    grid:{
					    	x:56,
					    	y:42,
					    	x2:50,
					    	y2:57,
					    	borderWidth:1,
					    	borderColor:'#e2e2e2'
					    },
					    calculable:true,
					     legend: {
					    	orient : 'horizontal',
							x : '87%',
							y:'15',
							itemGap:6,
					        data:data.data.legend,
					        textStyle:{
					        	color:'#888',
					        	fontSize:12
					        }
					    },
					     xAxis : [
					        {
					            type : 'category',
					            data : data.data.category,
					        	splitLine:{
					        		lineStyle:{
					        			color:'#e2e2e2'
					        		}
					        	},
					        	axisLabel:{
					        		interval: 0,
					        		margin:9,
					        		textStyle:{
					        			color:'#888'
					        		}
					        	},
					        	axisLine:{
					        		lineStyle:{
					        			color:'#e2e2e2'
					        		}
					        	},
					        	axisTick:{
					        		show:false
					        	}
					        }
					       
					    ],
					    yAxis : [
					        {
					            type : 'value',
					            splitLine:{
					            	lineStyle:{
					        			color:'#e2e2e2'
					        		}
					        	},
					        	axisLabel:{
					        		textStyle:{
					        			color:'#888'
					        		}
					        	},
					        	axisLine:{
					        		lineStyle:{
					        			color:'#e2e2e2'
					        		}
					        	}
					        }
					    ],
					     series : [
					        {
					            name:data.data.legend[0],
					            type:'line',
					            data:data.data.series[0].data,
					            smooth:true,
					            symbol:'emptyCircle',
					            symbolSize:3,
					            itemStyle: {
					                normal: {
					                	color: '#3bcb41',
					                }
					            }
					        },
					        {
					            name:data.data.legend[1],
					            type:'line',
					            symbol:'emptyCircle',
					            symbolSize:3,
					            data:data.data.series[1].data,
					            smooth:true,
					            itemStyle: {
					                normal: {
					                	color: '#F66058',
					                }
					            }
					        }
					    ],
					    
					    
					};
   		   			  myChart.setOption(optionline);
		   			  $(window).resize(function(){
		   		             myChart.resize();    
		   		          });
		   			/*var browser=navigator.appName;
		   			var b_version=navigator.appVersion ;
		   			var version=b_version.split(";"); 
		   			var trim_Version
		   			var chartWidth=$('#index_day_chart').find('.cash_module').css('width');
		   			if(version[1]){
		   				 trim_Version=version[1].replace(/[ ]/g,"");
		   			}else{
		   				return false;
		   			}
		   			if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE8.0") {
		   				$('#index_day_chart').find('.content').css('width',chartWidth);
		   			}else if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE9.0"){
		   				$('#index_day_chart').find('.content').css('width',chartWidth);
		   			}*/
		      }    
	     });
		
//		if(!$('#month_chart').css('height')){return;}
//		var so = new SWFObject("../components/chart/amcolumn/amcolumn.swf", "caakee", "100%", "100%", "2", "#FFFFFF");
//		so.addVariable("loading_data", "正在加载..."); 
//    	so.addVariable("path", "../components/chart/amline/");
//    	so.addParam("wmode","transparent");//让flash和网页成一体
//		so.addVariable("settings_file", encodeURIComponent("../components/chart/amcolumn/main_column_settings.xml?eee"));
//		so.addVariable("data_file", encodeURIComponent("../main/home!dayPole.do?"+rnd()));
//		so.write("month_chart");
	}
	
	//通用的显示2D饼图方法
    Main.show2DPie = function(options){
//    	var so = new SWFObject("../components/chart/ampie/ampie.swf", "caakee", "90%", "90%", "2", "#FFFFFF");
//   		so.addVariable("loading_data", "正在加载..."); 
//   		so.addParam("wmode","transparent");//让flash和网页成一体
//       	so.addVariable("path", "../components/chart/ampie/");
//   		so.addVariable("settings_file", encodeURIComponent("../components/chart/ampie/2d_ampie_settings_main.xml?"+rnd()));
//   		so.addVariable("chart_data", encodeURIComponent(options.data));
//   		so.write(options.area);
    	
    }
    
    //提交表单查询,用于生成图表
    var myChart;
	Main.submitSearchChart=function(url,zone,options) {
	    myChart = echarts.init(document.getElementById(zone),{
		   noDataLoadingOption :{
					   text: '暂无数据',
					   effect:'bubble',
					   effectOption : {
						   effect: {
							   n: 0
						   }
					   },
					   textStyle: {
						   fontSize: 32,
						   fontWeight: 'bold'
					   }
				   }
	    	}
	   );
   	   $.ajax({url:url,
	           type:"post",
	           dataType:"json",	           
	           //error:reportError,
	           success:function(data){
   		          if($('#'+zone).length==0){//无权限则不执行后面的
   		        	  return;
   		          }
   		   		  options.data=data.data;
   		   		  var legendArray=[];
   		   		  var total=0;
   		   		  for(var i=0;i<data.data.series.data.length;i++){
					  total+=data.data.series.data[i].value
   		   		  }
   		   		  for(var j=0;j<data.data.series.data.length;j++){
   		   			  legendArray.push(data.data.series.data[j].name+':'+data.data.series.data[j].value+' ('+(parseFloat((data.data.series.data[j].value/total))*100).toFixed(3)+'%)');
   		   			  data.data.series.data[j].name=legendArray[j];
   		   		  }
				   for(var k=0;k<data.data.series.data.length;k++){
					   if(data.data.series.data[k].value<total*0.05){
						   total+=total*0.05-data.data.series.data[k].value;
						   data.data.series.data[k].value=total*0.05;
					   }
				   }
   		   		  options.area = zone; //显示区域
   		   		  if (options.type=='2DPie'){
   		   			  optionpie = {
							  	title : {
							        x:'center'
							    },
							    legend: {
							        orient : 'vertical',
							        x :'55%',
							        y:40,
							        data:data.data.series.data,
							        textStyle:{
							        	color:'auto'
							        }
							    },
							    tooltip : {
							        trigger: 'item',
							        formatter: "{a} <br/>{b} "
							    },
							    color:['#f1b53c','#ff7aa2','#ff5d48','#14da55','#009aff'],
							    calculable : false,
								series : [
								        {
								            name:data.data.series.name,
								            type:'pie',
								            radius : ['30%','85%'],
								            center: ['30%', '50%'],
								            data:data.data.series.data,
								            itemStyle: {
								                normal: {
								                    label : {
								                        show: false, position: 'outer',formatter: '{b} : {c} ({d}%)'
								                    },
								                    labelLine:{
								                    	show:false
								                    }
								                }
								            }
								        }
								    ]
							};
   		   			  if(data.data.series.data.length==0){
   		   				  $(".nodataOut").show();
   		   				  $("#ExpensePie").hide();
   		   			  }else{
   		   				  myChart.setOption(optionpie);
						  $(window).resize(function(){
							  myChart.resize();
						  });
   		   			  }
   		   		  }else{
   		   			  CM.alert('不能显示这个图形:'+options.type);
   		   		  }
		      }  
   	   
	     });
     }  
    //现金流入  2d 饼图
   /* Main.CapitalInPie=function(){
    	var url ="../main/home!capticalInPie.do";    	
    	Main.submitSearchChart(CM.url(url),'captical_in_chart',{type:'2DPie'});  	
    }  */
    
    //本月支出 2d 饼图
    Main.ExpensePie=function(){
    	var url ="../main/home!expensePie.do";
    	Main.submitSearchChart(CM.url(url),'ExpensePie',{type:'2DPie'});     	
    } 
    
	//刷新页面
	Main.reload = function(){
		window.location.href=ctx+"/tally/index.do";
	}
	//本月现金流柱状图
	var myChart2=null;
	Main.flowBar=function(){
		var flowIn=$('#flowIn').val(),flowOut =$('#flowOut').val(),flowTotal=$('#flowTotal').val(),Symbol=$('#symbol').val();
		myChart2 = echarts.init(document.getElementById('chartBar'));
		var option2 = {
			    tooltip: {
			        trigger: 'axis',
			        axisPointer: {
			            type: 'none'
			        }
			    },
			    grid:{
			    	 y:20,
			    	 x:80,
			    	 height:'80%',
			         borderWidth:0,
			         borderColor:'rgba(0,0,0,0)'
			      },
			    xAxis: {
			        type: 'value',
			        show:false,
			        splitLine: {show:false},
			        boundaryGap: [0, 0.01]
			    },
			    yAxis: {
			        type: 'category',
			        show:false,
			        splitLine: {show:false},
			        data: ['盈余','流出现金','流入现金']
			    },
			    series: [
			             {
			                 type: 'bar',
			                 itemStyle:{
			                	 normal:{
			                		 label : {
			                             show: true, 
			                             formatter:function(params){
			                            	 return params.name+'\n'+Symbol+params.value;
			                             }
			                         }
			                	 }
			                 },
			                 barWidth:35,
			                 data: [{
			                	 		value:flowTotal,
				                	 	itemStyle:{
				                	 		normal:{color:'#76B4FF',label:{position: flowTotal>=0?'right':'left',textStyle:{fontSize:14}}}
				                 		}
			                 		},
									{
			                 			value:flowOut,
					                	itemStyle:{
					                		normal:{color:'#FFAE39',label:{position: 'right',textStyle:{fontSize:14}}}
						                }
			                 		},
					                {
			                 			value:flowIn,
						                itemStyle:{
						                	normal:{color:'#60C79C',label:{position: 'right',textStyle:{fontSize:14}}}
						                }
			                 		}]
			             }
			             
			         ]
			};
		myChart2.setOption(option2);
		 $(window).resize(function(){
             myChart2.resize();    
          }); 
	}
	Main.init();
