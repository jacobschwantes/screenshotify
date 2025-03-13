import CRC32 from "crc-32";

const generateHash = (stringToHash) => {
    return (CRC32.bstr(stringToHash) >>>0).toString(16)
}
export default generateHash

