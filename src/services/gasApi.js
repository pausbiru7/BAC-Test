const GAS_URL = 'https://script.google.com/macros/s/AKfycbx5UI9G0sQIFgiw6Zt88fdoLM3jwtMUqfFeo6rdGqqo4uNGKE_9Jmd1lXTGUJi4qFeq8w/exec';

async function handleResponse(response) {
  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || 'Request ke Google Apps Script gagal.');
  }

  return result.data;
}

export async function gasGet(action, params = {}) {
  const query = new URLSearchParams({
    action,
    ...params,
  });

  const response = await fetch(`${GAS_URL}?${query.toString()}`);

  return handleResponse(response);
}

export async function gasPost(action, payload = {}) {
  const response = await fetch(GAS_URL, {
    method: 'POST',
    body: JSON.stringify({
      action,
      payload,
    }),
  });

  return handleResponse(response);
}

export function getInitialData() {
  return gasGet('getInitialData');
}

export function getPersons() {
  return gasGet('getPersons');
}

export function getTests() {
  return gasGet('getTests');
}

export function getAuditLogs() {
  return gasGet('getAuditLogs');
}

export function getSettings() {
  return gasGet('getSettings');
}

export function createPerson(payload) {
  return gasPost('createPerson', payload);
}

export function updatePerson(payload) {
  return gasPost('updatePerson', payload);
}

export function deletePerson(payload) {
  return gasPost('deletePerson', payload);
}

export function createTest(payload) {
  return gasPost('createTest', payload);
}

export function updateSettings(payload) {
  return gasPost('updateSettings', payload);
}
