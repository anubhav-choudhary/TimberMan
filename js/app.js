//Step 1: Create Game Object
var timberman = new HTMLGame();

//Step 2: call game init
timberman.init(document.getElementById("timberman"),400,600,30,["res/axe.wav","res/death.wav","res/background.mp3","res/trunk.png","res/trunk_left.png","res/trunk_right.png","res/root.png","res/man_r.png","res/man_action_r.png","res/man_l.png","res/man_action_l.png","res/bg.jpg","res/l_arrow.png","res/r_arrow.png","res/rip.png","res/board.png"]);

//Step 3: Load Resources.
timberman.load();

//Step 4: Define MasterOBJ and Child OBJ
//ChildOBJ

function Root(game,masterobj)
{
    childOBJ.apply(this,[game,masterobj]);
}

function Trunk(game,masterobj)
{
    childOBJ.apply(this,[game,masterobj]);
}

function ManBody(game,masterobj)
{
    childOBJ.apply(this,[game,masterobj]);
}

function BackImage(game,masterobj)
{
    childOBJ.apply(this,[game,masterobj]);
    this.musicOn=true;
    this.startBackroundMusic=function(){
        if(this.musicOn==false) return;
        game.audio_res[2].play();
        setTimeout(function(){this.startBackroundMusic();}.bind(this),1000);
    };
    
    this.stopBackroundMusic=function(){
        this.musicOn=false;
        game.audio_res[2].pause();
        game.audio_res[2].currentTime = 0;
    };
}

function Arrow(game,masterobj)
{
    childOBJ.apply(this,[game,masterobj]);
}

function ScoreBox(game,masterobj)
{
   childOBJ.apply(this,[game,masterobj]); 
   this.render=function(){
        game.context.fillStyle="#FFFFFF";
        game.context.font="40px Georgia";
        var neg_offset=-2;
        var score=game.getProp("score");
        if(score!=0)
        {neg_offset=-Math.floor(Math.log(score)/Math.log(10))*10-2;}
        game.context.fillText(score,this.left+neg_offset,this.top);
   };
}

function TimeBox(game,masterobj)
{
    childOBJ.apply(this,[game,masterobj]);
    this.bar_width=100;
    this.render=function()
    {
        
        game.context.strokeStyle="white";
        game.context.rect(this.left,this.top,this.width,this.height);
        game.context.stroke();
        game.context.fillStyle="#FF0000";
        var width=(this.bar_width<0)?0:this.bar_width;
        game.context.fillRect(this.left,this.top,width,this.height);
    }
    
    this.decrementBar=function(){
        if(game.getProp("mode")=="dead") return;
        
        if(this.bar_width<=0) {
            var dir=(game.map.home.foreground.man.body.left<200)?"left":"right";
            game.map.home.foreground.man.setDead(dir);return;
            }
        if(game.getProp("mode")!="started")
        {
            setTimeout(function(){this.decrementBar();}.bind(this),500);
            return;
        }
        else
        {
            if(game.getProp("level")<5)  
                {
                    this.bar_width-=(game.getProp("level")+1);
                }
                else{
                    this.bar_width-=5;
                }
                setTimeout(function(){this.decrementBar();}.bind(this),500);
            return;
        }
        
    };
}

function LevelBox(game,masterobj)
{
    childOBJ.apply(this,[game,masterobj]);
       this.render=function()
    {
        game.context.fillStyle="#FFFFFF";
        game.context.font="20px Georgia";
        //var neg_offset=-2;
        var level=game.getProp("level");
        //if(score!=0){neg_offset=-Math.floor(Math.log(score)/Math.log(10))*10-2;}
        game.context.fillText("Level : "+ level,this.left,this.top);
    }
    
}

function StartBoard(game,masterobj)
{
    childOBJ.apply(this,[game,masterobj]);
    this.render=function(){
        this.game.context.drawImage(this.game.image_res[12],this.left,this.top,this.width,this.height);
        game.context.fillStyle="#FFFFFF";
        game.context.font="40px Georgia";
        game.context.fillText("TimberMan",this.left+50,this.top+50);
        game.context.font="20px Arial";
        game.context.fillText("Highscore : "+game.getProp("hs"),this.left+80,this.top+170);
    } 
}

