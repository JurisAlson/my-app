type Attempt = {
  count: number;
  firstAttempt: number;
};

const attempts = new Map<string, Attempt>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(ip: string) {
  const now = Date.now();

  const record = attempts.get(ip);

  // First request
  if (!record) {
    attempts.set(ip, {
      count: 1,
      firstAttempt: now,
    });

    return {
      allowed: true,
      remaining: MAX_ATTEMPTS - 1,
    };
  }

  // Window expired
  if (now - record.firstAttempt > WINDOW_MS) {
    attempts.set(ip, {
      count: 1,
      firstAttempt: now,
    });

    return {
      allowed: true,
      remaining: MAX_ATTEMPTS - 1,
    };
  }

  // Limit reached
  if (record.count >= MAX_ATTEMPTS) {
    return {
      allowed: false,
     remaining: 0,
    };
  }

  record.count++;

  attempts.set(ip, record);

  return {
    allowed: true,
    remaining: MAX_ATTEMPTS - record.count,
  };
}

export function resetRateLimit(ip: string) {
  attempts.delete(ip);
}