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
