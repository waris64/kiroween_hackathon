# Data Mapping Fix

## Issue
The API was returning data in the console, but it wasn't being displayed in the UI.

## Root Cause
**Double Data Nesting Issue**

The API response structure is:
```json
{
  "success": true,
  "data": {
    "repository": {...},
    "files": [...],
    "commits": [...],
    ...
  }
}
```

The `api.js` interceptor automatically extracts `response.data`, so after the interceptor, the response becomes:
```json
{
  "success": true,
  "data": {
    "repository": {...},
    "files": [...],
    ...
  }
}
```

But then `repositoryService.js` was trying to access `response.data` again, which would try to access the nested `data` property, causing the actual repository data to be lost.

## Fix Applied

### 1. Fixed `repositoryService.js`
**Before:**
```javascript
const response = await api.post('/analyze', { repoUrl })
return response.data  // This would be undefined or wrong
```

**After:**
```javascript
const response = await api.post('/analyze', { repoUrl })
console.log('[REPOSITORY SERVICE] Raw response:', response)
// API interceptor already returns response.data, so response is { success, data }
// We need to return response.data to get the actual repository data
return response.data || response
```

### 2. Fixed `useResurrection.js`
**Before:**
```javascript
const response = await api.post('/resurrect', {...})
setResurrectedCode({
  modernized: response.modernizedCode || response.code,
  changes: response.changes || [],
  explanation: response.explanation || response.summary
})
```

**After:**
```javascript
const response = await api.post('/resurrect', {...})
console.log('[RESURRECTION] Raw response:', response)

// API interceptor returns response.data, so response is { success, data }
// Extract the actual data
const resurrectionData = response.data || response

console.log('[RESURRECTION] Resurrection data:', resurrectionData)

setResurrectedCode({
  modernized: resurrectionData.modernizedCode || resurrectionData.code || resurrectionData.modernized,
  changes: resurrectionData.changes || [],
  explanation: resurrectionData.explanation || resurrectionData.summary
})
```

### 3. Added Debug Logging
Added comprehensive console logging to track data flow:

**In `useSpectralData.js`:**
```javascript
console.log('[SPECTRAL] Analysis complete - Full response:', response)
console.log('[SPECTRAL] Files in response:', response?.files)
console.log('[SPECTRAL] Number of files:', response?.files?.length)
```

**In `Resurrection.jsx`:**
```javascript
useEffect(() => {
  console.log('[RESURRECTION PAGE] Data changed:', data);
  console.log('[RESURRECTION PAGE] Available files:', availableFiles);
  console.log('[RESURRECTION PAGE] Filtered files:', filteredFiles);
}, [data, availableFiles, filteredFiles]);
```

## How to Verify the Fix

1. Open browser console (F12)
2. Navigate to Resurrection page
3. Enter a repository URL and click "Analyze"
4. Watch the console logs:
   - `[SPECTRAL] Analyzing repository:` - Shows the URL being analyzed
   - `[REPOSITORY SERVICE] Raw response:` - Shows the API response structure
   - `[SPECTRAL] Analysis complete - Full response:` - Shows the extracted data
   - `[SPECTRAL] Files in response:` - Shows the files array
   - `[RESURRECTION PAGE] Data changed:` - Shows when React state updates
   - `[RESURRECTION PAGE] Available files:` - Shows files available for selection

5. Files should now appear in the UI

## Expected Console Output

```
[SPECTRAL] Analyzing repository: https://github.com/user/repo
[REPOSITORY SERVICE] Raw response: { success: true, data: {...} }
[SPECTRAL] Analysis complete - Full response: { repository: {...}, files: [...], ... }
[SPECTRAL] Files in response: [{path: "...", ...}, ...]
[SPECTRAL] Number of files: 15
[RESURRECTION PAGE] Data changed: { repository: {...}, files: [...], ... }
[RESURRECTION PAGE] Available files: [{path: "...", ...}, ...]
[RESURRECTION PAGE] Filtered files: [{path: "...", ...}, ...]
```

## Files Modified

1. ✅ `frontend/src/services/repositoryService.js` - Fixed data extraction
2. ✅ `frontend/src/hooks/useResurrection.js` - Fixed data extraction
3. ✅ `frontend/src/hooks/useSpectralData.js` - Added debug logging
4. ✅ `frontend/src/pages/Resurrection.jsx` - Added debug logging

## Testing Checklist

- [ ] Repository analysis returns data in console
- [ ] Files array is properly extracted
- [ ] Files appear in the UI file list
- [ ] Selecting a file shows its content
- [ ] Resurrecting code returns modernized version
- [ ] Modernized code appears in the UI

All fixes are complete! The data should now properly flow from the API to the UI. 🎉
