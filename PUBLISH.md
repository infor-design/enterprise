# Publish Notes

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

* Publish Just the Dist folder

Update the info in dist/package.json

```bash
npm publish dist --tag dev
npm publish dist --tag release/4.2.6
npm publish dist
```

* Check Published Tags

```bash
npm info @infor/sohoxi dist-tags
npm view @infor/sohoxi versions
```

* Delete a Tag

```bash
npm adduser --registry http://npm.infor.com:4873 --scope=@infor
npm dist-tag rm @infor/sohoxi develop
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
- Push Make release of current version in Jira
- Run this process: http://wiki.infor.com:8080/confluence/display/HaL/SoHo+XI+Release+Builds

Note: This part is not working
http://bamboo.infor.com/browse/SOHO-NGV-16

- Bump Change Log
- Make sure new version in Jira
- Update dev53
- add label to successful build

# How To Make Release (4.3.0)

* Check Change Log is updated
* Create Release Email Template (Jonathan)
* Merge 4.2.6-rc (the rc branch) back onto the 4.2.x (masterish branch) - PR or Git Merge
* Enable the npm publish task on the build.
* Label the build Release/426
* Delete the 4.2.6-rc branch
* Check there is a build (Plan name , Plan key make same fx CUR  === SOHO-CUR)
* Enable the publish task for one build.
* Make sure there is branches for 4.3.X and 4.3.0-rc
* Make 4.3.0-rc default branch
* Test Npm packages
* Git Tag
```bash
 git tag 4.2.6
 git push origin --tags
```
* Create new version in Jira
* Generate Release Notes
* Make sure all new examples on the index page are updated
* Update Staging (Below)
* Delete the rs from pool server usalvlhlpool1
```bash
curl -u hookandloop:hookandloop http://usalvlhlpool1/swarm/get_endpoints
curl -X DELETE -H "Content-Type: application/json"     -u hookandloop:n98Y-uhPb-llGa-LdUl     http://usalvlhlpool1.infor.com/swarmproxy/rm_service     -d '{"name":"sohoxi-4-2-6-rc"}'

sudo docker ps -a
docker stop 6410bbcfd5e2
docker rm 6410bbcfd5e2

docker images | grep <name>
docker rmi PID
```
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
* Release Email

# How To Sync SoHo Staging Site to prod

http://craftcms.stackexchange.com/questions/1079/migrating-a-whole-website-between-craft-instances

## Sites
http://usmvvwdev53
smb://usmvvwdev53/c$

http://soho.infor.com
smb://usalvwsoho2/c$

Remote desktop usalvwsoho2 or usmvvwdev53
Login with Infor user/pass, contact Tim if no access

* On local mac pull down branch and run grunt to get the dist folder assets
* On destination server (remote desktop) open http://soho.infor.com/admin and download backup
* On source server (remote desktop) copy the following to zip
  * craft folder except app storage and config/license
* put file on dropbox
* On destination server (remote desktop) restore mysql backup
* Optionally update dest with new js/css to public
* restore the mysql back with
  * mysql -u root -p
  * show databases;
  * drop database soho2;
  * create database soho2;
  * use soho2;
  * run a
* Open wwwroot/craft/templates/footer.html with notepad and bump the version to the latest
* If jquery version changes, then open /inetpub/wwwroot/craft/templates/_layout*.html with notepad and bump jquery version
* Open /inetpub/wwwroot/craft/templates/_layout*.html with notepad and update all query string version numbers. example: `/stylesheets/site.css?v4.2.1`
* Change site locale from http://usmvvwdev53 and https://soho.infor.com

# Tricky Permissions Notes

**NOTE** If you copy in a new version of CraftCMS or of the craft dir, then make sure to check that Users group has Full Control access to /inetpub/wwwroot/craft/storage.

Site error: `C:\inetpub\wwwroot\craft\storage isn't writable by PHP. Please fix that.`

To Confirm Permissions:

* Right click /inetpub/wwwroot/craft/storage and select Properties
* Click Security tab > Advanced
* Confirm that Users(USALVWSOHO2\Users) has Full Control Access
* If not then:
	* Click Change Permissions > Disable inheritance
	* Double-click on Users(USALVWSOHO2\Users)
	* Change Basic permissions: to Full Control and close
	* Visit Site with non-admin user