function OverBoard(game,masterobj)
{
    childOBJ.apply(this,[game,masterobj]);
    this.render=function(){
        this.game.context.drawImage(this.game.image_res[12],this.left,this.top,this.width,this.height);
        game.context.fillStyle="#FFFFFF";
        game.context.font="40px Georgia";
        game.context.fillText("You Died",this.left+70,this.top+50);
        game.context.font="20px Arial";
        game.context.fillText("Your Score : "+this.game.getProp("score"),this.left+80,this.top+100);
    } 
}

 function StartButton(game,masterobj)
 {
    childOBJ.apply(this,[game,masterobj]);
    this.render=function(){
        game.context.fillStyle="#FFFFFF";
        game.context.fillRect(this.left-2,this.top-2,80+4,40+4);
        game.context.fillStyle="#0000FF";
        game.context.fillRect(this.left,this.top,80,40);
        game.context.font="20px Arial";
        game.context.fillStyle="#FFFFFF";
        game.context.fillText("Start",this.left+18,this.top+27);        
    }
 }
 
 function RetryButton(game,masterobj)
 {
    childOBJ.apply(this,[game,masterobj]);
    this.render=function(){
        game.context.fillStyle="#FFFFFF";
        game.context.fillRect(this.left-2,this.top-2,80+4,40+4);
        game.context.fillStyle="#0000FF";
        game.context.fillRect(this.left,this.top,80,40);
        game.context.font="20px Arial";
        game.context.fillStyle="#FFFFFF";
        game.context.fillText("Retry",this.left+18,this.top+27);        
    }
 }
//MasterOBJ

//GameOver Menu
function GameoverMenu(game,masterobj)
{
    MasterOBJ.apply(this,[game,masterobj]);
    this.pushChild(new OverBoard(game,this));
    this.pushChild(new RetryButton(game,this));
    this.board=this.child_list[0];
    this.button=this.child_list[1];
    this.visible=false;
    this.init=function(){
        this.board.init(50,-200,200,300,true);
        this.button.init(160,-70,44,84,true);
    }
    
    this.show=function()
    {
        this.visible=true;
        this.board.top=-200;
        this.board.move(0,500,200,0);
        this.board.move(0,-100,100,200);
        this.button.top=-70;
        this.button.move(0,500,200,0);
        this.button.move(0,-100,100,200);
    }
    
    this.hide=function()
    {
        this.board.top=200;
        this.board.move(0,100,100,0);
        this.board.move(0,-500,200,100);
        this.button.top=330;
        this.button.move(0,100,100,0);
        this.button.move(0,-500,200,100);
        setTimeout(function(){this.visible=false;}.bind(this),400);
    }
}

//Start Menu
function StartMenu(game,masterobj)
{
    MasterOBJ.apply(this,[game,masterobj]);
    
    this.pushChild(new StartBoard(game,this));
    this.pushChild(new StartButton(game,this));
    
    this.board=this.child_list[0];
    this.button=this.child_list[1];
    
    this.init=function(){
        this.board.init(50,200,200,300,true);
        this.button.init(160,280,44,84,true);
        this.visible=true;
    }
    
    this.show=function()
    {
        this.visible=true;
        this.board.top=-200;
        this.board.move(0,500,200,0);
        this.board.move(0,-100,100,200);
        this.button.top=-120;
        this.button.move(0,500,200,0);
        this.button.move(0,-100,100,200);
    }
    
    this.hide=function()
    {
        this.board.top=200;
        this.board.move(0,100,100,0);
        this.board.move(0,-500,200,100);
        
        this.button.top=280;
        this.button.move(0,100,100,0);
        this.button.move(0,-500,200,100);
        setTimeout(function(){this.visible=false;}.bind(this),400);
    }
}

//ScoreTime------------------------------------------------------------------------------------------

function ScoreTime(game,masterobj)
{
    MasterOBJ.apply(this,[game,masterobj]);
    
    this.pushChild(new ScoreBox(game,this));
    this.pushChild(new TimeBox(game,this));
    this.pushChild(new LevelBox(game,this));
    
    this.score=this.child_list[0];
    this.time=this.child_list[1];
    this.level=this.child_list[2];
    
    this.init=function(){
      this.score.init(190,75,30,50,true);
      this.time.init(100,10,30,200,true);
      this.time.bar_width=100;
      //this.time.decrementBar();
      this.level.init(165,110,20,30,true);
    };
}

//ScoreTime END------------------------------------------------------------------------------------

