package
{
	import flash.display.Bitmap;
	import flash.display.Loader;
	import flash.display.LoaderInfo;
	import flash.display.Sprite;
	import flash.events.*;
	import flash.external.ExternalInterface;
	import flash.net.URLRequest;
	import flash.system.Security;
	
	public class ImageLoader extends Sprite
	{
		
		private var bitmap:Bitmap;
		/**
		 * 图像数据
		 */
		private var imageData:Array;
		private var xSample:int;
		private var ySample:int;
		/**
		 * 构造函数
		 */
		public function ImageLoader()
		{
			var param:Object = root.loaderInfo.parameters;
			var url:String = param[ 'img' ];
			this.xSample = param[ 'xSample' ];
			this.ySample = param[ 'ySample' ];
			this.imageData = new Array();
			this.loadImage( url );
			this.bindEvents();
		}
		/**
		 * 绑定相关事件
		 */
		public function bindEvents():void{
			this.addEventListener(Event.ADDED_TO_STAGE, onInited);
			this.addEventListener(Event.ENTER_FRAME, checkStageHandler);
		}
		/**
		 * 加载图像
		 */
		public function loadImage(url:String):void {
			// Set properties on my Loader object
			var imageLoader:Loader = new Loader();
			//bind load image events;
			imageLoader.contentLoaderInfo.addEventListener(ProgressEvent.PROGRESS, onLoading);
			imageLoader.contentLoaderInfo.addEventListener(Event.COMPLETE, onLoaded);
			imageLoader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, onIOError);
			//laod image;
			imageLoader.load(new URLRequest(url));
			
			addChild( imageLoader );
		}
		/**
		 * 检测安全性
		 */
		private function checkStageHandler(e:Event):void
		{
			if (stage.stageWidth > 0)
			{
				//去除侦听器
				this.removeEventListener(Event.ENTER_FRAME, checkStageHandler);
				
				//设置
				Security.allowDomain("*");
			}
		}
		/**
		 * flash 加载完成
		 */
		private function onInited( event:Event ):void{
			/**
			 * flash 加载完成后才能调用
			 */
			if( ExternalInterface.available ){
				ExternalInterface.addCallback("getImageData", getImageData );
			}
			else{
				throw new Error("The ExternalInterface is not available in this container.");
			}
		}
		private function onLoading(event:Event ):void{
		}
		/**
		 * 图像加载成功
		 */
		private function onLoaded( event:Event ):void{
			var loader:Loader = Loader(event.target.loader); 
			var info:LoaderInfo = LoaderInfo(loader.contentLoaderInfo); 
			this.bitmap = info.content as Bitmap; 
			this.dispatchEvent(new Event(Event.COMPLETE)); 
			
			var xStep:int = Math.floor( bitmap.bitmapData.width/this.xSample ), 
				yStep:int = Math.floor( bitmap.bitmapData.height/this.ySample );
			for( var yi:int = 0; yi < bitmap.bitmapData.height; yi+= xStep ){
				for( var xi:int = 0; xi < bitmap.bitmapData.width; xi+= yStep ){
					imageData.push(bitmap.bitmapData.getPixel(xi,yi) );
				}
			}
			ExternalInterface.call( "IGPR.GEvent.fire", "dataReady" );
			trace( 'width=' + bitmap.bitmapData.width + ';height=' + bitmap.bitmapData.height );
		}
		private function onIOError( event:Event ):void{
			trace("加载图片错误onIoError: " + event);
		}
		/**
		 * 返回图像数据
		 */
		public function getImageData():Array{
			return this.imageData;
		}
	}
}