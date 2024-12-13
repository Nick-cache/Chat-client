#!/bin/bash
set -ue

# :wrapper.bash3_bouncer
if [[ "${BASH_VERSINFO:-0}" -lt 4 ]]; then
  printf "bash version 4 or higher is required\n" >&2
  exit 1
fi

# :command.master_script

# :command.version_command
version_command() {
  echo "$version"
}

# :command.usage
manage_usage() {
  printf "manage - chat client manage\n\n"

  printf "%s\n" "Usage:"
  printf "  manage COMMAND\n"
  printf "  manage [COMMAND] --help | -h\n"
  printf "  manage --version | -v\n"
  echo
  # :command.usage_commands
  printf "%s\n" "Commands:"
  printf "  %s   Run docker-compose\n" "run    "
  printf "  %s   Stop docker-compose\n" "stop   "
  printf "  %s   Migrate models to database\n" "migrate"
  printf "  %s   Stdout logs\n" "logs   "
  echo

  # :command.long_usage
  if [[ -n "$long_usage" ]]; then
    printf "%s\n" "Options:"

    # :command.usage_fixed_flags
    printf "  %s\n" "--help, -h"
    printf "    Show this help\n"
    echo
    printf "  %s\n" "--version, -v"
    printf "    Show version number\n"
    echo

  fi
}

# :command.usage
manage_run_usage() {
  printf "manage run - Run docker-compose\n\n"
  printf "Alias: r\n"
  echo

  printf "%s\n" "Usage:"
  printf "  manage run MODE [OPTIONS]\n"
  printf "  manage run --help | -h\n"
  echo

  # :command.long_usage
  if [[ -n "$long_usage" ]]; then
    printf "%s\n" "Options:"

    # :command.usage_flags
    # :flag.usage
    printf "  %s\n" "--detach, -d"
    printf "    Detached mode\n"
    echo

    # :flag.usage
    printf "  %s\n" "--build, -b"
    printf "    Build images\n"
    echo

    # :flag.usage
    printf "  %s\n" "--migrate, -m"
    printf "    Migrate models to database on start\n"
    echo

    # :command.usage_fixed_flags
    printf "  %s\n" "--help, -h"
    printf "    Show this help\n"
    echo

    # :command.usage_args
    printf "%s\n" "Arguments:"

    # :argument.usage
    printf "  %s\n" "MODE"
    printf "\n"
    printf "    %s\n" "Allowed: dev, prod"
    echo

  fi
}

# :command.usage
manage_stop_usage() {
  printf "manage stop - Stop docker-compose\n\n"
  printf "Alias: s\n"
  echo

  printf "%s\n" "Usage:"
  printf "  manage stop MODE\n"
  printf "  manage stop --help | -h\n"
  echo

  # :command.long_usage
  if [[ -n "$long_usage" ]]; then
    printf "%s\n" "Options:"

    # :command.usage_fixed_flags
    printf "  %s\n" "--help, -h"
    printf "    Show this help\n"
    echo

    # :command.usage_args
    printf "%s\n" "Arguments:"

    # :argument.usage
    printf "  %s\n" "MODE"
    printf "\n"
    printf "    %s\n" "Allowed: dev, prod"
    echo

  fi
}

# :command.usage
manage_migrate_usage() {
  printf "manage migrate - Migrate models to database\n\n"
  printf "Alias: m\n"
  echo

  printf "%s\n" "Usage:"
  printf "  manage migrate\n"
  printf "  manage migrate --help | -h\n"
  echo

  # :command.long_usage
  if [[ -n "$long_usage" ]]; then
    printf "%s\n" "Options:"

    # :command.usage_fixed_flags
    printf "  %s\n" "--help, -h"
    printf "    Show this help\n"
    echo

  fi
}

# :command.usage
manage_logs_usage() {
  printf "manage logs - Stdout logs\n\n"
  printf "Alias: l\n"
  echo

  printf "%s\n" "Usage:"
  printf "  manage logs MODE\n"
  printf "  manage logs --help | -h\n"
  echo

  # :command.long_usage
  if [[ -n "$long_usage" ]]; then
    printf "%s\n" "Options:"

    # :command.usage_fixed_flags
    printf "  %s\n" "--help, -h"
    printf "    Show this help\n"
    echo

    # :command.usage_args
    printf "%s\n" "Arguments:"

    # :argument.usage
    printf "  %s\n" "MODE"
    printf "\n"
    printf "    %s\n" "Allowed: dev, prod"
    echo

  fi
}

