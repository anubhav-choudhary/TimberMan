//Variables declaration

var score;
var state;//State=(HOME,PAUSED,PLAY,END)
var count=0;

//End of declaration

//Function Def

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


function start_game() //Function to start a new game with every tile re ini. and score =0 
{
    score=0;
    count=0;
    $('#score').html(0);
    for(i=1;i<=6;i=i+1)
    {
        $("#l"+i).removeClass();
    }
    for(i=1;i<=6;i=i+1)
    {
        $("#l"+i).addClass('tile');
    }
    for(i=2;i<=6;i=i+2)
    {
        $("#l"+i).addClass(getRandClass());
    }
    $("#l1").addClass('no_branch_lm');
    $("#l3").addClass('no_branch');
    $("#l5").addClass('no_branch');
}
    
function end_game() //Function that is called when user is killed.
{
    alert('You are dead. your score : '+score); //Game over tab
    for(i=1;i<=6;i++)
    {
        $("#l"+i).removeClass();
        $("#l"+i).addClass('tile');
    }
    //start_game();
    $('.frame').hide();
    $('.tab').hide();
    $('.home').show();
}

    
    
function gen_top_tile(flag) //Function to generate random tile for topmost layer
{
    $("#l6").removeClass();
    $("#l6").addClass('tile');
    if(flag==true) 
        $("#l6").addClass(getRandClass());
    else 
        $("#l6").addClass('no_branch');
}
    
    
function shift(flag,direction)// Function to shift tile after every key press it also detects death of player
{
    var endgame=0;
    $("#l1").removeClass();
    var attrb= $("#l2").attr('class');
    $("#l1").removeClass();
    $("#l1").addClass('tile');
    
    if(attrb.search("no_branch")!=-1 && direction=="left")
            $("#l1").addClass('no_branch_lm');
    else if(attrb.search("no_branch")!=-1 && direction=="right")
            $("#l1").addClass('no_branch_rm');
    else if(attrb.search("left_branch")!=-1 && direction=="right")
            $("#l1").addClass('left_branch_rm');
    else if(attrb.search("left_branch")!=-1 && direction=="left")
        {
            $("#l1").addClass('left_branch_dead');
            endgame=1;
        }
    else if(attrb.search("right_branch")!=-1 && direction=="left")
            $("#l1").addClass('right_branch_lm');
    else if(attrb.search("right_branch")!=-1 && direction=="right")
        {     
            $("#l1").addClass('right_branch_dead');
            endgame=1;
        }
    
    for(i=2;i<=5;i++)
    {
        $("#l"+i).removeClass();
        $("#l"+i).addClass($("#l"+(i+1)).attr('class'));
    }
    
    gen_top_tile(flag);
    if(endgame==1) 
    {
        end_game();
        return false;
    }
    return true;
}

//Link Functions
function show_game()// Function invoked when Play Game link is clicked
{
    $('.frame').hide();
    $('.game').show();
    $('.tab').show();
    state="PLAY";
    count=0;
    start_game();    
}

function endgame() //Function invoked when end game is pressed
{
    $('.pause').hide();
    $('.home').show();
    $('.tab').hide();
    state="HOME";
}

function resume() //Function invoked when resume is pressed
{
    $('.game').show();
    $('.pause').hide();
    state="PLAY";
}
    
//EVENT FUNCTIONS    
$(document).keydown(function(event)
{
    if(event.keyCode==37 && state=="PLAY")
    {
        count=(count+1)%2;
        console.log(count);
        var flag;
        if(count==0) 
            flag=shift(false,"left");
        else 
            flag=shift(true,"left");
        if(flag)
        {
            var dscore=parseInt($('#score').html());
            $('#score').html(dscore+1);  
            score++;   
        }   
    }
    else if(event.keyCode==39 && state=="PLAY")
    {
        count=(count+1)%2;
        console.log(count);
        var flag;
        if(count==0) 
            flag=shift(false,"right");
        else 
            flag=shift(true,"right");
        if(flag)
        {
            var dscore= parseInt($('#score').html());
            $('#score').html(dscore+1);
            score++;
        }
        
    }
    else if(event.keyCode==27 && (state=="PLAY" || state=="PAUSED"))
    {
        if(state=="PLAY") state="PAUSED";
        else if(state=="PAUSED") state="PLAY";
        $('.game').toggle();
        $('.pause').toggle();
    }
});

$(document).ready(function(){
    $('.frame').hide();
    $('.home').show();
    $('.canvas').show();
    $('.tab').hide();
    state="HOME";
});
