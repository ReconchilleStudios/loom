# 1 · The brief

What the film is for, before anything is researched or written. A film made for the wrong viewer or the wrong reaction is wrong however well it is made.

## What Loom needs to know

| | Example (the Affilimates demos) |
|---|---|
| **Subject** and where to learn it | Affilimates: the app repo, its `docs/DESIGN.md` and `PRODUCT.md`, the live app |
| **Viewer** | Marketing leaders at DTC and e-commerce brands who run creator programs |
| **Where it plays** | Website and sales calls |
| **The reaction** | 30 s: "I need this." 2 min: "This could replace a lot of what we're doing manually." |
| **A stakeholder's brief or script** | Diana's structure and lines, used verbatim |
| **Must say / must not** | "Follower count tells you who has an audience. Sales DNA tells you who can move a customer." · no invented results |
| **Material already there** | Real screens, App Store frames, brand fonts and photos |

Take everything the request already says. Read the product's own docs if a path or URL was given before asking anything. Ask only for what is still missing.

## The screen

Banner (act I), rail at `brief`, then at most two sentences on what Loom already understood, as a findings-style sheet with the rows it knows (`ui/screens.md`, Findings). Then **one** `AskUserQuestion` call with the missing fields, at most four questions, recommended option first:

1. **Where Loom learns the subject** (multi-select): a code repository on this machine · a website or live app · documents or a brand guide the person will give · research from the web only. Ask for paths and URLs in one plain line afterwards if they were not in the request.
2. **Who watches it:** prospective customers in a sales conversation · investors · visitors to the website · people scrolling a social feed.
3. **The reaction the film must cause**, written as the viewer's own sentence: "I need this" · "this replaces work we do by hand" · "now I understand what it does" · "I trust these people with this". Any of them can be rewritten by the person.
4. **Words that are already decided:** none, Loom writes everything · a brief or script to follow (they paste it next) · a few must-say lines.

When the person pastes a script, it is used **verbatim** in the voice. Its punctuation is kept for timing, and it is adapted only on screen (dashes become a comma or a period). Their structure becomes the A version's structure; the B version tells a different story to the same goal and the same close.

A second, short round only if something is still unknown:

- **Where the run lives** (one question). Recommend a folder the person already keeps films in, if their memory or `CLAUDE.md` names one; otherwise `~/Movies/Loom/<slug>/` on macOS or `~/Videos/Loom/<slug>/` elsewhere. Other options: next to the product's repo · the desktop. The delivery folder for the final MP4s is asked later, with the versions (`4-design.md`).

## What it writes

Create the run folder and these files (`templates/`):

```
<run>/
  loom.json        status "research"; subject, viewer, destination, reaction, language, sources
  PLAN.md          the person's one-page document, in their language: the brief so far
  docs/            working papers, created as the next stages write them
```

`loom.json`'s `language.session` is the person's language and `language.film` the film's (ask only if it is not obvious; default English for an English-speaking market).

## Gate

Loom can say in one sentence who the film is for, where they see it, and what they must think when it ends, and the person has seen that sentence. Everything named as a source is reachable: the repo path exists, the URL loads, the documents are there.
