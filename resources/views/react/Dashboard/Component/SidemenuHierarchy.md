/**
 * Sidebar Menu Hierarchy Documentation
 * 
 * This document explains how the hierarchical menu system works based on menu_order_index
 */

## Data Structure

The systems data structure follows this format:

```javascript
[
    {
        "system_id": "718fbf74-9f35-4f46-9fa2-966135c62d21",
        "system_name": "Central User",
        "system_description": "Central User Management",
        "system_is_active": true,
        "access_list": [
            {
                "menu_id": "718fbf74-9f35-4f46-9fa2-966135c62d20",
                "menu_name": "User Management",
                "menu_description": "User Management",
                "menu_path": "/user-management",
                "menu_order_index": 1,
                "menu_is_active": true
            },
            {
                "menu_id": "718fbf74-9f35-4f46-9fa2-966135c62d21",
                "menu_name": "System",
                "menu_description": "System",
                "menu_path": "/system", 
                "menu_order_index": 1,
                "menu_is_active": true
            },
            {
                "menu_id": "718fbf74-9f35-4f46-9fa2-966135c62d23",
                "menu_name": "Menu",
                "menu_description": "Menu",
                "menu_path": "/menu",
                "menu_order_index": 2,
                "menu_is_active": true
            }
        ]
    }
]
```

## Hierarchy Rules

1. **Parent System**: `system_name` serves as the main parent menu
2. **Menu Order**: `menu_order_index` determines the display order
3. **Sub-parent Logic**: When multiple menus share the same `menu_order_index`:
   - The **first menu** becomes a **sub-parent**
   - All subsequent menus with the same `menu_order_index` become **sub-menus** under that sub-parent

## Examples

### Example 1: Mixed Structure
```javascript
"access_list": [
    {"menu_name": "User Management", "menu_order_index": 1},    // Sub-parent
    {"menu_name": "System", "menu_order_index": 1},            // Sub-menu of User Management
    {"menu_name": "Menu", "menu_order_index": 2},              // Single menu
    {"menu_name": "Permission", "menu_order_index": 3},        // Sub-parent
    {"menu_name": "Role", "menu_order_index": 3},              // Sub-menu of Permission
    {"menu_name": "User", "menu_order_index": 3}               // Sub-menu of Permission
]
```

**Rendered Structure:**
```
Central User
├── User Management (sub-parent, clickable)
│   └── System (sub-menu)
├── Menu (single menu)
└── Permission (sub-parent, clickable)
    ├── Role (sub-menu)
    └── User (sub-menu)
```

### Example 2: All Single Menus
```javascript
"access_list": [
    {"menu_name": "Dashboard", "menu_order_index": 1},
    {"menu_name": "Reports", "menu_order_index": 2},
    {"menu_name": "Settings", "menu_order_index": 3}
]
```

**Rendered Structure:**
```
System Name
├── Dashboard
├── Reports
└── Settings
```

### Example 3: All Grouped Menus
```javascript
"access_list": [
    {"menu_name": "User Management", "menu_order_index": 1},    // Sub-parent
    {"menu_name": "User List", "menu_order_index": 1},         // Sub-menu
    {"menu_name": "User Roles", "menu_order_index": 1},        // Sub-menu
    {"menu_name": "System Config", "menu_order_index": 2},     // Sub-parent
    {"menu_name": "General Settings", "menu_order_index": 2},  // Sub-menu
    {"menu_name": "Advanced Settings", "menu_order_index": 2}  // Sub-menu
]
```

**Rendered Structure:**
```
System Name
├── User Management (sub-parent, clickable)
│   ├── User List (sub-menu)
│   └── User Roles (sub-menu)
└── System Config (sub-parent, clickable)
    ├── General Settings (sub-menu)
    └── Advanced Settings (sub-menu)
```

## CSS Classes

The hierarchy system uses specific CSS classes for styling:

- **Regular menu**: `dropdown-item`
- **Sub-parent menu**: `dropdown-item font-weight-bold`
- **Sub-menu**: `dropdown-item submenu-item`
- **Active state**: Additional `current` class

## Navigation Paths

All menus (including sub-parents and sub-menus) are fully navigable with paths:
- Format: `/{slugified-system-name}/{slugified-menu-name}`
- Example: `/central-user/user-management`

## Key Functions

1. **`groupMenusByOrder(accessList)`**: Groups and hierarchizes menus
2. **`renderMenuItem(menu, systemName, level)`**: Renders individual menu items
3. **`getSystemIcon(name)`**: Returns appropriate icons for systems

This structure provides flexibility for both flat and hierarchical menu organization while maintaining clean navigation paths.
