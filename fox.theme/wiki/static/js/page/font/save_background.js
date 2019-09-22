			var img = this.backgroundSrc;
			var ctx=this.canvas.getContext("2d");
			
			ctx.drawImage(img,0,0,600,600);





			this.backgroundImage.addEventListener('click', function(e){
				self.backgroundSrc = e.target;
				console.log(self.backgroundSrc);
				self.draw();
			}, false)
			


		this.el = document.getElementById(id);
		this.backgroundImage = document.getElementById(bg);
		this.backgroundSrc = this.backgroundImage.getElementsByTagName('img')[0];


	var saveImageBtn = document.querySelector(".saveImage");
	saveImageBtn.addEventListener("click", function(){
		saveImage(charsBoard.canvas);
	},false);
	function saveImage(board) {
		
		//here is the most important part because if you dont replace you will get a DOM 18 exception.  
          // var image = myCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream;Content-Disposition: attachment;filename=foobar.png");  
          	var image = board.toDataURL("image/png").replace("image/png", "image/octet-stream;Content-Disposition: attachment;filename=foobar.png");   
          	window.location.href=image; // it will save locally  
   //        	saveImageBtn.href = image;
          	
						// saveImageBtn.download = 'myOtherFilename.png';
	}	