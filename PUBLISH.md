# Publish instructions

## Prerequisites
To be able to publish to [npm.infor.com](http://npm.infor.com:4873) you need to add an authorized npm user on your system.

```bash
npm adduser --registry http://npm.infor.com:4873 --scope=@infor
```
The username is admin and password is Ap5T7IPF2o, use your regular email address.

## Checklist

* Decide on which version number the release have. The [semver standard](http://semver.org/) is used for this purpose.
* Update package.json version and README to reflect that version.
* Create a git tag named _vX.X.X_, with the correct version number.

```bash
git tag 4.0.7
```

* Checkout the tag

```bash
git checkout vX.X.X
```
* Publish to [npm.infor.com](http://npm.infor.com:4873)

```bash
npm publish
```

* Write release notes

* Anounce the new version to the community
