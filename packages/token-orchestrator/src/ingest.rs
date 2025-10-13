use std::collections::HashMap;
use std::fs::File;
use std::io::BufReader;
use std::path::Path;

use serde::Deserialize;
use serde_json::Value;
use tracing::instrument;

use crate::OrchestratorError;

#[derive(Debug, Clone)]
pub struct Token {
    pub path: Vec<String>,
    pub token_type: String,
    pub value: serde_json::Value,
    pub description: Option<String>,
}

#[derive(Debug, Deserialize)]
struct PenpotExport {
    #[serde(default)]
    collections: HashMap<String, RawGroup>,
}

type RawGroup = HashMap<String, RawEntry>;

#[derive(Debug, Deserialize)]
#[serde(untagged)]
enum RawEntry {
    Token(RawToken),
    Group(HashMap<String, RawEntry>),
}

#[derive(Debug, Deserialize)]
struct RawToken {
    #[serde(rename = "$type")]
    token_type: Option<String>,
    #[serde(rename = "$value")]
    value: serde_json::Value,
    #[serde(rename = "$description")]
    description: Option<String>,
}

#[instrument(name = "ingest.penpot", skip(path), fields(path = %path.display()))]
pub fn load_tokens(path: &Path) -> Result<Vec<Token>, OrchestratorError> {
    let file = File::open(path)?;
    let reader = BufReader::new(file);
    let value: Value = serde_json::from_reader(reader)?;
    load_tokens_from_value(value)
}

pub fn load_tokens_from_value(value: Value) -> Result<Vec<Token>, OrchestratorError> {
    let export: PenpotExport = serde_json::from_value(value)?;

    let mut tokens = Vec::new();
    for (collection, group) in export.collections {
        flatten_tokens(vec![collection], &group, &mut tokens);
    }

    Ok(tokens)
}

fn flatten_tokens(prefix: Vec<String>, group: &RawGroup, tokens: &mut Vec<Token>) {
    for (key, entry) in group {
        let mut path = prefix.clone();
        path.push(key.clone());
        match entry {
            RawEntry::Token(token) => {
                tokens.push(Token {
                    path,
                    token_type: token
                        .token_type
                        .clone()
                        .unwrap_or_else(|| "unknown".to_string()),
                    value: token.value.clone(),
                    description: token.description.clone(),
                });
            }
            RawEntry::Group(inner) => {
                flatten_tokens(path, inner, tokens);
            }
        }
    }
}