//TREE------------------------------------------------------------------------------------------
function Tree(game,masterobj)
{
    MasterOBJ.apply(this,[game,masterobj]);
    //Push Childs in order (first will be rendered first)
    this.pushChild(new Root(game,this));
    this.pushChild(new Trunk(game,this));
    this.pushChild(new Trunk(game,this));
    this.pushChild(new Trunk(game,this));
    this.pushChild(new Trunk(game,this));
    this.pushChild(new Trunk(game,this));
    
    this.root=this.child_list[0];
    
    this.init=function(){
        this.root.init(131,500,100,140,true);
        this.root.imgsrc=game.image_res[3];
        for(var i=1;i<this.child_list.length;i++)
        {
            var type=(i<=2)?"O":this.getNextType();
            if(type=="O") 
            {
             this.child_list[i].init(150,100*(this.child_list.length-1-i),100,100,true);
             this.child_list[i].imgsrc=game.image_res[0];   
            }
            else if(type=="L")
            {
             this.child_list[i].init(24,100*(this.child_list.length-1-i),100,225,true);
             this.child_list[i].imgsrc=game.image_res[1];   
            }
            else if(type=="R")
            {
             this.child_list[i].init(152,100*(this.child_list.length-1-i),100,225,true);
             this.child_list[i].imgsrc=game.image_res[2];   
            }
        }
    };
    this.priorityDraw=function()
    {
        this.child_list[4].draw();
        this.child_list[3].draw();
        this.child_list[2].draw();
        this.child_list[1].draw();
    }
    
    //Extra Attributes;
    this.next_trunk=1;
    this.top_trunk_type="O";
    this.S0="O";
    this.S1="O";
    
    //Extra Functions
    this.cut=function(direction)
    {
        this.addNewTrunk();
        this.shift();
        this.throw_trunk(direction);
      
    };
    this.addNewTrunk=function()
    {
        var new_trunk=new Trunk(game,this);
        this.pushChild(new_trunk);
        var type=this.getNextType();
        
        if(type=="O") 
            {
             new_trunk.init(150,-100,100,100,true); 
             new_trunk.imgsrc=game.image_res[0];  
            }
            else if(type=="L")
            {
             new_trunk.init(24,-100,100,225,true);
             new_trunk.imgsrc=game.image_res[1];   
            }
            else if(type=="R")
            {
             new_trunk.init(152,-100,100,225,true);
             new_trunk.imgsrc=game.image_res[2];   
            }
        
    };
    this.getNextType=function()
    {
        if(this.top_trunk_type=="O")
        {
            var val = Math.floor((Math.random() * 3) + 1);
            if(val==1) {this.top_trunk_type="O" ;return "O";}
            else if(val==2) {this.top_trunk_type="L" ;return "L";}
            else {this.top_trunk_type="R" ;return "R";}
        }
        else if(this.top_trunk_type=="L")
        {
            var val = Math.floor((Math.random() * 2) + 1);
            if(val==1) {this.top_trunk_type="O" ;return "O";}
            else {this.top_trunk_type="L" ;return "L";}
        }
        else if(this.top_trunk_type=="R")
        {
            var val = Math.floor((Math.random() * 2) + 1);
            if(val==1) {this.top_trunk_type="O" ;return "O";}
            else {this.top_trunk_type="R" ;return "R";}
        }
    }
    
    
    this.shift=function(){
      for(var i=this.next_trunk+1;i<this.child_list.length;i++)
      {
        this.child_list[i].move(0,100,150,0);
      }  
    };
    
    this.throw_trunk=function(direction){
        if(this.child_list.length==0) return;
      if(direction=="right")
      {
        this.child_list[this.next_trunk].rotate(90,400,0);
        this.child_list[this.next_trunk].move(250,-50,400,0);
      }
      else if(direction=="left")
      {
        this.child_list[this.next_trunk].rotate(-90,400,0);
        this.child_list[this.next_trunk].move(-250,-50,400,0);
      }
      this.removeChild_AA(this.child_list[this.next_trunk],function(){this.next_trunk--;}.bind(this));
      this.next_trunk++;  
    };
    
    this.setStates=function(){
      this.S0=this.fetchState(this.child_list[this.next_trunk]);
      this.S1=this.fetchState(this.child_list[this.next_trunk+1]);  
    };
    
    this.fetchState=function(trunk)
    {
        if(trunk.imgsrc==game.image_res[0]) return "O";
        else if(trunk.imgsrc==game.image_res[1]) return "L";
        else if(trunk.imgsrc==game.image_res[2]) return "R";
    }
    
    this.isDead=function(direction)
    {
        if(direction=="right" && this.S0=="L") return 0;
        else if(direction=="right" && this.S1=="L") return 1;
        else if(direction=="left" && this.S0=="R") return 0;
        else if(direction=="left" && this.S1=="R") return 1;
        else return 2;
    }
}
//TREE END-----------------------------------------------------------------------------------------------------

