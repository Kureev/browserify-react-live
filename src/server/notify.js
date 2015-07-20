module.exports = function createBoradcast(wss) {
  return function broadcast(patch) {
    wss.clients.forEach(function each(client) {
      client.send(JSON.stringify({ patch: patch, }));
    });
  };
};
