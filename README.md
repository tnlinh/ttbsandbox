
# TTB Sandbox

Playground to consume TitleToolBox web services for 3rd parties.

##### Project Structure
dist or build will be auto-generated inside `dist/` (please use this as read or serve only, on server or local)
source files are inside `src/` where we can change `ttbsandbox.html` and `sandbox.js`
SDK file is `lib/ttbsdk.js`, feel free to change if need. (soon to be moved to a separate private repo and symlink here)

### How to get application set up?

#### Pre-requisite
* `npm` from node.js

#### Steps to serve
* `clone` this project.
* `cd` to project root and run `npm install`.
* run `npm run serve` to serve the build over `http://localhost:8000/`, (open URL on your browser)

#### To develop and generate the build
* run `gulp doc-dev` for gulp task to watch files in `src/` and `lib/` and generate the build into `dist/`

###### Cheers !

Copyright © 2017 Benutech Inc.. All rights reserved.
