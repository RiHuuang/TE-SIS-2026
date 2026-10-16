# SIS 2026 // Engagement Portal & Live Squad Leaderboard
> **Stand In, Stand Together** — BCA System Infrastructure High-Availability Event Portal

---

## 📋 System Requirements
- **Node.js**: Version 18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **Browser**: Modern Chromium-based browser recommended (Google Chrome, Microsoft Edge, Brave) or Firefox / Safari.

---

## 🚀 Quick Start Guide (How to Run on Any Device)

### Step 1: Extract the Archive
Unzip the downloaded `te-sis-2026.zip` file to your desired folder on the target computer.

### Step 2: Open Terminal / Command Prompt
Open your preferred terminal inside the extracted project folder:
- **Windows**: Right-click inside the folder and select **"Open in Terminal"** or open `cmd.exe` and navigate to the folder (`cd path\to\folder`).
- **macOS / Linux**: Open Terminal and `cd` into the extracted folder.

### Step 3: Install Dependencies
Install the required packages by running:
```bash
npm install
```
*(On Windows PowerShell, if you encounter script execution policy restrictions, run `npm.cmd install`)*

### Step 4: Launch the Local Development Server
Start the server with:
```bash
npm run dev
```
*(Or `npm.cmd run dev` on Windows)*

The console will display the local and network access URLs:
```
  VITE v6.x ready in ~400 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
```

### Step 5: Open in Your Browser
Open your browser and navigate to:
**[http://localhost:3000/](http://localhost:3000/)**

---

## 🖥️ Dual-Screen Event Setup (Audience Screen + Operator Console)

This portal is built with **multi-window real-time synchronization** via native `BroadcastChannel` and `localStorage`. Changes made on the operator deck update **instantaneously** on the audience display without refreshing.

### Recommended Screen Setup:
1. **Screen 1 (Projector / Main Audience Display)**:
   - Open: `http://localhost:3000/` (or `http://localhost:3000/?view=leaderboard`)
   - Press `F11` in Chrome to go full-screen.
   - Shows top-3 podium standings, live roster table, and receives remote victory warp animations.

2. **Screen 2 (Operator / Event Committee Laptop)**:
   - Open: `http://localhost:3000/operator.html` (or click the **`OPERATOR ↗`** button in the top navigation bar).
   - Allows instant point stepper additions, search filtering, remote warp triggers, and score resets.

---

## 🎮 Key Features & How to Use

### 1. Squad Standings & Leaderboard (`/` or Tab `01`)
- **15 Registered Squads**:
  1. `AYAM // 01`
  2. `BEBEK // 02`
  3. `BURUNG HANTU // 03`
  4. `GAJAH // 04`
  5. `GORILLA // 05`
  6. `HARIMAU // 06`
  7. `KAMBING // 07`
  8. `KATAK // 08`
  9. `KUCING // 09`
  10. `KUDA // 10`
  11. `LUMBA-LUMBA // 11`
  12. `MERAK // 12`
  13. `MONYET // 13`
  14. `SAPI // 14`
  15. `SERIGALA // 15`
- **Dynamic Podium**: The top 3 squads dynamically populate the elevated Champion (#01), Runner-Up (#02), and Third (#03) podium cards.
- **Score Bump Micro-Animation**: When an operator adjusts scores, the affected team's row smoothly highlights in real-time.

### 2. Cipher Terminal ("Crack The Code") (Tab `02`)
- **Secret Passphrase**:
  ```
  SYSTEM INFRASTRUCTURE BCA ALWAYS ON
  ```
  *(Case-insensitive, extra spaces and trailing slashes are automatically normalized)*
- **Bounty Protocol**:
  - Starts at **+100 PTS** for the 1st squad to crack the code.
  - Automatically decays by **-5 PTS** per subsequent squad (e.g. 100, 95, 90... minimum 50 PTS).
  - Each squad can only claim the override bonus once.
- **Victory Hyper-Warp Blast**:
  - Decrypting the cipher triggers a procedural canvas 3D starfield hyper-drive warp animation, odometer point counter, audio synthesis effects, and monochrome celebration burst.

### 3. Operator Control Deck (`/operator.html` or Tab `03`)
- **Point Steppers**: Rapid point assignment buttons (`+1`, `+2`, `+5`, `+10`, `+20`, `+50`, `+100`) for each squad.
- **Custom Points Input**: Type any specific points number and click `SET`.
- **Squad Filter Search**: Real-time search box to quickly filter squads by animal name or team number (e.g. `01` or `AYAM`).
- **Commission New Squad**: Add new teams to the live event roster dynamically.
- **Stage Master Actions**:
  - `OPEN AUDIENCE SCREEN`: Launches the clean audience leaderboard in a separate window.
  - `TRIGGER WARP (AUDIENCE)`: Broadcasts the hyper-warp victory sequence to the audience screen on command.
  - `RESET SCORES TO 0`: Resets all squad scores to 0 PTS for a new game session.
  - `RESTORE 15 DEFAULTS`: Restores the default 15 animal squads (`AYAM // 01` to `SERIGALA // 15`).

---

## 📡 Local Network / Multi-Device Access (Wi-Fi / LAN)
You can run the server on one laptop and connect from tablets, mobile phones, or other laptops on the same Wi-Fi / local network:
1. Ensure both devices are on the same Wi-Fi or LAN network.
2. Note the Network URL printed in the terminal (e.g. `http://192.168.100.94:3000/`).
3. Open that URL on the second device.

---

## 📦 Production Build (Optional)
If you want to create an optimized production build:
```bash
npm run build
npm run preview
```
The optimized files will be output to the `dist/` directory.

---
*BCA System Infrastructure — Stand In, Stand Together 2026*
