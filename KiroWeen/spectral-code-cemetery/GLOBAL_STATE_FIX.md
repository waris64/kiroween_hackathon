# Global State Fix - Cemetery Page Data Issue

## Problem
The API was returning data in the console, but the Cemetery page showed "No souls found" even after analyzing a repository on the Landing page.

## Root Cause
**State Isolation Between Components**

Each component that used `useSpectralData()` was creating its own **isolated instance** of state:

1. Landing page analyzes repository → Stores data in Landing's state
2. User navigates to Cemetery page → Cemetery creates **new empty state**
3. Cemetery has no data → Shows "No souls found"

The data wasn't being shared across pages because each hook call created a new, independent state.

## Solution
**Global State Management with React Context**

Updated the existing `SpectralContext` to include API integration, so all pages share the same repository data.

### Architecture Flow:
```
Landing Page → analyzeRepo() → SpectralContext (Global State)
                                      ↓
Cemetery Page → useSpectralData() → Reads from SpectralContext
Resurrection Page → useSpectralData() → Reads from SpectralContext
```

## Changes Made

### 1. Updated `SpectralContext.jsx`

**Added:**
- `data` field to store full API response
- `analyzeRepo()` method with API integration
- Automatic file extraction when data is set
- Compatibility methods for existing code

**Key Features:**
```javascript
const initialState = {
  repository: null,
  data: null, // Full repository data from API
  files: [],
  // ... other state
}

// New action type
SET_DATA: 'SET_DATA'

// API Integration
const analyzeRepo = useCallback(async (repoUrl) => {
  dispatch({ type: ActionTypes.SET_ANALYZING, payload: true })
  
  const response = await repositoryService.analyzeRepository(repoUrl)
  
  dispatch({ type: ActionTypes.SET_DATA, payload: response })
  dispatch({ type: ActionTypes.SET_ANALYZING, payload: false })
  
  return response
}, [])
```

### 2. Updated `useSpectralData.js`

**Before:** Created new state instance
**After:** Uses global SpectralContext

```javascript
import { useSpectral } from '../context/SpectralContext'

export function useSpectralData() {
  const context = useSpectral()
  
  // Return compatible interface
  return {
    data: context.data,
    isLoading: context.isLoading,
    error: context.error,
    repository: context.repository,
    files: context.files,
    isAnalyzing: context.isAnalyzing,
    analyzeRepo: context.analyzeRepo,
    // ... other methods
  }
}
```

### 3. App.jsx Already Had Provider

The `SpectralProvider` was already wrapping the entire app:

```javascript
<SpectralProvider>
  <Router>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="cemetery" element={<Cemetery />} />
        <Route path="resurrection" element={<Resurrection />} />
      </Route>
    </Routes>
  </Router>
</SpectralProvider>
```

## How It Works Now

### 1. Landing Page Flow:
```
User enters URL → Click "Analyze"
  ↓
Landing calls analyzeRepo(url)
  ↓
SpectralContext makes API call
  ↓
Response stored in global context
  ↓
Navigate to Cemetery
```

### 2. Cemetery Page Flow:
```
Cemetery mounts
  ↓
Calls useSpectralData()
  ↓
Reads data from SpectralContext
  ↓
data.files available immediately
  ↓
Files displayed in UI ✅
```

### 3. Resurrection Page Flow:
```
Resurrection mounts
  ↓
Calls useSpectralData()
  ↓
Reads same data from SpectralContext
  ↓
Files available for resurrection ✅
```

## Benefits

1. **Data Persistence** - Data survives navigation between pages
2. **Single Source of Truth** - All pages read from same state
3. **No Prop Drilling** - No need to pass data through navigation
4. **Automatic Updates** - When data changes, all pages update
5. **Backward Compatible** - Existing code continues to work

## Testing

### Test Scenario 1: Landing → Cemetery
1. Go to Landing page
2. Enter repository URL: `https://github.com/expressjs/express`
3. Click "Analyze"
4. Wait for analysis to complete
5. Navigate to Cemetery page
6. **Expected:** Files should be displayed ✅

### Test Scenario 2: Direct Cemetery Access
1. Go directly to Cemetery page (without analyzing)
2. **Expected:** "No souls found" message (correct behavior)
3. Go to Landing, analyze a repository
4. Return to Cemetery
5. **Expected:** Files should now be displayed ✅

### Test Scenario 3: Resurrection Page
1. Analyze repository on Landing
2. Navigate to Resurrection page
3. **Expected:** Files available for selection ✅

## Console Logs to Verify

When analyzing a repository, you should see:

```
[SPECTRAL CONTEXT] Analyzing repository: <url>
[REPOSITORY SERVICE] Raw response: { success: true, data: {...} }
[SPECTRAL CONTEXT] Analysis complete - Full response: {...}
[SPECTRAL CONTEXT] Files in response: [...]
[SPECTRAL CONTEXT] Number of files: X
```

When Cemetery page loads with data:
```
[CEMETERY] Data available: {...}
[CEMETERY] Files count: X
```

## Files Modified

1. ✅ `frontend/src/context/SpectralContext.jsx` - Added API integration
2. ✅ `frontend/src/hooks/useSpectralData.js` - Now uses global context
3. ✅ `frontend/src/contexts/SpectralContext.jsx` - Deleted (duplicate)

## Backward Compatibility

All existing code continues to work because `useSpectralData()` returns the same interface:

```javascript
const { data, files, isLoading, error, analyzeRepo } = useSpectralData()
```

No changes needed in:
- Landing.jsx ✅
- Cemetery.jsx ✅
- Resurrection.jsx ✅
- TimeTravel.jsx ✅

## Summary

The Cemetery page now displays data because:
1. ✅ Repository analysis stores data in **global context**
2. ✅ Cemetery reads from **same global context**
3. ✅ Data persists across page navigation
4. ✅ All pages share the same repository data

The "No souls found" issue is now fixed! 🎉
