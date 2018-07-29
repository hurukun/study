GD.App( 'jqmobile/leng/AGlobal' ).define( function( require ){
    var $ = require( 'jQuery' );

    return {
        container: 'body',
        events: {
            'click [data-navigation]': 'onNavigation'
        },
        main: function(){
            this.pages =[ 'login' ];
            this.curPage = 'login';
        },
        /**
         * 页面切换
         */
        onNavigation: function( evt ){
            evt.preventDefault()
            evt.stopPropagation();
            var target = $(evt.currentTarget ),
                page = target.data( 'navigation' );

            if( page === 'history.back' ){
                page = this.pages.pop();
                $.mobile.changePage( '#' + page , { transition: 'slide', reverse: true });
            }
            else{
                this.pages.push( this.curPage );
                $.mobile.changePage( '#' + page , { transition: 'slide'});
            }
            this.curPage = page;
        }
    }
});

GD.App( 'jqmobile/leng/AHome' ).define( function( require ){
    var $ = require( 'jQuery' );

    return {
        container: '#home',
        events: {
        },
        main: function(){

        }
    }
});

GD.App( 'jqmobile/leng/ABlog' ).define( function( require ){
    var $ = require( 'jQuery' );

    return {
        container: '#home',
        tmplMenu: [
            ' <ul data-role="listview" data-theme="d" data-divider-theme="d">',
                '<li data-role="list-divider">Friday, October 8, 2010 <span class="ui-li-count">2</span></li>',
                '<li>',
                    '<a href="index.html">',
                        '<h3>Stephen Weber</h3>',
                        '<p><strong>You\'ve been invited to a meeting at Filament Group in Boston, MA</strong></p>',
                        '<p>Hey Stephen, if you\'re available at 10am tomorrow, we\'ve got a meeting with the jQuery team.</p>',
                        '<p class="ui-li-aside"><strong>6:24</strong>PM</p>',
                    '</a>',
                '</li>',
            '</ul>'
        ].join(''),
        events: {
        },
        main: function(){

        }
    }
});