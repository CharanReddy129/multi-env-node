APP_Name="multi-${{ github.event.inputs.branch }}"

if ! argocd app get $APP_NAME &>/dev/null; then
  echo "Application not found. Creating..."
  argocd app create -f argocd/argocd-${{ github.event.inputs.branch }}.yml
fi

# Sync the application
argocd app sync $APP_NAME --prune --retry