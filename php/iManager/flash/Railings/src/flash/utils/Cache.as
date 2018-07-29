package flash.utils
{
	public class Cache
	{
		/**
		 * 一级缓存
		 */
		private var cache:Object;
		/**
		 * 二级缓存
		 */
		private var prepare: Object;
		public function Cache()
		{
			this.cache = {};
			this.prepare = {};
		}
		/**
		 * 缓存当前显示的节点
		 * @param  {int} x    x坐标
		 * @param  {int} y    y坐标
		 * @param  {bool} prepare 是放入二级缓存,还是一级缓存
		 * @param  {Object} node 节点
		 */
		public function add( x:int, y:int, node:*, prepare:Boolean ):void{
			if( prepare ){
				this.prepare[ x + ':' + y ] = node;
			}
			else{
				this.cache[ x + ':' + y ] = node;
			}
		}
		/**
		 * 将二级缓存并入一级缓存
		 */
		public function refresh():void{
			for( var key:* in this.prepare ){
				this.cache[ key ] = this.prepare[ key ];
			}
			this.prepare = {};
		}
		
		/**
		 * 获取缓存的节点
		 * @param  {int} x    x坐标
		 * @param  {int} y    y坐标
		 */
		public function get( x:int,y:int ):*{
			return this.cache[ x + ':' + y ];
		}
		
		/**
		 * 删除缓存的节点
		 * @param  {int} x    x坐标
		 * @param  {int} y    y坐标
		 */
		public function flush( x:int, y:int ):void{
			delete this.cache[ x + ':' + y ];
		}
	}
}