# :command.normalize_input
# :command.normalize_input_function
normalize_input() {
  local arg passthru flags
  passthru=false

  while [[ $# -gt 0 ]]; do
    arg="$1"
    if [[ $passthru == true ]]; then
      input+=("$arg")
    elif [[ $arg =~ ^(--[a-zA-Z0-9_\-]+)=(.+)$ ]]; then
      input+=("${BASH_REMATCH[1]}")
      input+=("${BASH_REMATCH[2]}")
    elif [[ $arg =~ ^(-[a-zA-Z0-9])=(.+)$ ]]; then
      input+=("${BASH_REMATCH[1]}")
      input+=("${BASH_REMATCH[2]}")
    elif [[ $arg =~ ^-([a-zA-Z0-9][a-zA-Z0-9]+)$ ]]; then
      flags="${BASH_REMATCH[1]}"
      for ((i = 0; i < ${#flags}; i++)); do
        input+=("-${flags:i:1}")
      done
    elif [[ "$arg" == "--" ]]; then
      passthru=true
      input+=("$arg")
    else
      input+=("$arg")
    fi

    shift
  done
}

# :command.inspect_args
inspect_args() {
  if ((${#args[@]})); then
    readarray -t sorted_keys < <(printf '%s\n' "${!args[@]}" | sort)
    echo args:
    for k in "${sorted_keys[@]}"; do
      echo "- \${args[$k]} = ${args[$k]}"
    done
  else
    echo args: none
  fi

  if ((${#other_args[@]})); then
    echo
    echo other_args:
    echo "- \${other_args[*]} = ${other_args[*]}"
    for i in "${!other_args[@]}"; do
      echo "- \${other_args[$i]} = ${other_args[$i]}"
    done
  fi

  if ((${#deps[@]})); then
    readarray -t sorted_keys < <(printf '%s\n' "${!deps[@]}" | sort)
    echo
    echo deps:
    for k in "${sorted_keys[@]}"; do
      echo "- \${deps[$k]} = ${deps[$k]}"
    done
  fi

  if ((${#env_var_names[@]})); then
    readarray -t sorted_names < <(printf '%s\n' "${env_var_names[@]}" | sort)
    echo
    echo "environment variables:"
    for k in "${sorted_names[@]}"; do
      echo "- \$$k = ${!k:-}"
    done
  fi
}

# :command.command_functions
# :command.function
manage_run_command() {

  # src/run_command.sh
  MODE="${args[MODE]}"
  BUILD="${args[--build]-0}"
  MIGRATE="${args[--migrate]-0}"
  DETACH="${args[--detach]-0}"

  COMPOSE_FILE="./$MODE/docker-compose.yaml"

  ENV_FILE=""

  if [ "$MODE" == "dev" ]; then
      ENV_FILE="--env-file ./.env --env-file ./dev/.env"
  else
      ENV_FILE="--env-file ./.env"
  fi

  CMD="COMPOSE_FILE=$COMPOSE_FILE docker compose $ENV_FILE"

  DOCKER_COMPOSE_CMD=""

  if [ "$DETACH" == 1 ]; then
      CMD="$CMD up -d"
  else
      CMD="$CMD up"
  fi

  if [ "$BUILD" == 1 ]; then
      DOCKER_COMPOSE_CMD="$CMD --build"
  else
      DOCKER_COMPOSE_CMD=$CMD
  fi

  MIGRATION_CMD="docker exec --workdir /app/src backend 'alembic' 'upgrade' 'head'"

  CHECK_CONTAINER_CMD="docker container inspect -f '{{.State.Status}}' backend"

  eval $DOCKER_COMPOSE_CMD

  if [ "$MIGRATE" == 1 ]; then
      while :
      do
          RES=$(eval $CHECK_CONTAINER_CMD)
          if [ $RES = "running" ]; then
              eval $MIGRATION_CMD || continue
              break
          fi
          if [ $RES = "exited" ]; then
              echo "Something went wrong"
              break
          fi
      done
  fi

}

# :command.function
manage_stop_command() {

  # src/stop_command.sh
  MODE="${args[MODE]}"

  ENV_FILE="./.env"
  COMPOSE_FILE="./$MODE/docker-compose.yaml"
  DOCKER_COMPOSE_CMD="COMPOSE_FILE=$COMPOSE_FILE docker compose --env-file $ENV_FILE"

  eval "$DOCKER_COMPOSE_CMD" stop
}

# :command.function
manage_migrate_command() {

  # src/migrate_command.sh
  MIGRATION_CMD="docker exec --workdir /app/src backend 'alembic' 'upgrade' 'head'"

  CHECK_CONTAINER_CMD="docker container inspect -f '{{.State.Status}}' backend"

  while :
  do
      RES=$(eval $CHECK_CONTAINER_CMD)
      if [ $RES = "running" ]; then
          eval $MIGRATION_CMD || continue
          break
      fi
      if [ $RES = "exited" ]; then
          echo "Something went wrong"
          break
      fi
  done

}

# :command.function
manage_logs_command() {

  # src/logs_command.sh
  MODE="${args[MODE]}"
  COMPOSE_FILE="./$MODE/docker-compose.yaml"

  ENV_FILE=""

  if [ "$MODE" == "dev" ]; then
      ENV_FILE="--env-file ./.env --env-file ./dev/.env logs -f"
  else
      ENV_FILE="--env-file ./.env logs -f"
  fi

  CMD="COMPOSE_FILE=$COMPOSE_FILE docker compose $ENV_FILE"

  eval $CMD

}

# :command.parse_requirements
parse_requirements() {
  # :command.fixed_flags_filter
  while [[ $# -gt 0 ]]; do
    key="$1"
    case "$key" in
      --version | -v)
        version_command
        exit
        ;;

      --help | -h)
        long_usage=yes
        manage_usage
        exit
        ;;

      *)
        break
        ;;

    esac
  done

  # :command.command_filter
  action=${1:-}

  case $action in
    -*) ;;

    run | r)
      action="run"
      shift
      manage_run_parse_requirements "$@"
      shift $#
      ;;

    stop | s)
      action="stop"
      shift
      manage_stop_parse_requirements "$@"
      shift $#
      ;;

    migrate | m)
      action="migrate"
      shift
      manage_migrate_parse_requirements "$@"
      shift $#
      ;;

    logs | l)
      action="logs"
      shift
      manage_logs_parse_requirements "$@"
      shift $#
      ;;

    # :command.command_fallback
    "")
      manage_usage >&2
      exit 1
      ;;

    *)
      printf "invalid command: %s\n" "$action" >&2
      exit 1
      ;;

  esac

  # :command.parse_requirements_while
  while [[ $# -gt 0 ]]; do
    key="$1"
    case "$key" in

      -?*)
        printf "invalid option: %s\n" "$key" >&2
        exit 1
        ;;

      *)
        # :command.parse_requirements_case
        # :command.parse_requirements_case_simple
        printf "invalid argument: %s\n" "$key" >&2
        exit 1

        ;;

    esac
  done

}

# :command.parse_requirements
manage_run_parse_requirements() {
  # :command.fixed_flags_filter
  while [[ $# -gt 0 ]]; do
    key="$1"
    case "$key" in
      --help | -h)
        long_usage=yes
        manage_run_usage
        exit
        ;;

      *)
        break
        ;;

    esac
  done

  # :command.command_filter
  action="run"

  # :command.parse_requirements_while
  while [[ $# -gt 0 ]]; do
    key="$1"
    case "$key" in
      # :flag.case
      --detach | -d)

        # :flag.case_no_arg
        args['--detach']=1
        shift
        ;;

      # :flag.case
      --build | -b)

        # :flag.case_no_arg
        args['--build']=1
        shift
        ;;

      # :flag.case
      --migrate | -m)

        # :flag.case_no_arg
        args['--migrate']=1
        shift
        ;;

      -?*)
        printf "invalid option: %s\n" "$key" >&2
        exit 1
        ;;

      *)
        # :command.parse_requirements_case
        # :command.parse_requirements_case_simple
        # :argument.case
        if [[ -z ${args['MODE']+x} ]]; then
          args['MODE']=$1
          shift
        else
          printf "invalid argument: %s\n" "$key" >&2
          exit 1
        fi

        ;;

    esac
  done
  # :command.required_args_filter
  if [[ -z ${args['MODE']+x} ]]; then
    printf "missing required argument: MODE\nusage: manage run MODE [OPTIONS]\n" >&2

    exit 1
  fi

  # :command.whitelist_filter
  if [[ -n ${args['MODE']:-} ]] && [[ ! ${args['MODE']:-} =~ ^(dev|prod)$ ]]; then
    printf "%s\n" "MODE must be one of: dev, prod" >&2
    exit 1
  fi

}

# :command.parse_requirements
manage_stop_parse_requirements() {
  # :command.fixed_flags_filter
  while [[ $# -gt 0 ]]; do
    key="$1"
    case "$key" in
      --help | -h)
        long_usage=yes
        manage_stop_usage
        exit
        ;;

      *)
        break
        ;;

    esac
  done

  # :command.command_filter
  action="stop"

  # :command.parse_requirements_while
  while [[ $# -gt 0 ]]; do
    key="$1"
    case "$key" in

      -?*)
        printf "invalid option: %s\n" "$key" >&2
        exit 1
        ;;

      *)
        # :command.parse_requirements_case
        # :command.parse_requirements_case_simple
        # :argument.case
        if [[ -z ${args['MODE']+x} ]]; then
          args['MODE']=$1
          shift
        else
          printf "invalid argument: %s\n" "$key" >&2
          exit 1
        fi

        ;;

    esac
  done
  # :command.required_args_filter
  if [[ -z ${args['MODE']+x} ]]; then
    printf "missing required argument: MODE\nusage: manage stop MODE\n" >&2

    exit 1
  fi

  # :command.whitelist_filter
  if [[ -n ${args['MODE']:-} ]] && [[ ! ${args['MODE']:-} =~ ^(dev|prod)$ ]]; then
    printf "%s\n" "MODE must be one of: dev, prod" >&2
    exit 1
  fi

}

# :command.parse_requirements
manage_migrate_parse_requirements() {
  # :command.fixed_flags_filter
  while [[ $# -gt 0 ]]; do
    key="$1"
    case "$key" in
      --help | -h)
        long_usage=yes
        manage_migrate_usage
        exit
        ;;

      *)
        break
        ;;

    esac
  done

  # :command.command_filter
  action="migrate"

  # :command.parse_requirements_while
  while [[ $# -gt 0 ]]; do
    key="$1"
    case "$key" in

      -?*)
        printf "invalid option: %s\n" "$key" >&2
        exit 1
        ;;

      *)
        # :command.parse_requirements_case
        # :command.parse_requirements_case_simple
        printf "invalid argument: %s\n" "$key" >&2
        exit 1

        ;;

    esac
  done

}

# :command.parse_requirements
manage_logs_parse_requirements() {
  # :command.fixed_flags_filter
  while [[ $# -gt 0 ]]; do
    key="$1"
    case "$key" in
      --help | -h)
        long_usage=yes
        manage_logs_usage
        exit
        ;;

      *)
        break
        ;;

    esac
  done

  # :command.command_filter
  action="logs"

  # :command.parse_requirements_while
  while [[ $# -gt 0 ]]; do
    key="$1"
    case "$key" in

      -?*)
        printf "invalid option: %s\n" "$key" >&2
        exit 1
        ;;

      *)
        # :command.parse_requirements_case
        # :command.parse_requirements_case_simple
        # :argument.case
        if [[ -z ${args['MODE']+x} ]]; then
          args['MODE']=$1
          shift
        else
          printf "invalid argument: %s\n" "$key" >&2
          exit 1
        fi

        ;;

    esac
  done
  # :command.required_args_filter
  if [[ -z ${args['MODE']+x} ]]; then
    printf "missing required argument: MODE\nusage: manage logs MODE\n" >&2

    exit 1
  fi

  # :command.whitelist_filter
  if [[ -n ${args['MODE']:-} ]] && [[ ! ${args['MODE']:-} =~ ^(dev|prod)$ ]]; then
    printf "%s\n" "MODE must be one of: dev, prod" >&2
    exit 1
  fi

}

# :command.initialize
initialize() {
  version="0.1.0"
  long_usage=''
  set -e

}

# :command.run
run() {
  declare -g -A args=()
  declare -g -A deps=()
  declare -g -a other_args=()
  declare -g -a env_var_names=()
  declare -g -a input=()
  normalize_input "$@"
  parse_requirements "${input[@]}"

  case "$action" in
    "run") manage_run_command ;;
    "stop") manage_stop_command ;;
    "migrate") manage_migrate_command ;;
    "logs") manage_logs_command ;;
  esac
}

initialize
run "$@"
