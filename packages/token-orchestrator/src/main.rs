use std::process;

fn main() {
    if let Err(error) = mimic_token_orchestrator::cli::run_cli() {
        eprintln!("❌ token orchestration failed: {error}");
        process::exit(1);
    }
}
