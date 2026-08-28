export type AccessScope = 'local' | 'lan' | 'public';

function isPrivateIpv4(hostname: string) {
  const octets = hostname.split('.').map(Number);
  if (octets.length !== 4 || octets.some((value) => !Number.isInteger(value) || value < 0 || value > 255)) {
    return false;
  }

  return octets[0] === 10
    || (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31)
    || (octets[0] === 192 && octets[1] === 168)
    || (octets[0] === 169 && octets[1] === 254);
}

export function classifyAccessOrigin(origin: string): AccessScope {
  const hostname = new URL(origin).hostname.toLowerCase();

  if (
    hostname === 'localhost'
    || hostname.endsWith('.localhost')
    || hostname === '::1'
    || hostname === '0.0.0.0'
    || hostname.startsWith('127.')
  ) {
    return 'local';
  }

  if (isPrivateIpv4(hostname) || hostname.endsWith('.local')) {
    return 'lan';
  }

  return 'public';
}
