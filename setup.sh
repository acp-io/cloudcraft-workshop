#!/usr/bin/env bash
set -euo pipefail

# Setup script for CloudCraft Workshop — Amazon Linux 2023 EC2 instances
# Installs: Node.js 20 (via nvm), Pulumi CLI, GitHub CLI

NODE_VERSION="20"
GH_VERSION="2.87.3"

green()  { printf '\033[0;32m%s\033[0m\n' "$*"; }
yellow() { printf '\033[0;33m%s\033[0m\n' "$*"; }
red()    { printf '\033[0;31m%s\033[0m\n' "$*"; }

echo "============================================"
echo "  CloudCraft Workshop — Environment Setup"
echo "============================================"
echo ""

# --- Node.js (via nvm) ---
if command -v node &>/dev/null && [[ "$(node --version | cut -d. -f1 | tr -d 'v')" -ge "$NODE_VERSION" ]]; then
    green "✓ Node.js $(node --version) already installed"
else
    yellow "→ Installing Node.js ${NODE_VERSION} via nvm..."
    if [ ! -d "$HOME/.nvm" ]; then
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
    fi
    export NVM_DIR="$HOME/.nvm"
    # shellcheck source=/dev/null
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
    nvm install "$NODE_VERSION"
    nvm use "$NODE_VERSION"
    nvm alias default "$NODE_VERSION"
    green "✓ Node.js $(node --version) installed"
fi

# --- Pulumi CLI ---
if command -v pulumi &>/dev/null; then
    green "✓ Pulumi $(pulumi version) already installed"
else
    yellow "→ Installing Pulumi CLI..."
    curl -fsSL https://get.pulumi.com | sh
    export PATH="$HOME/.pulumi/bin:$PATH"
    green "✓ Pulumi $(pulumi version) installed"
fi

# --- GitHub CLI (binary install, no sudo) ---
if command -v gh &>/dev/null; then
    green "✓ GitHub CLI $(gh --version | head -1) already installed"
else
    yellow "→ Installing GitHub CLI ${GH_VERSION}..."
    GH_DIR="$HOME/.local/gh"
    mkdir -p "$GH_DIR"
    curl -fsSL "https://github.com/cli/cli/releases/download/v${GH_VERSION}/gh_${GH_VERSION}_linux_amd64.tar.gz" \
        | tar -xz -C "$GH_DIR" --strip-components=1
    export PATH="$GH_DIR/bin:$PATH"
    green "✓ GitHub CLI $(gh --version | head -1) installed"
fi

# --- Ensure PATH updates persist ---
SHELL_RC="$HOME/.bashrc"

add_line() {
    grep -qF "$1" "$SHELL_RC" 2>/dev/null || echo "$1" >> "$SHELL_RC"
}

add_line 'export NVM_DIR="$HOME/.nvm"'
add_line '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"'
add_line 'export PATH="$HOME/.pulumi/bin:$PATH"'
add_line 'export PATH="$HOME/.local/gh/bin:$PATH"'

echo ""
echo "============================================"
green "  All tools installed!"
echo "============================================"
echo ""
echo "Versions:"
echo "  Node.js : $(node --version)"
echo "  npm     : $(npm --version)"
echo "  Pulumi  : $(pulumi version)"
echo "  gh      : $(gh --version | head -1)"
echo ""
yellow "Run 'source ~/.bashrc' or open a new terminal to ensure paths are loaded."
