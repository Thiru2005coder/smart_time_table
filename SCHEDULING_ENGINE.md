# Scheduling & Constraint Optimization Engine

SmartTimetable incorporates a dual scheduling engine combining **mathematical constraint programming (Google OR-Tools CP-SAT)** and an **in-memory greedy heuristic scheduler** with live conflict validation.

---

## 1. Constraint Satisfaction Problem (CSP) Formulation

In mathematical optimization, college timetable generation is formulated as a Constraint Satisfaction Problem:

Let:
- $T$ be the set of timeslots $(d, p)$ where $d \in \text{Days}$, $p \in \text{Periods}$.
- $F$ be the set of faculty members.
- $B$ be the set of student batches / sections.
- $R$ be the set of classrooms and laboratories.
- $S$ be the set of academic courses (lectures, labs, seminars).

The decision variable is a binary matrix:
$$X_{b, s, f, r, d, p} \in \{0, 1\}$$
where $X_{b, s, f, r, d, p} = 1$ if Batch $b$ attends Course $s$ taught by Faculty $f$ in Room $r$ on Day $d$ during Period $p$.

---

## 2. Hard Constraints (Mandatory)

A schedule is **invalid** if any hard constraint is violated:

1. **Faculty No-Clash**:
   A faculty member cannot teach more than one session at the same time:
   $$\forall f \in F, \forall (d, p) \in T: \sum_{b, s, r} X_{b, s, f, r, d, p} \le 1$$

2. **Batch No-Clash**:
   A student section can only attend one class or lab simultaneously:
   $$\forall b \in B, \forall (d, p) \in T: \sum_{s, f, r} X_{b, s, f, r, d, p} \le 1$$

3. **Room / Lab No-Clash**:
   A room or laboratory cannot host multiple classes at the same time:
   $$\forall r \in R, \forall (d, p) \in T: \sum_{b, s, f} X_{b, s, f, r, d, p} \le 1$$

4. **Faculty Availability**:
   No sessions can be scheduled when a faculty member is marked unavailable:
   $$\text{If } (d, p) \in \text{Unavailable}(f) \implies X_{b, s, f, r, d, p} = 0$$

5. **Room Seating Capacity**:
   The assigned room capacity must accommodate the total student count of the batch:
   $$\text{Capacity}(r) \ge \text{Students}(b)$$

6. **Laboratory Subject Room Type**:
   Practical courses marked `Type = "Lab"` must be assigned to facilities where `RoomType = "Laboratory"`.

7. **Continuous Laboratory Blocks**:
   Practical sessions must be scheduled as uninterrupted contiguous blocks (typically 2 or 3 periods). They cannot be split across lunch or across different days.

8. **Required Weekly Session Count**:
   Each course requirement $(b, s, f)$ must be satisfied exactly $N$ times per week:
   $$\sum_{r, d, p} X_{b, s, f, r, d, p} = \text{RequiredSessions}(b, s)$$

---

## 3. Soft Constraints & Optimization Objectives

When multiple conflict-free solutions exist, the solver maximizes an objective function $Z$ to produce optimal quality schedules:

1. **Even Workload Distribution**:
   Avoids clustering all lectures on Monday and Tuesday; distributes sessions evenly across the 6 working days.
2. **Minimizing Idle Gaps**:
   Reduces gaps (windows) between classes for both students and faculty.
3. **Faculty Daily Limits**:
   Prevents faculty members from teaching more than 4 hours in a single day.
4. **Balanced Lab Distribution**:
   Spreads lab sessions across different afternoons rather than overloading a single day.

---

## 4. Live Conflict Diagnostic Algorithm

The frontend and backend run an instant validator on any manual entry or move:

```javascript
function validate(tt) {
  const conflicts = [];
  const seen = {};
  
  tt.forEach((entry, idx) => {
    // Check batch, faculty, and room collisions
    [['batch', entry.b], ['faculty', entry.f], ['room', entry.r]].forEach(([type, id]) => {
      const key = `${type}_${id}_${entry.d}_${entry.p}`;
      if (seen[key] != null) {
        const other = tt[seen[key]];
        conflicts.push(`${type.toUpperCase()} ${id} is double-booked on Day ${entry.d}, Period ${entry.p} between (${other.s}) and (${entry.s}).`);
      } else {
        seen[key] = idx;
      }
    });

    // Check faculty availability
    if ((unavailability[entry.f] || []).includes(`${entry.d}-${entry.p}`)) {
      conflicts.push(`Faculty ${entry.f} is unavailable on Day ${entry.d}, Period ${entry.p}.`);
    }

    // Check room capacity
    const room = rooms.find(r => r.id === entry.r);
    const batch = batches.find(b => b.id === entry.b);
    if (room && batch && room.capacity < batch.students) {
      conflicts.push(`Room ${entry.r} seats ${room.capacity} but batch ${entry.b} has ${batch.students} students.`);
    }
  });

  return conflicts;
}
```

---

## 5. Teacher Leave & Substitution Logic

When a faculty member applies for leave:
1. The system identifies all affected sessions $(b, s, r, d, p)$ for that teacher.
2. The substitution service queries all faculty in the same department who:
   - Are free during period $p$ on day $d$.
   - Have weekly teaching hours below their maximum allowance.
   - Are qualified to teach the subject or related disciplines.
3. Recommendations are ranked and presented to the HOD for 1-click temporary assignment.
