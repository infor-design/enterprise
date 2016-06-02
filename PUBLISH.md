# Publish instructions

## Prerequisites
To be able to publish to [npm.infor.com](http://npm.infor.com:4873) you need to add an authorized npm user on your system.

```bash
npm adduser --registry http://npm.infor.com:4873 --scope=@infor
```
The username is admin and password is Ap5T7IPF2o, use your regular email address.

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
npm publish ./ --tag nightly

```
* Check Published Tags

```bash
npm info @infor/sohoxi dist-tags
```
* Merge a fix to a branch

```bash
git checkout release/4.2.0
git cherry-pick 802b102fda5420a0f714d9d0efa5eff635fe77d9 //from http://git.infor.com/projects/SOHO/repos/controls/commits
git push
git checkout master
```

# How To

* Full grunt
* npm publish --force
* Update CHANGELOG.MD for breaking changes, and add a new section.
* Send Email to team
* Announce to Slack
* Create new version in Jira
* Generate Release Notes
* Make sure all new examples on the index page are updated
* Comment in the analytics in footer.html
* Deploy to to http://107.170.15.202:4000
* Deploy to to soho.infor.com
* Create branch for major versions inside stash
* Git Tag

# Future
* Make Build
* Make Auto push on npm
