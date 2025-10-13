use std::fmt::Write as _;

use tracing::{error, info, instrument};

use crate::{ingest::Token, OrchestratorError};

#[instrument(name = "governance.contract", skip(tokens), fields(token_count = tokens.len()))]
pub fn validate(tokens: &[Token]) -> Result<(), OrchestratorError> {
    let mut violations = Vec::new();

    for token in tokens {
        if token.token_type.trim().is_empty() || token.token_type == "unknown" {
            violations.push(format!("{} has no recognised $type", token.path.join(".")));
        }

        if token.path.iter().any(|segment| segment.trim().is_empty()) {
            violations.push(format!(
                "{} contains an empty path segment",
                token.path.join(".")
            ));
        }

        if token.value.is_null() {
            violations.push(format!("{} has a null $value", token.path.join(".")));
        }
    }

    if violations.is_empty() {
        info!("all tokens passed governance checks");
        Ok(())
    } else {
        let mut message = String::new();
        for violation in &violations {
            let _ = writeln!(&mut message, "- {violation}");
        }
        error!(count = violations.len(), "governance violations detected");
        Err(OrchestratorError::Governance(message))
    }
}
