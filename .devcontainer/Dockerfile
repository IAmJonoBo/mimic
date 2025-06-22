FROM mcr.microsoft.com/devcontainers/typescript-node:18

# Install pnpm
RUN npm install -g pnpm@9.0.0

# Install Rust and Cargo (for Tauri)
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Install system dependencies for mobile development
RUN apt-get update && apt-get install -y \
    openjdk-17-jdk \
    android-sdk \
    && rm -rf /var/lib/apt/lists/*

# Set JAVA_HOME
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64

# Install Android SDK tools
ENV ANDROID_SDK_ROOT=/usr/lib/android-sdk
ENV PATH=$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools

# Install Node.js development tools
RUN npm install -g @nx/cli@latest

# Set up pnpm store
ENV PNPM_HOME="/usr/local/bin"
ENV PATH="$PNPM_HOME:$PATH"

# Create workspace directory
WORKDIR /workspace

# Copy package files for dependency installation
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Install Ollama models in the background after container starts
RUN echo '#!/bin/bash\nollama pull llama3:8b &' > /usr/local/bin/setup-ollama.sh && \
    chmod +x /usr/local/bin/setup-ollama.sh
