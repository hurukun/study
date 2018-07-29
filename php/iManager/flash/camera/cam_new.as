package
{
	import flash.system.*;
	import flash.external.*;
	import flash.system.fscommand;
	import flash.display.Sprite;
	import flash.display.LoaderInfo;
	import flash.media.Camera;
	import flash.media.Video;
	import flash.events.StatusEvent;
	import flash.events.ActivityEvent;
	import flash.events.MouseEvent;
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.text.TextFormat;
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.MovieClip;
	import flash.net.FileReference;
	import flash.net.URLRequest;
	import flash.net.URLLoader;
	import flash.net.URLRequestHeader;
	import flash.utils.ByteArray;
	import flash.net.URLRequestMethod;
	import flash.net.navigateToURL;
	import com.adobe.images.JPGEncoder;
	import flash.media.Sound;
	import flash.media.SoundChannel;
	import flash.utils.Timer;
	import flash.events.TimerEvent;

	public class cam_new extends Sprite
	{
		var cam:Camera = Camera.getCamera(); // 获取摄像头
		var isCamReady: Boolean = false;
		var video:Video = null; // 新建视频文件
		var preview:MovieClip = null; // 用于保存临时快照
		var bmp:Bitmap = null; // 图片对象
		
		/**
		 * 外部参数
		 */
		var saveUrl:String="";

		// 新版需要的参数
		var _ka:String = "";
		var _btnShot = new CBtnShot();
		var _btnRedo = new CBtnRedo();
		var _mc:MovieClip = new CBlackMC(); // 黑布
		var _tm:Timer = null;

		//初始化结束后才调用外部接口
		public function onInited( e:Event ): void
		{	//没有摄像头
			if ( !cam )
			{
				this.callExternalInterface("noCamera", "");
			}
		}
		public function onStatusChange( e:StatusEvent ):void
		{
			if( e.code == "Camera.unmuted" ){
				this.isCamReady = true;
			}
		}
		/**
		 * 对象初始化 
		 */
		public function cam_new():void
		{
			Security.allowDomain("*");
			this.addEventListener(Event.ADDED_TO_STAGE, onInited);

			// 没有摄像头
			if (!cam)
			{
				//this.callExternalInterface("noCamera", "");
				return;
			}
			else{
				cam.addEventListener( StatusEvent.STATUS, onStatusChange );
			}
			
			//获取flash参数
			var param:Object = root.loaderInfo.parameters;
			this.saveUrl = param[ 'saveurl' ];

			// 视频
			cam.setMode(this.width, this.height, 15);
			video = new Video(this.width, this.height);
			video.x = 0;
			video.y = 0;
			video.attachCamera(cam); // 加载数据

			// 显示视频文件
			addChild(video);

			// 两个按钮初始化
			this._btnShot.x = 7;
			this._btnShot.y = 251;
			this._btnShot.buttonMode = true;
			this._btnShot.useHandCursor = true;
			this._btnRedo.x = 7;
			this._btnRedo.y = 251;
			this._btnRedo.buttonMode = true;
			this._btnRedo.useHandCursor = true;
			this._btnShot.addEventListener(MouseEvent.CLICK, onShotClick);
			this._btnRedo.addEventListener(MouseEvent.CLICK, onRedoClick);
			addChild(this._btnShot);

			preview = new MovieClip();
			preview.x = 0;
			preview.y = 0;
			preview.name = "previewmc";
			cam.addEventListener(StatusEvent.STATUS, statusHandler);

			ExternalInterface.addCallback("shot", ex_shot);
			ExternalInterface.addCallback("reset", ex_reset);
			ExternalInterface.addCallback("save", ex_save);
			ExternalInterface.addCallback("sound", ex_sound);
		}

		function statusHandler(event:StatusEvent):void
		{
			if (String(event.code) == "Camera.Unmuted")
			{
				this.callExternalInterface("allowCamera", "");
				cam.removeEventListener(StatusEvent.STATUS, statusHandler);
			}
			else
			{
				this.callExternalInterface("denyCamera", "");
			}
		}

		function ex_sound(url:String):void
		{
			this._ka = String(url);
		}
		/**
		 * 拍照
		 */ 
		function ex_shot()
		{
			if( this.cam.muted ){
				return;
			}
			// 去掉拍照按钮
			removeChild(this._btnShot);

			var bm:BitmapData = new BitmapData(video.width, video.height);
			bm.draw(video);
			var w = bm.width;
			var h = bm.height;
			var color = "";
			for (var i = 0; i < w; i++)
			{
				for (var j = 0; j < h; j++)
				{
					color += bm.getPixel(i, j).toString(16) + ",";
				}
				color += "\n";
			}

			bmp = new Bitmap(bm);
			preview.addChild(bmp);

			addChild(preview);

			this.callExternalInterface("getCameraData", color);
			trace("shot");

			// 显示重拍按钮
			addChild(this._btnRedo);

			// 显示黑布
			addChild(this._mc);

			// 播放声音
			this.playsound();
		}

		function ex_show():void
		{
		/*  // 这个不知道谁加的，应该没用，而且ex_show是private，外面也不可能调用到，我给去掉了 2011.08.16
		   // 图片质量为80
		   var encoder:JPGEncoder=new JPGEncoder(80);
		   var bytes:ByteArray=encoder.encode(getBitmapData());
		   var header:URLRequestHeader = new URLRequestHeader ("Content-type", "application/octet-stream");

		   //Make sure to use the correct path to jpg_encoder_download.php
		   var jpgURLRequest:URLRequest = new URLRequest ("http://www.kaixin009.com/jpg_encoder_download.php?name=snapshot.jpg");
		   jpgURLRequest.requestHeaders.push(header);
		   jpgURLRequest.method = URLRequestMethod.POST;
		   jpgURLRequest.data = bytes;

		   var jpgURLLoader:URLLoader = new URLLoader();
		   navigateToURL(jpgURLRequest, "_blank");
		   trace("show");
		 */
		}
		/**
		 * 保存图片
		 */
		public function ex_save():void
		{
			var bmpdata:BitmapData = new BitmapData(preview.width, preview.height);
			bmpdata.draw(preview);
			var jpgEncoder:JPGEncoder = new JPGEncoder(80);
			var jpgdata:ByteArray = jpgEncoder.encode(bmpdata);
			var header:URLRequestHeader = new URLRequestHeader("Content-type", "application/octet-stream");

			//var jpgURLRequest:URLRequest = new URLRequest( "/set/camera_logo_submit.php");
			var jpgURLRequest:URLRequest = new URLRequest( this.saveUrl );
			jpgURLRequest.requestHeaders.push(header);
			jpgURLRequest.method = URLRequestMethod.POST;
			jpgURLRequest.data = jpgdata;

			var jpgURLLoader:URLLoader = new URLLoader();
			jpgURLLoader.addEventListener(IOErrorEvent.IO_ERROR, errorHandler);
			jpgURLLoader.addEventListener(Event.COMPLETE, loaderCompleteHandler);

			try
			{
				jpgURLLoader.load(jpgURLRequest);
			}
			catch (error:SecurityError)
			{
				trace("A SecurityError has occurred.");
			}
			trace("save");
		}

		/*public function ex_edit():void
		{
			var bmpdata:BitmapData = new BitmapData(preview.width, preview.height);
			bmpdata.draw(preview);
			var jpgEncoder:JPGEncoder = new JPGEncoder(80);
			var jpgdata:ByteArray = jpgEncoder.encode(bmpdata);
			var header:URLRequestHeader = new URLRequestHeader("Content-type", "application/octet-stream");

			var jpgURLRequest:URLRequest = new URLRequest("/set/aj_camera_upload.php");
			jpgURLRequest.requestHeaders.push(header);
			jpgURLRequest.method = URLRequestMethod.POST;
			jpgURLRequest.data = jpgdata;

			var jpgURLLoader:URLLoader = new URLLoader();
			jpgURLLoader.addEventListener(IOErrorEvent.IO_ERROR, errorHandler);
			jpgURLLoader.addEventListener(Event.COMPLETE, loaderCompleteHandler);

			try
			{
				jpgURLLoader.load(jpgURLRequest);
			}
			catch (error:SecurityError)
			{
				trace("A SecurityError has occurred.");
			}
			trace("save");
		}*/
		/**
		 * 图片上传结束 回调
		 */
		private function loaderCompleteHandler(event:Event):void
		{
			this.callExternalInterface("saveOk", event.currentTarget.data);
		}
		/**
		 * 图片上传错误 回调
		 */
		private function errorHandler(e:IOErrorEvent):void
		{
			this.callExternalInterface("saveFail");
		}
		/**
		 * 重拍
		 */
		public function ex_reset():void
		{
			// 去掉重拍按钮，显示拍照按钮
			removeChild(this._btnRedo);
			addChild(this._btnShot);

			if (bmp != null)
			{
				preview.removeChild(bmp);
				removeChild(preview);
			}
			this.callExternalInterface("resetCameraData", this.saveUrl );
			trace("reset");
		}

		/**
		 * 定义视频存为图片格式
		 */
		public function getBitmapData():BitmapData
		{
			// 图片尺寸为视频的大小
			var bmp:BitmapData = new BitmapData(video.width, video.height);
			bmp.draw(video); // 视频绘制成图片
			return bmp; // 绘制成功得到的返回值	
		}

		///////////////////////////////////////////////////////////////////////////////////////
		private function onShotClick(e:MouseEvent):void
		{
			this.ex_shot();
		}

		private function onRedoClick(e:MouseEvent):void
		{
			this.ex_reset();
		}

		private function playsound()
		{
			try
			{
				// 播放指定文件
				if (this._ka)
				{
					var s:Sound = new Sound();
					s.addEventListener(Event.COMPLETE, onSoundLoaded);
					s.addEventListener(IOErrorEvent.IO_ERROR, ioErrorHandle);
					var req:URLRequest = new URLRequest(this._ka);
					s.load(req);
				}
				else
				{
					// 播放默认的内置声音
					var ka:CKaSound = new CKaSound();
					var soundchnl:SoundChannel = ka.play();
					soundchnl.addEventListener(Event.SOUND_COMPLETE, soundCompleteHandler);
				}
				return;
			}
			catch (error:Error)
			{
			}

			// 以防万一
			this.hideMC();
		}

		private function ioErrorHandle(ioe:IOErrorEvent):void
		{
			// 以防万一
			this.hideMC();
		}

		private function onSoundLoaded(event:Event):void
		{
			var localSound:Sound = event.target as Sound;
			var soundchnl:SoundChannel = localSound.play();
			soundchnl.addEventListener(Event.SOUND_COMPLETE, soundCompleteHandler);
		}

		private function soundCompleteHandler(event:Event)
		{
			this.hideMC(0);
		}

		private function hideMC(s:Number = 300):void
		{
			if (s > 0)
			{
				if (!this._tm)
				{
					this._tm = new Timer(s, 1);
				}
				this._tm.addEventListener(TimerEvent.TIMER, afterActionTimer);
				this._tm.start();
			}
			else
			{
				this.afterActionTimer(null);
			}
		}

		private function afterActionTimer(e:TimerEvent):void
		{
			try
			{
				if (this._tm)
				{
					this._tm.stop();
					this._tm.removeEventListener(TimerEvent.TIMER, afterActionTimer);
					this._tm = null;
				}

				removeChild(this._mc);
			}
			catch (error:Error)
			{
			}
		}
		/*
		 *   调用外部接口
		 */
		private function callExternalInterface(funcionName:String, paraStr:String =""):void
		{
			//trace( funcionName + ' ' + ExternalInterface.available);
			if (ExternalInterface.available) 
			{
				ExternalInterface.call("cam_swf_DoFSCommand",funcionName,paraStr);
			}
			else
			{
				fscommand(funcionName, paraStr);
			}
		}
	}
}