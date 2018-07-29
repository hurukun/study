arrIndex = 0 ; 
arrCard = new Array() ; 
arrCardTemp = new Array() ; 
function Card(cardUrl, title, subTitle, link, thumb){
    this.cardUrl = cardUrl; 
    this.title = title ; 
    this.subTitle = subTitle; 
    this.link = link; 
    this.thumb = thumb ; 
}

function setCard(cardUrl, title, subTitle, link){
    arrCard[arrIndex++] = new Card(cardUrl, title, subTitle, link, '') ; 
}

function createSlider(){    
        for(i = 0 ; i<arrCard.length; i++){
             c = arrCard[i] ; 
             url = c.cardUrl ; 
             strUrlArr = url.split(".") 
             //strThumbImg = strUrlArr[0] + "_thumb" + "." + strUrlArr[1] ; 
             //if(UrlExists(strThumbImg)){
             //    c.thumb = strThumbImg ; 
             //}else{
                c.thumb = url ; 
             //}
             arrCardTemp[i] = c ; 
             
        }
        for(i = 0 ; i<arrCardTemp.length; i++){
            c = arrCardTemp[i] ; 
            document.getElementById("divSliderItems").innerHTML +=
                    "<div class=\"slider-item\">" + 
                        "<a href=\"" + c.link + "\"/>" + 
                        "<img src=\"" + c.cardUrl +"\"/></a>" +
                        "<img class=\"thumbnail\" src='" + c.thumb +"'/>" + 
                        "<div class=\"caption\">" + 
                        "<h2><a href=\"" + c.link + "\" title=\"" + c.title + "\">" + c.title + "</a></h2>" + 
                        "<h3><a href=\"" + c.link + "\" title=\"" + c.subTitle + "\">" + c.subTitle + "</a></h3>" +
                    "</div>" + 
                   "</div>" ;
        }
        
        
}
function UrlExists(url){
    var xmlhttp;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp=new XMLHttpRequest();
    }else{// code for IE6, IE5
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open('GET', url, false);
    xmlhttp.send();
    if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
       return true ; 
    }else{
       return false ; 
    }
   
}
