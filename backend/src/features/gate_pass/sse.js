/**
 * @file sse.js
 * @description module for gate_pass feature.
 */
const clients = new Set();

export const addClient = (res) => {
  clients.add(res);
};

export const removeClient = (res) => {
  clients.delete(res);
};

export const notifyClients = (event, data) => {
  const payload = JSON.stringify({ event, data });
  clients.forEach((client) => {
    try {
      client.write(`data: ${payload}\n\n`);
    } catch (err) {
      console.error("Error writing to client SSE:", err.message);
      clients.delete(client);
    }
  });
};

export default { addClient, removeClient, notifyClients };
