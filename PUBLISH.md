# Dev Ops / Publishing Tasks and Notes

## Link the Private npm Registry
To be able to publish to [npm.infor.com](http://npm.infor.com:4873) you need to add an authorized npm user on your system...

```bash
npm adduser --registry http://npm.infor.com:4873 --scope=@infor
npm set registry http://registry.npmjs.org
```

The verdaccio username is admin and password is Ap5T7IPF2o, use your regular email address.


## Check Published npm Tags

```bash
npm info @infor/sohoxi dist-tags
npm view @infor/sohoxi versions
```

## Delete a npm Tag

```bash
npm adduser --registry http://npm.infor.com:4873 --scope=@infor
npm dist-tag rm @infor/sohoxi develop
```

## Merge a fix to a branch

```bash
git checkout release/4.2.0
git cherry-pick 802b102fda5420a0f714d9d0efa5eff635fe77d9 //from http://git.infor.com/projects/SOHO/repos/controls/commits
git push
git checkout master
```

## Set tools for AWS Publish

- Also install AWS for testing and configuring http://docs.aws.amazon.com/cli/latest/userguide/installing.html
- Once installed run aws configure to enter the keys in the right spot http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html

# Steps for Cutting a Release

## Documentation
* Check ChangeLog.md is updated
* Create new version in Jira and mark current as released https://jira/plugins/servlet/project-config/SOHO/versions
* Generate Release Notes http://bit.ly/2w6X8Xw

## Git Operations
* Edit version in package.json and publish package.json (from 4.5.0-rc to 4.5.0 as an example)
* Push a PR
* Check for Last PR's http://git.infor.com/projects/SOHO/repos/angular-components/pull-requests and http://git.infor.com/projects/SOHO/repos/controls/pull-requests and make sure all merged
* Merge  4.5.0-rc (the rc branch) back onto the 4.5.x (masterish branch) - Using a PR
* Git Tag the release from the 4.5.x branch
```bash
 git tag 4.5.0
 git push origin --tags
```
* Make the new branch off 4.5.x for the new version (4.6.0-rc)
  * In git http://git.infor.com/projects/SOHO/repos/controls/settings set the 4.6.0-rc branch as the default
  * set branch permissions
* Delete the 4.5.0-rc branch and all feature/bug fix branches http://git.infor.com/projects/SOHO/repos/controls/branches

## Build Operations
* Change the v-Next build http://bamboo.infor.com/chain/admin/config/editChainDetails.action?buildKey=SOHO-NEXT
  * change the name to 4.6.0-RC (Version Next)
  * change the repo it points to
  * checkout 4.6.0-rc and bump the versions in package.json and publish/package.json
* Change the current build http://bamboo.infor.com/build/admin/edit/editBuildTasks.action?buildKey=SOHO-R43X-JOB1
  * change the versions in the build config
  * Label the build release-440 for example http://bamboo.infor.com/browse/label/release-440

## Update version in @infor/sohoxi-angular
* Repeat Git Operations on ssh://git@git.infor.com:7999/soho/angular-components.git
* Edit version in package.json and publish package.json (2) places
* Check for Last PR's http://git.infor.com/projects/SOHO/repos/angular-components/pull-requests and merge
* Merge 4.5.0-rc (the rc branch) back onto the 4.5.x (masterish branch) - Using a PR or Git Merge
* Git Tag the release from the 4.5.x branch
```bash
 git tag 4.5.0
 git push origin --tags
```
* Make the new branch off 4.5.x for the new version (4.6.0-rc)
  * In git http://git.infor.com/projects/SOHO/repos/controls/settings set the 4.6.0-rc branch as the default
  * set branch permissions
* Delete the 4.5.0-rc branch and all feature/bug fix branches http://git.infor.com/projects/SOHO/repos/controls/branches
* Update the build to the next release


## Test Out Stuff
* Test Npm packages and rebuild if you got it wrong
```
npm view @infor/sohoxi versions
npm view @infor/sohoxi-angular versions

npm info @infor/sohoxi-angular dist-tags
npm info @infor/sohoxi dist-tags

```

* Test New and old links for example:
http://usalvlhlpool1.infor.com/4.5.0/components/
http://usalvlhlpool1.infor.com/4.6.0-rc/components/

You may have to run this for new sites

```
curl -X POST -u hookandloop:hookandloop http://usalvlhlpool1/swarm/update_config
```


## Deploy Site Operations

* Delete the old version from pool server usalvlhlpool1
```bash
curl -u hookandloop:hookandloop http://usalvlhlpool1/swarm/get_endpoints
curl -X DELETE -H "Content-Type: application/json"     -u hookandloop:n98Y-uhPb-llGa-LdUl     http://usalvlhlpool1.infor.com/swarmproxy/rm_service     -d '{"name":"sohoxi-4-3-3-rc"}'

sudo docker ps -a
docker stop 6410bbcfd5e2
docker rm 6410bbcfd5e2

docker images | grep <name>
docker rmi PID
```

## Deploy to AWS

```bash
AWS_PROFILE=sohoxi directory-to-s3 -d publish infor-devops-core-soho-us-east-1/sohoxi/4.3.3 -v
```
