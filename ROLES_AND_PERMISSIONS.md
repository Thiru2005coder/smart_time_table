# Roles & Permissions (RBAC Matrix)

SmartTimetable implements a strict **Role-Based Access Control (RBAC)** model to safeguard academic integrity while enabling seamless cross-departmental collaboration.

---

## 1. User Roles Overview

| Role | Institutional Title | Scope | Primary Responsibility |
| :--- | :--- | :--- | :--- |
| **Dean / Principal** | Head of Institution / Director | Institution-wide | Master data configuration, final approval, official publishing, and audit monitoring. |
| **HOD** | Head of Department | Department / Branch | Departmental faculty assignments, subject teaching requirements, drafting, and submission. |
| **Faculty** | Assistant / Associate Professor, Lecturer | Personal | View personal weekly teaching timetable, update availability, view assigned rooms. |
| **Student** | Student / Class Representative | Section / Batch | View section timetable, exam schedules, and download/print official timetable sheets. |

---

## 2. Comprehensive RBAC Permissions Matrix

| Capability / Action | Dean / Principal | Head of Department (HOD) | Faculty / Lecturer | Student |
| :--- | :---: | :---: | :---: | :---: |
| **Manage Departments** | Full (CRUD) | View Only | View Only | — |
| **Manage Classrooms & Labs** | Full (CRUD) | View Only | View Only | View Only |
| **Manage Calendar & Period Timings** | Full (CRUD) | View Only | View Only | View Only |
| **Manage Faculty Profiles** | Institution-wide | Own Department | View Directory | — |
| **Update Personal Availability** | Any Faculty | Own Department | Own Profile | — |
| **Manage Subjects & Courses** | Institution-wide | Own Department | View Only | View Only |
| **Manage Batches & Sections** | Institution-wide | Own Department | View Only | Own Section |
| **Manage Teaching Requirements** | Institution-wide | Own Department | — | — |
| **Run Automatic Schedule Generator** | Institution-wide | Own Department | — | — |
| **Use Interactive Timetable Editor** | Full | Own Department | — | — |
| **Submit Schedule for Approval** | — | Yes | — | — |
| **Approve & Publish Official Version**| Full (Final) | — | — | — |
| **Restore Earlier Draft Version** | Full | Own Department | — | — |
| **View Official Student Timetable** | All Batches | Department Batches | All Batches | Own Section |
| **View Personal Faculty Timetable** | All Faculty | Department Faculty | Own Schedule | — |
| **View Room Occupancy Timetable** | All Rooms | All Rooms | All Rooms | — |
| **Export Timetable (PDF / Excel / CSV)**| Full | Department Scope | Personal PDF | Section PDF |
| **User Administration & Account Toggle**| Full | — | — | — |
| **View System Audit Logs** | Full | Department Scope | — | — |

---

## 3. Demo Accounts for Immediate Testing

SmartTimetable includes pre-configured demo credentials for all major roles:

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Dean / Principal** | `head@geethanjali.edu.in` | `dean123` | Full Administrative Privileges |
| **HOD (CSE)** | `hod.cse@geethanjali.edu.in` | `hod123` | CSE Department & Sections |
| **HOD (ECE)** | `hod.ece@geethanjali.edu.in` | `hod123` | ECE Department & Sections |
| **Faculty (Teacher)** | `teacher@geethanjali.edu.in` | `fac123` | Personal Timetable (`S Ramanjaneyulu`) |
| **Student (Section J)** | `student@geethanjali.edu.in` | `stu123` | Section J Timetable (`II-B.Tech-I-Sem-J`) |
