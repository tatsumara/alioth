# alioth
multi purpose search engine inside of discord. continuation of altair

## goals
- being able to request data from a multitude of different sources (images, media, knowledge, news?)
- displaying them consistently within discord (embeds)
- database integration for user and server settings (preferences, visibility)
- flexible command handler

## structure
```mermaid
graph TD
  entry[Entrypoint] --> init[Bot Initialization]
  init --> event[Event Handlers]
  init --> regSlash
  
  %% Slash Command Handling
 regSlash[Slash Command Handler]
  regSlash --> loadFiles[Load Command Files]

  %% Event Handlers
  event --> ready[Ready Event Handler]
  event --> message[Message Event Handler]
  event --> interaction[InteractionCreate Event Handler]
  
  %% Database Interaction
  init --> db[(Database Connection)]
  db --> userS[User Settings]
  db --> serverS[Server Settings]
  
  %% Flow
  ready --> online[Bot Online]
  message --> messageH[Handle Messages]
  interaction --> handleSlash[Handle Slash Commands]

```
