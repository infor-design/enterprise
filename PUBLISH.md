# Publish instructions

## Prerequisites
To be able to publish to [npm.infor.com](http://npm.infor.com:4873) you need to add an authorized npm user on your system.

```bash
npm adduser --registry http://npm.infor.com:4873 --scope=@infor
```
The username is admin and password is Ap5T7IPF2o, use your regular email address.

npm set registry http://registry.npmjs.org
npm set registry http://registry.npmjs.org

## Checklist

* Pull Down Latest

```bash
git pull
```

* Update the verison number in the package.json. The [semver standard](http://semver.org/) is used for this purpose.
* Create a git tag named _vX.X.X_, with the correct version number.

```bash
git tag 4.0.7
```

* Publish to [npm.infor.com](http://npm.infor.com:4873)

```bash
npm publish
```

* Update CHANGELOG.MD for breaking changes, and add a new section.
* Send Email to team
* Announce to Slack
* Create new version in Jira
* Generate Release Notes
* Make sure all new examples on the index page are updated
* Comment in the analytics in footer.js - deploy to to http://107.170.15.202:4000
