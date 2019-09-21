if(r>1){
	console.log(points.length)
	point = points[r-1];
	prePoint = points[r-2];

	d1 = self.distance(point.x, point.y, prePoint.x, prePoint.y);
	sampleNumber = parseInt(d1*50);
	if(r == 2) {
		console.log("r==2")
		// for(var u=0; u<sampleNumber; u++) {

		// }
	}
	if(r === 3){
		console.log("r===3");

	}

	if(r>3) {
		x1 = points[r-4].x;
		x2 = points[r-3].x;
		x3 = points[r-2].x;
		x4 = points[r-1].x;

		y1 = points[r-4].y;
		y2 = points[r-3].y;
		y3 = points[r-2].y;
		y4 = points[r-1].y;

		// w1 = points[r-4].w;
		// w2 = points[r-3].w;
		// w3 = points[r-2].w;
		// w4 = points[r-1].w;
		v1 = points[r-4].v;
		v2 = points[r-3].v;
		v3 = points[r-2].v;
		v4 = points[r-1].v;

		if(r===4){
			b1 = {
				x:  x2-1/3*(x3-x1),
				y: y2-1/3*(y3-y1),
				// w: w2-1/3*(w3-w1)
				v: v2-1/3*(v3-v1)
			}
			a1 = {
				x: x1+1/3*(x2-x1),
				y: y1+1/3*(y2-y1),
				// w: w1+1/3*(w2-w1)
				v: v1+1/3*(v2-v1)
			}
			for(var u=0; u<sampleNumber; u++){
				var t = u/(sampleNumber-1);
				tempX = (1-t)*(1-t)*(1-t)*x1
								+t*(1-t)*(1-t)*3*a1.x
								+t*t*(1-t)*3*b1.x
								+t*t*t*x2;
				tempY = (1-t)*(1-t)*(1-t)*y1
								+t*(1-t)*(1-t)*3*a1.y
								+t*t*(1-t)*3*b1.y
								+t*t*t*y2;
				tempV = (1-t)*(1-t)*(1-t)*v1
								+t*(1-t)*(1-t)*3*a1.v
								+t*t*(1-t)*3*b1.v
								+t*t*t*v2;
				tempW = this.opts.wmax*Math.pow(Math.E, -tempV*tempV/(2*this.opts.gaussian*this.opts.gaussian));

				ctx.drawImage(image,tempX-tempW,tempY-tempW, 2*tempW,2*tempW);
			}
			

		}
		
		a2 = {
			x: x2+1/3*(x3-x1),
			y: y2+1/3*(y3-y1),
			// w: w2+1/3*(w3-w1)
			v: v2+1/3*(v3-v1)
		}
		b2 = {
			x: x3-1/3*(x4-x2),
			y: y3-1/3*(y4-y2),
			// w: w3-1/3*(w4-w2)
			v: v3-1/3*(v4-v2)
		}

		for(var u=0; u<sampleNumber; u++){
			var t = u/(sampleNumber-1);
			tempX = (1-t)*(1-t)*(1-t)*x2
							+t*(1-t)*(1-t)*3*a2.x
							+t*t*(1-t)*3*b2.x
							+t*t*t*x3;
			tempY = (1-t)*(1-t)*(1-t)*y2
							+t*(1-t)*(1-t)*3*a2.y
							+t*t*(1-t)*3*b2.y
							+t*t*t*y3;
			// tempW = (1-t)*(1-t)*(1-t)*w2
			// 				+t*(1-t)*(1-t)*3*a2.w
			// 				+t*t*(1-t)*3*b2.w
			// 				+t*t*t*w3;
			tempV = (1-t)*(1-t)*(1-t)*v2
							+t*(1-t)*(1-t)*3*a2.v
							+t*t*(1-t)*3*b2.v
							+t*t*t*v3;
			console.log(tempV)
			tempW = this.opts.wmax*Math.pow(Math.E, -tempV*tempV/(2*this.opts.gaussian*this.opts.gaussian));
			if(tempW<this.opts.wmin){
				tempW = 2;
			}
			ctx.drawImage(image,tempX-tempW,tempY-tempW, 2*tempW,2*tempW);
		}

		if(r == points.length) {
			// ctx.lineTo(x4, y4)
			console.log("r == points.length");
			a3 = {
				x: x3+1/3*(x4-x2),
				y: y3+1/3*(y4-y2),
				// w: w3+1/3*(w4-w2)
				v: v3+1/3*(v4-v2)
			};
			b3 = {
				x: x4-1/3*(x4-x3),
				y: y4-1/3*(y4-y3),
				// w: w4-1/3*(w4-w3)
				v: v4-1/3*(v4-v3)
			}
			for(var u=0; u<sampleNumber; u++){
				var t = u/(sampleNumber-1);
				tempX = (1-t)*(1-t)*(1-t)*x3
								+t*(1-t)*(1-t)*3*a3.x
								+t*t*(1-t)*3*b3.x
								+t*t*t*x4;
				tempY = (1-t)*(1-t)*(1-t)*y3
								+t*(1-t)*(1-t)*3*a3.y
								+t*t*(1-t)*3*b3.y
								+t*t*t*y4;
				// tempW = (1-t)*(1-t)*(1-t)*w3
				// 				+t*(1-t)*(1-t)*3*a3.w
				// 				+t*t*(1-t)*3*b3.w
				// 				+t*t*t*w4;
				tempV = (1-t)*(1-t)*(1-t)*v3
								+t*(1-t)*(1-t)*3*a3.v
								+t*t*(1-t)*3*b3.v
								+t*t*t*v4;
				tempW = this.opts.wmax*Math.pow(Math.E, -tempV*tempV/(2*this.opts.gaussian*this.opts.gaussian));
				ctx.drawImage(image,tempX-tempW,tempY-tempW, 2*tempW,2*tempW);
			}
		}
		
	}
	
}