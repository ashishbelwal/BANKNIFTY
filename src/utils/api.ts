import { Contract, OptionData } from '@/types/index';
import axios from 'axios';


export async function fetchContracts(underlying: string = 'BANKNIFTY'): Promise<Contract[]> {
    try {
      const response = await axios.get("/api/contracts", {
        params: { underlying: underlying },
        headers: {
          "Accept": "application/json, text/plain, */*"
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching contracts:', error);
      throw error;
    }
  }


export async function fetchOptionChain(underlying: string = 'BANKNIFTY'): Promise<OptionData[]> {
  try {
    const response = await axios.get(`/api/option-chain-with-ltp`, {
      params: { underlying },
      headers: {
        "Accept": "application/json, text/plain, */*"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching option chain:', error);
    throw error;
  }
}

export async function alternatefetchOptionChain(expiryDate: string): Promise<any> {
  try {
    const response = await axios.get(`/api/expiries`, {
      params: { date: expiryDate },
      headers: {
        "Accept": "application/json, text/plain, */*"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching option chain:', error);
    throw error;
  }
}






export function setupWebSocket(expiry: string): WebSocket {
    console.log("Start WebSocket");
    console.log({expiry})
  const ws = new WebSocket('https://prices.algotest.xyz/mock/updates');

  ws.onopen = () => {
    console.log("WebSocket connection opened");
    const subscriptionMessage = {
      msg: {
        datatypes: ['ltp'],
        underlyings: [
          {
            underlying: 'BANKNIFTY',
            cash: true,
            options: [expiry],
          },
        ],
      },
    };
    ws.send(JSON.stringify(subscriptionMessage));
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      // console.log('Received WebSocket data:', data);
    } catch (error) {
      console.error('Error parsing WebSocket data:', error);
    }
      
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('WebSocket connection closed');
  };

  return ws;
}
