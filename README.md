# moreOrLess - Pure NodeJS Game 

## Welcome in the tutorial 
The purpose of the game is to guess the number. The fewer attempts, the better your score will be.


⚠️ **If you don't choose the good method, the request will not work** ⚠️


-> To start the game, type 'http://localhost:1117/party/?min=0&max=100' [POST]<br>
    (If you want to choose min and max, type 'http://localhost:1117/party/?min=YOURMIN&max=YOURMAX' [POST] and replace YOURMIN and YOURMAX by your own values.)<br>
    **WARNING** : YOURMIN can't be superior or equal to YOURMAX and both values have to be completed<br><br>
    
-> To resume or continue the current game, type 'http://localhost:1117/party/current/?number=YOURNUMBER' [PUT] <br>
    Adjust the number depending the responve you received.<br><br>
    
-> To see numbers you already played in the current game, type 'http://localhost:1117/party/current' [GET]<br><br>

-> To rematch with the same minimum and maximum values,  type 'http://localhost:1117/party/rematch' [POST]<br><br>
 
-> To see your top 10, type 'http://localhost:1117/scores' [GET]<br>
    NOTE: The fewer attempts, the better your score will be. <br><br>
    ***Have fun and good luck*** (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧
