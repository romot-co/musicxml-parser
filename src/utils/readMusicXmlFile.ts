import { promises as fs } from "fs";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

/**
 * Read a MusicXML or MXL file and return its XML contents as a UTF-8 string.
 * The function checks the XML prolog for an encoding declaration and converts
 * UTF-16 files to UTF-8.
 *
 * For `.mxl` archives this implementation relies on the system `unzip` command
 * to extract the first `*.musicxml` entry.
 */
export async function readMusicXmlFile(filePath: string): Promise<string> {
  let data: Buffer;

  if (filePath.toLowerCase().endsWith(".mxl")) {
    try {
      const { stdout } = await execFileAsync(
        "unzip",
        ["-p", filePath, "*.musicxml"],
        { maxBuffer: 10 * 1024 * 1024, encoding: "buffer" },
      );
      data = stdout as Buffer;
    } catch (err) {
      const message =
        (err as NodeJS.ErrnoException)?.code === "ENOENT"
          ?
              "The 'unzip' command is required to read MXL files. Please install it or provide a compatible environment."
          : `Failed to extract ${filePath}: ${(err as Error).message}`;
      throw new Error(message);
    }
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
