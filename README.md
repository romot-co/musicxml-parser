# MusicXML Parser

A TypeScript library for parsing MusicXML files into a structured JavaScript object. This parser is designed with type safety in mind, utilizing Zod schemas to validate the MusicXML structure and infer TypeScript types.

The primary goal is to provide a robust foundation for applications that need to read, process, and potentially convert MusicXML data in web front-end environments (e.g., for further transformation into formats like Tone.js sequences, MIDI, MusicJSON, or YAML).

## Current Status

This project is currently in **Phase 1: Core Parsing Functionality**.

**Implemented Features:**
*   Parses MusicXML strings into a DOM Document (primarily for browser environments, with `jsdom` for Node.js testing).
*   Defines Zod schemas for core MusicXML elements:
    *   `<pitch>`
    *   `<rest>`
    *   `<note>` (handles both pitched notes and rests)
    *   `<measure>` (including a placeholder for `<attributes>`)
    *   `<part>`
    *   `<score-part>` (from `<part-list>`)
    *   `<part-list>`
    *   `<score-partwise>` (root element)
*   Maps the parsed DOM structure to a typed JavaScript object (`ScorePartwise`) according to the defined Zod schemas.
*   Validates the mapped object against the Zod schemas at each step of the mapping process.
*   Basic unit tests for the core parsing and mapping logic.

**Design Choices:**
*   **DOM-based Parsing:** Utilizes `DOMParser` (or `jsdom` in Node.js) to build a Document Object Model from the MusicXML string. This approach was chosen for its suitability for both transformation and potential future editing capabilities, offering easier random access and manipulation of the XML structure compared to SAX-based parsing.
*   **Zod for Schema Definition and Validation:** Zod provides strong type safety by inferring TypeScript types directly from schemas and enabling robust runtime validation. This ensures data integrity and improves developer experience.
*   **Structured Intermediate Representation:** The parser outputs a JavaScript object that closely mirrors the MusicXML `<score-partwise>` structure, making it intuitive to work with.

## Installation

```bash
npm install your-musicxml-parser-package-name # Replace with actual package name once published
```

## Usage

The main parsing functionality is exposed through the `parseMusicXmlString` and `mapDocumentToScorePartwise` functions.

```typescript
import { parseMusicXmlString, mapDocumentToScorePartwise, ScorePartwise } from 'your-musicxml-parser-package-name'; // Adjust import path

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

// 1. Parse the XML string into a DOM Document
const doc = parseMusicXmlString(musicXmlString);

if (doc) {
  // 2. Map the DOM Document to the ScorePartwise JavaScript object
  const score: ScorePartwise | null = mapDocumentToScorePartwise(doc);

  if (score) {
    console.log("Successfully parsed MusicXML!");
    console.log("Version:", score.version);
    console.log("First part ID:", score.parts[0]?.id);
    console.log("First note in first measure of first part:", score.parts[0]?.measures[0]?.notes[0]);
    // You can now work with the typed 'score' object
  } else {
    console.error("Failed to map Document to ScorePartwise object.");
  }
} else {
  console.error("Failed to parse MusicXML string.");
}
```

## Project Structure

*   `src/`: Source code
    *   `parser/`: XML parsing and DOM-to-object mapping logic (`xmlParser.ts`, `mappers.ts`).
    *   `schemas/`: Zod schema definitions for MusicXML elements.
    *   `types/`: TypeScript type definitions (largely inferred from Zod schemas).
    *   `index.ts`: Main entry point экспортирующий public API.
*   `tests/`: Unit tests (using Jest).
*   `dist/`: Compiled JavaScript output.

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
*   `npm run test`: Run unit tests with Jest.
*   `npm run test:watch`: Run unit tests in watch mode.

## Future

*   **Phase 2: Detailed Schema Implementation & Advanced Mapping:**
    *   Implement detailed Zod schemas for `<attributes>` (key signature, time signature, clef, divisions, etc.).
    *   Map more MusicXML elements within `<note>` (e.g., `<stem>`, `<notations>`, `<lyric>`).
    *   Map more MusicXML elements within `<measure>` (e.g., `<barline>`, `<direction>`, `<harmony>`).
    *   Implement mappers for other top-level metadata elements (`<work>`, `<identification>`, `<defaults>`, `<credit>`).
    *   Support for `<score-timewise>` if necessary.
*   **Phase 3: Conversion Utilities:**
    *   Implement `toMusicJson()`: Convert the `ScorePartwise` object to a JSON string.
    *   Implement `toYaml()`: Convert to YAML string (using `js-yaml` or similar).
    *   Investigate and implement `toToneJsSequence()`: Convert to a format suitable for Tone.js.
    *   Investigate and implement `toMidi()`: Convert to MIDI format (potentially using libraries like `tonejs/Midi` or `midiconvert`).
*   **Phase 4: Enhancements & Optimizations:**
    *   Performance profiling and optimization for large MusicXML files.
    *   Error handling improvements and configurable logging.
    *   Support for MusicXML 4.0 features (e.g., SMuFL).
    *   More comprehensive test suite with a wider range of MusicXML files.
    *   Documentation generation (e.g., TypeDoc).

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.
(Further contribution guidelines to be added).

## License

MIT
