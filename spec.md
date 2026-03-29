# MINE Lister – Admin Control & Moderation Enhancement

## Current State
- Homepage hero shows 3 overview stats: Total Servers, Players Online, Total Votes
- Server cards are horizontal with logo, IP copy, vote/join buttons, tags
- ServerDetailPage shows full server info with no comments or ratings
- AdminPanel.tsx is a collapsible section on the homepage (accessible via #admin-panel fragment) that links to Google Sheets — no in-app admin functionality
- No comment system, no rating system, no announcements
- Authentication is user-facing only (localStorage-based username/password)
- App routing is page-based (state: "home" | "my-servers"), no URL routing

## Requested Changes (Diff)

### Add
- **Announcements section** on homepage (below hero, above server listing). Fetches announcements from localStorage. Shows latest first. Only admin can create/edit/delete.
- **Star rating** (1–5) field per server — stored in localStorage as `minelister_ratings: { [serverName]: number }`. Displayed on server cards and detail page as filled stars.
- **Comment system** on ServerDetailPage: form with Name + Message fields; submitted comments go to pending state in localStorage `minelister_comments: Comment[]`.
- **New hidden admin dashboard** at route `/admin-dashboard` — full-page route added to App.tsx routing. Not linked from any navigation.
- **Admin login** on the `/admin-dashboard` page: hardcoded credentials `admin` / `minelister2024`. Stored in `minelister_admin_session` in sessionStorage.
- **Admin panel features**: tabs for Servers, Comments, Announcements, Spam. Each tab:
  - Servers: list all servers (from API + localStorage overrides), add new server, edit/delete, update rating, toggle visibility (hidden servers excluded from public listing)
  - Comments: list pending comments, approve or delete each
  - Announcements: create/edit/delete announcements
  - Spam: list all comments (approved + pending), delete any
- **Server visibility** toggle stored in localStorage `minelister_hidden_servers: string[]` (array of server names). Public listing filters these out.
- **Server overrides** for admin-added servers stored in localStorage `minelister_custom_servers: ServerData[]`. These are merged with API servers in the listing.
- **Rating overrides** for admin-set ratings stored in localStorage `minelister_ratings`.

### Modify
- **HeroSection**: Remove the "Players Online" and "Total Votes" stat panels. Keep only "Total Servers" stat. Remove unused stats props (totalPlayers, totalVotes) from the component.
- **App.tsx**: Add `/admin-dashboard` route detection (check `window.location.pathname`). Render `AdminDashboard` component when on that path. Also filter hidden servers from public listing. Pass custom servers into merged server list. Pass ratings into ServerCard and ServerDetailPage.
- **ServerCard**: Add star rating display (read from ratings store) below the badges row.
- **ServerDetailPage**: Add star rating display and comment section (form + approved comments list).
- **ServerListing**: Filter out hidden servers before rendering.
- **serverStats.ts**: Remove totalPlayers and totalVotes from ServerStats type (or keep but just don't display them).

### Remove
- Old `AdminPanel.tsx` component — replace with new full `AdminDashboard.tsx`. Remove AdminPanel import/usage from App.tsx (it was accessed via #admin-panel hash, not rendered directly in current App.tsx — confirm it's not rendered and leave the file or delete it).

## Implementation Plan
1. Create `src/frontend/src/utils/adminStore.ts` — localStorage helpers for: ratings, comments, announcements, hidden servers, custom servers.
2. Modify `HeroSection.tsx` — remove Players Online and Total Votes panels, keep only Total Servers.
3. Modify `serverStats.ts` — simplify or keep type but remove unused fields.
4. Create `src/frontend/src/components/AnnouncementsSection.tsx` — displays announcements from store.
5. Modify `ServerCard.tsx` — add star rating display prop.
6. Modify `ServerDetailPage.tsx` — add rating display + comment section (submit form + approved comment list).
7. Create `src/frontend/src/components/AdminDashboard.tsx` — full admin panel with login gate + 4 tabs.
8. Modify `App.tsx` — detect `/admin-dashboard` path and render AdminDashboard, merge custom servers, filter hidden servers, pass ratings, add AnnouncementsSection to homepage.
