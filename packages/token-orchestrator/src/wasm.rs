#![cfg(target_arch = "wasm32")]

use wasm_bindgen::prelude::*;

use crate::{emit, governance, ingest};

#[wasm_bindgen]
pub fn orchestrate_to_json(json: &str) -> Result<JsValue, JsValue> {
    let value: serde_json::Value = serde_json::from_str(json).map_err(|err| err.to_string())?;
    let tokens = ingest::load_tokens_from_value(value).map_err(|err| err.to_string())?;
    governance::validate(&tokens).map_err(|err| err.to_string())?;
    let artifacts = emit::build_artifacts(&tokens);
    JsValue::from_serde(&artifacts).map_err(|err| err.to_string().into())
}
