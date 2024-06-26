# lobby-data-system

# Deploying First Time

## Create Supabase Organization (or use existing)

    https://supabase.com/dashboard/projects

1. Select "New Project"
2. Select desired organization
3. Enter project name "lobby-data-system", etc.
4. Enter database password and region
5. Select "Create new project"
## Install supabase cli

https://supabase.com/docs/guides/cli/getting-started#installing-the-supabase-cli

## Clone this repository
```
git clone https://github.com/lobbylabs/lobby-data-system
```

## Configure Supabase CLI / Local Project
```
supabase login

supabase projects list
```

Link project and enter database password
```
supabase link

(enter supabase db password created previously)
```

If you skip the step to enter the db password just rerun supabase link


## Push local migrations to linked project

first start supabase running locally
```
supabase start
```
This will start the local Docker containers required to develop the supabase project locally.

If you need instructions for setting up Docker locally see: https://docs.docker.com/get-docker/
Or if you would prefer to only install the Docker engine: https://docs.docker.com/engine/install/

first compare local changes to the linked project
```
supabase db diff
```
Note: This will create a local shadow DB with the migrations applied from this repository using Docker


Push initial migrations from local project to linked project
```
supabase db push
```

## deploy local supabase edge functions to linked project

navigate to the settings/api section of the remote project and set the "data" schema as one of the exposed schemas
This allows the supabase edge function to interact with the data schema via the supabase service role.
For more details see the README.md file in the "docs" folder at the root of this repository.

set the secrets required for the functions to work in the linked project

first create a copy of the .env.example file found in the /supabase/functions folder and rename it to .env (you can either deploy this file to supabase to create another for .env.prod if you want to use a different api)

E.g.
```
INFERENCE_SERVER_API_KEY=<openai-api-key>
INFERENCE_SERVER_BASE_URL=https://api.openai.com/v1
```
This system is designed to work with any openai api compatible endpoint.

```
supabase secrets set --env-file ./supabase/functions/.env
```

you can test the edge functions locally before deploying
```
supabase functions serve --debug
```

and to deploy to the linked project
```
supabase functions deploy
```

after deploying is finished verify by running
```
supabase functions list
```

# Updating The Database
Make sure supabase is started locally
```
supabase start
```

Create a new migration file
```
supabase migration new <name>
```

Make changes in autogenerated file and then reset db. This will apply all migrations in the supabase/migrations folder to the locally running database

```
supabase db reset
```

## Generating types (Not used currently)
```
supabase gen types typescript --local > supabase/types/supabase.ts
```

## Running Functions Locally
```
supabase functions serve --debug
```

## Deploying Functions
```
supabase secrets set --env-file ./supabase/functions/.env
```

```
supabase functions deploy
```

## Reset remote database (DEV ONLY!)
This is only recommended when linked to a non-production supabase project with no important data

Always check linked project first:
```
supabase projects list
```

```
supabase db reset --linked
```

## Generate Documentation Diagrams

1. Install plantuml

```bash
brew install plantuml
```

2. Run the generation command
```bash
plantuml -overwrite ./docs/diagrams/main.puml
```


See: https://supabase.com/docs/guides/cli/getting-started#full-command-reference for a complete supabase CLI reference