# Add to imports
from routes import (
    auth,
    faculty,
    subjects,
    classrooms,
    batches,
    timeslots,
    departments,
    timetable,
    scheduling,
    substitution,
    reports,
    ai_assistant,
    notifications,
    constraints,  # ADD THIS
)

# Add to route registration
app.include_router(constraints.router, prefix="/api/constraints", tags=["Constraint Analysis"])