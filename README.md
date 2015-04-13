> PE*N + Github auth starter project

Based on [hackathon starter kit](https://github.com/sahat/hackathon-starter) with all extras removed
and parts replaced for simplicity. [Demo](http://pe-n-starter.herokuapp.com/)

## Stack

* [PouchDB](http://pouchdb.com/) database - no MongoDB dependency
* [Express](http://expressjs.com/) server
* No client side MVC, Jade server pages
* [Node](nodejs.org) environment
* Github login for user signon

## Install and run

    git clone --depth 1 https://github.com/bahmutov/PE-N-starter.git
    cd PE-N-starter
    npm install
    npm run dev

## Make it your own

    git remote remove origin
    git remote add origin <your github url>

To have Github auth working:
    cp config/default-dev.json config/local-dev.json

Edit `config/local-dev.json` and enter Github application id and secret 
(you can create new developer application from your [profile](https://github.com/settings/applications)).
For local testing set the callback from Github to your application to `http://localhost:3000/auth/github/callback`

### Utils

* [nconf](https://www.npmjs.com/package/nconf) for managing environment and command line settings
* [Ramda](http://ramdajs.com/docs/) for functional utils
* [lazy-ass](github.com/bahmutov/lazy-ass) lazy assertions with 
[check-more-types](https://github.com/kensho/check-more-types) predicates.

License
-------

The MIT License (MIT)

Copyright (c) 2015 Gleb Bahmutov

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
