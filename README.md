# ndsh [![NPM version](https://img.shields.io/npm/v/ndsh.svg)](https://www.npmjs.com/package/ndsh)

## NPX runner for automatic publishing scripts

```
npx ndsh <SCRIPT> [arguments...]
```

## Available scripts
### has-prefix
```
npx ndsh has-prefix <PREFIX>
```
Checks the package name starts with the given argument. Useful for org owned modules (`npx ndsh has-prefix @my-org/`).

### Info
```
npx ndsh info
```
Prints some info about the Git repo and NPM module (A demonstration script)

### Publish to NPM
```
npx ndsh publish [testing]
```
Deprecated, use [published](https://fiverr.github.io/published/)

Passing 'testing' string will result in an echo of the operation only

### Create Git tag
```
npx ndsh tag
```
Create a Git tag, by the package version, with a message by the latest commit message


### Verify NPM User
```
npx ndsh verify <USERNAME>
```
Verify against NPM that the logged in user is the one specified by the argument. Exits (1) on mismatch
