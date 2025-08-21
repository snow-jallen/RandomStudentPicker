// Random Student Picker - shared storage + logic
// Data model (localStorage key rsp:data):
// {
//   students: [ { id, name, picks:[timestamp,...] } ],
//   history: [ { id, name, timestamp } ],
//   version: 1
// }

const RSP_STORAGE_KEY = 'rsp:data';

function rsp_load() {
  try {
    const raw = localStorage.getItem(RSP_STORAGE_KEY);
    if (!raw) return { students: [], history: [], version: 1 };
    const data = JSON.parse(raw);
    if (!data.students) data.students = [];
    if (!data.history) data.history = [];
    return data;
  } catch (e) {
    console.warn('Failed to parse storage; resetting.', e);
    return { students: [], history: [], version: 1 };
  }
}

function rsp_save(data) {
  localStorage.setItem(RSP_STORAGE_KEY, JSON.stringify(data));
}

function rsp_uuid() {
  if (crypto && crypto.randomUUID) return crypto.randomUUID();
  return 'id-' + Math.random().toString(36).slice(2, 11);
}

function rsp_addStudent(name) {
  const data = rsp_load();
  const student = { id: rsp_uuid(), name: name.trim(), picks: [] };
  data.students.push(student);
  rsp_save(data);
  return student;
}

function rsp_deleteStudent(id) {
  const data = rsp_load();
  data.students = data.students.filter(s => s.id !== id);
  // Preserve history (optional: we could also remove it). We'll keep it.
  rsp_save(data);
}

function rsp_renameStudent(id, newName) {
  const data = rsp_load();
  const s = data.students.find(s => s.id === id);
  if (s) {
    s.name = newName.trim();
    // Update historical records for consistency
    data.history.forEach(h => { if (h.id === id) h.name = s.name; });
    rsp_save(data);
  }
}

function rsp_clearAll() {
  rsp_save({ students: [], history: [], version: 1 });
}

function rsp_resetCounts() {
  const data = rsp_load();
  data.students.forEach(s => { s.picks = []; });
  data.history = [];
  rsp_save(data);
}

function rsp_recordPick(studentId) {
  const data = rsp_load();
  const s = data.students.find(s => s.id === studentId);
  if (!s) return null;
  const ts = Date.now();
  s.picks.push(ts);
  data.history.push({ id: s.id, name: s.name, timestamp: ts });
  rsp_save(data);
  return { id: s.id, name: s.name, timestamp: ts };
}

function rsp_getStudents() {
  return rsp_load().students;
}

function rsp_getHistory() {
  return rsp_load().history;
}

// Fair selection: choose uniformly among students with the minimal pick count
function rsp_pickFair() {
  const data = rsp_load();
  const students = data.students;
  if (!students.length) return null;
  const counts = students.map(s => s.picks.length);
  const min = Math.min(...counts);
  const pool = students.filter(s => s.picks.length === min);
  if (!pool.length) return null; // Shouldn't happen
  const idx = rsp_secureRandomIndex(pool.length);
  const chosen = pool[idx];
  return rsp_recordPick(chosen.id);
}

function rsp_secureRandomIndex(n) {
  if (window.crypto && crypto.getRandomValues) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return arr[0] % n;
  }
  return Math.floor(Math.random() * n);
}

function rsp_formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleString();
}

function rsp_relative(ts) {
  const diff = Date.now() - ts;
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return sec + 's ago';
  const min = Math.floor(sec / 60); if (min < 60) return min + 'm ago';
  const hr = Math.floor(min / 60); if (hr < 24) return hr + 'h ago';
  const day = Math.floor(hr / 24); return day + 'd ago';
}

window.RSP = {
  load: rsp_load,
  save: rsp_save,
  addStudent: rsp_addStudent,
  deleteStudent: rsp_deleteStudent,
  renameStudent: rsp_renameStudent,
  clearAll: rsp_clearAll,
  resetCounts: rsp_resetCounts,
  recordPick: rsp_recordPick,
  getStudents: rsp_getStudents,
  getHistory: rsp_getHistory,
  pickFair: rsp_pickFair,
  formatTime: rsp_formatTime,
  relative: rsp_relative
};
