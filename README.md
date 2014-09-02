# aRanger

A simple way to arrange items in a grid.  A live version can be found at [code.minnpost.com/aranger](http://code.minnpost.com/aranger/).

## Github authentication

In able to login with Github (and save arrangements), Github oath requires a small server-side proxy.  This app is setup to use [Gatekeeper](https://github.com/prose/gatekeeper).

Running on Heroku:

* For local: http://mp-aranger-gk-local.herokuapp.com
* For production: http://mp-aranger-gatekeeper.herokuapp.com

Github applications are setup:

* For local, Github application ID `126989`.
* For production, Github application ID `126783`.

## Development

You will need to serve the application at `localhost:8080\` if you want to use the already-set-up Gatekeeper application.

Any web server will do, but a simple one is [http-server](https://github.com/nodeapps/http-server).

1. `npm install http-server -g`
2. `http-server -p 8080`

## Deploy

Except for Gatekeeper, the application is all frontend and could easily run on something like [Github Pages](https://pages.github.com/).

### Github Application

Set up a Github application for [oauth](https://developer.github.com/v3/oauth/) at [github.com/settings/applications/new](https://github.com/settings/applications/new).

### Gatekeeper

Running your own [Gatekeeper](https://github.com/prose/gatekeeper) is fairly straigforward; see the instructions on the project page.  You can easily deploy it on Heroku with the heroku button below:

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/prose/gatekeeper/tree/master)
