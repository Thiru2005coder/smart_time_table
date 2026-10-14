# Frontend Architecture & UI Guide

This guide details the frontend architecture, design system, rendering engines, and multi-institution templates powering **SmartTimetable**.

---

## 1. File Structure

The frontend consists of three primary components:

```
frontend/
├── SmartTimetable (1).html    # Self-contained, production-ready single-page application
├── api.js                     # Centralized asynchronous API client for FastAPI backend
└── style.css                  # Extended modern CSS design system with custom tokens
```

---

## 2. Supported Institution Types

SmartTimetable features dedicated configuration objects and official templates for 5 distinct institution categories:

### A. Engineering College (B.Tech)
- **Sample Institution**: Geethanjali College of Engineering & Technology
- **Department**: Department of Computer Science & Engineering
- **Curriculum / Sem**: II-B.Tech I-Semester J-Section (ODD Sem)
- **Period Duration**: 55 minutes
- **Periods**: 6 teaching periods + 1 mandatory Lunch break
- **Key Subjects**: Advanced Data Structures (ADS), OOP Java (OOPJ), Database Systems (DBMS), Digital Logic Design (DLD), BEFA, Environmental Science.
- **Labs**: 2-period contiguous laboratory blocks (ADS Lab, OOPJ Lab, DBMS Lab, Python Data Visualization Lab).
- **Special Activities**: Coding Club, Mentoring, Library & Sports.

### B. University (Autonomous Engineering & Computing)
- **Sample Institution**: University College of Engineering & Technology (Autonomous)
- **Curriculum / Sem**: III-B.Tech I-Semester CSE-A
- **Key Subjects**: Operating Systems (OS), Computer Networks (CN), Design & Analysis of Algorithms (DAA), AI & Machine Learning, Web Technologies (WT), Software Engineering.
- **Labs**: CN Lab, OS Lab, WT Lab, AI/ML Lab, Mini-Project blocks.

### C. Degree College (B.Com / B.Sc)
- **Sample Institution**: Government Autonomous Degree College
- **Curriculum**: II-B.Com (Computer Applications) Section-A
- **Key Subjects**: Advanced Financial Accounting (FA), Business Law (BL), Income Tax & Auditing (IT), Business Economics (BE), Computer Applications (CA).
- **Labs / Practical**: Tally ERP Lab, E-Commerce & Web Applications Lab, Office Automation & Python, Soft Skills / Communication.

### D. Intermediate College (Junior College)
- **Sample Institution**: Sri Chaitanya / Narayana Junior College (Intermediate)
- **Curriculum / Stream**: Senior Intermediate (MPC-1 Batch)
- **Key Subjects**: Mathematics 2A (Algebra & Probability), Mathematics 2B (Calculus & Geometry), Senior Physics, Senior Chemistry, General English, Sanskrit / Telugu.
- **Special Sessions**: JEE Problem Practice, Physics & Chemistry Practicals, Guided Study Hour, Doubt Clearing.

### E. School (Senior Secondary)
- **Sample Institution**: Model Senior Secondary School (CBSE / State Board)
- **Curriculum**: Class X - Section A
- **Subjects**: English Language, Mathematics, General Science, Science Practicals Lab, Physical Education, Sports & Activities.

---

## 3. The Official Institutional Sheet Layout

The official timetable sheet reproduces the accredited format mandated by university inspection committees and technical boards:

