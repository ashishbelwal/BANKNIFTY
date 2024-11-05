import axios from "axios";

let wsInstance: WebSocket | null = null;

export async function fetchContracts(underlying: string = "BANKNIFTY") {
  try {
    const response = await axios.get("/api/contracts", {
      params: { underlying: underlying },
      headers: {
        Accept: "application/json, text/plain, */*",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching contracts:", error);
    throw error;
  }
}

export async function fetchOptionChain(underlying: string = "BANKNIFTY") {
  try {
    const response = await axios.get(`/api/option-chain-with-ltp`, {
      params: { underlying },
      headers: {
        Accept: "application/json, text/plain, */*",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching option chain:", error);
    throw error;
  }
}

export async function alternatefetchOptionChain(expiryDate: string) {
  try {
    const response = await axios.get(`/api/expiries`, {
      params: { date: expiryDate },
      headers: {
        Accept: "application/json, text/plain, */*",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching option chain:", error);
    throw error;
  }
}

export function setupWebSocket(expiry: string) {
  if (!wsInstance || wsInstance.readyState === WebSocket.CLOSED) {
    wsInstance = new WebSocket("https://prices.algotest.xyz/mock/updates");

    wsInstance.onopen = () => {
      console.log("WebSocket connection opened");
      sendSubscription(expiry);
    };

    wsInstance.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received WebSocket data:', data);
      } catch (error) {
        console.error("Error parsing WebSocket data:", error);
      }
    };

    wsInstance.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    wsInstance.onclose = () => {
      console.log("WebSocket connection closed");
      wsInstance = null;
    };
  } else {
    sendSubscription(expiry);
  }

  return wsInstance;
}

function sendSubscription(expiry: string) {
  console.log({expiry});
  if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
    const subscriptionMessage = {
      msg: {
        datatypes: ["ltp"],
        underlyings: [
          {
            Type: 'subscribe',
            underlying: "BANKNIFTY",
            cash: true,
            options: [expiry],
          },
        ],
      },
    };
    wsInstance.send(JSON.stringify(subscriptionMessage));
  }
}
