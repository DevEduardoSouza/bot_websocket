// ==UserScript==
// @name         WebSocket URI Logger with Filter and Send
// @namespace    http://tampermonkey.net/
// @version      2024-07-04
// @description  Log and send WebSocket URIs containing EVOSESSIONID for Betano URLs
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  console.log("Script started for Betano URLs");

  // Function to reload the page every 5 minutes
  setTimeout(() => {
    location.reload();
  }, 300000); // 300000 milliseconds = 5 minutes

  // Store all WebSocket URIs
  const allWebSocketURIs = new Set(); // Use Set to avoid duplicates

  // Intercept WebSocket constructor
  const originalWebSocket = window.WebSocket;
  window.WebSocket = function (url, protocols) {
    console.log("WebSocket connection to:", url);
    allWebSocketURIs.add(url);
    if (url.includes("EVOSESSIONID") && !url.includes("chat")) {
      console.log("Sending URI to server:", url); // Debugging statement
      sendURIToServer(url);
    }
    return protocols
      ? new originalWebSocket(url, protocols)
      : new originalWebSocket(url);
  };

  // Ensure the prototype chain is correct
  window.WebSocket.prototype = originalWebSocket.prototype;

  // Function to send URI to server
  function sendURIToServer(uri) {
    console.log("Sending URI to server:", uri); // Debugging statement
    fetch("http://localhost:3000/receive-uri", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uri: uri }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        console.log("URI sent successfully");
      })
      .catch((error) => {
        console.error("Failed to send URI:", error);
      });
  }
})();
