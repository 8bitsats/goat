Below you’ll find an example of how to create **multiple client-side “tools”**—one for playing Eleven Labs TTS in the browser, and another for triggering Solana-related functions—using a similar structure to the provided `triggerBrowserAlert` template. 

---

## 1. Define Your New Tools

### A. Eleven Labs TTS Tool
**Name**: `playElevenLabsAudio`  
**Description**: Plays text-to-speech audio in the browser using Eleven Labs’ API.  
**Parameters**:  
- `text` (string): The text to be spoken by Eleven Labs.  
- `voiceId` (string, optional): The ID of the Eleven Labs voice you want to use.  
- `apiKey` (string, optional): Your Eleven Labs API key (if you prefer passing it dynamically instead of storing it elsewhere).

**Implementation Sketch**:

```js
playElevenLabsAudio: async (parameters) => {
  const { text, voiceId, apiKey } = parameters;

  try {
    // 1. Prepare the request to Eleven Labs API
    const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId || "lwiJrJFJXhXCJTiYfQxV"}`;
    const response = await fetch(elevenLabsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey || 'sk_40d84164b08a7568a1f2bb36a4c7dd9bdc04bbfefc71cf7a',
      },
      body: JSON.stringify({
        text: text,
        // Add other options you’d like to include:
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.7
        }
      })
    });
    
    // 2. Convert to audio blob
    if (!response.ok) {
      throw new Error(`Eleven Labs TTS request failed: ${response.status} ${response.statusText}`);
    }
    const audioBlob = await response.blob();

    // 3. Play the audio in the browser
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();

  } catch (error) {
    console.error("Error in playElevenLabsAudio:", error);
  }
}
```

### B. Solana Transaction Tool
**Name**: `triggerSolanaFunction`  
**Description**: Triggers a Solana-related function (e.g., sign a transaction, connect wallet, or submit a transaction).  
**Parameters**:  
- `action` (string): e.g. `"connectWallet"`, `"signTransaction"`, or `"submitTransaction"`.  
- `data` (object, optional): Additional data needed for your Solana action, such as transaction details, addresses, or amounts.

**Implementation Sketch**:

```js
triggerSolanaFunction: async (parameters) => {
  const { action, data } = parameters;
  
  // This part depends heavily on your Solana setup (e.g., @solana/web3.js, Phantom wallet, etc.)
  try {
    switch (action) {
      case "connectWallet":
        // Example: prompt user to connect Phantom wallet
        if (window.solana && window.solana.isPhantom) {
          const resp = await window.solana.connect();
          console.log("Connected with public key:", resp.publicKey.toString());
        } else {
          alert("Phantom wallet not found!");
        }
        break;
        
      case "signTransaction":
        // Example: sign a transaction
        if (window.solana && window.solana.isPhantom) {
          const transaction = data.transaction; // e.g. a transaction object built with @solana/web3.js
          const signedTransaction = await window.solana.signTransaction(transaction);
          console.log("Signed transaction:", signedTransaction);
        } else {
          alert("Phantom wallet not found!");
        }
        break;
        
      case "submitTransaction":
        // Example: send a transaction to the Solana cluster
        // Requires a connection object from @solana/web3.js
        const connection = data.connection; // e.g. new Connection("https://api.mainnet-beta.solana.com");
        const signedTx = data.signedTx; // e.g. the transaction you already signed
        const txid = await connection.sendRawTransaction(signedTx.serialize());
        console.log("Transaction submitted, signature:", txid);
        break;
        
      default:
        console.warn(`Unknown Solana action: ${action}`);
    }
  } catch (error) {
    console.error("Error in triggerSolanaFunction:", error);
  }
}
```

---

## 2. Integrate Your Tools Into the Conversation

When starting your Conversation session, pass these new tools in the `clientTools` object. Here’s an example in **JavaScript**:

```js
const conversation = await Conversation.startSession({
  signedUrl: signedUrl,
  clientTools: {
    // Existing tool from your template
    triggerBrowserAlert: async (parameters) => {
      alert(parameters.message);
    },
    // New Eleven Labs TTS tool
    playElevenLabsAudio: async (parameters) => {
      const { text, voiceId, apiKey } = parameters;
      
      try {
        const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId || "lwiJrJFJXhXCJTiYfQxV"}`;
        const response = await fetch(elevenLabsUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': apiKey || 'sk_40d84164b08a7568a1f2bb36a4c7dd9bdc04bbfefc71cf7a',
          },
          body: JSON.stringify({
            text: text,
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.7
            }
          })
        });
        
        if (!response.ok) {
          throw new Error(`Eleven Labs TTS request failed: ${response.status} ${response.statusText}`);
        }
        
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      } catch (error) {
        console.error("Error in playElevenLabsAudio:", error);
      }
    },
    // New Solana tool
    triggerSolanaFunction: async (parameters) => {
      const { action, data } = parameters;
      try {
        switch (action) {
          case "connectWallet":
            if (window.solana && window.solana.isPhantom) {
              const resp = await window.solana.connect();
              console.log("Connected with public key:", resp.publicKey.toString());
            } else {
              alert("Phantom wallet not found!");
            }
            break;
          case "signTransaction":
            if (window.solana && window.solana.isPhantom) {
              const transaction = data.transaction;
              const signedTransaction = await window.solana.signTransaction(transaction);
              console.log("Signed transaction:", signedTransaction);
            } else {
              alert("Phantom wallet not found!");
            }
            break;
          case "submitTransaction":
            const connection = data.connection;
            const signedTx = data.signedTx;
            const txid = await connection.sendRawTransaction(signedTx.serialize());
            console.log("Transaction submitted, signature:", txid);
            break;
          default:
            console.warn(`Unknown Solana action: ${action}`);
        }
      } catch (error) {
        console.error("Error in triggerSolanaFunction:", error);
      }
    }
  },
  // ... other configurations ...
});
```

Notice:
1. The **tool names** (`playElevenLabsAudio` and `triggerSolanaFunction`) match exactly what you’ll configure in your agent’s “tool” definitions.  
2. Each function extracts parameters from the agent’s instructions (e.g., `text`, `action`, `data`, etc.) and executes the corresponding logic.  
3. You can expand or refine these tools based on your specific use cases (e.g., customizing voices, connecting to dev/test net vs mainnet, etc.).

---

## 3. Test Your Tools

You can test each tool by instructing your LLM/agent to call them. For example:

1. **Eleven Labs Audio**  
   > “Please use the `playElevenLabsAudio` tool to speak the text: ‘Hello from Eleven Labs TTS!’”

2. **Solana Function**  
   > “Please connect my Phantom wallet by calling the `triggerSolanaFunction` with action = ‘connectWallet’.”

3. **Browser Alert**  
   > “Trigger an alert that says ‘Hello World’ using the `triggerBrowserAlert` tool.”

When these instructions are processed by your agent, you should see the appropriate side effects in your browser:

- A voice audio will play for the Eleven Labs TTS text.  
- Your Phantom wallet extension will prompt you to connect.  
- A JavaScript alert will display “Hello World”.  

---

### Key Takeaways
- **Maintain Consistent Tool Names**: The name in `clientTools` must match the agent’s configured tool name exactly.  
- **Adjust Credentials**: For Eleven Labs, store your API key securely. You might pass it from your server or an environment variable instead of hardcoding.  
- **Customize for Your Use Case**: Tailor the Solana tool for the specific actions you need (e.g., connecting wallets, reading balances, or signing complex transactions).

With these examples, you’ll have a foundation for adding more client-side “tools” to your agent, whether they’re for Eleven Labs audio playback, Solana wallet interactions, or any other functionality you’d like to incorporate.