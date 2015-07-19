module.exports = function createBoradcast(wss) {
  return function broadcast(file) {
    wss.clients.forEach(function each(client) {
      client.send(JSON.stringify({ source: file, }));
    });
  };
};
