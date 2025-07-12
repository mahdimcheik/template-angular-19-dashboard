# install ssl
1.  install choco `Set-ExecutionPolicy Bypass -Scope Process -Force; `
[System.Net.ServicePointManager]::SecurityProtocol = `
  [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; `
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))`

2.  install mkcert `choco install mkcert -y`
3.  Installe la CA locale (une seule fois) `mkcert -install`
4.  Créer certificat `mkcert localhost`
5.  Renomer ou pas 
6.  lancer l'application avec https `ng serve --ssl true --ssl-key key.pem --ssl-cert cert.pem --port 4201`


# accessibility 
| Attribut ARIA      | 📖 Description courte                                            | 💡 Exemple                                                          |
| ------------------ | ---------------------------------------------------------------- | ------------------------------------------------------------------- |
| `aria-label`       | Donne un nom lisible aux lecteurs d’écran                        | `<button aria-label="Close">✖</button>`                             |
| `aria-labelledby`  | Référence un élément existant comme titre                        | `<div aria-labelledby="titleId"><h2 id="titleId">Menu</h2></div>`   |
| `aria-describedby` | Référence une description complémentaire                         | `<input aria-describedby="desc"><div id="desc">Format: email</div>` |
| `aria-hidden`      | Masque l’élément des lecteurs d’écran                            | `<span aria-hidden="true">★</span>`                                 |
| `aria-disabled`    | Indique qu’un élément est désactivé                              | `<div role="button" aria-disabled="true">Submit</div>`              |
| `aria-expanded`    | Indique si un élément est ouvert ou fermé                        | `<button aria-expanded="false" aria-controls="menu">Menu</button>`  |
| `aria-controls`    | Lien entre un bouton et l’élément qu’il contrôle                 | `<button aria-controls="panel1">Toggle</button>`                    |
| `aria-pressed`     | État d’un bouton à bascule (toggle button)                       | `<button aria-pressed="true">Mute</button>`                         |
| `aria-selected`    | État sélectionné dans une liste ou un onglet                     | `<li role="tab" aria-selected="true">Tab 1</li>`                    |
| `aria-live`        | Zone de contenu mise à jour dynamiquement à lire automatiquement | `<div aria-live="polite">New notification</div>`                    |
| `aria-modal`       | Indique qu’une boîte de dialogue est modale                      | `<div role="dialog" aria-modal="true">...</div>`                    |
| `aria-required`    | Indique qu’un champ est requis                                   | `<input type="text" aria-required="true">`                          |
| `role`             | Définit le rôle de l’élément pour l’accessibilité                | `<div role="alert">Error occurred</div>`                            |
