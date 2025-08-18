# Development
helm install myapp-dev ./mychart -f values-dev.yaml -n dev --create-namespace

# Staging
helm install myapp-stage ./mychart -f values-stage.yaml -n stage --create-namespace

# Production
helm install myapp-prod ./mychart -f values-prod.yaml -n prod --create-namespace
