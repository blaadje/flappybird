import Gravity from './resources/Gravity'
import Game from './resources/Game'
import './game.scss'

new Game()

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    let swPath = `service-worker.js`
    navigator.serviceWorker.register(swPath).then(
      function (registration) {
        // Registration was successful
        console.log(
          'ServiceWorker registration successful with scope: ',
          registration.scope,
        )
      },
      function (err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err)
      },
    )
  })
}
