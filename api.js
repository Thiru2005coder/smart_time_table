/**
 * SmartTimetable - Centralized API Service
 * Connects frontend to FastAPI backend, MongoDB, and Gemini AI endpoints.
 */

const API_CONFIG = {
  // Use current host if running on same port, or fallback to backend standard 8000
  BASE_URL: (window.location.port === '8000' || window.location.pathname.startsWith('/api'))
    ? ''
    : 'http://localhost:8000',
  TIMEOUT_MS: 15000,
};

class ApiService {
  constructor() {
    this.token = localStorage.getItem('cvr_token') || '';
    this.user = JSON.parse(localStorage.getItem('cvr_user') || 'null');
    this.isBackendOnline = false;
  }

  setToken(token, user = null) {
    this.token = token;
    localStorage.setItem('cvr_token', token);
    if (user) {
      this.user = user;
      localStorage.setItem('cvr_user', JSON.stringify(user));
    }
  }

  clearToken() {
    this.token = '';
    this.user = null;
    localStorage.removeItem('cvr_token');
    localStorage.removeItem('cvr_user');
  }

  getHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_CONFIG.BASE_URL}${endpoint}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        ...options,
        headers: this.getHeaders(options.headers),
        signal: controller.signal,
      });

      clearTimeout(timeout);
      this.isBackendOnline = true;

      // Check if response is 401 Unauthorized
      if (response.status === 401 && !endpoint.includes('/auth/login')) {
        console.warn('Session expired or unauthorized');
      }

      const contentType = response.headers.get('content-type') || '';
      let data = null;
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else if (contentType.includes('text/csv') || contentType.includes('text/plain')) {
        data = await response.text();
      } else {
        data = await response.blob();
      }

      if (!response.ok) {
        const errorMsg = (data && (data.detail || data.message)) 
          ? (typeof data.detail === 'object' ? JSON.stringify(data.detail) : (data.detail || data.message))
          : `HTTP error ${response.status}`;
        throw new Error(errorMsg);
      }

      return data;
    } catch (err) {
      clearTimeout(timeout);
      if (err.name === 'AbortError') {
        throw new Error('Request timed out. Please check if backend is running on port 8000.');
      }
      throw err;
    }
  }

  // --- Health & System ---
  async checkHealth() {
    try {
      const res = await this.request('/health', { method: 'GET' });
      this.isBackendOnline = res && (res.status === 'healthy' || res.api === 'running');
      return res;
    } catch (e) {
      this.isBackendOnline = false;
      return { status: 'offline', error: e.message };
    }
  }

  // --- Authentication ---
  async login(email, password, role = 'faculty') {
    const res = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
    if (res.access_token) {
      this.setToken(res.access_token, res.user);
    }
    return res;
  }

  async register(userData) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async verifySession(token = null) {
    const tok = token || this.token;
    return this.request('/api/auth/session/verify', {
      method: 'POST',
      body: JSON.stringify({ access_token: tok }),
    });
  }

  async getMe() {
    return this.request('/api/auth/me', { method: 'GET' });
  }

  // --- Master Data: Departments ---
  async getDepartments() {
    return this.request('/api/departments', { method: 'GET' });
  }

  async createDepartment(data) {
    return this.request('/api/departments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteDepartment(id) {
    return this.request(`/api/departments/${id}`, { method: 'DELETE' });
  }

  // --- Master Data: Faculty ---
  async getFaculty(department = null) {
    const q = department ? `?department=${encodeURIComponent(department)}` : '';
    return this.request(`/api/faculty${q}`, { method: 'GET' });
  }

  async createFaculty(data) {
    return this.request('/api/faculty', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteFaculty(id) {
    return this.request(`/api/faculty/${id}`, { method: 'DELETE' });
  }

  async getFacultyAvailability(facultyId) {
    return this.request(`/api/faculty/${facultyId}/availability`, { method: 'GET' });
  }

  async updateFacultyAvailability(facultyId, unavailableSlots) {
    return this.request(`/api/faculty/${facultyId}/availability`, {
      method: 'PUT',
      body: JSON.stringify({ unavailable_slots: unavailableSlots }),
    });
  }

  // --- Master Data: Subjects ---
  async getSubjects(department = null) {
    const q = department ? `?department=${encodeURIComponent(department)}` : '';
    return this.request(`/api/subjects${q}`, { method: 'GET' });
  }

  async createSubject(data) {
    return this.request('/api/subjects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteSubject(id) {
    return this.request(`/api/subjects/${id}`, { method: 'DELETE' });
  }

  // --- Master Data: Batches ---
  async getBatches(department = null) {
    const q = department ? `?department=${encodeURIComponent(department)}` : '';
    return this.request(`/api/batches${q}`, { method: 'GET' });
  }

  async createBatch(data) {
    return this.request('/api/batches', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteBatch(id) {
    return this.request(`/api/batches/${id}`, { method: 'DELETE' });
  }

  // --- Master Data: Classrooms & Labs ---
  async getClassrooms() {
    return this.request('/api/classrooms', { method: 'GET' });
  }

  async createClassroom(data) {
    return this.request('/api/classrooms', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteClassroom(id) {
    return this.request(`/api/classrooms/${id}`, { method: 'DELETE' });
  }

  async getClassroomAvailability(roomId) {
    return this.request(`/api/classrooms/${roomId}/availability`, { method: 'GET' });
  }

  // --- Time Slots ---
  async getTimeslots() {
    return this.request('/api/timeslots', { method: 'GET' });
  }

  async createTimeslot(data) {
    return this.request('/api/timeslots', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // --- Teaching Requirements ---
  async getTeachingRequirements(batch = null) {
    const q = batch ? `?batch_code=${encodeURIComponent(batch)}` : '';
    return this.request(`/api/teaching-requirements${q}`, { method: 'GET' });
  }

  async createTeachingRequirement(data) {
    return this.request('/api/teaching-requirements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteTeachingRequirement(id) {
    return this.request(`/api/teaching-requirements/${id}`, { method: 'DELETE' });
  }

  // --- Scheduling & Generation ---
  async getSchedulingSummary(department = null, semester = null) {
    let q = [];
    if (department) q.push(`department=${encodeURIComponent(department)}`);
    if (semester) q.push(`semester=${encodeURIComponent(semester)}`);
    const qs = q.length ? `?${q.join('&')}` : '';
    return this.request(`/api/scheduling/data-summary${qs}`, { method: 'GET' });
  }

  async preCheckConstraints(department = null, semester = null) {
    let q = [];
    if (department) q.push(`department=${encodeURIComponent(department)}`);
    if (semester) q.push(`semester=${encodeURIComponent(semester)}`);
    const qs = q.length ? `?${q.join('&')}` : '';
    return this.request(`/api/constraints/pre-check${qs}`, { method: 'GET' });
  }

  async generateTimetable(params) {
    return this.request('/api/scheduling/generate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async getGenerationStatus(taskId) {
    return this.request(`/api/scheduling/status/${taskId}`, { method: 'GET' });
  }

  // --- Timetable Views & Editor ---
  async getBatchTimetable(batchCode, versionId = null) {
    const q = versionId ? `?version_id=${encodeURIComponent(versionId)}` : '';
    return this.request(`/api/timetable/batch/${batchCode}${q}`, { method: 'GET' });
  }

  async getFacultyTimetable(facultyId, versionId = null) {
    const q = versionId ? `?version_id=${encodeURIComponent(versionId)}` : '';
    return this.request(`/api/timetable/faculty/${facultyId}${q}`, { method: 'GET' });
  }

  async getRoomTimetable(roomNumber, versionId = null) {
    const q = versionId ? `?version_id=${encodeURIComponent(versionId)}` : '';
    return this.request(`/api/timetable/room/${roomNumber}${q}`, { method: 'GET' });
  }

  async getTimetableVersions(department = null, status = null) {
    let q = [];
    if (department) q.push(`department=${encodeURIComponent(department)}`);
    if (status) q.push(`status=${encodeURIComponent(status)}`);
    const qs = q.length ? `?${q.join('&')}` : '';
    return this.request(`/api/timetable/versions${qs}`, { method: 'GET' });
  }

  async updateTimetableEntry(entryId, data) {
    return this.request(`/api/timetable/entry/${entryId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async publishTimetableVersion(versionId) {
    return this.request(`/api/timetable/version/${versionId}/publish`, {
      method: 'PUT',
    });
  }

  // --- Reports & Conflicts ---
  async getConflicts(versionId = null) {
    const q = versionId ? `?version_id=${encodeURIComponent(versionId)}` : '';
    return this.request(`/api/reports/conflicts${q}`, { method: 'GET' });
  }

  async getDashboardStats() {
    return this.request('/api/reports/dashboard-stats', { method: 'GET' });
  }

  async getWorkloadReport(department = null) {
    const q = department ? `?department=${encodeURIComponent(department)}` : '';
    return this.request(`/api/reports/workload-summary${q}`, { method: 'GET' });
  }

  async getRoomUtilization() {
    return this.request('/api/reports/room-utilization', { method: 'GET' });
  }

  // --- Google Gemini AI Assistant ---
  async aiChat(message, conversationId = null) {
    return this.request('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, conversation_id: conversationId }),
    });
  }

  async aiGetChatHistory(conversationId = null) {
    const q = conversationId ? `?conversation_id=${encodeURIComponent(conversationId)}` : '';
    return this.request(`/api/ai/chat/history${q}`, { method: 'GET' });
  }

  async aiAnalyze(versionId = null) {
    const q = versionId ? `?version_id=${encodeURIComponent(versionId)}` : '';
    return this.request(`/api/ai/analyze${q}`, { method: 'GET' });
  }

  async aiSuggestSubstitute(params) {
    const qs = new URLSearchParams(params).toString();
    return this.request(`/api/ai/suggest-substitute?${qs}`, { method: 'GET' });
  }

  // --- Audit Logs ---
  async getAuditLogs() {
    return this.request('/api/audit-logs', { method: 'GET' });
  }
}

// Global API instance
window.api = new ApiService();
