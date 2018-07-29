package flash.utils
{
	public class Cache
	{
		private var cache:Object;
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
		
		public function refresh():void{
			
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