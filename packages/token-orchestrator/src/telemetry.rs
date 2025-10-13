#[derive(Debug, Clone)]
pub struct TelemetryConfig {
    pub service_name: String,
    pub airgap: bool,
}

#[cfg(feature = "telemetry")]
mod enabled {
    use std::sync::{Arc, Mutex};

    use opentelemetry::global::handle_error;
    use opentelemetry::trace::{TraceError, TracerProvider as _};
    use opentelemetry_sdk::export::trace::{ExportResult, SpanData, SpanExporter};
    use opentelemetry_sdk::trace::{self, TracerProvider};
    use tracing::{info, subscriber::DefaultGuard};
    use tracing_subscriber::layer::SubscriberExt;

    use super::TelemetryConfig;

    #[derive(Debug)]
    pub struct TelemetryGuard {
        _guard: DefaultGuard,
        provider: TracerProvider,
        storage: Arc<Mutex<Vec<SpanSnapshot>>>,
    }

    #[derive(Clone, Debug)]
    pub struct SpanSnapshot {
        pub name: String,
        pub attributes: Vec<(String, String)>,
    }

    #[derive(Debug)]
    struct MemoryExporter {
        spans: Arc<Mutex<Vec<SpanSnapshot>>>,
    }

    impl Default for MemoryExporter {
        fn default() -> Self {
            Self {
                spans: Arc::new(Mutex::new(Vec::new())),
            }
        }
    }

    impl SpanExporter for MemoryExporter {
        fn export(
            &mut self,
            batch: Vec<SpanData>,
        ) -> std::pin::Pin<Box<dyn std::future::Future<Output = ExportResult> + Send + 'static>>
        {
            let spans = Arc::clone(&self.spans);
            Box::pin(async move {
                let mut guard = spans.lock().map_err(TraceError::from)?;
                guard.extend(batch.into_iter().map(SpanSnapshot::from));
                Ok(())
            })
        }

        fn shutdown(&mut self) {}
    }

    impl From<SpanData> for SpanSnapshot {
        fn from(span: SpanData) -> Self {
            let attributes = span
                .attributes
                .into_iter()
                .map(|kv| (kv.key.to_string(), kv.value.to_string()))
                .collect();
            Self {
                name: span.name.into_owned(),
                attributes,
            }
        }
    }

    impl TelemetryGuard {
        pub fn force_flush(&self) {
            for result in self.provider.force_flush() {
                if let Err(err) = result {
                    handle_error(err);
                }
            }
        }

        pub fn spans(&self) -> Vec<SpanSnapshot> {
            self.storage
                .lock()
                .map(|spans| spans.clone())
                .unwrap_or_default()
        }
    }

    pub fn init(config: TelemetryConfig) -> Result<TelemetryGuard, crate::OrchestratorError> {
        let exporter = MemoryExporter::default();
        let storage = exporter.spans.clone();

        let provider = trace::TracerProvider::builder()
            .with_simple_exporter(exporter)
            .build();

        let tracer = provider.tracer(config.service_name.clone());
        let fmt_layer = tracing_subscriber::fmt::layer()
            .with_target(false)
            .with_ansi(false);
        let otel_layer = tracing_opentelemetry::layer().with_tracer(tracer);
        let subscriber = tracing_subscriber::registry()
            .with(fmt_layer)
            .with(otel_layer);
        let guard = tracing::subscriber::set_default(subscriber);

        let guard = TelemetryGuard {
            _guard: guard,
            provider,
            storage,
        };

        if config.airgap {
            info!(target: "mimic::telemetry", "telemetry initialised (airgap)");
        } else {
            info!(target: "mimic::telemetry", "telemetry initialised");
        }

        Ok(guard)
    }

    pub fn init_test_tracer(
        service_name: &str,
    ) -> Result<TelemetryGuard, crate::OrchestratorError> {
        init(TelemetryConfig {
            service_name: service_name.to_string(),
            airgap: true,
        })
    }
}

#[cfg(not(feature = "telemetry"))]
mod disabled {
    use super::TelemetryConfig;

    #[derive(Default, Debug, Clone)]
    pub struct TelemetryGuard;

    #[derive(Clone, Debug, Default)]
    pub struct SpanSnapshot {
        pub name: String,
        pub attributes: Vec<(String, String)>,
    }

    pub fn init(_config: TelemetryConfig) -> Result<TelemetryGuard, crate::OrchestratorError> {
        Ok(TelemetryGuard)
    }

    pub fn init_test_tracer(
        _service_name: &str,
    ) -> Result<TelemetryGuard, crate::OrchestratorError> {
        Ok(TelemetryGuard)
    }

    impl TelemetryGuard {
        pub fn force_flush(&self) {}
        pub fn spans(&self) -> Vec<SpanSnapshot> {
            Vec::new()
        }
    }
}

#[cfg(feature = "telemetry")]
pub use enabled::{init, init_test_tracer, SpanSnapshot, TelemetryGuard};

#[cfg(not(feature = "telemetry"))]
pub use disabled::{init, init_test_tracer, SpanSnapshot, TelemetryGuard};
