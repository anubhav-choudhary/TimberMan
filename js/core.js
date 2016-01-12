//Game Object + precatch resources
function HTMLGame(){
    //Attributes
    this.state=null;
    this.resource_list=[];
    this.canvas=null;
    this.context=null;
    this.map=null;
    this.keydown_map={};
    this.keyup_map={};
    this.image_res=[];
    this.audio_res=[];
    this.prop={};
    this.load_page=new loadPage(this);
    this.clickarea=[];
    this.clickevent=[];
    this.rAF;
    this.last_draw=Date.now();
    this.max_fps;
    this.x_scale=1;
    this.y_scale=1;
    this.curr_fps;
    
    this.isMobile=function() {
    if (navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)
            || navigator.userAgent.match(/Opera Mini/i)
            || navigator.userAgent.match(/IEMobile/i)
            ) {
        return true;
    }
    else return false;
};
    //Functions 1 - Init a game
    this.init=function(canvas,width,height,fps,resource_array){
        this.canvas=canvas;
        this.canvas.height=height;
        this.canvas.width=width;
        this.context=canvas.getContext("2d");
        this.max_fps=fps;
        this.resource_list=resource_array;
        window.addEventListener( "keydown", (this.keydown_event).bind(this), true );
        window.addEventListener( "keyup", (this.keyup_event).bind(this), true );
        this.load_page.init();
        if(this.isMobile())
        {
            this.canvas.addEventListener('touchstart', (this.touch_event).bind(this));
        } 
        else{
            this.canvas.onclick=(this.click_event).bind(this);
        };
        this.rAF=this.getAnimationFrame();
        window.onload=(this.autoScale).bind(this);
		};       
        
    
    //Functions 2 - Resource Loader
    this.load=function(){
        //Show Loading Page. page.
        this.addState("load",this.load_page);
        this.setCurrentState("load");
        this.rAF.call(window,(this.gameloop).bind(this));
        //setInterval(function(){this.gameloop();}.bind(this),10);
        for(var i=0;i<this.resource_list.length;i++)
        {
            if(this.resource_list[i].match(/\.(jpeg|jpg|gif|png)$/)!=null)
            {
                var img=new Image();
                img.src=this.resource_list[i];
                this.image_res.push(img);
            }
            else if(this.resource_list[i].match(/\.(mp3|wav|ogg)$/))
            {
                var aud = new Audio(this.resource_list[i]);
                this.audio_res.push(aud);
            }
        }

    };
    
    //Functions to handle cookies
    this.getData=function(key) {
    var value = localStorage.getItem(key);
    return (value==null)?"":value;
    }
    
    this.setData=function(key,value)
    {
        localStorage.setItem(key,value);
    }
    
    
    //Functions Set for State Management  
    this.addState=function(stateName,stateReference){
        if(this.map==null) {this.state=stateName;this.map={};}
      this.map[stateName]=stateReference ; 
      
    };
    
    this.removeState=function(stateName){
      if(this.map[stateName]===undefined || this.state==stateName) return;
      delete this.map[stateName];  
      
    };
    
    this.setCurrentState=function(stateName)
    {
        if(this.map[stateName]===undefined) return;
        this.state=stateName;
    }
    
    //Function Set for Key Event Management
    this.addKeyUp=function(key,keyhandler){
        this.keyup_map[key]=keyhandler;
    };
    this.addKeyDown=function(key,keyhandler){
        this.keydown_map[key]=keyhandler;
    };
    this.removeKeyUp=function(key){
        if(this.keyup_map[key]===undefiend) return;
        delete this.keyup_map[key];
    };
    this.removeKeyDown=function(key){
        if(this.keydown_map[key]===undefiend) return;
        delete this.keydown_map[key];
    };
    
    //Function set for Click Event management
    this.addClickEvent=function(area,clickhandler)
    {
        this.clickarea.push(area);
        this.clickevent.push(clickhandler);
        return (this.clickarea.length-1);
    }
    this.removeClickArea=function(id)
    {
        this.clickarea.splice(id,1);
        this.clickevent.splice(id,1);
    }
    
    this.isObjectVisible=function(obj)
    {
        if(obj.visible==false) return false;
        var ptr=obj.container;
        while(ptr!=null)
        {
          if(ptr.visible==false)  return false;
          ptr=ptr.container;
        }
        return true;
    }
    
    //function set for property management
    this.setProp=function(name,value){
        this.prop[name]=value;
    };
    
    this.getProp=function(name){
        return this.prop[name];        
    };
    this.removeProp=function(name){
        if(this.prop[name]===undefined) return;
        delete this.prop[name]; 
    };
    
    //Functions 4 - Game loop
    this.gameloop=function()
    {
        var elapsed=Date.now()-this.last_draw;
        //if(elapsed>1000/this.max_fps)
        //{    
        this.curr_fps=(1000/elapsed);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        var time1 = Date.now();
        this.map[this.state].update();
        var time2 = Date.now();
        this.map[this.state].draw();
        var time3 = Date.now();
        console.log(time1-this.last_draw + " " + (time2-time1) + " " + (time3-time2));
        this.last_draw=Date.now();
        
        //}
        this.rAF.call(window,(this.gameloop).bind(this));
    };
    
    //Functions 5 - Game Starter : will only start if resources is fully loaded
    this.start=function(homestate){
        var flag=true;
        for(var i=0;i<this.image_res.length;i++)
        {
            if(this.image_res[i].complete==false) 
            {
                setTimeout(function(){this.start(homestate);}.bind(this),100);
                flag=false;
                break;
            }
        }
        
        if(flag)
        for(var i=0;i<this.audio_res.length;i++)
        {
            if(this.audio_res[i].readyState!=4) 
            {
                setTimeout(function(){this.start(homestate);}.bind(this),100);
                flag=false;
                break;
            }
        }
        if(flag) {this.map.load.child_list[0].visible=false;this.setCurrentState(homestate);}
    };
    
    //Function 6 - Event Handler
    this.keyup_event=function(e)
    {
        if(this.keyup_map[e.keyCode]===undefined) {return;}
        (this.keyup_map[e.keyCode])();
    };
    
    //Functions 7 -Event Handler
    this.keydown_event=function(e)
    {
        if(this.keydown_map[e.keyCode]===undefined) {return;}
        (this.keydown_map[e.keyCode])();
    };
    
    //Click Event Handler
      this.click_event=function(e){
        var rect=this.canvas.getBoundingClientRect();
        var x=(e.clientX-rect.left)/this.x_scale;
        var y=(e.clientY-rect.top)/this.y_scale;
        for(var i=0;i<this.clickarea.length;i++)
        {
      
            if(x>=this.clickarea[i].left && x<=(this.clickarea[i].left+this.clickarea[i].width) && y>=this.clickarea[i].top && y<=(this.clickarea[i].top+this.clickarea[i].height) && this.isObjectVisible(this.clickarea[i]))
            {
      
                this.clickevent[i]();
            }
        }
    }
    
    //Touch Event Handle
    this.touch_event=function(e)
    {
        var rect=this.canvas.getBoundingClientRect();
        //alert(e.touches[0].screenX);
        var x=(e.touches[0].clientX-rect.left)/this.x_scale;
        var y=(e.touches[0].clientY-rect.top)/this.y_scale;
        for(var i=0;i<this.clickarea.length;i++)
        {
      
            if(x>=this.clickarea[i].left && x<=(this.clickarea[i].left+this.clickarea[i].width) && y>=this.clickarea[i].top && y<=(this.clickarea[i].top+this.clickarea[i].height) && this.isObjectVisible(this.clickarea[i]))
            {
      
                this.clickevent[i]();
            }
        }
    }
    
    this.getAnimationFrame=function(callback)
    {
        return window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(callback) {
			window.setTimeout( callback, 17 );
		
        };
    
    }
    
    //Canvas Scale Functions
    this.setScale=function(x,y)
    {
        this.resetScale();
        this.x_scale=x;
        this.y_scale=y;
        this.canvas.height*=y;
        this.canvas.width*=x;
        this.context.scale(x,y);
    }
    
    this.resetScale=function()
    {
        this.canvas.height/=this.y_scale;
        this.canvas.width/=this.x_scale;
        this.context.scale(1/this.x_scale,1/this.y_scale);
        this.x_scale=1;
        this.y_scale=1;
    }
    
    this.autoScale=function()
    {
        var x_ratio=window.innerWidth/this.canvas.width;
        var y_ratio=window.innerHeight/this.canvas.height;
        if(x_ratio<y_ratio) this.setScale(x_ratio,x_ratio);
        else this.setScale(y_ratio,y_ratio);
    }
}


