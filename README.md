# Aegis Auditor

A modern security audit tool for macOS that provides comprehensive system security assessment and vulnerability detection. Built as a portfolio project showcasing modern desktop application development.

## Overview

Aegis Auditor scans your system for security misconfigurations, compliance issues, and potential vulnerabilities. It evaluates critical security controls and presents results in a clean, actionable interface.

## Why This Project

This project demonstrates:
- **Full-stack desktop development** with Electron and Vue 3
- **TypeScript** for type-safe application code
- **Modern UI/UX** with Tailwind CSS for responsive design
- **Security-focused** implementation with proper IPC communication between processes
- **Build optimization** with Vite for fast development and production builds

## Features

- **Security Score Calculation** - Real-time scoring based on weighted security checks
- **Comprehensive Audits** - Evaluates system integrity, encryption, firewall settings, and more
- **Clear Results** - Pass/fail indicators with point values for each check
- **Persistent History** - Tracks last audit timestamp
- **Clean Interface** - Minimal, focused design for quick scanning

## Technology Stack

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide Vue** - Beautiful, consistent icons

### Desktop
- **Electron** - Cross-platform desktop application
- **Electron Vite** - Fast build tool for Electron apps
- **IPC** - Secure inter-process communication

### Development
- **Node.js** - JavaScript runtime
- **npm** - Package management

## Project Structure

```
aegis-auditor/
├── src/
│   ├── main/              # Main process (Node.js)
│   ├── preload/           # Preload script (secure IPC bridge)
│   └── renderer/
│       └── src/
│           ├── App.vue    # Main component
│           ├── main.ts    # Entry point
│           └── style.css  # Global styles
├── tailwind.config.js     # Tailwind configuration
├── postcss.config.js      # PostCSS configuration
└── package.json           # Dependencies
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- macOS 11+

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/aegis-auditor.git
cd aegis-auditor
```

2. Install dependencies:
```bash
npm install
```

3. Install Tailwind and required tools:
```bash
npm install -D tailwindcss postcss autoprefixer @tailwindcss/postcss
```

### Development

Start the development server:
```bash
npm run dev
```

The app will open with hot-reload enabled. Changes to Vue components and styles will reflect immediately.

### Building

Build for production:
```bash
npm run build
```

The compiled application will be in the `dist` directory.

## How It Works

### Architecture

Aegis Auditor uses Electron's multi-process architecture for security and performance:

1. **Main Process** - Handles file system access, system commands, and application lifecycle
2. **Preload Script** - Securely exposes only necessary APIs to the renderer via context bridge
3. **Renderer Process** - Vue 3 application that displays results and handles user interaction

### Audit Flow

1. User clicks "Run Audit" button
2. Renderer sends IPC message to main process
3. Main process executes security checks (file permissions, configurations, etc.)
4. Results returned to renderer as array of `CheckResult` objects
5. Vue components calculate score and display results
6. Last audit timestamp is persisted

### Security Checks

Each check evaluates a specific security control:
- **System Integrity Protection (SIP)** - macOS security feature status
- **Gatekeeper** - Code signing verification
- **FileVault** - Full-disk encryption
- **Firewall** - Application-level firewall status
- **Security Updates** - Automatic update settings
- And more...

Each check has:
- `name` - Human-readable check name
- `passed` - Boolean result
- `weight` - Points awarded if passed
- `description` - Optional details

## Security Considerations

- **Sandboxed Renderer** - Limited access to system APIs
- **Context Bridge** - Only whitelisted methods exposed to UI
- **No Remote URLs** - All code is local
- **File Integrity** - No external dependencies loaded at runtime

## Performance

- **Fast Startup** - Vite optimization and code splitting
- **Efficient Audits** - Parallel security checks where possible
- **Responsive UI** - Hardware acceleration with Tailwind CSS
- **Low Memory** - Vue 3 composition API for efficient reactivity

## Future Enhancements

- [ ] Detailed remediation guidance for failed checks
- [ ] Automated fixes for certain security issues
- [ ] Scheduled audit reports
- [ ] Export audit results (PDF, JSON)
- [ ] Multi-user support
- [ ] Custom check creation
- [ ] Dark/light theme toggle

## Troubleshooting

### App won't start
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear app cache: `rm -rf ~/.config/aegis-auditor`

### Audit hangs
- Check console for errors: `npm run dev` and watch terminal
- Ensure security tools aren't blocking system calls

### Build fails
- Verify Node.js version: `node --version` (should be 16+)
- Clear build cache: `rm -rf dist`

## License

MIT - Feel free to use this project for learning and portfolio purposes.

## Author

Martin Gawlyta - [GitHub](https://github.com/yourusername) | [Portfolio](https://yourportfolio.com)

---

Built with ❤️ as a modern security audit tool and portfolio project.
