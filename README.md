<div align="center">

<img src="https://files.catbox.moe/vxxv26.jpeg" width="120" alt="EliTechWiz"/>

# EliTechWiz

**WhatsApp multi-device bot with pairing-code and QR login**

[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Baileys](https://img.shields.io/badge/Baileys-Multi--Device-25D366?style=flat-square&logo=whatsapp&logoColor=white)](https://github.com/WhiskeySockets/Baileys)
[![License](https://img.shields.io/badge/License-ISC-0a192f?style=flat-square)](LICENSE)

</div>

---

EliTechWiz is a Node.js WhatsApp bot. Connect an account from the web portal using a pairing code or a live QR code, then run the existing command set, group tools, and plugins.

## Features

- Pairing-code and QR authentication through a local web portal
- Multi-device WhatsApp session with automatic reconnect
- Existing command modules in `commandes/`
- Group moderation, media tools, and owner controls
- Single-session design: one WhatsApp account at a time

## Requirements

- Node.js 20 or later
- A WhatsApp account that can use Linked Devices
- Optional: PostgreSQL if you enable database-backed features

## Quick start

```bash
git clone https://github.com/Eliahhango/EliTechWiz-V4.git
cd EliTechWiz-V4
npm install
cp .env.example .env
npm start
```

Open `http://localhost:5000` and connect WhatsApp.

### Pairing code

1. Keep the portal open.
2. Choose your country code and enter the WhatsApp number.
3. Request a pairing code.
4. On your phone: WhatsApp > Settings > Linked devices > Link a device > Link with phone number.
5. Enter the code, then confirm the device-link prompt.

### QR code

1. Open the QR tab in the portal.
2. On your phone: WhatsApp > Settings > Linked devices > Link a device.
3. Scan the live QR code. It refreshes automatically.

## Configuration

Copy `.env.example` to `.env` and set the values you need.

| Variable | Description |
| --- | --- |
| `PREFIX` | Command prefix (default `.`) |
| `BOT_NAME` | Display name |
| `NUMERO_OWNER` | Owner WhatsApp number |
| `PUBLIC_MODE` | `yes` for public, `no` for private |
| `PORT` | Web portal port (default `5000`) |
| `PORTAL_SECRET` | Secret used to sign portal cookies |
| `DATABASE_URL` | PostgreSQL URL for database-backed modules |
| `SESSION_ID` | Optional. Leave empty to pair from the web portal |

Do not commit `.env`, `auth/`, or session files.

## Project layout

```text
server.js              Portal and pairing client entry
eliah.js               Full bot runtime
lib/web-server.js      HTTP API and static portal
lib/baileys-connector.js
public/                Portal UI
commandes/             Command modules
ess/                   Feature stores
auth/                  WhatsApp session files (gitignored)
```

## Scripts

```bash
npm start    # Start the portal and WhatsApp client
npm test     # Run unit tests
npm run s    # Start the legacy bot entry
```

## Deploy

The app needs a persistent Node.js process, outbound access to WhatsApp, and disk for `auth/`.

Render, Railway, and Docker configs are included:

- `render.yaml`
- `railway.json`
- `Dockerfile`

Set `PORT`, `PORTAL_SECRET`, and `NUMERO_OWNER` in the host environment. Use `/health` as the health check path.

## License

ISC. Built by [Eliah Hango](https://github.com/Eliahhango).
