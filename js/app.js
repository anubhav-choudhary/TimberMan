//Variables declaration

var score;
var state;//State=(HOME,PAUSED,PLAY,END,GAMEOVER)
var count;

//End of declaration

//Function Def
//-----------------------------------------------------------------------------------------------------------
//Helper Functions
function getRandClass() // Function to generate random class for a tile
{
    var val = Math.floor((Math.random() * 3) + 1);
    if(val==1) 
        return "no_branch";
    else if(val==2) 
        return "left_branch";
    else 
        return "right_branch";
}
//-----------------------------------------------------------------------------------------------------------
function setTile(no,state) //Function to set a state to a given tile
{
    $("#l"+no).removeClass();
    $("#l"+no).addClass('tile');
    $("#l"+no).addClass(state);
}
//-----------------------------------------------------------------------------------------------------------
function getTile(no) //Function to get state of given tile
{
    var attrb= $("#l"+no).attr('class');
    if(attrb.search("no_branch_lm")!=-1) return "no_branch_lm";
    else if(attrb.search("no_branch_rm")!=-1) return "no_branch_rm";
    else if(attrb.search("no_branch")!=-1) return "no_branch";
    else if(attrb.search("left_branch_rm")!=-1) return "left_branch_rm";
    else if(attrb.search("right_branch_lm")!=-1) return "right_branch_lm";
    else if(attrb.search("left_branch")!=-1) return "left_branch";
    else if(attrb.search("right_branch")!=-1) return "right_branch";
}
//-----------------------------------------------------------------------------------------------------------

function play_cut_sound() // Async function to play sound.
{
    var cut_sound = new Audio('sound/axe.wav');
    cut_sound.play();
}

//-----------------------------------------------------------------------------------------------------------
function start_game() //Function to start a new game 
{
    score=0;
    count=1;
    $('#score').html(0);
    for(i=2;i<=6;i=i+1)
    {
        if(i%2==0) setTile(i,getRandClass());
        else setTile(i,'no_branch');
    }
    setTile(1,'no_branch_lm');
    $('#gameover').hide();
    $('#tab').show();
    state="PLAY";
    $('#time').html(30);
    $('#level').html(1);
}
//-----------------------------------------------------------------------------------------------------------
    
function end_game() //Function that is called when user is killed.
{
    $('#tab').hide();
    $('#gameover').show();
    $('#finalscore').html(score);
    setHighscore(score);
    state="GAMEOVER";
}
//-----------------------------------------------------------------------------------------------------------
    
    
function gen_top_tile(flag) //Function to generate random tile for topmost layer
{
    if(flag==true) 
        setTile(6,getRandClass());
    else 
        setTile(6,'no_branch');
}
//-----------------------------------------------------------------------------------------------------------    
    
function shift(flag)// Function to shift tile after every key press it also detects death of player
{
    var tile_state;
    for(i=2;i<=5;i++)
    {
        tile_state=getTile(i+1);
        setTile(i,tile_state);
    }
    gen_top_tile(flag);
}

//-----------------------------------------------------------------------------------------------------------
function gen_next_state(key,state)
{
    if(state=="no_branch" && key=="left") return "no_branch_lm";
    else if(state=="no_branch" && key=="right") return "no_branch_rm";
    else if(state=="left_branch" && key=="left") return "left_branch_dead";
    else if(state=="left_branch" && key=="right")return "left_branch_rm";
    else if(state=="right_branch" && key=="left")return "right_branch_lm";
    else if(state=="right_branch" && key=="right") return "right_branch_dead";
    
}

