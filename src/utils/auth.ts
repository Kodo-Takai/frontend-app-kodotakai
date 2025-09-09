export async function signIn(email: string, password: string) {
  await new Promise((r) => setTimeout(r, 800));
  if (/\S+@\S+\.\S+/.test(email) && password.trim()) {
    return { ok: true, token: 'fake-jwt-token', user: { email } };
  }
  throw new Error('Credenciales inválidas');
}
