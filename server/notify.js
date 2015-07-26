module.exports = function createBoradcast(wss) {
  return function broadcast(message) {
    wss.clients.forEach(function each(client) {
      client.send(JSON.stringify(message));
    });
  };
};
