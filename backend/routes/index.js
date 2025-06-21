const fs = require('fs');
const path = require('path');

const routes = {};

fs.readdirSync(__dirname).forEach(file => {
  // Ignora archivos que no sean JavaScript o que no terminen en 'Route.js'
  if (file === 'index.js' || !file.endsWith('Route.js')) return;

  const routeName = file.replace('.js', ''); // ejemplo: loginRoute
  const routeModule = require(path.join(__dirname, file));
  routes[routeName] = routeModule;
});

module.exports = routes;
