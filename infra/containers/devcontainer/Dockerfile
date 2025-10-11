FROM mcr.microsoft.com/devcontainers/typescript-node:24

# Create a non-root user and switch to it
RUN useradd -m appuser && chown -R appuser /workspace
USER appuser

# Install pnpm
RUN npm install -g pnpm@10.17.1

# Install Rust and Cargo (for Tauri)
SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
SHELL ["/bin/sh", "-c"]
ENV PATH="/root/.cargo/bin:${PATH}"

# Install system dependencies for mobile development
RUN apt-get update && apt-get install -y \
    openjdk-17-jdk=17.0.11+9-1~deb12u1 \
    android-sdk=25.2.5+6 \
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

RUN echo '#!/bin/bash\nollama pull llama3:8b &' > /usr/local/bin/setup-ollama.sh && \
    chmod +x /usr/local/bin/setup-ollama.sh

# Add a simple healthcheck (checks if node is available)
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD node --version || exit 1
