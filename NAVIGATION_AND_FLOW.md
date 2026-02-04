# Admin Dashboard - Navigation & User Flow

## 🗺️ Complete Navigation Map

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD (Root)                        │
│                      /admin/users                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
                ▼             ▼             ▼
         ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
         │   PROJECTS   │ │ DEVELOPERS   │ │  CONTRACTS   │
         │ /admin/...   │ │ /admin/...   │ │ /admin/...   │
         │  (List)      │ │  (List)      │ │  (List)      │
         └──────────────┘ └──────────────┘ └──────────────┘
                │             │             │
       [View Details]  [View Profile]  [View Details]
                │             │             │
                ▼             ▼             ▼
         ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
         │   PROJECT    │ │ DEVELOPER    │ │  CONTRACT    │
         │ DETAILS      │ │ DETAILS      │ │  DETAILS     │
         │ /projects/:id│ │ /devs/:id    │ │ /contracts/:id│
         │  (Detail)    │ │  (Detail)    │ │  (Detail)    │
         └──────────────┘ └──────────────┘ └──────────────┘
                │             │             │
       [Edit] [Assign Dev]  [Edit]      [Edit]
                │             │             │
                └─────────────┴─────────────┘
                              │
                         [Save Changes]
                              │
                    ┌─────────┴──────────┐
                    │                    │
                    ▼                    ▼
            [Success Toast]      [Return to List]
```

## 📱 User Interaction Flow

### Project Management Flow
```
1. Navigate to /admin/projects
   ↓
2. See list of 8 projects in table
   - Search by title or client
   - Filter by status
   ↓
3. Click "View Details" button
   ↓
4. Navigate to /admin/projects/:id
   ↓
5. View project information
   - Title, description, budget
   - Client, developer, status
   - Created date, last updated
   ↓
6. Click "Edit" button
   ↓
7. Edit project fields
   - Title, description
   - Status (Open/In Progress/Completed/Cancelled)
   - Budget amount
   - Assign developer from dropdown
   ↓
8. Click "Save Changes"
   ↓
9. Success notification → Return to list
   ↓
10. See updated project in list
```

### Developer Management Flow
```
1. Navigate to /admin/developers
   ↓
2. See grid of 8 developer cards
   - Search by name, email, location
   - See rating, completed projects
   ↓
3. Click "View Profile" button
   ↓
4. Navigate to /admin/developers/:id
   ↓
5. View developer profile
   - Name, email, phone, location
   - Bio, website, specializations
   - Rating, experience, projects
   - Active/Inactive status
   ↓
6. Click "Edit" button
   ↓
7. Edit developer information
   - Name, email, phone, location
   - Bio, website
   - Toggle active status
   ↓
8. Click "Save Changes"
   ↓
9. Success notification → Updated profile displayed
   ↓
10. Click back to return to list
```

### Contract Management Flow
```
1. Navigate to /admin/contracts
   ↓
2. See list of 6 contracts in table
   - Search by project or developer
   - Filter by status (active, completed, disputed, terminated)
   ↓
3. Click "View Details" button
   ↓
4. Navigate to /admin/contracts/:id
   ↓
5. View contract details
   - Project, developer, amount
   - Status, dates, duration
   - Contract summary
   ↓
6. Click "Edit" button
   ↓
7. Edit contract terms
   - Status
   - Amount
   - Start date, end date
   ↓
8. Click "Save Changes"
   ↓
9. Success notification → Updated contract displayed
   ↓
10. Click back to return to list
```

## 🔀 Alternative Flows

### Direct Navigation (URL Bar)
```
User types in browser: http://localhost:5173/admin/projects/1
   ↓
App checks if admin role ✓
App checks if email verified ✓
   ↓
AdminProjectDetails loads with ID=1
   ↓
getProjectById(1) retrieves data
   ↓
Detail page displays
```

### Assign Developer Flow
```
In AdminProjects list
   ↓
Click "Assign Developer" button
   ↓
Dialog opens showing:
   - Selected project name
   - Dropdown with all developers
   ↓
Select a developer from dropdown
   ↓
Click "Assign Developer" button
   ↓
Success notification
   ↓
Dialog closes
   ↓
List refreshes with updated assignment
```

### Navigation Buttons
```
[Back Arrow] in header
   ↓
Returns to list page (/admin/projects)
   
[Projects/Developers/Contracts] buttons
   ↓
Quick navigation to other admin sections
   
[Users/Projects/Developers/Contracts] in sidebar
   ↓
