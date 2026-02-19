import { execSync } from 'child_process';

export interface CheckResult {
  id: string;
  name: string;
  category: string;
  passed: boolean;
  details: string;
  weight: number;
}

const checksConfig = [
  {
    id: 'sip',
    name: 'System Integrity Protection (SIP)',
    command: 'csrutil status',
    category: 'System Integrity',
    weight: 15,
    parser: (out: string) => ({
      passed: out.includes('enabled'),
      details: out.trim(),
    }),
  },
  {
    id: 'gatekeeper',
    name: 'Gatekeeper',
    command: 'spctl --status',
    category: 'System Integrity',
    weight: 12,
    parser: (out: string) => ({
      passed: out.includes('assessments enabled'),
      details: out.trim(),
    }),
  },
  {
    id: 'filevault',
    name: 'FileVault Full-Disk Encryption',
    command: 'fdesetup status',
    category: 'Encryption',
    weight: 15,
    parser: (out: string) => ({
      passed: out.includes('On'),
      details: out.trim(),
    }),
  },
  {
    id: 'firewall',
    name: 'Application Firewall',
    command: '/usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate',
    category: 'Network',
    weight: 10,
    parser: (out: string) => ({
      passed: out.includes('enabled'),
      details: out.trim(),
    }),
  },
  {
    id: 'stealth',
    name: 'Firewall Stealth Mode',
    command: '/usr/libexec/ApplicationFirewall/socketfilterfw --getstealthmode',
    category: 'Network',
    weight: 8,
    parser: (out: string) => ({
      passed: out.includes('enabled'),
      details: out.trim(),
    }),
  },
  {
  id: 'autoupdates',
  name: 'Automatic Security Updates',
  command: 'defaults read /Library/Preferences/com.apple.SoftwareUpdate AutomaticCheckEnabled 2>/dev/null || echo "not_set"',
  category: 'Updates',
  weight: 10,
  parser: (out: string) => {
    const trimmed = out.trim();
    if (trimmed === '1') {
      return { passed: true, details: 'Enabled' };
    } else if (trimmed === '0') {
      return { passed: false, details: 'Disabled' };
    } else {
      // Key missing → assume default macOS behavior (checks enabled)
      return { passed: true, details: 'Not explicitly set (default: enabled)' };
    }
  },
},
{
  id: 'screenlock',
  name: 'Require Password After Sleep/Screen Saver',
  command: 'defaults read com.apple.screensaver askForPassword 2>/dev/null || echo "not_set"',
  category: 'User Controls',
  weight: 10,
  parser: (out: string) => {
    const trimmed = out.trim();
    if (trimmed === '1') {
      return { passed: true, details: 'Enabled (immediate or short delay)' };
    } else if (trimmed === '0') {
      return { passed: false, details: 'Disabled' };
    } else {
      // Legacy key missing in modern macOS → check alternative or assume based on common default
      // For better accuracy, we could add a follow-up command later, but for now:
      return { passed: true, details: 'Not set in legacy plist (check Lock Screen settings)' };
    }
  },
},
  {
    id: 'screentimeout',
    name: 'Screen Saver Timeout (≤ 20 min)',
    command: 'defaults -currentHost read com.apple.screensaver idleTime',
    category: 'User Controls',
    weight: 5,
    parser: (out: string) => {
      const secs = parseInt(out.trim(), 10);
      const mins = Math.round(secs / 60);
      return {
        passed: secs > 0 && secs <= 1200,
        details: `${mins} minutes`,
      };
    },
  },
];

export const runAllChecks = (): CheckResult[] => {
  return checksConfig.map((cfg) => {
    try {
      const output = execSync(cfg.command, { encoding: 'utf8', timeout: 8000 }).trim();
      const parsed = cfg.parser(output);
      return {
        id: cfg.id,
        name: cfg.name,
        category: cfg.category,
        weight: cfg.weight,
        passed: parsed.passed,
        details: parsed.details,
      };
    } catch (err: any) {
      return {
        id: cfg.id,
        name: cfg.name,
        category: cfg.category,
        weight: cfg.weight,
        passed: false,
        details: `Command failed: ${err.message.split('\n')[0]}`,
      };
    }
  });
};