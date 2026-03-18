const { app, BrowserWindow, session } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "TuxDio - Radio Nordique",
    icon: path.join(__dirname, 'icon.png'), // Si vous en avez une
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // --- BLOQUEUR DE PUBS (Network Level) ---
  // Bloque les requêtes vers les serveurs de pubs avant même qu'elles ne partent
  const filter = {
    urls: [
      "*://*.doubleclick.net/*",
      "*://*.google-analytics.com/*",
      "*://*.googlesyndication.com/*",
      "*://*.moatads.com/*",
      "*://*.amazon-adsystem.com/*",
      "*://*.radio-canada.ca/*/ads/*" // Cible spécifique Radio-Canada
    ]
  };

  session.defaultSession.webRequest.onBeforeRequest(filter, (details, callback) => {
    callback({ cancel: true });
  });

  // Chargement de votre fichier local
  win.loadFile('index.html');

  // Optionnel : Enlever la barre de menu (Alt pour la voir)
  win.setMenuBarVisibility(false);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
