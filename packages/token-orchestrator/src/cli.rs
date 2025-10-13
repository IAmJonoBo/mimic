use std::path::PathBuf;

use clap::{ArgAction, Parser};
use tracing::{info, warn};

use crate::{run, OrchestratorError, RunConfig};

#[derive(Debug, Parser)]
#[command(
    name = "mimic-token-orchestrator",
    about = "Normalize Penpot DTCG exports and generate downstream token outputs"
)]
pub struct CliArgs {
    /// Path to the Penpot DTCG JSON export (defaults to ./tokens.json)
    #[arg(long, short = 'i', default_value = "tokens.json")]
    pub input: PathBuf,

    /// Directory that will receive generated outputs
    #[arg(long = "out", short = 'o', default_value = "packages/tokens-outputs")]
    pub output: PathBuf,

    /// Validate the export without emitting files
    #[arg(long = "validate-only", action = ArgAction::SetTrue)]
    pub validate_only: bool,

    /// Disable telemetry instrumentation even if the feature is enabled
    #[arg(long = "no-telemetry", action = ArgAction::SetTrue)]
    pub no_telemetry: bool,

    /// Force air-gapped execution (overrides the compile-time feature default)
    #[arg(long = "airgap", action = ArgAction::SetTrue, default_value_t = cfg!(feature = "airgap"))]
    pub airgap: bool,
}

pub fn run_cli() -> Result<(), OrchestratorError> {
    let args = CliArgs::parse();
    let summary = run(RunConfig {
        input: args.input,
        output_dir: args.output,
        validate_only: args.validate_only,
        enable_telemetry: !args.no_telemetry,
        airgap: args.airgap,
    })?;

    info!(
        tokens = summary.token_count,
        emitted = summary.outputs.is_some(),
        "token orchestration completed"
    );

    if summary.outputs.is_none() {
        warn!("validation completed without emitting outputs");
    }

    Ok(())
}
