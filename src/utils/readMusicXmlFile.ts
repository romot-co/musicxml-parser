import { promises as fs } from "fs";
import * as zlib from "zlib";

async function extractMusicXmlEntry(filePath: string): Promise<Buffer> {
  const buf = await fs.readFile(filePath);
  const eocd = buf.lastIndexOf(Buffer.from("PK\x05\x06"));
  if (eocd === -1) throw new Error("Invalid zip archive");
  const cdOffset = buf.readUInt32LE(eocd + 16);
  let ptr = cdOffset;
  while (ptr < eocd) {
    if (buf.readUInt32LE(ptr) !== 0x02014b50) break;
    const compMethod = buf.readUInt16LE(ptr + 10);
    const compSize = buf.readUInt32LE(ptr + 20);
    const fileNameLen = buf.readUInt16LE(ptr + 28);
    const extraLen = buf.readUInt16LE(ptr + 30);
    const commentLen = buf.readUInt16LE(ptr + 32);
    const localOffset = buf.readUInt32LE(ptr + 42);
    const name = buf
      .slice(ptr + 46, ptr + 46 + fileNameLen)
      .toString("utf8");
    ptr += 46 + fileNameLen + extraLen + commentLen;
    if (name.toLowerCase().endsWith(".musicxml")) {
      if (buf.readUInt32LE(localOffset) !== 0x04034b50) {
        throw new Error("Invalid local header");
      }
      const lhNameLen = buf.readUInt16LE(localOffset + 26);
      const lhExtraLen = buf.readUInt16LE(localOffset + 28);
      const dataStart = localOffset + 30 + lhNameLen + lhExtraLen;
      const compressed = buf.slice(dataStart, dataStart + compSize);
      if (compMethod === 0) return compressed;
      if (compMethod === 8) return zlib.inflateRawSync(compressed);
      throw new Error("Unsupported compression method");
    }
  }
  throw new Error(`No .musicxml entry found in ${filePath}`);
}

/**
 * Read a MusicXML or MXL file and return its XML contents as a UTF-8 string.
 * The function checks the XML prolog for an encoding declaration and converts
 * UTF-16 files to UTF-8.
 *
 * For `.mxl` archives this implementation extracts the first `*.musicxml`
 * entry directly using Node.js and does not require the external `unzip`
 * command.
 */
export async function readMusicXmlFile(filePath: string): Promise<string> {
  let data: Buffer;

  if (filePath.toLowerCase().endsWith(".mxl")) {
    data = await extractMusicXmlEntry(filePath);
  } else {
    data = await fs.readFile(filePath);
  }

  let encoding = "UTF-8";
  if (data.length >= 2) {
    const b0 = data[0];
    const b1 = data[1];
    if (b0 === 0xfe && b1 === 0xff) {
      encoding = "UTF-16BE";
    } else if (b0 === 0xff && b1 === 0xfe) {
      encoding = "UTF-16LE";
    } else if (
      data.length >= 3 &&
      b0 === 0xef &&
      b1 === 0xbb &&
      data[2] === 0xbf
    ) {
      encoding = "UTF-8";
    }
  }
  const prolog = data.slice(0, 100).toString("ascii").replace(/\0/g, "");
  const encMatch = prolog.match(/encoding=\"([^\"]+)\"/i);
  if (encMatch) {
    const declared = encMatch[1].toUpperCase();
    if (declared !== "UTF-16") {
      encoding = declared;
    }
    // if declared is UTF-16, prefer BOM-detected endianness
  }

  let xml: string;
  if (encoding === "UTF-16" || encoding === "UTF-16LE") {
    xml = data.toString("utf16le");
  } else if (encoding === "UTF-16BE") {
    const swapped = Buffer.allocUnsafe(data.length);
    for (let i = 0; i < data.length; i += 2) {
      swapped[i] = data[i + 1];
      swapped[i + 1] = data[i];
    }
    xml = swapped.toString("utf16le");
  } else {
    xml = data.toString("utf8");
  }

  if (xml.charCodeAt(0) === 0xfeff) {
    xml = xml.slice(1);
  }
  return xml;
}
