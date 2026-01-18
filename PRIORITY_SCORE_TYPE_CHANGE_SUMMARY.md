# Priority Score Type Change Summary

## Overview
Changed `priority_score` field type from `Integer` to `Double` across the entire application to support decimal precision for risk-based priority scores.

## Changes Made

### Backend Changes

#### 1. Entity Layer
**File**: `backend/src/main/java/com/kdt03/ped_accident/domain/suggestion/entity/Suggestion.java`
- Changed field: `Integer priorityScore` → `Double priorityScore`
- Updated default value: `0` → `0.0`

#### 2. DTO Layer
**File**: `backend/src/main/java/com/kdt03/ped_accident/domain/suggestion/dto/CreateSuggestionRequest.java`
- Changed field: `Integer priorityScore` → `Double priorityScore`

**File**: `backend/src/main/java/com/kdt03/ped_accident/domain/suggestion/dto/SuggestionDetailResponse.java`
- Changed field: `Integer priorityScore` → `Double priorityScore`
- Updated default value in `from()` method: `0` → `0.0`

#### 3. Service Layer
**File**: `backend/src/main/java/com/kdt03/ped_accident/domain/suggestion/service/SuggestionService.java`
- Updated default values from `0` to `0.0` in multiple methods:
  - `createSuggestion()`
  - `updateSuggestion()`
  - `getSuggestionById()`
  - `getAllSuggestions()`

### Frontend Changes

#### 1. API Routes
**File**: `frontend/src/app/api/suggestions/route.ts`
- Updated GET endpoint: `item.priorityScore ?? 0.0`
- Updated POST endpoint: `priority_score != null ? priority_score : 0.0`

**File**: `frontend/src/app/api/suggestions/[id]/route.ts`
- Updated transformSuggestion: `item.priorityScore ?? 0.0`

#### 2. Type Definitions
**File**: `frontend/src/features/board/types.ts`
- Already correctly typed as `priority_score: number` (no change needed)

### Database Changes

#### 1. Schema Migration
**File**: `alter_priority_score_to_double.sql`
```sql
ALTER TABLE suggestions 
MODIFY COLUMN priority_score DOUBLE DEFAULT 0.0;
```

#### 2. Data Update Script
**File**: `update_priority_scores_simple_double.sql`
- Updated to use `DOUBLE` type
- Added `ROUND(score, 2)` for decimal precision

## Verification

### Backend Compilation
- ✅ No compilation errors found using `getDiagnostics`
- ✅ All Java files pass type checking

### Type Consistency
- ✅ Backend: `Double` type used consistently
- ✅ Frontend: `number` type used consistently
- ✅ Database: `DOUBLE` column type

## Migration Steps

To apply these changes to your database:

1. **Backup your database** before making changes
2. Run the schema migration:
   ```sql
   ALTER TABLE suggestions 
   MODIFY COLUMN priority_score DOUBLE DEFAULT 0.0;
   ```
3. Update existing priority scores:
   ```bash
   mysql -u your_username -p your_database < update_priority_scores_simple_double.sql
   ```
4. Restart your backend application
5. Test the suggestion creation and retrieval endpoints

## Testing Checklist

- [ ] Create new suggestion with calculated priority_score
- [ ] Verify priority_score displays with decimal precision
- [ ] Check suggestion list sorting by priority
- [ ] Verify suggestion detail page shows correct priority_score
- [ ] Test API endpoints return Double values correctly

## Notes

- Priority score now supports decimal precision (e.g., 45.67)
- Default value is `0.0` for all null cases
- Risk score calculation produces values in 0-100 range with 2 decimal places
- No automatic recalculation - priority_score is set once at creation time
