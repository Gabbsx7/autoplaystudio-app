-- Documentation for updating use-chat-advanced hook with new schema
-- This file documents the changes needed in the React hook

/*
NEW LOGIC FOR use-chat-advanced hook:

1. Get user type and context:
   - Check if user exists in studio_members (studio user)
   - If not, check client_users (client user) 
   - Get appropriate permissions

2. Studio Users:
   - Can select any client from dropdown
   - See all users, projects, milestones, tasks
   - Use getSuggestions with studio permissions

3. Client Users:  
   - Automatically connected to their client
   - See only their client data + studio members
   - Use getSuggestions with client permissions

4. Channel naming:
   - Studio: 'chat:client-{selected_client_id}' or 'chat:general'
   - Client: 'chat:client-{their_client_id}'

5. getSuggestions function:
   - Pass current user_id (not client_id) 
   - Function will determine permissions internally
   - Studio users see everything
   - Client users see filtered results

6. User role detection query:
```sql
-- Check if studio member
SELECT sm.studio_id, s.name as studio_name, r.name as role_name
FROM studio_members sm
JOIN studio s ON sm.studio_id = s.id  
JOIN roles r ON sm.role_id = r.id
WHERE sm.user_id = user_id;

-- If not found, check client user
SELECT cu.client_id, c.name as client_name, r.name as role_name  
FROM client_users cu
JOIN clients c ON cu.client_id = c.id
JOIN roles r ON cu.role_id = r.id
WHERE cu.user_id = user_id;
```

PERMISSIONS SUMMARY:
- Studio: See everything, select client context
- Client: See own client + studio members, fixed context
*/ 