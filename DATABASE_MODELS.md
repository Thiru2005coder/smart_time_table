# Database Models & Schemas

SmartTimetable uses **MongoDB** as its primary persistent datastore, accessed asynchronously via the **Motor** client library. Document models and API payloads are validated using **Pydantic v2**.

---

## 1. Collections Overview

The database contains the following core collections:

```
smarttimetable/
├── departments
├── faculty
├── subjects
├── classrooms
├── batches
├── time_slots
├── teaching_requirements
├── timetables
├── substitutions
└── audit_logs
```

---

## 2. Collection Schemas & Sample Documents

### A. `departments`
Stores academic divisions or branches within the institution.

```json
{
  "_id": "ObjectId('65a123...')",
  "code": "CSE",
  "name": "Department of Computer Science & Engineering",
  "hod_id": "F01",
  "created_at": "2026-10-14T09:00:00Z"
}
```

---

### B. `faculty`
Faculty profiles, maximum allowed weekly periods, and current workload.

```json
{
  "_id": "ObjectId('65a124...')",
  "faculty_code": "F01",
  "name": "S Ramanjaneyulu",
  "email": "s.ram@geethanjali.edu.in",
  "department": "CSE",
  "designation": "Associate Professor",
  "max_weekly_periods": 18,
  "is_active": true,
  "availability": {
    "monday": [0, 1, 2, 3, 4, 5],
    "tuesday": [0, 1, 2, 3],
    "wednesday": [0, 1, 2, 3, 4, 5],
    "thursday": [0, 1, 2, 3, 4, 5],
    "friday": [0, 1, 2, 3, 4, 5],
    "saturday": [0, 1, 2, 3]
  }
}
```

---

### C. `subjects`
Curriculum definitions, weekly credit hours, and laboratory flags.

```json
{
  "_id": "ObjectId('65a125...')",
  "code": "25CS21001",
  "title": "Advanced Data Structures (ADS)",
  "short_name": "ADS",
  "department": "CSE",
  "semester": 3,
  "type": "Lecture",
  "weekly_periods": 4,
  "credits": 4,
  "requires_lab": false
}
```

For practical subjects:
```json
{
  "_id": "ObjectId('65a126...')",
  "code": "25CS21L01",
  "title": "Advanced Data Structures Lab (ADS Lab)",
  "short_name": "ADS LAB",
  "department": "CSE",
  "semester": 3,
  "type": "Lab",
  "weekly_periods": 2,
  "credits": 1.5,
  "requires_lab": true,
  "contiguous_periods": 2
}
```

---

### D. `classrooms`
Physical teaching spaces, capacities, and specialized equipment.

```json
{
  "_id": "ObjectId('65a127...')",
  "room_number": "307",
  "building": "Block B",
  "floor": 3,
  "type": "Classroom",
  "capacity": 70,
  "equipment": ["Projector", "Audio System", "Green Board"],
  "is_active": true
}
```

For laboratories:
```json
{
  "_id": "ObjectId('65a128...')",
  "room_number": "LAB-401",
  "building": "Block B",
  "floor": 4,
  "type": "Laboratory",
  "capacity": 65,
  "equipment": ["65 Desktop PCs", "High-speed LAN", "Dual Projectors"],
  "lab_type": "Computer Science Lab",
  "is_active": true
}
```

---

### E. `batches`
Student sections, academic year, semester, and enrolled student counts.

```json
{
  "_id": "ObjectId('65a129...')",
  "batch_code": "II-B.Tech-I-Sem-J",
  "academic_year": "2026-27",
  "year": 2,
  "semester": 3,
  "section": "J",
  "department": "CSE",
  "student_count": 60,
  "class_teacher": "K Gayathri Sandhya",
  "default_room": "307"
}
```

---

### F. `timetables`
Complete published or draft institutional schedules with version control.

```json
{
  "_id": "ObjectId('65a130...')",
  "academic_year": "2026-27",
  "term": "ODD Sem",
  "institution_type": "engg",
  "version": 2,
  "status": "published",
  "published_by": "Dr. R. Sharma (Principal)",
  "published_at": "2026-10-14T10:00:00Z",
  "grid": [
    {
      "batch_code": "II-B.Tech-I-Sem-J",
      "subject_code": "25CS21002",
      "subject_name": "OOPJ",
      "faculty_code": "F02",
      "faculty_name": "P Chandra Shekar Reddy",
      "room_number": "307",
      "day": 0,
      "period": 0,
      "is_lab": false
    },
    {
      "batch_code": "II-B.Tech-I-Sem-J",
      "subject_code": "25CS21L01",
      "subject_name": "ADS LAB",
      "faculty_code": "F01",
      "faculty_name": "S Ramanjaneyulu",
      "room_number": "LAB-401",
      "day": 0,
      "period": 2,
      "span": 2,
      "is_lab": true
    }
  ]
}
```

---

## 3. Database Indexes

Recommended compound indexes for sub-millisecond retrieval:

```javascript
// Ensure no double bookings at database level
db.timetables.createIndex({ "grid.day": 1, "grid.period": 1, "grid.faculty_code": 1 });
db.timetables.createIndex({ "grid.day": 1, "grid.period": 1, "grid.room_number": 1 });
db.timetables.createIndex({ "grid.day": 1, "grid.period": 1, "grid.batch_code": 1 });

// Fast batch and faculty timetable lookups
db.timetables.createIndex({ "status": 1, "institution_type": 1, "version": -1 });
db.faculty.createIndex({ "faculty_code": 1 }, { unique: true });
db.batches.createIndex({ "batch_code": 1 }, { unique: true });
```
