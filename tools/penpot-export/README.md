# Penpot Export Workspace (Dev Container)

The `penpot-export` service defined in `infra/containers/devcontainer/docker-compose.yml` mounts this
folder into the container at `/workspace`. Nothing needs to run locally here—it's simply a scratch
space for the Penpot export image to emit logs and temporary files while producing `tokens/base.json`.

You should not commit artifacts in this directory. The service writes outputs directly to
`packages/design-tokens/tokens/` via the docker volume configuration.
