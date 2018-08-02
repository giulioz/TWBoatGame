# Gestione utenti

### `POST /logjn`

Verifica credenziali e fa il login

### `POST /logout`

Fa il logout pulendo la sessione

### `GET /user`

Ritorna informazioni sull'utente corrente

### `POST /user`

Imposta informazioni sull'utente corrente

### `GET /users/(user_id)`

Ritorna informazioni sull'utente con il dato user_id

### `POST /users/(user_id)`

Imposta informazioni sull'utente con il dato user_id

### `GET /users/online?num=N`

Ritorna N utenti online

### `GET /users/byName?name=N`

Ritorna gli utenti con nome like N*

### `GET /scoreboard`

Ritorna la scoreboard