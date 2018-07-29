
$( '#yzmdl' ).bind( 'click', function(){
    var b = 'guahao?url=' + encodeURIComponent('http://www.bjguahao.gov.cn/comm/code.php?id=' + Math.random() );
    this.src = b
} );

$("#submit").bind( "click", function( evt ){
    var name = $("#name").val(), 
        id=$("#id").val(), 
        rcode = $("#rcode").val();

    $.ajax( {
        url: '/guahao?url=' + encodeURIComponent('http://www.bjguahao.gov.cn/comm/logon.php'),
        type: 'POST',
        data:{
            truename: name,
            sfzhm: id,
            yzm: rcode
        },
        success: function( resp ){

        }
    } );
} );

$('#checkAuth').bind( 'click', function(){
    $.get( '/guahao?url=' + encodeURIComponent('http://www.bjguahao.gov.cn/comm/plus/ajax_user.php'), function(resp){
        var data = resp.split( '|' );
        if( data[ 0 ] === 'true' ){
            window.alert( 'Authorized.' );
        }
        else{
            window.alert( 'Unauthorized.' );
        }
    });
} )