Navigate between all admin sections
```

## 📊 Data Flow

### Loading Data
```
Component Mounts
   ↓
useEffect hook runs
   ↓
Call mock data function
   - getAllProjects()
   - getAllDevelopers()
   - getAllContracts()
   ↓
Response received instantly
   ↓
setItems(response)
   ↓
Component re-renders with data
```

### Updating Data
```
User clicks "Save"
   ↓
Form validation ✓
   ↓
Call mock update function
   - updateProject(id, data)
   - updateDeveloper(id, data)
   - updateContract(id, data)
   ↓
Mock data modified in memory
   ↓
setItem(updated)
   ↓
Component re-renders
   ↓
Toast notification shown
   ↓
Page updates immediately
```

### Navigation Flow
```
User clicks link/button
   ↓
navigate('/admin/projects/1')
   ↓
React Router updates URL
   ↓
New component mounts
   ↓
useParams() gets ID from URL
   ↓
Load data with that ID
   ↓
Render component
```

## 🔐 Security Flow

```
User clicks /admin/projects
   ↓
Route renders with guards
   ↓
Check 1: EmailVerificationGuard
   └─ Is email verified? NO → Redirect to /verify-email
   └─ Is email verified? YES → Continue
   ↓
Check 2: ProtectedRoute
   └─ Is user admin? NO → Redirect to /
   └─ Is user admin? YES → Continue
   ↓
Check 3: Component loads
   └─ Render protected page
```

## 💡 State Management Flow

### List Page State
```
useState([])           ← items list
useState(true)         ← loading state
useState(null)         ← error state
useState('')           ← search term
useState('all')        ← filter value
useState(null)         ← selected item (for dialogs)
useState(false)        ← dialog open state
useState(false)        ← saving state
```

### Detail Page State
```
useState(null)         ← item data
useState(false)        ← is editing
useState(true)         ← loading state
useState({...})        ← form data
useState(false)        ← saving state
```

## 🎯 User Actions & Results

| Action | Location | Result |
|--------|----------|--------|
| Click "View Details" | List page | Navigate to detail page |
| Click "Edit" | Detail page | Switch to edit mode |
| Click "Save Changes" | Detail page | Update mock data, show success |
| Click "Cancel" | Detail page | Exit edit mode, discard changes |
| Click back arrow | Any page | Return to previous page |
| Search | List page | Filter items in real-time |
| Filter | List page | Filter items by status |
| Click "Assign Developer" | Projects list | Open assignment dialog |
| Click "Assign Developer" button | Dialog | Update assignment, close dialog |
| Click "Update Status" | Contracts list | Open status dialog |
| Click "Update Status" button | Dialog | Update status, close dialog |

## 🔄 Refresh & Reload Behavior

```
Page Reload (F5)
   ↓
All mock data reloads fresh
   ↓
All user edits are lost ⚠️
   ↓
Shows original mock data again
```

**Note**: Mock data is NOT persisted to storage. Changes are only in memory during the session.

## 📲 Responsive Design

```
Desktop (≥1024px)
   ├─ Sidebar visible
   ├─ Full width tables
   ├─ Multi-column layouts
   └─ All features visible

Tablet (768px-1023px)
   ├─ Collapsed sidebar
   ├─ Full width tables
   ├─ 2-column grids
   └─ Touch-friendly buttons

Mobile (<768px)
   ├─ No sidebar (drawer)
   ├─ Scrollable tables
   ├─ Single column layouts
   └─ Stacked forms
```

## 🎓 Example User Session

```
9:00 AM
   ↓
Admin user logs in → /admin/users
   ↓
Clicks "Projects" in sidebar → /admin/projects
   ↓
Searches for "e-commerce" → Filters to 1 project
   ↓
Clicks "View Details" → /admin/projects/1
   ↓
Reads project information
   ↓
Clicks "Edit" → Switches to edit mode
   ↓
Changes status to "in_progress"
   ↓
Clicks "Assign Developer"
   ↓
Selects "John Smith"
   ↓
Saves changes → Success notification
   ↓
Goes back to list → Sees updated project
   ↓
Clicks "Developers" in sidebar → /admin/developers
   ↓
Clicks on "John Smith" card → /admin/developers/1
   ↓
Reviews his profile
   ↓
Returns to projects → /admin/projects
   ↓
Session ends
```

---

**Document Version**: 1.0
**Date**: February 4, 2026
**Status**: Complete