```
+-----------------------------------------------------------------------------------+
|               GEETHANJALI COLLEGE OF ENGINEERING & TECHNOLOGY                     |
|                   Department of Computer Science & Engineering                    |
|                                     ODD Sem                                       |
+-----------------------------------------------------------------------------------+
| Year/Sem/Sec: II-B.Tech I-Semester J-Section                   Room No: 307 (RED) |
| Class Teacher: K Gayathri Sandhya | A.Y.: 2026-27 | Version: 02 | W.E.F: 05-10-26 |
+-------+-------------+-------------+-------------+-------------+-------+-----------+
| TIME  | 09.00-09.55 | 09.55-10.50 | 10.50-11.45 | 11.45-12.40 | 12.40 | 01.30...  |
| PERIOD|      1      |      2      |      3      |      4      | LUNCH |     5     |
+-------+-------------+-------------+-------------+-------------+-------+-----------+
| Mon   |    OOPJ     |     ADS     | <--- ADS LAB (2 slots) -> |       | Coding... |
| Tue   | <- DBMS LAB (2 slots) ->  |     DLD     |    DBMS     |   L   |    ADS    |
| Wed   |     ADS     |    BEFA     | <--- DVP LAB (2 slots) -> |   U   |   OOPJ    |
| Thu   |     ADS     |     DLD     |    DBMS     |    BEFA     |   N   |   OOPJ    |
| Fri   | <- Coding 401 & 402 ----> |    DBMS     |     DLD     |   C   | Club Act  |
| Sat   |     ES      |    BEFA     | <--- OOPJ LAB (2 slots) ->|   H   |    DLD    |
+-------+-------------+-------------+-------------+-------------+-------+-----------+
| S.No  | Subject Name              | Course Code | Faculty Name        | Periods   |
|   1   | Advanced Data Structures  | 25CS21001   | S Ramanjaneyulu     |     4     |
|   2   | Object Oriented Java      | 25CS21002   | P Chandra Shekar R. |     4     |
|  ...  | ...                       | ...         | ...                 |    ...    |
+-------+---------------------------+-------------+---------------------+-----------+
| Class Teacher / Incharge | Time Table Coordinator | HOD | Principal / Dean        |
+-----------------------------------------------------------------------------------+
```

### Visual Styling Highlights:
- **College Title**: `#153a8a` (Deep Navy Blue, 23px, bold italic).
- **Department Title**: `#167338` (Academic Forest Green, 17.5px, bold).
- **Room Number**: `#d32f2f` (Bold Red, 15px).
- **Time Header Row**: `#c6efce` background with `#0f5132` dark green text.
- **Period Header Row**: `#ffeb9c` background with `#78350f` dark amber text.
- **Day Cells**: `#c6efce` background with `#0f5132` green font.
- **Lunch Column**: Spans all 6 days with `rowspan="6"`, styled with `#ffeb9c` background and vertically centered bold text.
- **Lab Cells**: Spans 2 continuous periods with `colspan="2"`, highlighted in gold `#fff3cd`.
- **Reference Table**: Alternating rows with Subject Name, Course Code, Faculty Incharge, and total allotted periods.
- **Signatures Footer**: Dashed top border with 4 official designation slots.

---

## 4. 1-Click Interactive Features

1. **Institution Quick-Switch Badges**:
   Four interactive pills above the sheet let administrators, evaluators, and students toggle between Engineering, University, Degree, and Intermediate views with one click:
   ```html
   <div class="inst-badges">
     <button class="inst-badge-btn active" data-switch="engg">Engineering College (B.Tech)</button>
     <button class="inst-badge-btn" data-switch="univ">University (Autonomous)</button>
     <button class="inst-badge-btn" data-switch="deg">Degree College (B.Com/B.Sc)</button>
     <button class="inst-badge-btn" data-switch="inter">Intermediate College (Junior College)</button>
   </div>
   ```

2. **Official View vs. Grid View Toggle**:
   Users can effortlessly switch between the formal institutional sheet view and the weekly grid cell matrix view.

3. **Print / Save as PDF Engine**:
   Integrated `@media print` rules automatically optimize the layout for legal/A4 paper:
   - Sets orientation to landscape: `@page { size: landscape; margin: 8mm; }`.
   - Strips application sidebars, navigation controls, and action buttons.
   - Preserves crisp high-contrast black borders for photocopier and notice-board clarity.
