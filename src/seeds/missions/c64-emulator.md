# Mission

A JavaScript Commodore 64 emulator capable of running the classic game "The Lords of Midnight" (1984, Mike Singleton).

## Architecture

The emulator is structured as layered components, each independently testable:

1. **MOS 6510 CPU** — the core processor (6502 variant with I/O port at $00/$01)
2. **Memory subsystem** — 64KB RAM, ROM banking (BASIC, KERNAL, character ROM), I/O area ($D000–$DFFF)
3. **VIC-II video** — text mode (40x25), bitmap mode, sprites, raster interrupt timing
4. **SID sound** — 3-voice synthesiser with ADSR envelopes (basic waveform generation)
5. **CIA timers** — two CIA chips for keyboard scanning, timer interrupts, and joystick input
6. **Input** — keyboard matrix and joystick mapped to browser events
7. **PRG/TAP loader** — load `.prg` files (and optionally `.tap` tape images) into memory

## Core Functions

Export all from `src/lib/main.js`:

- `createC64(opts?)` — create an emulator instance with default ROMs and 64KB RAM. Returns an object with `cpu`, `memory`, `vic`, `sid`, `cia1`, `cia2` subsystems.
- `loadPRG(c64, data)` — load a `.prg` file (Uint8Array) into memory at the address specified in its two-byte header.
- `step(c64)` — execute one CPU instruction, advance cycle count, and update timers. Returns the new state.
- `runFrame(c64)` — execute instructions for one video frame (~19656 cycles PAL). Trigger raster interrupts at the appropriate scanlines. Returns the framebuffer.
- `getFramebuffer(c64)` — return the current screen as a Uint8Array RGBA pixel buffer (320x200 or 384x272 with borders).
- `pressKey(c64, key)` / `releaseKey(c64, key)` — simulate keyboard input via CIA1 keyboard matrix.
- `joystickInput(c64, port, directions)` — set joystick state (up/down/left/right/fire) on port 1 or 2.
- `reset(c64)` — perform a hardware reset (set CPU to reset vector, clear state).

## CPU Requirements

- All official 6502 opcodes (56 instructions, 151 opcode variants) with correct cycle counts.
- Decimal mode (BCD arithmetic) support.
- IRQ and NMI interrupt handling with correct stack behaviour.
- The 6510 I/O port at $00/$01 for ROM/RAM bank switching.
- Undocumented/illegal opcodes are NOT required (may be implemented as NOP).

## Memory Map

- $0000–$00FF: Zero page
- $0100–$01FF: Stack
- $0200–$9FFF: Free RAM (programs load here)
- $A000–$BFFF: BASIC ROM (banked, RAM underneath)
- $C000–$CFFF: Free RAM
- $D000–$D3FF: VIC-II registers
- $D400–$D7FF: SID registers
- $D800–$DBFF: Colour RAM (nibbles)
- $DC00–$DCFF: CIA1 (keyboard, joystick, timer)
- $DD00–$DDFF: CIA2 (serial, timer, VIC bank)
- $E000–$FFFF: KERNAL ROM (banked, RAM underneath)

## Video (VIC-II)

- Standard text mode (mode 0) — 40x25 characters, 16 colours, character ROM.
- Multicolour text mode.
- Standard bitmap mode (320x200) and multicolour bitmap mode (160x200).
- Hardware sprites (8 sprites, 24x21 pixels, multicolour optional).
- Raster interrupt — trigger IRQ at a programmable scanline.
- Border colour and background colour registers.
- Correct raster timing is essential — Lords of Midnight uses raster effects.

## Sound (SID — basic)

- 3 oscillator voices with waveform selection (triangle, sawtooth, pulse, noise).
- ADSR envelope per voice.
- Frequency and pulse-width registers.
- Audio output as PCM sample buffer suitable for Web Audio API playback.
- Full filter emulation is NOT required (passthrough acceptable).

## Input

- CIA1 keyboard matrix scan — map browser `KeyboardEvent` codes to the C64 8x8 keyboard matrix.
- Joystick via CIA1 ($DC01 port 1) and CIA1 ($DC00 port 2) — Lords of Midnight uses keyboard, but joystick support enables other games.

## Lords of Midnight Compatibility

The target game exercises these specific features:
- Custom character sets (redefined at $3000 or similar)
- Full keyboard input (directional + action keys)
- Raster interrupts for split-screen effects
- IRQ-driven game loop timing via CIA timer
- PRG loading at the correct start address

## Requirements

- No external dependencies for the core emulator (Web Audio API and Canvas API are browser-provided).
- KERNAL and BASIC ROMs must NOT be bundled (they are copyrighted). Provide a `loadROMs(c64, { kernal, basic, chargen })` function. Tests should use minimal stub ROMs.
- Comprehensive unit tests for each subsystem:
  - CPU: test each addressing mode and instruction, verify cycle counts, test interrupt handling.
  - Memory: test bank switching, I/O area mapping.
  - VIC-II: test mode switching, framebuffer output for known register states.
  - Input: test keyboard matrix encoding/decoding.
- Integration test: load a small test PRG that writes to screen memory and verify framebuffer output.
- README with architecture overview, usage example, and instructions for obtaining legal ROM dumps.

## Acceptance Criteria

- [ ] CPU executes all 151 official opcodes with correct results and cycle counts
- [ ] CPU handles IRQ and NMI interrupts correctly (push PC+flags, jump to vector)
- [ ] Memory bank switching works ($01 register controls ROM/RAM visibility)
- [ ] VIC-II text mode renders 40x25 character display to framebuffer
- [ ] VIC-II raster interrupt fires at the programmed scanline
- [ ] SID produces audible waveform output for at least triangle and pulse waves
- [ ] CIA1 keyboard matrix correctly maps key presses to the scanned row/column
- [ ] `loadPRG()` places data at the correct address from the PRG header
- [ ] `runFrame()` executes approximately the right number of cycles per frame (PAL timing)
- [ ] A test PRG that writes "HELLO" to screen RAM ($0400) produces correct framebuffer output
- [ ] `reset()` returns the emulator to a known initial state
- [ ] All unit tests pass
- [ ] README documents architecture and ROM loading
