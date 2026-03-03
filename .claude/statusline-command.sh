#!/bin/bash

# Claude Code statusline: git info, model, context, 5h/weekly usage with burn rate, session cost.
#
# Displays (two lines when in a git repo):
#   Line 1: repo:branch (cyan)
#   Line 2: Model | Context % | 5h usage (colored) | Weekly usage (colored) | Cost
#
# Progress bar colors match burn rate: green (Good), yellow (Normal), orange (High), red (Too High).
#
# Usage data comes from the Anthropic OAuth usage API (macOS Keychain).
# Falls back gracefully when API is unavailable (Linux, expired token, etc.).
#
# Dependencies: jq, bc, curl
# See README.md for setup instructions.

set -euo pipefail

for cmd in jq bc curl; do
    command -v "$cmd" >/dev/null 2>&1 || { echo "missing $cmd"; exit 1; }
done

CACHE_DIR="${HOME}/.cache/claude"
CACHE_FILE="${CACHE_DIR}/usage-cache.json"
CACHE_TTL=60
mkdir -p "$CACHE_DIR"

# --- ANSI colors ---

COLOR_RESET='\033[0m'
COLOR_CYAN='\033[36m'
COLOR_GREEN='\033[32m'
COLOR_YELLOW='\033[33m'
COLOR_ORANGE='\033[38;5;208m'
COLOR_RED='\033[31m'

# --- Helper functions ---

progress_bar() {
    local pct=${1:-0}
    local width=10
    local filled=$(( pct * width / 100 ))
    if (( filled > width )); then filled=$width; fi
    local empty=$(( width - filled ))
    local bar=""
    for (( i = 0; i < filled; i++ )); do bar+="█"; done
    for (( i = 0; i < empty; i++ )); do bar+="░"; done
    echo "[${bar}]"
}

burn_rate_label() {
    local usage=${1:-0}
    local remaining_mins=${2:-0}
    local total_mins=${3:-1}
    local elapsed_mins=$(( total_mins - remaining_mins ))
    if (( elapsed_mins < 0 )); then elapsed_mins=0; fi

    local time_pct=0
    if (( total_mins > 0 )); then
        time_pct=$(( elapsed_mins * 100 / total_mins ))
    fi

    local diff=$(( usage - time_pct ))

    if (( diff <= 0 )); then
        echo "Good"
    elif (( diff <= 10 )); then
        echo "Normal"
    elif (( diff <= 20 )); then
        echo "High"
    else
        echo "Too High"
    fi
}

burn_rate_color() {
    local label=$1
    case "$label" in
        "Good")     echo "$COLOR_GREEN" ;;
        "Normal")   echo "$COLOR_YELLOW" ;;
        "High")     echo "$COLOR_ORANGE" ;;
        "Too High") echo "$COLOR_RED" ;;
        *)          echo "$COLOR_RESET" ;;
    esac
}

time_remaining_mins() {
    local reset_at=$1
    local now
    now=$(date +%s)
    local ts_clean="${reset_at%%.*}"
    ts_clean="${ts_clean//T/ }"
    local reset_ts
    reset_ts=$(TZ=UTC date -j -f "%Y-%m-%d %H:%M:%S" "$ts_clean" +%s 2>/dev/null) || return 1
    local diff=$(( reset_ts - now ))
    echo $(( diff / 60 ))
}

format_time() {
    local mins=$1
    if (( mins <= 0 )); then
        echo "now"
        return
    fi
    local days=$(( mins / 1440 ))
    local hours=$(( (mins % 1440) / 60 ))
    local minutes=$(( mins % 60 ))
    if (( days > 0 )); then
        echo "${days}d ${hours}h"
    elif (( hours > 0 )); then
        echo "${hours}h ${minutes}m"
    else
        echo "${minutes}m"
    fi
}

get_usage() {
    local now
    now=$(date +%s)

    if [[ -f "$CACHE_FILE" ]]; then
        local cache_time
        cache_time=$(stat -f %m "$CACHE_FILE" 2>/dev/null || echo 0)
        if (( now - cache_time < CACHE_TTL )); then
            cat "$CACHE_FILE"
            return
        fi
    fi

    local creds token
    creds=$(security find-generic-password -s "Claude Code-credentials" -a "$(whoami)" -w 2>/dev/null) || return 1
    token=$(echo "$creds" | jq -r '.claudeAiOauth.accessToken // empty' 2>/dev/null) || return 1

    if [[ -z "$token" ]]; then
        return 1
    fi

    local response
    response=$(curl --silent --max-time 5 \
        --config <(printf 'header = "Authorization: Bearer %s"\nheader = "anthropic-beta: oauth-2025-04-20"' "$token") \
        "https://api.anthropic.com/api/oauth/usage" 2>/dev/null) || return 1

    echo "$response" > "$CACHE_FILE"
    echo "$response"
}

