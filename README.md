# MusicXML Parser

A TypeScript library for parsing MusicXML files into a structured JavaScript object. This parser is designed with type safety in mind, utilizing Zod schemas to validate the MusicXML structure and infer TypeScript types.

The primary goal is to provide a robust foundation for applications that need to read, process, and potentially convert MusicXML data in web front-end environments (e.g., for further transformation into formats like Tone.js sequences, MIDI, MusicJSON, or YAML).

## Current Status

This project currently supports a significant subset of the **MusicXML 3.1** specification and is under active development.

**Implemented Features:**
*   Parses MusicXML strings into a DOM Document. In Node.js, the parser dynamically loads `jsdom` if `DOMParser` is missing.
*   Provides asynchronous `parseMusicXml` and synchronous `parseMusicXmlSync` APIs.
*   Defines Zod schemas for a broad set of MusicXML elements, including:
    *   `<pitch>`, `<rest>`, and `<note>`
    *   `<measure>` with fully modeled `<attributes>`
    *   `<direction>`, `<barline>`, `<harmony>` and other common measure children
    *   `<part>`, `<score-part>` and `<part-list>`
    *   `<score-partwise>` (root element)
*   Maps the parsed DOM structure to a typed JavaScript object (`ScorePartwise`) according to the defined Zod schemas.
*   Validates the mapped object against the Zod schemas at each step of the mapping process.
*   Basic unit tests for the core parsing and mapping logic.
*   Reads `.mxl` archives directly using Node.js—no external `unzip` command is required.
*   Conversion utilities for JSON, YAML, Tone.js sequences, MIDI-like data, and MusicXML serialization.

**Design Choices:**
*   **DOM-based Parsing:** Utilizes `DOMParser` in browsers and loads `jsdom` on demand in Node.js to build a Document Object Model from the MusicXML string. This approach was chosen for its suitability for both transformation and potential future editing capabilities, offering easier random access and manipulation of the XML structure compared to SAX-based parsing.
*   **Zod for Schema Definition and Validation:** Zod provides strong type safety by inferring TypeScript types directly from schemas and enabling robust runtime validation. This ensures data integrity and improves developer experience.
*   **Structured Intermediate Representation:** The parser outputs a JavaScript object that closely mirrors the MusicXML `<score-partwise>` structure, making it intuitive to work with.

## Installation

```bash
npm install your-musicxml-parser-package-name # Replace with actual package name once published
```

For Node.js environments, install `jsdom` (or another DOM implementation) so that `parseMusicXmlString` can create a `DOMParser` when one is not provided by the runtime. A synchronous variant `parseMusicXmlStringSync` is also available when `DOMParser` can be loaded synchronously.

## Usage

The main parsing functionality is exposed through the `parseMusicXmlString` and `mapDocumentToScorePartwise` functions. A convenience wrapper `parseMusicXml` combines these steps. Because `parseMusicXmlString` may dynamically load `jsdom` in Node.js, it is asynchronous and returns a `Promise<Document | null>`.

```typescript
import { parseMusicXml, ScorePartwise, Note } from 'your-musicxml-parser-package-name'; // Adjust import path

const musicXmlString = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="4.0">
  <part-list>
    <score-part id="P1">
      <part-name>Test Part</part-name>
    </score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <note>
        <pitch>
          <step>C</step>
          <octave>4</octave>
        </pitch>
        <duration>4</duration>
        <type>whole</type>
      </note>
    </measure>
</part>
</score-partwise>`;

async function run() {
  // Parse and map in one step
  const score: ScorePartwise | null = await parseMusicXml(musicXmlString);

  if (!score) {
    console.error("Failed to map Document to ScorePartwise object.");
    return;
  }

  console.log("Successfully parsed MusicXML!");
  console.log("Version:", score.version);
  console.log("First part ID:", score.parts[0]?.id);

  const measure = score.parts[0]?.measures[0];
  const notes = measure?.content?.filter(
    (item): item is Note => (item as any)._type === "note",
  );
  console.log(
    "First note in first measure of first part:",
    notes?.[0],
  );
  // You can now work with the typed 'score' object
}

run().catch((e) => console.error(e));
```

### Conversion Utilities

Once you have a `ScorePartwise` object you can convert it into other formats:

```typescript
import {
  toMusicJson,
  toYaml,
  toToneJsSequence,
  toMidi,
  toMusicXML,
} from 'your-musicxml-parser-package-name';

const json = toMusicJson(score);
const yamlString = toYaml(score);
const xmlString = toMusicXML(score);
const toneSeq = toToneJsSequence(score);
const midi = toMidi(score);
```

## Project Structure

*   `src/`: Source code
    *   `parser/`: XML parsing and DOM-to-object mapping logic (`xmlParser.ts`, `mappers.ts`).
    *   `schemas/`: Zod schema definitions for MusicXML elements.
    *   `types/`: TypeScript type definitions (largely inferred from Zod schemas).
    *   `index.ts`: Main entry point exporting public API.
*   `tests/`: Unit tests (using Vitest).
*   `dist/`: Compiled JavaScript output.
*   `reference/`: Reference materials including the MusicXML 4.0 specification and example scores.
    *   `xmlsamples/` contains sample MusicXML files from the official MusicXML 4.0 distribution (see <https://github.com/w3c/musicxml> for the source). Copyright notices within those files remain in effect.

## Development

**Prerequisites:**
*   Node.js (v16 or higher recommended)
*   npm

**Setup:**
1.  Clone the repository.
2.  Install dependencies: `npm install`

**Scripts:**
*   `npm run build`: Compile TypeScript to JavaScript.
*   `npm run lint`: Lint the codebase using ESLint.
*   `npm run format`: Format code using Prettier.
*   `npm run test`: Run unit tests with Vitest.
*   `npm run test:watch`: Run unit tests in watch mode.

## Future

*   **Planned Improvements**
    *   Continue expanding schema and mapper coverage toward full MusicXML 3.1 compliance.
    *   Improve conversion utilities and add round-trip tests.
    *   Optimize performance and extend error reporting.
    *   Explore MusicXML 4.0 features such as SMuFL support.
    *   Grow the automated test suite and generate API documentation.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.
(Further contribution guidelines to be added).

## License

MIT