//ANIMATION MODULES
function Animation(that) {
    //Attributes
    this.animation_list=[];
    //Animation Class Function
    var move_aniamtion=function(dx,dy,duration,offset)
    {
        this.start_time=Date.now()+offset;
        this.end_time=Date.now()+offset+duration;
        this.active=true;
        this.ddx=0;
        this.ddy=0;
        this.action=function()
        {
                   var percent=(Date.now()-this.start_time)/(this.end_time-this.start_time);
                   if(percent>=1) {percent=1;this.active=false;}
                   that.left=that.left+percent*dx-this.ddx;
                   that.top=that.top+percent*dy-this.ddy;
                   this.ddx=percent*dx;
                   this.ddy=percent*dy;
        }
    }
    
    var rotate_aniamtion=function(degree,duration,offset)
    {
        this.start_time=Date.now()+offset;
        this.end_time=Date.now()+offset+duration;
        this.active=true;
        this.dd_degree=0;
        this.action=function()
        {
                   var percent=(Date.now()-this.start_time)/(this.end_time-this.start_time);
                   if(percent>=1) {percent=1;this.active=false;}
                   that.angle=that.angle+percent*degree-this.dd_degree;
                   this.dd_degree=percent*degree;
        }
    }
    
    //Function to maintain and control Animation.
    this.move=function(x,y,duration,offset)
    {
        this.animation_list[this.animation_list.length]=new move_aniamtion(x,y,duration,offset);
    }
    
    this.rotate=function(degree,duration,offset_time)
    {
        this.animation_list[this.animation_list.length]=new rotate_aniamtion(degree,duration,offset_time);
    }
    
    this.isAnimating=function()
    {
        return (this.animation_list.length>0)?true:false;
    }    
}

