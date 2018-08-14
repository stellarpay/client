import bip39 from "bip39"
import sjcl from "sjcl"
import StellarBase from "stellar-base"

// Mnemonic entropy values
export const ENTROPY = {
    high: 256,
    medium: 128,
}

// BIP39 language
export const LANGUAGE = {
    EN: "english"
}


// ...
export const genMnemonic = (entropy=ENTROPY.high, language=LANGUAGE.EN) =>
    bip39.generateMnemonic(entropy, undefined, bip39.wordlists[language])


// ...
export const hexSeed = (mnemonic, passphrase="") =>
    bip39.mnemonicToSeedHex(mnemonic, passphrase)


// pathIndex - derivation path pathIndex (i.e. m/44'/148'/pathIndex')
export const keypair = (seed, pathIndex) => {

    const
        seedToMasterNode = (seed) => {
            const hmac = new sjcl.misc.hmac(
                sjcl.codec.utf8String.toBits("ed25519 seed"),
                sjcl.hash.sha512
            ),
                I = hmac.encrypt(seed),
                IL = I.slice(0, 8),
                IR = I.slice(8)
            return { IL: IL, IR: IR }
        },

        derivePath = (initIL, initIR, path) => {
            let index, I, IL = initIL, IR = initIR, pathIndex
            for (pathIndex = 0; pathIndex < path.length; pathIndex++) {
                index = path[pathIndex] + 0x80000000
                const hmac = new sjcl.misc.hmac(IR, sjcl.hash.sha512)
                I = hmac.encrypt(sjcl.bitArray.concat(sjcl.bitArray.concat(
                    sjcl.codec.hex.toBits("0x00"), IL), sjcl.codec.hex.toBits(
                        index.toString(16))))
                IL = I.slice(0, 8)
                IR = I.slice(8)
            }
            return { IL: IL, IR: IR }
        },

        fromBits = (arr, padding, padding_count) => {
            var out, i, ol, tmp, smallest
            padding = padding === undefined ? true : padding
            padding_count = padding_count || 8

            if (arr.length === 0) {
                return new ArrayBuffer(0)
            }

            ol = sjcl.bitArray.bitLength(arr) / 8

            //check to make sure the bitLength is divisible by 8, if it isn't
            //we can't do anything since arraybuffers work with bytes, not bits
            if (sjcl.bitArray.bitLength(arr) % 8 !== 0) {
                throw new Error({
                    name: "Invalid ",
                    message: "Invalid bit size, must be divisble by 8 \
                        to fit in an arraybuffer correctly",
                })
            }

            if (padding && ol % padding_count !== 0) {
                ol += padding_count - (ol % padding_count)
            }


            //padded temp for easy copying
            tmp = new DataView(new ArrayBuffer(arr.length * 4))
            for (i = 0; i < arr.length; i++) {
                //get rid of the higher bits
                tmp.setUint32(i * 4, (arr[i] << 32))
            }

            //now copy the final message if we are not going to 0 pad
            out = new DataView(new ArrayBuffer(ol))

            //save a step when the tmp and out bytelength are ===
            if (out.byteLength === tmp.byteLength) {
                return tmp.buffer
            }

            smallest = tmp.byteLength < out.byteLength ?
                tmp.byteLength : out.byteLength
            for (i = 0; i < smallest; i++) {
                out.setUint8(i, tmp.getUint8(i))
            }


            return out.buffer
        },

        hdAccountFromSeed = function (seed, pathIndex) {
            let masterNode = seedToMasterNode(sjcl.codec.hex.toBits(seed)),
                derivedPath = derivePath(
                    masterNode.IL, masterNode.IR, [44, 148, pathIndex]
                )

            return StellarBase.Keypair.fromRawEd25519Seed(
                fromBits(derivedPath.IL)
            )
        }

        return hdAccountFromSeed(seed, pathIndex)
}


// ...
export const random = (language=LANGUAGE.EN, passphrase="", pathIndex=0) => {
    const mnemonic = genMnemonic(undefined, language)
    const seed = hexSeed(mnemonic, passphrase)
    const keys = keypair(seed, pathIndex)
    return {
        mnemonic,
        seed,
        keypair: keys,
        publicKey: keys.publicKey(),
        secret: keys.secret()
    }
}
