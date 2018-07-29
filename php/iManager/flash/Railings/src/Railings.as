package
{
	import flash.app.ImageLoader;
	import flash.display.*;
	import flash.events.*;
	import flash.external.ExternalInterface;
	import flash.geom.Point;
	import flash.shape.Circle;
	import flash.system.Security;
	import flash.utils.Cache;
	import flash.utils.setTimeout;
	
	
	public class Railings extends Sprite
	{
		private	var prevMousePos:Point;
		/**
		 * 图片 url
		 */
		private var url:String;
		/**
		 * 图片加载器;
		 */
		private var imageLoader:ImageLoader;
		
		private var xSample:int;
		private var ySample:int;
		private var ampFactor:uint;
		
		private var imgData:Array;
		private var cache:Cache;
		
		public function Railings()
		{
			stage.scaleMode = StageScaleMode.NO_SCALE;
			stage.align = StageAlign.TOP_LEFT;
	
			this.bindEvents();
		}
		
		private function bindEvents():void{
			 this.addEventListener( Event.ADDED_TO_STAGE, onInited );
			 this.addEventListener( Event.ENTER_FRAME, onEnterFrame );
			 this.addEventListener( MouseEvent.MOUSE_OVER, onMouseMove );
		}
		 /**
		  * 检测安全性
		 */
		private function onEnterFrame(e:Event):void
		{
			 if (stage.stageWidth > 0)
			 {
				 //去除侦听器
				 this.removeEventListener(Event.ENTER_FRAME, onEnterFrame);
				 
				 //设置
				 Security.allowDomain("*");
			 }
		}
		/**
		 * flash 加载完成
		 */
		private function onInited( event:Event ):void{
			var param:Object = root.loaderInfo.parameters;
			this.url = param[ 'img' ];
			this.xSample = param[ 'xSample' ];
			this.ySample = param[ 'ySample' ];
//			this.url = 'w_mengchong.jpg';
//			this.xSample = 128;
//			this.ySample = 128;
			this.ampFactor = 4;
			this.prevMousePos = new Point();
			this.imgData = [];
			this.cache = new Cache();

			/**
			 * 加载图片
			 */
			this.loadImage( this.url );
		}
		/**
		 * 一幅图像加载完毕
		 */
		private function onImageLoaded( event:Event ):void{
			var bitmap:Bitmap = this.imageLoader.getImageData(); 
			
			var xStep:int = Math.floor( bitmap.bitmapData.width/this.xSample ), 
				yStep:int = Math.floor( bitmap.bitmapData.height/this.ySample );
			for( var yi:int = 0; yi < bitmap.bitmapData.height; yi+= xStep ){
				for( var xi:int = 0; xi < bitmap.bitmapData.width; xi+= yStep ){
					this.imgData.push(bitmap.bitmapData.getPixel(xi,yi) );
				}
			}
			
			this.imageLoader = null;
			
			var x:int = this.xSample / 2,
				y:int = this.ySample / 2,
				r:int = this.xSample / 2,
				circle:Circle = new Circle( x * this.ampFactor ,y * this.ampFactor, r * this.ampFactor, this.avgColor(x,y,r ) ),
				center:Point = circle.getCenter();
			
			circle.draw();
			this.addChild( circle );
			this.cache.add( center.x, center.y,circle, false );
			
		}
		/**
		* 鼠标移动事件
		*/ 
		private function onMouseMove( event:MouseEvent ):void{
			var curMousePos:Point = new Point( event.localX, event.localY ),
				sample:Array = this.traceMove( this.prevMousePos,curMousePos,4 );
			
			this.hitAndSplit( sample );
			
			this.prevMousePos = curMousePos;

		}
		/*-------------------------------------------------------------------*/
		private function avgColor( x:int, y:int, radius:int ):uint{
			if( 0 == 0 ){
				return this.getColor( x,y );
			}
			var ll:uint = this.getColor( x - radius, y - radius ),
				lr:uint = this.getColor( x + radius - 1, y - radius ),
				hl:uint = this.getColor( x - radius, y + radius - 1 ),
				hr:uint = this.getColor( x + radius - 1, y + radius - 1 );
			
				return Math.round( ( ll + lr + hl + hr )/4 );  
		}
		
		private function getColor( x:int, y:int ):uint{
			var index:int = this.xSample * y + x;
			return this.imgData[ index ];
		}
		
		private function hitAndSplit( samples:Array ):void{
			var needRefresh:Boolean = false,
				circle:Circle = null;
			for( var ii:int = 1; ii < samples.length; ii++ ){
				circle = this.hitCircle( samples[ ii ] );
				if( circle ){//&&circle.checkIntersection( samples[ ii - 1 ], samples[ ii ] ) ){
					this.split( circle );
					needRefresh = true;
				}
			}
			//防止重复触发分裂
			if( needRefresh ){
				setTimeout(  this.cache.refresh, 500);
			}

		}
		private function hitCircle( point:Point ):Circle{
			var xi:int = Math.floor(point.x / this.ampFactor),
				yi:int = Math.floor(point.y / this.ampFactor);
			// invalid circle center;
			if ( xi < 0 || xi >  this.xSample || yi < 0 || yi > this.ySample) {
				return null;
			}
			//search circle and its parent;
			var node:* = null,
				lv:int = 1,
				r:int = 1,
				parentPos:Point = new Point( xi, yi );
			do{
				node = this.cache.get( parentPos.x * this.ampFactor, parentPos.y * this.ampFactor );
				if( node ){
					return node;
				}
				parentPos = Circle.getParentPos( parentPos.x, parentPos.y, lv );
				lv ++;
				r *=2;
			}while ( r <= this.xSample );
			
			return null;
			
		}
		
		private function intervalLength( startPoint:Point, endPoint:Point ):int {
			var dx:int = endPoint.x - startPoint.x,
				dy:int = endPoint.y - startPoint.y;
			
			return Math.sqrt(dx * dx + dy * dy);
		}
		/**
		 * 加载图像
		 */
		private function loadImage( url:String ):void{
			this.imageLoader = new ImageLoader( url );
			this.imageLoader.addEventListener( Event.COMPLETE, onImageLoaded );
		}
		private function split( circle:Circle ):void{
			var children:Array = circle.split(),
				center:Point = circle.getCenter(),
				cChild:Point = null,
				sprite:Sprite = null;
			//use children to replace parent circle;
			
			
			for( var ii:int = 0; ii < children.length; ii++ ){
				cChild = children[ ii ].getCenter();
				children[ ii ].setColor( this.avgColor( cChild.x / this.ampFactor, cChild.y / this.ampFactor,children[ ii ].getRadius() / this.ampFactor ) );
				children[ ii ].draw();
				this.addChild( children[ ii ] );
				this.cache.add( cChild.x,cChild.y,children[ ii ], true );
				
			}
			
			circle.remove( this );
			
			this.cache.flush( center.x, center.y );
		}
		/**
		* 对鼠标经过的直线路径进行抽样
		* @param  {array} startPoint 数据路径起始点
		* @param  {array} endPoint   鼠标路径终点
		* @param  {int} maxLength  抽样点间间隔
		*/
		private function traceMove( startPoint:Point, endPoint:Point, maxLength:int ):Array {
			var breaks:Array = new Array(),
				length:int = this.intervalLength(startPoint, endPoint),
				numSplits:int = Math.max(Math.floor(length / maxLength), 1),
				dx:int = (endPoint.x - startPoint.x) / numSplits,
				dy:int = (endPoint.y - startPoint.y) / numSplits;
			
			for(var i:int = 0; i <= numSplits; i++) {
				breaks.push( new Point( startPoint.x + dx * i, startPoint.y + dy * i ) );
			}
			return breaks;
		}
		
	}
}