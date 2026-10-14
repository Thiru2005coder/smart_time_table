# Backend REST API Reference

The **SmartTimetable** backend is built on **FastAPI**, providing high-performance, asynchronous endpoints with automated OpenAPI / Swagger documentation (`/docs`) and ReDoc (`/redoc`).

---

## 1. Base URL & Common Headers

- **Base URL**: `http://localhost:8000` (or configured `HOST:PORT`)
- **Interactive Documentation**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Standard Request Headers
```http
Content-Type: application/json
Authorization: Bearer <JWT_ACCESS_TOKEN>
```

---

## 2. API Endpoint Catalog

### A. Health & System
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Server status, database ping, and uptime check | No |

---

### B. Authentication & User Management (`/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Authenticate with email/password; returns JWT token and user profile | No |
| `POST` | `/auth/register` | Register a new user account (Admin / Dean only) | Yes (Admin) |
| `GET` | `/auth/me` | Fetch currently authenticated user session details | Yes |
| `POST` | `/auth/session/verify`| Verify Supabase auth token and map to internal role | Yes |
| `POST` | `/auth/logout` | Invalidate current session token | Yes |

---

### C. Departments (`/departments`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/departments` | List all academic departments / branches |
| `POST` | `/departments` | Create a new department (Code, Name, HOD ID) |
| `GET` | `/departments/{id}` | Retrieve department details |
| `PATCH`| `/departments/{id}` | Update department name or assigned HOD |
| `DELETE`| `/departments/{id}`| Archive or remove a department |

---

### D. Faculty & Availability (`/faculty`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/faculty` | List faculty members (optional filter by department) |
| `POST` | `/faculty` | Register a new faculty member (Name, Code, Max weekly hours) |
| `GET` | `/faculty/{id}` | Retrieve individual faculty profile and workload stats |
| `PATCH`| `/faculty/{id}` | Update faculty details or maximum period limit |
| `DELETE`| `/faculty/{id}`| Deactivate or archive faculty profile |
| `GET` | `/faculty/{id}/availability` | Fetch day-slot availability matrix (e.g. `["0-1", "2-4"]`) |
| `PUT` | `/faculty/{id}/availability` | Save preferred or unavailable timeslots |

---

### E. Subjects & Course Catalog (`/subjects`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/subjects` | List subjects (filter by department, semester, lecture vs. lab) |
| `POST` | `/subjects` | Create course (Code, Title, Department, Credits, Type, Required Hours) |
| `GET` | `/subjects/{id}` | Get course curriculum details |
| `PATCH`| `/subjects/{id}` | Update subject metadata or lecture hour requirements |
| `DELETE`| `/subjects/{id}`| Archive subject |

---

### F. Classrooms & Laboratories (`/rooms`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/rooms` | List all rooms and laboratories (filter by type, capacity) |
| `POST` | `/rooms` | Register room (Number, Type: `Classroom` or `Laboratory`, Seating, Projector) |
| `GET` | `/rooms/{id}` | Retrieve room specifications |
| `PATCH`| `/rooms/{id}` | Update capacity or equipment status |
| `DELETE`| `/rooms/{id}`| Remove or decommission room |

---

### G. Student Batches & Sections (`/batches`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/batches` | List student batches (Year, Semester, Section, Student Count) |
| `POST` | `/batches` | Create batch/section (e.g., `II-B.Tech-I-Sem-J`, 60 students) |
| `GET` | `/batches/{id}` | Fetch section details |
| `PATCH`| `/batches/{id}` | Update student count or assigned classroom |
| `DELETE`| `/batches/{id}`| Archive batch |

---

### H. Time Slots & Academic Calendar (`/time-slots`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/time-slots` | Fetch institutional period timings and break intervals |
| `POST` | `/time-slots` | Configure period slots (e.g., `Period 1: 09:00 - 09:55`) |
| `PUT` | `/time-slots` | Batch update institution time slot structure |

---

### I. Teaching Requirements (`/teaching-requirements`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/teaching-requirements` | List requirements connecting Batch + Subject + Faculty + Room |
| `POST` | `/teaching-requirements` | Create requirement (Batch, Subject, Faculty, Room Type, Weekly Sessions) |
| `DELETE`| `/teaching-requirements/{id}` | Remove teaching assignment |

---

### J. Scheduling & Timetables (`/timetables` & `/scheduling`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/timetables/generate` | Trigger automated solver for a batch, department, or entire college |
| `GET` | `/timetables/results/{job_id}` | Poll generation job status, conflict metrics, and quality score |
| `GET` | `/timetables/active` | Get the currently published active institutional schedule |
| `GET` | `/timetables/batch/{batch_id}` | Retrieve timetable for a specific student section |
| `GET` | `/timetables/faculty/{faculty_id}` | Retrieve personalized schedule for a faculty member |
| `GET` | `/timetables/room/{room_id}` | Retrieve weekly occupancy matrix for a classroom/lab |
| `POST` | `/timetables/entry/move` | Move an entry to a new day/slot with live conflict validation |
| `POST` | `/timetables/publish` | Formally approve and publish draft timetable version |

---

### K. Reports & Export (`/reports`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/reports/export/csv` | Download complete institutional schedule as CSV |
| `GET` | `/reports/export/excel` | Download multi-sheet Excel workbook (Batches, Faculty, Rooms) |
| `GET` | `/reports/export/pdf` | Download official formatted PDF timetable sheets |

---

### L. AI Scheduling Assistant (`/ai`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/ai/assistant/chat` | Interactive natural language prompt with timetable context |
| `POST` | `/ai/conflicts/explain`| Plain English root-cause analysis of schedule bottleneck |
| `POST` | `/ai/substitutions/suggest`| Recommend best replacement faculty for an absent teacher |
