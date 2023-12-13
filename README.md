# Summary

This repository is for the frontend of a whatsapp business account messaging app. 
This README is designed to walk you step by step on how to setup not only this frontend repository, but also setting up the backend repository. 

Before running any of the following commands make sure you have the latest version of Node installed on local machine: https://nodejs.org/en/download

# Steps for setting up frontend repository 

Clone this repo down to your local machine: https://github.com/zachsain/whatsapp

In cli run following commands: 

```git clone git@github.com:zachsain/whatsapp.git```

```cd whatsapp```

Open up root directory in vs code:

```code .``` 

Open up new terminal in vs code and run the following commands:

```cd frontend```

```npm install```

After installing app dependencies open App.js in your file directory /whatsapp/frontend/src/App.js

Add your business account id provided by facebook on line 115 

```const url = 'https://graph.facebook.com/v18.0/YOURACCOUNTID/messages'```

Add you API key on line 116 in App.js (remember this API key refreshes every 24 hrs, so it will need to be updated as such)

Add your phone number to line 121 in App.js (this is the number you will be messaging with via the chat interface)

# Setting up backend repository

To setup the backend for this chat application do the following:

Clone node server -> https://github.com/zachsain/whatsapp-backend (not in this root directory)

In new terminal (outside of this root directory e.g /whatsapp) run the following:

```git clone git@github.com:zachsain/whatsapp-backend.git```

```cd whatsapp-backend```

```code .```

Open terminal inside vs code and run the following commands in cli:

```npm install```

After dependencies are installed do the following:

Setup ngrok account and install it on local machine -> https://ngrok.com/

Follow instructions in ngrok docs for installing ngrok on local machine 

Once ngrok is installed on your local machine you can now start backend server: 

```npm startFB```

This should be running on localhost:3000 (under the circumstances that it's not running on port 3000 adjust ngrok commands and line 6 on App.js to align with the port your backend server is running on). 

Open up new terminal window in vs code

Start ngrok socket: 
 
 ```ngrok http 3000```

Once ngrok tunnel is running copy the http address from forwarding 

Should look like this:

```Forwarding         https://57b0-2600-1700-4da-6000-a165-be80-fdd2-e4e5.ngrok-free.app -> http://localhost:3000```

Add that http address to webhook config on fb business account and add /webhooks to the end of the address:

```https://57b0-2600-1700-4da-6000-a165-be80-fdd2-e4e5.ngrok-free.app/webhooks```

Add token to webhook config on fb business account -> 12345

# Start frontend server

In frontend directory run 

```npm start```

Confirm y to run on localhost:3001

Now your frontend server on localhost:3001 should be communicating with backend server running on port 3000 in realtime 

## Notes

Before realtime chat is enabled make sure you have sent out the message on facebook business account to the number in which intend on communicating with. This number should be the same as the number input on line 121 in App.js 

If you run into any issues make sure to review the steps and read documentation for setting up facebook business account, configuring webhooks, ngrok setup, etc... 