# --- Main ---

input=$(cat)

# Model
model=$(echo "$input" | jq -r '.model.display_name')

# Context window
used_pct=$(echo "$input" | jq -r '.context_window.used_percentage // empty')

# Cost: prefer pre-calculated, fall back to manual token-based estimate
cost_usd=$(echo "$input" | jq -r '.cost.total_cost_usd // empty')

if [[ -n "$cost_usd" ]]; then
    if (( $(echo "$cost_usd < 0.01" | bc -l) )); then
        cost_display=$(printf "\$%.4f" "$cost_usd")
    else
        cost_display=$(printf "\$%.2f" "$cost_usd")
    fi
else
    total_input=$(echo "$input" | jq -r '.context_window.total_input_tokens // 0')
    total_output=$(echo "$input" | jq -r '.context_window.total_output_tokens // 0')
    model_id=$(echo "$input" | jq -r '.model.id')

    if [[ "$model_id" == *"opus"* ]]; then
        input_cost_per_mtok=15
        output_cost_per_mtok=75
    else
        input_cost_per_mtok=3
        output_cost_per_mtok=15
    fi

    input_cost=$(echo "scale=4; $total_input * $input_cost_per_mtok / 1000000" | bc)
    output_cost=$(echo "scale=4; $total_output * $output_cost_per_mtok / 1000000" | bc)
    total_cost=$(echo "scale=4; $input_cost + $output_cost" | bc)

    if (( $(echo "$total_cost < 0.01" | bc -l) )); then
        cost_display=$(printf "\$%.4f" "$total_cost")
    else
        cost_display=$(printf "\$%.2f" "$total_cost")
    fi
fi

# Build status string
status="$model"

if [[ -n "$used_pct" ]]; then
    status="$status | Context: ${used_pct}%"
fi

# Usage data from Anthropic OAuth API
usage=$(get_usage 2>/dev/null) || usage=""

api_error=""
if [[ -n "$usage" ]]; then
    api_error=$(echo "$usage" | jq -r '.error.type // empty' 2>/dev/null)
fi

if [[ -n "$usage" && -z "$api_error" ]]; then
    five_hour=$(echo "$usage" | jq -r '.five_hour.utilization // empty' 2>/dev/null)
    five_hour_resets=$(echo "$usage" | jq -r '.five_hour.resets_at // empty' 2>/dev/null)
    seven_day=$(echo "$usage" | jq -r '.seven_day.utilization // empty' 2>/dev/null)
    seven_day_resets=$(echo "$usage" | jq -r '.seven_day.resets_at // empty' 2>/dev/null)

    if [[ -n "$five_hour" ]]; then
        five_hour_int=$(printf "%.0f" "$five_hour")
        five_hour_bar=$(progress_bar "$five_hour_int")
        five_hour_remaining=$(time_remaining_mins "$five_hour_resets" 2>/dev/null) || five_hour_remaining=0
        five_hour_label=$(burn_rate_label "$five_hour_int" "$five_hour_remaining" 300)
        five_hour_color=$(burn_rate_color "$five_hour_label")
        five_hour_time=$(format_time "$five_hour_remaining")
        status="${status} | 5h: ${five_hour_color}${five_hour_bar} ${five_hour_int}% - ${five_hour_label}${COLOR_RESET} (${five_hour_time} left)"
    fi

    if [[ -n "$seven_day" ]]; then
        seven_day_int=$(printf "%.0f" "$seven_day")
        seven_day_bar=$(progress_bar "$seven_day_int")
        seven_day_remaining=$(time_remaining_mins "$seven_day_resets" 2>/dev/null) || seven_day_remaining=0
        seven_day_label=$(burn_rate_label "$seven_day_int" "$seven_day_remaining" 10080)
        seven_day_color=$(burn_rate_color "$seven_day_label")
        seven_day_time=$(format_time "$seven_day_remaining")
        status="${status} | Weekly: ${seven_day_color}${seven_day_bar} ${seven_day_int}% - ${seven_day_label}${COLOR_RESET} (${seven_day_time} left)"
    fi
fi

status="${status} | Session: $cost_display"

# Git info: repo name and branch on a separate colored line
git_line=""
if git_toplevel=$(git rev-parse --show-toplevel 2>/dev/null); then
    repo_name=$(basename "$git_toplevel")
    branch=$(git symbolic-ref --short HEAD 2>/dev/null) || branch=$(git rev-parse --short HEAD 2>/dev/null) || branch=""
    if [[ -n "$branch" ]]; then
        git_line="${COLOR_CYAN}${repo_name}:${branch}${COLOR_RESET}"
    fi
fi

if [[ -n "$git_line" ]]; then
    printf '%b\n%b\n' "$git_line" "$status"
else
    printf '%b\n' "$status"
fi
