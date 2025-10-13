pub mod cli;
pub mod emit;
pub mod governance;
pub mod ingest;
pub mod telemetry;
#[cfg(target_arch = "wasm32")]
pub mod wasm;

use std::path::PathBuf;

use thiserror::Error;

pub use emit::EmitPaths;
pub use ingest::Token;
pub use telemetry::{init, init_test_tracer, SpanSnapshot, TelemetryGuard};

#[derive(Debug, Clone)]
pub struct RunConfig {
    pub input: PathBuf,
    pub output_dir: PathBuf,
    pub validate_only: bool,
    pub enable_telemetry: bool,
    pub airgap: bool,
}

impl RunConfig {
    pub fn with_defaults() -> Self {
        Self {
            input: PathBuf::from("tokens.json"),
            output_dir: PathBuf::from("packages/tokens-outputs"),
            validate_only: false,
            enable_telemetry: true,
            airgap: cfg!(feature = "airgap"),
        }
    }
}

#[derive(Debug, Clone)]
pub struct RunSummary {
    pub token_count: usize,
    pub outputs: Option<EmitPaths>,
}

#[derive(Debug, Error)]
pub enum OrchestratorError {
    #[error("failed to read input: {0}")]
    Io(#[from] std::io::Error),
    #[error("failed to parse DTCG JSON: {0}")]
    Json(#[from] serde_json::Error),
    #[error("governance violation: {0}")]
    Governance(String),
    #[error("telemetry error: {0}")]
    Telemetry(String),
}

pub fn run(config: RunConfig) -> Result<RunSummary, OrchestratorError> {
    let telemetry_handle = if config.enable_telemetry {
        Some(telemetry::init(telemetry::TelemetryConfig {
            service_name: "mimic-token-orchestrator".to_string(),
            airgap: config.airgap,
        })?)
    } else {
        None
    };

    let tokens = ingest::load_tokens(&config.input)?;
    governance::validate(&tokens)?;

    let outputs = if config.validate_only {
        None
    } else {
        Some(emit::emit_outputs(&tokens, &config.output_dir)?)
    };

    if let Some(handle) = &telemetry_handle {
        handle.force_flush();
    }

    Ok(RunSummary {
        token_count: tokens.len(),
        outputs,
    })
}
