const fs = require("fs");
const solidityRegex = /pragma solidity \^\d+\.\d+\.\d+/

const verifierRegex = /contract Verifier/

let content = fs.readFileSync("./contracts/HelloWorldVerifier.sol", { encoding: 'utf-8' });
let bumped = content.replace(solidityRegex, 'pragma solidity ^0.8.0');
bumped = bumped.replace(verifierRegex, 'contract HelloWorldVerifier');

fs.writeFileSync("./contracts/HelloWorldVerifier.sol", bumped);

// [assignment] add your own scripts below to modify the other verifier contracts you will build during the assignment

function bumpGroth16Version({ filename }) {
  const content = fs.readFileSync(`./contracts/${filename}.sol`, { encoding: 'utf-8' });
  const bumped = content
    .replace(solidityRegex, 'pragma solidity ^0.8.0')
    .replace(verifierRegex, `contract ${filename}`);

  fs.writeFileSync(`./contracts/${filename}.sol`, bumped);
}

bumpGroth16Version({ filename: 'Multiplier3Verifier' });

function fixPlonkContractName({ filename }) {
  const content = fs.readFileSync(`./contracts/${filename}.sol`, { encoding: 'utf-8' });
  const fixed = content.replace(/contract PlonkVerifier/, `contract ${filename}`);

  fs.writeFileSync(`./contracts/${filename}.sol`, fixed);
}

fixPlonkContractName({ filename: '_plonkMultiplier3Verifier' })
