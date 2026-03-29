# MINE Lister

## Current State
Fully functional Minecraft server listing site with dark neon theme, horizontal server cards, tags, search/filter, authentication, GA4, and prior SEO work targeting India.

## Requested Changes (Diff)

### Add
- Vote button and Join Server button on each server card
- Player counts and votes displayed on cards (never 0, use defaults from sample data)
- H2 sections in ServerListing: "Top Minecraft Servers", "Cracked Minecraft Servers", "Premium Minecraft Servers", "Recently Added Servers"
- Introductory paragraph: "This website lists the best Minecraft servers including cracked and premium servers. Players can join servers for BedWars, Survival, Skyblock, PvP and more."
- Structured data (JSON-LD ItemList schema) for server listings in index.html
- Schema for individual server listing items

### Modify
- index.html title: "Best Minecraft Servers (Cracked & Premium) | MCServerHub"
- index.html meta description: "Find the best cracked and premium Minecraft servers. Play BedWars, Survival, Skyblock and more. Join top TLauncher servers with active players."
- index.html keywords: add cracked minecraft servers, premium minecraft servers, tlauncher servers, minecraft server list, best mc servers
- HeroSection H1: "Best Minecraft Servers (Cracked & Premium)"
- Sample server data: add keyword-rich descriptions, ensure players/votes never 0 (use realistic defaults: min 20 players, min 50 votes)
- ServerCard: show players online and vote count, add Vote + Join Server buttons
- ServerListing: organize with named H2 sections (Top, Cracked, Premium, Recently Added)
- App.tsx page title on home: match new title

### Remove
- Nothing removed

## Implementation Plan
1. Update index.html: title, meta description, keywords, add ItemList JSON-LD schema
2. Update HeroSection H1 text
3. Update SAMPLE_SERVERS in sheetsParser.ts with keyword-rich descriptions and non-zero players/votes
4. Update ServerCard to show players count, vote count, Vote button, Join Server button
5. Update ServerListing to add H2 section headings and intro paragraph
6. Update App.tsx home page title to match new SEO title
