## Run locally
```
./index.js <PROGRAM_NAME> <AGR1> <ARG2>
```

## Adding scripts
Scripts added to `scripts` directory will be automatically added to the program

Execution arguments following the program name are passed through to the relevant program:

```
npx ndsh <PROGRAM_NAME> <AGR1> <ARG2>
```
resembles
```
./scripts/<PROGRAM_NAME>.sh <AGR1> <ARG2>
```


## Version management
The version number specify `major`.`minor`.`patch`

Type | Content | Example
---- | ------- | -----------
patch | Internal fix | Bug fix, Performance improvements, tests, small tweaks
minor | Interface change with full backward compatibility | Adding new features, Full backwards compatibility
major | Interface change without full backward compatibility | Changing a function name or interface, Removing a function

## Documentation
New scripts should be also added to [README](./README.md) file
