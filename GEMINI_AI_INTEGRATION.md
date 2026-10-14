# Google Gemini AI Integration

SmartTimetable integrates **Google Gemini 1.5 Flash** to provide conversational scheduling intelligence, automated conflict diagnosis, and intelligent workload optimization.

---

## 1. AI Architecture & Configuration

The AI subsystem connects through the official Google Generative AI SDK (`google-generativeai`).

### Configuration in `backend/config.py`:
```python
import google.generativeai as genai
import os

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config={
            "temperature": 0.2,       # Low temperature for factual precision
            "top_p": 0.95,
            "max_output_tokens": 1024,
        }
    )
```

---

## 2. Core AI Capabilities

### A. Conflict Explanation & Root Cause Analysis
When the OR-Tools solver encounters unassigned sessions or hard constraint deadlocks, the raw mathematical error is passed to Gemini with full contextual metadata:
- Available rooms and their capacities.
- Faculty availability matrices.
- Batch sizes and required periods.

**Prompt Template**:
```
You are an expert academic timetable coordinator for an accredited university.
Given the following conflict data:
- Affected Batch: {batch_id} ({student_count} students)
- Subject: {subject_name} ({subject_type})
- Assigned Faculty: {faculty_name}
- Failure reason: {solver_diagnostic}
- Current room allocations: {room_status}

Analyze the conflict and provide:
1. Clear explanation of why this session could not be placed.
2. 3 concrete, actionable steps the HOD or Dean can take (e.g. increase room capacity, reassign to co-faculty, or swap time slot).
```

---

### B. Natural Language Timetable Queries
Faculty, students, and administrators can query schedules in plain conversational English:

- *"Show me all free classrooms with projectors on Wednesday Period 3."*
- *"Does Dr. Rao have any classes scheduled on Friday afternoon?"*
- *"Which sections have more than two lab blocks on the same day?"*
- *"Suggest a 2-hour continuous slot where both Section A and Section B can attend a guest lecture."*

The backend extracts entities (Day, Time, Faculty, Room) using Gemini function calling or structured prompts, queries the MongoDB timetable collection, and synthesizes an easy-to-read response.

---

### C. Smart Substitution Recommendations
When an instructor is absent:
1. Gemini inspects the affected batch and subject syllabus.
2. Cross-references departmental faculty with free periods during the slot.
3. Ranks available substitute teachers considering subject specialization and weekly workload balance.

---

## 3. Fallback & Offline Resilience

If `GEMINI_API_KEY` is not configured or network access is restricted:
- The system automatically degrades gracefully.
- Core timetable generation continues unaffected using the built-in mathematical solver.
- Conflict explanations fallback to rule-based diagnostic messages (e.g. *"Room capacity 50 is less than Batch size 60"*).
- The user is notified with non-intrusive status badges.
