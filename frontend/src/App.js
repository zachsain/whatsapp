import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';


// const socket = io('http://localhost:3000');
const socket = io('http://localhost:3000', { transports: ['websocket'] });

function App() {
  const [logs, setLogs] = useState([])
  const [allMessages, setAllMessages] = useState([])
  const [messageContent, setMessageContent] = useState("")
  const [conversationId, setConversationId] = useState("")
  const [delivered, setDelivered] = useState(false)
  const chatBoxRef = useRef(null);
  const [latestDeliveredTimestamp, setLatestDeliveredTimestamp] = useState(null);

  function scrollToBottom(){
    if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
  }

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  const sendMessage = (message) => {
    // Send the message to the server
    socket.emit('sendMessage', message);
  };

  useEffect(() => {
    sendMessage("hello");

    const handleNewMessage = (newMessage) => {
      setLogs((prevLogs) => [...prevLogs, newMessage]);
    };
  
    // Add the listener
    socket.on('newMessage', handleNewMessage);
  
    // Cleanup the listener when the component is unmounted
    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, []);

 
  useEffect(() => {
    if (logs) {
      // Create a set to store unique messages
      const uniqueMessages = new Set(allMessages.map(msg => `${msg.sender}-${msg.text}-${msg.timestamp}`));
  
      logs.forEach((log) => {
        if (log.body && log.body.entry) {
          log.body.entry.forEach((entry) => {
            if (entry.changes) {
              entry.changes.forEach((change) => {
                // Check if the field is 'messages' and it has the expected structure
                if (change.field === 'messages' && change.value && change.value.messages) {
                  change.value.messages.forEach((message) => {
                    if (message.text && message.text.body) {
                      const messageKey = `${message.from}-${message.text.body}-${message.timestamp}`;
                      setConversationId(message.id)
                      // Check if the message is unique
                      if (!uniqueMessages.has(messageKey)) {
                        const newMessage = {
                          sender: message.from,
                          text: message.text.body,
                          timestamp: message.timestamp,
                        };
  
                        // Add the unique message to the set
                        uniqueMessages.add(messageKey);
  
                        // Update state with the new message
                        setAllMessages(Array.from(uniqueMessages).map(key => {
                          const [sender, text, timestamp] = key.split('-');
                          return { sender, text, timestamp };
                        }));
                      }
                    }
                  });
                }
  
                // Handle delivered status updates for the second type of log
                if (change.field === 'messages' && change.value && change.value.statuses) {
                  change.value.statuses.forEach((status) => {
                    if (status.status === 'delivered') {
                     
                      setLatestDeliveredTimestamp((prevTimestamp) => {
                        // Update timestamp only if it's newer
                        if (!prevTimestamp || status.timestamp > prevTimestamp) {
                         
                          return status.timestamp;
                        }
                        return prevTimestamp;
                      });
                    }
                 
                  });
                }
              });
            }
          });
        }
      });
    }
  }, [logs, allMessages]);
  

  function handleSubmit(e) {
  e.preventDefault();
    // Replicate the POST request
    const url = 'https://graph.facebook.com/v18.0/174323312431372/messages';
    const accessToken = 'EAAWJaxsIRAwBOZB3m3EoaUQbzsAwQwf8lV7sZC3RdCR9RzBhLQivpJovWlZBDH9DTyPoLWcbbDLqJFWuZCbrXSgA4AgkK7TeZAB9fPImglazuRktiDTYUBDCFsfHgnBXMivQglkXTFomMZBZBjMMzezwYJio7aiv0ivVx1tksTLhDs7wSQ3A6NxIpKd4PMNCrG82KOZC94wSjYR8MZCRe'; // Replace with your actual access token

    const requestBody = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: '19013052426',
      type: 'text',
      text: {
        preview_url: false,
        body: messageContent, // Use the messageContent from the state
      },
    };

    fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Message sent successfully:', data);
        // Handle success, if needed
      })
      .catch((error) => {
        console.error('Error sending message:', error);
        // Handle error, if needed
      });

      if (allMessages.length === 0 || latestDeliveredTimestamp > allMessages[allMessages.length - 1].timestamp) {
        const newMessage = {
          sender: '15550815927',
          text: messageContent,
          timestamp: latestDeliveredTimestamp,
        };
    
        // Update state with the new message
        setAllMessages((prevMessages) => [...prevMessages, newMessage]);
    
        // Clear the messageContent or update other relevant state values if needed
        setMessageContent('');
    
    }
  }

 

  return (
    <div className="">   
       <div className="chatScreen" ref={chatBoxRef}>
        <div className="chatScreen--chatContainer">
        <p className="chatScreen__timestamp"></p>
      
        { allMessages && allMessages.map((m) => (
            m.sender=== '19013052426' ? (  
                <div className="chatScreen__message"> 
                  
                    <p className="chatScreen__text">{m.text}</p>
                </div>) 
            : 
            ( 
                <div className="chatScreen__message"> 
                    <p className="chatScreen__textUser">{m.text}</p>
                </div>
            )
          
        ))}
        </div>
        <form onSubmit={handleSubmit} className="chatScreen__input">
            <input 
                className="chatScreen__inputField" 
                value={messageContent}  
                onChange={(event) => setMessageContent(event.target.value)}
                type="text" 
                placeholder="Type a message"
            />
            <button type='submit' className="chatScreen__inputButton">SEND</button>
        </form>
    </div>
    </div>

  );
}

export default App;
