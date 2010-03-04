/**
 * Konami.php
 *
 * File description
 *
 * PHP Version: 5
 *
 * @category File
 * @package
 * @author   meza
 * @license  GPL3.0
 *                    GNU GENERAL PUBLIC LICENSE
 *                       Version 3, 29 June 2007
 *
 * Copyright (C) 2007 Free Software Foundation, Inc. <http://fsf.org/>
 * Everyone is permitted to copy and distribute verbatim copies
 * of this license document, but changing it is not allowed.
 * *
 * @version  GIT: $Id$
 * @link     http://github.com/meza/KonamiJS
 */


/**
 * Konami object
 */
Konami = function(config){
    this.defaultConfig = {
	callback: function() {},
	needEnter: false,
	timeLimit: 0,
	autoStart: true
	}
    if (typeof config !== "object") {
	config = {}
    }
    for(attr in this.defaultConfig) {
	if(typeof config[attr] == "undefined"){
	    config[attr] = this.defaultConfig[attr]
	}
    }

    this.config = config

    this.happn = {
         "addEventListener" : function(element, eventName, eventHandler, scope)
        {
            var scopedEventHandler = scope ? function(e) { eventHandler.apply(scope, [e]); } : eventHandler;
            if(document.addEventListener)
                element.addEventListener(eventName, scopedEventHandler, false);
            else if(document.attachEvent)
                element.attachEvent("on"+eventName, scopedEventHandler);
        }
    }
    this.targetFF = window;
    this.targetIE = document.body;


    this.callback=this.config.callback;

    this.keysPressed  = [];
    this.timer        = false;
    this.konamiString = "38,38,40,40,37,39,37,39,66,65";
    if(this.config.needEnter==true) this.konamiString+=",13";
       // up, up, down, down, left, right, left, right, B, A, enter

    if(this.config.autoStart==true) this.attachEvent();

}

Konami.prototype.setTimer = function() {
    var Konami = this;

    function timerRelay() {
        Konami.restartKonami();
    }

    if(this.timer==false){
        this.timer=true;
        setTimeout(timerRelay, Konami.config.timeLimit);
    }
}

Konami.prototype.attachEvent = function(){
    if (window.addEventListener) {
        this.setUpFirefox();
    }else if(document.body.attachEvent) {
        this.setUpIE();

    }
}

Konami.prototype.restartKonami = function(){
    this.keysPressed=[];
    this.timer=false;
}

Konami.prototype.keyHandler = function(e){
    if(this.timer==false && (this.config.timeLimit > 0)){
        this.setTimer();
    }
    this.keysPressed.push(e.keyCode );
    if (this.keysPressed.toString().indexOf(this.konamiString) >= 0 ){
        this.showKonami();
    }
}

Konami.prototype.setUpFirefox = function(){
    this.happn.addEventListener(this.targetFF,'keydown',this.keyHandler,this);
}


Konami.prototype.setUpIE = function(){
    this.happn.addEventListener(this.targetIE,'keydown',this.keyHandler,this);
}

Konami.prototype.showKonami = function(){

    if(this.callback!==null)
        this.callback.call();
    else
        alert('konamiiii');

    this.restartKonami()
}
