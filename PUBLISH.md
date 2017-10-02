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

# How To Make Release (4.3.2)

## Info
* Check ChangeLog.md is updated this info is distributed by email
* Create new version in Jira and mark current as released https://jira/plugins/servlet/project-config/SOHO/versions
* Generate Release Notes http://bit.ly/2w6X8Xw

## Git Operations
* Edit version in package.json and publish package.json (from 4.3.2-rc to 4.3.2 as an example)
* Push a PR
* Check for Last PR's http://git.infor.com/projects/SOHO/repos/angular-components/pull-requests and http://git.infor.com/projects/SOHO/repos/controls/pull-requests and make sure all merged
* Merge  4.3.2-rc (the rc branch) back onto the 4.3.x (masterish branch) - Using a PR or Git Merge
* Git Tag the release from the 4.3.x branch
```bash
 git tag 4.3.2
 git push origin --tags
```
* Make the new branch off 4.3.x for the new version (4.3.3-rc)
  * In git http://git.infor.com/projects/SOHO/repos/controls/settings set the 4.3.3-rc branch as the default
  * set branch permissions
* Delete the 4.3.2-rc branch and all feature/bug fix branches http://git.infor.com/projects/SOHO/repos/controls/branches


## Build Operations
* Change the v-Next build http://bamboo.infor.com/chain/admin/config/editChainDetails.action?buildKey=SOHO-NEXT
  * change the name to 4.3.3-RC (Version Next)
  * change the repo it points to
  * checkout 4.3.3-rc and bump the versions in package.json and publish/package.json
* Change the current build http://bamboo.infor.com/build/admin/edit/editBuildTasks.action?buildKey=SOHO-R43X-JOB1
  * change the versions in the build config
  * Label the build release-432 for example http://bamboo.infor.com/browse/label/release-432

## Update version in @infor/sohoxi-angular
* Repeat Git Operations on ssh://git@git.infor.com:7999/soho/angular-components.git
* Bump version in package.json and publish/package.json
* Commit, tag and push changes
* Update the build to the next release
* Test
```bash
npm info @infor/sohoxi-angular dist-tags
```

## Test Out Operations
* Test Npm packages and rebuild if you got it wrong
git chec
npm view @infor/sohoxi versions
* Test New and old links for example:
http://usalvlhlpool1.infor.com/4.3.2/components/
http://usalvlhlpool1.infor.com/4.3.3-rc/components/

## Deploy Site Operations

* Delete the old version from pool server usalvlhlpool1
```bash
curl -u hookandloop:hookandloop http://usalvlhlpool1/swarm/get_endpoints
curl -X DELETE -H "Content-Type: application/json"     -u hookandloop:n98Y-uhPb-llGa-LdUl     http://usalvlhlpool1.infor.com/swarmproxy/rm_service     -d '{"name":"sohoxi-4-3-1-rc"}'

sudo docker ps -a
docker stop 6410bbcfd5e2
docker rm 6410bbcfd5e2

docker images | grep <name>
docker rmi PID
```

## Notify
- On Slack, MS Teams, And Dev's by Email ect.
- Partners: Jeff Shoneman (PMA) <jeff@projectmanagementassociates.com>

# How To Sync SoHo Staging Site to prod

http://craftcms.stackexchange.com/questions/1079/migrating-a-whole-website-between-craft-instances

## Test Sites
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
