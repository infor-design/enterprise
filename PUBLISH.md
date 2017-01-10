# Publish instructions

# TODO
* SOHO-4420	Build docker container to build, run and test SoHo
* SOHO-4787 Add release build to bamboo server
* SOHO-4827 Dockerize soho.infor.com for staging and production

## Prerequisites
To be able to publish to [npm.infor.com](http://npm.infor.com:4873) you need to add an authorized npm user on your system...

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
npm publish ./ --tag=develop

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
# How To Publish with New Process

- Update date and version and release notes link in PUBLISH.MD
- Push

# How To Make Release

* Full grunt
* Update package.json
* npm publish --force
* Update CHANGELOG.MD for breaking changes, and add a new section.
* Git Tag
```bash
 git tag 4.2.1.rc.1
 git push origin --tags
```
* Create new version in Jira
* Generate Release Notes
* Make sure all new examples on the index page are updated
* Deploy to to http://usmvvwdev53:421 <version>
* Make new Deploy to to http://usmvvwdev53:<version next>
* Dync db and files from usmvvwdev53
* Comment in the analytics in footer.html (soho.infor.com)
* Deploy to to http://soho.infor.com
* Updated changelog-contents.html
* Create branch for major versions inside stash

### Update version in @infor/sohoxi-angular
* Clone repo
```bash
$ git clone ssh://git@git.infor.com:7999/soho/angular-components.git
```
* Bump version in package.json to match new version of `@infor/sohoxi`
* Bump `@infor/sohoxi's verion` under dependencies to match new version (i.e "^4.2.3-develop")
* Commit, tag and push changes

Later
* Send Email to team
* Announce to Slack

# How To Update SoHo Staging Site

On your mac:

* Pull the latest branch you want to deploy
* Build the dist files:

```bash
$ npm install
$ grunt
```

* Connect to usmvvwdev53 C drive:
  * cmd-k
  * Server Address: smb://usmvvwdev53/c$
  * Click Connect
  * Login with Infor user/pass
    * User is INFOR\<username>
    * Talk to Chris or Tim if you don't have access
* Copy and replace contents of dist/js/ to /inetpub/wwwroot/public/js/
* Copy and replace contents of dist/css/ to /inetpub/wwwroot/public/stylesheets/
* Copy and replace views/docs/changelog-contents.html to /inetpub/wwwroot/craft/templates/

On usmvvwdev53:

* Remote Desktop to usmvvwdev53
  * Talk to Chris or Tim if you don't have access
* Open wwwroot/craft/templates/footer.html with notepad and bump the version to the latest
* If jquery version changes, then open /inetpub/wwwroot/craft/templates/_layout.html with notepad and bump jquery version
* Open /inetpub/wwwroot/craft/templates/_layout.html with notepad and update all query string version numbers. example: `/stylesheets/site.css?v4.2.1`

# How To Update SoHo Production Site

```
Update notes to come...
```

**NOTE** If you copy in a new version of CraftCMS or of the craft dir, then make sure to check that Users group has Full Control access to /inetpub/wwwroot/craft/storage.

Site error: `C:\inetpub\wwwroot\craft\storage isn't writable by PHP. Please fix that.`

To Confirm Permissions:

* Right click /inetpub/wwwroot/craft/storage and select Properties
* Click Securtity tab > Advanced
* Confirm that Users(USALVWSOHO2\Users) has Full Control Access
* If not then:
	* Click Change Permissions > Disable inheritance
	* Double-click on Users(USALVWSOHO2\Users)
	* Change Basic permissions: to Full Control and close
	* Visit Site with non-admin user
