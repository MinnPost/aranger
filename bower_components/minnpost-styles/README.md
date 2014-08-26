# MinnPost Styles

The MinnPost super-fly style guide, specifically focused on interactive and news applications made by the MinnData team.

This repository should serve as both a code repository to be included in projects as well as a web page for reference and demo purposes.

The demo is publically viewable at [code.minnpost.com/minnpost-styles](http://code.minnpost.com/minnpost-styles).

## Usage

Install with `bower install minnpost-styles`.  See the [main demo page](http://code.minnpost.com/minnpost-styles) for library use.

Note that all styles are within the `.minnpost-styles` prefix, as our projects are  usually embedded in an existing site.

## Development

### Prerequisites

All commands are assumed to on the [command line](http://en.wikipedia.org/wiki/Command-line_interface), often called the Terminal, unless otherwise noted.  The following will install technologies needed for the other steps and will only needed to be run once on your computer so there is a good chance you already have these technologies on your computer.

1. Install [Git](http://git-scm.com/).
   * On a Mac, install [Homebrew](http://brew.sh/), then do: `brew install git`
1. Install [NodeJS](http://nodejs.org/).
   * On a Mac, do: `brew install node`
1. Install [Grunt](http://gruntjs.com/): `npm install -g grunt-cli`
1. Install [Bower](http://bower.io/): `npm install -g bower`
1. Install [Ruby](http://www.ruby-lang.org/en/downloads/), though it is probably already installed on your system.
1. Install [Bundler](http://gembundler.com/): `gem install bundler`

### Get code and install packages

Get the code for this project and install the necessary dependency libraries and packages.

1. Check out this code with [Git](http://git-scm.com/): `git clone https://github.com/MinnPost/minnpost-styles.git`
1. Go into the project directory: `cd minnpost-styles`
1. Install NodeJS packages: `npm install`
1. Install Bower components: `bower install`
1. Install Ruby gems: 'bundle install'
    * On a Mac you will probably have to do: `sudo bundle install`

### Running

1. Run: `grunt server`
    * This will run a local webserver for development and you can view the application in your web browser at [http://localhost:8833](http://localhost:8833).
    * The server runs `grunt watch` which will rebuild the applicaiton when files have been modified.

### Build

To build or compile all the assets together and create a new version in the `dist/` folder.

1. Update verson in `bower.json`
1. Update verson in `package.json`
1. Run: `grunt`
1. Commit changes and push up to Github, including the `gh-pages` branch

### MinnPost Deploy

For our own purposes, there are some versions up on S3.  It is not suggested to use these as S3 is not a CDN.  What is in the `dist` folder will be found in the following folder:

    https://s3.amazonaws.com/data.minnpost/projects/minnpost-styles/X.X.X/

For instance:

    https://s3.amazonaws.com/data.minnpost/projects/minnpost-styles/0.0.2/minnpost-styles.min.css

The Grunt process has a method to upload this to S3: `grunt deploy`

## Inspiration and 3rd Party Code

Some code and inspiration taken from other, awesome libraries.

* Many parts are taken directly from [Bootstrap](http://getbootstrap.com/) ([license](https://github.com/twbs/bootstrap/blob/master/LICENSE)).
* Small parts taken from [Mapbox.js](https://www.mapbox.com/mapbox.js/) ([license](https://github.com/mapbox/mapbox.js/blob/master/LICENSE.md)).