//-----------------------------------------------------------------------------------------------------------
function cut_tree(curr_tile)
{
    if(curr_tile.indexOf("no_branch_lm")!=-1) setTile(1,'no_branch_left_cut');
    else if(curr_tile.indexOf("no_branch_rm")!=-1) setTile(1,'no_branch_right_cut');
    else if(curr_tile.indexOf("left_branch_rm")!=-1) setTile(1,'left_branch_cut');
    else if(curr_tile.indexOf("right_branch_lm")!=-1) setTile(1,'right_branch_cut');
}
//-----------------------------------------------------------------------------------------------------------
function show_result(key)
{
    var tile_state=getTile(2);
    var curr_tile=getTile(1);
    var next_state=gen_next_state(key,tile_state);
    if(next_state.indexOf("dead")!=-1)
    {
        setTile(1,next_state);
        count=(count+1)%2;
        shift((count==1)?true:false); 
        end_game();
    }
    else
    {
        cut_tree(curr_tile);
        
        setTimeout(function()
        {
        setTile(1,next_state);
        
        count=(count+1)%2;
        shift((count==1)?true:false); 
        var dscore=parseInt($('#score').html());
        $('#score').html(dscore+1);  
        score++;
        },100);      
    }
}
//-----------------------------------------------------------------------------------------------------------
//Clock Function
function update_clock(){
        if(state=="PLAY")
        {
        var dtime=parseInt($('#time').html());
        dtime--;
        $('#time').html(dtime);
        if(dtime==0) end_game();
        }   
};
setInterval(update_clock,1000);

//-----------------------------------------------------------------------------------------------------------
//Link Functions
function show_game()// Function invoked when Play Game link is clicked
{
    $('.frame').hide();
    $('.game').show();
    state="PLAY";
    count=0;
    start_game();    
}
//-----------------------------------------------------------------------------------------------------------
function quitgame() //Function invoked when end game is pressed
{
    $('.pause').hide();
    $('.home').show();
    state="HOME";
}
//-----------------------------------------------------------------------------------------------------------
function resume() //Function invoked when resume is pressed
{
    $('.game').show();
    $('.pause').hide();
    state="PLAY";
}
//-----------------------------------------------------------------------------------------------------------
function toggle_controls() //Function to switch beteen home screen to control screen and vice versa.
{
    $('.controls').toggle();
    $('.home').toggle();
}


//-----------------------------------------------------------------------------------------------------------
// Cookie Operation

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
    }
    return "";
}
//-----------------------------------------------------------------------------------------------------------
function getHighscore()
{
    var highscore=getCookie("highscore");
    if(highscore=="") {document.cookie="highscore=0; expires=Thu, 18 Dec 2020 12:00:00 GMT";return 0;}
    return highscore;
}
//-----------------------------------------------------------------------------------------------------------
function setHighscore(score)
{
    var highscore=getHighscore();
    if(highscore<score) {
        document.cookie="highscore="+score+"; expires=Thu, 18 Dec 2020 12:00:00 GMT";
        $('#highscore').html(score);
        }
}

//-----------------------------------------------------------------------------------------------------------    
//KEY PRESS and LOAD EVENT FUNCTIONS    
$(document).keydown(function(event)
{
    if(event.keyCode==37 && state=="PLAY")
    {
        show_result("left");
        if(score%100==0) 
        {
        var dlevel=parseInt($('#level').html());
        $('#level').html(dlevel+1);  
        var dtime=parseInt($('#time').html());
        if(dtime<20) $('#time').html(30);          
        }
        setTimeout(play_cut_sound(),0);
    }
    else if(event.keyCode==39 && state=="PLAY")
    {
        show_result("right");
        if(score%100==0 && score!=0) 
        {
        var dlevel=parseInt($('#level').html());
        $('#level').html(dlevel+1);  
        var dtime=parseInt($('#time').html());
        if(dtime<20) $('#time').html(30);          
        }
        setTimeout(play_cut_sound(),0);
    }
    else if(event.keyCode==27 && (state=="PLAY" || state=="PAUSED"))
    {
        if(state=="PLAY") state="PAUSED";
        else if(state=="PAUSED") state="PLAY";
        $('.game').toggle();
        $('.pause').toggle();
    }
});
//-----------------------------------------------------------------------------------------------------------
$(document).ready(function(){
    $('.frame').hide();
    $('.home').show();
    $('#gameover').hide();
    $('#highscore').html(getHighscore());
    state="HOME";
});
//-----------------------------------------------------------------------------------------------------------
