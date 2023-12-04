cd to frontend 

npm install 

add you api access token on line 116 in App.js

add your phone number to line 121 in App.js

-------------------------------------------------------------------------------------------

fork and clone node server -> https://github.com/zachsain/whatsapp-backend (not in this root directory)

cd into whatsapp-backend and open new vs code 

do the following:

setup ngrok account and install it on machine -> ngrok.com

follow instructions for installing ngrok on local machine 

start server on whatsapp-backend repo -> npm startFB (this should be running on localhost:3000)

open up new terminal in whatsapp-backend

start ngrok socket -> ngrok http 3000

once ngrok tunnel is running copy the http address from forwarding 

should look like this:

Forwarding         https://57b0-2600-1700-4da-6000-a165-be80-fdd2-e4e5.ngrok-free.app -> http://localhost:3000 

add that http address to webhook config on fb business account 

https://57b0-2600-1700-4da-6000-a165-be80-fdd2-e4e5.ngrok-free.app/webhooks 

add token to webhook config on fb business account -> 12345

------------------------------------------------------------------------------------

in frontend directory run 

npm start 

confirm yes to run on localhost 3001

now your frontend server on localhost:3001 should be communicating with backend server running on 3000 in realtime 



