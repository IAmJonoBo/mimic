use std::fs;
use std::path::PathBuf;

use mimic_token_orchestrator::{telemetry, RunConfig};

fn fixture_path(name: &str) -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("tests")
        .join("fixtures")
        .join(name)
}

fn outputs_dir() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("..")
        .join("tokens-outputs")
        .join("integration-test")
}

#[test]
fn orchestrator_generates_outputs_and_spans() {
    let input = fixture_path("penpot_export.json");
    let output_dir = outputs_dir();
    if output_dir.exists() {
        fs::remove_dir_all(&output_dir).expect("failed to clean test output directory");
    }

    let telemetry_handle = telemetry::init_test_tracer("token-orchestrator-tests")
        .expect("failed to initialise telemetry for tests");

    let summary = mimic_token_orchestrator::run(RunConfig {
        input,
        output_dir: output_dir.clone(),
        validate_only: false,
        enable_telemetry: false,
        airgap: false,
    })
    .expect("orchestrator run should succeed");

    assert_eq!(summary.token_count, 4);

    let css = output_dir.join("css/tokens.css");
    let ts = output_dir.join("ts/tokens.ts");
    let compose = output_dir.join("compose/Tokens.kt");
    let dart = output_dir.join("dart/tokens.dart");

    for path in [&css, &ts, &compose, &dart] {
        assert!(path.exists(), "expected output {:?} to exist", path);
    }

    let css_content = fs::read_to_string(&css).expect("read css");
    assert!(css_content.contains("--core-color-brand: #3366FF;"));
    assert!(css_content.contains("--core-size-spacing-md: 16;"));

    let ts_content = fs::read_to_string(&ts).expect("read ts");
    assert!(ts_content.contains("export const tokens"));
    assert!(ts_content.contains("\"core.color.accent\": \"#FF6F61\""));

    let compose_content = fs::read_to_string(&compose).expect("read compose");
    assert!(compose_content.contains("object Tokens"));
    assert!(compose_content.contains("val CoreColorBrand"));

    let dart_content = fs::read_to_string(&dart).expect("read dart");
    assert!(dart_content.contains("class Tokens"));
    assert!(dart_content.contains("static const coreColorBrand"));

    telemetry_handle.force_flush();
    let spans = telemetry_handle.spans();
    let span_names: Vec<_> = spans.iter().map(|span| span.name.as_str()).collect();
    assert!(span_names.contains(&"ingest.penpot"));
    assert!(span_names.contains(&"governance.contract"));
    assert!(span_names.contains(&"emit.outputs"));

    fs::remove_dir_all(&output_dir).expect("cleanup outputs");
}