//MAN----------------------------------------------------------------------------------------------------------
function Man(game,masterobj)
{
    MasterOBJ.apply(this,[game,masterobj]);
    
    this.pushChild(new ManBody(game,this));
    
    this.body=this.child_list[0];
    
    this.init=function(){
        this.body.init(60,400,150,120,true); 
        this.body.imgsrc=game.image_res[6];   
        this.isdead=false;
    };
    
    
    //Extra function
    this.move_man=function(direction)
    {
        if(direction=="right")
        {
            this.body.left=220;//270
            this.body.imgsrc=game.image_res[4];
            this.swap_img();
            
        }
        else
        {
            this.body.left=60;//270
            this.body.imgsrc=game.image_res[6];
            this.swap_img();
        }
    }
    
    this.swap_img=function()
    {
        if(this.body.imgsrc==game.image_res[4])
        {
            this.body.imgsrc=game.image_res[5];
            setTimeout(function(){if(!this.isdead)this.body.imgsrc=game.image_res[4];}.bind(this),50);
        }
        else
        {
            this.body.imgsrc=game.image_res[7];
            setTimeout(function(){if(!this.isdead)this.body.imgsrc=game.image_res[6];}.bind(this),50);
        }
    }
    
    this.setDead=function(direction)
    {
        game.audio_res[1].play()
        this.isdead=true;
        this.body.top=470;
        this.body.height=60;
        this.body.width=50;
        this.body.imgsrc=game.image_res[11];
        
        if(direction=="left")
        {
            this.body.left=60;
        }
        else
        {
            this.body.left=280;
        }
        game.setProp("mode","dead");
        game.map.home.background.backimg.stopBackroundMusic();
        game.map.home.foreground.overmenu.show(); 
        game.removeClickArea(2);
        game.removeClickArea(2);
        var highscore=game.getData("hs");
        if(highscore<game.getProp("score"))
        {
            game.setData("hs",game.getProp("score"));
        }
    }
    
}
//MAN END----------------------------------------------------------------------------------------------------------


//ARROWS----------------------------------------------------------------\
function Arrows(game,masterobj)
{
    MasterOBJ.apply(this,[game,masterobj]);
    //Push Childs in order (first will be rendered first)
    this.pushChild(new Arrow(game,this));
    this.pushChild(new Arrow(game,this));
    
    //child Alising
    this.leftarrow=this.child_list[0];
    this.rightarrow=this.child_list[1];
    
    this.init=function(){
        this.leftarrow.init(30,350,36,104,true);
        this.rightarrow.init(270,350,36,104,true);
        this.leftarrow.imgsrc=game.image_res[9];
        this.rightarrow.imgsrc=game.image_res[10];
        this.visible=false;
    };
    
    this.move_arrow=function(){
        if(this.visible==false) return;
        this.leftarrow.move(-10,0,500,0);
        this.rightarrow.move(10,0,500,0);
        this.leftarrow.move(10,0,10,500);
        this.rightarrow.move(-10,0,10,500);
        setTimeout(function(){this.move_arrow();}.bind(this),600);
    };
}
//Arrowa END--------------------------------------------------------------
function Foreground(game,masterobj)
{
    MasterOBJ.apply(this,[game,masterobj]);
    //Push Childs in order (first will be rendered first)
    this.pushChild(new Tree(game,this));
    this.pushChild(new Man(game,this));
    this.pushChild(new Arrows(game,this));
    this.pushChild(new ScoreTime(game,this));
    this.pushChild(new StartMenu(game,this));   
    this.pushChild(new GameoverMenu(game,this));    
    
    //Child Alising
    this.tree=this.child_list[0];
    this.man=this.child_list[1];
    this.arrows=this.child_list[2];
    this.scoretime=this.child_list[3];
    this.startmenu=this.child_list[4];
    this.overmenu=this.child_list[5];
    
    this.init=function(){
      for(var i=0;i<this.child_list.length;i++)
      {
        this.child_list[i].init();
      }
      //this.arrows.move_arrow(); 
    };
    
    //extra function
    this.cut=function(direction){
        //console.log("Start : "+Date.now());
        this.tree.setStates();
        var opp_dir=((direction=="left")?"right":"left");
        var dead=this.tree.isDead(opp_dir);
        if(dead==0){
            this.man.setDead(direction);     
        }
        else if(dead==1)
        {
            //var aud = game.audio_res[0].cloneNode();
            //aud.play();
            this.tree.cut(opp_dir);
            this.man.setDead(direction); 
        }
        else
        {
            //var aud = game.audio_res[0].cloneNode();
            //aud.play();
      this.tree.cut(opp_dir);
      this.man.move_man(direction);
      game.setProp("score",game.getProp("score")+1);
      if(game.getProp("score")%50==0) game.setProp("level",game.getProp("level")+1);
      this.scoretime.time.bar_width+=1;
      }
      //console.log("End : "+Date.now());
    };
}