//Master
function MasterOBJ(game,masterobj)
{
    this.game=game;
    this.visible=true;
    this.container=masterobj;
    //Clild List
    this.child_list=[]
    
    //Functions
    this.pushChild=function(child)
    {
      this.child_list.push(child);  
    };
    
    this.init=function()
    {
        ; //to be defined later
    };
    
    this.priorityDraw=function()
    {
        return;//to be defined later
    };
    this.draw=function()
    {
        if(this.visible)
        for(var i=0;i<this.child_list.length;i++)
        {
            this.child_list[i].draw()
        }
        this.priorityDraw();
    };
    
    this.removeChild=function(child,afterRemove)
    {
        for(var i=0;i<this.child_list.length;i++)
        {
            if(this.child_list[i]==child)
            {
                this.child_list.splice(i,1);
            }
        }
        afterRemove();
    }
    
    this.removeChild_AA=function(child,afterRemove)
    {
        if(child.isAnimating()) 
        {
            setTimeout(function(){this.removeChild_AA(child,afterRemove);}.bind(this),17);
            return;    
        }
        for(var i=0;i<this.child_list.length;i++)
        {
            if(this.child_list[i]==child)
            {
                this.child_list.splice(i,1);
            }
        }
        afterRemove();
    }
    
    this.update=function()
    {
        for(var i=0;i<this.child_list.length;i++)
        {
            this.child_list[i].update();
        }
    }
}

//Child 
function childOBJ(game,masterobj)
{    
    //Parent
    Animation.apply(this,[this]);
    this.game=game;
    this.container=masterobj;
    //Attributes
    this.left=0;
    this.top=0;
    this.height=0;
    this.width=0;
    this.angle=0;
    this.visible=false;
    this.imgsrc=null;
    
    //functions
    this.init=function(left,top,height,width,visible)
    {
        this.left=left;
        this.top=top;
        this.height=height;
        this.width=width;
        this.visible=visible;
    };
    
    this.render=function()
    {
        //To be defined
    };
    
    this.draw=function()
    {
        if(this.visible)
        {
            if(this.angle!=0)
            {
            var x=this.left+this.width/2;
            var y=this.top+this.height/2;
            this.game.context.save();
            this.game.context.translate(x,y);
            this.game.context.rotate(this.angle*Math.PI/180);
            this.game.context.translate(-x,-y);
            }
            if(this.imgsrc==null) {this.render();}
            else
            {
                this.game.context.drawImage(this.imgsrc,this.left,this.top,this.width,this.height);
            }
            if(this.angle!=0)
            {
            this.game.context.rotate(-1*this.angle*Math.PI/180);
            this.game.context.restore();
            }
        }
        return;
    };
    
    this.update=function()
    {
        if(this.animation_list.length==0) return;
        var curr_time=Date.now();
        var length=this.animation_list.length;
        for(var i=0;i<length;i++)
        {
            if(this.animation_list[i].active==false)
            {
                this.animation_list.splice(i,1);
                i--;
                length--;
            }
            else if(this.animation_list[i].start_time<curr_time)
            {
                this.animation_list[i].action();
            }
        }
    }
}

//Default Laod Page Module
function loading_text(game,masterobj)
{
    childOBJ.apply(this,[game,masterobj]);
    this.text="Loading";
    this.visible=false;
    this.render=function(){
        game.context.fillStyle="#000000";
        game.context.fillRect(this.left,this.top,this.width,this.height);
        game.context.fillStyle="#FFFFFF";
        game.context.font="20px Georgia";
        game.context.fillText(this.text,this.width/2-40,this.height/2);
    }
    //Extra function
    this.animate=function()
    {
        if(this.visible==false) return;
        //consoleg.log(this.visible);
        if(this.text=="Loading") this.text="Loading.";
        else if(this.text=="Loading.") this.text="Loading..";
        else if(this.text=="Loading..") this.text="Loading...";
        else if(this.text=="Loading...") this.text="Loading";
        setTimeout(function(){this.animate();}.bind(this),500);
    }
    
}

function loadPage(game)
{
    MasterOBJ.apply(this,[game]);
    this.pushChild(new loading_text(game,this))
    
    this.init=function(){
        this.child_list[0].init(0,0,game.canvas.height,game.canvas.width,true);
        this.child_list[0].visible=true;
        this.child_list[0].animate();
    }
}