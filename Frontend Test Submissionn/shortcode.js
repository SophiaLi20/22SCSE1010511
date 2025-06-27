export const generateShortCode = async (longUrl, fingerprint) => {
  // Combine URL, fingerprint, and timestamp to create a unique hash
  const timestamp = Date.now();
  const data = `${longUrl}-${fingerprint}-${timestamp}`;
  
  try {
    const msgUint8 = new TextEncoder().encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Take first 8 characters for the short code
    return hashHex.substring(0, 8);
  } catch (error) {
    console.error('Hash generation failed:', error);
    // Fallback to a simpler method if crypto API is unavailable
    return `fallback-${Math.random().toString(36).substring(2, 10)}`;
  }
};