function Background(game,masterobj)
{
    MasterOBJ.apply(this,[game,masterobj]);
    //Push Childs in order (first will be rendered first)
    this.pushChild(new BackImage(game,this));
    //Child Aliasing
    this.backimg=this.child_list[0];
    this.init=function(){
      
        this.backimg.init(0,0,600,400,true);
        this.backimg.imgsrc=game.image_res[8];
        this.backimg.musicOn=true;
        this.backimg.startBackroundMusic();
    };
}

function Home(game,masterobj)
{
    MasterOBJ.apply(this,[game,masterobj]);
    //Push Childs in order (first will be rendered first)
    this.pushChild(new Background(game,this));
    this.pushChild(new Foreground(game,this));
    
    //Child Aliasing
    this.background=this.child_list[0];
    this.foreground=this.child_list[1];
    
    this.init=function(){
        game.setProp("mode","startmenu"); 
      for(var i=0;i<this.child_list.length;i++)
      {
        this.child_list[i].init();
      }
      
      //initial config
      game.setProp("score",0);
      game.setProp("level",1);   
      var hs=game.getData("hs");
      if(hs=="") game.setData("hs","0"); 
      game.setProp("hs",game.getData("hs"));  
    };
    
    this.init();
}

var left_key=function(){
    if(timberman.getProp("mode")=="start") {
        timberman.map["home"].foreground.arrows.visible=false;
        timberman.setProp("mode","started");
        }
    if(timberman.getProp("mode")=="started") timberman.map["home"].foreground.cut("left");
    };
var right_key=function(){
    if(timberman.getProp("mode")=="start") {
        timberman.map["home"].foreground.arrows.visible=false;
        timberman.setProp("mode","started");
        }
    if(timberman.getProp("mode")=="started") timberman.map["home"].foreground.cut("right");
    };

timberman.addState("home",new Home(timberman,null));
timberman.addKeyDown(37,left_key);
timberman.addKeyDown(39,right_key);

//Click Event

var leftarea = {
    left:0,
    top:0,
    height:600,
    width:200,
    visible:true,
    container:null
}

var rightarea = {
    left:200,
    top:0,
    height:600,
    width:200,
    visible:true,
    container:null
}

timberman.addClickEvent(timberman.map.home.foreground.startmenu.button,function(){
    if(timberman.getProp("mode")=="startmenu")
    {
    timberman.setProp("mode","start"); 
    timberman.map.home.foreground.startmenu.hide();
    timberman.map.home.foreground.arrows.visible=true;
    timberman.map.home.foreground.arrows.move_arrow();
    timberman.map.home.foreground.scoretime.time.decrementBar();
    setTimeout(function(){
    timberman.addClickEvent(leftarea,left_key);
    timberman.addClickEvent(rightarea,right_key);},1);
    }
});

timberman.addClickEvent(timberman.map.home.foreground.overmenu.button,function(){
    if(timberman.getProp("mode")=="dead"){
        timberman.map["home"].foreground.overmenu.hide();
        setTimeout(function(){timberman.map["home"].foreground.startmenu.show();},400)
        setTimeout(function(){timberman.map["home"].init();},800);
    }
});



timberman.start("home");
