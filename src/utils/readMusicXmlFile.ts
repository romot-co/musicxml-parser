import { promises as fs } from "fs";
import * as zlib from "zlib";

async function extractMusicXmlEntry(filePath: string): Promise<Buffer> {
  const buf = await fs.readFile(filePath);
  const eocd = buf.lastIndexOf(Buffer.from("PK\x05\x06"));
  if (eocd === -1) throw new Error("Invalid zip archive");
  const cdOffset = buf.readUInt32LE(eocd + 16);
  let ptr = cdOffset;
  const entries: Record<string, { cm: number; cs: number; off: number }> = {};
  while (ptr < eocd) {
    if (buf.readUInt32LE(ptr) !== 0x02014b50) break;
    const compMethod = buf.readUInt16LE(ptr + 10);
    const compSize = buf.readUInt32LE(ptr + 20);
    const fileNameLen = buf.readUInt16LE(ptr + 28);
    const extraLen = buf.readUInt16LE(ptr + 30);
    const commentLen = buf.readUInt16LE(ptr + 32);
    const localOffset = buf.readUInt32LE(ptr + 42);
    const name = buf.slice(ptr + 46, ptr + 46 + fileNameLen).toString("utf8");
    ptr += 46 + fileNameLen + extraLen + commentLen;
    entries[name] = { cm: compMethod, cs: compSize, off: localOffset };
  }

  const target = Object.keys(entries).find(
    (n) => n.toLowerCase() === "meta-inf/container.xml",
  );
  let musicPath: string | undefined;
  if (target) {
    const entry = entries[target];
    const data = readEntry(buf, entry);
    const text = data.toString("utf8");
    const match = text.match(/full-path=\"([^\"]+)\"/);
    if (match) musicPath = match[1];
  }
  if (!musicPath) {
    musicPath = Object.keys(entries).find((n) =>
      n.toLowerCase().endsWith(".musicxml"),
    );
  }
  if (!musicPath) throw new Error(`No .musicxml entry found in ${filePath}`);
  const entry = entries[musicPath];
  return readEntry(buf, entry);

  function readEntry(
    buffer: Buffer,
    info: { cm: number; cs: number; off: number },
  ): Buffer {
    if (buffer.readUInt32LE(info.off) !== 0x04034b50)
      throw new Error("Invalid local header");
    const lhNameLen = buffer.readUInt16LE(info.off + 26);
    const lhExtraLen = buffer.readUInt16LE(info.off + 28);
    const dataStart = info.off + 30 + lhNameLen + lhExtraLen;
    const compressed = buffer.slice(dataStart, dataStart + info.cs);
    if (info.cm === 0) return compressed;
    if (info.cm === 8) return zlib.inflateRawSync(compressed);
    throw new Error("Unsupported compression method");
  }
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
  // 末尾の空白を削除する
  return xml.trim();
}
