package flash.app
{
	import flash.display.Bitmap;
	import flash.display.Loader;
	import flash.display.LoaderInfo;
	import flash.display.Sprite;
	import flash.events.*;
	import flash.net.URLRequest;
	import flash.system.LoaderContext;
	
	public class ImageLoader extends Sprite
	{
		
		private var bitmap:Bitmap;
		/**
		 * 构造函数
		 */
		public function ImageLoader(url:String)
		{
			this.loadImage( url );
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
		}
		private function onIOError( event:Event ):void{
			trace("加载图片错误onIoError: " + event);
		}
		/**
		 * 返回图像数据
		 */
		public function getImageData():Bitmap{
			return this.bitmap;
		}
	}
}