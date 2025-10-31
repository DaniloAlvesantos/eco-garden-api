import admin, { type ServiceAccount } from "firebase-admin";

// Try several ways to obtain a service account object in decreasing priority:
// 1. Parse FIREBASE_SERVICE_ACCOUNT (a JSON string in an env var)
// 2. Individual FIREBASE_* env vars
// 3. Fall back to src/config/firebase.json file
// Validate that project_id exists (firebase-admin requires it)

function loadServiceAccount(): ServiceAccount {
  // 1) JSON string via single env var
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT || process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.project_id === "string") {
        // ensure private_key newlines are correct
        if (parsed.private_key && typeof parsed.private_key === "string") {
          parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
        }
        return parsed as ServiceAccount;
      }
    } catch (err) {
      // fall through to other methods
    }
  }

  // 2) Individual env vars
  // use a loose type for intermediate checks because runtime JSON uses snake_case keys
  const envAccount: any = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n") : undefined,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
  } as ServiceAccount;

  if (envAccount.project_id && typeof envAccount.project_id === "string") {
    return envAccount as ServiceAccount;
  }

  // If we got here, no env-based credentials were found.
  throw new Error(
    'Firebase service account is missing a valid "project_id" from environment variables.\n' +
      'Provide credentials via one of these env-based options:\n' +
      '  1) Set FIREBASE_SERVICE_ACCOUNT (JSON string) or FIREBASE_SERVICE_ACCOUNT_JSON.\n' +
      '  2) Set individual env vars like FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, etc.\n'
  );
}

const serviceAccount = loadServiceAccount();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const firestore_db = admin.firestore();
