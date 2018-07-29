package flash.shape
{
	import flash.display.ColorCorrection;
	import flash.display.Sprite;
	import flash.geom.Point;
	
	import flashx.textLayout.elements.ParagraphElement;

	public class Circle extends Sprite
	{
		/**
		 * 圆中心
		 */
		private var center:Point;
		/**
		 * 圆半径
		 */
		private var radius:int;
		/**
		 * 圆颜色
		 */
		private var color:int;
		/**
		 * 圆透明度
		 */
		private var opacity:int;
		
		public function Circle(x:int, y:int,radius:int, color:uint)
		{
			this.center = new Point( x, y );
			this.radius = radius ;
			this.color = color;
			this.opacity = 1;
			
		}
		/**
		 * check if a line across the border of the circle
		 * @param  {array} startPoint start point coordinate;
		 * @param  {array} endPoint   end point coordinate;
		 */
		public function checkIntersection (startPoint:Point, endPoint:Point ):Boolean {
			var edx:int = this.center.x - endPoint.x , 
				edy:int = this.center.y - endPoint.y, 
				sdx:int = this.center.x - startPoint.x, 
				sdy:int = this.center.y - startPoint.y, 
				r2:int = this.radius;
			
			r2 = r2 * r2; // Radius squared
			
			// End point is inside the circle and start point is outside
			return edx * edx + edy * edy <= r2 && sdx * sdx + sdy * sdy > r2;
		}
		/**
		 * 画图
		 */
		public function draw():void{
			this.graphics.beginFill( this.color, this.opacity );
			this.graphics.drawCircle( this.center.x, this.center.y, this.radius );
			this.graphics.endFill();
		}
		/**
		 * 根据低层节点,计算上层节点位置;
		 * 设 lv 为层数[1,...], n 为 当层节点的 index[0,1,,,,], s 为当层节点半径;
		 * c( lv, n ) = 2^( lv - 1) + 2*s( lv )*n = 2^( lv - 1) + 2^lv*n;
		 * s( lv + 1 ) = 2* s( lv ) = 2^lv, s(1) = 1;
		 * 设低层节点 (x[i],y[i]), 高层节点(x[i+1],y[i+1])
		 * n = ceil( x[i]/s( i + 1 ) )
		 * x[i+1] = 2^i + 2^( i + 1 ) * ( n - 1 );
		 * 
		 * @param  {int} x    低层节点 x 坐标;
		 * @param  {int} y    低层节点 y 坐标;
		 * @param  {int} step 高层坐标间步长;
		 */
		public static function getParentPos( x:int, y:int, step:int ):Point{
			var d:int = Math.pow( 2, step ),
				nxp:int = Math.max( 0, Math.ceil( x / d ) - 1 ),
				nyp:int = Math.max( 0, Math.ceil( y / d ) - 1 ),
				xh:int = d/2 + d * nxp,
				yh:int = d/2 + d * nyp;

			return new Point( xh, yh );
		}
		/**
		 * 获取中心
		 */
		public function getCenter():Point{
			return this.center;
		}
		/**
		 * 获取半径
		 */
		public function getRadius():int{
			return this.radius;
		}
		/**
		 * 设置颜色
		 */
		public function setColor( color:uint ):void{
			this.color = color;
		}
		/**
		 * get children circles;
		 */
		public function split():Array{
			var halfRadius:int = this.radius/2,
				centers:Array = [
					[ this.center.x -  halfRadius, this.center.y -  halfRadius ],
					[ this.center.x + halfRadius, this.center.y -  halfRadius ],
					[ this.center.x -  halfRadius, this.center.y + halfRadius ],
					[ this.center.x + halfRadius, this.center.y + halfRadius ]
				];
			
			return [
				new Circle( centers[0][0], centers[0][1],  halfRadius, 0 ),
				new Circle( centers[1][0], centers[1][1],  halfRadius, 0 ),
				new Circle( centers[2][0], centers[2][1],  halfRadius, 0 ),
				new Circle( centers[3][0], centers[3][1],  halfRadius, 0 )
			];
		}
		/**
		 * 从画布中移除
		 */
		public function remove( parent:Sprite ):void{
			parent.removeChild( this );
		}
	}
}