const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const { groth16, plonk } = require("snarkjs");

function unstringifyBigInts(o) {
    if ((typeof(o) == "string") && (/^[0-9]+$/.test(o) ))  {
        return BigInt(o);
    } else if ((typeof(o) == "string") && (/^0x[0-9a-fA-F]+$/.test(o) ))  {
        return BigInt(o);
    } else if (Array.isArray(o)) {
        return o.map(unstringifyBigInts);
    } else if (typeof o == "object") {
        if (o===null) return null;
        const res = {};
        const keys = Object.keys(o);
        keys.forEach( (k) => {
            res[k] = unstringifyBigInts(o[k]);
        });
        return res;
    } else {
        return o;
    }
}

describe("HelloWorld", function () {
    let Verifier;
    let verifier;

    beforeEach(async function () {
        Verifier = await ethers.getContractFactory("HelloWorldVerifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] Add comments to explain what each line is doing

        // Generates a proof and calculates witness
        const { proof, publicSignals } = await groth16.fullProve({"a":"1","b":"2"}, "contracts/circuits/HelloWorld/HelloWorld_js/HelloWorld.wasm","contracts/circuits/HelloWorld/circuit_final.zkey");

        // Logs the output signal c that holds the product of the two input signals a and b
        console.log('1x2 =',publicSignals[0]);

        // Converts any public signals to BigInt native JS objects because signals and proofs
        // originally come as strings. BigInts are capable of holding integers bigger than 2^53
        const editedPublicSignals = unstringifyBigInts(publicSignals);
        // Converts proof data to BigInt
        const editedProof = unstringifyBigInts(proof);

        // Convert proof and public signals BigInts to hexadecimal and make them fit
        // the calldata format of the generated Solidity verifier
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);

        // Removes square brackets, spaces and quotation marks from the solidity calldata string
        // and returns an array of the calldata parameters as strings in an arguments list
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());
    
        // Pick the a, b and c proof data from the arguments list
        const a = [argv[0], argv[1]];
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        const c = [argv[6], argv[7]];
        // Pick the public signals data from the arguments list
        const Input = argv.slice(8);

        // Submit prepared data to the deployed HelloWorldVerifier smart contract
        // and checks if the returned result is true
        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});


describe("Multiplier3 with Groth16", function () {
    let Verifier;
    let verifier;

    beforeEach(async function () {
        Verifier = await ethers.getContractFactory("Multiplier3Verifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        // Generates a proof and calculates witness
        const { proof, publicSignals } = await groth16.fullProve({"a":"1","b":"2", "c":"3"}, "contracts/circuits/Multiplier3/Multiplier3_js/Multiplier3.wasm","contracts/circuits/Multiplier3/circuit_final.zkey");

        // Logs the output signal d that holds the product of the two input signals a, b and c
        console.log('1x2x3=',publicSignals[0]);

        // Converts any public signals to BigInt native JS objects because signals and proofs
        // originally come as strings. BigInts are capable of holding integers bigger than 2^53
        const editedPublicSignals = unstringifyBigInts(publicSignals);
        // Converts proof data to BigInt
        const editedProof = unstringifyBigInts(proof);

        // Convert proof and public signals BigInts to hexadecimal and make them fit
        // the calldata format of the generated Solidity verifier
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);

        // Removes square brackets, spaces and quotation marks from the solidity calldata string
        // and returns an array of the calldata parameters as strings in an arguments list
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());
    
        // Pick the a, b and c proof data from the arguments list
        const a = [argv[0], argv[1]];
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        const c = [argv[6], argv[7]];
        // Pick the public signals data from the arguments list
        const Input = argv.slice(8);

        // Submit prepared data to the deployed HelloWorldVerifier smart contract
        // and checks if the returned result is true
        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});


describe("Multiplier3 with PLONK", function () {
    let Verifier;
    let verifier;

    beforeEach(async function () {
        Verifier = await ethers.getContractFactory("_plonkMultiplier3Verifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        // Generates a proof and calculates witness
        const { proof, publicSignals } = await plonk.fullProve({"a":"1","b":"2", "c":"4"}, "contracts/circuits/_plonkMultiplier3/Multiplier3_js/Multiplier3.wasm","contracts/circuits/_plonkMultiplier3/circuit_final.zkey");

        // Logs the output signal d that holds the product of the two input signals a, b and c
        console.log('1x2x4=',publicSignals[0]);

        // Converts any public signals to BigInt native JS objects because signals and proofs
        // originally come as strings. BigInts are capable of holding integers bigger than 2^53
        const editedPublicSignals = unstringifyBigInts(publicSignals);
        // Converts proof data to BigInt
        const editedProof = unstringifyBigInts(proof);

        // Convert proof and public signals BigInts to hexadecimal and make them fit
        // the calldata format of the generated Solidity verifier
        const calldata = await plonk.exportSolidityCallData(editedProof, editedPublicSignals);

        // Removes square brackets, spaces and quotation marks from the solidity calldata string
        // and returns an array of the calldata parameters as strings in an arguments list
        // const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());
        const argv = calldata.split(',');

        // Submit prepared data to the deployed HelloWorldVerifier smart contract
        // and checks if the returned result is true
        expect(await verifier.verifyProof(argv[0], JSON.parse(argv[1]))).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        let a = '0x00';
        let b = ['0'];
        expect(await verifier.verifyProof(a, b)).to.be.false;
        
    });
});
