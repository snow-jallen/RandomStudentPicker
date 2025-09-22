// Random Student Picker - shared storage + logic
// Data model (localStorage key rsp:data):
// {
//   groups: {
//     groupId: {
//       id: string,
//       title: string,
//       students: [ { id, name, picks:[timestamp,...] } ],
//       history: [ { id, name, timestamp } ]
//     }
//   },
//   currentGroupId: string,
//   version: 2
// }

const RSP_STORAGE_KEY = 'rsp:data';
const RSP_CURRENT_GROUP_KEY = 'rsp:currentGroup';

function rsp_load() {
  try {
    const raw = localStorage.getItem(RSP_STORAGE_KEY);
    if (!raw) {
      // Create default group and structure
      const defaultGroupId = rsp_uuid();
      const data = {
        groups: {
          [defaultGroupId]: {
            id: defaultGroupId,
            title: 'Default Group',
            students: [],
            history: []
          }
        },
        currentGroupId: defaultGroupId,
        version: 2
      };
      rsp_save(data);
      return data;
    }
    const data = JSON.parse(raw);

    // Migration from v1 to v2
    if (data.version === 1 || !data.version) {
      const defaultGroupId = rsp_uuid();
      const migratedData = {
        groups: {
          [defaultGroupId]: {
            id: defaultGroupId,
            title: 'Default Group',
            students: data.students || [],
            history: data.history || []
          }
        },
        currentGroupId: defaultGroupId,
        version: 2
      };
      rsp_save(migratedData);
      return migratedData;
    }

    if (!data.groups) data.groups = {};
    if (!data.currentGroupId) {
      const groupIds = Object.keys(data.groups);
      data.currentGroupId = groupIds.length > 0 ? groupIds[0] : rsp_uuid();
    }
    return data;
  } catch (e) {
    console.warn('Failed to parse storage; resetting.', e);
    const defaultGroupId = rsp_uuid();
    return {
      groups: {
        [defaultGroupId]: {
          id: defaultGroupId,
          title: 'Default Group',
          students: [],
          history: []
        }
      },
      currentGroupId: defaultGroupId,
      version: 2
    };
  }
}

function rsp_save(data) {
  localStorage.setItem(RSP_STORAGE_KEY, JSON.stringify(data));
}

function rsp_getCurrentGroup() {
  const data = rsp_load();
  return data.groups[data.currentGroupId] || null;
}

function rsp_getAllGroups() {
  const data = rsp_load();
  return Object.values(data.groups);
}

function rsp_createGroup(title) {
  const data = rsp_load();
  const groupId = rsp_uuid();
  const group = {
    id: groupId,
    title: title.trim(),
    students: [],
    history: []
  };
  data.groups[groupId] = group;
  rsp_save(data);
  return group;
}

function rsp_deleteGroup(groupId) {
  const data = rsp_load();
  if (Object.keys(data.groups).length <= 1) {
    return false; // Can't delete the last group
  }
  delete data.groups[groupId];
  if (data.currentGroupId === groupId) {
    // Switch to first remaining group
    data.currentGroupId = Object.keys(data.groups)[0];
  }
  rsp_save(data);
  return true;
}

function rsp_setCurrentGroup(groupId) {
  const data = rsp_load();
  if (data.groups[groupId]) {
    data.currentGroupId = groupId;
    rsp_save(data);
    return true;
  }
  return false;
}

function rsp_renameGroup(groupId, newTitle) {
  const data = rsp_load();
  if (data.groups[groupId]) {
    data.groups[groupId].title = newTitle.trim();
    rsp_save(data);
    return true;
  }
  return false;
}

function rsp_copyGroup(sourceGroupId, newTitle) {
  const data = rsp_load();
  const sourceGroup = data.groups[sourceGroupId];
  if (!sourceGroup) return null;

  const newGroupId = rsp_uuid();
  const newGroup = {
    id: newGroupId,
    title: newTitle.trim(),
    students: sourceGroup.students.map(student => ({
      id: rsp_uuid(), // Give each student a new ID
      name: student.name,
      picks: [] // Start with empty pick history
    })),
    history: [] // Start with empty history
  };

  data.groups[newGroupId] = newGroup;
  rsp_save(data);
  return newGroup;
}

function rsp_uuid() {
  if (crypto && crypto.randomUUID) return crypto.randomUUID();
  return 'id-' + Math.random().toString(36).slice(2, 11);
}

function rsp_addStudent(name) {
  const data = rsp_load();
  const currentGroup = data.groups[data.currentGroupId];
  if (!currentGroup) return null;
  const student = { id: rsp_uuid(), name: name.trim(), picks: [] };
  currentGroup.students.push(student);
  rsp_save(data);
  return student;
}

function rsp_deleteStudent(id) {
  const data = rsp_load();
  const currentGroup = data.groups[data.currentGroupId];
  if (!currentGroup) return;
  currentGroup.students = currentGroup.students.filter(s => s.id !== id);
  // Preserve history (optional: we could also remove it). We'll keep it.
  rsp_save(data);
}

function rsp_renameStudent(id, newName) {
  const data = rsp_load();
  const currentGroup = data.groups[data.currentGroupId];
  if (!currentGroup) return;
  const s = currentGroup.students.find(s => s.id === id);
  if (s) {
    s.name = newName.trim();
    // Update historical records for consistency
    currentGroup.history.forEach(h => { if (h.id === id) h.name = s.name; });
    rsp_save(data);
  }
}

function rsp_clearAll() {
  const data = rsp_load();
  const currentGroup = data.groups[data.currentGroupId];
  if (!currentGroup) return;
  currentGroup.students = [];
  currentGroup.history = [];
  rsp_save(data);
}

function rsp_resetCounts() {
  const data = rsp_load();
  const currentGroup = data.groups[data.currentGroupId];
  if (!currentGroup) return;
  currentGroup.students.forEach(s => { s.picks = []; });
  currentGroup.history = [];
  rsp_save(data);
}

function rsp_recordPick(studentId) {
  const data = rsp_load();
  const currentGroup = data.groups[data.currentGroupId];
  if (!currentGroup) return null;
  const s = currentGroup.students.find(s => s.id === studentId);
  if (!s) return null;
  const ts = Date.now();
  s.picks.push(ts);
  currentGroup.history.push({ id: s.id, name: s.name, timestamp: ts });
  rsp_save(data);
  return { id: s.id, name: s.name, timestamp: ts };
}

function rsp_getStudents() {
  const currentGroup = rsp_getCurrentGroup();
  return currentGroup ? currentGroup.students : [];
}

function rsp_getHistory() {
  const currentGroup = rsp_getCurrentGroup();
  return currentGroup ? currentGroup.history : [];
}

// Fair selection: choose uniformly among students with the minimal pick count
function rsp_pickFair() {
  const currentGroup = rsp_getCurrentGroup();
  if (!currentGroup) return null;
  const students = currentGroup.students;
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
  relative: rsp_relative,
  // Group management
  getCurrentGroup: rsp_getCurrentGroup,
  getAllGroups: rsp_getAllGroups,
  createGroup: rsp_createGroup,
  deleteGroup: rsp_deleteGroup,
  setCurrentGroup: rsp_setCurrentGroup,
  renameGroup: rsp_renameGroup,
  copyGroup: rsp_copyGroup
};
