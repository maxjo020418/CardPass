FROM ubuntu:24.04

# Node 20 LTS
RUN apt-get update && apt-get install -y curl ca-certificates gnupg \
 && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
 && apt-get install -y nodejs build-essential pkg-config libssl-dev clang git cmake \
 && rm -rf /var/lib/apt/lists/*

# Rust
RUN curl -sSf https://sh.rustup.rs | sh -s -- -y --no-modify-path
ENV PATH="/root/.cargo/bin:${PATH}"
RUN rustup default stable && rustup component add rustfmt clippy

# Solana/Agave CLI
RUN curl --proto '=https' --tlsv1.2 -sSfL https://solana-install.solana.workers.dev | bash
ENV PATH="/root/.local/share/solana/install/active_release/bin:${PATH}"
RUN solana --version

# Anchor via AVM (prebuilt ok on glibc 2.39)
RUN cargo install --git https://github.com/coral-xyz/anchor avm --force
RUN avm install 0.31.1 && avm use 0.31.1 && anchor --version
